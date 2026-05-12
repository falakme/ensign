const fs = require('fs');
let c = fs.readFileSync('app/page.tsx', 'utf8');

c = c.replace(/const \[data, setData\] = useState\(\{[\s\S]*?\}\);/, `const [data, setData] = useState({
    title: "ensign",
    description: "Generate beautiful, ultra-high-resolution social share images for your GitHub repositories directly in the browser.",
    website: "https://ensign.falak.me",
    language: "TypeScript",
    stars: 128,
    forks: 14,
    author: "falakme",
    avatarUrl: "https://raw.githubusercontent.com/falakme/brand-assets/refs/heads/main/logos/core/icon-square-512.png",
    customIconUrl: ""
  });

  // Convert initial avatar to base64
  useEffect(() => {
    fetch(data.avatarUrl)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setData(prev => ({ ...prev, avatarUrl: reader.result as string }));
        };
        reader.readAsDataURL(blob);
      }).catch(console.error);
  }, []);`);

fs.writeFileSync('app/page.tsx', c);
