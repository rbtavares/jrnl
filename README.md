# JRNL

A simple, web-based note management application built with a microservices architecture. Create, edit, and organize your notes with a beautiful polished interface. In this project I aimed to leverage the use of Turborepo (to learn more about it) and to improve my skills on designing beautiful interfaces.

## ✨ Features

- **📝 Note Editor**: Create and edit notes with a clean, distraction-free interface
- **🎨 Beautiful UI**: Modern design with smooth animations and transitions
- **🗂️ Note Management**: Create, read, update, and delete notes seamlessly
- **📱 Responsive Design**: Works beautifully on desktop (not made for mobile unfortunately)
- **🎭 Welcome Experience**: First-time user onboarding with animated welcome screen

## 🏗️ Architecture

This project uses a monorepo structure with the following microservices:

### **Web App** (`apps/web`)
- **Framework**: React 19 with TypeScript
- **Styling**: TailwindCSS v4
- **Animations**: Motion (formerly Framer Motion)
- **Build Tool**: Vite.js
- **Default Port**: 8080

### **API Service** (`apps/api`)
- **Framework**: Hono (lightweight web framework)
- **Runtime**: Node.js with TypeScript
- **Database**: SQLite with Drizzle ORM
- **Port**: 3000

### **Database Package** (`packages/database`)
- **ORM**: Drizzle ORM
- **Database**: SQLite
- **Migrations**: Automated with Drizzle Kit
- **Schema**: Centralized database schema and client

### **Shared Packages**
- **TypeScript Config** (`packages/typescript-config`): Shared TypeScript configurations
- **Prettier Config** (`packages/prettier-config`): Consistent code formatting

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 10.9.3

### Option 1: With Turbo (Recommended)

If you have Turbo installed globally:

```bash
# Install Turbo globally (if not already installed)
npm install -g turbo

# Clone and setup
git clone <repository-url>
cd jrnl
npm install

# Start all services in development mode
turbo dev
```

### Option 2: Without Turbo

If you don't have Turbo installed:

```bash
# Clone and setup
git clone <repository-url>
cd jrnl
npm install

# Start all services in development mode
npm run dev
```

### Environment Configuration

Create a `.env` file in the `apps/web` directory:

```bash
# apps/web/.env
VITE_API_URL=http://localhost:3000
```

> **Important**: The web app requires `VITE_API_URL` to be set to communicate with the API service. The default API runs on port 3000.

### Accessing the Application

- **Web App**: http://localhost:8080
- **API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/health

## 🔨 Build Commands

### With Turbo

```bash
# Development (all services)
turbo dev

# Build all packages
turbo build

# Lint all packages
turbo lint

# Format code (root level only, uses npm directly)
npm run format
npm run format:check  # Check formatting without fixing
```

### Without Turbo

```bash
# Development (all services)
npm run dev

# Build all packages
npm run build

# Lint all packages
npm run lint

# Format code (root level only)
npm run format
npm run format:check  # Check formatting without fixing
```

### Individual Service Commands

```bash
# Web app only
cd apps/web
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build

# API only
cd apps/api
npm run dev          # Development server with hot reload
npm run build        # Build TypeScript
npm run start        # Start production server

# Database operations
cd packages/database
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio
```

## 📊 Database

The application uses SQLite with Drizzle ORM for data persistence:

- **Location**: `packages/database/data/database.sqlite`
- **Schema**: Defined in `packages/database/src/schema/index.ts`
- **Migrations**: Auto-generated and stored in `packages/database/migrations/`

### Database Schema

```typescript
// Entries table
{
  id: number (auto-increment primary key)
  title: string
  content: string
  createdAt: string (ISO timestamp)
  updatedAt: string (ISO timestamp)
}
```

## 🛠️ Development

### Project Structure

```
jrnl/
├── apps/
│   ├── web/          # React frontend application
│   └── api/          # Hono backend API
├── packages/
│   ├── database/     # Shared database package
│   ├── typescript-config/  # Shared TypeScript configs
│   └── prettier-config/    # Shared Prettier config
└── turbo.json        # Turbo configuration
```

### API Endpoints

- `GET /health` - Health check
- `GET /entries` - Get all notes
- `GET /entries/:id` - Get specific note
- `POST /entries` - Create new note
- `PUT /entries/:id` - Update note
- `DELETE /entries/:id` - Delete note

## 📝 Notes

- The database file is automatically created on first run
- All services support hot reload during development
- Code formatting (`npm run format` and `npm run format:check`) is only available at the root level and uses npm directly (not Turbo)
- The web app includes a welcome screen for first-time users