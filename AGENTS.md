<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project Language Policy (MANDATORY)

- **Allowed Languages**: English and Tibetan (Bod-yig / Uchen script) ONLY for all user-facing UI, buttons, titles, subtitles, placeholders, and labels.
- **Prohibited**: Never use Spanish or any other language in public-facing site elements.

## Performance & UX Policy (MANDATORY)

- **Core Premise**: Ultra-modern and ultra-fast (60 FPS on desktop and mobile).
- **Rule**: Never compromise fluidity, responsiveness, or framerate with heavy post-processing (e.g. multi-pass bloom, blur shaders, excessive render passes, or per-frame React state re-renders in WebGL animation loops) unless explicitly confirmed by the user.
