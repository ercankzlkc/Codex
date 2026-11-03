# Living Kingdom · Yelken Koyu

Three.js, TypeScript ve Vite ile geliştirilmiş, gerçek zamanlı küçük ada yerleşimi.

## Çalıştırma

Node 24 ile `npm ci` ve `npm run dev`. Yayın derlemesi: `npm run build -- --base=/Codex/`.

## Serbest oyun

Tur, hedef veya 15 hamle sınırı yoktur. Başlangıçta merkez önünde bir sakin bulunur. Her ev iki, büyük ev dört yeni sakin getirir. Sakinler kara üzerinden yürür; yakındaki işlere gider, çilek toplar veya ağaç keser, yüklerini uygun depoya taşır. Kaynaklar sadece teslimatta eklenir. Her sakin dakikada 2 yiyecek tüketir. Çilek, buğday ve balık ayrı stoklanır; toplam ve tüketim HUD’da, döküm ise yiyeceğin üzerine gelince görünür. Yiyecek yoksa refah yavaşça azalır; oyun sona ermez.

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

## Yerleştirme ve kıyı sesleri

Tek merkez altıgeni ve bir sakinle başlanır. Ticaret siparişi, köy aşaması veya genişleme/yükseltme hakkı yoktur. Yapı kartları kıyıya bırakıldığında kendi altıgenlerini ekler; yakın bir uygun hücreye hafifçe oturur. Evler yeni sakinleri doğrudan getirir. Depolar odunla yükseltilir.

Dalga kaydının iki kanalı korunur ve stereo alanı hafifçe genişletilir. Kullanıcının sağladığı üç martı kaydının belirgin çağrı bölümleri sırayla çalınır; çağrı başlangıçları arasında 22–26 saniye vardır, yaklaşık dakikada 2–3 çağrı. Ses uçan martıyı izler, kamera yönüyle sağa/sola kayar ve yakınlaştırmayla belirginleşir. Aynı anda tek çağrı duyulur. Sessize alma, gizli sekme ve yeni oyunda ses temizlenir. Martı kayıtları: [ses künyesi](public/audio/CREDITS.txt).

## Ortak görsel stil ve hava

Ev, büyük ev, depo, oduncu ve balıkçı yapıları ortak taş temel, yumuşak ahşap kenarlar, kiremit sıraları, kepenkler ve pencere çerçeveleriyle modellenir. İskelede bağlantı çivileri, depoda sandık ve varil, balıkçıda ağ ve halat detayları bulunur. Ağaçlar, çilekler, çiçekler ve taşlar buğdayın daha ince işlenmiş stiline yaklaşır. Sabit yapı detayları malzemeye göre birleştirilir ve şablon geometrileri paylaşılır.

Güneşin konumu, rengi ve şiddeti tek bir ayardan gelir; yapı gölgeleri ve su yansıması aynı yönü kullanır. Deniz yüzeyi gerçek gölge haritasını alır, çimenler yapı gölgelerini kabul eder. Yansıma dar ve düşük şiddettedir; periyodik parlak çizgiler yerine yumuşak, düzensiz su pürüzleri kullanılır. Gölgedeki suda güneş parıltısı kesilir. Yakınlaştırma sırasında kameranın güvenlik mesafesi değişse de yansıma lekesi büyümez. Ara sıra beliren üç ince rüzgâr izi birkaç saniyede kaybolur; çimenlerin salınımı aynı esintiyle hafifçe güçlenir. Ağaç vuruşları yaprak savurur; yapraklar dönerek düşer, zeminde veya suda kısa süre kalıp kaybolur. Parçacık sayısı sınırlıdır, yeni oyunda temizlenir.
