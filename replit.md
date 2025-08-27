# Bridge Portfolio Platform

## Overview

Bridge is a full-stack web application that serves as an AI-powered portfolio and file organization platform for creative professionals. The platform combines four core functionalities: portfolio showcase, intelligent file organization, AI-powered assistant services, and donation management. Built with a modern tech stack, it provides users with tools to manage their creative projects, showcase their work professionally, and receive support from their community.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built using **React 18** with **TypeScript** and follows a single-page application (SPA) pattern using the **Wouter** router for navigation. The UI framework leverages **Radix UI** components with **Tailwind CSS** for styling, implementing a design system based on the shadcn/ui component library. The frontend uses **React Query (TanStack Query)** for server state management and API communication, providing efficient caching and synchronization of data between client and server.

### Backend Architecture
The server is built with **Express.js** running on **Node.js** with **TypeScript**. The API follows RESTful principles and includes middleware for request logging, error handling, and file upload management using **Multer**. The architecture supports both development and production environments with **Vite** integration for hot module replacement during development. The server implements a modular routing system and uses an abstraction layer for data storage operations.

### Data Storage Solutions
The application uses **PostgreSQL** as the primary database with **Drizzle ORM** for database operations and schema management. The database connection is established through **Neon Database** serverless PostgreSQL with WebSocket support. The data layer includes four main entities: users, projects, files, and donations, with proper foreign key relationships and UUID-based primary keys. The storage layer is abstracted through an interface-based approach, allowing for different storage implementations (currently includes an in-memory storage for development/testing).

### Authentication and Authorization
The current architecture includes user management schemas and basic session handling foundations. While authentication middleware and session management are not fully implemented in the current codebase, the database schema supports user registration, authentication, and authorization flows with password storage and email verification capabilities.

### File Management System
File uploads are handled through Multer middleware with size limitations (10MB) and support for various file types including images, documents, code files, and compressed archives. Files are categorized and linked to both users and projects, with metadata tracking including original filenames, MIME types, and file sizes. The system supports AI-powered file organization suggestions based on file type analysis and naming patterns.

### External Dependencies

**Database Services:**
- Neon Database serverless PostgreSQL for primary data storage
- Connection pooling through @neondatabase/serverless

**Payment Processing:**
- Stripe integration for donation processing (@stripe/stripe-js, @stripe/react-stripe-js)
- Support for payment intents and donation management

**UI and Design System:**
- Radix UI primitives for accessible component foundation
- Tailwind CSS for utility-first styling
- Custom design tokens with CSS variables for theming
- Responsive design with mobile-first approach

**Development and Build Tools:**
- Vite for development server and build tooling
- ESBuild for server-side bundling
- TypeScript for type safety across the entire stack
- Drizzle Kit for database migrations and schema management

**AI and Enhancement Services:**
- React Query for intelligent data fetching and caching
- Built-in AI suggestions system for file organization
- Chat interface components for AI assistant functionality

**Additional Integrations:**
- React Hook Form with Zod resolvers for form validation
- Date-fns for date manipulation and formatting
- React Dropzone for enhanced file upload experiences
- WebSocket support for real-time features through Neon's serverless architecture