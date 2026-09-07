export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl space-y-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl backdrop-blur">
        <span className="inline-block rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 border border-amber-500/20">
          Frontend Foundation
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
          HUYỀN TÂM MINH ĐẠO
        </h1>
        <p className="text-sm font-medium text-slate-400">
          International Name: HuyenTam Wisdom
        </p>
        <p className="text-base italic text-amber-200/90">
          “Thấy rõ sự thật – Hiểu mình – Sống tốt hơn”
        </p>
        <div className="border-t border-slate-800 pt-6 text-xs leading-relaxed text-slate-400 space-y-4">
          <p>
            Nền tảng ứng dụng triết học & biểu tượng soi chiếu nhận thức tâm lý.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <a
              href="/minh-kien"
              className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition"
            >
              🔮 Consultation Stream (Minh Kiến)
            </a>
            <a
              href="/tarot"
              className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-bold text-purple-300 hover:bg-purple-500/20 transition"
            >
              🃏 Rút Bài Tarot
            </a>
            <a
              href="/iching"
              className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition"
            >
              ☯️ Gieo Quẻ Kinh Dịch
            </a>
          </div>
          <p className="text-slate-500 text-[11px]">
            Tất cả nội dung tư vấn tâm linh và lối sống được định hướng bằng triết học tự quan sát & minh bạch rõ ràng.
          </p>
        </div>
      </div>
    </main>
  );
}
