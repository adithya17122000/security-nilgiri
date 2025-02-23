<p align="center">
  <img src="https://raw.githubusercontent.com/triconinfotech/nilgiri/main/files/nilgiri.PNG" alt="Nilgiri Logo" width="200"/>
</p>
<h1 align="center">Nilgiri Framework</h1>
<p align="center">
    <!-- NPM badges -->
    <a href="https://www.npmjs.com/package/nilgirisecurity">
        <img src="https://img.shields.io/npm/v/nilgirisecurity.svg" alt="npm version">
    </a>
    <a href="https://www.npmjs.com/package/nilgirisecurity">
        <img src="https://img.shields.io/npm/dm/nilgirisecurity.svg" alt="npm downloads">
    </a>
</p>

<h2>nilgiri-security: A Core Component of the Nilgiri Framework</h2>

<p>
The <code>nilgiri-security</code> module leverages the power of Feroxbuster for web security scanning and integrates AI-driven insights for advanced analysis. It simplifies security testing by scanning target URLs for common vulnerabilities and generating detailed reports in both JSON and HTML formats. With AI-generated insights, it highlights critical findings such as unauthorized access points, helping teams strengthen their application security. Perfect for teams aiming to automate, analyze, and enhance their security testing workflows with ease.
</p>

<h2>Why Wordlist Matters?</h2>

<p>
The <strong>wordlist</strong> plays a crucial role in the scanning process by guiding Feroxbuster to search for common paths, files, and endpoints within a target URL. It acts as a dictionary of potential locations where vulnerabilities or sensitive information might exist. The <code>nilgiri-security</code> module uses the widely recognized wordlist from the <a href="https://github.com/danielmiessler/SecLists" target="_blank">SecLists repository</a> to ensure comprehensive coverage during scanning. By default, the module utilizes the following wordlist:
</p>

<pre><code>https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/Web-Content/common.txt</code></pre>

<p>
This wordlist increases the efficiency and accuracy of the scan, helping identify potential security gaps that might otherwise go unnoticed.
</p>

<h1 align="center">How to Setup?</h1>

<p>Before we proceed with the setup, let's see what are the prerequisites:</p>

<h3>Prerequisites</h3>
<ol>
  <li><strong>Node.js:</strong> Ensure you have <a href="https://nodejs.org/" target="_blank">Node.js</a> installed.</li>
  <li><strong>IDE:</strong> This project is written in TypeScript, so you'll need an IDE that supports Node.js, such as VS Code, IntelliJ, etc.</li>
  <li><strong>AI API Key and Endpoint:</strong> This project is AI-driven, hence users are requested to get ready with the AI API Auth Key and Endpoint.</li>
</ol>

<h2>Setup: Install and Run</h2>

<ol>
  <li><strong>Navigate to the NilgiriSecurity folder inside node_modules:</strong></li>
  <pre><code>cd node_modules/nilgirisecurity</code></pre>

  <li><strong>Install all required dependencies:</strong></li>
  <pre><code>npm install</code></pre>

  <li><strong>Run the script:</strong></li>
  <pre><code>npm run security</code></pre>

  <li><strong>Enter the required details when prompted:</strong></li>
  <ul>
    <li>Enter your API key:</li>
    <li>Enter your API endpoint:</li>
    <li>Enter the URL to scan:</li>
  </ul>
</ol>

<h2>Features</h2>
<ul>
  <li>Scans a target URL for potential security issues using the <strong>Feroxbuster</strong> tool.</li>
  <li>Downloads and unzips the <strong>Feroxbuster</strong> executable.</li>
  <li>Uses a customizable wordlist for comprehensive endpoint discovery.</li>
  <li>Generates two types of reports:
    <ul>
      <li><strong>JSON Report:</strong> Contains detailed findings and scan summary.</li>
      <li><strong>HTML Report:</strong> A human-readable report with comprehensive security analysis.</li>
    </ul>
  </li>
  <li>Integrates with AI to analyze scan results and generate actionable insights for security improvements.</li>
  <li>Automates the process of scanning, analyzing, and reporting, reducing manual effort.</li>
</ul>

<p>Thank you for choosing <strong>nilgiri-security</strong> as part of the Nilgiri framework for your Node.js utility needs!</p>

<p align="center">&copy; 2025 Tricon Infotech</p>
