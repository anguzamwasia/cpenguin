document.getElementById('saveDetailsButton').addEventListener('click', saveDetails);
document.getElementById('addRowButton').addEventListener('click', addRow);
document.getElementById('calculateButton').addEventListener('click', calculate);
document.getElementById('saveToCSVButton').addEventListener('click', saveToCSV);

function saveDetails() {
    const projectName = document.getElementById('projectName').value;
    const date = document.getElementById('date').value;
    alert(`Project Name: ${projectName}\nDate: ${date}`);
}

function addRow() {
    const table = document.getElementById('levelingTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    
    for (let i = 0; i < 9; i++) {
        const newCell = newRow.insertCell(i);
        const input = document.createElement('input');
        input.type = 'text';
        newCell.appendChild(input);
    }
}

function calculate() {
    const table = document.getElementById('levelingTable').getElementsByTagName('tbody')[0];
    let previousRL = 0;
    let sumBS = 0;
    let sumFS = 0;
    let totalRise = 0;
    let totalFall = 0;
    let initialRL = 0;
    let finalRL = 0;
    let countBS = 0;
    let countFS = 0;

    for (let i = 0; i < table.rows.length; i++) {
        const row = table.rows[i];
        const bs = parseFloat(row.cells[1].getElementsByTagName('input')[0].value) || 0;
        const is = parseFloat(row.cells[2].getElementsByTagName('input')[0].value) || 0;
        const fs = parseFloat(row.cells[3].getElementsByTagName('input')[0].value) || 0;

        if (bs !== 0) countBS++;
        if (fs !== 0) countFS++;

        sumBS += bs;
        sumFS += fs;

        let rise = 0, fall = 0, rl = 0;

        if (i === 0) {
            previousRL = parseFloat(row.cells[6].getElementsByTagName('input')[0].value) || 0; // First row's RL is provided
            rl = previousRL;
            initialRL = previousRL;
        } else {
            const previousBS = parseFloat(table.rows[i-1].cells[1].getElementsByTagName('input')[0].value) || 0;
            const previousIS = parseFloat(table.rows[i-1].cells[2].getElementsByTagName('input')[0].value) || 0;
            const riseFall = previousBS + previousIS - is - fs;
            if (riseFall > 0) {
                rise = riseFall;
                fall = 0;
            } else {
                rise = 0;
                fall = -riseFall;
            }
            rl = previousRL + rise - fall;
        }

        totalRise += rise;
        totalFall += fall;

        row.cells[4].textContent = rise.toFixed(3);
        row.cells[5].textContent = fall.toFixed(3);
        row.cells[6].textContent = rl.toFixed(3);

        previousRL = rl;
    }

    finalRL = previousRL;

    // Verify the checkpoint conditions
    const checkpoint1 = (sumBS - sumFS).toFixed(3) === (totalRise - totalFall).toFixed(3);
    const checkpoint2 = (totalRise - totalFall).toFixed(3) === (finalRL - initialRL).toFixed(3);
    const checkpoint3 = `Total B.S entries: ${countBS}`;
    const checkpoint4 = `Total F.S entries: ${countFS}`;

    // Display the checkpoint results
    const checkpointResults = `
        <p>Total Backsights (B.S.): ${sumBS.toFixed(3)}</p>
        <p>Total Foresights (F.S.): ${sumFS.toFixed(3)}</p>
        <p>Sum of Rise: ${totalRise.toFixed(3)}</p>
        <p>Sum of Fall: ${totalFall.toFixed(3)}</p>
        <p>Checkpoint 1 (B.S - F.S = Rise - Fall): ${checkpoint1}</p>
        <p>Checkpoint 2 (Rise - Fall = Final RL - Initial RL): ${checkpoint2}</p>
        <p>Checkpoint 3 (Total B.S entries): ${countBS}</p>
        <p>Checkpoint 4 (Total F.S entries): ${countFS}</p>
    `;
    document.getElementById('checkpointResults').innerHTML = checkpointResults;
}

function saveToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    const rows = document.querySelectorAll("table tr");
    
    rows.forEach(row => {
        const cols = row.querySelectorAll("td, th");
        const rowData = Array.from(cols).map(col => col.innerText || col.querySelector('input')?.value || '').join(",");
        csvContent += rowData + "\r\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leveling_data.csv");
    document.body.appendChild(link);
    link.click();
}
