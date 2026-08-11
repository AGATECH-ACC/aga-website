export const profile = {
  name: "CSTAN",
  fullName: "Tan Chi Shiong",
  chineseName: "陈起祥",
  company: "AGA Ventures Sdn Bhd",
  role: "Founder & Business Architect",

  tagline: "Building business systems, automation and AI that actually work.",

  description:
    "CSTAN helps businesses understand how their operations really work, redesign their workflows, and turn those workflows into connected business systems powered by automation, data and AI.",

  companyDescription:
    "AGA Ventures helps businesses design and build connected operating systems covering sales, customers, finance, operations, people, data, automation and AI.",

  product: {
    name: "AGA OneSystem",
    description:
      "AGA OneSystem is a connected business operating system designed around the company's real workflow instead of forcing the company into generic software.",
  },

  services: [
    "Business workflow mapping",
    "ERP and business systems",
    "AI agents",
    "Business automation",
    "CRM",
    "Operations systems",
    "Finance workflow systems",
    "IoT integrations",
    "Management dashboards",
    "Data and AI solutions",
  ],

  interests: [
    "AI",
    "Business systems",
    "Automation",
    "IoT",
    "Digital transformation",
    "Entrepreneurship",
  ],

  locationContext:
    "Most visitors using this page have just met CSTAN physically and tapped his NFC business card.",

  phone: "+60183576003",
  whatsappUrl: "https://wa.me/60183576003",
  websiteUrl: "https://agaventures.ai",
  linkedinUrl: "https://www.linkedin.com/company/aga-ventures-ai/",
  instagramUrl: "https://www.instagram.com/agaventures.ai/",
  email: "enquiry@agaventures.ai",
} as const

export const localizedProfile = {
  en: {
    displayName: profile.name,
    fullName: profile.fullName,
    role: profile.role,
    tagline: profile.tagline,
    description: profile.description,
    companyDescription: profile.companyDescription,
  },
  zh: {
    displayName: profile.chineseName,
    fullName: profile.chineseName,
    role: "创办人兼企业架构师",
    tagline: "打造真正有效的企业系统、自动化与 AI。",
    description:
      "CSTAN 协助企业看清实际运营方式、重新设计工作流程，并把流程转化为由自动化、数据与 AI 驱动的互联企业系统。",
    companyDescription:
      "AGA Ventures 为企业设计和建立连接销售、客户、财务、运营、人才、数据、自动化与 AI 的运营系统。",
  },
} as const

export type ProfileLocale = keyof typeof localizedProfile
