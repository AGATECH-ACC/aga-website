# Reusable Components

All components live in `/components/website` and should be reused before creating new website components.

## SiteNavbar

- Purpose: Global site navigation with logo, nav links, language/search controls, and primary CTA.
- Props suggestion: `logoLabel`, `navItems`, `cta`, `variant`.
- Where used: Home, About, Services, Solutions, Case Studies, Insights, Contact.
- States: Transparent over hero, solid on white/dark pages, responsive mobile state in future.
- Notes: Orange logo/action, no duplicate nav components.

## HeroSection

- Purpose: Page hero with headline, accent phrase, description, and CTA group.
- Props suggestion: `title`, `accent`, `description`, `primaryAction`, `secondaryAction`.
- Where used: Home and major landing pages.
- States: Dark image/graphic background, optional secondary CTA.
- Notes: Hero copy should be Chinese-first. Do not use negative tracking for Chinese.

## LogoStrip

- Purpose: Trust strip showing client or partner logos.
- Props suggestion: `label`, `logos`.
- Where used: Home, Case Studies, event/service pages.
- States: Monochrome logos, compact mobile wrap.
- Notes: Use optimized client logo assets from `/public/assets/clients`.

## SectionHeader

- Purpose: Standard section heading pattern with eyebrow, title, accent, and description.
- Props suggestion: `eyebrow`, `title`, `accent`, `description`, `align`.
- Where used: All content sections.
- States: Left aligned, centered.
- Notes: Blue accent for system/product emphasis.

## StatsGrid

- Purpose: Display key business metrics.
- Props suggestion: `stats`.
- Where used: Home, Case Studies, Services.
- States: Three-column desktop, one-column mobile.
- Notes: Use blue for metric numbers.

## ServiceModuleTabs

- Purpose: Show reusable service modules with an active service state and visual panel.
- Props suggestion: `modules`.
- Where used: Home, Services.
- States: Active first module, stacked mobile layout.
- Notes: Future enhancement may add client-side tab state.

## IndustrySolutionCards

- Purpose: Show industry-specific solution cards.
- Props suggestion: `industries`.
- Where used: Home, Solutions.
- States: Active/selected blue card, inactive image/card state.
- Notes: Keep card count responsive and avoid cramped mobile rows.

## ProcessTimeline

- Purpose: Explain AGA's consultation-to-support process.
- Props suggestion: `steps`.
- Where used: Home, Services, About.
- States: Horizontal desktop timeline, stacked mobile steps.
- Notes: Numbered steps should stay concise.

## FeatureGrid

- Purpose: Show reasons to choose AGA with icon cards and supporting visual panel.
- Props suggestion: `features`.
- Where used: Home, Services, About.
- States: Two-column desktop, single-column mobile.
- Notes: Use consistent icon style and blue icon emphasis.

## CTASection

- Purpose: Conversion section with headline, supporting copy, and CTA.
- Props suggestion: `title`, `description`, `action`.
- Where used: All primary pages near footer.
- States: Blue CTA band with white button.
- Notes: Primary action copy should align with `/docs/project.md`.

## SiteFooter

- Purpose: Global footer with logo, search/contact module, nav links, social links, and company info.
- Props suggestion: `navItems`.
- Where used: All public website pages.
- States: Dark footer, compact mobile stack.
- Notes: Keep footer contact details synced with `/docs/content.md`.
