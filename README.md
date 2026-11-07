# Living Kingdom · Yelken Koyu

Three.js, TypeScript ve Vite ile geliştirilmiş, gerçek zamanlı küçük ada yerleşimi.

## Çalıştırma

Node 24 ile `npm ci` ve `npm run dev`. Yayın derlemesi: `npm run build`.

## Serbest oyun

Tur, hedef veya 15 hamle sınırı yoktur. Başlangıçta merkez önünde bir sakin bulunur. Ev iki, büyük ev dört yatak sağlar; inşaat nüfusu anında artırmaz. Yeni sakinler boş yatak, en az 50 refah ve gelecek nüfusun 90 saniyelik tüketimine yetecek yiyecek varsa beklemeden yerleşir ve evin kapısından köye çıkar. Sakinler kara üzerinden yürür; yakındaki işlere gider, çilek toplar veya ağaç keser, yüklerini uygun depoya taşır. Kaynaklar sadece teslimatta eklenir. Her sakinin hedef tüketimi yaklaşık dakikada 4 yiyecektir; tokluk %20’ye düşünce depoya gidip öğün başına en fazla 4 yiyecek yer. Stoklar yalnızca gerçekten yenen miktar kadar azalır. Çilek, buğday ve balık ayrı stoklanır; toplam ve tüketim HUD’da, döküm ise yiyeceğin üzerine gelince görünür. Yiyecek yoksa refah yavaşça azalır; oyun sona ermez.

Depolarda kapsama yarıçapı yoktur; adanın her yerinden ürün teslim edilebilir. Merkez deposu 240, yeni depolar 60 ürün alır; depo panelinden odunla yükseltmek kapasiteyi merkezde 80, diğer depolarda 60 artırır. Dolu depoya giden sakin başka uygun depo arar; dolu deponun üzerinde hareketli bir uyarı görünür. Ormanlar ve oduncu kulübeleri odun miktarını, komşu ormanlar çilek verimini artırır. Ağaçlar 90, taş damarları 150 saniyede yenilenir. Çilek, buğday ve çiçeklerin temel yenilenmesi 30 saniyedir ve mevsim hızına uyar; küçük halkalar kalan süreyi gösterir. Hasatta ürünler kademeli azalır. Balıkçı iskelesi açık denize yönelir; son su komşusu yapı ile kapatılamaz. Balıkçılar kıyıdaki iskelelerinden olta atar; yakalanan balık teslimatta stoğa eklenir.

Taş Ocağı kartında köylüler kazmayla çalışır; vuruşlarda kaya sallanır, küçük kıvılcım ve taş parçaları çıkar. Ağaç kesimi 6, taş çıkarma 6,8 saniye sürer. Taş, odun ve yiyecekle birlikte HUD’da ve depolarda ayrı stoklanır. Kaynak sayaçları yumuşak geçişlerle değişir; artış yeşil, azalış kırmızı görünür.

Beş martının üçü önceki uçuş hızını korur; ikisi sırasıyla 1,55 ve 1,85 kat hızlı uçar. Hızlı kuşların kanat vuruşu hafif hızlanır. Martılar iki yönde, birbirinden ayrı yarıçap ve yükseklik hatlarında uçar; ada büyürken merkez ve yarıçap, dönüşlerde yön yumuşakça değişir. Martılar kullanıcı tarafından sağlanan rigli GLB modeli ve `ArmatureAction` animasyonuyla kıyıda uçar; model ve lisans bilgileri [model künyesinde](public/models/CREDITS.txt) bulunur. balıklar ara sıra sudan kavis çizerek atlar. Balıkçı iskelesi açık denize otomatik yönelir ve köylü iskelenin ucunda çalışır; R ile başka bir açık su yönü seçilebilir.

## Altın, gelişim ve ticaret

HUD altını ayrı hazine olarak gösterir; altın depo kapasitesini kullanmaz. Başlangıçta 10 altın verilir. Kartların üzerindeki Kartları yenile düğmesi modal açmadan, toplam 5 altın karşılığında üç kartı birden yeniler. Önceki elin dışında kalan kartlar yeterliyse onlardan çekilir; liman ödülü kullanılana kadar korunur. Eski el çekilerek ayrılır; yeni kartlar kısa aralıklarla sırayla yükselerek gelir. Yerleştirme sonrasındaki yeni el de aynı animasyonla dağıtılır.

| Nüfus | Aşama | Açılan kartlar / özellik | Altın ödülü |
| --- | --- | --- | --- |
| 10 | Küçük Yerleşim | Depo, Oduncu Kulübesi | 10 |
| 24 | Köy | Çiftlik, Bahçe | 15 |
| 40 | Gelişen Köy | Büyük Ev, Şenlik | 20 |
| 60 | Kıyı Kasabası | Liman kartı doğrudan hediye | 25 |
| 100 | Ticaret Kasabası | Tüccar ziyaretinde 40 ürün kapasitesi | 40 |

Her eşik bir kez ödüllendirilir. Modal yeni kartları eldeki kartlarla aynı görsellerle gösterir; açılanlar sonraki çekilişlere girer. HUD’daki nüfus göstergesi dolu yatak oranını ve göç koşullarını gösterir. Nüfusa tıklayarak görev paneli ve yerleşim gelişimi açılır. Ticaret paneli dışındaki pencereler açıkken köylüler, tüketim ve ticaret saati durur. Ticaret panelinde oyun ve canlı gemi sayacı devam eder.

Ücretsiz oynanan kart yoktur: orman 2 odun, çilek bahçesi 3 odun ister. Acil Hasat kartı kaldırılmıştır. İlk orman kurulana kadar başka kartlar için 2 odun rezervi korunur; yeniden orman kuracak kaynak yokken son orman yıkılamaz. Yapılarda odun/taş, bahçede taş/yiyecek, şenlikte yiyecek/altın kullanılır. Tüm maliyetler kartta gösterilir; harcamalar gerçek depo stoklarından düşer.

Ticaret İskelesi, elde beliren iskele kartıyla 12 odun ve 6 taş karşılığında kıyıya kurulur. Köyde bir iskele bulunabilir ve son su komşusu kapatılamaz. Her mevsimin üçüncü gününde uygun bir su yolu varsa yeni yolculuk başlar. Gemi oyun hızından bağımsız 8 saniyede yanaşır, 18 saniye ticarete açık kalır ve 8 saniyede ayrılır. Önceki yolculuk bitmeden ikinci bir gemi oluşturulmaz. Tüm gövdeyi kapsayan açık deniz koridoru kapalıysa ticaret durur ve bildirim gösterilir. Kışın geminin geçtiği hat suya dönüşür; pruvada kırılan buz parçaları görülür. Mevsim normal hızda 10 dakikadır (üç günün her biri 200 saniye); gökyüzü ve gemi aynı takvimi kullanır. Gemiye veya ticaret iskelesine tıklayarak açılan pencerede 1, 5 veya 10 ürün seçilerek alış ve satış yapılır. Fiyatlar ürün başına arz/talep baskısına göre değişir. Oyuncu sattıkça fiyat düşer, gemiden aldıkça yükselir. Toplu işlemler her ürünün marjinal fiyatıyla hesaplanır; ekrandaki toplam gerçek işlem tutarıdır. Alış/satış makası anında geri satıştan kâr üretilmesini önler. Her yeni gemi ziyaretinde fiyat baskısı %40 azalır; piyasa tamamen sıfırlanmaz. Altın ve fiyatlar tam sayı kalır. Geminin ürün stoğu sınırlıdır, oyuncudan alım kapasitesi 40, 100 nüfustan sonra 80 üründür. Satın alma boş depo alanı ve altınla sınırlanır. Tüccar her ziyaret öncesinde üç ürün için toplam 40 ürünlük (100 nüfus sonrasında hazırlanan planlarda 80) alış talebini ve getireceği beş ürünün stoklarını bildirir. Deniz ticareti ekranında talep, köy stoğu, hazırlanacak eksik ve gemi yükü aynı tabloda görünür. Talepler ve yük mevsimlere göre değişir; açıklanan plan gemi gelene kadar korunur. Satışlar yalnızca kalan ürün talebi kadar yapılır, talepten düşülür ve eksik teslimat için ceza yoktur. Her yeni ziyarette gemi stokları açıklanan plana göre yenilenir. Ticaret paneli açıkken takvim ve köylü taşımaları devam eder.

Yayın GitHub `main` üzerinden Cloudflare Pages tarafından otomatik derlenir; kaynak ve yayın için ayrı dal kullanılmaz.

### Ücretsiz Workers adresi

`pages.dev` adresine erişilemeyen ağlarda alternatif olarak aynı depo Cloudflare Workers Static Assets ile de yayınlanabilir. `wrangler.worker.jsonc` bu ek yayın için hazırdır; yalnızca statik dosya sunar.

Cloudflare Workers & Pages → Create application → GitHub deposu `ercankzlkc/Codex` seçilir. Worker adı `codex`, üretim dalı `main`, build command `npm run build`, deploy command `npx wrangler deploy --config wrangler.worker.jsonc`, root directory depo kökü ve `NODE_VERSION=24` kullanılır. Free plan seçilir. Cloudflare hesabında oluşturulduktan sonra verilen `workers.dev` adresi kullanılır. Bu alan adına ağdan erişim ayrıca denenmelidir.

## Köylü görevleri

Üstteki nüfus göstergesine tıklayarak Köylüler panelini açın. İşler yüzde yerine tam kişi sayılarıyla gösterilir; bir köylü tek göreve ayrılır. Varsayılan otomatik dağılım, mevcut alanların kapasitesini aşmadan köylüleri işlere yerleştirir. + tek tıkla bir köylü atar; boşta kimse yoksa en kalabalık diğer görevden birini aktarır. − bir köylüyü boşta bırakır. Atamayı değiştirmek elle dağılıma geçirir; yeni gelenler bu modda ayrılabilir olarak bekler. Otomatik dağıt düğmesi otomatik yönetime döner. Çalışma alanı kurulmamış satırlar gizlenir; kapasite dolduğunda + kapanır. Bahçe çalışanları da aynı toplam içinde sayılır. Taşıma halindeki sakinler görev değiştirirken teslimatlarını bitirir.

Çalışanlar yapıların çevresinde yol bulur ve kullandıkları yerde patikalar oluşur. Yürüyen köylüler birbirini kilitlemez. Bekleyen ve oturan köylüler için ayrı dinlenme noktaları ayrılır; yürüyüş rotaları bu noktaların çevresinden geçer. Üst üste kalan bekleyenler yakın bir boş yere yürüyerek ayrılır. Bina ve kara sınırı kontrolleri devam eder. Depolarda boş kapılar tercih edilir; tümü doluysa teslimat kalıcı olarak kilitlenmez. Takılan sakinler alternatif rota ve depo girişleri arar. Başlarının üzerindeki Font Awesome ikonları toplama, taşıma, yemek, dinlenme ve dolu depo durumlarını gösterir. Yürürken hedef işin ikonu görünür; kamera uzaklaştığında baloncuklar küçülerek kaybolur.

## Kontroller

- Kartları kıyıdaki boş altıgenlere sürükleyin.
- Seçili kartı veya yapıyı tekerlek / R ile döndürün; Shift + R ters yöndür.
- Sağ fareyle 360° döndürün, orta fareyi basılı tutup sürükleyerek veya Shift + sağ fareyle kaydırın.
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

Kullanıcının sağladığı Island Village Peace arka plan müziği ilk tıklama veya tuş etkileşiminden sonra döngüde çalar. Ayarlar → Ses → Arka plan müziği kaydırıcısı müziği efektlerden ve kıyı ambiyansından bağımsız ayarlar; tercih tarayıcıda saklanır. Genel ses ve sessize alma müziği de etkiler. Sekme gizlendiğinde müzik duraklar, dönüldüğünde kaldığı yerden devam eder.

Tek merkez altıgeni ve bir sakinle başlanır. Kart yerleştirmede tur veya genişleme hakkı sınırı yoktur. Yapı kartları kıyıya bırakıldığında kendi altıgenlerini ekler; yakın bir uygun hücreye hafifçe oturur. Evler yeni sakinler için boş yatak açar; göç koşulları sağlanınca yeni sakin beklemeden gelir. Depolar odunla yükseltilir.

Dalga kaydının iki kanalı korunur ve stereo alanı hafifçe genişletilir. Ses kıyıya/denize yakınlaşınca artar; kara içinde kıyıdan uzaklaşınca ve kamera uzaklaşınca azalır. Kıyının kamera sağına/soluna dağılımı stereo yönünü etkiler; seviye, pan ve uzaklık filtresi yumuşakça değişir. Kullanıcının sağladığı üç martı kaydının belirgin çağrı bölümleri sırayla çalınır; çağrı başlangıçları arasında 22–26 saniye vardır, yaklaşık dakikada 2–3 çağrı. Ses uçan martıyı izler, kamera yönüyle sağa/sola kayar ve yakınlaştırmayla belirginleşir. Aynı anda tek çağrı duyulur. Sessize alma, gizli sekme ve yeni oyunda ses temizlenir. Martı kayıtları: [ses künyesi](public/audio/CREDITS.txt).

## Ortak görsel stil ve hava

Ev, büyük ev, depo, oduncu ve balıkçı yapıları ortak taş temel, yumuşak ahşap kenarlar, kiremit sıraları, kepenkler ve pencere çerçeveleriyle modellenir. İskelede bağlantı çivileri, depoda sandık ve varil, balıkçıda ağ ve halat detayları bulunur. Ağaçlar, çilekler, çiçekler ve taşlar buğdayın daha ince işlenmiş stiline yaklaşır. Sabit yapı detayları malzemeye göre birleştirilir ve şablon geometrileri paylaşılır.

Güneşin konumu, rengi ve şiddeti tek bir ayardan gelir; yapı gölgeleri ve su yansıması aynı yönü kullanır. Deniz yüzeyi gerçek gölge haritasını alır, çimenler yapı gölgelerini kabul eder. Yansıma dar ve düşük şiddettedir; periyodik parlak çizgiler yerine yumuşak, düzensiz su pürüzleri kullanılır. Gölgedeki suda güneş parıltısı kesilir. Yakınlaştırma sırasında kameranın güvenlik mesafesi değişse de yansıma lekesi büyümez. Ara sıra beliren üç ince rüzgâr izi birkaç saniyede kaybolur; çimenlerin salınımı aynı esintiyle hafifçe güçlenir. Ağaç vuruşları yaprak savurur; yapraklar dönerek düşer, zeminde veya suda kısa süre kalıp kaybolur. Parçacık sayısı sınırlıdır, yeni oyunda temizlenir.

Bina altları dahil tüm kara yüzeyi yeşil bir palet kullanır: ormanda serin ve koyu, çilek ve bahçede canlı, tarla ve yerleşimlerde daha açık sıcak yeşiller bulunur. Renkler dünya koordinatlarında yakın karolar arasında yumuşak ağırlıklarla harmanlanır; aynı sınır noktası aynı rengi alır. İç yüzey örnekleri artırılır ve komşuluk değişince çevre zeminleri güncellenir. Kart maliyeti ve türü aynı başlık satırındadır; açıklamalar kartın içine sığar. HUD bilgi panelleri üretimde çalışanları, yiyecek tüketimini, yeni el ücretini, göç koşullarını ve köyün ruh halini gösterir. Üst şerit 48 piksel yüksekliğindedir; kart genişliği masaüstünde 176–190 piksel aralığında ölçeklenir. Kamera, küçülen arayüzün bıraktığı alana göre adayı çerçeveler; ödül modalındaki kartlar okunabilir büyük ölçüsünü korur.

Çilek ve buğday modellerinin arkasındaki ekstra küçük çitler bulunmaz; bu karolar da adanın dış çit hattına dahildir. Yalnız dış kenarlarda, kara kenarıyla aynı köşe kesişimlerini kullanan alçak ahşap çitler bulunur. Yeni karo eklenince ortak kenardaki çit kalkar; yıkım bitince açığa çıkan kenarlara geri gelir. Balıkçı ve limanın denize bakan kenarı açık tutulur; açıklık yapı döndürülünce yön değiştirir. Kartları yenile düğmesi düz, ince bir şerit biçimindedir. Çitler kenar bazında yönetilir: içte kalan eski parçalar kurulum eğrisinin tersini izleyerek, yana devrilmeden dumanla zeminin içine iner; yeni karo birleşiminde kaldırılan kenarlar da aynı animasyonu kullanır; yeni parçalar karo ve bina yerleşimi bittikten sonra mevcut çitin ucundan kıyı bağlantıları izlenerek 0,12 saniye aralıklarla duman ve ahşap vuruş sesi eşliğinde tek tek yükselir. Dış kenarda kalacak çitler, köşe ölçüleri değişse de yıkılmaz; yalnız yeni karoyla içte kalan kenarlar kaldırılır. Ahşap vuruşa kısa bir çatlama katmanı eklenerek yıkılan her parçaya kırılma sesi verilir.

Yürüyüş, hedef hız yerine aynı karede gerçekten alınan mesafeye bağlanır. Üç yürüyüş klibinin yere basan ayak hareketi, normalize karakter ölçeğinde bir kez örneklenir; her klibin doğal hızı ayrı hesaplanır. Köylü hızı bu doğal adım hızına yaklaşır, animasyon da gerçek hız / klip hızı oranıyla ilerler. Durunca adımlar donar; taşıma ve dönüşte yavaşlama hesaba katılır. Yerinde yürüme için pelvisin yatay klip hareketi kaldırılır, dikey salınım korunur. Ayağa kalkma bitmeden hareket edilmez.

Gelişim modalları yumuşak ölçek ve kayma animasyonuyla açılır; ödül kartları sırayla dönerek yükselir. Ortadaki Devam Et düğmesi ve Esc animasyonlu kapanışı kullanır. Kart yenileme ve yerleştirmede eski ses dizisi yerine hover kart kaydırma sesi çalar; yenilemede her kartın gelişi kendi sesini üretir. Çit sesleri mevcut Kenney CC0 ahşap örneklerinden gelir. H tuşu her basışta odun, taş, çilek, buğday, balık ve altına 1.000 ekler; nüfus ve refahı değiştirmez. Ek ürünler merkez stoklarında tutulur, merkez kapasitesi bunlara yetecek şekilde artırılır.

Balta ve kazmanın görselleri, el kemiğindeki tutuş noktaları korunarak yüzde 62 ölçeğe indirilmiştir; yeniden tutuş hesapları bu iç görsel ölçeğini değiştirmez.

Tokluk %20’ye düşünce köylüler işi bırakıp yiyecek bulunan depoya gider. Toplanmış/taşınan ürünler varsa önce teslim edilir. Yemek depoda yenir; yiyecek yoksa üretime devam edilerek kilitlenme önlenir. Depoya ulaşınca köylü boşaltma pozuna girer; ürünler 0,14 saniye aralıklarla eldeki yükten çıkar, yarım saniyelik yumuşak bir yay çizerek depoya uçar. Stok her ürün vardığında artar, eldeki yük kademeli azalır. Depo dolarsa kabul edilmeyen ürün geri döner ve kalan yük başka uygun depoya götürülür. Aynı karedeki HUD güncellemeleri birleştirilir.

## Erzak sandıkları ve meşale sıcaklığı

Deniz keşifleri yalnızca sandıklardan oluşur. Altın çıkma ihtimali %8’dir (3–6 altın); diğer sandıklarda 5–10 odun, taş, çilek, buğday veya balık bulunur. Kaynaklar kendi HUD alanına uçtuktan sonra envantere eklenir. Depoda yer yoksa kalan içerik açık sandıkta korunur; yer açıldıktan sonra yeniden alınabilir. Tamamen boşalan sandık 8 saniyede altı birim derine iner; yalnızca son derinlik bölümünde silikleşerek kaybolur. Açılma, dalgayla sallanma ve batma oyun hızından bağımsızdır; sandık fareyle oluşturulan su dalgalarının yüksekliğini ve eğimini de izler.

Meşaleler geceleri otomatik yanar ve odun tüketmez. Yanan meşalenin yakınındaki küçük kar alanı ısındıkça erir. Sönünce kar kademeli geri gelir; çatı karı korunur. Geminin kırdığı buz küçük, karla aynı renkte taneler ve az sayıda ince kırıntıyla gösterilir.

Ticaret penceresi ürün ikonlarıyla tek tabloda köy stoğunu, geminin talebini, eksik miktarı ve gemi yükünü gösterir. Alış/satış aynı tablodan yapılır.

Oyun hızları soldan sağa durdur (Ⅱ), 1×, 2× ve 3× şeklindedir. Durdurma seçiliyken mevsim, köylüler ve gemi bekler; arayüz ve kamera kullanılabilir.

Ticaret ekranında Teslim et düğmesi, stok yeterliyse ürünün kalan talebinin tamamını tek seferde iskele için ayırır; 1/5/10 seçimi yalnızca doğrudan alış/satış içindir. Ayrılmış yiyecekler tüketilmez ve başka işlerde harcanmaz. Köylüler uygun iş teslimatlarından sonra küçük yüklerle depoya gider, ürünü alır ve ticaret iskelesine taşır. Depodaki ayrılmış ürünler alınana kadar kapasite kullanır; taşıma başlayınca depoda yer açılır. Hazır yükler iskelede görünür ve gemi yanaşınca talep sınırında otomatik satılır. Gemi kaçırılırsa veya ilgili iskele/depo kaldırılırsa ayrılan ürünler merkez stoğuna iade edilir. Panelde yoldaki ve hazır miktarlar ayrı gösterilir. Orta fare sürüklemesi ekran yönünde, gecikmesiz harita tutup çekme hareketidir.

Köylü görevleri, kart açıklamaları ve yerleşim gelişim ödülleri aynı renkli kaynak ikonlarını kullanır. Gelişim ekranında açılacak binalar kart görselleriyle, nüfus eşikleri ve altın ödülleri ayrı simgelerle gösterilir.

## Mevsim ekonomisi ve büyüme

Normal hızda bir mevsim 10 dakikadır. Mevsim adının altındaki çilek, buğday ve balık ikonları güncel iş hızlarını özetler. Mevsim adına veya özete tıklayarak dört mevsimin tüm iş etkileri görülebilir. Görsel kar yumuşak değişse de ekonomik etkiler takvim sınırında değişir.

| İş | İlkbahar | Yaz | Sonbahar | Kış |
| --- | --- | --- | --- | --- |
| Çilek | %120 | %100 | %75 | %25 |
| Buğday | %100 | %125 | %110 | Durur |
| Balık | %100 | %115 | %100 | %80 |
| Odun | %110 | %100 | %90 | %75 |
| Taş | %100 | %100 | %100 | %90 |
| Bahçe | %120 | %100 | %80 | Durur |

Yüzdeler çalışma hızıdır; teslimat başına miktarlar değişmez. Yürüme ve taşıma mevsimden etkilenmez. Tarlalar ve bahçeler kışın yeni iş almaz; başlamış hasatlar bırakılır, eldeki ürünler depoya teslim edilir. Alan yenilenmesi de aynı mevsim hızını kullanır. Otomatik dağılımda kışın durdurulan işler diğer alanlara aktarılır; yiyecek stoku düşükse önce besin işlerine öncelik verilir.

Her orman/taş alanındaki üç kaynak ortak kullanılır; aynı kaynak iki işçiye birden verilmez. Ek çalışanlar bu kaynakları daha çabuk tüketir, yenilenmeyi hızlandırmaz. Yeni alan kurmak daha fazla sürdürülebilir üretim sağlar. Köylüler panelinde dolu/toplam yatak, göçün bekleme nedeni ve yiyecek/refah koşulları görünür. Aynı özet nüfus göstergesinin üzerine gelince de açılır. Merkezde yalnızca başlangıç sakininin yatağı vardır.

Sağ üst araçlar Köy Defteri (açık kitap), ayarlar ve yeniden başlatmadır. Ayrı ticaret ve oyun rehberi düğmeleri bulunmaz; ticaret iskelesi kartla kurulur, iskele veya gemiden ticaret paneli açılır. Köy Defteri sağ üstte açılır. Sandığın içeriği kaynak ikonuyla, adet ve kısa durum mesajıyla gösterilir; keşif geçmişinde de aynı ikon kullanılır.

Krallık Merkezi diğer evlerden ayrı modellenmiştir: kesme taş temel, çift ahşap kapı, taç mühürü, kiremitli yönetim konağı, arka çan kulesi ve yeşil-altın sancaklar. Köyün malzeme ve renk dilini korur; kapı ve kule mevcut yürüme sınırlarıyla uyumludur. Mevsim rehberi üç sütunludur ve çilek, buğday, balık, odun, taş etkilerini gösterir; bahçe satırı gösterilmez.

Yeni sakinler evden çıktıktan sonra uygun bir işe yönelir. Elle dağılımda mevcut görevler korunur ve yeni sakin için boş bir çalışma yeri ayrılır. Otomatik dağılımda hedeflenen kaynak yenilenmeyi bekliyorsa hazır kaynak bulunan başka uygun iş seçilir. Yalnızca uygun iş, erişilebilir kaynak veya depo alanı olmadığında beklenir.

Her yaz başlangıcında üretim özeti penceresi açılır; yaz hızlarının yanında değişen işlerde önceki mevsimin oranı da gösterilir. Başka pencere açıksa yaz özeti kapanış sonrasına bırakılır. İlkbaharda oyuna başlarken bu pencere açılmaz. Kartların üzerindeki yerleştirme talimatı kaldırılmıştır.

## İhtiyaçlar ve parşömen arayüz

Enerji yalnız çalışırken/yürürken azalır; iş beklerken yenilenmez ve oturma başlamaz. Enerji sıfıra düşünce köylü topladığı ürünü teslim edip dinlenir, enerji %100 olunca işe döner. Oturma animasyonu yalnız bu dinlenme durumunda kullanılır. Tokluk saniyede 80/60 puan azalır; %20 eşiğinde depoya gidilir, her yenilen ürün 20 puan tokluk verir, en fazla dört ürünlük öğün tüketilir. Aç köylü yiyecek bulamazsa üretime devam eder; tokluğu sıfırsa refah zamanla azalır. Ayrılmış ticaret erzağı yenmez. HUD tüketimi yaklaşık planlama değeridir; fiili düşüşler yemek sırasında olur.

Üst HUD tek yatay satırda 48 piksel yüksekliğindedir. Tarih, saat, hız ve kısa mevsim etkileri kaynaklarla aynı şerittedir; ayrı mevsim alt şeridi kaldırılmıştır. Oyun kamerasının üst arayüz payı da azaltılmıştır. Parşömen, taçlı balmumu mühür ve ahşap/yeşil deri düğme görselleri bu proje için üretilmiş ve public/ui/medieval altında kaydedilmiştir. Menüler ve kartlar düşük kontrastlı parşömen kullanır; seçili kartlar ve tamamlanan gelişim ödülleri mühürlenir. Kontroller esnetilmiş düğme görseli yerine ortak yeşil/pirinç CSS malzemesini kullanır. Tüm yazılar HTML olarak kalır. Görsel künyesi: public/ui/medieval/CREDITS.txt.

## Ortak arayüz sistemi

Arayüz artık altı sorumlu stil dosyasından oluşur: style.css yalnızca kanvas, işaretçi, kaynak atlası ve dünya efektlerini; ui-theme.css renk, yüzey, yazı ve kontrol durumlarını; ui-shell.css HUD’u; ui-cards.css kartları; ui-panels.css köy panellerini; ui-dialogs.css açılır pencereleri tanımlar. Üst üste eklenen eski ui-materials/ui-medieval katmanları kaldırılmıştır.

Başlıklar Georgia, arayüz gövdesi yerel Baloo 2 kullanır. Normal/üzerine gelinen/basılı/seçili/devre dışı düğmeler ortak sözleşmeyle çizilir. Devre dışı düğmeler opaklıkla soldurulmaz; ayrı okunaklı renkleri vardır. Mevsim sekmeleri, paletler ve ticaret yönü ortak seçili durumu kullanır. Pencereler Escape, sağ üst kapatma ve alt eylem satırıyla yönetilir; yeniden başlatma onayında güvenli kapatma eylemi odaklanır. Ticaretin canlı yenilemesi kapatma düğmeleri dahil klavye odağını korur.

Pencere içeriklerinin yüksekliği doğal akışla belirlenir; kısa masaüstü pencerelerinde içerik kesilmek yerine dış pencere kayar. Kartlarda açıklamalar satır kırarak gösterilir. Kamera, kart elinin gerçek yüksekliğini ResizeObserver üzerinden izleyerek oyun alanını çerçeveler. Büyük HUD sayıları 10.000’den sonra kısaltılır; tam miktar bilgi panelinde gösterilir. Görsel oyun/tarayıcı testleri AGENTS.md tercihine göre kullanıcıya aittir; bu değişimde TypeScript ve CSS sözdizimi kontrolleri kullanılmıştır.
