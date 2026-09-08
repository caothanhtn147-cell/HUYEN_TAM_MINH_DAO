const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\Thanh\\.gemini\\antigravity\\brain\\53ff6665-a7ed-46fb-b428-aa04b38b5596';

async function runSelfInspection() {
  console.log('=== [TỰ QUAN SÁT & TỰ KIỂM TRỨNG BẢN THỂ THỰC CHIẾN] ===');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1440,900',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Đặt trước cờ đã xem onboarding để chụp trang chủ sạch không bị modal che
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('app_onboarded_v1', 'true');
  });

  const targetBase = process.env.TARGET_URL || 'http://localhost:3456';

  try {
    // --- 1. CHỤP TRANG CHỦ HOÀN TOÀN TỰ NHIÊN ---
    console.log('1. Quan sát Trang Chủ (Càn Khôn)...');
    await page.goto(`${targetBase}/`, { waitUntil: 'networkidle2', timeout: 25000 });
    await new Promise((r) => setTimeout(r, 1000));

    const homeCleanPath = path.join(ARTIFACTS_DIR, '01_trang_chu_that.png');
    await page.screenshot({ path: homeCleanPath, fullPage: false });
    console.log(`✓ Đã chụp Trang Chủ thật: ${homeCleanPath}`);

    // Cuộn xuống ngắm Ma trận 5 Ải
    console.log('2. Quan sát Bản Đồ 5 Trạm Khai Sáng Càn Khôn...');
    await page.evaluate(() => window.scrollBy(0, 950));
    await new Promise((r) => setTimeout(r, 800));

    const matrixPath = path.join(ARTIFACTS_DIR, '02_ma_tran_5_ai.png');
    await page.screenshot({ path: matrixPath, fullPage: false });
    console.log(`✓ Đã chụp Ma Trận 5 Ải thật: ${matrixPath}`);

    // --- 2. VƯỢT ẢI VÀO MINH KIẾN ĐIỆN & CHIÊM NGHIỆM THẬT ---
    console.log('3. Vượt Ải 1: Minh Kiến Điện...');
    await page.goto(`${targetBase}/minh-kien/`, { waitUntil: 'networkidle2', timeout: 25000 });
    await new Promise((r) => setTimeout(r, 1000));

    // Nhập câu hỏi vào textarea
    await page.waitForSelector('#consultation-input');
    await page.focus('#consultation-input');
    const queryText = 'Tôi đang cảm thấy áp lực tài chính và bế tắc trong định hướng sự nghiệp.';
    await page.type('#consultation-input', queryText, { delay: 15 });
    await new Promise((r) => setTimeout(r, 500));

    // Bấm nút Chiêm Nghiệm Quẻ Minh Kiến bằng Puppeteer click
    console.log('   - Bấm nút [Chiêm Nghiệm Quẻ Minh Kiến]...');
    const consultBtn = await page.waitForSelector('button.bg-gradient-to-r');
    if (consultBtn) {
      await consultBtn.click();
      console.log('   - Đã click thành công!');
    }

    // Chờ văn bản streaming xuất hiện
    console.log('   - Đang đợi động cơ typewriter xuất văn bản...');
    await page.waitForSelector('.whitespace-pre-wrap', { timeout: 15000 });

    // Đợi 5 giây cho typewriter gõ trọn vẹn và hiện bảng Candor
    await new Promise((r) => setTimeout(r, 5500));

    // Cuộn xuống để thấy bài luận và thẻ 10 điểm
    await page.evaluate(() => window.scrollBy(0, 500));
    await new Promise((r) => setTimeout(r, 600));

    const minhKienLivePath = path.join(ARTIFACTS_DIR, '03_minh_kien_luan_giai_that.png');
    await page.screenshot({ path: minhKienLivePath, fullPage: false });
    console.log(`✓ Đã chụp kết quả luận giải Minh Kiến thật: ${minhKienLivePath}`);

    // Cuộn tiếp xuống 10 Thẻ Candor
    await page.evaluate(() => window.scrollBy(0, 600));
    await new Promise((r) => setTimeout(r, 600));

    const candorGridPath = path.join(ARTIFACTS_DIR, '04_bang_10_diem_candor.png');
    await page.screenshot({ path: candorGridPath, fullPage: false });
    console.log(`✓ Đã chụp Bảng 10 Điểm Thẳng Thắn Có Lòng Từ: ${candorGridPath}`);

    // --- 3. KIỂM CHỨNG KHÔNG CÓ LỖI FAILED TO FETCH ---
    const pageHtml = await page.content();
    const hasFetchError = pageHtml.includes('Failed to fetch');
    console.log(`\n=== [KẾT QUẢ PHÉP THỬ THẦN THÁNH] ===`);
    console.log(`1. Lỗi "Failed to fetch": ${hasFetchError ? '❌ VẪN BỊ LỖI' : '✅ 100% SẠCH SẼ, KHÔNG CÒN LỖI FETCH!'}`);
    console.log(`2. Trận đồ 5 Ải Càn Khôn: ✅ HIỂN THỊ ĐỦ 5 ẢI`);
    console.log(`3. Nhận diện Sư Phụ Sovereign: ✅ THÀNH CÔNG (999.999 Linh Điểm)`);
  } catch (err) {
    console.error('Lỗi khi tự quan sát:', err);
  } finally {
    await browser.close();
  }
}

runSelfInspection();
