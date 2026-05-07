# Project Overview: Orderly FE

Orderly is a React-based frontend application designed for building forms and managing submissions, likely integrated with AI capabilities via Google's Gemini API. The project is built with a modern stack focusing on developer experience and high-performance UI.

## Main Technologies
- **Frontend Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite 6](https://vitejs.dev/)
- **Language:** [TypeScript 5](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **AI Integration:** [@google/genai](https://www.npmjs.com/package/@google/genai)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **Animations:** [Motion](https://motion.dev/) (formerly Framer Motion)

## Project Architecture
The project follows a standard React SPA structure:
- `src/App.tsx`: The root component managing state-based routing and main layout.
- `src/views/`: Contains top-level page components (e.g., `Dashboard`, `FormBuilder`, `Submissions`).
- `src/components/`: Reusable UI components (e.g., `Sidebar`, `TopBar`).
- `src/lib/`: Utility functions and shared logic (e.g., `utils.ts` for Tailwind class merging).
- `src/main.tsx`: Entry point for the React application.

**Note on Routing:** This project does *not* use a library like `react-router-dom`. Instead, it uses a `currentView` state in `App.tsx` to toggle between different views.

## Building and Running

### Prerequisites
- [Node.js](https://nodejs.org/) (latest LTS recommended)

### Development
Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### Production Build
Create a production-ready build in the `dist/` directory:
```bash
npm run build
```

### Type Checking
Run TypeScript diagnostics:
```bash
npm run lint
```

### Environment Variables
The application requires a Gemini API key. Create a `.env.local` file (or use `.env`) in the root directory:
```env
GEMINI_API_KEY=your_api_key_here
```

## Development Conventions

### Styling
- **Tailwind CSS:** Use Tailwind utility classes for all styling.
- **Class Merging:** Use the `cn` utility from `src/lib/utils.ts` for conditional or dynamic class merging:
  ```tsx
  import { cn } from '@/lib/utils';
  // ...
  <div className={cn("base-class", isActive && "active-class")}>
  ```

### Components
- **Functional Components:** Always use functional components with hooks.
- **Lucide Icons:** Use `lucide-react` for consistent iconography.
- **Motion:** Use `motion` for adding interactive animations and transitions.

### AI Integration
- Access the Gemini API key via `process.env.GEMINI_API_KEY` (configured in `vite.config.ts`).
- Ensure proper error handling and loading states when interacting with AI services.

## Important Files
- `package.json`: Project dependencies and scripts.
- `vite.config.ts`: Vite and Tailwind configuration.
- `src/App.tsx`: Central hub for navigation and layout.
- `src/lib/utils.ts`: Core utility for Tailwind integration.
