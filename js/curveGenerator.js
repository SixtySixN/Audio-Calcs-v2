let currentCurvePoints = [];

function previewCurve() {
    const points = document.getElementsByClassName('point-row');
    currentCurvePoints = [];
    
    Array.from(points).forEach(point => {
        const freq = parseFloat(point.querySelector('.freq').value);
        const mag = parseFloat(point.querySelector('.mag').value);
        if (!isNaN(freq) && !isNaN(mag)) {
            currentCurvePoints.push({ frequency: freq, magnitude: mag });
        }
    });

    updatePlot(currentCurvePoints);
    document.getElementById('saveButton').style.display = 'inline-block';
}

function saveCurve() {
    const generator = new CurveGenerator();
    generator.points = currentCurvePoints;
    generator.downloadCurve();
}
class CurveGenerator {
    constructor() {
        this.points = [];
    }

    generateCurveFile() {
        const fileName = document.getElementById('fileName').value || 'target_curve';
        const lineWidth = document.getElementById('lineWidth').value;
        const color = document.getElementById('curveColor').value.substring(1); // Remove #
        const showCurve = document.getElementById('showCurve').value;
        const curveType = document.getElementById('curveType').value;
        const tolerance = document.getElementById('tolerance').value;

        let fileContent = `Line:\t${lineWidth}\n`;
        fileContent += `Color:\t${color}\n`;
        fileContent += `Show:\t${showCurve}\n`;
        fileContent += `Type:\t${curveType}\n`;
        fileContent += `Tolerance:\t${tolerance}\n`;
        fileContent += `UseTolerance:\t1\n\n`;

        // Sort points by frequency
        this.points.sort((a, b) => a.frequency - b.frequency);

        // Add points
        this.points.forEach(point => {
            fileContent += `${point.frequency.toFixed(6)}\t${point.magnitude.toFixed(6)}\n`;
        });

        return {
            content: fileContent,
            filename: `${fileName}.crv`
        };
    }

    downloadCurve() {
        const { content, filename } = this.generateCurveFile();
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}

function addPoint() {
    const container = document.getElementById('frequencyPoints');
    const newRow = document.createElement('div');
    newRow.className = 'point-row';
    newRow.innerHTML = `
        <input type="number" placeholder="Frequency" class="freq">
        <input type="number" placeholder="Magnitude" class="mag">
        <select class="scale">
            <option value="log">Logarithmic</option>
            <option value="linear">Linear</option>
        </select>
        <button onclick="removePoint(this)">×</button>
    `;
    container.appendChild(newRow);
    newRow.querySelector('.freq').focus();

}

function removePoint(button) {
    button.parentElement.remove();
}

function generateCurve() {
    const generator = new CurveGenerator();
    const points = document.getElementsByClassName('point-row');
    
    Array.from(points).forEach(point => {
        const freq = parseFloat(point.querySelector('.freq').value);
        const mag = parseFloat(point.querySelector('.mag').value);
        if (!isNaN(freq) && !isNaN(mag)) {
            generator.points.push({ frequency: freq, magnitude: mag });
        }
    });

    generator.downloadCurve();
    updatePlot(generator.points);
}

function loadCurveFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Extract filename without extension
    const fileName = file.name.split('.').slice(0, -1).join('.');

    // Update file name input field
    document.getElementById("fileName").value = fileName;

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        parseCurveFile(content);
    };
    reader.readAsText(file);
}


function parseCurveFile(content) {
    const lines = content.split("\n");
    currentCurvePoints = [];

    const container = document.getElementById('frequencyPoints');
    container.innerHTML = "<h3>Frequency Points</h3>"; // Clear existing entries

    lines.forEach(line => {
        const parts = line.split("\t");
        if (parts.length === 2) {
            const freq = parseFloat(parts[0]);
            const mag = parseFloat(parts[1]);
            if (!isNaN(freq) && !isNaN(mag)) {
                currentCurvePoints.push({ frequency: freq, magnitude: mag });

                // Create a row that matches the expected format
                const newRow = document.createElement("div");
                newRow.classList.add("point-row"); // Ensures consistency

                newRow.innerHTML = `
                    <input type="number" placeholder="Frequency" class="freq" value="${freq}">
                    <input type="number" placeholder="Magnitude" class="mag" value="${mag}">
                    <select class="scale">
                        <option value="log">Logarithmic</option>
                        <option value="linear">Linear</option>
                    </select>
                    <button onclick="removePoint(this)">×</button>
                `;

                container.appendChild(newRow);
            }
        }
    });

    updatePlot(currentCurvePoints);
}