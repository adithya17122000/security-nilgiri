export const generateHTML = (scanData: any, aiAnalysis: string) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Security Scan Analysis Report</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: auto; padding: 20px; background-color: #f9f9f9; }
        h1, h2 { color: #2c3e50; }
        .card { background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); padding: 20px; margin-bottom: 20px; }
        .status-codes { display: flex; flex-wrap: wrap; gap: 10px; }
        .status-code { background: #e0e7ff; padding: 10px; border-radius: 4px; flex: 1 1 calc(25% - 20px); box-sizing: border-box; }
        .recommendations { background: #e3f2fd; padding: 20px; border-radius: 8px; }
    </style>
</head>
<body>
    <h1>Security Scan Analysis Report</h1>
    <div class="card">
        <h2>Scan Summary</h2>
        <p><strong>Total Requests:</strong> ${scanData.totalRequests}</p>
        <div class="status-codes">
            ${Object.entries(scanData.statusCodes).map(([code, count]) => `<div class="status-code"><strong>${code}:</strong> ${count}</div>`).join('')}
        </div>
    </div>
    <div class="card">
        <h2>Key Findings</h2>
        ${aiAnalysis || '<p>No key findings available.</p>'}
    </div>
    <div class="recommendations">
        <h2>Recommendations</h2>
        <p>Implement authentication mechanisms, regularly patch systems, and restrict sensitive endpoint access.</p>
    </div>
</body>
</html>`;
};