const fs = require('fs');
let c = fs.readFileSync('app/page.tsx', 'utf8');

c = c.replace(
  /avatarUrl: repoData.owner.avatar_url\n\s*\}\)\);/,
  `avatarUrl: repoData.owner.avatar_url
      }));
      // Fetch avatar as base64 to avoid cross-origin issues during export
      const avatarRes = await fetch(repoData.owner.avatar_url);
      const avatarBlob = await avatarRes.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(avatarBlob);`
);

fs.writeFileSync('app/page.tsx', c);
console.log('done')
