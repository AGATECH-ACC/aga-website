"use client"

import {
  ArrowUpRight,
  Bot,
  Globe2,
  LoaderCircle,
  Mail,
  SendHorizontal,
  UserRound,
  UserPlus,
} from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { LinkedInIcon, WhatsAppIcon } from "@/components/icons/BrandIcons"
import type { Locale } from "@/lib/i18n/dictionary"
import { profile } from "@/src/config/profile"
import { trackCstanEvent } from "@/src/lib/analytics"

type ChatMessage = {
  id: string
  role: "assistant" | "user"
  content: string
}

type ChatResponse = {
  message?: string
  showContactCTA?: boolean
}

const copy = {
  en: {
    greeting:
      "Hey 👋 I'm CSTAN's AI.\n\nYou probably just tapped his NFC card.\n\nI can tell you what he does, what AGA builds, or help you figure out whether there's something worth discussing with him.",
    suggestions: [
      "What does CSTAN do?",
      "What is AGA OneSystem?",
      "How can AGA help my business?",
      "What kind of systems do you build?",
      "I have a business problem",
    ],
    inputPlaceholder: "Ask about CSTAN or tell me about your business...",
    send: "Send message",
    typing: "CSTAN AI is thinking",
    error: "CSTAN AI is taking a short break 😄. You can still contact CSTAN directly below.",
    conversationLimit:
      "You've officially interviewed my AI enough 😄\n\nIf what CSTAN does sounds relevant, the best next step is probably to talk to the real human.",
    talkTitle: "Let's talk",
    talkBody:
      "If something here sounds relevant, the fastest way is probably just to talk to CSTAN.",
    talkToCstan: "Talk to CSTAN",
    whatsapp: "WhatsApp CSTAN",
    website: "Visit AGA Ventures",
    linkedin: "LinkedIn",
    email: "Email",
    save: "Save Contact",
    assistantLabel: "CSTAN AI",
    youLabel: "You",
  },
  zh: {
    greeting:
      "嗨 👋 我是 CSTAN 的 AI。\n\n你大概刚刚轻触了他的 NFC 名片。\n\n我可以告诉你他在做什么、AGA 在打造什么，或帮你判断现在的问题是否值得和他进一步聊聊。",
    suggestions: [
      "CSTAN 是做什么的？",
      "什么是 AGA OneSystem？",
      "AGA 如何帮助我的企业？",
      "你们会打造什么系统？",
      "我有一个企业问题",
    ],
    inputPlaceholder: "询问 CSTAN，或告诉我你的企业遇到什么问题……",
    send: "发送消息",
    typing: "CSTAN AI 正在思考",
    error: "CSTAN AI 正在休息一下 😄。你仍然可以在下方直接联系 CSTAN。",
    conversationLimit:
      "你已经把我的 AI 访问得很完整了 😄\n\n如果 CSTAN 的工作和你有关，下一步最好直接和真人聊聊。",
    talkTitle: "我们聊聊",
    talkBody: "如果这里有任何内容与你相关，最快的方式就是直接和 CSTAN 谈一谈。",
    talkToCstan: "联系 CSTAN",
    whatsapp: "WhatsApp CSTAN",
    website: "访问 AGA Ventures",
    linkedin: "LinkedIn",
    email: "电邮",
    save: "保存联系人",
    assistantLabel: "CSTAN AI",
    youLabel: "你",
  },
} as const

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function CstanAiChat({
  locale,
  onOpenContact,
}: {
  locale: Locale
  onOpenContact: () => void
}) {
  const text = copy[locale]
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "cstan-ai-greeting", role: "assistant", content: text.greeting },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showContactCTA, setShowContactCTA] = useState(false)
  const endRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  const userMessageCount = useMemo(
    () => messages.filter((message) => message.role === "user").length,
    [messages],
  )
  const showConversationLimit = userMessageCount >= 7
  const whatsappHref = profile.whatsappUrl
    ? `${profile.whatsappUrl}?text=${encodeURIComponent(
        locale === "zh"
          ? "你好 CSTAN，我刚刚体验了你的 NFC AI 名片，想进一步聊聊。"
          : "Hi CSTAN, I just used your NFC AI card and would like to continue the conversation.",
      )}`
    : ""

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [isLoading, messages, showContactCTA])

  const sendMessage = useCallback(
    async (rawMessage: string, source: "input" | "suggestion" = "input") => {
      const message = rawMessage.trim()
      if (!message || isLoading || message.length > 500) return

      if (source === "suggestion") {
        trackCstanEvent("suggested_question_clicked", { question: message, locale })
      }
      trackCstanEvent("message_sent", { locale, source })

      const userMessage: ChatMessage = {
        id: createMessageId(),
        role: "user",
        content: message,
      }
      const requestHistory = messages.slice(-10).map(({ role, content }) => ({ role, content }))

      setMessages((current) => [...current, userMessage])
      setInput("")
      setIsLoading(true)

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, history: requestHistory }),
        })
        const payload = (await response.json().catch(() => ({}))) as ChatResponse
        const assistantMessage = payload.message?.trim() || text.error

        setMessages((current) => [
          ...current,
          { id: createMessageId(), role: "assistant", content: assistantMessage },
        ])
        setShowContactCTA(
          (current) => current || Boolean(payload.showContactCTA) || userMessageCount + 1 >= 7,
        )
      } catch {
        setMessages((current) => [
          ...current,
          { id: createMessageId(), role: "assistant", content: text.error },
        ])
        setShowContactCTA(true)
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, locale, messages, text.error, userMessageCount],
  )

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col pb-5 pt-4">
      <div className="space-y-3" aria-live="polite" aria-label="CSTAN AI conversation">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`flex items-end gap-2.5 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#1d1c1a] text-white shadow-sm">
                <Bot className="size-4" aria-hidden="true" />
                <span className="sr-only">{text.assistantLabel}</span>
              </span>
            )}
            <div
              className={`max-w-[84%] whitespace-pre-wrap rounded-[18px] px-4 py-3 text-[12px] font-medium leading-relaxed shadow-sm ${
                message.role === "user"
                  ? "rounded-br-md bg-[#f55d2d] text-white"
                  : "rounded-bl-md border border-black/5 bg-[#f7f5f2] text-[#3f3a35]"
              }`}
            >
              {message.content}
            </div>
            {message.role === "user" && <span className="sr-only">{text.youLabel}</span>}
          </article>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2.5 text-[#726b63]" role="status">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#1d1c1a] text-white">
              <Bot className="size-4" aria-hidden="true" />
            </span>
            <span className="inline-flex items-center gap-2 rounded-[18px] rounded-bl-md bg-[#f7f5f2] px-4 py-3 text-[11px] font-semibold">
              <LoaderCircle className="size-4 animate-spin text-[#f55d2d]" aria-hidden="true" />
              {text.typing}
            </span>
          </div>
        )}
      </div>

      {userMessageCount === 0 && (
        <div className="mt-5 grid gap-2" aria-label="Suggested questions">
          {text.suggestions.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => sendMessage(question, "suggestion")}
              className="flex min-h-11 items-center justify-between gap-3 rounded-2xl border border-[#e6dfd7] bg-white px-4 py-2.5 text-left text-[11px] font-bold text-[#514b45] shadow-sm transition hover:-translate-y-0.5 hover:border-[#f55d2d]/45 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f55d2d]"
            >
              <span>{question}</span>
              <ArrowUpRight className="size-4 shrink-0 text-[#f55d2d]" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      {showConversationLimit && (
        <div className="mt-5 whitespace-pre-wrap rounded-[20px] border border-[#f55d2d]/20 bg-[#fff2ed] p-4 text-[11px] font-semibold leading-relaxed text-[#654638]">
          {text.conversationLimit}
        </div>
      )}

      <section
        className={`mt-6 rounded-[22px] border p-4 transition ${
          showContactCTA || showConversationLimit
            ? "border-[#f55d2d]/35 bg-[#fff7f3] shadow-[0_12px_28px_rgba(245,93,45,0.12)]"
            : "border-[#e8e1d9] bg-white"
        }`}
        aria-labelledby="cstan-ai-contact-title"
      >
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#fff0e9] text-[#d9471d]">
            <UserRound className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h3 id="cstan-ai-contact-title" className="text-[15px] font-black tracking-[-0.025em]">
              {text.talkTitle}
            </h3>
            <p className="mt-1 text-[10px] font-medium leading-relaxed text-[#716960]">
              {text.talkBody}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenContact}
          className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#1d1c1a] px-4 text-[12px] font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f55d2d]"
        >
          <UserRound className="size-4" aria-hidden="true" />
          {text.talkToCstan}
        </button>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {profile.whatsappUrl && (
            <a
              href={whatsappHref}
              onClick={() => trackCstanEvent("whatsapp_clicked", { location: "ai_chat", locale })}
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#25d366]/35 bg-white px-3 text-[10px] font-extrabold text-[#178c46]"
            >
              <WhatsAppIcon className="size-4" />
              {text.whatsapp}
            </a>
          )}
          {profile.websiteUrl && (
            <a
              href={profile.websiteUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackCstanEvent("website_clicked", { location: "ai_chat", locale })}
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#ded8d1] bg-white px-3 text-[10px] font-extrabold text-[#514b45]"
            >
              <Globe2 className="size-4" aria-hidden="true" />
              {text.website}
            </a>
          )}
          {profile.linkedinUrl && (
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#ded8d1] bg-white px-3 text-[10px] font-extrabold text-[#514b45]"
            >
              <LinkedInIcon className="size-4 text-[#0a66c2]" />
              {text.linkedin}
            </a>
          )}
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#ded8d1] bg-white px-3 text-[10px] font-extrabold text-[#514b45]"
            >
              <Mail className="size-4" aria-hidden="true" />
              {text.email}
            </a>
          )}
          <a
            href="/api/contact"
            download="cstan.vcf"
            onClick={() => trackCstanEvent("save_contact_clicked", { location: "ai_chat", locale })}
            className="col-span-2 flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#f55d2d]/35 bg-white px-3 text-[10px] font-extrabold text-[#d9471d]"
          >
            <UserPlus className="size-4" aria-hidden="true" />
            {text.save}
          </a>
        </div>
      </section>

      <form
        className="sticky bottom-0 z-10 -mx-1 mt-5 bg-gradient-to-t from-white via-white to-white/0 px-1 pb-1 pt-5"
        onSubmit={(event) => {
          event.preventDefault()
          void sendMessage(input)
        }}
      >
        <div className="flex items-end gap-2 rounded-[20px] border border-[#ded8d1] bg-white p-2 shadow-[0_10px_28px_rgba(42,34,26,0.12)] focus-within:border-[#f55d2d]/60 focus-within:ring-2 focus-within:ring-[#f55d2d]/10">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value.slice(0, 500))}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
                void sendMessage(input)
              }
            }}
            rows={1}
            maxLength={500}
            aria-label={text.inputPlaceholder}
            placeholder={text.inputPlaceholder}
            className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-[11px] font-medium leading-relaxed text-[#332f2b] outline-none placeholder:text-[#9b948c]"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label={text.send}
            className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-[#f55d2d] text-white shadow-md transition hover:bg-[#d9471d] disabled:cursor-not-allowed disabled:opacity-35"
          >
            {isLoading ? (
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <SendHorizontal className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
        {input.length >= 400 && (
          <p className="mt-1 text-right text-[9px] font-semibold text-[#8f877f]">
            {input.length}/500
          </p>
        )}
      </form>

      <div ref={endRef} aria-hidden="true" />
    </div>
  )
}
