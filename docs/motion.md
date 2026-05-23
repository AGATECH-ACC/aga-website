# Motion Rules

## Motion Purpose

Motion should make the website feel premium, calm, and responsive. It should guide attention, confirm interaction, and support hierarchy without distracting users.

## Source of Truth

Use `/styles/motion.ts` as the source of truth.

Approved presets:

- `fadeIn`
- `fadeUp`
- `scaleIn`
- `slideLeft`
- `motionClasses.fadeIn`
- `motionClasses.fadeUp`
- `motionClasses.scaleIn`
- `motionClasses.slideLeft`

## Approved Animation Use

- Fade in page sections.
- Fade up cards and section content.
- Scale in small cards or badges.
- Slide left for panels, drawers, or carousel content.
- Subtle button hover states.
- Subtle card hover elevation or border emphasis.

## Forbidden Animation Behavior

- No bouncing UI.
- No excessive parallax.
- No infinite attention-seeking motion.
- No motion that delays primary content.
- No animation that causes layout shift.
- No large text movement on mobile.
- No autoplay motion that distracts from reading.

## Page Transition Rules

- Keep page transitions subtle.
- Use fade or fade-up only.
- Do not animate full-page movement across the viewport.
- Respect reduced-motion preferences when implementing motion libraries.

## Button Hover Rules

- Buttons may change background, border, or text color.
- Primary buttons may slightly brighten/darken.
- Avoid scaling buttons more than a subtle transform.
- Disabled buttons must not animate.

## Card Hover Rules

- Cards may use slight border, shadow, or background changes.
- Image cards may reveal overlay text or CTA.
- Do not move cards enough to shift surrounding layout.
- Card hover must work without hiding content on touch devices.
