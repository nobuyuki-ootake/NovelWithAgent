# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Start all services
pnpm run dev

# Start individual services
pnpm run dev:frontend    # React frontend only
pnpm run dev:proxy       # Express proxy-server only

# Build all packages
pnpm run build

# Build individual services
pnpm run build:frontend
pnpm run build:proxy
```

### Testing
```bash
# Frontend tests
cd apps/frontend && pnpm run test           # Unit tests with Vitest
cd apps/frontend && pnpm run test:e2e       # E2E tests with Playwright

# Evidence-based testing (critical features)
cd apps/frontend && pnpm run test:evidence
cd apps/frontend && pnpm run test:evidence:headed

# AI-enhanced feature testing
cd apps/frontend && pnpm run test:ai-enhanced
cd apps/frontend && pnpm run test:timeline:ai
cd apps/frontend && pnpm run test:worldbuilding:ai

# Backend tests
cd apps/proxy-server && pnpm run test      # Jest tests
```

### Code Quality
```bash
# Lint all packages
pnpm run lint

# Lint individual packages
pnpm run lint:frontend
pnpm run lint:proxy

# Type checking
cd apps/frontend && npx tsc --noEmit
cd apps/proxy-server && npx tsc --noEmit
```

### Development Tools
```bash
# Storybook for component development
pnpm run storybook

# Production preview
pnpm run start:frontend    # Preview built frontend
pnpm run start:proxy       # Start proxy in production mode
```

## Architecture Overview

### Core Structure
This is a monorepo using pnpm workspaces and Turbo for orchestration, implementing an AI-assisted novel creation platform with Japanese language support.

**Frontend (apps/frontend)**: React + TypeScript + Vite with Material-UI, features rich text editing (Slate.js), timeline management, character/world-building tools, and drag-and-drop interfaces.

**Backend (apps/proxy-server)**: Express.js + TypeScript server using the Mastra AI framework for agent orchestration, providing API proxies for OpenAI, Claude, and Gemini, with Redis caching and specialized novel-writing agents.

**Shared Types (packages/types)**: Centralized TypeScript definitions including complex types for `NovelProject`, `WorldBuildingElement`, `Character`, `TimelineEvent`, and AI request/response structures.

### AI Agent System
The backend implements a sophisticated agent network architecture via Mastra:

- **Agents** (`src/agents/`): Specialized AI personas including `novelAssistant`, `plotAdvisor`, `characterDesigner`, `styleEditor`, and `worldBuildingAssistant`
- **Networks** (`src/networks/`): Agent collaboration systems like `novelCreationNetwork`, `plotDevelopmentNetwork`, and `writingImprovementNetwork`
- **Tools** (`src/tools/`): AI-powered analysis tools for plot, character, text, and world-building consistency

### Key API Patterns
- **Direct AI Proxies**: `/api/openai`, `/api/claude`, `/api/gemini` for raw AI API access
- **Agent Endpoints**: `/api/agent/*` routes that leverage Mastra agents for specialized tasks
- **Generation Endpoints**: Pattern-based generation for characters, timeline events, world-building elements

### State Management
Frontend uses Recoil for state management with complex nested data structures. The `NovelProject` type is the root state container encompassing all project data including characters, plot elements, world-building, timeline events, and chapters.

### World-Building System
Implements a sophisticated categorized world-building system with 10 element types (worldmap, setting, rule, place, culture, geography_environment, history_legend, magic_technology, state_definition, free_field), each with specific TypeScript interfaces and AI-assisted generation capabilities.

## Type System Rules

**CRITICAL**: All shared types are centralized in `packages/types/index.ts` and should be treated as the authoritative source. Core types like `WorldBuildingElementType`, `BaseWorldBuildingElement`, and `NovelProject` are considered immutable and require explicit approval before modification.

When encountering type conflicts, prioritize the shared types package over local implementations. For component-specific Props types, local definition is acceptable, but reusable types should be added to the shared package.

### AI Request/Response Pattern
Standardized AI communication uses `StandardAIRequest` and `StandardAIResponse` interfaces supporting multiple response formats (text, json, yaml) with comprehensive error handling and usage tracking.

## Development Notes

### Frontend Architecture
- Uses feature-based organization with components grouped by functionality
- Rich text editing via Slate.js with custom plugins
- Timeline visualization using react-calendar-timeline
- Drag-and-drop interfaces with @dnd-kit
- Material-UI theming with custom components

### Backend Architecture  
- Express middleware stack with rate limiting, CORS, and Redis caching
- Mastra framework integration for AI agent orchestration
- Environment-based configuration with development/production profiles
- Comprehensive error handling with retry logic for AI API calls

### Testing Strategy
- Unit tests with Vitest for frontend logic
- Playwright E2E tests for critical user workflows
- Evidence-based testing approach for key features
- Separate test suites for AI-enhanced functionality

### Build System
Turbo configuration enables parallel builds and caching. Frontend builds to static assets via Vite, backend compiles TypeScript to CommonJS in `dist/`. Both applications support hot reload in development mode.