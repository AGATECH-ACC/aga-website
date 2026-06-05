"use client"

import { useState } from "react"
import { ArrowRight, Loader2, MessageCircle } from "lucide-react"

import { superindividualWhatsAppLink } from "@/lib/superindividual/constants"

type SignupState = "idle" | "submitting" | "success" | "error"

export function SuperindividualSignupForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [state, setState] = useState<SignupState>("idle")
  const [error, setError] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState("submitting")
    setError("")

    try {
      const response = await fetch("/api/superindividual-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      })

      const payload = (await response.json().catch(() => ({}))) as {
        message?: string
        success?: boolean
      }

      if (!response.ok || payload.success === false) {
        throw new Error(payload.message ?? "出了一点问题，请再试一次")
      }

      setState("success")
      setName("")
      setEmail("")
    } catch {
      setState("error")
      setError("出了一点问题，请再试一次")
    }
  }

  if (state === "success") {
    return (
      <div className="mx-auto w-full max-w-3xl rounded-[30px] border border-[#E8521A]/38 bg-[#0F1923] p-7 text-center shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#E8521A] text-3xl shadow-[0_0_0_10px_rgba(232,82,26,0.13)]">
          ✅
        </div>
        <p className="mt-5 text-2xl font-extrabold text-white">
          成功！工具包已发送到你的邮箱
        </p>
        <div className="mx-auto mt-4 max-w-xl space-y-2 text-base leading-7 text-white/72">
          <p>请检查你的邮件（包括垃圾邮件夹）</p>
          <p>点击邮件里的链接进入工具包</p>
        </div>
        <a
          href={superindividualWhatsAppLink}
          className="mx-auto mt-7 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 text-base font-extrabold text-[#0F1923] transition hover:scale-[1.02] hover:bg-[#33e879] md:w-auto"
        >
          <MessageCircle className="size-5" />
          同时加入我们的WhatsApp社群
          <ArrowRight className="size-4" />
        </a>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-[30px] border border-white/14 bg-[#0F1923]/92 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35),0_0_60px_rgba(232,82,26,0.08)] backdrop-blur-xl md:grid-cols-[1fr_1fr_auto]"
      >
        <label className="sr-only" htmlFor="superindividual-name">
          你的名字
        </label>
        <input
          id="superindividual-name"
          required
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="你的名字"
          className="min-h-16 rounded-[20px] border border-white/12 bg-[#1E2A3A] px-5 text-base font-medium text-white outline-none transition placeholder:text-white/38 focus:border-[#E8521A] focus:ring-4 focus:ring-[#E8521A]/18"
        />
        <label className="sr-only" htmlFor="superindividual-email">
          你的Email
        </label>
        <input
          id="superindividual-email"
          required
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="你的Email"
          className="min-h-16 rounded-[20px] border border-white/12 bg-[#1E2A3A] px-5 text-base font-medium text-white outline-none transition placeholder:text-white/38 focus:border-[#E8521A] focus:ring-4 focus:ring-[#E8521A]/18"
        />
        <button
          type="submit"
          disabled={state === "submitting"}
          className="inline-flex min-h-16 items-center justify-center gap-2 rounded-[20px] bg-[#E8521A] px-8 text-base font-extrabold text-white shadow-[0_18px_44px_rgba(232,82,26,0.34)] transition duration-200 hover:scale-[1.025] hover:bg-[#ff6a2a] hover:shadow-[0_22px_56px_rgba(232,82,26,0.46)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {state === "submitting" ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              发送中
            </>
          ) : (
            <>
              立即获取工具包
              <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-white/58">免费。随时可以退订。</p>

      {state === "error" ? (
        <p className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-100">
          {error || "出了一点问题，请再试一次"}
        </p>
      ) : null}
    </div>
  )
}
