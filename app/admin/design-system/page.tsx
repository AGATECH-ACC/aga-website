import {
  AlertCircle,
  Check,
  ImageIcon,
  LoaderCircle,
  Search,
  Sparkles,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  CTASection,
  FeatureGrid,
  HeroSection,
  SiteFooter,
  SiteNavbar,
  StatsGrid,
} from "@/components/website"
import { BilingualText } from "@/components/website/shared"
import { cn } from "@/lib/utils"
import { motionClasses } from "@/styles/motion"
import { radius, spacing, websiteClasses } from "@/styles/tokens"

type BilingualCopy = {
  en: string
  zh: string
}

const colorSwatches = [
  { name: "Primary / Brand action", className: "bg-primary" },
  { name: "System / Product emphasis", className: "bg-system" },
  { name: "Foreground / Text", className: "bg-foreground" },
  { name: "Background", className: "bg-background" },
  { name: "Muted", className: "bg-muted" },
  { name: "Destructive", className: "bg-destructive" },
]

const typographyScale = [
  {
    name: "H1",
    className: websiteClasses.h1,
    copy: { en: "Business systems at scale", zh: "规模化业务系统" },
  },
  {
    name: "H2",
    className: websiteClasses.h2,
    copy: { en: "Reusable section title", zh: "可复用区块标题" },
  },
  {
    name: "H3",
    className: websiteClasses.h3,
    copy: { en: "Component title", zh: "组件标题" },
  },
  {
    name: "Body",
    className: websiteClasses.body,
    copy: { en: "Clear body text for product pages.", zh: "用于产品页面的清晰正文。" },
  },
  {
    name: "Caption",
    className: websiteClasses.caption,
    copy: { en: "Supporting label text.", zh: "辅助标签文字。" },
  },
]

const spacingScale = [
  { name: "xs", value: spacing.xs, className: "w-1" },
  { name: "sm", value: spacing.sm, className: "w-2" },
  { name: "md", value: spacing.md, className: "w-4" },
  { name: "lg", value: spacing.lg, className: "w-6" },
  { name: "xl", value: spacing.xl, className: "w-8" },
  { name: "2xl", value: spacing["2xl"], className: "w-12" },
  { name: "3xl", value: spacing["3xl"], className: "w-16" },
]

const radiusScale = [
  { name: "sm", value: radius.sm, className: "rounded-sm" },
  { name: "md", value: radius.md, className: "rounded-md" },
  { name: "lg", value: radius.lg, className: "rounded-lg" },
  { name: "xl", value: radius.xl, className: "rounded-xl" },
  { name: "full", value: radius.full, className: "rounded-full" },
]

function PageSection({
  title,
  note,
  children,
}: {
  title: BilingualCopy
  note: BilingualCopy
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-normal">
          <BilingualText text={title} />
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          {note.en}
          <br />
          {note.zh}
        </p>
      </div>
      {children}
    </section>
  )
}

function PreviewBox({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <Badge className="w-fit" variant="outline">
        {label}
      </Badge>
      <div className="overflow-hidden rounded-2xl border bg-background">
        {children}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No items yet / 暂无项目</CardTitle>
        <CardDescription>
          Add the first item when content is ready.
          <br />
          内容准备好后，可以添加第一个项目。
        </CardDescription>
        <CardAction>
          <Check data-icon="inline-start" />
        </CardAction>
      </CardHeader>
      <CardFooter>
        <Button variant="secondary">Add item / 添加项目</Button>
      </CardFooter>
    </Card>
  )
}

function ErrorState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Unable to load / 无法加载</CardTitle>
        <CardDescription>
          The request failed. Try again or check the source.
          <br />
          请求失败。请重试或检查来源。
        </CardDescription>
        <CardAction>
          <AlertCircle data-icon="inline-start" />
        </CardAction>
      </CardHeader>
      <CardFooter>
        <Button variant="danger">Retry / 重试</Button>
      </CardFooter>
    </Card>
  )
}

export default function DesignSystemPage() {
  return (
    <main
      className={cn(
        "min-h-screen bg-background text-foreground",
        motionClasses.fadeIn
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-8 md:px-8 md:py-12">
        <header className="flex flex-col gap-3">
          <Badge className="w-fit" variant="secondary">
            Component catalog / 组件目录
          </Badge>
          <h1 className="text-4xl font-semibold tracking-normal md:text-5xl">
            AGA Design System Playground
            <span className="block text-muted-foreground">
              AGA 设计系统演示台
            </span>
          </h1>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            Isolated examples for checking reusable components, tokens, and UI
            states. This is not a homepage preview.
            <br />
            用于检查可复用组件、设计令牌与界面状态的独立示例。这里不是首页预览。
          </p>
        </header>

        <Separator />

        <PageSection
          title={{ en: "Design Tokens", zh: "设计令牌" }}
          note={{
            en: "Token samples for color, typography, spacing, and radius.",
            zh: "颜色、排版、间距与圆角的令牌示例。",
          }}
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Color swatches / 色彩样本</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {colorSwatches.map((color) => (
                  <div key={color.name} className="flex items-center gap-3">
                    <div
                      className={cn("size-10 rounded-lg border", color.className)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {color.name}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Typography scale / 排版层级</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                {typographyScale.map((item) => (
                  <div key={item.name} className="grid gap-2">
                    <Badge className="w-fit" variant="outline">
                      {item.name}
                    </Badge>
                    <p className={item.className}>
                      <BilingualText text={item.copy} />
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Spacing scale / 间距体系</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {spacingScale.map((item) => (
                  <div key={item.name} className="grid grid-cols-[4rem_1fr_5rem] items-center gap-3">
                    <Badge variant="outline">{item.name}</Badge>
                    <div className={cn("h-3 rounded-full bg-system", item.className)} />
                    <span className="text-sm text-muted-foreground">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Radius scale / 圆角体系</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {radiusScale.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className={cn("size-12 border bg-muted", item.className)} />
                    <div className="text-sm">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-muted-foreground">{item.value}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </PageSection>

        <PageSection
          title={{ en: "Buttons", zh: "按钮" }}
          note={{
            en: "Action hierarchy uses orange for brand/action and danger for destructive flows.",
            zh: "操作层级使用橙色表示品牌与行动，危险操作使用 danger 样式。",
          }}
        >
          <Card>
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary / 主要</Button>
                <Button variant="secondary">Secondary / 次要</Button>
                <Button variant="ghost">Ghost / 轻量</Button>
                <Button variant="danger">Danger / 危险</Button>
                <Button disabled>Disabled / 禁用</Button>
                <Button disabled variant="primary">
                  <LoaderCircle
                    className="animate-spin"
                    data-icon="inline-start"
                  />
                  Loading / 加载中
                </Button>
              </div>
              <div className="flex flex-col gap-3 rounded-2xl border bg-muted/30 p-4 sm:flex-row sm:items-center">
                <Button size="lg" variant="primary">
                  预约免费演示
                </Button>
                <Button size="lg" variant="secondary">
                  WhatsApp 联系我们
                </Button>
              </div>
            </CardContent>
          </Card>
        </PageSection>

        <PageSection
          title={{ en: "Cards", zh: "卡片" }}
          note={{
            en: "Isolated card patterns for content, statistics, features, and image-led modules.",
            zh: "用于内容、数据、功能与图片模块的独立卡片模式。",
          }}
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic card / 基础卡片</CardTitle>
                <CardDescription>Short supporting description.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  A simple content container for reusable modules.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stat card / 数据卡片</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-semibold tracking-normal text-system">
                  70%
                </div>
                <p className="text-sm text-muted-foreground">
                  Growth average / 平均业务增长
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feature card / 功能卡片</CardTitle>
                <CardAction>
                  <Sparkles data-icon="inline-start" />
                </CardAction>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  Mobile-first system module / 移动优先系统模块
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex min-h-40 items-center justify-center bg-muted">
                <ImageIcon data-icon="inline-start" />
                <span className="ml-2 text-sm text-muted-foreground">
                  Image card / 图片卡片
                </span>
              </CardContent>
            </Card>
          </div>
        </PageSection>

        <PageSection
          title={{ en: "Forms", zh: "表单" }}
          note={{
            en: "Form controls are shown as isolated states and placeholders.",
            zh: "表单控件以独立状态与占位示例展示。",
          }}
        >
          <Card>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Input aria-label="Default input" placeholder="Input / 输入框" />
              <div className="flex items-center gap-2">
                <Search data-icon="inline-start" />
                <Input aria-label="Search input" placeholder="Search / 搜索" />
              </div>
              <select
                aria-label="Select placeholder"
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                defaultValue=""
              >
                <option value="" disabled>
                  Select placeholder / 选择占位
                </option>
              </select>
              <Input
                aria-invalid
                aria-label="Error input"
                placeholder="Error input / 错误输入"
              />
              <Input
                disabled
                aria-label="Disabled input"
                placeholder="Disabled input / 禁用输入"
              />
            </CardContent>
          </Card>
        </PageSection>

        <PageSection
          title={{ en: "Navigation", zh: "导航" }}
          note={{
            en: "Navbar and footer are isolated, not combined into a page composition.",
            zh: "导航栏与页脚独立展示，不组合成完整页面。",
          }}
        >
          <div className="grid gap-6">
            <PreviewBox label="SiteNavbar">
              <SiteNavbar />
            </PreviewBox>
            <PreviewBox label="SiteFooter">
              <SiteFooter />
            </PreviewBox>
          </div>
        </PageSection>

        <PageSection
          title={{ en: "Website Sections", zh: "网站区块" }}
          note={{
            en: "Each section component is boxed separately for review.",
            zh: "每个网站区块组件都放在独立边框预览框中检查。",
          }}
        >
          <div className="grid gap-8">
            <PreviewBox label="HeroSection">
              <HeroSection
                title={{ en: "Systemize operations", zh: "系统化运营" }}
                accent={{ en: "with AI tools", zh: "用 AI 工具" }}
                description={{
                  en: "A reusable hero component with action-first hierarchy.",
                  zh: "一个具有行动优先层级的可复用主视觉组件。",
                }}
              />
            </PreviewBox>
            <PreviewBox label="CTASection">
              <div className="py-6">
                <CTASection />
              </div>
            </PreviewBox>
            <PreviewBox label="FeatureGrid">
              <div className="p-4 md:p-6">
                <FeatureGrid />
              </div>
            </PreviewBox>
            <PreviewBox label="StatsGrid">
              <div className="p-4 md:p-6">
                <StatsGrid />
              </div>
            </PreviewBox>
          </div>
        </PageSection>

        <PageSection
          title={{ en: "States", zh: "状态" }}
          note={{
            en: "Required loading, empty, and error states for data-driven UI.",
            zh: "数据驱动界面必须具备加载、空状态与错误状态。",
          }}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Loading / 加载</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-4/5" />
              </CardContent>
            </Card>
            <EmptyState />
            <ErrorState />
          </div>
        </PageSection>
      </div>
    </main>
  )
}
