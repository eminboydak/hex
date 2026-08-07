---
title: "Ayarlarınızı Git ile Yönetin"
publishDate: "06 May 2022"
description: "Git sadece yazdığınız kodları kontrol etmek için değil, aynı zamanda config dosyalarınızı yönetip saklamak için mükemmel bir araçtır."
tags: ["tr", "linux", "git", "dotfiles"]
---

Git sadece yazdığınız kodları kontrol etmek için değil, aynı zamanda config dosyalarınızı yönetip saklamak için mükemmel bir araçtır. Genellikle home dizininizde bulunan bu dosyalara config dosyaları denir. Tüm home dizinini bir depoya koymak istemediğimiz için, bare git deposu denilen bir depo kullanabiliriz.

## İlk kurulum
İlk olarak bare git deposu oluşturalım:

```bash
git init --bare $HOME/.dotfiles
```

Bu bare depo ile kullanacağımız git dizinini ve çalışma ağacımızı belirlememiz gerekiyor. Bu, `.gitconfig` dosyanıza bir takma ad(alias) ekleyerek yapılabilir.

```bash
git config --global alias.dotfiles '!git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME'
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
```
