# AI Agent Rules

These rules apply to Codex and any AI agent working on the AGA website.

## Required Reading Order

1. Always read `/docs/project.md` first.
2. Always check `/docs/design.md` before UI changes.
3. Check `/docs/pages.md` before creating or editing pages.
4. Check `/docs/content.md` before changing website copy.
5. Check `/docs/components.md` before creating components.

## Component Rules

- Do not create duplicate components.
- Reuse existing shadcn/ui primitives.
- Reuse existing `/components/website` components.
- Create new components only when existing components cannot reasonably support the requirement.
- Update `/docs/components.md` when new reusable components are created.

## Page Rules

- Do not build new pages unless explicitly requested.
- Update `/docs/pages.md` when new pages are added.
- Keep homepage changes scoped to homepage requests.
- Do not modify homepage for documentation-only tasks.

## Content Rules

- Chinese-first copy by default.
- Optional English support is allowed when it helps clarity or bilingual UI.
- Update `/docs/content.md` when copy changes.
- Keep SEO/GEO content aligned with `/docs/seo.md` and `/docs/geo.md`.

## Design Rules

- Orange = brand/action.
- Blue = system/product emphasis.
- No random inline styles.
- No hardcoded colors in product UI.
- Use reusable components only.
- Use `/styles/tokens.ts` for tokens.
- Use `/styles/motion.ts` for motion.

## Verification Rules

- Run `npm run lint` after code or docs structure changes.
- Run `npm run build` after code changes and before completion.
- Report any command that cannot be run.

## Safety Rules

- Do not overwrite existing working files without reason.
- Do not delete existing components unless explicitly requested.
- Do not revert user changes.
- Keep edits scoped to the requested task.
