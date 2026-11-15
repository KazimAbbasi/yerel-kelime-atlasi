# Yerel Kelime Atlası

Yerel Kelime Atlası, bir kavramın farklı yörelerdeki karşılıklarını yan yana gösteren Türkçe bir öğrenci projesidir. Ziyaretçi, **Atlas** görünümünde kelimeleri araştırabilir. **Derleme panosu**, kayıtları düzenlemek ve hangi kayıtların atlasta görüneceğine karar vermek için kullanılır.

## Özellikler

- Onaylı kayıtların kavrama göre karşılaştırılması, kelime/anlam/şehir araması ve bölge/kategori filtreleri
- Bölge filtresi olarak kullanılabilen şematik Türkiye haritası
- Taslak, İncelemede ve Onaylandı sütunları. Sürükleme kulpu fare, dokunma ve klavye ile çalışır. Kartın durum menüsü de kullanılabilir.
- Kelime ekleme ve düzenleme formu. Ortak kavram, anlam, bölge, il/ilçe, kategori, örnek cümle ve isteğe bağlı kaynak alanı.
- Tarayıcıda otomatik kayıt ve canlı istatistikler
- Kavram asistanı. Onaylı kavramlardan başlık önerir. Kayıt ancak kullanıcı öneriyi uygulayıp formu kaydederse değişir.

Veri yalnızca kullanılan tarayıcıda ve aynı site adresinde saklanır. Her ziyaretçi kendi koleksiyonunu yönetir. Başlangıç verisinin kaynağı Safiye Genç ve Ali Cin’in [Türkiye Türkçesi Ağızlarında “Domates, Kedi, Patates” Kelimeleri ve Bir Kelime Haritası Denemesi](https://agiz.tdk.gov.tr/tdk_arsiv_pdf/TDKAA5.pdf) çalışmasıdır. Örnek cümleler gösterim için yazılmıştır. Harita şematiktir.

## Çalıştırma

Node.js 22 veya üzeri önerilir. Proje React, Vite, Tailwind CSS ve dnd-kit kullanır.

```sh
npm install
npm run dev
```

Terminaldeki yerel adresi açın. pnpm ile de `pnpm install` ve `pnpm dev` kullanılabilir.

```sh
npm test
npm run lint
npm run build
npm run preview
```

## Kavram asistanı

Varsayılan yerel modda asistan, anlam alanını onaylı kavram başlıklarıyla eşleştirir. Canlı OpenRouter önerileri için `.env.example` dosyasını `.env.local` olarak kopyalayın, `OPENROUTER_API_KEY` ve kullanmak istediğiniz `OPENROUTER_MODEL` değerlerini yazın, geliştirme sunucusunu yeniden başlatın. Anahtar Vite sunucusunda kalır. Kullanıcı **Başlık öner** dediğinde yalnızca anlam metni ve mevcut başlıklar sağlayıcıya iletilir. Sağlayıcı yanıt vermezse yerel mod kullanılır. Statik yayın, yerel modla çalışır.

## Örnek sunum akışı

1. **Atlas** sekmesinde “Patates” seçiliyken farklı yöresel karşılıkları karşılaştırın.
2. Haritadaki **Karadeniz** noktasına tıklayın ve Artvin kaydını görün. Ardından filtreyi kaldırın.
3. **Kelime ekle** düğmesinden yeni bir taslak oluşturun. Anlam alanına “Patates” yazıp **Başlık öner** seçeneğini deneyin.
4. Taslağı panoda **Onaylandı** sütununa taşıyın. Atlas görünümünü ve istatistikleri kontrol edin.

## Dosyalar

- `src/components/` — Atlas, pano, form ve istatistik bileşenleri
- `src/data.js` — Başlangıç kayıtları, bölge ve kategori bilgileri
- `src/atlas.js` — Arama, gruplama, taşıma ve yerel eşleştirme
- `src/atlas.test.js` — Temel işlev testleri
- `vite.config.js` — Yerel geliştirme ve isteğe bağlı OpenRouter bağlantısı


## Ekran goruntuleri

- [Atlas](screenshots/atlas.jpg)
- [Derleme panosu](screenshots/derleme-panosu.jpg)
- [Kayit duzenleme](screenshots/kelime-duzenle.jpg)
