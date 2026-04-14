# DevOps CI/CD challenge (repo layout)

Minimal **React + Vite** app: a **team taskboard** (add tasks, mark done, filter All/Active/Completed, persist in `localStorage`).

## Branches

| Branch | Purpose |
|--------|--------|
| **`main`** | **Correct baseline** — `.github/workflows/ci.yml` installs Node 20, caches npm, then runs `npm ci` → `npm run build` → `npm run lint`. CI should pass on GitHub. |
| **Your challenge branch** (e.g. `challenge/broken-ci`) | **Intentionally buggy** — put the broken workflow here (e.g. run `npm` before `actions/setup-node`) and point candidates at this branch. |

Maintainers: create a branch from `main`, then replace `.github/workflows/ci.yml` with the contents of [`docs/challenge-broken-workflow.yml`](docs/challenge-broken-workflow.yml) (broken step order). Candidates fix the workflow and open a PR or push to their fork.

---

## Local run

```bash
npm ci
npm run dev
```

Build and lint (same as CI):

```bash
npm ci
npm run build
npm run lint
```

---

## Stack (template notes)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
