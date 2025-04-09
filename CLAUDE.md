# CLAUDE.md - TaxHacker Development Guide

## Common Commands
- `npm run dev` - Start dev server on port 7331 with turbopack
- `npm run build` - Build for production (runs prisma generate first)
- `npm run start` - Start production server (runs migrations and seed)
- `npm run lint` - Run Next.js linter
- `npx prettier --write .` - Format code with Prettier

## Database
- `npx prisma migrate dev` - Create and apply migrations in development
- `npx prisma studio` - Open Prisma database UI
- `npm run seed` - Run database seed script

## Code Style Guidelines
- Use TypeScript for all files
- 2 space indentation, double quotes, no semicolons
- 120 character line width
- Import order: React, external libs, internal modules
- Component files: PascalCase, other files: kebab-case
- Use React functional components with explicit return types
- Handle errors with try/catch blocks; propagate error objects
- For async operations, return {success, data, error} pattern

## React & Next.js
- Use Next.js App Router and Server Components where appropriate
- Separate data fetching from UI components
- Use shadcn/ui components with consistent styling