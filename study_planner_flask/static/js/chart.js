// ===== CHART.JS EXTENSIONS FOR STUDY PLANNER =====

// Chart.js configuration and custom charts
class StudyPlannerCharts {
    constructor() {
        this.chartColors = {
            primary: '#2196F3',
            secondary: '#4CAF50',
            accent: '#FF9800',
            error: '#F44336',
            warning: '#FFC107',
            info: '#00BCD4',
            success: '#8BC34A',
            purple: '#9C27B0',
            teal: '#009688',
            indigo: '#3F51B5',
            pink: '#E91E63'
        };
        
        this.chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        font: {
                            family: 'Inter',
                            size: 12
                        },
                        usePointStyle: true,
                        padding: 20
                    }
                }
            }
        };
    }

    // Create subject progress chart
    createSubjectProgressChart(canvas, data) {
        const ctx = canvas.getContext('2d');
        
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.subjects,
                datasets: [{
                    label: 'Progress (%)',
                    data: data.progress,
                    backgroundColor: data.colors || this.generateColors(data.subjects.length),
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                ...this.chartOptions,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20,
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    ...this.chartOptions.plugins,
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Progress: ${context.parsed.y}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Create study time distribution chart
    createStudyTimeChart(canvas, data) {
        const ctx = canvas.getContext('2d');
        
        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.subjects,
                datasets: [{
                    data: data.hours,
                    backgroundColor: data.colors || this.generateColors(data.subjects.length),
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                ...this.chartOptions,
                plugins: {
                    ...this.chartOptions.plugins,
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed}h (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }

    // Create weekly study trend chart
    createWeeklyTrendChart(canvas, data) {
        const ctx = canvas.getContext('2d');
        
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.days,
                datasets: [{
                    label: 'Study Hours',
                    data: data.hours,
                    borderColor: this.chartColors.primary,
                    backgroundColor: this.hexToRgba(this.chartColors.primary, 0.1),
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: this.chartColors.primary,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                ...this.chartOptions,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: Math.max(...data.hours) + 2,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    ...this.chartOptions.plugins,
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Study Time: ${context.parsed.y}h`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Create task completion chart
    createTaskCompletionChart(canvas, data) {
        const ctx = canvas.getContext('2d');
        
        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'In Progress', 'Pending', 'Overdue'],
                datasets: [{
                    data: [
                        data.completed || 0,
                        data.inProgress || 0,
                        data.pending || 0,
                        data.overdue || 0
                    ],
                    backgroundColor: [
                        this.chartColors.success,
                        this.chartColors.info,
                        this.chartColors.warning,
                        this.chartColors.error
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                ...this.chartOptions,
                plugins: {
                    ...this.chartOptions.plugins,
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
                                return `${context.label}: ${context.parsed} (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '70%'
            }
        });
    }

    // Create exam timeline chart
    createExamTimelineChart(canvas, data) {
        const ctx = canvas.getContext('2d');
        
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.subjects,
                datasets: [{
                    label: 'Days Until Exam',
                    data: data.daysUntil,
                    backgroundColor: data.colors || this.generateColors(data.subjects.length),
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                ...this.chartOptions,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + ' days';
                            }
                        }
                    }
                },
                plugins: {
                    ...this.chartOptions.plugins,
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Days until exam: ${context.parsed.x}`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Create productivity heatmap
    createProductivityHeatmap(canvas, data) {
        const ctx = canvas.getContext('2d');
        
        // Create heatmap data
        const heatmapData = this.createHeatmapData(data);
        
        return new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Productivity Score',
                    data: heatmapData,
                    backgroundColor: function(context) {
                        const value = context.parsed.y;
                        if (value >= 8) return 'rgba(76, 175, 80, 0.8)'; // Green
                        if (value >= 6) return 'rgba(255, 193, 7, 0.8)'; // Yellow
                        if (value >= 4) return 'rgba(255, 152, 0, 0.8)'; // Orange
                        return 'rgba(244, 67, 54, 0.8)'; // Red
                    },
                    pointRadius: 8,
                    pointHoverRadius: 10
                }]
            },
            options: {
                ...this.chartOptions,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            displayFormats: {
                                day: 'MMM D'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 10,
                        title: {
                            display: true,
                            text: 'Productivity Score'
                        }
                    }
                },
                plugins: {
                    ...this.chartOptions.plugins,
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Productivity: ${context.parsed.y}/10`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Create study goal progress chart
    createGoalProgressChart(canvas, data) {
        const ctx = canvas.getContext('2d');
        
        return new Chart(ctx, {
            type: 'radialGauge',
            data: {
                datasets: [{
                    data: [data.current, data.goal - data.current],
                    backgroundColor: [
                        this.chartColors.primary,
                        this.chartColors.outline || '#e0e0e0'
                    ],
                    borderWidth: 0,
                    circumference: 180,
                    rotation: -90
                }]
            },
            options: {
                ...this.chartOptions,
                plugins: {
                    ...this.chartOptions.plugins,
                    tooltip: {
                        enabled: false
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: data.goal,
                        ticks: {
                            display: false
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Helper method to generate colors
    generateColors(count) {
        const colors = Object.values(this.chartColors);
        const result = [];
        
        for (let i = 0; i < count; i++) {
            result.push(colors[i % colors.length]);
        }
        
        return result;
    }

    // Helper method to convert hex to rgba
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Helper method to create heatmap data
    createHeatmapData(data) {
        const result = [];
        data.forEach(item => {
            result.push({
                x: new Date(item.date),
                y: item.productivity
            });
        });
        return result;
    }

    // Update chart data
    updateChartData(chart, newData) {
        chart.data.datasets[0].data = newData;
        chart.update('active');
    }

    // Animate chart
    animateChart(chart, duration = 1000) {
        chart.options.animation = {
            duration: duration,
            easing: 'easeInOutQuart'
        };
        chart.update();
    }

    // Export chart as image
    exportChartAsImage(chart, filename = 'chart.png') {
        const link = document.createElement('a');
        link.download = filename;
        link.href = chart.toBase64Image();
        link.click();
    }

    // Print chart
    printChart(chart) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Chart Print</title>
                    <style>
                        body { margin: 0; padding: 20px; }
                        img { max-width: 100%; height: auto; }
                    </style>
                </head>
                <body>
                    <img src="${chart.toBase64Image()}" alt="Chart" />
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
}

// Create global instance
window.StudyPlannerCharts = new StudyPlannerCharts();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StudyPlannerCharts;
}
