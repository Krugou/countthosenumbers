# Agent Instructions

## Project Overview
`countthosenumbers` is a React-based number counting game. It uses Vite, TypeScript, and Tailwind CSS.
The project is a monorepo with workspaces:
- `desktop`: Tauri/React app
- `mobile`: React Native (Expo) app (currently less active)
- `shared`: Shared logic/types

## Linting
To check for code quality issues:
```bash
npm run lint
```
To automatically fix fixable issues:
```bash
npm run lint -- --fix
```

## Testing
This project uses Playwright for End-to-End (E2E) testing.

### Running Tests
To run all Playwright tests:
```bash
npx playwright test
```
To run a specific test file:
```bash
npx playwright test tests/app.spec.ts
```
To show the test report:
```bash
npx playwright show-report
```

### Writing Tests
- Create test files in `tests/` directory with `.spec.ts` extension.
- Use `test` and `expect` from `@playwright/test`.
- Ensure the dev server is running (Playwright config handles this usually, or run `npm run dev` beforehand).

## Auto-Sync
A workflow is set up to automatically commit and push changes.
Run the auto-sync script:
```bash
./scripts/auto-sync.sh
```
(Ensure the script is executable: `chmod +x scripts/auto-sync.sh`)
