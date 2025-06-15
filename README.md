# Integrated Establisment Regulatory

# 🔥 My Vite React App with Tailwind, Sonner & Django Backend

This is a modern frontend built with **Vite + React + TypeScript**, using **Tailwind CSS**, **React Hook Form**, **Zod** for validation, and **Sonner** for toast notifications. It connects to a **Django** REST backend.

---

## 📁 Folder Structure

- `public/`: Static assets like `favicon`, etc.
- `src/`
  - `assets/`: Images, icons, and media.
  - `components/`: Reusable presentational components.
  - `features/`: Logic grouped by features (auth, profile, activity log, etc.).
  - `hooks/`: Custom React hooks.
  - `lib/`: Utilities (e.g., API service).
  - `pages/`: Route-level pages (`/login`, `/profile`, etc.).
  - `routes/`: App routing configuration.
  - `context/`: Context providers (e.g., auth context).
  - `styles/`: Optional custom styles.
- `index.html`: Main HTML template.
- `vite.config.ts`: Vite configuration.
- `tailwind.config.ts`: Tailwind settings.

---

## ⚙️ Setup Instructions

### 1. Clone the project

````bash
git clone https://github.com/yourusername/my-project.git
cd my-project


# 📁 Vite Project Folder Structure with Details
```bash

my-project/
├── public/                       # Static files (favicon, robots.txt, etc.)
│
├── src/                          # Main source code
│   ├── assets/                   # Static assets (images, logos, etc.)
│   ├── components/               # Reusable UI components
│   │   ├── ui/                   # Shadcn UI or custom Tailwind UI components
│   ├── features/                 # Feature-based folders (e.g., auth, profile, dashboard)
│   │   ├── auth/                 # Login/Register logic
│   │   │   ├── LoginForm.tsx
│   │   │   └── authService.ts
│   │   ├── profile/              # Profile edit, avatar upload, etc.
│   │   │   ├── ProfilePage.tsx
│   │   │   └── profileService.ts
│   │   └── activity/             # Activity logs feature
│
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utility functions (e.g. API, form utils)
│   │   └── api.ts                # axios/fetch config
│   ├── pages/                    # Page components (route-level)
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   └── Profile.tsx
│   ├── routes/                   # React Router DOM routing config
│   ├── context/                  # React context providers (auth, theme, etc.)
│   ├── styles/                   # Global styles (if needed)
│   ├── App.tsx                   # App root component
│   └── main.tsx                  # Vite entry point
│
├── .env                          # Environment variables
├── index.html                    # HTML template
├── tailwind.config.ts            # Tailwind config
├── postcss.config.js             # PostCSS config
├── tsconfig.json                 # TypeScript config
├── vite.config.ts                # Vite config
└── README.md                     # Project info and instructions

````
