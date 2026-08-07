---
title: "Arch Linux MATLAB Kurulumu"
publishDate: "06 Mar 2024"
description: "Arch Linux MATLAB kurulumu ile ilgili bir şeyler çiziktirdik"
tags: ["tr", "linux", "arch", "matlab"]
---

Esenlikler, yüksek lisans çalışmalarım için MATLAB programına ihtiyacım oldu bu sebepten bende Arch Linux'a nasıl yükleyebileceğimi araştırdım ve kendi kurulumumdan yola çıkarak size bu yazıyı yazmaktayım. Kurulum benim için çalışmaktadır, daha fazla bilgi ve detay içn [Arch Linux Wiki](https://wiki.archlinux.org/title/MATLAB)'sine bakabilirsiniz.

Eğer imkanınız varsa MATLAB yerine GNU Octave kullanmanızı tavsiye ederim.

Kendi dosya sistemini bildiğinizi ve artık bir simgeye tıklamadan bir uygulamayı nasıl başlatacağınızı bildiğinizi varsayıyorum.

## Kurulum

Bu kurulum MATLAB R2022b sürümü için yazılmıştır, muhtemelen diğerlerinde de çalışacaktır.

### Zip arşivini indirin

MATLAB'ın kendi [orijinal sitesinden](https://matlab.mathworks.com/) .zip uzantılı arşiv dosyasını indirin. İndirebilmek için içinde lisansı olan bir hesaba sahip olmanız gerekmektedir. `İndirilenler` klasörüne indirdiğinizi varsayarak devam edeceğim.

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

## MATLAB'ı aktive edin

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

Esenlikle kalın.

