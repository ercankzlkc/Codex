# Proje tercihleri

- Commit başlıklarını ve açıklamalarını Türkçe yaz. Açıklama gövdesinde yapılan somut değişiklikleri kısa ve anlamlı maddelerle anlat; gereksiz maddeler ekleme.
- Kaynak ve yayın depolarında yerel Git kimliğini `ercankzlkc <ercankzlkc@users.noreply.github.com>` olarak ayarla.
- Steam/masaüstüne odaklan; kullanıcı istemedikçe mobil çalışma yapma.
- Oyun, tarayıcı ve otomatik testleri kullanıcı yapar. İstenmedikçe çalıştırma; yayın derlemesini Cloudflare Pages `npm run build` ile alır.
- Kaynak kodu GitHub `main` dalında tutulur. Yayın Cloudflare Pages Git bağlantısıyla otomatik yapılır: `https://yelken-koyu.pages.dev`. GitHub Actions kullanılmaz ve `gh-pages` dalı güncellenmez. Cloudflare ayarları: üretim dalı `main`, derleme `npm run build`, çıktı `dist`, `NODE_VERSION=24`. Kaynakta node_modules ve dist takip edilmez.
