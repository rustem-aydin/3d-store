import { NextResponse } from "next/server";
export const runtime = "edge";
const avatarList = [
  {
    image: "/images/home/avatar_1.jpg",
    title: "Caner Aydın",
  },
  {
    image: "/images/home/avatar_2.jpg",
    title: "Murat Can",
  },
  {
    image: "/images/home/avatar_4.jpg",
    title: "Deniz Kaya",
  },
  {
    image: "/images/home/onlinePresence/online_img_1.jpg",
    title: "Ahmet Yılmaz",
  },
];

const brandList = [
  {
    image: "/images/home/brand/brand-icon-1.svg",
    darkImg: "/images/home/brand/brand-darkicon-1.svg",
    title: "Adobe",
  },
  {
    image: "/images/home/brand/brand-icon-2.svg",
    darkImg: "/images/home/brand/brand-darkicon-2.svg",
    title: "Figma",
  },
  {
    image: "/images/home/brand/brand-icon-3.svg",
    darkImg: "/images/home/brand/brand-darkicon-3.svg",
    title: "Shopify",
  },
  {
    image: "/images/home/brand/brand-icon-4.svg",
    darkImg: "/images/home/brand/brand-darkicon-4.svg",
    title: "Dribble",
  },
  {
    image: "/images/home/brand/brand-icon-5.svg",
    darkImg: "/images/home/brand/brand-darkicon-5.svg",
    title: "Webflow",
  },
];

const innovationList = [
  {
    image: "/images/home/innovation/brand.svg",
    title: "Yüksek\nDetay",
    bg_color: "bg-purple/20",
    txt_color: "text-purple",
  },
  {
    image: "/images/home/innovation/digitalmarketing.svg",
    title: "Optimize\nMesh",
    bg_color: "bg-blue/20",
    txt_color: "text-blue",
  },
  {
    image: "/images/home/innovation/uiux.svg",
    title: "Hazır\nKaplamalar",
    bg_color: "bg-orange/20",
    txt_color: "text-orange",
  },
  {
    image: "/images/home/innovation/analitics.svg",
    title: "Riglenmiş\nModeller",
    bg_color: "bg-green/20",
    txt_color: "text-green",
  },
  {
    image: "/images/home/innovation/webdevp.svg",
    title: "Farklı\nFormatlar",
    bg_color: "bg-pink/20",
    txt_color: "text-pink",
  },
];

const onlinePresenceList = [
  {
    image: "/images/home/onlinePresence/online_img_1.jpg",
    title: "Modern Koltuk Takımı",
    tag: ["Mobilya", "4K Texture"],
    link: "/#",
  },
  {
    image: "/images/home/onlinePresence/online_img_2.jpg",
    title: "Endüstriyel Robot Kolu",
    tag: ["Mekanik", "Rigged"],
    link: "/#",
  },
  {
    image: "/images/home/onlinePresence/online_img_3.jpg",
    title: "Antik Sütun",
    tag: ["Mimari", "Low Poly"],
    link: "/#",
  },
  {
    image: "/images/home/onlinePresence/online_img_1.jpg",
    title: "Siberpunk Karakter",
    tag: ["Karakter", "Oyun Hazır"],
    link: "/#",
  },
];

const creativeMindList = [
  {
    image: "/images/home/creative/creative_img_1.png",
    name: "Caner Aydın",
    position: "Baş 3D Sanatçısı",
    twitterLink: "https://x.com/",
    linkedinLink: "https://in.linkedin.com/",
  },
  {
    image: "/images/home/creative/creative_img_3.png",
    name: "Murat Can",
    position: "Modelleme & Rigging",
    twitterLink: "https://x.com/",
    linkedinLink: "https://in.linkedin.com/",
  },
  {
    image: "/images/home/creative/creative_img_3.png",
    name: "Deniz Kaya",
    position: "Teknik Sanat Yönetmeni",
    twitterLink: "https://x.com/",
    linkedinLink: "https://in.linkedin.com/",
  },
];

const WebResultTagList = [
  {
    image: "/images/home/result/creativity.svg",
    name: "Yaratıcılık",
    bg_color: "bg-purple/20",
    txt_color: "text-purple",
  },
  {
    image: "/images/home/result/innovation.svg",
    name: "İnovasyon",
    bg_color: "bg-blue/20",
    txt_color: "text-blue",
  },
  {
    image: "/images/home/result/strategy.svg",
    name: "Kalite",
    bg_color: "bg-orange/20",
    txt_color: "text-orange",
  },
];

const startupPlanList = [
  {
    plan_bg_color: "bg-pale-yellow",
    text_color: "text-dark_black",
    descp_color: "dark_black/60",
    border_color: "border-dark_black/10",
    plan_name: "Standart Lisans",
    plan_descp: "Bireysel ve küçük ölçekli projeler için ideal kullanım.",
    plan_price: "$49",
    icon_img: "/images/home/startupPlan/white_tick.svg",
    plan_feature: [
      "Ticari Olmayan Kullanım",
      "FBX ve OBJ Formatları",
      "Standart 2K Texture",
      "E-posta Desteği",
      "Sınırsız Proje Hakkı",
    ],
  },
  {
    plan_bg_color: "bg-purple_blue",
    text_color: "text-white",
    descp_color: "white/60",
    border_color: "border-white/10",
    plan_name: "Genişletilmiş Lisans",
    plan_descp: "Büyük oyun projeleri ve ticari reklamlar için tam yetki.",
    plan_price: "$199",
    icon_img: "/images/home/startupPlan/black_tick.svg",
    plan_feature: [
      "Tam Ticari Kullanım",
      "Tüm Kaynak Dosyalar (Blender/Maya)",
      "4K & 8K PBR Texture",
      "Öncelikli Canlı Destek",
      "Ömür Boyu Güncellemeler",
      "Özel Talep Hakkı",
    ],
  },
];

const faqList = [
  {
    faq_que: "Modeller hangi formatlarda sunuluyor?",
    faq_ans:
      "Modellerimiz genellikle .FBX, .OBJ ve .BLEND formatlarında sunulmaktadır. İhtiyaca göre özel format taleplerini de karşılıyoruz.",
  },
  {
    faq_que: "Modelleri ticari projelerimde kullanabilir miyim?",
    faq_ans:
      "Genişletilmiş Lisans satın aldığınızda, modellerimizi oyun, reklam ve film gibi tüm ticari projelerinizde sınırsız olarak kullanabilirsiniz.",
  },
  {
    faq_que: "Satın aldığım modelleri nasıl indirebilirim?",
    faq_ans:
      "Ödeme işleminiz tamamlandığında indirme bağlantısı otomatik olarak profilinize eklenir ve e-posta adresinize gönderilir.",
  },
  {
    faq_que: "Modellerde özelleştirme yapıyor musunuz?",
    faq_ans:
      "Evet, mevcut modeller üzerinde değişiklik veya sıfırdan özel modelleme talepleri için bizimle iletişime geçebilirsiniz.",
  },
  {
    faq_que: "Texture çözünürlükleri nedir?",
    faq_ans:
      "Modellerimizin büyük çoğunluğu 2K veya 4K PBR (fiziksel tabanlı) kaplamalarla birlikte gelmektedir.",
  },
  {
    faq_que: "Para iadesi yapıyor musunuz?",
    faq_ans:
      "Dijital ürünlerin doğası gereği indirilen ürünlerde iade yapılmaz, ancak teknik bir sorun yaşarsanız her zaman yanınızdayız.",
  },
];

const achievementsList = [
  {
    icon: "/images/home/achievement/framer_award.svg",
    dark_icon: "/images/home/achievement/dark_framer_award.svg",
    sub_title: "3D Tasarım Ödülü",
    title:
      "2024 yılının en iyi optimize edilmiş karakter tasarımı ödülüne layık görüldük.",
    year: "2024",
    url: "#",
  },
  {
    icon: "/images/home/achievement/dribble_award.svg",
    dark_icon: "/images/home/achievement/dribble_award.svg",
    sub_title: "Kreatif Mükemmellik",
    title: "Daha gerçekçi kaplamalar ve PBR iş akışlarımızla tanınıyoruz.",
    year: "2023",
    url: "#",
  },
  {
    icon: "/images/home/achievement/awward_award.svg",
    dark_icon: "/images/home/achievement/dark_awward_award.svg",
    sub_title: "Yılın Model Marketi",
    title:
      "Kullanıcı dostu arayüz ve kaliteli varlıklarımızla sektörde fark yarattık.",
    year: "2022",
    url: "#",
  },
];

export const GET = async () => {
  return NextResponse.json({
    avatarList,
    brandList,
    innovationList,
    onlinePresenceList,
    creativeMindList,
    WebResultTagList,
    startupPlanList,
    faqList,
    achievementsList,
  });
};
