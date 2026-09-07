'use client';

import React, { useState } from 'react';

export interface SocialShareCardProps {
  moduleName: string; // e.g. "TAROT SOI CHIẾU", "QUẺ KINH DỊCH", "LÁ SỐ TỬ VI"
  title: string; // e.g. "Lá bài: The Star (Ngôi Sao)"
  subtitle?: string; // e.g. "Quẻ 01: Càn Vi Thiên (Hào 9 Dương)"
  insights: string[]; // List of 2-4 key bullet points
  footerTag?: string; // e.g. "Chiêm nghiệm bởi Huyền Tâm Minh Đạo"
}

export const SocialShareCard: React.FC<SocialShareCardProps> = ({
  moduleName,
  title,
  subtitle,
  insights,
  footerTag = 'Chiêm nghiệm bởi Huyền Tâm Minh Đạo',
}) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const generateAndDownloadCanvas = () => {
    setIsGenerating(true);

    try {
      // 9:16 Story dimensions (1080 x 1920)
      const width = 1080;
      const height = 1920;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas context not available.');
      }

      // 1. Dark Midnight Slate Radial Background
      const bgGradient = ctx.createRadialGradient(
        width / 2,
        height / 3,
        100,
        width / 2,
        height / 2,
        1200
      );
      bgGradient.addColorStop(0, '#1e1b4b'); // Deep indigo core
      bgGradient.addColorStop(0.5, '#0f172a'); // Slate midnight
      bgGradient.addColorStop(1, '#020617'); // Almost black

      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Cinema Glow Orbs (Top Gold & Bottom Purple Glow)
      const goldGlow = ctx.createRadialGradient(width / 2, 350, 0, width / 2, 350, 450);
      goldGlow.addColorStop(0, 'rgba(245, 158, 11, 0.25)');
      goldGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = goldGlow;
      ctx.fillRect(0, 0, width, height);

      const purpleGlow = ctx.createRadialGradient(width / 2, 1400, 0, width / 2, 1400, 500);
      purpleGlow.addColorStop(0, 'rgba(168, 85, 247, 0.2)');
      purpleGlow.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = purpleGlow;
      ctx.fillRect(0, 0, width, height);

      // 3. Outer Decorative Border Frame
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
      ctx.lineWidth = 4;
      ctx.strokeRect(60, 60, width - 120, height - 120);

      ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
      ctx.lineWidth = 2;
      ctx.strokeRect(75, 75, width - 150, height - 150);

      // Corner Accents
      const drawCorner = (x: number, y: number, angle: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(0, 40);
        ctx.lineTo(0, 0);
        ctx.lineTo(40, 0);
        ctx.stroke();
        ctx.restore();
      };
      drawCorner(75, 75, 0);
      drawCorner(width - 75, 75, 90);
      drawCorner(width - 75, height - 75, 180);
      drawCorner(75, height - 75, 270);

      // 4. Header: Logo & Brand Name
      ctx.textAlign = 'center';

      // Brand Icon Emblem
      ctx.font = '70px Arial, sans-serif';
      ctx.fillText('🏛️', width / 2, 190);

      // Brand Title
      ctx.fillStyle = '#fef3c7'; // Amber 100
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText('HUYỀN TÂM MINH ĐẠO', width / 2, 260);

      ctx.fillStyle = '#94a3b8'; // Slate 400
      ctx.font = '24px sans-serif';
      ctx.fillText('HuyenTam Wisdom — Soi Chiếu Tâm Lý & Triết Học', width / 2, 300);

      // Divider Line
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(250, 340);
      ctx.lineTo(width - 250, 340);
      ctx.stroke();

      // 5. Module Badge
      ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
      ctx.beginPath();
      ctx.roundRect(width / 2 - 200, 380, 400, 60, 30);
      ctx.fill();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.stroke();

      ctx.fillStyle = '#fbbf24'; // Amber 400
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(moduleName.toUpperCase(), width / 2, 420);

      // 6. Main Title & Subtitle Card Container
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.beginPath();
      ctx.roundRect(120, 480, width - 240, 240, 24);
      ctx.fill();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 46px sans-serif';
      ctx.fillText(title, width / 2, 570);

      if (subtitle) {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '30px sans-serif';
        ctx.fillText(subtitle, width / 2, 640);
      }

      // 7. Key Insights Section Container
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.roundRect(120, 760, width - 240, 780, 24);
      ctx.fill();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
      ctx.stroke();

      // Section Header
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText('✨ THẤU CẢM & SOI CHIẾU TÂM LÝ', width / 2, 830);

      // Render Bullet Insights
      ctx.textAlign = 'left';
      let currentY = 910;

      insights.forEach((insight) => {
        if (currentY > 1460) return; // Prevent overflow

        // Bullet Point Icon
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText(`•`, 160, currentY);

        // Text wrapping for long insights
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '28px sans-serif';

        const words = insight.split(' ');
        let line = '';
        const maxWidth = width - 400;

        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && i > 0) {
            ctx.fillText(line, 195, currentY);
            line = words[i] + ' ';
            currentY += 45;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 195, currentY);
        currentY += 65;
      });

      // 8. Footer Section
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fef3c7';
      ctx.font = 'italic italic 30px sans-serif';
      ctx.fillText(`“Thấy rõ sự thật – Hiểu mình – Sống tốt hơn”`, width / 2, 1620);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '24px sans-serif';
      ctx.fillText(footerTag, width / 2, 1680);

      // Website Badge
      ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
      ctx.beginPath();
      ctx.roundRect(width / 2 - 250, 1720, 500, 60, 12);
      ctx.fill();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('🌐 huyentam.app', width / 2, 1760);

      // 9. Download Trigger
      const dataUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = `huyentam-${moduleName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err: unknown) {
      console.error('Error generating share card canvas:', err);
      alert('Không thể tạo ảnh chia sẻ. Vui lòng thử lại!');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generateAndDownloadCanvas}
      disabled={isGenerating}
      className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-950/40 transition-all duration-200 disabled:opacity-50 cursor-pointer"
    >
      <span>📸</span>
      <span>{isGenerating ? 'Đang xuất ảnh 9:16...' : 'Tải Ảnh Story (9:16)'}</span>
    </button>
  );
};
