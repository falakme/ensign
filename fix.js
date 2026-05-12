const fs = require('fs');
let c = fs.readFileSync('app/page.tsx', 'utf8');

c = c.replace(/const loadHtml2Canvas[\s\S]*?\}\s*\]\);\s*\};\s*\n/, "import { toPng } from 'html-to-image';\n");
c = c.replace(/declare global \{\n\s*interface Window \{\n\s*html2canvas\?\: any;\n\s*\}\n\}\n/, "");
c = c.replace(/\/\/ Ensure html2canvas is loaded\n\s*useEffect\(\(\) => \{\n\s*loadHtml2Canvas\(\);\n\s*\}\, \[\]\);\n/, "");

c = c.replace(/      \/\* @ts-ignore \*\/\n\s*const html2canvas.*\n\s*if \(\!html2canvas\).*\n\s*const canvas = await html2canvas\([\s\S]*?\);\n\s*const dataUrl = canvas\.toDataURL\('image\/png'\);/, `      const dataUrl = await toPng(previewRef.current, {
        pixelRatio: 1,
        backgroundColor: theme.background
      });`);

// also fix other instances of html2canvas if any
c = c.replace(/const html2canvas = window\.html2canvas;[\s\S]*?const dataUrl = canvas\.toDataURL\('image\/png'\);/g, `const dataUrl = await toPng(previewRef.current, {
        pixelRatio: 1,
        backgroundColor: theme.background
      });`);

fs.writeFileSync('app/page.tsx', c);
