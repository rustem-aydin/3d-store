import { NextResponse } from "next/server";

const headerData = [
  { label: "Modeller", href: "/#models" },
  { label: "Kategoriler", href: "/#categories" },
  { label: "Yeni Gelenler", href: "/#new-arrivals" },
  { label: "Popüler", href: "/#popular" },
  { label: "Fiyatlandırma", href: "/#pricing" },
  { label: "Hakkımızda", href: "/#aboutus" },
  { label: "İletişim", href: "/contact" },
];

const footerData = {
  brand: {
    name: "3D Market",
    tagline:
      "Dünya standartlarında 3D varlıklarla sınırları zorlayın. Tasarımlarınızı profesyonel modellerle güçlendirin.",
    socialLinks: [
      {
        icon: "/images/home/footerSocialIcon/twitter.svg",
        dark_icon: "/images/home/footerSocialIcon/twitter_dark.svg",
        link: "https://twitter.com",
      },
      {
        icon: "/images/home/footerSocialIcon/linkedin.svg",
        dark_icon: "/images/home/footerSocialIcon/linkedin_dark.svg",
        link: "https://linkedin.com/in",
      },
      {
        icon: "/images/home/footerSocialIcon/dribble.svg",
        dark_icon: "/images/home/footerSocialIcon/dribble_dark.svg",
        link: "https://dribbble.com",
      },
      {
        icon: "/images/home/footerSocialIcon/instagram.svg",
        dark_icon: "/images/home/footerSocialIcon/instagram_dark.svg",
        link: "https://instagram.com",
      },
    ],
  },
  sitemap: {
    name: "Hızlı Erişim",
    links: [
      { name: "İletişim", url: "/contact" },
      { name: "Hakkımızda", url: "/#aboutus" },
      { name: "Modeller", url: "/#models" },
      { name: "Kategoriler", url: "/#categories" },
      { name: "Fiyatlandırma", url: "/#pricing" },
    ],
  },
  otherPages: {
    name: "Diğer Sayfalar",
    links: [
      { name: "Hata 404", url: "/not-found" },
      { name: "Şartlar & Koşullar", url: "/terms-and-conditions" },
      { name: "Gizlilik Politikası", url: "/privacy-policy" },
      { name: "Dokümantasyon", url: "/documentation" },
    ],
  },
  contactDetails: {
    name: "İletişim Bilgileri",
    address: "İstanbul, Türkiye",
    email: "destek@3dmarket.com",
    phone: "+90 212 000 00 00",
  },
  copyright: "©2025 3D Market. Tüm Hakları Saklıdır",
};

export const GET = async () => {
  return NextResponse.json({
    headerData,
    footerData,
  });
};
