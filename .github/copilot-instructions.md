# Copilot Instructions - Cookbook Club

## Build, Test & Lint Commands

### Development
```bash
npm run start              # Start dev server + watch SCSS (http://localhost:3000)
```

### Testing
```bash
npm run test              # Run all tests: unit + lint
npm run test:unit         # Vitest watch mode (default)
npm run test:unit:ci      # Vitest single run (for CI/pre-commit)
npm run test:lint-js      # ESLint JS/JSX files (src/**/*.{js,jsx})
npm run test:lint-css     # Stylelint SCSS files
```

### Building
```bash
npm run build             # Full production build (SCSS + JS → build/)
npm run build:js          # Vite JS build only
npm run build:css         # Sass compile SCSS to CSS
npm run watch:css         # Watch SCSS changes without build server
```

**Single Test Run:** `npm run test:unit:ci -- src/tests/App.test.jsx`

## Architecture

### State Management
- **CookbookStore** (`src/controller/CookbookStore.js`): Simple synchronous store for cookbook data
- No external state library; uses React hooks + callback patterns
- Store exposes: `setCookbooks(books)`, `getCookbookBySlug(slug)`

### API Layer
- **Api** (`src/controller/Api.js`): Centralized fetch abstraction
- All endpoints use callbacks (`cb`) for results (not promises)
- Endpoints: `getCookbooks()`, `getCookbookRecipes()`, `getRecipes()`, `updateCookbook()`, `deleteCookbook()`
- Configured via `Config.js` (reads `api.endpoint` and `api.key`)
- Uses `Url.format()` utility to encode author/title in URL paths

### Routing
- **React Router v6** with nested routes under `<Layout />`
- Routes:
  - `/` → CookbookList
  - `/recipes` → Recipes (all)
  - `/recipes/:slug` → CookbookRecipes (by cookbook)
- Dynamic routes trigger API calls via `useEffect` and set loading state

### File Structure
```
src/
├── controller/          # API (Api.js) and store logic (CookbookStore.js)
├── view/               # Page/route components (not generic components)
├── components/         # Reusable UI components (if present)
├── styles/             # SCSS files (compiled to CSS in src/)
├── util/               # Utility functions (e.g., Url.js for encoding)
├── test/               # Test setup (setup.js)
├── tests/              # Test files (*.test.jsx)
├── App.jsx             # Router and main routes
├── index.jsx           # React DOM render entry point
└── Config.js           # Environment config loader
```

## Key Conventions

### React & Components
- **Functional components with hooks only** — no class components
- React auto-import enabled (react/react-in-jsx-scope: off)
- JSX files can use `.js` or `.jsx` extensions (ESLint allows both)
- Props are not validated with PropTypes in this codebase (dependency exists but unused)

### API & Data Flow
- **Callback pattern over promises** — Api methods take callbacks: `Api.getCookbooks(cb)` where `cb` receives the data
- Responses flow: fetch → checkStatus → parseJSON → callback
- All API calls are unidirectional: fetch data, then `CookbookStore.set*()` to store it

### CSS & Styling
- **Sass (SCSS) → CSS compilation** during dev and build
- Stylelint checks SCSS files (standard-scss config + stylelint-order)
- CSS builds happen in parallel during dev via `npm-run-all -p`
- Import paths use `src:src` (compile all .scss files in src/ to CSS in same dir)

### Environment
- **VITE_ prefix required** for client-side environment variables
- Access via `import.meta.env.VITE_*` (Vite convention, not process.env)
- Example: `VITE_API_ENV=local` in `.env` file

### Testing

#### Unit Tests (Vitest + React Testing Library)
- **Vitest + React Testing Library** with jsdom environment
- Global test functions enabled (describe, it, expect, beforeEach, etc.)
- Setup file: `src/test/setup.js` (imports testing-library/jest-dom)
- Test files co-located or in `src/tests/` directory
- Vitest excludes `tests/e2e/` directory to prevent E2E test interference

**Unit Test Patterns:**
```javascript
// Mocking API calls
vi.mock('../controller/Api', () => ({
  default: {
    getCookbooks: vi.fn(),
    getCookbookRecipes: vi.fn(),
  }
}));

beforeEach(() => {
  vi.clearAllMocks();
});

// Testing async components with promises (not done callbacks)
test('loads data', async () => {
  Api.getCookbooks.mockImplementation((cb) => {
    cb([{ id: 1, title: 'Test' }]);
  });
  render(<CookbookList />);
  await new Promise((resolve) => {
    setTimeout(() => resolve(), 100);
  });
  expect(screen.getByText('Test')).toBeInTheDocument();
});

// Component testing with BrowserRouter
render(
  <BrowserRouter>
    <Component />
  </BrowserRouter>
);
```

**Mocking Strategy:**
- Mock Api.js and CookbookStore for component tests
- Use `vi.mock()` (not jest.mock) for module mocking
- Clear mocks in beforeEach to prevent test pollution
- Mock fetch for controller tests directly

#### E2E Tests (Playwright)
- **Playwright** for end-to-end testing
- Run with: `npm run test:e2e`
- UI mode: `npm run test:e2e:ui`
- Debug mode: `npm run test:e2e:debug`
- Config: `playwright.config.js` (auto-starts dev server)
- Tests in `tests/e2e/*.spec.js`

**E2E Test Patterns:**
```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature', () => {
  test('user flow', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Expected Title/);
    const link = page.locator('a:has-text("Text")');
    await link.click();
    await expect(page).toHaveURL('/expected-url');
  });
});
```

### Code Quality
- **ESLint**: Airbnb config with React plugin, custom rules:
  - JSX allowed in `.js` files
  - Test files + setup.js exempt from extraneous dependencies rule
  - Always-multiline comma-dangle
- Output build path: `build/` (Vite default, with hashed asset names)

### Callbacks & Async
- Legacy callback pattern used throughout (not async/await)
- Loading state managed with `useState` to track in-flight requests
- No promise chaining in components; use `useEffect` for side effects

## Environment Setup

- **Node.js**: >=22.0.0 (see package.json engines)
- **CircleCI**: CI pipeline configured (.circleci/)
- Dependency bot enabled with automated breaking change checks
- Known issue: Sass @import deprecation (migrate to @use when upgrading)
