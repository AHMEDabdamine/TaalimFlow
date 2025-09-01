# Overview

This is a bilingual (Arabic/French/English) React-based school management platform called "Taalim Flow" or "OnSchool". The application provides comprehensive digital solutions for private schools and training centers in Algeria, featuring student management, attendance tracking, communication tools, and payment processing. The project uses modern web technologies with a focus on RTL (right-to-left) language support and responsive design.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom design tokens, supporting both LTR and RTL layouts
- **Routing**: React Router with browser-based routing and nested route structure
- **State Management**: React Query for server state management
- **Internationalization**: react-i18next for multi-language support (Arabic, French, English)
- **Animations**: Framer Motion for complex animations and transitions
- **Theme System**: Next-themes for dark/light mode support with system preference detection

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript compiled to CommonJS for server compatibility
- **File Storage**: JSON-based data persistence for leads and contact forms
- **Email Service**: Nodemailer with SMTP configuration for notifications
- **CORS**: Enabled for cross-origin requests during development

## Data Management
- **Storage**: File-based JSON storage for simplicity (leads.json)
- **Validation**: Environment variable validation for required services
- **Data Models**: TypeScript interfaces for type safety

## Authentication & Security
- **Admin Access**: Simple password-based authentication for administrative functions
- **Environment Variables**: Secure configuration management for sensitive data
- **Input Validation**: Form validation using React Hook Form with Zod resolvers

## Build & Deployment
- **Development**: Concurrent frontend (Vite) and backend (ts-node) development servers
- **Production**: Optimized Vite build with TypeScript compilation for server
- **Static Assets**: Public directory serving with Express for production
- **PWA Support**: Web app manifest and service worker ready

## Responsive Design
- **Mobile-First**: Tailwind's responsive utilities with custom breakpoints
- **Device Testing**: Built-in mobile/desktop preview capabilities
- **Touch Support**: Optimized for touch interactions on mobile devices

# External Dependencies

## Core Libraries
- **React Ecosystem**: React, React DOM, React Router for frontend framework
- **UI Components**: Radix UI primitives, Lucide React icons, React Device Frameset
- **Styling**: Tailwind CSS, Class Variance Authority, Tailwind Merge
- **Forms**: React Hook Form, Hookform Resolvers for form management
- **Animations**: Framer Motion, Embla Carousel for interactive elements

## Backend Services
- **Server**: Express.js, CORS, Body Parser for API layer
- **Email**: Nodemailer for SMTP-based email notifications
- **HTTP Client**: node-fetch for external API calls (Telegram integration)
- **Environment**: dotenv for configuration management

## Development Tools
- **TypeScript**: Full TypeScript support with strict configuration
- **Build Tools**: Vite for frontend, custom TypeScript compilation for backend
- **Linting**: ESLint with React and TypeScript rules
- **Package Management**: npm with lock file for dependency consistency

## Third-Party Integrations
- **Email Providers**: SMTP-compatible email services (Gmail, Outlook, etc.)
- **Telegram Bot API**: For real-time notifications to administrators
- **Font Services**: Google Fonts (Cairo, Alexandria) for Arabic typography
- **Icon Library**: Lucide React for consistent iconography

## Optional Services
- **Deployment**: Vercel-ready configuration with build optimization
- **Domain Management**: Custom domain support through configuration
- **Analytics**: Ready for Google Analytics or similar tracking services
- **Payment Processing**: Extensible architecture for payment gateway integration