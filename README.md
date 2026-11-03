# Living Kingdom · Yelken Koyu

Three.js, TypeScript ve Vite ile geliştirilmiş, gerçek zamanlı küçük ada yerleşimi.

## Çalıştırma

Node 24 ile `npm ci` ve `npm run dev`. Yayın derlemesi: `npm run build -- --base=/Codex/`.

## Serbest oyun

Tur, hedef veya 15 hamle sınırı yoktur. Başlangıçta merkez önünde bir sakin bulunur. Her ev iki, büyük ev dört yeni sakin getirir. Sakinler kara üzerinden yürür; yakındaki işlere gider, çilek toplar veya ağaç keser, yüklerini kapsama alanındaki depoya taşır. Kaynaklar sadece teslimatta eklenir. Her sakin dakikada 2 yiyecek tüketir. Çilek, buğday ve balık ayrı stoklanır; toplam ve tüketim HUD’da, döküm ise yiyeceğin üzerine gelince görünür. Yiyecek yoksa refah yavaşça azalır; oyun sona ermez.

Merkez deposunun kapsaması 2, depoların kapsaması 3 altıgendir. Kapsama dışında kalan kaynaklara depo kurmak gerekir. Merkez deposu 80, yeni depolar 60 ürün alır; depo panelinden odunla yükseltmek kapasiteyi aynı miktarda artırır. Dolu depoya giden sakin başka uygun depo arar. Ormanlar ve oduncu kulübeleri odun miktarını, komşu ormanlar çilek verimini artırır. Ağaçlar, çilekler, buğday ve çiçekler 30 saniyede yenilenir; küçük halkalar kalan süreyi gösterir. Hasatta ürünler kademeli azalır. Balıkçı iskelesi açık denize yönelir; son su komşusu yapı ile kapatılamaz. Balıkçılar kıyıdaki iskelelerinden olta atar; yakalanan balık teslimatta stoğa eklenir.

## İş öncelikleri

Sağ alttaki Görevler panelinde odun, çilek, buğday ve balık ağırlıklarını ayarlayın. Yüzdeler mevcut işlere göre çalışan hedeflerine dönüşür; taşıma halindeki sakinler teslimatlarını bitirir. Çalışanlar yapıların çevresinde yol bulur, birbirlerine yol verir ve kullandıkları yerde patikalar oluşur. Takılan sakinler alternatif rota ve depo girişleri arar. Başlarının üzerindeki küçük ikonlar toplama, taşıma, yemek, dinlenme ve dolu depo durumlarını gösterir.

## Kontroller

- Kartları kıyıdaki boş altıgenlere sürükleyin.
- Seçili kartı veya yapıyı tekerlek / R ile döndürün; Shift + R ters yöndür.
- Sağ fareyle 360° döndürün, orta fare veya Shift + sağ fareyle kaydırın.
- Tekerlekle yakınlaşın, H ile adayı ortalayın, Esc ile seçimi bırakın.
- Mevcut altıgene tıklayarak döndürün veya yıkın. Merkez korunur; yıkım kaynak vermez.
- Depo seçiliyken ve yerleştirirken toplama alanı görünür.
- Altıgen bilgileri, zemini kapatmayacak şekilde farenin yanında gösterilir.

Sesler yerel örneklerden çalınır. Kaynaklar ve lisanslar: [ses künyesi](public/audio/CREDITS.txt).

Bu geliştirme aşamasında oyun ve cihaz denemeleri kullanıcı tarafından yapılır.
