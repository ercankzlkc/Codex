# Living Kingdom · Yelken Koyu

Three.js, TypeScript ve Vite ile geliştirilmiş, gerçek zamanlı küçük ada yerleşimi.

## Çalıştırma

Node 24 ile `npm ci` ve `npm run dev`. Yayın derlemesi: `npm run build -- --base=/Codex/`.

## Kısıtlı topraktan yaşayan köye

**Kur → üret → ticaret yap → yeni arsa aç veya elindekini yükselt.** Başlangıçta merkez, iki sakin ve altı boş arsa bulunur. Yapı kartı sadece mevcut boş arsaya yerleşir, yeni toprak vermez. Orman, çilek ve taş üretimi başlangıç ekonomisini oluşturur. Bir yapı kaldırılınca arsa kalır; kaynak iadesi olmaz. Uygun kart gelmezse Yeni planlar düğmesi 20 saniyede bir eli yeniler. Eksik temel üretim kartları çekilişte korunur.

Odun, taş ve yiyecek farklı amaçlara sahiptir. Orman ücretsizdir ama fidanlar 35 saniye büyümeden çalışılamaz. Ev 8 odun, 2 taş ve 4 hazırlık yiyeceği; depo 8 odun ve 4 taş ister. Çiftlik, balıkçı, oduncu kulübesi, bahçe ve büyük ev de taş gerektirir. Bedeller kartın üzerinde ayrı ikonlarla gösterilir.

## Nüfus ve refah

Ev anında çalışan vermez; iki yatak açar. Büyük ev dört, başlangıç merkezi üç yatak sağlar. Boş yatak, en az 65 refah ve 90 saniyelik yiyecek varsa 55 saniyede bir yeni sakin gelir. Koşullar bozulunca geliş ilerlemesi yavaşça azalır. Sağdaki gelişim paneli engeli veya kalan süreyi gösterir.

Her sakin 2 yiyecek / dk tüketir. Erzak rezervi, yiyecek çeşitliliği ve bahçeler refahın sürdürülebilir seviyesini yükseltir; açlık ve barınma eksikliği düşürür. Refah para olarak harcanmaz. Açlık ayrıca çalışmayı ve yürüyüşü en fazla %25 yavaşlatır; erzak gelince toparlanılır. Sofra satırı stokun ne kadar yeteceğini ve son teslimatlardan hesaplanan üretim/tüketim temposunu gösterir. Stok bir dakikanın altındaysa bir çalışan yiyeceğe ayrılır; yiyecek önceliklerini tamamen sıfırlamak bu yardımı kapatır. Acil Hasat en fazla 12 yiyecek verir, 5 refah harcar ve kartla ortak 90 saniye bekleme süresine sahiptir; depo kapasitesini aşmaz.

## Ticaret, arsalar ve ustalık

Siparişlerin süre sınırı yoktur. İlk sefer 24 odun ve 12 çilek ister; ardından buğday, taş ve balık devreye girer. Gönderilen ürünler toplamdan ve gerçek depolardan düşer. Köyün son 30 saniyelik yiyeceği gönderilemez. Her sefer +4 refah verir; oyuncu **bir yeni arsa hakkı** veya **bir ustalık hakkı** seçer. Genişleme hakkı sağdaki düğmeyle seçilen kıyı altıgeninde kullanılır. Balıkçının son açık kıyısı kapatılamaz.

Bir yapıya tıklayıp ustalık hakkı ve malzeme harcayarak aynı arsayı geliştirebilirsin. Seviye 1 → 2, 6 odun ve 2 taş; seviye 2 → 3, 12 odun ve 4 taş ister. Seviye üst sınırı 3'tür; son seviye Ticaret Limanı aşamasında, 6 seferden sonra açılır. Üretim yapıları her seviyede teslimata +2 ürün, bahçeler +1 refah, oduncu kulübeleri komşu ormanlara +2 odun verir. Evler +1, büyük evler +2 yatak açar; depolar +60, merkez +80 kapasite kazanır. Yükseltmeler yapı üzerinde seviye işaretleriyle görünür.

Çiftlik ve balıkçı ilk, büyük ev üçüncü seferden sonra kart havuzuna açılır; taş ocağı başlangıçtan itibaren vardır. Köy 3, 6, 10 ve 16 seferde Kıyı Köyü, Ticaret Limanı, Küçük Kasaba ve Canlı Koy aşamalarına geçer. Ticaret Limanı son yükseltme seviyesini açar; Küçük Kasaba merkeze +80 depo kapasitesi verir, Canlı Koy ustalık rozeti kazanır. Sonraki siparişlerin miktarları büyür; final veya beş dakikalık oyun sonu yoktur.

## Üretim ve taşıma

Kaynaklar yalnızca teslimatta eklenir. Çilek, buğday ve balık ayrı stoklanır. Depolarda kapsama yarıçapı yoktur; yüklü yürüyüş hızı normalin %78'idir, uzun yol gerçekten daha seyrek teslimat demektir. İş seçiminde kaynağa ve depoya mesafe dikkate alınır. Altıgenin bilgi paneli ölçülen yüklü yürüyüş ve toplam teslimat süresini gösterir. Yakına depo kurmak, yeni üretim yapısı eklemeye alternatif bir iyileştirmedir.

Merkez deposu 80, yeni depo 60 ürünle başlar. Dolu depoya giden sakin başka uygun depo arar. Ağaçlar, taşlar ve ürünler 30 saniyede yenilenir. Kesilen ağaç devrilir; toz, sekme ve sürtünme ile yere oturan kütükleri çalışan eğilerek toplar. Elde taşınan kaynaklar ayrı modellerle görünür. Taşta iki elli dikey kazma, dökülen parçalar ve toz; buğdayda taneler ve kılçıklar bulunur. Çimler modellerden ve kıyıdan uzak, rastgele yerlerde bağımsız salınır.

## Kontroller

- Kartı mevcut boş arsaya sürükle veya seçip arsaya tıkla.
- Yeni arsa aç düğmesinden kıyıda genişleme yap; Esc ile vazgeç.
- Yapıya tıklayarak döndür, yükselt veya kaldır. Merkez kaldırılamaz.
- Sağ fareyle döndür, orta fare veya Shift + sağ fareyle kaydır.
- Tekerlekle yakınlaş, H ile ortala. Seçili kart/yapıda tekerlek veya R döndürür; Shift + R ters yöndür.
- Görevler panelinden odun, taş, çilek, buğday ve balık önceliklerini ayarla.

Derleme yayın için alınır; oyun, tarayıcı, otomatik testler ve oynanış dengesi denemeleri proje tercihine göre kullanıcı tarafından yapılır.

## Kaynaklar

Sesler: [ses künyesi](public/audio/CREDITS.txt). Martı: kullanıcı tarafından sağlanan rigli GLB ve `ArmatureAction` animasyonu, [model künyesi](public/models/CREDITS.txt). İkonlar: [Font Awesome Free](https://fontawesome.com/), [ikon lisansı](public/licenses/fontawesome-icons.txt), [SVG çekirdeği](public/licenses/fontawesome-core.txt).
