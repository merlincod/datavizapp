document.getElementById('uploadButton').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert('Veuillez sélectionner un fichier !');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    // Afficher le texte de chargement
    document.getElementById('loading').classList.add('active');
    
    reader.onload = (event) => {
        const text = event.target.result;
        const data = parseCSV(text);
        renderChart(data);

        // Masquer le texte de chargement
        document.getElementById('loading').classList.remove('active');
    };
    
    reader.readAsText(file);
});

function parseCSV(text) {
    const rows = text.split('\n').filter(row => row.trim() !== '');
    const headers = rows[0].split(',').map(header => header.trim());
    const data = rows.slice(1).map(row => {
        const values = row.split(',').map(value => value.trim());
        let rowData = {};
        headers.forEach((header, index) => {
            rowData[header] = values[index];
        });
        return rowData;
    });
    return { headers, data };
}

function renderChart(data) {
    const labels = data.data.map(row => row.Date);
    const datasets = data.headers.slice(1).map((label, index) => {
        return {
            label: label,
            data: data.data.map(row => parseFloat(row[label] || 0)),
            borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
            backgroundColor: `hsla(${Math.random() * 360}, 70%, 70%, 0.3)`,
            borderWidth: 2,
            fill: true,
            tension: 0.1
        };
    });

    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            if (label) {
                                return label + ': ' + context.raw;
                            }
                            return context.raw;
                        }
                    }
                },
                datalabels: {
                    display: true,
                    align: 'top',
                    anchor: 'end',
                    color: 'black',
                    font: {
                        weight: 'bold'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10
                    },
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value;
                        }
                    },
                    title: {
                        display: true,
                        text: 'Valeur'
                    }
                }
            }
        }
    });
}
function showError(message) {
    alert(message);
}

