import type { NavGroup } from "@/components/website/SiteNavbar"
import type { Dictionary } from "@/lib/i18n/dictionary"

type ServiceNavItem = {
  name: string
  tagline?: string
  description?: string
  href: string
}

type IndustryNavItem = {
  title: string
  description?: string
  href: string
}

export function buildLocalizedNavGroups({
  dictionary,
  services,
  industries,
}: {
  dictionary: Dictionary
  services?: readonly ServiceNavItem[]
  industries?: readonly IndustryNavItem[]
}): NavGroup[] {
  return dictionary.nav.groups.map((group) => {
    const baseGroup: NavGroup = {
      label: group.label,
      href: "href" in group ? group.href : undefined,
      children: "children" in group
        ? group.children.map((child) => ({
            label: child.label,
            description: "description" in child ? child.description : undefined,
            href: child.href,
          }))
        : undefined,
    }

    if (baseGroup.href?.endsWith("/services") && services?.length) {
      return {
        ...baseGroup,
        children: services.map((service) => ({
          label: service.name,
          description: service.tagline || service.description,
          href: service.href,
        })),
      }
    }

    if (baseGroup.href?.endsWith("/solutions") && industries?.length) {
      return {
        ...baseGroup,
        children: industries.map((industry) => ({
          label: industry.title,
          description: industry.description,
          href: industry.href,
        })),
      }
    }

    return baseGroup
  })
}
