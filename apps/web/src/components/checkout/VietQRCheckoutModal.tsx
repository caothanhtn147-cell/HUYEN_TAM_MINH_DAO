"use client";

import React, { useState } from "react";
import { QrCode, Check, Copy, Crown, ShieldCheck, Sparkles, X } from "lucide-react";

interface VietQRCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName?: string;
  amount?: number;
}

export const VietQRCheckoutModal: React.FC<VietQRCheckoutModalProps> = ({
  isOpen,
  onClose,
  planName = "Gói VIP Minh Triết (1 Năm)",
  amount = 199000,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  if (!isOpen) return null;

  const paymentCode = `HTVIP-${Math.floor(100000 + Math.random() * 900000)}`;
  const qrImageUrl = `https://img.vietqr.io/image/MB-0388888888-compact2.png?amount=${amount}&addInfo=${paymentCode}&accountName=HUYEN%20TAM%20MINH%20DAO`;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-zinc-950 border border-amber-500/30 p-6 shadow-2xl space-y-6 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-900 border border-zinc-800"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Crown className="h-4 w-4 text-amber-400" /> Nâng Cấp Thành Viên VIP
          </div>
          <h3 className="text-xl font-bold text-white mt-2">{planName}</h3>
          <p className="text-xs text-zinc-400">Quét mã VietQR chuyển khoản tự động kích hoạt 3s</p>
        </div>

        {/* QR Code Container */}
        <div className="relative mx-auto w-56 h-56 rounded-2xl bg-white p-3 shadow-xl border-2 border-amber-400/40 flex items-center justify-center">
          {/* Real Dynamic VietQR Image */}
          <img
            src={qrImageUrl}
            alt="Mã VietQR Thanh Toán VIP"
            className="w-full h-full object-contain rounded-lg"
          />
        </div>

        {/* Payment Details */}
        <div className="space-y-2.5 bg-zinc-900/80 p-4 rounded-2xl border border-amber-500/10 text-left text-xs">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Số tiền thanh toán:</span>
            <div className="flex items-center gap-1.5 font-bold text-amber-300 text-sm">
              <span>{amount.toLocaleString("vi-VN")} VNĐ</span>
              <button
                onClick={() => copyToClipboard(amount.toString(), "amount")}
                className="p-1 hover:text-white text-zinc-400"
                title="Sao chép số tiền"
              >
                {copiedAmount ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Nội dung chuyển khoản:</span>
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

          <div className="flex justify-between items-center text-[11px] pt-1 border-t border-zinc-800">
            <span className="text-zinc-500">Ngân hàng thụ hưởng:</span>
            <span className="text-zinc-300 font-semibold">MBBank (Napas247)</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-emerald-400">
          <ShieldCheck className="h-4 w-4" /> Hệ thống tự động kích hoạt ngay khi nhận tiền
        </div>
      </div>
    </div>
  );
};

export default VietQRCheckoutModal;
