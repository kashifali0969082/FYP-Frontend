# AdaptiveLearnAI-Frontend

React-based frontend for AdaptiveLearnAI Study Mode. It provides a high-fidelity PDF study experience (canvas rendering with selectable text), a ToolPanel with AI-powered helpers (flashcards, quizzes, diagrams, games), and a responsive diagram renderer that fits content without clipping.

## Tech stack

- React 19, Create React App 5 (react-scripts)
- Tailwind CSS 3
- react-pdf 10 (PDF.js under the hood)
- mermaid 11 for diagrams
- react-router-dom 7
- Axios for API calls

## Quick start

Prerequisites:
- Node.js 18+ and npm

Install and run:
- npm install
- npm start

Open http://localhost:3000

Build:
- npm run build

## Features

- PDF viewer
	- Canvas-based rendering preserves document styling/colors
	- Hidden, selectable text layer for precise text selection without visual changes
	- No internal scrolling; navigate with Prev/Next buttons and page input
	- Default zoom 80% (locked for stable text/canvas alignment)
	- Persists last page position via API

- ToolPanel chat
	- Send selected text to tools: Ask LLM, Flashcards, Quiz, Diagrams, Games
	- Opens overlay renderers for generated content

- Diagram renderer
	- Auto-fit to container with Fit, Fit width, and 100% modes
	- Scroll and zoom support (no clipping; arrowheads preserved via padded viewBox)
	- Responsive via ResizeObserver

## Routing

Defined in `src/App.js`:
- / — Landing
- /dashboard — Testing/Dashboard screen
- /StudyMode — PDF study mode page
- /form — Learning profile form
- Fallback 404 route

## Authentication

- JWT is stored in a cookie named `access_token` (see `src/utils/auth.js`)
- A token can also be bootstrapped from a `?token=` URL parameter; it will be copied into the cookie
- API calls use a shared Axios client with `withCredentials: true` and base URL https://api.adaptivelearnai.xyz/ (see `src/Components/apiclient/Apis.js`)

## PDF worker configuration

react-pdf requires a PDF.js worker. This app sets it at runtime in `src/App.js`:

- pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

This CDN URL matches the installed pdfjs version at runtime, avoiding bundler import issues.

If you need an offline worker, download `pdf.worker.min.js` from the matching `pdfjs-dist` version into `public/` and set:

- pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'


## Scripts

- npm start — start dev server
- npm test — run tests (CRA default)
- npm run build — production build to `build/`
- npm run eject — CRA eject (irreversible)
