import type { SVGProps } from "react"

type BrandIconProps = SVGProps<SVGSVGElement>

export function WhatsAppIcon(props: BrandIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.9"
      {...props}
    >
      <path d="M5.3 18.7 6.2 15A7.2 7.2 0 1 1 9 17.7z" />
      <path d="M9.1 8.9c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.3 0 .5-.2.7l-.3.4c-.1.1-.2.3-.1.5.4.8 1.1 1.5 2 2 .2.1.3 0 .5-.1l.5-.6c.2-.2.4-.3.7-.2l1.6.7c.3.1.4.3.4.6 0 .7-.4 1.5-1.1 1.7-.8.3-2.5 0-4.2-1.1-1.8-1.1-3.1-2.9-3.5-4.4-.2-.8.1-1.4.3-1.7z" />
    </svg>
  )
}

export function LinkedInIcon(props: BrandIconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.8 8.9H3.6v10.2h3.2zM5.2 4a1.8 1.8 0 1 0 0 3.6A1.8 1.8 0 0 0 5.2 4m5.4 4.9H7.5v10.2h3.1v-5c0-1.3.2-2.6 1.9-2.6s1.7 1.5 1.7 2.7v4.9h3.1v-5.6c0-2.8-.6-4.9-3.8-4.9-1.5 0-2.5.8-2.9 1.6z" />
    </svg>
  )
}

export function InstagramIcon(props: BrandIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.9"
      {...props}
    >
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.2" />
      <circle cx="16.8" cy="7.2" r=".7" fill="currentColor" stroke="none" />
    </svg>
  )
}
