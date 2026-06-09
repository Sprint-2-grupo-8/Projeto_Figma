const percentual_label = [
    'Faixa ideal',
    'Faixa intermediária',
    'Faixa crítica'
];

const estufas_label = [
    'Estufa 1',
    'Estufa 2',
    'Estufa 3',
    'Estufa 4'
];

const scatter_data = {
    labels: [],
    datasets: [{
        label: [],
        backgroundColor: '#10b981',
        pointRadius: 6,
        data: [],
    }]
};

const scatter_config = {
    type: 'scatter',
    data: scatter_data,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                min: 0,
                max: 1800,
                beginAtZero: false
            },
            x: {
                type: 'category',
                beginAtZero: false
            }
        },
        plugins: {
            annotation: {
                annotations: {
                    faixa_ideal: {
                        type: 'box',
                        yMin: 600,
                        yMax: 900,
                        backgroundColor: 'rgba(0, 255, 0, 0.1)',
                        label: {
                            display: true,
                            content: 'Faixa ideal',
                            position: 'center',
                            color: 'black'
                        }
                    },
                    faixa_ok: {
                        type: 'box',
                        yMin: 400,
                        yMax: 1100,
                        backgroundColor: 'rgba(255, 205, 86, 0.15)',
                        label: {
                            display: true,
                            content: 'Faixa intermediária',
                            position: 'start',
                            color: 'black'
                        }
                    }
                }
            }
        }
    }
};

const line_data = {
    labels: [],
    datasets: [{
        label: [],
        backgroundColor: 'blue',
        borderColor: 'blue',
        data: [],
    }
    ]
};

const line_config = {
    type: 'line',
    data: line_data,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                beginAtZero: false
            },
            y: {
                min: 0,
                max: 1800,
                beginAtZero: false
            }
        },
        plugins: {
            annotation: {
                annotations: {
                    faixa_ideal: {
                        type: 'box',
                        yMin: 600,
                        yMax: 900,
                        backgroundColor: 'rgba(0, 255, 0, 0.1)',
                        label: {
                            display: true,
                            content: 'Faixa ideal',
                            position: 'center',
                            color: 'black'
                        }
                    },
                    faixa_ok: {
                        type: 'box',
                        yMin: 400,
                        yMax: 1100,
                        backgroundColor: 'rgba(255, 205, 86, 0.15)',
                        label: {
                            display: true,
                            content: 'Faixa intermediária',
                            position: 'start',
                            color: 'black'
                        }
                    }
                }
            }
        }
    }
};

const doughnut_data = {
    labels: percentual_label,
    datasets: [{
        label: 'Percentual ',
        data: [],
        backgroundColor: ['rgb(54, 162, 235)', 'rgb(255, 255, 0)', 'rgb(255, 99, 132)'],
        borderColor: ['rgb(54, 162, 235)', 'rgb(255, 255, 0)', 'rgb(255, 99, 132)'],
    }]
};

const doughnut_config = {
    type: 'doughnut',
    data: doughnut_data,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            datalabels: {
                color: '#121212',
                font: {
                    weight: 'bold',
                    size: 14
                },
                formatter: (value, context) => {
                    const dados = context.chart.data.datasets[0].data;
                    const total = dados.reduce((acc, val) => acc + val, 0);
                    const porcentagem = (value / total * 100).toFixed(1);
                    return porcentagem + '%';
                }
            }
        }
    },
    plugins: [ChartDataLabels]
};

const bar_data = {
    labels: estufas_label,
    datasets: [{
        label: 'Alertas registrados',
        backgroundColor: 'rgb(54, 162, 235)',
        data: [55, 20, 13, 2],
    }]
};

const bar_config = {
    type: 'bar',
    data: bar_data,
    options: {
        responsive: true,
        indexAxis: 'y',
        maintainAspectRatio: false,
        scales: {
            x: {
                min: 0,
                max: 100,
                beginAtZero: true
            },
            y: {
                reverse: false
            }
        }
    }

};

const percentual_registros = new Chart(
    document.getElementById('percentual_registros'),
    doughnut_config
);

const ranking_estufas = new Chart(
    document.getElementById('grafico_ranking'),
    bar_config
);