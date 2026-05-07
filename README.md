<div align="center">
  <img width="1200" alt="Formly Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  <h1>🚀 Formly - Digital Order Form & Dashboard</h1>

  <p><strong>A modern, high-performance system for building digital order forms, managing submissions, and automating notifications.</strong></p>

  <p>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react" alt="React 19" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite" alt="Vite 6" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS 4" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript 5" /></a>
    <a href="https://laravel.com/"><img src="https://img.shields.io/badge/Laravel-11-FF2D20?style=flat-square&logo=laravel" alt="Laravel 11" /></a>
  </p>
</div>

---

## 📖 Overview

**Formly** is a comprehensive solution designed to simplify the order collection process. It features a React-based frontend application for building dynamic forms and an intuitive admin dashboard for managing incoming submissions. Integrated with **Google's Gemini API**, WhatsApp, and Google Sheets, Formly brings automation and intelligence to your workflow.

## ✨ Key Features

- 📝 **Dynamic Form Builder**: Create custom forms with drag-and-drop ease.
- 📊 **Admin Dashboard**: Manage and track submissions efficiently.
- 🤖 **AI Integration**: Powered by Google Gemini for smart form capabilities.
- 📱 **WhatsApp Automations**: Send instant notifications to customers and admins (Mode A: Redirect, Mode B: Business API).
- 📈 **Google Sheets Sync**: Automatically export and sync submissions.
- 🎨 **Modern UI/UX**: Built with Tailwind CSS 4, Motion animations, and Lucide icons for a premium experience.

## 🛠️ Tech Stack

### Frontend
- **Framework:** [React 19](https://react.dev/) (SPA)
- **Build Tool:** [Vite 6](https://vitejs.dev/)
- **Language:** [TypeScript 5](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations:** [Motion](https://motion.dev/)
- **AI Integration:** `@google/genai`

### Backend Architecture
- **Framework:** Laravel 11 (PHP 8.3)
- **Database:** PostgreSQL 16 (with Eloquent ORM)
- **Queue & Cache:** Redis 7 + Laravel Horizon
- **Authentication:** Laravel Sanctum

## 🚀 Getting Started (Frontend)

Follow these steps to run the frontend application locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (latest LTS recommended)
- A Gemini API Key

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/TaufiqHA/formly-fe.git
   cd formly-fe
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## 📚 Documentation

For an in-depth look at the system architecture, database schema, and API structure, please refer to our dedicated documentation files:

- 🏗️ **[Technical Design Document (TDD)](TDD_FormulirOrderDigital.md)**: Details the system architecture, database schema, and design decisions.
- 🔌 **[API Reference](API_REFERENCE.md)**: Comprehensive guide to the REST API endpoints, request/response structures, and error codes.
- 🤖 **[AI Guidelines](GEMINI.md)**: Rules and guidelines for the Gemini AI integration and UI conventions.

## 📄 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Creates a production-ready build in the `dist/` directory.
- `npm run lint`: Runs TypeScript diagnostics.

---
<div align="center">
  <p>Built with ❤️ for better digital ordering.</p>
</div>
