const fs = require('fs');
let c = fs.readFileSync('app/page.tsx', 'utf8');
c = c.replace(/window\.html2canvas/g, '(window as any).html2canvas');
c = c.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '');
c = c.replace(/\/\*[\s\S]*?\*\//g, '');
c = c.replace(/(?<![:\\])\/\/.*$/gm, '');
c = c.replace(/\n\s*\n/g, '\n');
c = c.trim() + '\n';
fs.writeFileSync('app/page.tsx', c);
