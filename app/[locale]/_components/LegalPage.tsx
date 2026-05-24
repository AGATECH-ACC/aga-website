import { notFound } from "next/navigation"

import { Card, CardContent } from "@/components/ui/card"
import { SectionHeader, WebsiteContainer, WebsiteSection } from "@/components/website"
import { isLocale, type Locale } from "@/lib/i18n/dictionary"

import { LocalizedShell } from "./LocalizedShell"

type LegalPageKey = "privacy-policy" | "terms-of-service" | "cookie-policy" | "trust-center" | "support"

type LegalPageProps = {
  params: Promise<{ locale: string }>
  pageKey: LegalPageKey
}

const legalContent: Record<
  LegalPageKey,
  Record<
    Locale,
    {
      eyebrow: string
      title: string
      accent: string
      description: string
      sections: Array<{ title: string; body: string }>
    }
  >
> = {
  "privacy-policy": {
    en: {
      eyebrow: "Legal",
      title: "Privacy",
      accent: "Policy",
      description: "Last updated: May 24, 2026. How AGA OneSystem(R) collects, uses, stores, protects, and discloses information.",
      sections: [
        {
          title: "1. Information We Collect",
          body: "1.1 Information you provide\nWhen you register, enquire, use our services, or submit forms, we may collect your name, company name, mobile number, email address, job title, financial or business information, uploaded files and attachments, API keys, and system connection configuration.\n\n1.2 Information collected automatically\nWhen you access the platform, we may collect IP address, browser type, operating system, device information, login time, usage activity, system clicks and operation logs, cookies, and session data.\n\n1.3 Information from third-party sources\nWe may receive data from payment platforms, CRM systems, ERP systems, WhatsApp API, Lark / Feishu, Google login, and Meta / Facebook advertising systems.",
        },
        {
          title: "2. Purposes of Use",
          body: "We use your information to provide services such as system deployment, AI Agent services, ERP / CRM functions, finance workflows, and automation flows.\n\nWe may also use information for system optimization, including AI model improvement, feature enhancement, bug fixes, and performance analysis.\n\nFor security, information may be used for risk monitoring, permission verification, fraud prevention, and audit records.\n\nFor support, information may be used for technical support, ticket handling, client communication, and system notifications.",
        },
        {
          title: "3. Data Storage and Security",
          body: "We may use AWS, Supabase, Vercel, Cloudflare, and Lark Cloud for data processing and storage.\n\nSecurity measures may include HTTPS/TLS encryption, IAM permission control, database access restrictions, MFA, log monitoring, and automated backups.\n\nWe retain data only for necessary periods, including legal requirements, financial records, system audits, and service performance.",
        },
        {
          title: "4. Data Sharing and Disclosure",
          body: "We do not sell your personal data.\n\nData may be disclosed when required by law, court order, or regulatory authority; when needed for service integrations such as payment gateways, WhatsApp API, or cloud service providers; or during business transactions such as mergers, acquisitions, or company restructuring.",
        },
        {
          title: "5. AI and Automation Notice",
          body: "AGA is an AI Native enterprise system platform. You understand and agree that some functions may be processed automatically by AI, AI may analyze business workflows and data, AI outputs are for decision support only, and users must review important content themselves.\n\nWe will not use client data to publicly train models without authorization.",
        },
        {
          title: "6. Cookies",
          body: "Please refer to our Cookie Policy page.",
        },
        {
          title: "7. User Rights",
          body: "You may request to access data, correct data, delete data, export data, restrict processing, or withdraw authorization. Contact support@aga.my.",
        },
        {
          title: "8. Cross-Border Data Transfer",
          body: "Because the system may use international cloud services, your data may be processed in different countries. We will take reasonable measures to protect data security.",
        },
        {
          title: "9. Children",
          body: "This platform is not directed to children under 13. If we discover that such data was collected by mistake, we will delete it.",
        },
        {
          title: "10. Updates and Contact",
          body: "We may update this policy at any time. Major updates may be notified by email, system notification, or website announcement.\n\nAGA OneSystem(R)\nEmail: support@aga.my\nWebsite: https://aga.my",
        },
      ],
    },
    zh: {
      eyebrow: "法律",
      title: "隐私",
      accent: "政策",
      description: "最后更新日期：2026年5月24日。欢迎使用 AGA 系统掌柜® 所提供的产品与服务。我们高度重视您的隐私与数据安全。",
      sections: [
        {
          title: "1. 我们收集的信息",
          body: "1.1 用户主动提供的信息\n当您注册、咨询、使用服务或提交表单时，我们可能收集：姓名、公司名称、手机号码、电邮地址、公司职位、财务或业务资料、上传文件与附件、API Keys 或系统连接配置。\n\n1.2 自动收集的信息\n当您访问本平台时，我们可能自动收集：IP 地址、浏览器类型、操作系统、设备信息、登录时间、使用行为记录、系统点击与操作日志、Cookies 与 Session 数据。\n\n1.3 第三方来源信息\n我们可能从支付平台、CRM 系统、ERP 系统、WhatsApp API、Lark / Feishu、Google 登录、Meta / Facebook 广告系统取得数据。",
        },
        {
          title: "2. 信息使用目的",
          body: "我们使用您的信息以提供服务，包括系统部署、AI Agent 服务、ERP / CRM 功能、财务与自动化流程。\n\n我们也会用于系统优化，包括 AI 模型优化、功能改进、Bug 修复、性能分析。\n\n安全用途包括风险监控、权限验证、防止欺诈、审计记录。\n\n客户支持用途包括技术支持、工单处理、客户沟通、系统通知。",
        },
        {
          title: "3. 数据存储与安全",
          body: "我们可能使用 AWS、Supabase、Vercel、Cloudflare、Lark Cloud 用于数据处理与存储。\n\n我们采用 HTTPS/TLS 加密、IAM 权限控制、数据库访问限制、MFA 多重验证、日志监控、自动备份机制。\n\n我们仅在必要期间保留数据，包括法律要求、财务记录、系统审计、服务履约。",
        },
        {
          title: "4. 数据共享与披露",
          body: "我们不会出售您的个人数据。\n\n但在法律、法院或监管机构要求时；服务整合需求如 Payment Gateway、WhatsApp API、云端服务供应商；或合并、收购、公司重组等企业交易中，相关数据可能被披露或转移。",
        },
        {
          title: "5. AI 与自动化使用声明",
          body: "AGA 为 AI Native 企业系统平台。您理解并同意：部分功能由 AI 自动处理；AI 可能分析业务流程与数据；AI 输出仅供辅助决策；用户需自行审核关键内容。\n\n我们不会在未经授权情况下，将客户数据用于公开训练模型。",
        },
        {
          title: "6. Cookies 政策",
          body: "请参考我们的 Cookie 政策页面。",
        },
        {
          title: "7. 用户权利",
          body: "您拥有查询数据、更正数据、删除数据、导出数据、限制处理、撤回授权等权利。您可通过 support@aga.my 联系我们。",
        },
        {
          title: "8. 跨境数据传输",
          body: "由于系统可能使用国际云服务，您的数据可能在不同国家处理。我们将采取合理措施确保数据安全。",
        },
        {
          title: "9. 未成年人政策",
          body: "本平台不面向13岁以下儿童。若发现误收集相关数据，我们将删除。",
        },
        {
          title: "10. 政策更新与联系我们",
          body: "我们可能随时更新本政策。重大更新将通过 Email、系统通知、网站公告通知用户。\n\nAGA 系统掌柜®\nEmail：support@aga.my\nWebsite：https://aga.my",
        },
      ],
    },
  },
  "terms-of-service": {
    en: {
      eyebrow: "Legal",
      title: "Terms of",
      accent: "Service",
      description: "Last updated: May 24, 2026. These terms govern your use of the AGA OneSystem(R) platform and related services.",
      sections: [
        {
          title: "1. Scope of Services",
          body: "AGA provides enterprise digital systems, AI Native workflows, ERP / CRM / HRM, finance and automation modules, AI Agent integrations, system development, and consulting services.",
        },
        {
          title: "2. User Eligibility and Account Responsibility",
          body: "You must have legal capacity, a lawful business purpose, and provide truthful information.\n\nYou are responsible for password security, API keys, permission management, and login activity. Any account activity is deemed to be performed by the user.",
        },
        {
          title: "3. Prohibited Conduct",
          body: "Users must not hack the system, scrape data, distribute malicious code, access systems illegally, disrupt system stability, or use AI to generate unlawful content.",
        },
        {
          title: "4. AI Disclaimer",
          body: "AI outputs are not guaranteed to be 100% accurate, do not constitute legal, financial, or medical advice, and must be reviewed by users. AGA is not responsible for direct losses caused by AI output.",
        },
        {
          title: "5. Service Availability",
          body: "We do not guarantee that the service will never be interrupted, error-free, or maintenance-free. The system may be updated, upgraded, or temporarily suspended for maintenance.",
        },
        {
          title: "6. Payment and Billing",
          body: "Users must pay subscription fees, setup fees, module fees, and support fees on time. Late payment may result in feature restrictions, service suspension, or data freeze.",
        },
        {
          title: "7. Data and Backups",
          body: "Users should keep important data and perform regular backups. AGA is not responsible for data loss caused by third-party failures.",
        },
        {
          title: "8. Intellectual Property",
          body: "All system design, UI/UX, code, AI workflows, documents, and trademarks belong to AGA or authorized parties. They may not be copied without permission.",
        },
        {
          title: "9. Third-Party Services",
          body: "The platform may integrate AWS, OpenAI, Anthropic, Stripe, WhatsApp API, and Google Services. AGA is not responsible for third-party service interruptions.",
        },
        {
          title: "10. Termination, Liability, and Law",
          body: "AGA may terminate service for breach of terms, illegal conduct, malicious attacks, or unpaid fees.\n\nAGA is not liable for indirect losses, business losses, data losses, or AI judgment errors. Total liability shall not exceed the amount paid by the user in the previous 12 months.\n\nThese terms are governed by Malaysian law, and disputes are subject to Malaysian courts.",
        },
      ],
    },
    zh: {
      eyebrow: "法律",
      title: "服务",
      accent: "条款",
      description: "最后更新日期：2026年5月24日。本服务条款规范您对 AGA 系统掌柜® 平台及相关服务的使用。",
      sections: [
        {
          title: "1. 服务范围",
          body: "AGA 提供企业数字化系统、AI Native Workflow、ERP / CRM / HRM、财务与自动化模块、AI Agent 集成、系统开发与顾问服务。",
        },
        {
          title: "2. 用户资格与账户责任",
          body: "您必须具备合法行为能力、拥有合法业务用途，并提供真实信息。\n\n您需自行负责密码安全、API Keys、权限管理、登录行为。任何账户活动均视为用户本人操作。",
        },
        {
          title: "3. 禁止行为",
          body: "用户不得破解系统、爬取数据、散播恶意代码、非法访问、干扰系统稳定性，或利用 AI 生成违法内容。",
        },
        {
          title: "4. AI 使用免责声明",
          body: "AI 输出不保证100%准确，不构成法律、财务或医疗建议，用户需自行审核。AGA 不对 AI 输出直接损失负责。",
        },
        {
          title: "5. 服务可用性",
          body: "我们不保证永不中断、永无错误或永不维护。系统可能更新、升级或暂停维护。",
        },
        {
          title: "6. 付款与账单",
          body: "用户需按时支付 Subscription、Setup Fee、Module Fee、Support Fee。逾期可能导致功能限制、服务暂停或数据冻结。",
        },
        {
          title: "7. 数据与备份",
          body: "用户应自行保存重要数据并定期备份。AGA 不对第三方故障造成的数据损失负责。",
        },
        {
          title: "8. 知识产权",
          body: "所有系统设计、UI/UX、代码、AI Workflow、文档、商标均属于 AGA 或授权方。未经许可不得复制。",
        },
        {
          title: "9. 第三方服务",
          body: "本平台可能整合 AWS、OpenAI、Anthropic、Stripe、WhatsApp API、Google Services。AGA 不对第三方服务中断负责。",
        },
        {
          title: "10. 服务终止、责任限制与法律适用",
          body: "AGA 可在违反条款、非法行为、恶意攻击或欠费时终止服务。\n\nAGA 不承担间接损失、商业损失、数据损失、AI 判断错误。总责任不超过用户最近12个月支付金额。\n\n本条款受马来西亚法律管辖，争议以马来西亚法院为准。",
        },
      ],
    },
  },
  "cookie-policy": {
    en: {
      eyebrow: "Legal",
      title: "Cookie",
      accent: "Policy",
      description: "Last updated: May 24, 2026. How AGA OneSystem(R) uses cookies and similar technologies.",
      sections: [
        {
          title: "1. What Are Cookies",
          body: "Cookies are small text files stored in the browser. They may be used for login status, security verification, user preferences, and traffic analytics.",
        },
        {
          title: "2. Types of Cookies We Use",
          body: "2.1 Necessary cookies\nUsed for login authentication, session management, and security mechanisms. Some functions may not work if disabled.\n\n2.2 Analytics cookies\nUsed for user behavior analysis, page performance optimization, and traffic statistics.\n\n2.3 Functional cookies\nUsed for language settings, dark mode, and user preferences.\n\n2.4 Advertising cookies\nMay be used for Meta Pixel, Google Ads, and remarketing ads.",
        },
        {
          title: "3. Third-Party Cookies",
          body: "Some cookies may come from third parties such as Google Analytics, Cloudflare, Stripe, Meta, and YouTube.",
        },
        {
          title: "4. Cookie Management and Updates",
          body: "Users may delete cookies, disable cookies, or adjust browser permissions. We may update this policy from time to time.",
        },
      ],
    },
    zh: {
      eyebrow: "法律",
      title: "Cookie",
      accent: "政策",
      description: "最后更新日期：2026年5月24日。AGA 系统掌柜® 如何使用 Cookie 与类似技术。",
      sections: [
        {
          title: "1. 什么是 Cookie",
          body: "Cookie 是网站存储于浏览器中的小型文本文件，用于登录状态、安全验证、用户偏好、分析流量。",
        },
        {
          title: "2. 我们使用的 Cookie 类型",
          body: "2.1 必要 Cookie\n用于登录认证、Session 管理、安全机制。关闭后部分功能无法使用。\n\n2.2 分析 Cookie\n用于用户行为分析、页面性能优化、流量统计。\n\n2.3 功能 Cookie\n用于语言设置、深色模式、用户偏好。\n\n2.4 广告 Cookie\n可能用于 Meta Pixel、Google Ads、再营销广告。",
        },
        {
          title: "3. 第三方 Cookie",
          body: "部分 Cookie 来自第三方，包括 Google Analytics、Cloudflare、Stripe、Meta、YouTube。",
        },
        {
          title: "4. Cookie 管理与更新",
          body: "用户可删除 Cookie、禁用 Cookie、调整浏览器权限。我们可能更新本政策。",
        },
      ],
    },
  },
  "trust-center": {
    en: {
      eyebrow: "Trust",
      title: "Trust",
      accent: "Center",
      description: "How AGA OneSystem(R) approaches security, AI governance, monitoring, and resilience.",
      sections: [
        {
          title: "1. Security Philosophy",
          body: "AGA adopts an AI Native enterprise architecture. Security is one of the core principles of the system.",
        },
        {
          title: "2. Cloud Infrastructure",
          body: "We may use AWS Cloud, global CDN, auto-scaling architecture, and disaster recovery backup mechanisms.",
        },
        {
          title: "3. Data Protection",
          body: "Protection measures may include data encryption, permission layers, audit logs, IP access control, and MFA.",
        },
        {
          title: "4. AI Governance",
          body: "AGA AI systems follow human-in-the-loop review, least privilege, data isolation, and audit traceability.",
        },
        {
          title: "5. Security Monitoring",
          body: "We monitor API health, queue status, access logs, and abnormal behavior.",
        },
        {
          title: "6. Compliance Direction",
          body: "We reference PDPA Malaysia, ISO 27001, ISO 9001, and ISO/IEC 42001 as compliance directions.",
        },
        {
          title: "7. Disaster Recovery",
          body: "Disaster recovery may include automatic backups, multi-region architecture, data recovery processes, and incident response.",
        },
      ],
    },
    zh: {
      eyebrow: "信任",
      title: "信任",
      accent: "中心",
      description: "AGA 系统掌柜® 如何处理安全、AI 治理、监控与灾难恢复。",
      sections: [
        {
          title: "1. 安全理念",
          body: "AGA 采用 AI Native 企业级架构。安全为系统核心之一。",
        },
        {
          title: "2. 云端基础设施",
          body: "我们采用 AWS Cloud、全球 CDN、自动扩展架构、容灾备份机制。",
        },
        {
          title: "3. 数据保护",
          body: "包括数据加密、权限分层、审计日志、IP 访问控制、MFA。",
        },
        {
          title: "4. AI 治理",
          body: "AGA AI 系统遵循 Human-in-the-loop、最小权限原则、数据隔离、审计追踪。",
        },
        {
          title: "5. 安全监控",
          body: "持续监控 API Health、Queue Status、Access Logs、异常行为。",
        },
        {
          title: "6. 合规方向",
          body: "参考 PDPA Malaysia、ISO 27001、ISO 9001、ISO/IEC 42001。",
        },
        {
          title: "7. 灾难恢复",
          body: "包括自动备份、多区域架构、数据恢复流程、Incident Response。",
        },
      ],
    },
  },
  support: {
    en: {
      eyebrow: "Support",
      title: "Contact",
      accent: "Support",
      description: "Customer support center for AGA OneSystem(R).",
      sections: [
        {
          title: "1. Support Scope",
          body: "Support includes technical issues, bug reports, system enquiries, AI Agent assistance, finance and billing questions, and ERP workflow enquiries.",
        },
        {
          title: "2. Contact Methods",
          body: "Email: support@aga.my\nWebsite: https://aga.my\nWhatsApp: +60 XX-XXXX XXX",
        },
        {
          title: "3. Service Hours",
          body: "Monday to Friday\n10:00 AM - 6:00 PM (GMT+8)",
        },
        {
          title: "4. Emergency Support",
          body: "For serious system issues, submit a Priority Ticket, Emergency Support request, or Incident Report.",
        },
        {
          title: "5. SLA Response Time",
          body: "Critical: 2-6 hours\nHigh: 12 hours\nMedium: 24 hours\nLow: 48 hours",
        },
        {
          title: "6. Ticket Information",
          body: "Please provide screenshots, operation steps, browser information, user account, and error messages so we can handle the issue faster.",
        },
      ],
    },
    zh: {
      eyebrow: "支持",
      title: "联系",
      accent: "支持",
      description: "客户支持中心。感谢使用 AGA 系统掌柜®。",
      sections: [
        {
          title: "1. 支持服务范围",
          body: "包括技术问题、Bug 回报、系统咨询、AI Agent 协助、财务与账单问题、ERP 流程咨询。",
        },
        {
          title: "2. 联系方式",
          body: "Email：support@aga.my\nWebsite：https://aga.my\nWhatsApp：+60 XX-XXXX XXX",
        },
        {
          title: "3. 服务时间",
          body: "周一至周五\n10:00 AM – 6:00 PM (GMT+8)",
        },
        {
          title: "4. 紧急支持",
          body: "严重系统问题可提交 Priority Ticket、Emergency Support、Incident Report。",
        },
        {
          title: "5. SLA 响应时间",
          body: "Critical：2–6小时\nHigh：12小时\nMedium：24小时\nLow：48小时",
        },
        {
          title: "6. 工单说明",
          body: "请提供问题截图、操作步骤、浏览器信息、用户账号、错误信息，以便更快处理。",
        },
      ],
    },
  },
}

export async function LegalPage({ params, pageKey }: LegalPageProps) {
  const { locale: localeParam } = await params

  if (!isLocale(localeParam)) {
    notFound()
  }

  const locale: Locale = localeParam
  const content = legalContent[pageKey][locale]

  return (
    <LocalizedShell locale={locale} path={`/${locale}/${pageKey}`}>
      <WebsiteSection>
        <WebsiteContainer className="flex flex-col gap-10">
          <SectionHeader
            eyebrow={content.eyebrow}
            title={content.title}
            accent={content.accent}
            description={content.description}
          />
          <div className="mx-auto grid w-full max-w-3xl gap-4">
            {content.sections.map((section) => (
              <Card key={section.title}>
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-xl font-semibold tracking-normal">{section.title}</h2>
                  <p className="mt-3 whitespace-pre-line text-base leading-8 text-muted-foreground">{section.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </WebsiteContainer>
      </WebsiteSection>
    </LocalizedShell>
  )
}
