"use client"

import {
  ArrowUpRight,
  LoaderCircle,
  SendHorizontal,
} from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { WhatsAppIcon } from "@/components/icons/BrandIcons"
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
}

const copy = {
  en: {
    greeting:
      "Hey 👋 I'm GULICHAN's AI.\n\nYou probably just tapped his NFC card.\n\nI can tell you what he does, what AGA builds, or help you figure out whether there's something worth discussing with him.",
    suggestions: [
      "What does GULICHAN do?",
      "What is AGA OneSystem?",
      "How can AGA help my business?",
      "What kind of systems do you build?",
      "I have a business problem",
    ],
    suggestionsLabel: "Suggested questions",
    inputPlaceholder: "Ask about GULICHAN or tell me about your business...",
    send: "Send message",
    typing: "GULICHAN AI is thinking",
    error: "GULICHAN AI is taking a short break 😄. Please try again in a moment.",
    conversationLimit:
      "You've officially interviewed my AI enough 😄\n\nIf what GULICHAN does sounds relevant, the best next step is probably to talk to the real human.",
    talkToCstan: "Talk to GULICHAN",
    assistantLabel: "GULICHAN AI",
    youLabel: "You",
  },
  zh: {
    greeting:
      "嗨 👋 我是 GULICHAN 的 AI。\n\n你大概刚刚轻触了他的 NFC 名片。\n\n我可以告诉你他在做什么、AGA 在打造什么，或帮你判断现在的问题是否值得和他进一步聊聊。",
    suggestions: [
      "GULICHAN 是做什么的？",
      "什么是 AGA OneSystem？",
      "AGA 如何帮助我的企业？",
      "你们会打造什么系统？",
      "我有一个企业问题",
    ],
    suggestionsLabel: "推荐问题",
    inputPlaceholder: "询问 GULICHAN，或告诉我你的企业遇到什么问题……",
    send: "发送消息",
    typing: "GULICHAN AI 正在思考",
    error: "GULICHAN AI 正在休息一下 😄。请稍后再试。",
    conversationLimit:
      "你已经把我的 AI 访问得很完整了 😄\n\n如果 GULICHAN 的工作和你有关，下一步最好直接和真人聊聊。",
    talkToCstan: "联系 GULICHAN",
    assistantLabel: "GULICHAN AI",
    youLabel: "你",
  },
} as const

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function CstanAiChat({ locale }: { locale: Locale }) {
  const text = copy[locale]
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "cstan-ai-greeting", role: "assistant", content: text.greeting },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const endRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  const userMessageCount = useMemo(
    () => messages.filter((message) => message.role === "user").length,
    [messages],
  )
  const showLateContactCTA = userMessageCount >= 6
  const showConversationLimit = userMessageCount >= 7
  const whatsappHref = profile.whatsappUrl
    ? `${profile.whatsappUrl}?text=${encodeURIComponent(
        locale === "zh"
          ? "你好 GULICHAN，我刚刚体验了你的 NFC AI 名片，想进一步聊聊。"
          : "Hi GULICHAN, I just used your NFC AI card and would like to continue the conversation.",
      )}`
    : ""

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [isLoading, messages, showLateContactCTA])

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
      } catch {
        setMessages((current) => [
          ...current,
          { id: createMessageId(), role: "assistant", content: text.error },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, locale, messages, text.error],
  )

  return (
    <div className="mx-auto flex min-h-full w-full max-w-xl flex-col pb-5 pt-4">
      <div className="space-y-3" aria-live="polite" aria-label="GULICHAN AI conversation">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`flex items-end gap-2.5 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <span className="relative size-8 shrink-0 overflow-hidden rounded-full border border-white/80 bg-[#9d5c3a] shadow-sm">
                <Image
                  src="/assets/tan-chi-shiong-profile.png"
                  alt=""
                  fill
                  sizes="32px"
                  className="object-cover"
                />
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
            <span className="relative size-8 shrink-0 overflow-hidden rounded-full border border-white/80 bg-[#9d5c3a] shadow-sm">
              <Image
                src="/assets/tan-chi-shiong-profile.png"
                alt=""
                fill
                sizes="32px"
                className="object-cover"
              />
              <span className="sr-only">{text.assistantLabel}</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-[18px] rounded-bl-md bg-[#f7f5f2] px-4 py-3 text-[11px] font-semibold">
              <LoaderCircle className="size-4 animate-spin text-[#f55d2d]" aria-hidden="true" />
              {text.typing}
            </span>
          </div>
        )}
      </div>

      {userMessageCount === 0 && (
        <div className="mt-5 flex flex-wrap gap-2" aria-label={text.suggestionsLabel}>
          {text.suggestions.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => sendMessage(question, "suggestion")}
              className="inline-flex min-h-9 max-w-full items-center justify-center gap-2 rounded-xl border border-[#e6dfd7] bg-[#fbfaf8] px-3 py-2 text-left text-[10px] font-bold leading-snug text-[#514b45] shadow-sm transition hover:-translate-y-0.5 hover:border-[#f55d2d]/45 hover:bg-white hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f55d2d]"
            >
              <span>{question}</span>
              <ArrowUpRight className="size-3.5 shrink-0 text-[#f55d2d]" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      {showConversationLimit && (
        <div className="mt-5 whitespace-pre-wrap rounded-[20px] border border-[#f55d2d]/20 bg-[#fff2ed] p-4 text-[11px] font-semibold leading-relaxed text-[#654638]">
          {text.conversationLimit}
        </div>
      )}

      {showLateContactCTA && whatsappHref && (
        <a
          href={whatsappHref}
          onClick={() => trackCstanEvent("whatsapp_clicked", { location: "ai_chat", locale })}
          className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#1d1c1a] px-4 text-[12px] font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f55d2d]"
        >
          <WhatsAppIcon className="size-4" />
          {text.talkToCstan}
        </a>
      )}

      <form
        className="sticky bottom-0 z-10 -mx-1 mt-auto bg-gradient-to-t from-white via-white to-white/0 px-1 pb-1 pt-6"
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
