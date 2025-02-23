// export const generateHTML = (scanData: any, aiAnalysis: string) => {
//     return `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <title>Security Scan Analysis Report</title>
//     <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
//     <style>
//         body { font-family: Arial, sans-serif; max-width: 1200px; margin: auto; padding: 20px; background-color: #f9f9f9; }
//         h1, h2 { color: #2c3e50; }
//         .card { background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); padding: 20px; margin-bottom: 20px; }
//         .status-codes { display: flex; flex-wrap: wrap; gap: 10px; }
//         .status-code { background: #e0e7ff; padding: 10px; border-radius: 4px; flex: 1 1 calc(25% - 20px); box-sizing: border-box; }
//         .recommendations { background: #e3f2fd; padding: 20px; border-radius: 8px; }
//     </style>
// </head>
// <body>
//     <h1>Security Scan Analysis Report</h1>
//     <div class="card">
//         <h2>Scan Summary</h2>
//         <p><strong>Total Requests:</strong> ${scanData.totalRequests}</p>
//         <div class="status-codes">
//             ${Object.entries(scanData.statusCodes).map(([code, count]) => `<div class="status-code"><strong>${code}:</strong> ${count}</div>`).join('')}
//         </div>
//     </div>
//     <div class="card">
//         <h2>Key Findings</h2>
//         ${aiAnalysis || '<p>No key findings available.</p>'}
//     </div>
//     <div class="recommendations">
//         <h2>Recommendations</h2>
//         <p>Implement authentication mechanisms, regularly patch systems, and restrict sensitive endpoint access.</p>
//     </div>
// </body>
// </html>`;
// };



export const generateHTML = (scanData: any, aiAnalysis: string) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Security Scan Analysis Report</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: auto; padding: 20px; background-color: #f9f9f9; }
        h1, h2 { color: #2c3e50; }
        .card { background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); padding: 20px; margin-bottom: 20px; }
        .status-codes { display: flex; flex-wrap: wrap; gap: 10px; }
        .status-code { background: #e0e7ff; padding: 10px; border-radius: 4px; flex: 1 1 calc(25% - 20px); box-sizing: border-box; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f8f9fa; color: #2c3e50; }
        .high-risk { background-color: #ffcccc; }
        .medium-risk { background-color: #ffecb3; }
        .low-risk { background-color: #d9f7be; }
        .collapsible { cursor: pointer; padding: 10px; background: #eee; border: none; width: 100%; font-size: 16px; }
        .content { display: none; padding: 10px; border-left: 2px solid #ccc; }
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
        <canvas id="statusChart"></canvas>
    </div>

    <div class="card">
        <h2>Key Findings</h2>
        ${aiAnalysis || '<p>No key findings available.</p>'}
    </div>

    <div class="card">
        <h2>Detailed Findings</h2>
        <button class="collapsible">Show Findings</button>
        <div class="content">
            <table>
                <thead>
                    <tr>
                        <th>Finding Type</th>
                        <th>Risk Level</th>
                        <th>Affected URL</th>
                        <th>Evidence</th>
                        <th>Recommendation</th>
                    </tr>
                </thead>
                <tbody>
                    ${scanData.findings.map((finding: any) => {
                        let riskClass = "low-risk";
                        let riskLevel = "Low";
                        if (finding.status === 403) { riskClass = "medium-risk"; riskLevel = "Medium"; }
                        if (finding.status === 200 && finding.url.includes("admin")) { riskClass = "high-risk"; riskLevel = "High"; }
                        return `
                            <tr class="${riskClass}">
                                <td>Exposed Endpoint</td>
                                <td>${riskLevel}</td>
                                <td>${finding.url}</td>
                                <td>${finding.contentLength}</td>
                                <td>Restrict access, implement authentication</td>
                            </tr>`;
                    }).join("")}
                </tbody>
            </table>
        </div>
    </div>

    // <div class="card recommendations">
    //     <h2>Recommendations</h2>
    //     <p>Implement authentication mechanisms, regularly patch systems, and restrict sensitive endpoint access.</p>
    // </div>

    <script>
        // Status Code Chart
        const ctx = document.getElementById('statusChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ${JSON.stringify(Object.keys(scanData.statusCodes))},
                datasets: [{
                    label: 'Status Codes',
                    data: ${JSON.stringify(Object.values(scanData.statusCodes))},
                    backgroundColor: ['green', 'blue', 'orange', 'red']
                }]
            }
        });

        // Collapsible Section
        document.querySelector(".collapsible").addEventListener("click", function() {
            this.classList.toggle("active");
            const content = this.nextElementSibling;
            content.style.display = content.style.display === "block" ? "none" : "block";
        });
    </script>
</body>
</html>`;
};
