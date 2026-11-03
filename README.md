# Living Kingdom · Yelken Koyu

Three.js, TypeScript ve Vite ile geliştirilmiş, gerçek zamanlı küçük ada yerleşimi.

## Çalıştırma

Node 24 ile `npm ci` ve `npm run dev`. Yayın derlemesi: `npm run build -- --base=/Codex/`.

## Serbest oyun

Tur, hedef veya 15 hamle sınırı yoktur. Başlangıçta merkez önünde bir sakin bulunur. Her ev iki, büyük ev dört yeni sakin getirir. Sakinler kara üzerinden yürür; yakındaki işlere gider, çilek toplar veya ağaç keser, yüklerini uygun depoya taşır. Kaynaklar sadece teslimatta eklenir. Her sakin dakikada 2 yiyecek tüketir. Çilek, buğday ve balık ayrı stoklanır; toplam ve tüketim HUD’da, döküm ise yiyeceğin üzerine gelince görünür. Yiyecek yoksa refah yavaşça azalır; oyun sona ermez.

Depolarda kapsama yarıçapı yoktur; adanın her yerinden ürün teslim edilebilir. Merkez deposu 80, yeni depolar 60 ürün alır; depo panelinden odunla yükseltmek kapasiteyi aynı miktarda artırır. Dolu depoya giden sakin başka uygun depo arar; dolu deponun üzerinde hareketli bir uyarı görünür. Ormanlar ve oduncu kulübeleri odun miktarını, komşu ormanlar çilek verimini artırır. Ağaçlar, taş damarları, çilekler, buğday ve çiçekler 30 saniyede yenilenir; küçük halkalar kalan süreyi gösterir. Hasatta ürünler kademeli azalır. Balıkçı iskelesi açık denize yönelir; son su komşusu yapı ile kapatılamaz. Balıkçılar kıyıdaki iskelelerinden olta atar; yakalanan balık teslimatta stoğa eklenir.

Taş Ocağı kartında köylüler kazmayla çalışır; vuruşlarda kaya sallanır, küçük kıvılcım ve taş parçaları çıkar. Ağaç kesimi 6, taş çıkarma 6,8 saniye sürer. Taş, odun ve yiyecekle birlikte HUD’da ve depolarda ayrı stoklanır. Kaynak sayaçları yumuşak geçişlerle değişir; artış yeşil, azalış kırmızı görünür.

Martılar kıyıda uçar; balıklar ara sıra sudan kavis çizerek atlar. Balıkçı iskelesi açık denize otomatik yönelir ve köylü iskelenin ucunda çalışır; R ile başka bir açık su yönü seçilebilir.

## İş öncelikleri

Sağ alttaki Görevler panelinde odun, taş, çilek, buğday ve balık ağırlıklarını ayarlayın. Yüzdeler mevcut işlere göre çalışan hedeflerine dönüşür; taşıma halindeki sakinler teslimatlarını bitirir. Çalışanlar yapıların çevresinde yol bulur, birbirlerine yol verir ve kullandıkları yerde patikalar oluşur. Takılan sakinler alternatif rota ve depo girişleri arar. Başlarının üzerindeki Font Awesome ikonları toplama, taşıma, yemek, dinlenme ve dolu depo durumlarını gösterir. Yürürken hedef işin ikonu görünür; kamera uzaklaştığında baloncuklar küçülerek kaybolur.

## Kontroller

- Kartları kıyıdaki boş altıgenlere sürükleyin.
- Seçili kartı veya yapıyı tekerlek / R ile döndürün; Shift + R ters yöndür.
- Sağ fareyle 360° döndürün, orta fare veya Shift + sağ fareyle kaydırın.
- Tekerlekle yakınlaşın, H ile adayı ortalayın, Esc ile seçimi bırakın.
- Mevcut altıgene tıklayarak döndürün veya yıkın. Merkez korunur; yıkım kaynak vermez.
- Depoyu seçerek kapasitesini görün veya odunla yükseltin.
- Altıgen bilgileri, zemini kapatmayacak şekilde farenin yanında gösterilir.

Sesler yerel örneklerden çalınır. Kaynaklar ve lisanslar: [ses künyesi](public/audio/CREDITS.txt).

Bu geliştirme aşamasında oyun ve cihaz denemeleri kullanıcı tarafından yapılır.

İkonlar: [Font Awesome Free](https://fontawesome.com/), CC BY 4.0 / MIT. Lisanslar: [ikonlar](public/licenses/fontawesome-icons.txt), [SVG çekirdeği](public/licenses/fontawesome-core.txt).
