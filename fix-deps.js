const fs = require('fs');
let c = fs.readFileSync('app/page.tsx', 'utf8');
c = c.replace(/\}\)\.catch\(console\.error\);\n\s*\}\, \[\]\);/, `}).catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);`);
fs.writeFileSync('app/page.tsx', c);
