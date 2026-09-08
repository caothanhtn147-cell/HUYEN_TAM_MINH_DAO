"use client";

import React, { useState } from "react";
import { Download, Share2, Sparkles, X, Check } from "lucide-react";

interface SocialStoryExporterProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  quote: string;
  authorOrType: string;
}

export const SocialStoryExporterModal: React.FC<SocialStoryExporterProps> = ({
  isOpen,
  onClose,
  title = "LỜI KHUYÊN MINH KIẾN HÔM NAY",
  subtitle = "Huyền Tâm Minh Đạo • Quẻ Ngày Mới",
  quote = "Tâm tĩnh thì trí sáng. Mọi giông bão ngoài kia chỉ là phép thử để trui rèn bản lĩnh và sự bình an nội tại.",
  authorOrType = "Kinh Dịch Minh Triết",
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateStoryCanvas = (): HTMLCanvasElement => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;

    // Background Gradient (Dark Mystic 9:16)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1920);
    bgGrad.addColorStop(0, "#09090b");
    bgGrad.addColorStop(0.4, "#180e29");
    bgGrad.addColorStop(1, "#05030a");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Cinema Glow Halo Effect
    const glowGrad = ctx.createRadialGradient(540, 700, 100, 540, 700, 600);
    glowGrad.addColorStop(0, "rgba(245, 158, 11, 0.25)");
    glowGrad.addColorStop(0.5, "rgba(147, 51, 234, 0.15)");
    glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Decorative Card Border Frame
    ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
    ctx.lineWidth = 6;
    ctx.strokeRect(60, 60, 960, 1800);

    ctx.strokeStyle = "rgba(245, 158, 11, 0.15)";
    ctx.lineWidth = 2;
    ctx.strokeRect(80, 80, 920, 1760);

    // Brand Header
    ctx.fillStyle = "#fef08a";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("HUYỀN TÂM MINH ĐẠO", 540, 180);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "24px sans-serif";
    ctx.fillText("https://huyentam.app", 540, 220);

    // Title & Subtitle
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 44px sans-serif";
    ctx.fillText(title.toUpperCase(), 540, 480);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "italic 30px sans-serif";
    ctx.fillText(subtitle, 540, 540);

    // Main Quote Card Box
    ctx.fillStyle = "rgba(15, 23, 42, 0.7)";
    ctx.fillRect(120, 640, 840, 700);
    ctx.strokeStyle = "rgba(245, 158, 11, 0.3)";
    ctx.lineWidth = 3;
    ctx.strokeRect(120, 640, 840, 700);

    // Quote Text Wrapper
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 38px serif";
    ctx.textAlign = "center";
    
    // Multi-line wrap
    const words = quote.split(" ");
    let line = "";
    let y = 780;
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 740 && i > 0) {
        ctx.fillText(line, 540, y);
        line = words[i] + " ";
        y += 60;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 540, y);

    // Author Tag
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 30px sans-serif";
    ctx.fillText(`— ${authorOrType} —`, 540, 1260);

    // Footer & Call to Action
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "26px sans-serif";
    ctx.fillText("Quét mã QR hoặc truy cập huyentam.app để tháo gỡ vướng mắc", 540, 1680);

    return canvas;
  };

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(() => {
      const canvas = generateStoryCanvas();
      const link = document.createElement("a");
      link.download = `HuyenTam_Story_916_${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setIsExporting(false);
    }, 200);
  };

  const handleShare = async () => {
    const canvas = generateStoryCanvas();
    canvas.toBlob(async (blob) => {
      if (blob && navigator.share && navigator.canShare) {
        const file = new File([blob], "HuyenTam_Story.png", { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: title,
              text: `${quote} — Trải nghiệm tại https://huyentam.app`,
              files: [file],
            });
            return;
          } catch {
            // fallback to copy link
          }
        }
      }
      navigator.clipboard.writeText(`https://huyentam.app - ${title}: ${quote}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-zinc-950 border border-amber-500/30 p-6 shadow-2xl space-y-5 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-900 border border-zinc-800"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" /> Xuất Ảnh Story TikTok / Zalo 9:16
          </div>
          <h3 className="text-lg font-bold text-white">Bản Ghi Minh Triết</h3>
        </div>

        {/* Story Live Preview Box */}
        <div className="relative aspect-[9/16] w-full max-w-[240px] mx-auto rounded-2xl bg-gradient-to-b from-zinc-900 via-purple-950 to-black p-4 border border-amber-500/30 flex flex-col justify-between shadow-xl">
          <div className="text-[10px] font-bold text-amber-300 tracking-wider uppercase">HUYỀN TÂM MINH ĐẠO</div>
          <div className="my-auto space-y-2">
            <div className="text-xs font-bold text-amber-400">{title}</div>
            <p className="text-[11px] text-zinc-200 italic line-clamp-4">&ldquo;{quote}&rdquo;</p>
            <div className="text-[10px] text-amber-300 font-semibold">— {authorOrType}</div>
          </div>
          <div className="text-[9px] text-zinc-400">huyentam.app</div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 active:scale-95 transition-all shadow-lg shadow-amber-500/20"
          >
            <Download className="h-4 w-4" /> {isExporting ? "Đang Xuất..." : "Tải Ảnh 9:16"}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-300 font-bold text-xs border border-amber-500/30 active:scale-95 transition-all"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
            {copied ? "Đã Chép Link" : "Chia Sẻ Story"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialStoryExporterModal;
