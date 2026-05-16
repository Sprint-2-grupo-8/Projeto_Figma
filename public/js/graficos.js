const periodo_label = [
    '00:00',
    '04:00',
    '08:00',
    '12:00',
    '16:00',
    '20:00'
];

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
    datasets: [{
        label: 'Concentração de CO₂ (ppm)',
        backgroundColor: '#10b981',
        pointRadius: 6,
        data: [
            { x: '00h', y: 550 },
            { x: '01h', y: 600 },
            { x: '02h', y: 800 },
            { x: '03h', y: 400 },
            { x: '04h', y: 500 },
            { x: '05h', y: 650 },
            { x: '06h', y: 700 },
            { x: '07h', y: 750 },
            { x: '08h', y: 820 },
            { x: '09h', y: 900 },
            { x: '10h', y: 1000 },
            { x: '11h', y: 950 },
            { x: '12h', y: 1100 },
            { x: '13h', y: 1050 },
            { x: '14h', y: 980 },
            { x: '15h', y: 920 },
            { x: '16h', y: 880 },
            { x: '17h', y: 860 },
            { x: '18h', y: 800 },
            { x: '19h', y: 780 },
            { x: '20h', y: 700 },
            { x: '21h', y: 680 },
            { x: '22h', y: 650 },
            { x: '23h', y: 620 }
        ]
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
                beginAtZero: true
            },
            x: {
                type: 'category'
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
    labels: periodo_label,
    datasets: [{
        label: 'Concentração média do intervalo',
        backgroundColor: 'blue',
        borderColor: 'blue',
        data: [550, 400, 500, 1000, 1200, 800],
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
            y: {
                min: 0,
                max: 1800,
                beginAtZero: true
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
        backgroundColor: ['rgb(54, 162, 235)', 'rgb(255, 255, 0)', 'rgb(255, 99, 132)'],
        borderColor: ['rgb(54, 162, 235)', 'rgb(255, 255, 0)', 'rgb(255, 99, 132)'],
        data: [70, 5, 25],
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
                color: '#000000',
                font: {
                    weight: 'bold',
                    size: 14
                },
                formatter: (value, context) => {
                    const data = context.chart.data.datasets[0].data;
                    const total = data.reduce((acc, val) => acc + val, 0);
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


const variacao_co2 = new Chart(
    document.getElementById('grafico_dispersao'),
    scatter_config
);
const indice_estufa_24h = new Chart(
    document.getElementById('indice_estufa_24h'),
    line_config
);
const percentual_registros = new Chart(
    document.getElementById('percentual_registros'),
    doughnut_config
);

const ranking_estufas = new Chart(
    document.getElementById('grafico_ranking'),
    bar_config
);