# HOPE, Inc. — Product Management System

A secure, role-aware web application for managing products and price history, built as a capstone project for the **BS Information Technology** program at **New Era University — College of Computer Studies** (Information Management 2, A.Y. 2025–2026).

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Available Scripts](#available-scripts)
- [User Roles & Access Control](#user-roles--access-control)
- [Git Workflow](#git-workflow)
- [Deployment](#deployment)
- [Team](#team)
- [License](#license)

## Overview

The HOPE Product Management System allows authorized users to manage products and track price history from the HopeDB database. All access is dynamically gated by a Rights Management schema with three user tiers: **SUPERADMIN**, **ADMIN**, and **USER**. The application enforces soft-delete semantics — no records are ever permanently removed.

The project was developed across **3 sprints** (2 weeks each, 6 weeks total).

## Features

- **Authentication** — Email/password registration and login with email confirmation, plus Google OAuth 2.0 sign-in
- **Role-Based Access Control** — Dynamic rights enforcement via `user_module` and `UserModule_Rights` tables, enforced at both the UI and database (RLS) level
- **Product Management** — Add, edit, and soft-delete products with full audit trail
- **Price History Tracking** — Record and view product price changes over time
- **Reports** — Product report listing and top-selling product reports (role-gated)
- **User Management** — Admin panel for managing user accounts and roles
- **Deleted Items Recovery** — ADMIN/SUPERADMIN can view and reactivate soft-deleted records
- **Audit Stamps** — Stamp columns (created/modified metadata) visible only to ADMIN and SUPERADMIN
- **Responsive Design** — Mobile and desktop breakpoints throughout

### Key Rules

- No hard deletes — all removals set `record_status = 'INACTIVE'`
- INACTIVE records are invisible to USER accounts
- Only ADMIN and SUPERADMIN can view and recover soft-deleted records
- ADMIN cannot alter the rights or `user_type` of a SUPERADMIN account

## Tech Stack

| Layer            | Technology                      | Purpose                                         |
| ---------------- | ------------------------------- | ----------------------------------------------- |
| Frontend         | React 18 + Vite                 | Single-page app, component-based UI             |
| Styling          | Tailwind CSS                    | Utility-first responsive design                 |
| Backend / DB     | Supabase (PostgreSQL)           | Database, Auth, RLS Policies, Triggers          |
| Auth             | Supabase Auth (Email + Google)  | Email/password sign-up, Google OAuth 2.0        |
| State Management | React Context API               | Global auth session and user-rights map         |
| Routing          | React Router v6                 | Client-side routing with protected routes       |
| Testing          | Vitest + React Testing Library  | Unit and integration tests                      |
| Deployment       | Vercel                          | Hosted production URL                           |

## Project Structure

```
HOPE---Product-Management-System/
├── database/                  # SQL migration scripts
│   ├── 01_hopedb_schema.sql       # Core database schema
│   ├── 02_rights_management.sql   # Rights & module tables
│   ├── 03_triggers_and_functions.sql
│   ├── 05_sprint2_rls_additions.sql
│   ├── 07_sprint3_additions.sql
│   ├── Superadmin-Seed.sql        # Initial superadmin user seed
│   └── view-top-selling.sql       # Top-selling report view
├── docs/                      # Documentation & test reports
├── public/                    # Static assets
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── AddProductModal.jsx
│   │   ├── EditProductModal.jsx
│   │   ├── Layout.jsx             # App shell (navbar + sidebar)
│   │   ├── PriceHistoryPanel.jsx
│   │   ├── ProtectedRoute.jsx     # Auth guard for routes
│   │   └── SoftDeleteDialog.jsx
│   ├── contexts/              # React Context providers
│   │   ├── AuthContext.jsx        # Authentication state
│   │   └── UserRightsContext.jsx  # Rights/permissions state
│   ├── lib/                   # Supabase client initialization
│   ├── pages/                 # Route-level page components
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── AuthCallbackPage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── PriceHistoryPanel.jsx
│   │   ├── ReportsPage.jsx
│   │   ├── UserManagementPage.jsx
│   │   └── DeletedItemsPage.jsx
│   ├── services/              # Supabase data-access layer
│   │   ├── productService.js
│   │   ├── priceHistService.js
│   │   ├── reportService.js
│   │   └── userService.js
│   ├── utils/                 # Shared utility functions
│   ├── App.jsx                # Root component with routes
│   ├── main.jsx               # Application entry point
│   └── index.css              # Tailwind directives
├── tests/                     # Test files
├── dist/                      # Production build output
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── vercel.json                # Vercel deployment config
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)
- A [Supabase](https://supabase.com/) project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AaronmarrD/HOPE---Product-Management-System.git
   cd HOPE---Product-Management-System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (see [Environment Variables](#environment-variables))

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

## Environment Variables

Create a `.env` file in the project root with the following:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Note:** Never commit `.env` to version control. The `.gitignore` already excludes it.

## Database Setup

Run the SQL scripts in the `database/` directory against your Supabase project in the following order:

1. `01_hopedb_schema.sql` — Creates core tables (products, price history, users)
2. `02_rights_management.sql` — Sets up `user_module` and `UserModule_Rights` tables
3. `03_triggers_and_functions.sql` — Audit triggers and helper functions
4. `Superadmin-Seed.sql` — Seeds the initial SUPERADMIN account
5. `05_sprint2_rls_additions.sql` — Row Level Security policies for Sprint 2 features
6. `07_sprint3_additions.sql` — RLS policies for admin user management
7. `view-top-selling.sql` — Database view for top-selling product report

## Available Scripts

| Command          | Description                         |
| ---------------- | ----------------------------------- |
| `npm run dev`    | Start the Vite development server   |
| `npm run build`  | Build for production                |
| `npm run preview`| Preview the production build locally|
| `npm run test`   | Run tests with Vitest               |

## User Roles & Access Control

| Role        | Description                                                                                    |
| ----------- | ---------------------------------------------------------------------------------------------- |
| SUPERADMIN  | Full system access. Seeded at setup. Cannot be modified by any other user.                     |
| ADMIN       | Product & report management. Can manage USER accounts. Cannot modify SUPERADMIN records.       |
| USER        | Standard registered user. Can add/edit products and view reports. No delete or admin access.   |

### Rights Matrix

| Right              | SUPERADMIN | ADMIN | USER |
| ------------------ | :--------: | :---: | :--: |
| Add Product        | Yes        | Yes   | Yes  |
| Edit Product       | Yes        | Yes   | Yes  |
| Soft Delete Product| Yes        | No    | No   |
| Product Report     | Yes        | Yes   | Yes  |
| Top Selling Report | Yes        | No    | No   |
| Manage Users       | Yes        | Yes   | No   |
| View Deleted Items | Yes        | Yes   | No   |

## Git Workflow

This project follows a strict branching strategy:

```
feature branch → PR → dev → reviewed release PR → main
```

- **`main`** — Production-ready code only (merged via release PRs from `dev`)
- **`dev`** — Integration branch for all feature work
- **Feature branches** — Named by convention: `feature/*`, `fix/*`, `db/*`, `test/*`, `docs/*`
- All PRs require at least one reviewer before merging
- PRs are never merged directly into `main`

## Deployment

The application is deployed on **Vercel**. The `vercel.json` in the project root handles SPA routing rewrites.

Production builds are generated with:
```bash
npm run build
```

## Team

| Role                          | Member |
| ----------------------------- | ------ |
| M1 — Project Lead             | Aaronmar N. Dionisio |
| M2 — Frontend Developer       | Jimuel Salenga       |
| M3 — Database Engineer        | Joe Dominguez        |
| M4 — Rights & Auth Specialist | Paolo Landicho       |
| M5 — QA / Documentation       | Rhoben Echaluse      |

*New Era University — College of Computer Studies*
*Information Management 2 — A.Y. 2025–2026*

## License

This project is developed for academic purposes as part of the Information Management 2 course at New Era University.
