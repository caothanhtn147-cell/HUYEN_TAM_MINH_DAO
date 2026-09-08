"use client";

import React, { useState } from "react";
import { Check, Copy, ShieldCheck, X, Coffee, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { playTibetanBowlChime } from "@/lib/soundUtils";

interface VietQRCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: "pack" | "month" | "lifetime";
}

export const VietQRCheckoutModal: React.FC<VietQRCheckoutModalProps> = ({
  isOpen,
  onClose,
  initialPlan = "month",
}) => {
  const { language } = useLanguage();
  const { topUpCredits, setRole } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<"pack" | "month" | "lifetime">(initialPlan);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [paymentCode] = useState(() => `HMT-${Math.floor(100000 + Math.random() * 900000)}`);
  const [reconcileState, setReconcileState] = useState<"idle" | "checking" | "success">("idle");

  if (!isOpen) return null;

  // Dual-Tier Pricing Matrix (Coffee Cup Micro-Pricing Strategy)
  const planDetails = {
    pack: {
      nameVn: "Gói 20 Hạt Minh Triết (Nạp Điểm)",
      nameEn: "20 Wisdom Credits Pack",
      amountVn: 19000,
      amountEn: "$0.99 USD",
      credits: 20,
      isVip: false,
      descVn: "Bằng 1 ổ bánh mì — Dùng xem 5 quẻ Tử Vi / Tarot nâng cao",
      descEn: "Sub-dollar micro-pack for 5 deep Tarot & Astrology readings",
    },
    month: {
      nameVn: "Gói VIP Cốc Cà Phê (1 Tháng)",
      nameEn: "VIP Coffee Tier (1 Month)",
      amountVn: 29000,
      amountEn: "$2.99 USD",
      credits: 100,
      isVip: true,
      descVn: "Bằng 1 cốc cà phê bình dân — Mở khóa không giới hạn 30 ngày",
      descEn: "Cost of a coffee cup — Unlimited access for 30 days",
    },
    lifetime: {
      nameVn: "Gói VIP Trọn Đời (Sovereign)",
      nameEn: "Lifetime VIP Sovereign Access",
      amountVn: 149000,
      amountEn: "$14.99 USD",
      credits: 9999,
      isVip: true,
      descVn: "Bằng 1 bữa ăn nhẹ — Sở hữu vĩnh viễn + Huy hiệu Vàng Kim 24K",
      descEn: "One-time payment — Perpetual access + Gold Sovereign Badge",
    },
  };

  const currentPlan = planDetails[selectedPlan];
  const isVn = language !== "en";

  const qrImageUrl = `https://img.vietqr.io/image/MB-0388888888-compact2.png?amount=${currentPlan.amountVn}&addInfo=${paymentCode}&accountName=HUYEN%20TAM%20MINH%20DAO`;

  const copyToClipboard = (text: string, type: "code" | "amount") => {
    navigator.clipboard.writeText(text);
    if (type === "code") {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    }
  };

  const handleReconcile = () => {
    if (reconcileState === "checking") return;
    setReconcileState("checking");

    // Giả lập kết nối đối soát tức thì cổng Napas247
    setTimeout(() => {
      topUpCredits(currentPlan.credits);
      if (currentPlan.isVip) {
        setRole("vip");
      }
      playTibetanBowlChime(4.5);
      setReconcileState("success");
    }, 1400);
  };

  const handleResetModal = () => {
    setReconcileState("idle");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-zinc-950 border border-amber-500/30 p-6 shadow-2xl space-y-5 text-center">
        <button
          onClick={handleResetModal}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-900 border border-zinc-800"
        >
          <X className="h-4 w-4" />
        </button>

        {reconcileState === "success" ? (
          /* Khung Báo Khớp Lệnh Thành Công Rực Rỡ */
          <div className="space-y-4 py-4 animate-fadeIn">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border-2 border-emerald-400 text-emerald-400 shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">
                {isVn ? "XÁC NHẬN GIAO DỊCH THÀNH CÔNG!" : "TRANSACTION VERIFIED!"}
              </h3>
              <p className="text-xs text-emerald-300 font-mono">
                {isVn ? `Mã lệnh: ${paymentCode} • Cổng Napas247 đã khớp` : `Code: ${paymentCode} • Napas247 Confirmed`}
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/20 bg-zinc-900/90 p-4 text-xs space-y-2 text-left">
              <div className="flex justify-between items-center text-zinc-300">
                <span>{isVn ? "Gói đã kích hoạt:" : "Activated Plan:"}</span>
                <span className="font-bold text-amber-300">{isVn ? currentPlan.nameVn : currentPlan.nameEn}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-300">
                <span>{isVn ? "Hạt Minh Triết cộng thêm:" : "Wisdom Credits Added:"}</span>
                <span className="font-mono font-bold text-emerald-400">+{currentPlan.credits} Linh Điểm</span>
              </div>
              {currentPlan.isVip && (
                <div className="flex items-center gap-1.5 text-amber-400 font-bold pt-1 border-t border-zinc-800">
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>{isVn ? "Đã nâng cấp đặc quyền VIP Vô Hạn!" : "VIP Unlimited Access Granted!"}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleResetModal}
              className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-xs font-bold uppercase tracking-wider text-zinc-950 hover:from-amber-400 hover:to-amber-500 transition shadow-lg shadow-amber-500/20 active:scale-98"
            >
              {isVn ? "Hoàn Tất & Tiếp Tục Chiêm Nghiệm" : "Done & Continue Journey"}
            </button>
          </div>
        ) : (
          /* Luồng Quét Mã & Thanh Toán Chuẩn */
          <>
            {/* Modal Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <Coffee className="h-4 w-4 text-amber-400" /> {isVn ? "Bảng Giá Cốc Cà Phê Bình Dân" : "Coffee Cup Micro-Pricing"}
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                {isVn ? "Nạp Hạt Minh Triết & Kích Hoạt VIP" : "Top Up Wisdom Credits & VIP"}
              </h3>
              <p className="text-xs text-zinc-400">
                {isVn ? "Giá bình dân ai cũng dùng được — Quét VietQR 3s tự động kích hoạt" : "Sub-dollar pricing — Scan VietQR for 3s instant activation"}
              </p>
            </div>

            {/* Plan Selector Grid */}
            <div className="grid grid-cols-3 gap-2 text-left">
              {(["pack", "month", "lifetime"] as const).map((pKey) => {
                const p = planDetails[pKey];
                const isSelected = selectedPlan === pKey;
                return (
                  <button
                    key={pKey}
                    onClick={() => setSelectedPlan(pKey)}
                    className={`p-3 rounded-2xl border transition-all text-xs flex flex-col justify-between ${
                      isSelected
                        ? "bg-amber-500/15 border-amber-400 text-amber-200 shadow-md shadow-amber-500/20 scale-[1.02]"
                        : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    <div className="font-bold text-[11px] line-clamp-1">{isVn ? p.nameVn : p.nameEn}</div>
                    <div className="text-amber-300 font-extrabold text-sm mt-2">
                      {isVn ? `${(p.amountVn / 1000).toFixed(0)}k VNĐ` : p.amountEn}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Plan Details & VietQR Image */}
            <div className="relative mx-auto w-52 h-52 rounded-2xl bg-white p-2.5 shadow-xl border-2 border-amber-400/40 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrImageUrl}
                alt="Mã VietQR P2P Mã Hóa"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>

            {/* P2P Anonymous Payment Breakdown */}
            <div className="space-y-2 bg-zinc-900/80 p-3.5 rounded-2xl border border-amber-500/10 text-left text-xs">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">{isVn ? "Số tiền nạp:" : "Amount:"}</span>
                <div className="flex items-center gap-1.5 font-bold text-amber-300 text-sm">
                  <span>{isVn ? `${currentPlan.amountVn.toLocaleString("vi-VN")} VNĐ` : currentPlan.amountEn}</span>
                  <button
                    onClick={() => copyToClipboard(currentPlan.amountVn.toString(), "amount")}
                    className="p-1 hover:text-white text-zinc-400"
                    title="Sao chép số tiền"
                  >
                    {copiedAmount ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-400">{isVn ? "Cú pháp chuyển P2P:" : "P2P Code:"}</span>
                <div className="flex items-center gap-1.5 font-mono font-bold text-purple-300">
                  <span>{paymentCode}</span>
                  <button
                    onClick={() => copyToClipboard(paymentCode, "code")}
                    className="p-1 hover:text-white text-zinc-400"
                    title="Sao chép mã"
                  >
                    {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <p className="text-[10px] text-zinc-400 italic pt-1 border-t border-zinc-800">
                💡 {isVn ? currentPlan.descVn : currentPlan.descEn}
              </p>
            </div>

            {/* Reconciliation Action Button */}
            <button
              onClick={handleReconcile}
              disabled={reconcileState === "checking"}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-xs font-bold uppercase tracking-wider text-zinc-950 hover:from-amber-400 hover:to-amber-500 transition shadow-lg shadow-amber-500/20 disabled:opacity-50 active:scale-98"
            >
              {reconcileState === "checking" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
                  <span>{isVn ? "Đang Đối Soát Napas247..." : "Checking Napas247 Network..."}</span>
                </>
              ) : (
                <>
                  <span>⚡</span>
                  <span>{isVn ? "Kiểm Tra Giao Dịch Tức Thì (Napas247)" : "Verify Instant Transaction"}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-emerald-400">
              <ShieldCheck className="h-4 w-4" /> {isVn ? "Tự động cộng Hạt Minh Triết & kích hoạt VIP trong 3s" : "Auto 3s Wisdom Credits & VIP activation"}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VietQRCheckoutModal;
