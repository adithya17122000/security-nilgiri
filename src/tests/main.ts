import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { execSync } from 'child_process';
import unzipper from 'unzipper';
import { getGPTResponse } from '../utils/AI';
import { systemPrompt, userPrompt } from '../utils/AIprompts';
import { generateHTML } from '../utils/generateReport';

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query: string): Promise<string> => {
    return new Promise((resolve) => rl.question(query, (answer) => resolve(answer.trim())));
};

async function downloadFeroxbuster() {
    console.log("Downloading Feroxbuster...");
    const url = "https://github.com/epi052/feroxbuster/releases/latest/download/x86_64-windows-feroxbuster.exe.zip";
    const response = await axios.get<ArrayBuffer>(url, { responseType: 'arraybuffer' });
    fs.writeFileSync("feroxbuster.zip", Buffer.from(response.data));
    console.log("Download complete!");
}

async function unzipFeroxbuster() {
    console.log("Unzipping Feroxbuster...");
    const extractPath = path.resolve('./feroxbuster');
    if (!fs.existsSync(extractPath)) fs.mkdirSync(extractPath, { recursive: true });

    return new Promise<void>((resolve, reject) => {
        fs.createReadStream("feroxbuster.zip")
            .pipe(unzipper.Extract({ path: extractPath }))
            .on('close', () => {
                console.log("Unzipping complete!");
                fs.unlinkSync("feroxbuster.zip"); // Clean up zip file after extraction
                resolve();
            })
            .on('error', (err) => {
                console.error("Error during extraction:", err);
                reject(err);
            });
    });
}

async function ensureFeroxbusterExists() {
    const exePath = path.resolve('./feroxbuster/feroxbuster.exe');
    if (!fs.existsSync(exePath)) {
        console.log("Feroxbuster not found. Downloading...");
        await downloadFeroxbuster();
        await unzipFeroxbuster();

        // Verify the extracted exe
        if (!fs.existsSync(exePath)) {
            throw new Error(`Feroxbuster executable not found after extraction at: ${exePath}`);
        }
    } else {
        console.log(`Feroxbuster already exists at ${exePath}`);
    }
}

async function ensureWordlistExists() {
    const wordlistPath = path.resolve('./common.txt');
    const wordlistUrl = "https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/Web-Content/common.txt";
    if (!fs.existsSync(wordlistPath)) {
        console.log("Downloading wordlist...");
        const response = await axios.get<string>(wordlistUrl, { responseType: 'text' });
        fs.writeFileSync(wordlistPath, response.data);
        console.log("Wordlist downloaded.");
    } else {
        console.log("Wordlist already exists at", wordlistPath);
    }
}

async function parseJsonFile(filePath: string) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const results = fileContent.split('\n').map(line => {
            try { return JSON.parse(line); } catch { return null; }
        }).filter(item => item);

        const summary = {
            totalRequests: results.length,
            statusCodes: {} as Record<string, number>,
            findings: results.map(result => ({
                url: result.url || result.target,
                status: result.status_code || result.status,
                contentLength: result.content_length || result.length,
                contentType: result.content_type || result.type
            }))
        };

        results.forEach(result => {
            const status = result.status_code || result.status;
            summary.statusCodes[status] = (summary.statusCodes[status] || 0) + 1;
        });

        return summary;
    } catch (error) {
        console.error('Failed to parse JSON:', error);
        return { totalRequests: 0, statusCodes: {}, findings: [] };
    }
}

async function runFeroxbuster(url: string, wordlistPath: string) {
    const exePath = path.resolve('./feroxbuster/feroxbuster.exe');
    const jsonReportPath = path.resolve('./feroxbuster_report.json');

    if (!fs.existsSync(exePath)) {
        throw new Error(`Feroxbuster executable not found at: ${exePath}`);
    }

    if (fs.existsSync(jsonReportPath)) fs.unlinkSync(jsonReportPath);

    const command = `"${exePath}" -u ${url} -w ${wordlistPath} --json -o "${jsonReportPath}"`;
    console.log(`Running Feroxbuster: ${command}`);
    execSync(command, { stdio: 'inherit' });

    if (!fs.existsSync(jsonReportPath)) {
        throw new Error('Feroxbuster did not generate the expected JSON report.');
    }
}

async function generateReports(apiKey: string, apiEndpoint: string) {
    const reportPath = path.resolve('./security_analysis.html');
    const scanData = await parseJsonFile('./feroxbuster_report.json');
    const analysis = await getGPTResponse(apiEndpoint, apiKey, systemPrompt, userPrompt(scanData));
    fs.writeFileSync(reportPath, generateHTML(scanData, analysis));
    console.log(`Report generated: ${reportPath}`);
}

(async () => {
    try {
        const apiKey = await question('Enter your OpenAI API key: ');
        const apiEndpoint = await question('Enter your OpenAI API endpoint: ');
        const url = await question('Enter the URL to scan: ');

        if (!apiKey || !apiEndpoint || !url.startsWith('http')) {
            throw new Error('Invalid input. Please provide valid API key, endpoint, and URL.');
        }

        await ensureFeroxbusterExists();
        await ensureWordlistExists();

        await runFeroxbuster(url, './common.txt');
        await generateReports(apiKey, apiEndpoint);
    } catch (error) {
        console.error('Error:', (error as Error).message);
    } finally {
        rl.close();
    }
})();
