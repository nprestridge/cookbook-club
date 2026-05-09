# Cookbook Club

React site to showcase cookbooks and recipes by the KoP Cookbook Club.

## Local Setup

1. `git checkout main`
2. `npm install`
3. `npm run start`

## Development

### Available Scripts

#### Development

- `npm run start` - Start the development server with hot module replacement
- `npm run start:vite` - Start Vite dev server only (without CSS watching)

#### Building

- `npm run build` - Build for production (compiles SCSS + JS)
- `npm run build:js` - Build JavaScript only with Vite
- `npm run build:css` - Compile SCSS to CSS

#### Testing

- `npm run test` - Run all tests (unit + linting)
- `npm run test:unit` - Run unit tests in watch mode (Vitest)
- `npm run test:unit:ci` - Run unit tests once (for CI)
- `npm run test:lint-js` - Lint JavaScript/JSX files
- `npm run test:lint-css` - Lint SCSS files

### Development Workflow

1. **Start development**: `npm run start`
   - Launches Vite dev server (typically on http://localhost:3000)
   - Automatically watches and compiles SCSS changes
   - Hot module replacement for instant updates

2. **Run tests**: `npm run test:unit`
   - Uses Vitest with React Testing Library
   - Runs in watch mode for continuous testing

3. **Lint code**: `npm run test:lint-js` and `npm run test:lint-css`
   - ESLint for JavaScript/JSX (Airbnb config)
   - Stylelint for SCSS

4. **Build for production**: `npm run build`
   - Outputs optimized bundles to `build/` directory
   - Ready for deployment

### Environment Variables

- Use `VITE_` prefix for client-side environment variables (Vite convention)
- Example: `VITE_API_ENV=local` in `.env` file
- Access in code: `import.meta.env.VITE_API_ENV`

### Project Structure

```
src/
├── components/          # React components (functional with hooks)
├── controller/          # API and data management
├── styles/             # SCSS stylesheets
├── tests/              # Test files
├── util/               # Utility functions
├── view/               # Page/view components
├── App.jsx             # Main app component
├── index.jsx           # Entry point (ES modules)
└── Config.js           # Environment configuration
```

### Technologies

- **React 18** with functional components and hooks
- **Vite** for fast development and building
- **Vitest** + **React Testing Library** for testing
- **React Router v6** for routing
- **Sass/SCSS** for styling
- **ESLint** + **Stylelint** for code quality
- **CircleCI** for continuous integration
