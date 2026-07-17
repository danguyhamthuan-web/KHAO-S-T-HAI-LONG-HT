/* ============================================================
   CẤU HÌNH KHẢO SÁT SỰ HÀI LÒNG - XÃ HÀM THUẬN
   File dùng chung cho form (index.html) và dashboard
   ============================================================ */

// ⚠️ THAY URL NÀY bằng Web App URL sau khi deploy Apps Script
// (Xem file README.md phần "Triển khai")
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzfXPrTM9ktSXsVJQ2pNE_bYjT6ziSMeKS5J2KtCSuBN8C4ilPlQ16lN5hlPq5WJIFppg/exec';

// Thang điểm: 5 phương án → 100/75/50/25/0
const SCORE_MAP = [100, 75, 50, 25, 0];

// 5 thang đo dùng chung cho các cơ quan (UBND, Đảng, MTTQ)
const SCALES_COMMON = [
  ['Rất tận tình, chu đáo', 'Tận tình, lịch sự', 'Bình thường', 'Chưa nhiệt tình', 'Thái độ không tốt'],
  ['Rất nhanh', 'Khá nhanh', 'Bình thường', 'Khá lâu', 'Rất lâu'],
  ['Sớm hơn hẹn', 'Đúng hẹn', 'Trễ nhẹ, chấp nhận được', 'Trễ hẹn', 'Trễ rất lâu'],
  ['Có xin lỗi, hẹn lại cụ thể', 'Có thông báo lý do', 'Chỉ thông báo chung', 'Không nhận được thông báo', 'Không bị trễ hẹn'],
  ['Rất khang trang', 'Khang trang, đáp ứng tốt', 'Bình thường', 'Chưa đáp ứng tốt', 'Không đáp ứng']
];

// Cấu hình các khối, đơn vị và câu hỏi
const SURVEY_CONFIG = {
  groups: {
    ubnd: {
      label: 'Khối UBND xã',
      icon: '🏛️',
      units: ['Trung tâm Hành chính công', 'Phòng Kinh tế', 'Phòng Văn hóa - Xã hội'],
      fieldSelect: {
        label: 'Lĩnh vực thủ tục hành chính vừa thực hiện:',
        required: true,
        options: [
          'Tư pháp - Hộ tịch (Khai sinh, kết hôn, chứng thực...)',
          'Địa chính - Đất đai - Môi trường',
          'Lao động - Thương binh và Xã hội',
          'Xây dựng - Nhà ở - Đô thị',
          'Công an xã (Hộ khẩu, định danh điện tử...)',
          'Lĩnh vực khác'
        ]
      },
      questions: [
        'Ông/Bà thấy thái độ, tinh thần phục vụ của công chức, viên chức hướng dẫn, tiếp nhận hồ sơ, trả kết quả như thế nào?',
        'Ông/Bà có phải chờ đợi lâu để nộp hồ sơ/nhận kết quả không?',
        'Ông/Bà thấy thời gian cơ quan giải quyết hồ sơ có đúng với thời gian hẹn trên Phiếu hẹn không?',
        'Trường hợp cơ quan giải quyết hồ sơ trễ hẹn, Ông/Bà có nhận được thư xin lỗi và hẹn lại thời gian trả kết quả không?',
        'Ông/Bà có hài lòng về điều kiện cơ sở vật chất, trang thiết bị phục vụ tại trụ sở cơ quan không?'
      ],
      scales: SCALES_COMMON,
      qLabels: ['Thái độ', 'Chờ đợi', 'Đúng hẹn', 'Xin lỗi trễ', 'CSVC']
    },

    dang: {
      label: 'Khối cơ quan Đảng',
      icon: '⭐',
      units: ['Văn phòng Đảng ủy', 'Ban Xây dựng Đảng', 'Cơ quan UBKT Đảng ủy'],
      fieldSelect: null,
      questions: [
        'Ông/Bà thấy thái độ, tinh thần phục vụ của cán bộ cơ quan Đảng khi hướng dẫn, tiếp nhận và giải quyết công việc như thế nào?',
        'Ông/Bà có phải chờ đợi lâu để được giải quyết công việc không?',
        'Công việc có được giải quyết đúng thời gian đã hẹn/thông báo không?',
        'Trường hợp giải quyết chậm, Ông/Bà có nhận được thông báo lý do và thời gian dự kiến hoàn thành không?',
        'Ông/Bà có hài lòng về điều kiện cơ sở vật chất, trang thiết bị phục vụ tại trụ sở cơ quan không?'
      ],
      scales: SCALES_COMMON,
      qLabels: ['Thái độ', 'Chờ đợi', 'Đúng hẹn', 'TB chậm', 'CSVC']
    },

    mttq: {
      label: 'UBMTTQVN xã',
      icon: '🤝',
      units: ['UBMTTQVN xã Hàm Thuận'],
      fieldSelect: null,
      questions: [
        'Ông/Bà thấy thái độ, tinh thần phục vụ của cán bộ Mặt trận khi tiếp nhận, giải quyết kiến nghị, phản ánh của nhân dân như thế nào?',
        'Ông/Bà có phải chờ đợi lâu để được tiếp nhận và xử lý phản ánh, kiến nghị không?',
        'Kiến nghị, phản ánh của Ông/Bà có được phản hồi, giải quyết đúng thời gian đã thông báo không?',
        'Trường hợp phản hồi chậm, Ông/Bà có nhận được thông báo lý do và thời gian dự kiến giải quyết không?',
        'Ông/Bà có hài lòng về điều kiện cơ sở vật chất, trang thiết bị phục vụ tại trụ sở UBMTTQVN xã không?'
      ],
      scales: SCALES_COMMON,
      qLabels: ['Thái độ', 'Chờ đợi', 'Đúng hẹn', 'TB chậm', 'CSVC']
    },

    thon: {
      label: 'Khối Thôn',
      icon: '🏘️',
      units: ['Đức Hòa', 'Hàm Đức', 'Tùy Hòa', 'Tầm Hưng', 'Ma Lâm', 'Lâm Hòa', 'Thuận Minh', 'Ku Kê'],
      fieldSelect: null,
      questions: [
        'Ông/Bà đánh giá thế nào về việc lắng nghe và tiếp thu các ý kiến, kiến nghị của nhân dân từ phía Ban điều hành thôn?',
        'Các thông tin, chủ trương của Đảng, chính sách, pháp luật của Nhà nước và quy định của địa phương có được thôn truyền đạt đến Ông/Bà đầy đủ, kịp thời không?',
        'Ban điều hành thôn có kịp thời tổng hợp và phản ánh các tâm tư, nguyện vọng, kiến nghị của người dân lên chính quyền cấp trên để giải quyết không?',
        'Việc công khai, minh bạch các khoản thu, chi và sử dụng các nguồn kinh phí đóng góp của nhân dân tại thôn được thực hiện như thế nào?',
        'Ông/Bà đánh giá như thế nào về tình hình an ninh, trật tự an toàn xã hội trên địa bàn thôn hiện nay?',
        'Ông/Bà đánh giá thế nào về công tác giữ gìn vệ sinh môi trường, thu gom rác thải và cảnh quan chung của thôn hiện nay?'
      ],
      scales: [
        ['Rất tích cực, luôn lắng nghe và tiếp thu', 'Tích cực, có lắng nghe và tiếp thu', 'Bình thường (lúc nghe lúc không)', 'Ít lắng nghe, chưa thực sự tiếp thu', 'Thờ ơ, hoàn toàn không lắng nghe'],
        ['Rất đầy đủ, kịp thời', 'Đầy đủ, kịp thời', 'Bình thường (chỉ biết khi chủ động hỏi)', 'Chậm trễ, thiếu thông tin', 'Hoàn toàn không được thông báo'],
        ['Rất kịp thời và sát sao', 'Kịp thời', 'Bình thường', 'Còn chậm trễ, đùn đẩy', 'Không phản ánh, không quan tâm'],
        ['Rất công khai, rõ ràng và minh bạch', 'Công khai, rõ ràng', 'Bình thường', 'Chưa rõ ràng, còn mập mờ', 'Hoàn toàn không công khai'],
        ['Rất tốt (Rất an toàn, không có tệ nạn)', 'Tốt (Ổn định, an toàn)', 'Bình thường', 'Chưa tốt (Thỉnh thoảng còn trộm cắp, mất an ninh)', 'Rất kém (Phức tạp, thường xuyên mất an ninh)'],
        ['Rất sạch đẹp, rác thải được xử lý rất tốt', 'Sạch sẽ, môi trường đảm bảo', 'Bình thường', 'Chưa tốt (Còn rác thải bừa bãi, ô nhiễm cục bộ)', 'Rất kém (Ô nhiễm nghiêm trọng, mất vệ sinh chung)']
      ],
      qLabels: ['Lắng nghe', 'Thông tin', 'Phản ánh', 'Công khai', 'An ninh', 'VSMT']
    }
  },

  // Lĩnh vực cho phần đăng ký hỗ trợ
  supportFields: [
    'Tư pháp - Hộ tịch',
    'Địa chính - Đất đai - Môi trường',
    'Lao động - Thương binh và Xã hội',
    'Xây dựng - Nhà ở - Đô thị',
    'Công an xã (Hộ khẩu, định danh...)',
    'Công tác Đảng',
    'Mặt trận - Đoàn thể',
    'Lĩnh vực khác'
  ]
};

// Cấu hình chống gian lận
const FRAUD_CONFIG = {
  cooldownHours: 12,        // Thời gian chặn gửi lại trên cùng trình duyệt (giờ)
  minFillSeconds: 5,        // Điền form dưới số giây này → nghi vấn
  duplicateThreshold: 3     // Cùng 1 máy gửi ≥ số lần này → gắn cờ
};

// Export cho môi trường module (dashboard có thể import)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SURVEY_CONFIG, SCORE_MAP, FRAUD_CONFIG, APPS_SCRIPT_URL };
}
