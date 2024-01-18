// build.js
const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

indexHtml = indexHtml.replace('env.GOOGLE_API_KEY', process.env.GOOGLE_API_KEY);

fs.writeFileSync(indexHtmlPath, indexHtml);