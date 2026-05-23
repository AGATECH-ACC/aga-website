# Asset Management

## Asset Folders

- `/public/assets/brand`
- `/public/assets/website`
- `/public/assets/team`
- `/public/assets/clients`
- `/public/assets/icons`

## Logo

- Store master logo files in `/public/assets/brand`.
- Keep SVG for vector logo where possible.
- Provide orange logo, white logo, and monochrome logo variants.
- Naming: `aga-logo-orange.svg`, `aga-logo-white.svg`, `aga-logo-mark.svg`.

## Brand Icons

- Store reusable brand marks and decorative symbols in `/public/assets/icons`.
- Prefer SVG for icons.
- Icons should follow the same stroke/fill style.
- Do not mix unrelated icon libraries in the same surface.

## Hero Images

- Store in `/public/assets/website/hero`.
- Use real business workflow imagery where possible.
- Keep dark-overlay-safe versions for hero sections.
- Naming: `hero-business-system-desktop.webp`, `hero-business-system-mobile.webp`.

## Team Photos

- Store in `/public/assets/team`.
- Use consistent crop, lighting, and background treatment.
- Naming: `team-{name-role}.webp`.

## Client Logos

- Store in `/public/assets/clients`.
- Use SVG or transparent PNG.
- Include white and dark variants when needed.
- Naming: `client-{company-name}-logo.svg`.

## Case Study Images

- Store in `/public/assets/website/case-studies`.
- Use descriptive names by client and topic.
- Naming: `case-{client}-{topic}.webp`.

## Image Naming Rules

- Use lowercase.
- Use hyphens, not spaces.
- Include page/section context.
- Include breakpoint if image differs by viewport: `desktop`, `tablet`, `mobile`.

## File Format Rules

- SVG for logos and icons.
- WebP for most website photography.
- PNG only when transparency is required and SVG is not suitable.
- JPG only for source/reference assets, not final optimized website assets.

## Compression Rules

- Compress all large images before shipping.
- Keep hero images visually sharp but optimized.
- Use responsive image sizes for desktop and mobile.
- Avoid uploading raw Figma exports directly into production.
- Prefer final assets under 300 KB when practical; hero images may be larger if visually necessary.
