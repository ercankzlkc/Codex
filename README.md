# Living Kingdom · Yelken Koyu

Three.js, TypeScript ve Vite ile geliştirilmiş, 15 turluk minyatür ada strateji oyunu.

## Çalıştırma

Node 22.12+ ile `npm install` ve `npm run dev`. Üretim çıktısı için `npm run build`, çıktıyı yerelde denemek için `npm run preview`. Kural testleri için Node 24 ile `node --experimental-strip-types verify.mjs`.

## Oynanış

Koşu denizin ortasındaki tek bir krallık merkeziyle başlar. Üç karttan birini kenarı vurgulanan bir altıgene sürükleyin. Yeni kara en az bir kenarıyla adaya bağlanmalıdır. İsterseniz kartı seçip hedefe tıklayın. Esc kartı geri alır. Anlık kartlar mevcut bir toprağa veya ekrandaki anlık etki hedefine bırakılır. Bu kartlar yeni kara oluşturmaz.

Merkez her tur 2 odun, bir çalışanla 4 yiyecek sağlar. Tur sonunda her kişi 1 yiyecek tüketir. Önce yiyecek işçileri atanır. Yeterli çalışan bulamayan yapılar üretim yapamaz. Açlık 1 nüfus ve 14 refah kaybettirir. 15. turun sonunda en az 10 nüfus ve 50 refahla kazanılır. Nüfus veya refah sıfıra düşerse koşu erken biter. En fazla 15 yeni altıgen oluşabilir.

Orman her komşu ormandan +1, her çalışan komşu oduncudan +2 odun alır. Çilek bahçesi komşu ormandan +1 yiyecek alır. Evler bahçelerle, çiftlikler depolarla güçlenir. Bonuslar yalnızca altı ortak kenar yönünde hesaplanır. Orman yoğunluğu oduncu şansını artırır. Altı nüfusta çiftlik ve büyük ev açılır. Erzak sıkıntısı kurtarıcı kartları sıklaştırır.

## Kontroller ve ses

Sağ fareyle döndürün, orta fare veya Shift + sağ fareyle kaydırın, tekerlekle yakınlaşın. H büyüyen adanın varsayılan kadrajına döner. Kamera kart taşınırken sabit kalır. Kart seçiliyken fare tekerleği veya R yapıyı 60° döndürür; Shift + R ters yönde döndürür. Seçilen yön yerleştirmede korunur. Mevcut altıgene tıklayarak yapıyı yeniden döndürebilir veya yıkabilirsin. Yıkım kaynak iadesi vermez, nüfusu ya da turu değiştirmez; kaldırılan yapı sonraki turlarda üretim yapmaz. Krallık merkezi korunur. Genel ses, efekt, kıyı ambiyansı ve sessiz ayarlarına soru işaretinden ulaşılır. Tarayıcının ses izni için ilk tıklama veya tuş gerekir. Ses tercihi yerelde saklanır, sayfayı yenilemek yeni bir koşu başlatır.

Sesler yerel örneklerden çalınır. Kenney'nin kart ve darbe kayıtları ile RandomMind'ın dalga kaydının kaynak ve CC0 bilgileri [ses künyesinde](public/audio/CREDITS.txt) bulunur.

## Proje

- `src/hex.ts` iki eksenli koordinatlar, dünya dönüşümü, altı komşu, genişleme alanı ve kıyı kenarları.
- `src/game.ts` kart havuzu, geçerli hamle, komşuluk önizlemesi, üretim, işçiler ve tur sonu.
- `src/grid.ts`, `src/drag.ts` ve `src/camera.ts` hedef seçimi, kart hareketleri ve ada kadrajı.
- `src/scenery.ts` ve `src/environment.ts` birleşen arazi yüzeyleri, kum kıyılar, deniz tabanı, su ve kıyıya olan mesafe dokusu. Doku yalnızca ada şekli değiştiğinde üretilir.
- `src/world.ts` ve `src/models.ts` modeller, kart resimleri, kara yükselişi, inşa ve üretim animasyonları.
- `src/sound.ts` örnek tabanlı ses oynatıcı ve ses seviyeleri.
- `verify.mjs` koordinat ve kıyı kontrolleri, geçersiz hamleler, komşuluk, kaynak muhasebesi ve 100 tekrarlanabilir koşu.
