# FridgeChef AI

Turn a free-form list of ingredients into a complete, interactive recipe — powered by Groq's `llama-3.3-70b-versatile`, rendered entirely as structured React UI (never as raw AI text).

## Project Overview

FridgeChef AI is **not a chatbot**. The user types whatever they have on hand ("eggs, milk, cheese, bread, tomatoes"), the backend asks an LLM for a strict JSON recipe object, validates it with Zod, and the frontend renders it as an interactive recipe: a checkable ingredient list, a step-by-step checklist with progress tracking, servings scaling, ingredient swap suggestions, and one-click copy/save.

Every response from the model is treated as untrusted input. If the AI returns malformed JSON, the wrong shape, or nothing at all, the user sees a clear "AI returned an invalid recipe" state with a Retry button — never a crash, never raw text.

## Features

- **Structured AI output, not chat** — the model is instructed to return only JSON matching a fixed schema; the frontend never renders raw model text.
- **Interactive recipe UI** — checklists for ingredients and steps, an animated progress bar, a reset button, and live-scaling quantities when servings change.
- **Ingredient swaps** — AI-suggested substitutions (e.g. Butter → Olive Oil) rendered as their own card.
- **Copy & Save** — copy a plain-text version of the (currently scaled) recipe to the clipboard, or save it to `localStorage` and reload it later without another API call.
- **Robust error handling** — malformed JSON, schema mismatches, network failures, timeouts, rate limits, and empty responses are all caught, mapped to a friendly message, and recoverable via Retry.
- **Race-condition safe** — clicking "Generate" multiple times cancels the previous in-flight request (`AbortController`) and ignores any response that isn't from the latest request (request-id guard), so a slow stale response can never overwrite a newer one.
- **Skeleton loading states** — no spinners; content-shaped shimmering placeholders instead.
- **Polished empty state** — before the first generation, a friendly illustration and copy instead of a blank page.
- **Dark mode** — toggled from the navbar, persisted across visits, tuned for both themes (not just an inverted filter).
- **Toast notifications** — for save/copy/remove actions.
- **Mobile-first responsive design** — verified at 320px, 375px, 768px, 1024px, and 1440px; cards stack vertically and controls go full-width on small screens.
- **Keyboard-friendly** — ⌘/Ctrl+Enter submits the form, autofocus on the textarea, visible focus rings throughout.

## Architecture

```
Browser (React 19 + Vite)
   │  axios POST /api/recipe/generate { ingredients }
   ▼
Express server
   │  1. Validate request body (Zod)
   │  2. Build prompt, call Groq chat completions (axios)
   │  3. Parse + validate the model's JSON (Zod) — never trust the AI
   │  4. Respond with { recipe } or a typed { error, message }
   ▼
Groq API (llama-3.3-70b-versatile, with automatic fallback models)
```

Key design decisions:

- **Zod validation on both sides of the AI call.** The inbound `ingredients` string is validated before it's ever sent to Groq (`server/validation/requestSchema.js`), and the model's raw text response is validated against a strict recipe schema (`server/validation/recipeSchema.js`) before it's ever sent to the client. Numbers are coerced (`z.coerce.number()`) because LLMs frequently return `"2"` instead of `2`.
- **Model fallback chain.** `server/services/groqService.js` tries `llama-3.3-70b-versatile` first and only falls back to the next candidate model if that specific model is unavailable (404/model-not-found) — never as a way to paper over a bad *response*, which is a validation concern, not a model-availability concern.
- **One place maps error codes → HTTP status → user message.** `server/controllers/recipeController.js` centralizes this mapping so the client always gets a predictable `{ error, message }` shape regardless of what went wrong upstream.
- **The frontend never touches raw AI text.** `client/src/services/api.js` only ever returns the parsed `recipe` object the server already validated; every field the UI renders came through Zod.
- **Stale-response protection lives in a hook, not a component.** `client/src/hooks/useRecipeGenerator.js` combines `AbortController` (cancels the actual HTTP request) with a monotonically increasing request-id ref (belt-and-suspenders in case an abort doesn't land before the promise resolves) so double-clicking Generate can't cause a UI flicker between two recipes.
- **Servings scaling is a pure function, not derived state.** `client/src/utils/quantity.js` scales each ingredient's quantity from the recipe's base servings to the currently selected servings on every render — no separate "scaled ingredients" state to keep in sync.

## Folder Structure

```
client/
  src/
    components/       Reusable UI pieces (Navbar, IngredientForm, EmptyState, Toast, recipe/*)
    pages/             HomePage.jsx — composes the whole flow
    hooks/             useRecipeGenerator, useSavedRecipes, useDarkMode, useToast
    services/          api.js (axios), savedRecipes.js (localStorage)
    utils/             quantity.js (scaling/formatting), clipboard.js (copy formatting)
server/
  routes/              recipeRoutes.js
  controllers/         recipeController.js — HTTP layer + error-code mapping
  validation/          requestSchema.js, recipeSchema.js (Zod)
  prompts/             recipePrompt.js — system/user prompt builders
  services/            groqService.js — Groq HTTP call + model fallback
package.json           Root convenience scripts (npm install && npm start runs both apps)
README.md
```

## How to Run

Requires Node.js 18+.

**Quick start (one command, from the repo root):**

```bash
cd server && cp .env.example .env && cd ..   # fill in GROQ_API_KEY in server/.env
cd client && cp .env.example .env && cd ..   # defaults already point at localhost:5050
npm install     # installs root tooling, then server + client automatically
npm start       # runs both the API and the dev server together
```

This starts the backend on http://localhost:5050 and the frontend on http://localhost:5173 in one terminal (via `concurrently`). Open http://localhost:5173.

**Manual / two-terminal version**, if you'd rather run each independently:

```bash
# 1. Backend
cd server
cp .env.example .env      # then fill in GROQ_API_KEY
npm install
npm run dev                # http://localhost:5050

# 2. Frontend (in a second terminal)
cd client
cp .env.example .env       # defaults already point at localhost:5050
npm install
npm run dev                # http://localhost:5173
```

## Environment Variables

**server/.env**

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Your Groq API key ([console.groq.com/keys](https://console.groq.com/keys)). Required. |
| `PORT` | Port for the Express server. Defaults to `5050`. |
| `CLIENT_ORIGIN` | Comma-separated allowed CORS origin(s). Defaults to `http://localhost:5173`. |

**client/.env**

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API. Defaults to `http://localhost:5050/api`. |

The Groq API key is never sent to or exposed in the browser — only the Express server talks to Groq.

## AI Usage in the App

- **Model:** `llama-3.3-70b-versatile`, with automatic fallback to `llama-3.1-70b-versatile` then `llama-3.1-8b-instant` if the primary model is unavailable on the account.
- **Prompt strategy:** a strict system prompt (`server/prompts/recipePrompt.js`) instructs the model to respond with *only* raw JSON matching an exact schema — no markdown, no code fences, no commentary — plus `response_format: { type: "json_object" }` on the Groq request as a second guardrail.
- **Trust boundary:** the model's output is treated as untrusted user input from the server's perspective. It is parsed and validated with Zod (`server/validation/recipeSchema.js`) before ever leaving the server. If validation fails, the client receives a typed error, not partial or malformed data.

## AI-Assisted Development (Building This Project)

Being upfront, as requested: I used **Claude Code** (Anthropic's agentic CLI) as a pair-programming tool for most of the implementation, in an iterative, conversational workflow rather than one generated dump:

- The client/server split, backend (Express + Groq + Zod), and frontend (React + Tailwind) were built incrementally against the assignment's requirements, one layer at a time.
- Every major piece was verified end-to-end afterward — real Groq API calls, both light/dark themes, and mobile viewports from 320px to 1440px — using scripted browser testing (Playwright), not just reading the code.
- That testing caught a real bug: a Tailwind dark-mode class (`accent-950`) referenced a color shade that didn't exist in the config, so it silently failed to apply — invisible in code review, only visible once dark mode was actually screenshotted. Fixed by using an existing shade instead.
- Polish features (the live ingredient-chip preview, step-completion celebration, card hover states) were added after the core requirements were solid, not before.
- I had Claude Code generate a file-by-file study guide from the finished code, which I used to prepare to explain and extend this codebase live — the trust-boundary design around AI output and the stale-response guard in `useRecipeGenerator.js` in particular.

I reviewed and can walk through every file in this repo; nothing here was shipped without understanding what it does.

## Time Spent

Approximately 4-5 hours: architecture and prompt/schema design, backend implementation, frontend component build-out, styling/polish pass, and end-to-end verification (including a live Groq key) in both light and dark mode across desktop and mobile viewports.

## Known Limitations

- No user accounts — saved recipes are per-browser (`localStorage`), not synced across devices.
- No image generation for recipes; visuals are icon-based rather than photographic.
- Ingredient quantity scaling assumes linear scaling, which isn't always culinarily accurate (e.g. spice/salt quantities don't always scale linearly in real cooking).
- Rate limiting is a simple in-memory `express-rate-limit` window; it resets on server restart and isn't shared across multiple server instances.
- No automated test suite (unit/e2e) — verification was done via manual + scripted browser testing during development.

## Future Improvements

- Add a lightweight test suite (Vitest for utils/hooks, supertest for the API, Playwright for the golden path).
- Persist saved recipes to a real backend/database so they sync across devices.
- Let users regenerate just one section (e.g. "swap this ingredient" or "give me different steps") instead of the whole recipe.
- Cache identical ingredient-list requests server-side to reduce Groq calls and improve latency.
- Add dietary-preference/allergy filters that get woven into the prompt.
