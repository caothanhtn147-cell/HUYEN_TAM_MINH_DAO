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
        <div className="border-t border-slate-800 pt-6 text-xs leading-relaxed text-slate-400 space-y-2">
          <p>
            Nền tảng đang trong giai đoạn khởi tạo kỹ thuật. Các tính năng sản phẩm chưa được kích hoạt.
          </p>
          <p className="text-slate-500">
            Tất cả nội dung tư vấn tâm linh và lối sống trong tương lai sẽ được tạo bởi Trí tuệ Nhân tạo (Minh Sư AI) và minh bạch rõ ràng.
          </p>
        </div>
      </div>
    </main>
  );
}
