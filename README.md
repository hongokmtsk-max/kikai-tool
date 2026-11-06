# 機械設計ツール (kikai-tool)

Ứng dụng tra cứu cơ khí dạng PWA, cài được trên máy tính và điện thoại, chạy offline.

## Module
- [x] はめあい計算 (ISO 286-1:2010 / JIS B 0401-1:2016, 0–500 mm)
- [ ] ねじ
- [ ] 材料

## Cấu trúc
- `src/tol.js` — logic tính dung sai (bảng IT, sai lệch cơ bản)
- `src/ui.part.html` — giao diện
- `build.py` — ghép thành `index.html` (chạy `python3 build.py` sau khi sửa src)
- `sw.js`, `manifest.json`, `icons/` — phần PWA (cài đặt + offline). Sửa file thì tăng `VERSION` trong `sw.js`.
- `test/tol.test.js` — đối chiếu với bảng ISO 286-2 (`cd test && node tol.test.js`)

Bản thử nghiệm: đối chiếu với bảng JIS trước khi dùng cho bản vẽ quan trọng.
