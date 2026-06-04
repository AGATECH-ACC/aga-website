"use client"

import { useState } from "react"
import { ArrowRight, Loader2 } from "lucide-react"

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
        error?: string
      }

      if (!response.ok) {
        throw new Error(payload.error ?? "提交失败，请稍后再试。")
      }

      setState("success")
      setName("")
      setEmail("")
    } catch (submitError) {
      setState("error")
      setError(
        submitError instanceof Error
          ? submitError.message
          : "提交失败，请稍后再试。"
      )
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <form
        onSubmit={handleSubmit}
        className="grid gap-3 rounded-[28px] border border-white/12 bg-white/[0.06] p-3 shadow-2xl shadow-black/20 backdrop-blur md:grid-cols-[1fr_1fr_auto]"
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
          className="min-h-14 rounded-2xl border border-white/10 bg-[#071421] px-4 text-base text-white outline-none transition placeholder:text-white/38 focus:border-[#f59a23] focus:ring-2 focus:ring-[#f59a23]/25"
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
          className="min-h-14 rounded-2xl border border-white/10 bg-[#071421] px-4 text-base text-white outline-none transition placeholder:text-white/38 focus:border-[#f59a23] focus:ring-2 focus:ring-[#f59a23]/25"
        />
        <button
          type="submit"
          disabled={state === "submitting"}
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#f59a23] px-6 text-base font-bold text-[#071421] transition hover:-translate-y-0.5 hover:bg-[#ffb24a] disabled:cursor-not-allowed disabled:opacity-70"
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
      <p className="mt-3 text-center text-sm text-white/52">免费。随时可以退订。</p>

      {state === "error" ? (
        <p className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-100">
          {error}
        </p>
      ) : null}

      {state === "success" ? (
        <div className="mt-6 rounded-[28px] border border-[#f59a23]/30 bg-[#f59a23]/10 p-5 text-center">
          <p className="text-lg font-semibold text-white">
            工具包已发送到你的邮箱！记得加入我们的WhatsApp社群 👇
          </p>
          <div className="mx-auto mt-5 grid size-44 place-items-center rounded-2xl border border-white/16 bg-white text-center text-xs font-semibold leading-5 text-[#071421]">
            WhatsApp
            <br />
            QR Code
            <br />
            Placeholder
          </div>
          <p className="mt-3 text-sm font-semibold text-[#f7c36d]">
            扫码加入「超级个体实验室」
          </p>
        </div>
      ) : null}
    </div>
  )
}
