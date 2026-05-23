# AGA Design Rules

## Design Intent

AGA should feel like a premium modern technology company: clean, confident, product-led, and mobile-first. The visual direction is Apple/OpenAI inspired, but localized for Malaysia SME owners with Chinese-first communication.

## Color Role Rules

- Orange is brand/action.
- Blue is system/product emphasis.
- Black/near-black is for text and dark footer/hero surfaces.
- White is the default page background.
- Grey is for supporting text, borders, labels, and inactive states.
- Do not hardcode colors in product UI.
- Use semantic Tailwind tokens and values from `/styles/tokens.ts`.
- Use `primary` for orange action and brand emphasis.
- Use `system` for blue product emphasis and selected states.

## Typography Rules

- Chinese-friendly typography is required.
- Do not use negative letter spacing for Chinese text.
- Keep tracking normal for bilingual UI.
- H1 is for page or hero title only.
- H2 is for major section title.
- H3 is for card, module, or subsection title.
- Body copy should be readable and calm.
- Caption text is for metadata, labels, helper text, and eyebrow copy.
- Use `/styles/tokens.ts` and `websiteClasses` before creating new typography rules.

## Button Rules

- Primary button: orange brand/action CTA.
- Secondary button: supporting action.
- Ghost button: navigation or low-emphasis actions.
- Danger button: destructive or error recovery actions.
- Buttons must use `components/ui/button.tsx`.
- Loading and disabled states must be explicit.
- Do not create custom button markup.

## Card Rules

- Use shadcn `Card` primitives before creating new card components.
- Cards should use consistent radius, border, padding, and hierarchy.
- Stat cards use blue product emphasis.
- Feature cards may use icon circles with blue emphasis.
- Image cards should use consistent rounded corners and controlled aspect ratios.
- Do not nest decorative cards inside cards unless the content needs a framed component.

## Image Rules

- Use real product, team, client, event, or business workflow imagery when possible.
- Monochrome business photography may use orange brand overlays.
- Avoid generic stock-like imagery that does not explain the product or audience.
- Hero images must support the core message and not hide text legibility.
- Keep image crops responsive across desktop, tablet, and mobile.
- Store assets according to `/docs/assets.md`.

## Layout Rules

- Use a centered container with responsive padding.
- Keep sections visually separated with generous whitespace.
- Use grid layouts for cards and comparison content.
- Use two-column layouts for service/image or feature/image modules on desktop.
- Collapse to one-column layouts on mobile.
- Avoid random spacing. Use `/styles/tokens.ts`.

## Responsive Rules

- Build mobile-first.
- Tablet layouts should avoid cramped multi-column grids.
- Desktop can use richer grids and wider image panels.
- Text must never overflow or clip.
- Buttons should wrap cleanly on small screens.
- Navigation should remain usable at mobile widths.

## Component Reuse Rules

- Reuse existing shadcn/ui primitives.
- Reuse `/components/website` before creating any new website component.
- No duplicate components.
- No inline styles.
- No hardcoded colors.
- Loading, empty, and error states are required for async/data-driven surfaces.
- Update `/docs/components.md` when new reusable components are created.
