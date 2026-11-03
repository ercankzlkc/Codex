# Living Kingdom · Yelken Koyu

Three.js, TypeScript ve Vite ile geliştirilmiş, gerçek zamanlı küçük ada yerleşimi.

## Çalıştırma

Node 24 ile `npm ci` ve `npm run dev`. Yayın derlemesi: `npm run build -- --base=/Codex/`.

## Üretim ve kıyı ticareti

Ana döngü: **üret → depoya taşı → siparişi gönder → üç karttan birini seç**. Sol üstteki Kıyı Ticareti paneli mevcut siparişi, depodaki ilerlemeyi ve ödülü gösterir. Süre sınırı yoktur. İlk sefer 20 odun ve 10 çilek ister; sonraki seferler buğday, balık ve taş üretimini tanıtır. Gönderilen ürünler hem toplam stoktan hem depolardan düşer. Köyün 30 saniyelik yiyeceği gönderilemez. Her sefer +4 refah ve bir yapı kartı verir; ödülün kurulum bedeli geçerlidir. Çiftlik ve balıkçı ilk, taş ocağı ikinci, büyük ev üçüncü seferden sonra kart havuzuna açılır. Eksik temel üretim kartları çekilişte korunur; başlangıç eli orman, çilek bahçesi ve evdir.

Başlangıçta merkez önünde bir sakin bulunur. Ev iki, büyük ev dört yeni sakin getirir; taşınma sırasıyla 4 ve 8 yiyecek harcar. Taşınmadan sonraki toplam nüfus için ayrıca 30 saniyelik yiyecek depoda kalmalıdır. Her sakin dakikada 2 yiyecek tüketir. Üstteki sofra satırı stokun kaç dakika yeteceğini ve son teslimatlardan hesaplanan üretim/tüketim temposunu gösterir. Açlık refahı azaltır ve yürümeyi/çalışmayı en fazla %25 yavaşlatır; yiyecek geldikçe toparlanır, oyun sona ermez. Stok bir dakikanın altındaysa en az bir çalışan yiyeceğe ayrılır; tüm yiyecek önceliklerini sıfırlamak bu yardımı kapatır. Stok azalınca görünen Acil Hasat en fazla 12 yiyecek verir, 5 refah harcar ve kartla ortak 90 saniye bekleme süresine sahiptir; depo kapasitesini aşmaz.

Sakinler kara üzerinden yürür; ürünleri uygun depoya taşır. Yüklü yürüyüş hızı normalin %78'idir; uzun yol gerçekten daha seyrek teslimat demektir. İş seçiminde hem kaynağa hem depoya mesafe dikkate alınır. Üretim altıgeninin bilgi paneli depo mesafesini, tamamlanan seferlerden ölçülen yüklü yürüyüş ve toplam teslimat süresini gösterir. Yakına depo kurmak taşıma süresini azaltır. Kaynaklar yalnızca teslimatta eklenir. Çilek, buğday ve balık ayrı stoklanır; döküm yiyecek göstergesinin üzerinde görünür.

Depolarda kapsama yarıçapı yoktur; adanın her yerinden ürün teslim edilebilir. Merkez deposu 80, yeni depolar 60 ürün alır; depo panelinden odunla yükseltmek kapasiteyi aynı miktarda artırır. Dolu depoya giden sakin başka uygun depo arar; dolu deponun üzerinde hareketli bir uyarı görünür. Ormanlar ve oduncu kulübeleri odun miktarını, komşu ormanlar çilek verimini artırır. Ağaçlar, taş damarları, çilekler, buğday ve çiçekler 30 saniyede yenilenir; küçük halkalar kalan süreyi gösterir. Hasatta ürünler kademeli azalır. Balıkçı iskelesi açık denize yönelir; son su komşusu yapı ile kapatılamaz. Balıkçılar kıyıdaki iskelelerinden olta atar; yakalanan balık teslimatta stoğa eklenir.

Taş Ocağı kartında köylüler kazmayla çalışır; vuruşlarda kaya sallanır, küçük kıvılcım ve taş parçaları çıkar. Ağaç kesimi 6, taş çıkarma 6,8 saniye sürer. Taş, odun ve yiyecekle birlikte HUD’da ve depolarda ayrı stoklanır. Kaynak sayaçları yumuşak geçişlerle değişir; artış yeşil, azalış kırmızı görünür.

Martılar kullanıcı tarafından sağlanan rigli GLB modeli ve `ArmatureAction` animasyonuyla kıyıda uçar; model ve lisans bilgileri [model künyesinde](public/models/CREDITS.txt) bulunur. balıklar ara sıra sudan kavis çizerek atlar. Balıkçı iskelesi açık denize otomatik yönelir ve köylü iskelenin ucunda çalışır; R ile başka bir açık su yönü seçilebilir.

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

Ormanlar 10 farklı ağaç çeşidinden üç ağacın çimenli alana rastgele dağıtılmasıyla oluşur. Kesilen ağaç devrilir, toz bulutu çıkarır ve kütükler yerçekimi, sekme, sürtünme ve birbirleriyle temasla yere yerleşir. Çalışan kütüklere yürür, eğilerek alır ve depoya taşır. Elde taşınan balık, çilek, buğday, taş ve odun ayrı modellerle görünür. Çimenler kökleri sabit kalacak şekilde farklı fazlarda rüzgârda salınır. Taşların çarpışma alanları gerçek konumlarını izler; kazma iki elle baş üstünden savrulur ve parçalar yere düşüp seker. Depo yükseltmesi kapasite önizlemesi, seviye işaretleri, sandıklar ve bildirimle gösterilir.

Çimenlerde beyaz çiçek/taş süsleri bulunmaz; çimler altıgenin yeşil yüzeyine rastgele yayılır ve model sınırlarından uzak tutulur. Buğday başakları çift sıralı taneler, kılçıklar ve yapraklarla modellenir. Kazma başı dikey vuruş düzlemindedir; kırılma anında toz ve sekerek dökülen parçalar çıkar. Sağ tuşla kamera daha alçak ve daha yüksek açılara dönebilir; alt açı deniz ve model yüksekliğine göre sınırlandırılır.
