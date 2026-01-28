let charts = {};

// Actualizar gráficos
function updateCharts(data) {
    if (charts.status) charts.status.destroy();
    if (charts.organizations) charts.organizations.destroy();
    if (charts.analysts) charts.analysts.destroy();
    if (charts.timeline) charts.timeline.destroy();

    createStatusChart(data);
    createOrganizationsChart(data);
    createAnalystsChart(data);
    createTimelineChart(data);
}

// Gráfico de estados
function createStatusChart(data) {
    const ctx = document.getElementById('chart-status').getContext('2d');

    // Agrupar por estado
    const statusCount = data.reduce((acc, ticket) => {
        const status = ticket.Estatus || 'Sin Estado';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    const labels = Object.keys(statusCount);
    const values = Object.values(statusCount);

    // Colores morados para los estados
    const backgroundColors = [
        '#8a2be2', // Solucionado
        '#9370db', // Asignado
        '#ba55d3', // Escalado
        '#dda0dd', // Pendiente
        '#9400d3', // Otros
    ];

    charts.status = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: backgroundColors,
                borderColor: '#1a1a1a',
                borderWidth: 2,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#f0f0f0',
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#8a2be2',
                    borderWidth: 1
                }
            }
        }
    });

    // Actualizar leyenda
    updateStatusLegend(labels, backgroundColors, values);
}

function updateStatusLegend(labels, colors, values) {
    const legend = document.getElementById('status-legend');
    legend.innerHTML = '';

    labels.forEach((label, index) => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.innerHTML = `
            <span class="legend-color" style="background-color: ${colors[index]}"></span>
            ${label}: ${values[index]}
        `;
        legend.appendChild(item);
    });
}

// Gráfico de organizaciones (Top 5)
function createOrganizationsChart(data) {
    const ctx = document.getElementById('chart-organizations').getContext('2d');

    // Contar por organización
    const orgCount = data.reduce((acc, ticket) => {
        const org = ticket['Organización->Nombre'] || 'Sin Organización';
        acc[org] = (acc[org] || 0) + 1;
        return acc;
    }, {});

    // Ordenar y tomar top 5
    const sortedOrgs = Object.entries(orgCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const labels = sortedOrgs.map(item => item[0]);
    const values = sortedOrgs.map(item => item[1]);

    charts.organizations = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Tickets',
                data: values,
                backgroundColor: 'rgba(138, 43, 226, 0.7)',
                borderColor: 'rgba(138, 43, 226, 1)',
                borderWidth: 2,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#b0b0b0'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#b0b0b0',
                        maxRotation: 45
                    }
                }
            }
        }
    });
}

// Gráfico de analistas (Top 8)
function createAnalystsChart(data) {
    const ctx = document.getElementById('chart-analysts').getContext('2d');

    // Contar por analista
    const analystCount = data.reduce((acc, ticket) => {
        const analyst = ticket['Analista->Nombre común'] || 'Sin Analista';
        acc[analyst] = (acc[analyst] || 0) + 1;
        return acc;
    }, {});

    // Ordenar y tomar top 8
    const sortedAnalysts = Object.entries(analystCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);

    const labels = sortedAnalysts.map(item => item[0]);
    const values = sortedAnalysts.map(item => item[1]);

    // Colores gradiente morado
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(147, 112, 219, 0.8)');
    gradient.addColorStop(1, 'rgba(138, 43, 226, 0.4)');

    charts.analysts = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: labels,
            datasets: [{
                label: 'Tickets',
                data: values,
                backgroundColor: [
                    'rgba(138, 43, 226, 0.7)',
                    'rgba(147, 112, 219, 0.7)',
                    'rgba(186, 85, 211, 0.7)',
                    'rgba(221, 160, 221, 0.7)',
                    'rgba(148, 0, 211, 0.7)',
                    'rgba(153, 50, 204, 0.7)',
                    'rgba(128, 0, 128, 0.7)',
                    'rgba(102, 51, 153, 0.7)'
                ],
                borderColor: '#1a1a1a',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#b0b0b0',
                        font: {
                            size: 11
                        }
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        display: false
                    }
                }
            }
        }
    });
}

// Gráfico de línea temporal
function createTimelineChart(data) {
    const ctx = document.getElementById('chart-timeline').getContext('2d');

    // Agrupar por fecha
    const dateCount = data.reduce((acc, ticket) => {
        if (ticket['Fecha de Inicio']) {
            // Extraer solo la fecha (sin hora)
            const datePart = ticket['Fecha de Inicio'].split(' ')[0];
            acc[datePart] = (acc[datePart] || 0) + 1;
        }
        return acc;
    }, {});

    // Ordenar por fecha
    const sortedDates = Object.entries(dateCount)
        .sort(([dateA], [dateB]) => {
            // Convertir DD/MM/YYYY a YYYY-MM-DD para ordenar
            const convertDate = d => {
                const [day, month, year] = d.split('/');
                return `${year}-${month}-${day}`;
            };
            return convertDate(dateA).localeCompare(convertDate(dateB));
        })
        .slice(-15); // Últimos 15 días

    const labels = sortedDates.map(item => item[0]);
    const values = sortedDates.map(item => item[1]);

    // Crear gradiente para la línea
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(138, 43, 226, 0.8)');
    gradient.addColorStop(1, 'rgba(138, 43, 226, 0.1)');

    charts.timeline = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Tickets por día',
                data: values,
                backgroundColor: gradient,
                borderColor: '#8a2be2',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#8a2be2',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#b0b0b0'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#b0b0b0'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#b0b0b0',
                        maxRotation: 45
                    }
                }
            }
        }
    });
}