/* ============================================================
   DẤU VÂN TAY THIẾT BỊ (Device Fingerprint)
   Tạo mã định danh gần như duy nhất cho mỗi trình duyệt/máy
   dựa trên: canvas, độ phân giải, timezone, ngôn ngữ, UA...
   Dùng để phát hiện 1 máy gửi nhiều phiếu.
   ============================================================ */

function getDeviceFingerprint() {
  const components = [];

  // 1. Thông tin cơ bản trình duyệt
  components.push(navigator.userAgent || '');
  components.push(navigator.language || '');
  components.push((navigator.languages || []).join(','));
  components.push(navigator.platform || '');
  components.push(navigator.hardwareConcurrency || '');
  components.push(navigator.deviceMemory || '');
  components.push(navigator.maxTouchPoints || '');

  // 2. Màn hình
  components.push(screen.width + 'x' + screen.height);
  components.push(screen.colorDepth || '');
  components.push(screen.pixelDepth || '');
  components.push(window.devicePixelRatio || '');

  // 3. Timezone
  try {
    components.push(Intl.DateTimeFormat().resolvedOptions().timeZone || '');
  } catch (e) { components.push(''); }
  components.push(new Date().getTimezoneOffset());

  // 4. Canvas fingerprint (mỗi GPU/driver render hơi khác nhau)
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 240; canvas.height = 60;
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '16px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(10, 10, 100, 30);
    ctx.fillStyle = '#069';
    ctx.fillText('HamThuan_KSHT_2026', 12, 15);
    ctx.fillStyle = 'rgba(102,204,0,0.7)';
    ctx.fillText('Khảo sát', 14, 32);
    components.push(canvas.toDataURL());
  } catch (e) { components.push('no-canvas'); }

  // 5. WebGL renderer (loại card đồ họa)
  try {
    const gl = document.createElement('canvas').getContext('webgl');
    if (gl) {
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      if (dbg) {
        components.push(gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) || '');
        components.push(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '');
      }
    }
  } catch (e) { components.push('no-webgl'); }

  // Băm chuỗi thành mã ngắn
  const raw = components.join('###');
  return 'FP-' + hashString(raw);
}

// Hàm băm đơn giản (djb2) → chuỗi hex 8 ký tự
function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash; // giữ 32-bit
  }
  // Chuyển sang hex không dấu
  return (hash >>> 0).toString(16).padStart(8, '0');
}
