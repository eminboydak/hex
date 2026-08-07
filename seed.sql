-- Hex — seed data for the posts table.
-- Generated from _raw_posts/*.md (title, body -> content_markdown, description -> excerpt).
-- Idempotent: clears the known slugs first, then re-inserts. Run after schema.sql (`pnpm db:seed`).
-- To regenerate after editing _raw_posts/*.md, re-run the frontmatter extractor that produced this file.

DELETE FROM posts WHERE slug IN ('ayarlarinizi-git-ile-yonetin', 'arch-linux-matlab-kurulumu');

INSERT INTO posts (slug, title, content_markdown, excerpt, status, published_at) VALUES ('ayarlarinizi-git-ile-yonetin', 'Ayarlarınızı Git ile Yönetin', 'Git sadece yazdığınız kodları kontrol etmek için değil, aynı zamanda config dosyalarınızı yönetip saklamak için mükemmel bir araçtır. Genellikle home dizininizde bulunan bu dosyalara config dosyaları denir. Tüm home dizinini bir depoya koymak istemediğimiz için, bare git deposu denilen bir depo kullanabiliriz.

## İlk kurulum
İlk olarak bare git deposu oluşturalım:

```bash
git init --bare $HOME/.dotfiles
```

Bu bare depo ile kullanacağımız git dizinini ve çalışma ağacımızı belirlememiz gerekiyor. Bu, `.gitconfig` dosyanıza bir takma ad(alias) ekleyerek yapılabilir.

```bash
git config --global alias.dotfiles ''!git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME''
```

Şimdi basitçe şu şekilde yazabiliriz

```bash
git dotfiles <git komutu>
```

örnek olarak

```bash
git dotfiles status
```

üstteki şekilde sorguladığımızda git bize home dizinindeki tüm izlenmeyen dosyaları gösterecektir, bunun olmasını şunu yazarak engelleyebiliriz

```bash
git dotfiles config --local status.showUntrackedFiles no
```

şimdi artık sadece depoya eklediğimiz dosyaları gösterecek. İlk olarak `.gitconfig` dosyamızı ekleyelim

```bash
git dotfiles add .gitconfig
git dotfiles commit -m ".gitconfig dosyası eklendi" -a
```

Şimdi uzak depomuzu ekleyelim

```bash
git dotfiles remote add origin <uzak depo>
# benim uzak depom ile bir örnek
git dotfiles remote add origin git@github.com:eminboydak/.dotfiles.git
```

ve ilk commitimizi gönderelim

```bash
git dotfiles push
```

Şimdi eklemek istediğin tüm ayar dosyalarını ekleyebilirsin.

## Ayar dosyalarını cihazlar arasında eşitleme
Uzak deponu artık birçok cihaz arasında ayarlarını eşitlemek içn kullanabilirsin. Yeni bir cihazda basitçe uzak deponu klonlayabilirsin

```bash
git clone --bare <uzak depo> $HOME/.dotfiles
```

eski ayarlarına daha fazla ihtiyacın olmadığından emin olduktan sonra onları görmezden gelmek için

```bash
git reset --hard
```

ve home dizinindeki mevcut dosyalarının üzerine yaz(eski ayarlarını korumak istiyorsan önce onları yedeklediğinden emin ol)

```bash
git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME pull
```', 'Git sadece yazdığınız kodları kontrol etmek için değil, aynı zamanda config dosyalarınızı yönetip saklamak için mükemmel bir araçtır.', 'published', '2022-05-06 00:00:00');

INSERT INTO posts (slug, title, content_markdown, excerpt, status, published_at) VALUES ('arch-linux-matlab-kurulumu', 'Arch Linux MATLAB Kurulumu', 'Esenlikler, yüksek lisans çalışmalarım için MATLAB programına ihtiyacım oldu bu sebepten bende Arch Linux''a nasıl yükleyebileceğimi araştırdım ve kendi kurulumumdan yola çıkarak size bu yazıyı yazmaktayım. Kurulum benim için çalışmaktadır, daha fazla bilgi ve detay içn [Arch Linux Wiki](https://wiki.archlinux.org/title/MATLAB)''sine bakabilirsiniz.

Eğer imkanınız varsa MATLAB yerine GNU Octave kullanmanızı tavsiye ederim.

Kendi dosya sistemini bildiğinizi ve artık bir simgeye tıklamadan bir uygulamayı nasıl başlatacağınızı bildiğinizi varsayıyorum.

## Kurulum

Bu kurulum MATLAB R2022b sürümü için yazılmıştır, muhtemelen diğerlerinde de çalışacaktır.

### Zip arşivini indirin

MATLAB''ın kendi [orijinal sitesinden](https://matlab.mathworks.com/) .zip uzantılı arşiv dosyasını indirin. İndirebilmek için içinde lisansı olan bir hesaba sahip olmanız gerekmektedir. `İndirilenler` klasörüne indirdiğinizi varsayarak devam edeceğim.

### İki yeni klasör oluşturun

```bash
cd ~/İndirilenler
mkdir matlab
mkdir tmp
```

### Zip dosyasını taşıyın

```sh
mv matlab_R2022b_glnxa64.zip matlab/
cd matlab/
```

Bunu yapmamızın sebebi zip dosyasını çıkardığımızda indirilenler klasörümüzün gereksiz şeylerle dolmaması için.

### Zip dosyasını çıkarın

```sh
unzip matlab_R2022b_glnxa64.zip
```

### Uyumsuz kütüphaneyi silin

```sh
rm ./bin/glnxa64/libfreetype.so*
```

Kurulum aracının kullandığı bazı kütüphaneler Arch Linux `freetype2` kütüphanesi ile uyumsuzdur. Bu sebepten bu dosyaları silmeliyiz.

### Kurulum aracını başlatın

```sh
sudo ./install -downloadFolder /home/<kullanıcı-adı>/İndirilenler/tmp/
```

Kurulum aracını `sudo` yetkisi ile başlatın ki araç `/usr/local/MATLAB/` yolunu oluşturabilsin ve `/usr/local/bin` bağlantısını oluşturabilsin.

### Kurulum aracından devam edin

**ÖNEMLİ:** Create symlinks to your `$PATH` seçeneğini seçin. Bazı zamanlarda varsayılan olarak seçili olmayabilir. El ile yol ayarlamamak ve yazı yazarak programı çalıştırmamak için gereklidir.

**ÖNEMLİ:** Kullanıcı adınız `whoami` komutunu çalıştırdığızda gelen çıktı ile aynı olmalıdır.

Bu şekilde başarılı bir şekilde dosyalar inecek ve kurulum yapılacaktır.

## MATLAB''ı aktive edin

```sh
cd /usr/local/MATLAB/R2022b/bin/
sudo ./activate_matlab.sh
```

Kurulum esnasında yaptığınız doğrulamayı ikinci kez burada yapmanız gerekmekte.

## MATLAB, matlab koutunu çağırdığımda çalışmıyor!

`matlab` komutunu çağırınca programın çalışacağını düşünmüş olmanız çok normal. Bu komutu çağırdığınızda küçük bir MATLAB penceresi gelip ardına kayboluyor olmalı. GUI modunda çalıştırmak için `matlab -desktop` komutu ile programı çalıştırmalısınız.

## Unable to connect to the license server.

hatasını alıyorsanız eğer sizde benimle aynı hatayı almışsınız demektir. Üniversiteye bağlı olan bir lisans olduğundan dolayı üniversite ağına bağlı olmadan program çalışmıyor.

Bu sebepten üniversitenizin vpn ağı var ise vpn ağına bağlanıp programı çalıştırabilirsiniz.

## Sonsöz

Rehber sayesinde kurulumu yapmış veya yapamamış olabilirsiniz. Bu tarz baş ağrıtan şeylerle uğraşmamak için GNU Octave güzel bir alternatif olabilir. Tam manasıyla MATLAB ile aynı diyemeyiz fakat çoğu zaman işinizi de görecektir.

Esenlikle kalın.', 'Arch Linux MATLAB kurulumu ile ilgili bir şeyler çiziktirdik', 'published', '2024-03-06 00:00:00');
