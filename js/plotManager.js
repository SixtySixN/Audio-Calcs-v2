let chart;

function updatePlot(points) {
    const ctx = document.getElementById('curvePlot').getContext('2d');
    const tolerance = parseFloat(document.getElementById('tolerance').value);

    if (chart) {
        chart.destroy();
    }

    const sortedPoints = points.sort((a, b) => a.frequency - b.frequency);
    const frequencies = sortedPoints.map(p => p.frequency);
    const magnitudes = sortedPoints.map(p => p.magnitude);

    // Create upper and lower tolerance curves
    const upperTolerance = magnitudes.map(m => m + tolerance);
    const lowerTolerance = magnitudes.map(m => m - tolerance);

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: frequencies,
            datasets: [
                {
                    label: 'Target Curve',
                    data: magnitudes,
                    borderColor: document.getElementById('curveColor').value,
                    borderWidth: parseInt(document.getElementById('lineWidth').value),
                    fill: false
                },
                {
                    label: 'Upper Tolerance',
                    data: upperTolerance,
                    borderColor: 'rgba(0, 255, 0, 0.5)',
                    borderWidth: 1,
                    fill: false,
                    borderDash: [5, 5] 
                },
                {
                    label: 'Lower Tolerance',
                    data: lowerTolerance,
                    borderColor: 'rgba(0, 255, 0, 0.5)',
                    borderWidth: 1,
                    fill: false,
                    borderDash: [5, 5] 
                }
            ]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'logarithmic',
                    min: 20,
                    max: 20000,
                    grid: {
                        color: '#333'
                    },
                    ticks: {
                        color: '#fff'
                    }
                },
                y: {
                    min: -18,  // Set minimum value
                    max: 18,   // Set maximum value
                    grid: {
                        color: '#333'
                    },
                    ticks: {
                        color: '#fff'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#fff'
                    }
                }
            }
        }
    });
}
function updateScales() {
    chart.options.scales.x.min = parseFloat(document.getElementById('xMin').value);
    chart.options.scales.x.max = parseFloat(document.getElementById('xMax').value);
    chart.options.scales.y.min = parseFloat(document.getElementById('yMin').value);
    chart.options.scales.y.max = parseFloat(document.getElementById('yMax').value);
    
    chart.update();  // Refresh the chart to apply changes
}
function resetScales() {
    document.getElementById('xMin').value = 10;
    document.getElementById('xMax').value = 25000;
    document.getElementById('yMin').value = -18;
    document.getElementById('yMax').value = 18;

    updateScales();  // Apply changes to the chart
}
