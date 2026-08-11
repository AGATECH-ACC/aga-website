"use client"

import Image from "next/image"
import Link from "next/link"
import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type UIEvent,
} from "react"
import {
  BriefcaseBusiness,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Globe2,
  Mail,
  Languages,
  Phone,
  Rocket,
  Share2,
  Sparkles,
  UserPlus,
} from "lucide-react"

import styles from "./gulichantan.module.css"

import { InstagramIcon, LinkedInIcon, WhatsAppIcon } from "@/components/icons/BrandIcons"
import type { Locale } from "@/lib/i18n/dictionary"

const phoneNumber = "+60183576003"
const email = "enquiry@agaventures.ai"
const linkedInUrl = "https://www.linkedin.com/company/aga-ventures-ai/"
const instagramUrl = "https://www.instagram.com/agaventures.ai/"
const websiteUrl = "https://www.agaventures.ai/"

const tabs = ["about", "focus", "experience", "contact"] as const
type Tab = (typeof tabs)[number]

const content = {
  en: {
    displayName: "Tan Chi Shiong",
    headerSubtitle: "Founder, AGA Ventures",
    languageLabel: "切换至中文",
    languageCode: "中",
    share: "Share",
    shareAria: "Share this profile",
    copied: "Copied",
    shareText: "Connect with Tan Chi Shiong, founder of AGA Ventures.",
    whatsappMessage: "Hi Chi Shiong, I found your contact page and would like to connect.",
    eyebrow: "AI Transformation Partner",
    heroDescription: "Helping SME owners build businesses that run with clarity.",
    companyCta: "Explore AGA Ventures",
    stats: [
      { value: "10+ years", label: "Experience" },
      { value: "Founder", label: "AGA Ventures" },
      { value: "AI + Ops", label: "Specialist" },
    ],
    tabs: {
      about: "About",
      focus: "Focus",
      experience: "Experience",
      contact: "Contact",
    },
    tabContent: {
      about: {
        title: "About Chi Shiong",
        body:
          "Founder of AGA Ventures and a certified business systemization architect. I help Malaysian SME owners turn scattered work into clear systems, stronger teams, and AI-enabled operations.",
        items: [
          "Certified systemization architect",
          "Founder-led SME advisory",
          "Malaysia based · GMT+8",
        ],
      },
      focus: {
        title: "What I work on",
        body:
          "I design practical operating systems that make ownership clear, reduce follow-up, and give leaders better visibility.",
        items: ["Operating model & ownership", "Workflow automation", "Practical AI adoption"],
      },
      experience: {
        title: "10+ years of experience",
        body:
          "A decade of helping business owners replace manual follow-up, Excel-heavy processes, and verbal approvals with repeatable systems that scale.",
        items: ["SME transformation", "Cross-functional operations", "Implementation, not theory"],
      },
      contact: {
        title: "Let’s connect",
        body:
          "Share what you are trying to improve and where work currently gets stuck. I usually reply within one business day.",
        items: ["WhatsApp for fastest reply", "Email for project briefs", "Instagram & LinkedIn updates"],
      },
    },
    profileTitle: "Business Systemization Architect",
    whatsapp: "WhatsApp",
    whatsappAction: "Send a quick message",
    phone: "Phone",
    phoneAction: "Call now",
    email: "Email",
    emailAction: "Send a message",
    linkedInAction: "View profile",
    instagramAction: "Follow AGA",
    website: "Website",
    websiteAction: "Visit AGA Ventures",
    cta: "Start a conversation",
    saveContact: "Save contact",
    responseNote: "Usually replies within one business day",
    moreInfoTitle: "How I can help",
    moreInfoItems: [
      {
        title: "Systemize operations",
        body: "Clarify ownership, workflows, approvals, and the numbers that matter.",
      },
      {
        title: "Automate repetitive work",
        body: "Connect everyday tools and remove manual follow-up from the team.",
      },
      {
        title: "Apply AI with purpose",
        body: "Turn practical AI opportunities into measurable business outcomes.",
      },
    ],
    moreInfoFooter: "Based in Malaysia · Working with SME owners and leadership teams",
    experienceDetailsTitle: "Selected experience",
    experienceDetails: [
      {
        kicker: "Founder",
        title: "AGA Ventures",
        body: "Building practical AI and operations transformation programs for Malaysian SMEs.",
      },
      {
        kicker: "Certified",
        title: "Business systemization",
        body: "Turning owner knowledge into clear roles, repeatable workflows, and measurable operating rhythms.",
      },
      {
        kicker: "Delivery",
        title: "Cross-functional implementation",
        body: "Working across leadership, operations, and technology to move improvements from plan to practice.",
      },
    ],
    experienceFooter: "Strategy, systems, and implementation in one engagement",
    highlightsLabel: "Profile highlights",
    tabsLabel: "Profile sections",
    detailsLabel: "Scrollable profile details",
    expandDetails: "Expand profile details",
    collapseDetails: "Pull down to minimize profile details",
    messageAria: "Message Tan Chi Shiong on WhatsApp",
    callAria: `Call ${phoneNumber}`,
  },
  zh: {
    displayName: "陈起祥",
    headerSubtitle: "AGA Ventures 创办人",
    languageLabel: "Switch to English",
    languageCode: "EN",
    share: "分享",
    shareAria: "分享此联系资料",
    copied: "已复制",
    shareText: "联系 AGA Ventures 创办人陈起祥。",
    whatsappMessage: "你好起祥，我从你的联系页面找到你，想和你聊聊。",
    eyebrow: "AI 转型伙伴",
    heroDescription: "帮助 SME 老板打造清晰运作的企业。",
    companyCta: "了解 AGA Ventures",
    stats: [
      { value: "10+ 年", label: "实战经验" },
      { value: "创办人", label: "AGA Ventures" },
      { value: "AI + 运营", label: "专业领域" },
    ],
    tabs: {
      about: "关于",
      focus: "专长",
      experience: "经历",
      contact: "联系",
    },
    tabContent: {
      about: {
        title: "关于陈起祥",
        body:
          "AGA Ventures 创办人兼认证企业系统化架构师。我协助马来西亚 SME 老板把分散的工作转化为清晰系统、更强团队与 AI 驱动的运营模式。",
        items: ["认证企业系统化架构师", "创办人级 SME 顾问", "立足马来西亚 · GMT+8"],
      },
      focus: {
        title: "我的专长",
        body:
          "设计务实的运营系统，厘清责任、减少人工跟进，并让管理层更清楚掌握业务。",
        items: ["运营模式与责任", "流程自动化", "实用 AI 落地"],
      },
      experience: {
        title: "超过 10 年经验",
        body:
          "十多年来协助企业老板摆脱人工跟进、过度依赖 Excel 与口头审批，建立可复制、可扩展的运营系统。",
        items: ["SME 企业转型", "跨部门运营", "重执行，不空谈"],
      },
      contact: {
        title: "保持联系",
        body:
          "告诉我你想改善什么，以及工作目前卡在哪里。我通常会在一个工作日内回复。",
        items: ["WhatsApp 最快回复", "电邮发送项目简介", "Instagram 与 LinkedIn 动态"],
      },
    },
    profileTitle: "企业系统化架构师",
    whatsapp: "WhatsApp",
    whatsappAction: "发送即时消息",
    phone: "电话",
    phoneAction: "立即拨打",
    email: "电邮",
    emailAction: "发送电邮",
    linkedInAction: "查看主页",
    instagramAction: "关注 AGA",
    website: "官方网站",
    websiteAction: "访问 AGA Ventures",
    cta: "开始联系",
    saveContact: "保存联系人",
    responseNote: "通常在一个工作日内回复",
    moreInfoTitle: "我能如何协助",
    moreInfoItems: [
      {
        title: "企业运营系统化",
        body: "厘清责任、流程、审批，以及真正重要的经营数据。",
      },
      {
        title: "自动化重复工作",
        body: "连接日常工具，减少团队依赖人工追踪与跟进。",
      },
      {
        title: "让 AI 真正落地",
        body: "把实用的 AI 机会转化为可衡量的企业成果。",
      },
    ],
    moreInfoFooter: "立足马来西亚 · 与 SME 老板及管理团队合作",
    experienceDetailsTitle: "相关经历",
    experienceDetails: [
      {
        kicker: "创办人",
        title: "AGA Ventures",
        body: "为马来西亚 SME 打造务实的 AI 与运营转型方案。",
      },
      {
        kicker: "认证",
        title: "企业系统化",
        body: "把老板的经验转化为清晰职责、可复制流程与可衡量的运营节奏。",
      },
      {
        kicker: "落地",
        title: "跨部门实施",
        body: "连接管理层、运营与技术团队，让改善方案真正从规划走向执行。",
      },
    ],
    experienceFooter: "把策略、系统与执行整合在同一个项目中",
    highlightsLabel: "个人亮点",
    tabsLabel: "资料栏目",
    detailsLabel: "可滚动的个人资料",
    expandDetails: "展开个人资料",
    collapseDetails: "下拉收起个人资料",
    messageAria: "通过 WhatsApp 联系陈起祥",
    callAria: `拨打 ${phoneNumber}`,
  },
} as const

export function GulichanTanContactCard({ locale }: { locale: Locale }) {
  const [activeTab, setActiveTab] = useState<Tab>("about")
  const [isSheetExpanded, setIsSheetExpanded] = useState(false)
  const [isSheetDragging, setIsSheetDragging] = useState(false)
  const [sheetDragOffset, setSheetDragOffset] = useState(0)
  const [shareLabel, setShareLabel] = useState("")
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const sheetScrollRef = useRef<HTMLDivElement | null>(null)
  const sheetDragStartRef = useRef<number | null>(null)
  const sheetDragOffsetRef = useRef(0)
  const ignoreHandleClickRef = useRef(false)
  const copy = content[locale]
  const alternateLocale = locale === "en" ? "zh" : "en"
  const activeContent = copy.tabContent[activeTab]
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(copy.whatsappMessage)}`
  const vCardHref = "/api/contact/tan-chi-shiong"

  async function shareProfile() {
    const shareData = {
      title: `${copy.displayName} | AGA Ventures`,
      text: copy.shareText,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return
      }

      await navigator.clipboard.writeText(window.location.href)
      setShareLabel(copy.copied)
      window.setTimeout(() => setShareLabel(copy.share), 1800)
    } catch {
      setShareLabel(copy.share)
    }
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex = index

    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length
    else if (event.key === "Home") nextIndex = 0
    else if (event.key === "End") nextIndex = tabs.length - 1
    else return

    event.preventDefault()
    const nextTab = tabs[nextIndex]
    selectTab(nextTab)
    tabRefs.current[nextIndex]?.focus()
  }

  function selectTab(tab: Tab) {
    setActiveTab(tab)
    setIsSheetExpanded(true)
    window.requestAnimationFrame(() => {
      sheetScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
    })
  }

  function handleSheetScroll(event: UIEvent<HTMLDivElement>) {
    if (event.currentTarget.scrollTop > 4) {
      setIsSheetExpanded(true)
    }
  }

  function updateSheetDragOffset(offset: number) {
    sheetDragOffsetRef.current = offset
    setSheetDragOffset(offset)
  }

  function collapseSheet() {
    sheetScrollRef.current?.scrollTo({ top: 0 })
    setIsSheetExpanded(false)
  }

  function handleSheetPointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (!isSheetExpanded) return

    sheetDragStartRef.current = event.clientY
    ignoreHandleClickRef.current = false
    setIsSheetDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handleSheetPointerMove(event: PointerEvent<HTMLElement>) {
    const dragStart = sheetDragStartRef.current
    if (dragStart === null) return

    const offset = Math.min(Math.max(event.clientY - dragStart, 0), 180)
    if (offset > 5) ignoreHandleClickRef.current = true
    updateSheetDragOffset(offset)
  }

  function finishSheetDrag() {
    if (sheetDragStartRef.current === null) return

    const shouldCollapse = sheetDragOffsetRef.current >= 64
    const shouldIgnoreClick = ignoreHandleClickRef.current
    sheetDragStartRef.current = null
    setIsSheetDragging(false)
    updateSheetDragOffset(0)

    if (shouldCollapse) collapseSheet()

    if (shouldIgnoreClick) {
      window.setTimeout(() => {
        ignoreHandleClickRef.current = false
      }, 0)
    }
  }

  function cancelSheetDrag() {
    sheetDragStartRef.current = null
    ignoreHandleClickRef.current = false
    setIsSheetDragging(false)
    updateSheetDragOffset(0)

  }

  function handleSheetHandleClick() {
    if (ignoreHandleClickRef.current) {
      ignoreHandleClickRef.current = false
      return
    }

    if (isSheetExpanded) collapseSheet()
    else setIsSheetExpanded(true)
  }

  return (
    <main className={styles.stage}>
      <article
        className={styles.card}
        aria-label={locale === "zh" ? `${copy.displayName}联系资料` : `${copy.displayName} contact profile`}
        lang={locale === "zh" ? "zh-CN" : "en"}
      >
        <header className={styles.header}>
          <Link
            href={`/${alternateLocale}/gulichantan`}
            className={`${styles.iconButton} ${styles.languageButton}`}
            aria-label={copy.languageLabel}
            title={copy.languageLabel}
          >
            <Languages aria-hidden="true" />
            <span>{copy.languageCode}</span>
          </Link>
          <div className={styles.headerTitle}>
            <strong>{copy.displayName}</strong>
            <span>{copy.headerSubtitle}</span>
          </div>
          <button className={styles.iconButton} onClick={shareProfile} type="button" aria-label={copy.shareAria}>
            <Share2 aria-hidden="true" />
            <span className={styles.srOnly}>{shareLabel || copy.share}</span>
          </button>
        </header>

        <section className={styles.hero} aria-labelledby="profile-name">
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className={styles.portrait}>
            <Image
              src="/assets/tan-chi-shiong-profile-transparent.png"
              alt={copy.displayName}
              fill
              priority
              sizes="(max-width: 430px) 70vw, 300px"
            />
          </div>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <Sparkles aria-hidden="true" />
              {copy.eyebrow}
            </p>
            <h1 id="profile-name">{copy.displayName}</h1>
            <p className={styles.heroDescription}>{copy.heroDescription}</p>
            <a className={styles.companyPill} href={websiteUrl} target="_blank" rel="noreferrer">
              <span>{copy.companyCta}</span>
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>

          <div className={styles.stats} aria-label={copy.highlightsLabel}>
            <div className={styles.statCard}>
              <CalendarDays aria-hidden="true" />
              <strong>{copy.stats[0].value}</strong>
              <span>{copy.stats[0].label}</span>
            </div>
            <div className={`${styles.statCard} ${styles.statCardAccent}`}>
              <BriefcaseBusiness aria-hidden="true" />
              <strong>{copy.stats[1].value}</strong>
              <span>{copy.stats[1].label}</span>
            </div>
            <div className={styles.statCard}>
              <Rocket aria-hidden="true" />
              <strong>{copy.stats[2].value}</strong>
              <span>{copy.stats[2].label}</span>
            </div>
          </div>
        </section>

        <section
          className={`${styles.sheet} ${isSheetExpanded ? styles.sheetExpanded : ""} ${isSheetDragging ? styles.sheetDragging : ""}`}
          style={{ "--sheet-drag-offset": `${sheetDragOffset}px` } as CSSProperties}
          onPointerMove={handleSheetPointerMove}
          onPointerUp={finishSheetDrag}
          onPointerCancel={cancelSheetDrag}
        >
          <div className={styles.sheetTop}>
            <button
              type="button"
              className={styles.dragHandle}
              aria-label={isSheetExpanded ? copy.collapseDetails : copy.expandDetails}
              aria-expanded={isSheetExpanded}
              aria-controls="profile-details-scroll"
              onClick={handleSheetHandleClick}
              onPointerDown={handleSheetPointerDown}
            >
              <span className={styles.pull} aria-hidden="true" />
            </button>
            <div className={styles.tabs} role="tablist" aria-label={copy.tabsLabel}>
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  ref={(element) => {
                    tabRefs.current[index] = element
                  }}
                  id={`profile-tab-${tab}`}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  aria-controls="profile-tab-panel"
                  tabIndex={activeTab === tab ? 0 : -1}
                  className={activeTab === tab ? styles.activeTab : undefined}
                  onClick={() => selectTab(tab)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                >
                  {copy.tabs[tab]}
                </button>
              ))}
            </div>
          </div>

          <div
            id="profile-details-scroll"
            ref={sheetScrollRef}
            className={styles.sheetScroll}
            role="region"
            aria-label={copy.detailsLabel}
            data-testid="profile-details-scroll"
            tabIndex={0}
            onScroll={handleSheetScroll}
          >
            <div
              key={`${locale}-${activeTab}`}
              id="profile-tab-panel"
              className={`${styles.about} ${styles.tabPanel}`}
              role="tabpanel"
              aria-labelledby={`profile-tab-${activeTab}`}
            >
              <h2>{activeContent.title}</h2>
              <p>{activeContent.body}</p>
              <ul className={styles.panelItems} aria-label={`${activeContent.title} highlights`}>
                {activeContent.items.map((item) => (
                  <li key={item}>
                    <CheckCircle2 aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div key={`${locale}-${activeTab}-details`} className={styles.tabDetails}>
              {activeTab === "about" && (
                <div className={styles.profileRow}>
                  <div className={styles.avatar}>
                    <Image src="/assets/tan-chi-shiong-profile.png" alt="" fill sizes="52px" />
                  </div>
                  <div className={styles.identity}>
                    <strong>{copy.displayName}</strong>
                    <span>{copy.profileTitle}</span>
                  </div>
                  <a className={styles.contactIcon} href={whatsappUrl} aria-label={copy.messageAria}>
                    <WhatsAppIcon />
                  </a>
                  <a className={styles.contactIcon} href={`tel:${phoneNumber}`} aria-label={copy.callAria}>
                    <Phone aria-hidden="true" />
                  </a>
                </div>
              )}

              {activeTab === "focus" && (
                <section className={styles.moreInfo} aria-labelledby="focus-details-title">
                  <h3 id="focus-details-title">{copy.moreInfoTitle}</h3>
                  <div className={styles.moreInfoList}>
                    {copy.moreInfoItems.map((item) => (
                      <article key={item.title}>
                        <CheckCircle2 aria-hidden="true" />
                        <div>
                          <strong>{item.title}</strong>
                          <p>{item.body}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                  <p className={styles.moreInfoFooter}>{copy.moreInfoFooter}</p>
                </section>
              )}

              {activeTab === "experience" && (
                <section className={styles.experienceSection} aria-labelledby="experience-details-title">
                  <h3 id="experience-details-title">{copy.experienceDetailsTitle}</h3>
                  <div className={styles.experienceList}>
                    {copy.experienceDetails.map((item) => (
                      <article key={item.title}>
                        <span>{item.kicker}</span>
                        <div>
                          <strong>{item.title}</strong>
                          <p>{item.body}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                  <p className={styles.moreInfoFooter}>{copy.experienceFooter}</p>
                </section>
              )}

              {activeTab === "contact" && (
                <div className={styles.contactGrid}>
                  <a href={whatsappUrl} className={styles.contactCard}>
                    <span>
                      <WhatsAppIcon />
                      {copy.whatsapp}
                    </span>
                    <strong>{copy.whatsappAction}</strong>
                  </a>
                  <a href={`tel:${phoneNumber}`} className={styles.contactCard}>
                    <span>
                      <Phone aria-hidden="true" />
                      {copy.phone}
                    </span>
                    <strong>{copy.phoneAction}</strong>
                  </a>
                  <a href={`mailto:${email}`} className={styles.contactCard}>
                    <span>
                      <Mail aria-hidden="true" />
                      {copy.email}
                    </span>
                    <strong>{copy.emailAction}</strong>
                  </a>
                  <a href={linkedInUrl} target="_blank" rel="noreferrer" className={styles.contactCard}>
                    <span>
                      <LinkedInIcon />
                      LinkedIn
                    </span>
                    <strong>{copy.linkedInAction}</strong>
                  </a>
                  <a href={instagramUrl} target="_blank" rel="noreferrer" className={styles.contactCard}>
                    <span>
                      <InstagramIcon />
                      Instagram
                    </span>
                    <strong>{copy.instagramAction}</strong>
                  </a>
                  <a href={websiteUrl} target="_blank" rel="noreferrer" className={styles.contactCard}>
                    <span>
                      <Globe2 aria-hidden="true" />
                      {copy.website}
                    </span>
                    <strong>{copy.websiteAction}</strong>
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className={styles.actionDock}>
            <div className={styles.actions}>
              <a className={styles.primaryAction} href={whatsappUrl}>
                <WhatsAppIcon />
                {copy.cta}
              </a>
              <a
                className={styles.saveButton}
                href={vCardHref}
                download="tan-chi-shiong.vcf"
                aria-label={copy.saveContact}
              >
                <UserPlus aria-hidden="true" />
                <span>{copy.saveContact}</span>
              </a>
            </div>

            <p className={styles.responseNote}>
              <CheckCircle2 aria-hidden="true" />
              {copy.responseNote}
            </p>
          </div>
        </section>
      </article>
    </main>
  )
}
