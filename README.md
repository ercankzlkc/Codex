# Living Kingdom · Yelken Koyu

Three.js, TypeScript ve Vite ile geliştirilmiş, gerçek zamanlı küçük ada yerleşimi.

## Çalıştırma

Node 24 ile `npm ci` ve `npm run dev`. Yayın derlemesi: `npm run build`.

## Serbest oyun

Tur, hedef veya 15 hamle sınırı yoktur. Başlangıçta merkez önünde bir sakin bulunur. Her ev iki, büyük ev dört yeni sakin getirir. Sakinler kara üzerinden yürür; yakındaki işlere gider, çilek toplar veya ağaç keser, yüklerini uygun depoya taşır. Kaynaklar sadece teslimatta eklenir. Her sakin dakikada 2 yiyecek tüketir. Çilek, buğday ve balık ayrı stoklanır; toplam ve tüketim HUD’da, döküm ise yiyeceğin üzerine gelince görünür. Yiyecek yoksa refah yavaşça azalır; oyun sona ermez.

Depolarda kapsama yarıçapı yoktur; adanın her yerinden ürün teslim edilebilir. Merkez deposu 80, yeni depolar 60 ürün alır; depo panelinden odunla yükseltmek kapasiteyi aynı miktarda artırır. Dolu depoya giden sakin başka uygun depo arar; dolu deponun üzerinde hareketli bir uyarı görünür. Ormanlar ve oduncu kulübeleri odun miktarını, komşu ormanlar çilek verimini artırır. Ağaçlar, taş damarları, çilekler, buğday ve çiçekler 30 saniyede yenilenir; küçük halkalar kalan süreyi gösterir. Hasatta ürünler kademeli azalır. Balıkçı iskelesi açık denize yönelir; son su komşusu yapı ile kapatılamaz. Balıkçılar kıyıdaki iskelelerinden olta atar; yakalanan balık teslimatta stoğa eklenir.

Taş Ocağı kartında köylüler kazmayla çalışır; vuruşlarda kaya sallanır, küçük kıvılcım ve taş parçaları çıkar. Ağaç kesimi 6, taş çıkarma 6,8 saniye sürer. Taş, odun ve yiyecekle birlikte HUD’da ve depolarda ayrı stoklanır. Kaynak sayaçları yumuşak geçişlerle değişir; artış yeşil, azalış kırmızı görünür.

Beş martının üçü önceki uçuş hızını korur; ikisi sırasıyla 1,55 ve 1,85 kat hızlı uçar. Hızlı kuşların kanat vuruşu hafif hızlanır. Martılar iki yönde, birbirinden ayrı yarıçap ve yükseklik hatlarında uçar; ada büyürken merkez ve yarıçap, dönüşlerde yön yumuşakça değişir. Martılar kullanıcı tarafından sağlanan rigli GLB modeli ve `ArmatureAction` animasyonuyla kıyıda uçar; model ve lisans bilgileri [model künyesinde](public/models/CREDITS.txt) bulunur. balıklar ara sıra sudan kavis çizerek atlar. Balıkçı iskelesi açık denize otomatik yönelir ve köylü iskelenin ucunda çalışır; R ile başka bir açık su yönü seçilebilir.

## Altın, gelişim ve ticaret

HUD altını ayrı hazine olarak gösterir; altın depo kapasitesini kullanmaz. Başlangıçta 10 altın verilir. Kartların üzerinde ortalanan ince, oval Kartları yenile düğmesi modal açmadan, toplam 5 altın karşılığında üç kartı birden yeniler. Önceki elin dışında kalan kartlar yeterliyse onlardan çekilir; liman ödülü kullanılana kadar korunur. Eski el çekilerek ayrılır; yeni kartlar kısa aralıklarla sırayla yükselerek gelir. Yerleştirme sonrasındaki yeni el de aynı animasyonla dağıtılır.

| Nüfus | Aşama | Açılan kartlar / özellik | Altın ödülü |
| --- | --- | --- | --- |
| 10 | Küçük Yerleşim | Depo, Oduncu Kulübesi | 10 |
| 24 | Köy | Çiftlik, Bahçe | 15 |
| 40 | Gelişen Köy | Büyük Ev, Şenlik | 20 |
| 60 | Kıyı Kasabası | Liman kartı doğrudan hediye | 25 |
| 100 | Ticaret Kasabası | Tüccar ziyaretinde 40 ürün kapasitesi | 40 |

Her eşik bir kez ödüllendirilir. Modal yeni kartları eldeki kartlarla aynı görsellerle gösterir; açılanlar sonraki çekilişlere girer. HUD’daki nüfus göstergesi sonraki ödül eşiğini gösterir. Nüfusa tıklayarak görev paneli ve yerleşim gelişimi açılır. Pencereler açıkken köylüler, tüketim ve ticaret saati durur.

Ücretsiz oynanan kart yoktur: orman 2 odun, çilek bahçesi 3 odun, acil hasat 2 odun ister. İlk orman kurulana kadar başka kartlar için 2 odun rezervi korunur; yeniden orman kuracak kaynak yokken son orman yıkılamaz. Yapılarda odun/taş, bahçede taş/yiyecek, şenlikte yiyecek/altın kullanılır. Tüm maliyetler kartta gösterilir; harcamalar gerçek depo stoklarından düşer.

Liman 24 odun ve 16 taşla kıyıya kurulur; köyde yalnızca bir liman bulunur ve son su komşusu kapatılamaz. Ödül kartı kullanılana kadar elde ayrı tutulur, rastgele çekilişte kaybolmaz ve altınla değiştirilemez. Yıkılırsa tekrar inşa için geri gelir. İlk tüccar kurulumla gelir; sonraki ziyaretler 120 saniyede bir gerçekleşir. Geminin ticaret penceresi 40 saniye, alış kapasitesi ilk etapta 20 üründür. Liman altıgeni seçilerek açılan ticaret panelinde en fazla 5'er adet satılır: odun/çilek 1, taş/buğday 2, balık 3 altın. Satış hem toplam stoktan hem depolardan düşer.

Yayın GitHub `main` üzerinden Cloudflare Pages tarafından otomatik derlenir; kaynak ve yayın için ayrı dal kullanılmaz.

### Ücretsiz Workers adresi

`pages.dev` adresine erişilemeyen ağlarda alternatif olarak aynı depo Cloudflare Workers Static Assets ile de yayınlanabilir. `wrangler.worker.jsonc` bu ek yayın için hazırdır; yalnızca statik dosya sunar.

Cloudflare Workers & Pages → Create application → GitHub deposu `ercankzlkc/Codex` seçilir. Worker adı `codex`, üretim dalı `main`, build command `npm run build`, deploy command `npx wrangler deploy --config wrangler.worker.jsonc`, root directory depo kökü ve `NODE_VERSION=24` kullanılır. Free plan seçilir. Cloudflare hesabında oluşturulduktan sonra verilen `workers.dev` adresi kullanılır. Bu alan adına ağdan erişim ayrıca denenmelidir.

## Köylü görevleri

Üstteki nüfus göstergesine tıklayarak Köylüler panelini açın. İşler yüzde yerine tam kişi sayılarıyla gösterilir; bir köylü tek göreve ayrılır. Varsayılan otomatik dağılım, mevcut alanların kapasitesini aşmadan köylüleri işlere yerleştirir. + tek tıkla bir köylü atar; boşta kimse yoksa en kalabalık diğer görevden birini aktarır. − bir köylüyü boşta bırakır. Atamayı değiştirmek elle dağılıma geçirir; yeni gelenler bu modda ayrılabilir olarak bekler. Otomatik dağıt düğmesi otomatik yönetime döner. Çalışma alanı kurulmamış satırlar gizlenir; kapasite dolduğunda + kapanır. Bahçe çalışanları da aynı toplam içinde sayılır. Taşıma halindeki sakinler görev değiştirirken teslimatlarını bitirir.

Çalışanlar yapıların çevresinde yol bulur ve kullandıkları yerde patikalar oluşur. Köylüler hareket sırasında birbirini engellemez; kişi çarpışması ve rota kalabalık cezası kapalıdır. Bina ve kara sınırı kontrolleri devam eder. Depolarda boş kapılar tercih edilir; tümü doluysa teslimat kalıcı olarak kilitlenmez. Takılan sakinler alternatif rota ve depo girişleri arar. Başlarının üzerindeki Font Awesome ikonları toplama, taşıma, yemek, dinlenme ve dolu depo durumlarını gösterir. Yürürken hedef işin ikonu görünür; kamera uzaklaştığında baloncuklar küçülerek kaybolur.

## Kontroller

- Kartları kıyıdaki boş altıgenlere sürükleyin.
- Seçili kartı veya yapıyı tekerlek / R ile döndürün; Shift + R ters yöndür.
- Sağ fareyle 360° döndürün, orta fare veya Shift + sağ fareyle kaydırın.
- Tekerlekle yakınlaşın, Home ile adayı ortalayın, Esc ile seçimi bırakın.
- Mevcut altıgene tıklayarak döndürün veya yıkın. Merkez korunur; yıkım kaynak vermez.
- Depoyu seçerek kapasitesini görün veya odunla yükseltin.
- Altıgen bilgileri, zemini kapatmayacak şekilde farenin yanında gösterilir.

Sesler yerel örneklerden çalınır. Balta/kazma vuruşları, ağaç/taş kırılması, çilek toplama ve buğday biçme kısa CC0 kayıtlara bağlıdır. İş efektleri gerçek vuruş/hasat anında, karo yerleşimi ise görünür yapı çıkışında çalar. HRTF ile sağ-sol konumu ve uzaklık zayıflaması uygulanır; kalabalık üretimde eşzamanlı iş sesleri sınırlandırılır. Orman/çilek/bahçede yaprak, çiftlikte yumuşak ekin hışırtısı, taşta maden/çakıl, yapılarda ahşap ve iskelede gıcırtı kullanılır. Kartın hover sesi korunur. Kaynaklar ve lisanslar: [ses künyesi](public/audio/CREDITS.txt).

Bu geliştirme aşamasında oyun ve cihaz denemeleri kullanıcı tarafından yapılır.

İkonlar: [Font Awesome Free](https://fontawesome.com/), CC BY 4.0 / MIT. Lisanslar: [ikonlar](public/licenses/fontawesome-icons.txt), [SVG çekirdeği](public/licenses/fontawesome-core.txt).

Ormanlar 10 farklı ağaç çeşidinden üç ağacın çimenli alana rastgele dağıtılmasıyla oluşur. Kesilen ağaç devrilir, toz bulutu çıkarır ve kütükler yerçekimi, sekme, sürtünme ve birbirleriyle temasla yere yerleşir. Çalışan kütüklere yürür, eğilerek alır ve depoya taşır. Elde taşınan balık, çilek, buğday, taş ve odun ayrı modellerle görünür. Çimenler kökleri sabit kalacak şekilde farklı fazlarda rüzgârda salınır. Taşların çarpışma alanları gerçek konumlarını izler; kazma iki elle baş üstünden savrulur ve parçalar yere düşüp seker. Depo yükseltmesi kapasite önizlemesi, seviye işaretleri, sandıklar ve bildirimle gösterilir.

Çimenlerde beyaz çiçek/taş süsleri bulunmaz; çimler altıgenin yeşil yüzeyine rastgele yayılır ve model sınırlarından uzak tutulur. Buğday başakları çift sıralı taneler, kılçıklar ve yapraklarla modellenir. Kazma başı dikey vuruş düzlemindedir; kırılma anında toz ve sekerek dökülen parçalar çıkar. Sağ tuşla kamera daha alçak ve daha yüksek açılara dönebilir; alt açı deniz ve model yüksekliğine göre sınırlandırılır.

## Yerleştirme ve kıyı sesleri

Tek merkez altıgeni ve bir sakinle başlanır. Kart yerleştirmede tur veya genişleme hakkı sınırı yoktur. Yapı kartları kıyıya bırakıldığında kendi altıgenlerini ekler; yakın bir uygun hücreye hafifçe oturur. Evler yeni sakinleri doğrudan getirir. Depolar odunla yükseltilir.

Dalga kaydının iki kanalı korunur ve stereo alanı hafifçe genişletilir. Ses kıyıya/denize yakınlaşınca artar; kara içinde kıyıdan uzaklaşınca ve kamera uzaklaşınca azalır. Kıyının kamera sağına/soluna dağılımı stereo yönünü etkiler; seviye, pan ve uzaklık filtresi yumuşakça değişir. Kullanıcının sağladığı üç martı kaydının belirgin çağrı bölümleri sırayla çalınır; çağrı başlangıçları arasında 22–26 saniye vardır, yaklaşık dakikada 2–3 çağrı. Ses uçan martıyı izler, kamera yönüyle sağa/sola kayar ve yakınlaştırmayla belirginleşir. Aynı anda tek çağrı duyulur. Sessize alma, gizli sekme ve yeni oyunda ses temizlenir. Martı kayıtları: [ses künyesi](public/audio/CREDITS.txt).

## Ortak görsel stil ve hava

Ev, büyük ev, depo, oduncu ve balıkçı yapıları ortak taş temel, yumuşak ahşap kenarlar, kiremit sıraları, kepenkler ve pencere çerçeveleriyle modellenir. İskelede bağlantı çivileri, depoda sandık ve varil, balıkçıda ağ ve halat detayları bulunur. Ağaçlar, çilekler, çiçekler ve taşlar buğdayın daha ince işlenmiş stiline yaklaşır. Sabit yapı detayları malzemeye göre birleştirilir ve şablon geometrileri paylaşılır.

Güneşin konumu, rengi ve şiddeti tek bir ayardan gelir; yapı gölgeleri ve su yansıması aynı yönü kullanır. Deniz yüzeyi gerçek gölge haritasını alır, çimenler yapı gölgelerini kabul eder. Yansıma dar ve düşük şiddettedir; periyodik parlak çizgiler yerine yumuşak, düzensiz su pürüzleri kullanılır. Gölgedeki suda güneş parıltısı kesilir. Yakınlaştırma sırasında kameranın güvenlik mesafesi değişse de yansıma lekesi büyümez. Ara sıra beliren üç ince rüzgâr izi birkaç saniyede kaybolur; çimenlerin salınımı aynı esintiyle hafifçe güçlenir. Ağaç vuruşları yaprak savurur; yapraklar dönerek düşer, zeminde veya suda kısa süre kalıp kaybolur. Parçacık sayısı sınırlıdır, yeni oyunda temizlenir.

Bina altları dahil tüm kara yüzeyi yeşil bir palet kullanır: ormanda serin ve koyu, çilek ve bahçede canlı, tarla ve yerleşimlerde daha açık sıcak yeşiller bulunur. Renkler dünya koordinatlarında yakın karolar arasında yumuşak ağırlıklarla harmanlanır; aynı sınır noktası aynı rengi alır. İç yüzey örnekleri artırılır ve komşuluk değişince çevre zeminleri güncellenir. Kart maliyeti ve türü aynı başlık satırındadır; açıklamalar kartın içine sığar. HUD alt bilgileri üretimde çalışanları, yiyecek tüketimini, yeni el ücretini, sonraki ödülü ve köyün ruh halini gösterir. Üst şerit yaklaşık 56 piksel yüksekliğindedir; eldeki kartlar 136–152 piksel genişlik ve 188–212 piksel yüksekliktedir. Kamera, küçülen arayüzün bıraktığı alana göre adayı çerçeveler; ödül modalındaki kartlar okunabilir büyük ölçüsünü korur.

Çilek ve buğday modellerinin arkasındaki ekstra küçük çitler bulunmaz; bu karolar da adanın dış çit hattına dahildir. Yalnız dış kenarlarda, kara kenarıyla aynı köşe kesişimlerini kullanan alçak ahşap çitler bulunur. Yeni karo eklenince ortak kenardaki çit kalkar; yıkım bitince açığa çıkan kenarlara geri gelir. Balıkçı ve limanın denize bakan kenarı açık tutulur; açıklık yapı döndürülünce yön değiştirir. Kartları yenile düğmesi düz, ince bir şerit biçimindedir. Çitler kenar bazında yönetilir: içte kalan eski parçalar kurulum eğrisinin tersini izleyerek, yana devrilmeden dumanla zeminin içine iner; yeni karo birleşiminde kaldırılan kenarlar da aynı animasyonu kullanır; yeni parçalar karo ve bina yerleşimi bittikten sonra mevcut çitin ucundan kıyı bağlantıları izlenerek 0,12 saniye aralıklarla duman ve ahşap vuruş sesi eşliğinde tek tek yükselir. Dış kenarda kalacak çitler, köşe ölçüleri değişse de yıkılmaz; yalnız yeni karoyla içte kalan kenarlar kaldırılır. Ahşap vuruşa kısa bir çatlama katmanı eklenerek yıkılan her parçaya kırılma sesi verilir.

Yürüyüş, hedef hız yerine aynı karede gerçekten alınan mesafeye bağlanır. Üç yürüyüş klibinin yere basan ayak hareketi, normalize karakter ölçeğinde bir kez örneklenir; her klibin doğal hızı ayrı hesaplanır. Köylü hızı bu doğal adım hızına yaklaşır, animasyon da gerçek hız / klip hızı oranıyla ilerler. Durunca adımlar donar; taşıma ve dönüşte yavaşlama hesaba katılır. Yerinde yürüme için pelvisin yatay klip hareketi kaldırılır, dikey salınım korunur. Ayağa kalkma bitmeden hareket edilmez.

Gelişim modalları yumuşak ölçek ve kayma animasyonuyla açılır; ödül kartları sırayla dönerek yükselir. Ortadaki Devam Et düğmesi ve Esc animasyonlu kapanışı kullanır. Kart yenileme ve yerleştirmede eski ses dizisi yerine hover kart kaydırma sesi çalar; yenilemede her kartın gelişi kendi sesini üretir. Çit sesleri mevcut Kenney CC0 ahşap örneklerinden gelir. H tuşu her basışta odun, taş, çilek, buğday, balık ve altına 1.000 ekler; nüfus ve refahı değiştirmez. Ek ürünler merkez stoklarında tutulur, merkez kapasitesi bunlara yetecek şekilde artırılır.

Kazmanın görseli, el kemiğindeki tutuş noktası korunarak yüzde 62 ölçeğe indirilmiştir; yeniden tutuş hesapları bu iç görsel ölçeğini değiştirmez.
