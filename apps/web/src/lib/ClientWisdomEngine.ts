import {
  MinhKienConsultationResponse,
  TenPointCompassionateCandor,
  HotlineContact,
} from '@/types/consultation';

interface DomainKnowledge {
  keywords: string[];
  topic: string;
  stoicPerspective: string;
  buddhistPerspective: string;
  ichingPerspective: string;
  inactionRisk: string;
  action24h: string;
  action7d: string;
}

const DOMAIN_KNOWLEDGE_BASE: DomainKnowledge[] = [
  {
    keywords: ['sự nghiệp', 'công việc', 'nghề nghiệp', 'đổi việc', 'thăng tiến', 'sếp', 'đồng nghiệp', 'sa thải', 'thất nghiệp', 'phỏng vấn', 'dự án'],
    topic: 'Sự Nghiệp & Công Danh',
    stoicPerspective: 'Triết học Khắc Kỷ nhắc nhở về Vòng tròn kiểm soát: Bạn không thể kiểm soát phản ứng của sếp, nền kinh tế hay thị trường lao động. Thứ duy nhất bạn hoàn toàn làm chủ là năng lực chuyên môn, thái độ phục vụ và mức độ kỷ luật làm việc mỗi ngày.',
    buddhistPerspective: 'Theo lý Duyên Khởi, mọi bế tắc trong công việc hiện tại là sự hội tụ của nhiều điều kiện cũ. Khi một nhân duyên hết thời, việc níu giữ sẽ sinh khổ. Hãy quan sát công việc như một môi trường rèn luyện tâm thức hơn là chiếc gông xiềng định nghĩa giá trị con người bạn.',
    ichingPerspective: 'Dịch lý có câu: "Cùng tắc biến, biến tắc thông, thông tắc cửu". Khi công việc gặp bế tắc, đó là lúc thời vận báo hiệu cần chuyển dịch từ thụ động sang chủ động nâng cấp nội lực.',
    inactionRisk: 'Nếu bạn tiếp tục chần chừ và ở lại trong trạng thái bất mãn thêm 3 tháng, năng lượng tiêu cực sẽ bào mòn sự tự tin, làm cùn mòn kỹ năng cạnh tranh và khiến bạn rơi vào cái bẫy tê liệt ý chí.',
    action24h: 'Dành 45 phút tối nay viết ra danh sách 3 kỹ năng cốt lõi mạnh nhất của bạn và 1 kỹ năng bạn cần bổ sung gấp trong tháng này.',
    action7d: 'Cập nhật lại hồ sơ năng lực (CV/Portfolio) theo hướng giải quyết vấn đề cho thị trường, và chủ động kết nối lại với 2 người tiền bối đáng tin cậy trong ngành.',
  },
  {
    keywords: ['tình cảm', 'người yêu', 'vợ chồng', 'hôn nhân', 'chia tay', 'ly hôn', 'cãi nhau', 'bất hòa', 'tổn thương', 'phản bội', 'gia đình', 'bố mẹ'],
    topic: 'Tình Cảm & Mối Quan Hệ',
    stoicPerspective: 'Marcus Aurelius từng viết: Khi người khác làm bạn thất vọng, hãy nhớ rằng bạn không thể bắt người khác hành xử theo kỳ vọng của bạn. Kỳ vọng thiếu thực tế chính là lưỡi dao tự cứa vào tâm can.',
    buddhistPerspective: 'Tình cảm giữa người với người vận hành theo luật Vô Thường và Tùy Duyên. Tình yêu đích thực được xây trên nền tảng hiểu và thương, chứ không phải chiếm hữu hay kiểm soát cảm xúc của đối phương.',
    ichingPerspective: 'Quẻ Gia Nhân và Quẻ Quy Muội trong Kinh Dịch dạy rằng: Trong quan hệ gia đạo, chính trực và hòa ái là gốc. Nước chảy đá mòn, sự bao dung và lắng nghe sâu luôn chiến thắng sự cố chấp đôi co.',
    inactionRisk: 'Tiếp tục im lặng trong ấm ức hoặc né tránh đối thoại sẽ tích tụ thành một bức tường lạnh lùng, giết chết dần sự gắn kết và đẩy mâu thuẫn đến điểm gãy đổ không thể hàn gắn.',
    action24h: 'Tạm gác lại ý muốn tranh cãi đúng sai. Dành 1 khoảng lặng thở sâu 10 phút, gửi một thông điệp chân thành hoặc lắng nghe trọn vẹn mà không ngắt lời.',
    action7d: 'Thiết lập một cuộc đối thoại bình tĩnh, trung thực trên tinh thần xây dựng: Nói rõ cảm xúc của mình bằng ngôi thứ nhất ("Tôi cảm thấy...") thay vì quy kết ("Bạn luôn luôn...").',
  },
  {
    keywords: ['tiền bạc', 'tài chính', 'nợ nần', 'đầu tư', 'thua lỗ', 'áp lực tiền', 'chứng khoán', 'bất động sản', 'kinh doanh', 'phá sản', 'mất tiền'],
    topic: 'Tài Chính & Dòng Tiền',
    stoicPerspective: 'Seneca từng dạy: Giàu có thực sự không phải là sở hữu thật nhiều của cải, mà là biết kiểm soát những ham muốn vô độ. Tiền bạc là công cụ hỗ trợ cuộc sống, không phải là thước đo phẩm giá linh hồn.',
    buddhistPerspective: 'Quy luật Nhân Quả và Tâm Xả: Tiền bạc đến và đi như dòng nước chảy. Nỗi sợ mất tiền thường lớn hơn sự mất mát thực tế. Bình tâm nhìn vào bản chất con số để tái lập dòng chảy lương thiện.',
    ichingPerspective: 'Kinh Dịch có hào: "Cơ tắc tổn, ích tắc thu". Khi dòng tiền suy thoái, đại kỵ là tâm lý liều mạng gỡ gạc. Phải co cụm phòng thủ, tích trữ lương thảo, giữ vững cái tâm tĩnh để đón cơ hội mới.',
    inactionRisk: 'Nếu để nỗi sợ tài chính chi phối mà đưa ra các quyết định liều lĩnh hoặc vay mượn nóng để lấp lỗ hổng, bạn sẽ rơi vào vòng xoáy nợ kép không lối thoát.',
    action24h: 'Mở một trang giấy trắng, liệt kê chính xác tuyệt đối các con số: Tổng tài sản thực tế, các khoản nợ bắt buộc, chi phí sinh tồn tối thiểu mỗi tháng. Nhìn thẳng vào sự thật.',
    action7d: 'Cắt giảm 100% các chi phí xa xỉ không thiết yếu trong 30 ngày tới. Lập phương án trả nợ theo nguyên tắc "Hòn tuyết lăn" hoặc đàm phán kéo dài thời hạn với sự chân thành.',
  },
  {
    keywords: ['mất ngủ', 'lo âu', 'trầm cảm', 'kiệt quệ', 'stress', 'sức khỏe', 'bệnh tật', 'bất an', 'sợ hãi', 'căng thẳng', 'chán nản', 'rối loạn'],
    topic: 'Tâm Trí & Sức Khỏe Tinh Thần',
    stoicPerspective: 'Epictetus khẳng định: "Con người không bị tổn thương bởi các sự việc diễn ra xung quanh, mà bởi cách họ nhìn nhận và phán xét về những sự việc đó." Hãy tách rời bản thể khỏi những suy nghĩ hỗn loạn.',
    buddhistPerspective: 'Thiền học dạy phép Quán Tâm: Tâm trí như mặt hồ, khi có sóng gió chỉ cần ngồi yên lắng đọng, bùn đất sẽ tự lắng xuống đáy, nước sẽ lại trong vắt. Đừng cố đập tay xuống nước để làm phẳng mặt hồ.',
    ichingPerspective: 'Quẻ Phục trong Kinh Dịch nghĩa là trở về với cội nguồn sinh khí. Khi thân tâm cạn kiệt, hành động sáng suốt nhất là nghỉ ngơi, tĩnh dưỡng để tái tạo nguyên khí.',
    inactionRisk: 'Tiếp tục ép cơ thể thức khuya và để tâm trí chạy loạn sẽ làm suy kiệt hệ thần kinh thực vật, dẫn đến các rối loạn thể chất thực tổn.',
    action24h: 'Tắt toàn bộ màn hình điện thoại trước khi đi ngủ 60 phút. Uống một ly nước ấm và thực hành bài tập thở 4-7-8 trong 10 phút.',
    action7d: 'Duy trì đi bộ ngoài trời đón ánh nắng tự nhiên 20 phút mỗi sáng, ăn thực phẩm thanh đạm tươi mới và ngủ đúng 23h đêm.',
  },
];

const CRISIS_KEYWORDS = [
  'tự tử',
  'muốn chết',
  'chết đi',
  'kết liễu',
  'tự sát',
  'tự hại',
  'rạch tay',
  'uống thuốc tự',
  'nhảy lầu',
  'hết muốn sống',
  'suicide',
  'kill myself',
];

const VIETNAM_HOTLINES: HotlineContact[] = [
  {
    name: 'Tổng Đài Quốc Gia Bảo Vệ Trẻ Em & Hỗ Trợ Khủng Hoảng Tâm Lý',
    number: '111',
    description: 'Miễn phí 24/7 - Hỗ trợ khẩn cấp mọi công dân Việt Nam khi gặp bế tắc tâm lý hoặc khủng hoảng.',
  },
  {
    name: 'Phím Bấm Cứu Hộ Tâm Trí & Trầm Cảm (Bệnh Viện Tâm Thần Ban Ngày Mai Hương)',
    number: '024 3627 5762',
    description: 'Tư vấn chuyên khoa tâm lý lâm sàng, can thiệp kịp thời các trạng thái trầm cảm và căng thẳng cực độ.',
  },
  {
    name: 'Đường Dây Nóng Hỗ Trợ Tinh Thần & Phòng Ngừa Tự Hại (Ngày Đêm)',
    number: '1900 6233',
    description: 'Lắng nghe nhân văn, đồng hành cùng bạn vượt qua giây phút cô đơn đen tối nhất.',
  },
];

export class ClientWisdomEngine {
  /**
   * Phân tích truy vấn của người dùng và sinh kết quả chiêm nghiệm 10 điểm Thẳng Thắn Có Lòng Từ
   */
  public static generateConsultation(userQuery: string): MinhKienConsultationResponse {
    const cleanQuery = userQuery.trim().toLowerCase();
    const sessionId = `MK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // 1. Kiểm tra an toàn khủng hoảng tâm lý
    const isCrisis = CRISIS_KEYWORDS.some((kw) => cleanQuery.includes(kw));
    if (isCrisis) {
      return {
        session_id: sessionId,
        model: 'HuyenTam-Wisdom-Compassion-v3',
        provider: 'Autonomous-Client-Safety',
        credits_deducted: 0,
        safety_action: 'EMERGENCY_HOTLINE',
        hotline_contacts: VIETNAM_HOTLINES,
        content: `### 🕊️ THÔNG ĐIỆP BÌNH YÊN & TÔN TRỌNG SỰ SỐNG

Hệ thống Huyền Tâm Minh Đạo cảm nhận được bạn đang gánh chịu một cơn bão cảm xúc vô cùng nặng nề và đau đớn. 

Xin hãy dừng lại một nhịp thở. Trong khoảnh khắc này, hãy nhớ rằng bạn không hề cô độc giữa cuộc đời. Mọi nỗi đau, dù khủng khiếp đến đâu, cũng chỉ là một trạng thái vô thường tạm thời đi ngang qua tâm trí bạn.

Trí tuệ nhân tạo và các công cụ chiêm nghiệm không thể thay thế bàn tay ấm áp và sự can thiệp y tế/tâm lý của các chuyên gia thực thụ. Xin bạn hãy mở lòng liên hệ ngay với các đường dây nóng hỗ trợ khẩn cấp dưới đây — họ luôn túc trực để lắng nghe và giữ chặt lấy bạn:

- 📞 **Tổng Đài Quốc Gia 111** (Miễn phí 24/7)
- 📞 **Đường Dây Nóng Khủng Hoảng Tâm Trí: 1900 6233**
- 📞 **Phòng Khám Can Thiệp Khủng Hoảng Tâm Lý: 024 3627 5762**

Hãy uống một ngụm nước ấm, hít thở thật sâu, và cho phép bản thân được nhận sự trợ giúp của cuộc đời. Bạn xứng đáng được sống bình an!`,
      };
    }

    // 2. Nhận diện miền vấn đề
    let matchedDomain = DOMAIN_KNOWLEDGE_BASE.find((d) =>
      d.keywords.some((kw) => cleanQuery.includes(kw))
    );

    // Mặc định nếu không trùng từ khóa chuyên sâu: Trở về miền Triết Lý Đời Sống & Định Hướng Tâm Trí
    if (!matchedDomain) {
      matchedDomain = {
        keywords: [],
        topic: 'Định Hướng Cuộc Đời & Thấu Suốt Bản Thân',
        stoicPerspective: 'Triết lý Khắc Kỷ khuyên bạn: Khi đứng trước ngã rẽ mịt mù, đừng hỏi "Tại sao điều này lại xảy ra với tôi?", mà hãy hỏi: "Tôi có thể rèn luyện đức tính dũng cảm và kiên định nào từ thử thách này?"',
        buddhistPerspective: 'Theo triết lý Phật giáo Thiền tông, tâm trí thường đau khổ vì cố bám víu vào quá khứ hoặc lo sợ viễn cảnh tương lai chưa tới. Chánh niệm là trở về với hiện tại, nhìn rõ mọi thứ như nó đang là.',
        ichingPerspective: 'Kinh Dịch có 64 quẻ, không có quẻ nào hoàn toàn xấu hay hoàn toàn tốt. Sự biến chuyển là quy luật vĩnh hằng. Khi hiểu được thời thế, bạn sẽ biết lúc nào nên ẩn nhẫn tích lũy, lúc nào nên dấn thân hành động.',
        inactionRisk: 'Nếu bạn tiếp tục để sự phân vân chi phối mà không đưa ra bất kỳ lựa chọn cụ thể nào, năng lượng tinh thần sẽ bị phân tán, khiến bạn mãi mắc kẹt trong vòng lặp do dự.',
        action24h: 'Viết ra một quyết định đơn giản nhất mà bạn có thể thực thi ngay hôm nay để tháo gỡ 10% sự bế tắc.',
        action7d: 'Dành 15 phút tĩnh lặng mỗi ngày để chiêm nghiệm lại những bài học kinh nghiệm, thiết lập thói quen sinh hoạt quy củ và kỷ luật.',
      };
    }

    // 3. Xây dựng cấu trúc 10 Điểm Thẳng Thắn Có Lòng Từ (TenPointCompassionateCandor)
    const structuredCandor: TenPointCompassionateCandor = {
      user_emotional_state: `Bạn đang trải qua trạng thái trăn trở và mong muốn tìm kiếm một điểm tựa nhận thức rõ ràng đối với vấn đề: "${userQuery.slice(0, 100)}${userQuery.length > 100 ? '...' : ''}". Cảm xúc này hoàn toàn tự nhiên đối với một người có tinh thần trách nhiệm với bản thân.`,
      honest_reality: `Sự thật thẳng thắn là không có bất kỳ giải pháp màu nhiệm nào có thể giải quyết dứt điểm vấn đề của bạn chỉ sau một đêm. Mọi nút thắt đều bắt nguồn từ một chuỗi hành động và thói quen trong quá khứ, và cần sự kiên nhẫn tái cấu trúc từ gốc rễ.`,
      factually_known: `Những điều bạn đã biết chắc chắn: Bạn nhận thức rõ ràng bản thân đang gặp trở ngại và bạn có ý chí chủ động tìm kiếm giải pháp. Năng lực nhận thức này chính là tài sản lớn nhất bạn đang nắm giữ.`,
      uncertainty_and_unknowns: `Những yếu tố bạn không thể kiểm soát: Ý kiến của người khác, biến động ngoại cảnh hay tương lai xa. Cố gắng kiểm soát những biến số này chỉ mang lại sự bất an và kiệt sức.`,
      inaction_consequence: matchedDomain.inactionRisk,
      perspective_and_wisdom: `${matchedDomain.stoicPerspective}\n\n${matchedDomain.buddhistPerspective}\n\n${matchedDomain.ichingPerspective}`,
      resolution_path: `1. Phân định rõ ranh giới kiểm soát.\n2. Chấp nhận thực tại với tâm thế bình thản.\n3. Chia nhỏ vấn đề lớn thành các bước hành động tối thiểu.\n4. Thực thi kỷ luật không cảm xúc đối với những việc cần làm.`,
      immediate_action_24h: matchedDomain.action24h,
      short_term_action_7d: matchedDomain.action7d,
      professional_referral_boundary: `Hệ thống chiêm nghiệm Huyền Tâm Minh Đạo đóng vai trò như chiếc gương soi phản chiếu nhận thức triết học. Nếu vấn đề liên quan đến y khoa, pháp lý hoặc tài chính phức tạp, hãy tham khảo ý kiến của luật sư, chuyên gia tài chính hoặc bác sĩ chuyên khoa.`,
    };

    // 4. Tạo nội dung văn bản hoàn chỉnh
    const markdownContent = `## 🏛️ BÀI LUẬN MINH KIẾN: ${matchedDomain.topic.toUpperCase()}

> *"Thấy rõ sự thật – Hiểu mình – Sống tốt hơn"*

---

### 1. 🔍 Thấu Cảm Cảm Xúc & Nhận Diện Hiện Thực
${structuredCandor.user_emotional_state}

${structuredCandor.honest_reality}

---

### 2. ⚖️ Tách Rời Bản Thể & Vòng Tròn Kiểm Soát
- **Dữ kiện thực tế bạn đang nắm giữ:** ${structuredCandor.factually_known}
- **Những biến số bất định nằm ngoài tầm tay:** ${structuredCandor.uncertainty_and_unknowns}
- **Hậu quả nếu tiếp tục trì hoãn:** ${structuredCandor.inaction_consequence}

---

### 3. 📜 Ánh Sáng Triết Lý Cổ Kim Soi Chiếu
${structuredCandor.perspective_and_wisdom}

---

### 4. 🧭 Lộ Trình Tháo Gỡ & Hành Động Thực Chiến
${structuredCandor.resolution_path}

- ⚡ **Hành động cụ thể trong 24 Giờ tới:** ${structuredCandor.immediate_action_24h}
- 📅 **Kế hoạch định hình trong 7 Ngày tới:** ${structuredCandor.short_term_action_7d}

---

*Ghi chú nhân văn: ${structuredCandor.professional_referral_boundary}*
`;

    return {
      session_id: sessionId,
      content: markdownContent,
      structured_candor: structuredCandor,
      model: 'HuyenTam-Wisdom-Autonomous-v3',
      provider: 'Autonomous-Client-Engine',
      credits_deducted: 10,
      safety_action: 'NORMAL',
    };
  }
}
