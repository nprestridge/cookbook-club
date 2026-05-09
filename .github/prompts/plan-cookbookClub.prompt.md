# Plan: Migrate cookbook-club from CRA to Vite + Modernize React

## Discovery Results

**Current State:**

- React 18.2.0 (good, modern)
- Create React App with react-scripts 5.0.1
- Node 22.0.0 requirement
- Mixed components: 2 class components (CookbookList), rest functional
- React Router v6 (already modern)
- Jest testing with minimal coverage (no React Testing Library)
- CircleCI pipeline with npm-based build
- Strong ESLint + Stylelint configuration
- SCSS compilation via separate Sass package

**User Decisions:**
✓ Build tool: **Vite** (faster dev, smaller bundles, modern standard)
✓ Components: **Full modernization** (class → functional + hooks)
✓ Testing: **Add React Testing Library**
✓ Strategy: **Big bang migration** (single effort, not gradual)

---

## Plan: Migrate cookbook-club from CRA to Vite + Modernize React

**TL;DR:** Replace Create React App with Vite for faster builds, convert remaining class components to functional components with hooks, upgrade testing to React Testing Library, and update CircleCI pipeline accordingly. This modernizes the dev experience and aligns with current React best practices. Estimated implementation: 1 day of focused work.

---

## Phase 1: Vite Setup & Configuration (Independent, runs first)

1. Install Vite and required dependencies
   - Remove: `react-scripts`, `create-react-app`
   - Add: `vite`, `@vitejs/plugin-react`, `vite-plugin-html`, and build tools

2. Create `vite.config.js` at project root
   - Enable React plugin
   - Configure dev server port (match current CRA behavior, typically 3000)
   - Configure build output to `build/` directory
   - Add HMR configuration for development
   - Reference: Vite docs for React + config options for public assets

3. Create `index.html` at project root
   - Move from `public/index.html` → root level (Vite requirement)
   - Update script tag to `<script type="module" src="/src/index.js"></script>`
   - Keep build output HTML at `build/index.html` for deployment

4. Update `package.json`
   - Replace CRA scripts with Vite: `start` → `vite`, `build` → `vite build`
   - Keep existing `test`, `lint-js`, `lint-css` scripts since they use existing tools
   - Remove `BROWSER=none` and other CRA-specific env var handling
   - Update Node version requirement (keep 22.0.0)

5. Verify entry point: src/index.js
   - Confirm `createRoot()` pattern already in place
   - No changes needed if already using React 18 API

---

## Phase 2: Component Modernization (Depends on Phase 1 config done, can start in parallel with Phase 2b)

6. Convert `src/view/CookbookList.jsx` from class to functional
   - Replace `React.Component` and `componentDidMount` with `useEffect` hook
   - Replace `this.state` / `this.setState` with `useState`
   - Extract callback logic if any

7. Check for other class components (quick scan)
   - If any others exist besides CookbookList, convert them too

8. Update all components to use modern React patterns
   - Use const/arrow functions consistently
   - Ensure all hooks rules followed (no hooks in conditions/loops)
   - Verify prop-types usage (keep as-is for runtime validation, or migrate to TypeScript in future)

---

## Phase 2b: Testing Infrastructure (Parallel with Phase 2)

9. Install React Testing Library and update test config
   - Add: `@testing-library/react`, `@testing-library/jest-dom`, `vitest` (Vite's test runner)
   - Remove/update: direct `jest` configuration if exists

10. Create `vitest.config.js` (or extend vite.config.js)
    - Set environment to `jsdom`
    - Configure test globs to find `**/*.test.jsx` files
    - Add React Testing Library setup file

11. Create `src/test/setup.ts` or update test setup
    - Import `@testing-library/jest-dom` for matchers
    - Configure any test utilities globally

12. Update `src/tests/App.test.jsx`
    - Migrate from default Jest/react-scripts patterns to React Testing Library patterns
    - Example: Replace direct `render()` calls with RTL's render utilities
    - Add more meaningful assertions using RTL queries (getByRole, getByLabelText, etc.)
    - Ensure tests still pass with new test runner

13. Update test script in package.json
    - `test:unit`: `vitest` (for local runs)
    - `test:unit:ci`: `vitest --run` (for CI - non-watch mode)

---

## Phase 3: CircleCI Pipeline Updates (Depends on all prior phases)

14. Update `.circleci/config.yml`
    - Update build job npm scripts:
      - Build: `npm run build` (already uses Vite build command in package.json)
      - Tests: `npm run test:unit:ci` (new non-watch vitest command)
    - Add cache busting for node_modules if needed (npm cache invalidate on package-lock.json changes)
    - Verify Node version 22.0.0 still appropriate (update if newer LTS available)

15. Verify CI workflow
    - Test locally: `npm install` → `npm run build` → `npm run test:unit:ci`
    - Ensure artifacts still generate correctly in `/tmp/circleci-artifacts`
    - Deploy job (S3) remains unchanged, uses `build/` directory output

---

## Phase 4: Cleanup & Validation (Depends on all prior phases)

16. Remove legacy files and dependencies
    - Delete `src/react-app-env.d.ts` if exists (CRA TypeScript artifact)
    - Update `.gitignore` if CRA-specific entries exist (e.g., remove `.env.local` patterns if unused)
    - Verify no CRA-specific config files remain (public folder structure remains same for static assets)

17. Update README or documentation
    - Update dev server start instructions: `npm start` still works
    - Document new Vite build process if team needs it
    - Note: SCSS compilation now handled by Vite (via Sass plugin if needed)

18. Test edge cases
    - Verify static assets (images) in `public/` load correctly
    - Verify SCSS compilation works correctly with Vite (may need vite-plugin-sass)
    - Check environment variable handling if used (Vite uses `import.meta.env` instead of `process.env`)

---

## Relevant Files

**Files to Create:**

- `vite.config.js` — Vite configuration with React plugin, build paths
- `vitest.config.js` — Test runner configuration (can be in vite.config.js)
- `src/test/setup.ts` — Test environment setup for React Testing Library
- `index.html` — Move from `public/` to root, add module script

**Files to Modify:**

- `package.json` — Replace CRA scripts, update dev dependencies
- `src/view/CookbookList.jsx` — Convert to functional component with hooks
- `src/tests/App.test.jsx` — Update to React Testing Library patterns
- `.circleci/config.yml` — Update test command to `npm run test:unit:ci`

**Files to Keep (No Changes):**

- `src/App.jsx` — Already modern (hooks, Router v6)
- `src/index.js` — Already uses `createRoot()`
- ESLint/Stylelint configs — Compatible with Vite
- Public assets — Same structure maintained

---

## Verification

1. **Local Development**
   - Run `npm install` → no errors
   - Run `npm start` → app loads on http://localhost:5173 (Vite default) or configured port
   - Hot Module Replacement (HMR) works: edit a component, page updates without refresh

2. **Build & Test Locally**
   - Run `npm run build` → build succeeds, output in `build/` directory
   - Run `npm run test:unit:ci` → all tests pass (CookbookList converted + App test passes)
   - Run `npm run test:lint-js` and `npm run test:lint-css` → linting passes

3. **CircleCI CI/CD**
   - Push to feature branch (non-deploy-eligible)
   - Verify CircleCI job: install → build → test all pass
   - Push to `deploy` branch
   - Verify both build and deploy jobs succeed
   - Verify S3 deployment contains correct files from `build/`

4. **Functional Testing**
   - Manual browser test: Navigate app, verify UI renders correctly
   - Verify API calls still work (CookbookStore remains unchanged)
   - Verify routing works (React Router v6 already present)
   - Check console for warnings (should be cleaner under Vite)

5. **Performance Check**
   - Compare dev server startup time (Vite should be significantly faster)
   - Compare build time (Vite typically faster than CRA)

---

## Decisions & Scope

**Included:**

- ✓ Full migration from Create React App to Vite
- ✓ Convert class components to functional + hooks
- ✓ Upgrade to React Testing Library
- ✓ Update CircleCI to work with new build system
- ✓ Modern JavaScript (ES modules via Vite)
- ✓ Maintain SCSS compilation support
- ✓ Preserve existing ESLint/Stylelint configuration

**Excluded (Future opportunities):**

- TypeScript migration (out of scope, can be done post-migration)
- Additional test coverage expansion (just infrastructure upgrade)
- Code splitting/lazy loading optimization (basic Vite defaults sufficient)
- Environment variable migration to `import.meta.env` (CRA's `process.env` still works in most cases, can be gradual)
- Package manager upgrade (keep npm, though pnpm/yarn compatible)

**Critical Assumptions:**

- No eject from CRA was done → no custom webpack config to port
- Static assets in `public/` don't depend on CRA-specific handling
- No CRA-specific plugins or .env files with complex logic
- App is SPA (single-page) → Vite's default SPA template sufficient (not Next.js needed)

---

## Further Considerations

1. **SCSS Plugin for Vite** — Vite has built-in Sass support, but verify no custom Sass config is needed
   - Current setup uses `npm-run-all` to watch SCSS separately; Vite's build will handle this automatically
   - May need lighter verification that styles load identically

2. **Environment Variables** — If `.env` files are in use with CRA's `REACT_APP_` prefix
   - Vite uses `VITE_` prefix instead; update any env var references if any exist
   - Check Config.js to see if any env vars are used

3. **Public Assets & Build Artifacts** — Verify the deployment to S3 still works
   - S3 bucket path is `cookbook-club-site/` and expects `build/` directory contents
   - Vite's build output structure should match (but verify manually)
