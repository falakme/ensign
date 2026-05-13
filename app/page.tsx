"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { toPng } from "html-to-image";
import { Download, RefreshCw, Link as LinkIcon, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EnsignApp() {
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);
  const [isExporting, setIsExporting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [repoInput, setRepoInput] = useState("");
  const [data, setData] = useState({
    title: "ensign",
    description:
      "Generate beautiful, ultra-high-resolution social share images for your GitHub repositories directly in the browser.",
    website: "https://ensign.falak.me",
    language: "TypeScript",
    stars: 128,
    forks: 14,
    author: "falakme",
    avatarUrl:
      "https://raw.githubusercontent.com/falakme/brand-assets/refs/heads/main/logos/core/icon-square-512.png",
    customIconUrl: "",
  });

  // Convert initial avatar to base64
  useEffect(() => {
    fetch(data.avatarUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setData((prev) => ({ ...prev, avatarUrl: reader.result as string }));
        };
        reader.readAsDataURL(blob);
      })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [theme, setTheme] = useState({
    background: "#09090b",
    foreground: "#ffffff",
    accent: "#3b82f6",
    cardBg: "#18181b",
    pattern: "grid",
  });
  const [activeTab, setActiveTab] = useState<"content" | "design">("content");

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const newScale = (containerWidth * 0.9) / 2560;
        setScale(newScale);
      }
    };
    window.addEventListener("resize", updateScale);
    updateScale();
    setTimeout(updateScale, 100);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const handleFetchRepo = async () => {
    if (!repoInput) return;
    let repoPath = repoInput.trim();
    if (repoPath.startsWith("http")) {
      try {
        const url = new URL(repoPath);
        repoPath = url.pathname.substring(1);
      } catch {
        console.error("Invalid URL");
        return;
      }
    }
    setIsFetching(true);
    try {
      const response = await fetch(`https://api.github.com/repos/${repoPath}`);
      if (!response.ok) throw new Error("Repo not found");
      const repoData = await response.json();
      setData((prev) => ({
        ...prev,
        title: repoData.name,
        description: repoData.description || "No description provided.",
        website: repoData.homepage || `github.com/${repoData.full_name}`,
        language: repoData.language || "Markdown",
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        author: repoData.owner.login,
        avatarUrl: repoData.owner.avatar_url,
      }));
      // Fetch avatar as base64 to avoid cross-origin issues during export
      const avatarRes = await fetch(repoData.owner.avatar_url);
      const avatarBlob = await avatarRes.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setData((prev) => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(avatarBlob);
    } catch (error) {
      console.error("Error fetching repo:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleDownload = useCallback(async () => {
    if (previewRef.current === null) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(previewRef.current, {
        pixelRatio: 1,
        backgroundColor: theme.background,
      });
      const link = document.createElement("a");
      link.download = `${data.title}-social-preview.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Oops, something went wrong!", err);
    } finally {
      setIsExporting(false);
    }
  }, [data.title, theme.background]);

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setData((prev) => ({ ...prev, customIconUrl: url }));
    }
  };

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: "@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');" }} />
      <div className="w-[420px] flex-shrink-0 border-r border-zinc-800 bg-zinc-950/50 flex flex-col h-full z-10">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-100 text-zinc-900 rounded-md flex items-center justify-center font-bold">
              <img src="./Ensign.png" style={{border: "white 1px solid", borderRadius: "20%"}} alt="" />
            </div>
            <h1 className="font-bold text-xl tracking-tight">Ensign</h1>
          </div>
          <span className="text-xs font-medium px-2 py-1 bg-zinc-900 text-zinc-400 rounded-full border border-zinc-800">
            Falak.me
          </span>
        </div>
        <div className="flex w-full border-b border-zinc-800 px-6 pt-4 gap-6">
          <button
            onClick={() => setActiveTab("content")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "content" ? "border-zinc-100 text-zinc-100" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab("design")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "design" ? "border-zinc-100 text-zinc-100" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}
          >
            Design
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "content" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="space-y-3">
                <Label>Import from GitHub</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="falakme/ensign"
                    value={repoInput}
                    onChange={(e) => setRepoInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleFetchRepo()}
                  />
                  <Button
                    variant="outline"
                    style={{ background: "none" }}
                    onClick={handleFetchRepo}
                    disabled={isFetching}
                  >
                    {isFetching ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-zinc-500 hover:text-zinc-100 hover:cursor-pointer transition-[stroke-width,color] hover:stroke-[3]" />
                    ) : (
                      <RefreshCw className="w-4 h-4 text-zinc-500 hover:text-zinc-100 hover:cursor-pointer transition-[stroke-width,color] hover:stroke-[3]" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-zinc-500">
                  Paste a URL or type owner/repo.
                </p>
              </div>
              <div className="h-[1px] w-full bg-zinc-800" />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Repository Name</Label>
                  <Input
                    value={data.title}
                    onChange={(e) =>
                      setData({ ...data, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <textarea
                    className="flex min-h-[100px] w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
                    value={data.description}
                    onChange={(e) =>
                      setData({ ...data, description: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Website / Subtitle</Label>
                  <Input
                    value={data.website}
                    onChange={(e) =>
                      setData({ ...data, website: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Input
                    value={data.language}
                    onChange={(e) =>
                      setData({ ...data, language: e.target.value })
                    }
                    placeholder="e.g. Python, TypeScript"
                  />
                </div>
              </div>
            </div>
          )}
          {activeTab === "design" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="space-y-4">
                <Label>Background Color</Label>
                <div className="flex gap-3">
                  <Input
                    type="color"
                    value={theme.background}
                    onChange={(e) =>
                      setTheme({ ...theme, background: e.target.value })
                    }
                    className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
                  />
                  <Input
                    value={theme.background}
                    onChange={(e) =>
                      setTheme({ ...theme, background: e.target.value })
                    }
                    className="font-mono"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label>Accent Color</Label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={theme.accent}
                    onChange={(e) =>
                      setTheme({ ...theme, accent: e.target.value })
                    }
                    className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
                  />
                  <Input
                    value={theme.accent}
                    onChange={(e) =>
                      setTheme({ ...theme, accent: e.target.value })
                    }
                    className="font-mono"
                  />
                </div>
              </div>
              <div className="h-[1px] w-full bg-zinc-800" />
              <div className="space-y-4">
                <Label>Custom Icon (Overrides Avatar)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleIconUpload}
                  className="pt-1.5 cursor-pointer text-zinc-400 file:text-zinc-100"
                />
                {data.customIconUrl && (
                  <Button
                    variant="ghost"
                    className="text-xs h-8"
                    onClick={() => setData({ ...data, customIconUrl: "" })}
                  >
                    Remove Custom Icon
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="p-6 border-t border-zinc-800 bg-zinc-950">
          <Button
            className="w-full gap-2 font-bold hover:bg-zinc-100 hover:text-zinc-950 cursor-pointer transition-colors"
            onClick={handleDownload}
            disabled={isExporting}
          >
            {isExporting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isExporting ? "Rendering Image..." : "Export 2560x1280"}
          </Button>
        </div>
      </div>
      <div
        ref={containerRef}
        className="flex-1 relative bg-zinc-900 overflow-hidden flex items-center justify-center p-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div
          className="relative shadow-2xl ring-1 ring-white/10 flex-shrink-0"
          style={{
            width: "2560px",
            height: "1280px",
            transform: `scale(${scale})`,
            transformOrigin: "center center",
            transition: "transform 0.1s ease-out",
          }}
        >
          <div
            ref={previewRef}
            className="w-full h-full relative overflow-hidden"
            style={{
              backgroundColor: theme.background,
              color: theme.foreground,
              padding: "160px",
            }}
          >
            {theme.pattern === "grid" && (
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(to right, ${theme.foreground} 1px, transparent 1px), linear-gradient(to bottom, ${theme.foreground} 1px, transparent 1px)`,
                  backgroundSize: "100px 100px",
                }}
              />
            )}
            <div
              className="w-full h-full rounded-[64px] border-[4px] border-white/10 flex flex-col relative z-10 overflow-hidden"
              style={{
                backgroundColor: theme.cardBg,
                boxShadow: "0 40px 100px -20px rgba(0,0,0,0.5)",
              }}
            >
              <div className="flex-1 p-[100px] flex flex-col justify-between">
                <div className="flex items-center gap-12">
                  <div className="w-[200px] h-[200px] rounded-[48px] overflow-hidden border-[8px] border-white/5 bg-zinc-800 shadow-2xl flex-shrink-0">
                    <img
                      src={data.customIconUrl || data.avatarUrl}
                      alt="Icon"
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <div className="flex items-baseline gap-6 tracking-tight flex-wrap">
                    <span className="text-[64px] font-semibold opacity-70">
                      {data.author}
                    </span>
                    <span className="text-[64px] font-semibold opacity-40">
                      /
                    </span>
                    <h1
                      className="font-black leading-[1] tracking-tighter whitespace-nowrap"
                      style={{
                        color: theme.foreground,
                        fontSize: `${Math.max(72, 160 - Math.max(0, data.title.length - 10) * 4)}px`,
                      }}
                    >
                      {data.title}
                    </h1>
                  </div>
                  <div className="ml-auto w-[200px] h-[200px] rounded-[48px] flex-shrink-0">
                    <svg data-component="Octicon" aria-hidden="true" focusable="false" className="octicon octicon-mark-github" viewBox="0 0 24 24" width="150" height="150" fill="currentColor" display="inline-block" overflow="visible" style={{verticalAlign:"text-bottom"}}><path d="M10.226 17.284c-2.965-.36-5.054-2.493-5.054-5.256 0-1.123.404-2.336 1.078-3.144-.292-.741-.247-2.314.09-2.965.898-.112 2.111.36 2.83 1.01.853-.269 1.752-.404 2.853-.404 1.1 0 1.999.135 2.807.382.696-.629 1.932-1.1 2.83-.988.315.606.36 2.179.067 2.942.72.854 1.101 2 1.101 3.167 0 2.763-2.089 4.852-5.098 5.234.763.494 1.28 1.572 1.28 2.807v2.336c0 .674.561 1.056 1.235.786 4.066-1.55 7.255-5.615 7.255-10.646C23.5 6.188 18.334 1 11.978 1 5.62 1 .5 6.188.5 12.545c0 4.986 3.167 9.12 7.435 10.669.606.225 1.19-.18 1.19-.786V20.63a2.9 2.9 0 0 1-1.078.224c-1.483 0-2.359-.808-2.987-2.313-.247-.607-.517-.966-1.034-1.033-.27-.023-.359-.135-.359-.27 0-.27.45-.471.898-.471.652 0 1.213.404 1.797 1.235.45.651.921.943 1.483.943.561 0 .92-.202 1.437-.719.382-.381.674-.718.944-.943"></path></svg>
                  </div>
                </div>
                <div className="space-y-12">
                  <p className="text-[50px] leading-[1.4] opacity-70 max-w-[100%] font-medium text-balance">
                    {data.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-12 border-t-[4px] border-white/10 mt-12">
                  <div className="flex items-center gap-12 text-[48px] font-medium opacity-80">
                    <div className="flex items-center gap-4 bg-white/5 px-10 py-6 rounded-full">
                      <Code size={48} style={{ color: theme.accent }} />
                      <span>{data.language}</span>
                    </div>
                  </div>
                  {data.website && (
                    <div className="flex items-center gap-6 text-[48px] font-medium text-white/50 bg-white/5 px-10 py-6 rounded-full">
                      <LinkIcon size={48} />
                      <span>{data.website.replace(/^https?:\/\//, "")}</span>
                    </div>
                  )}
                </div>
              </div>
              <div
                className="absolute top-0 right-0 w-[1000px] h-[1000px] rounded-full blur-[200px] opacity-20 pointer-events-none translate-x-1/2 -translate-y-1/2"
                style={{ backgroundColor: theme.accent }}
              />
              <div
                className="absolute bottom-0 left-0 w-[800px] h-[800px] rounded-full blur-[200px] opacity-10 pointer-events-none -translate-x-1/3 translate-y-1/3"
                style={{ backgroundColor: theme.accent }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
