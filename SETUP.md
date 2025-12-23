# ColdFlow Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Get from [Clerk Dashboard](https://dashboard.clerk.com)
   - `CLERK_SECRET_KEY` - Get from Clerk Dashboard
   - `DATABASE_URL` - PostgreSQL connection string
   - `ANTHROPIC_API_KEY` - Get from [Anthropic Console](https://console.anthropic.com) (optional for sandbox mode)

3. **Set Up Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Features Implemented

### Phase 1: Foundation ✅
- Next.js 14 with App Router
- Terminal UI component with command history
- Natural language command parser (Claude API with fallback)
- Sandbox data generator (5,000 leads)
- Sandbox simulation engine
- Database schema with Prisma
- Authentication with Clerk

### Phase 2: Core Dashboards ✅
- Campaign Command Center
- Deliverability Dashboard
- Reply Inbox
- Integrations Hub
- Workflows list view

### Phase 3: Integrations ✅
- Integration abstraction layer
- Apollo integration
- MillionVerifier integration
- Instantly integration
- Integration factory pattern

### Phase 4: AI Features ✅
- AI personalization engine
- AI reply classifier
- AI email writer
- AI campaign doctor

### Phase 5: Workflow Automation ✅
- Workflow engine
- Workflow execution system
- Support for multiple step types (integration, condition, delay, webhook, transform)

### Phase 6: Agency Features ✅
- Multi-workspace support
- Team member management
- Workspace selector
- Role-based access (owner, admin, member, viewer)

### Phase 7: Polish & Optimization ✅
- Error boundaries
- Caching utilities
- Performance utilities (debounce, throttle, retry)
- ESLint configuration

## Project Structure

```
/app                    # Next.js app directory
  /app                 # Main application pages
  /api                 # API routes (future)
/components            # React components
  /terminal            # Terminal UI
  /layout              # Layout components
  /campaigns           # Campaign components
  /deliverability      # Deliverability components
  /replies             # Reply inbox components
  /integrations        # Integration components
  /workflows           # Workflow components
  /workspaces          # Workspace/team components
  /ui                  # Reusable UI components
/lib                   # Business logic
  /commands            # Command parsing and validation
  /sandbox             # Sandbox data and simulation
  /integrations        # Integration implementations
  /ai                  # AI features
  /workflows           # Workflow engine
  /workspaces          # Workspace management
  /utils               # Utility functions
/prisma                # Database schema
```

## Next Steps

1. **Connect Real Integrations**
   - Set up OAuth flows for Apollo, Instantly
   - Configure API keys for MillionVerifier
   - Test with real API calls

2. **Add More Integrations**
   - Smartlead
   - HubSpot
   - Clay
   - ZeroBounce

3. **Enhance AI Features**
   - Improve personalization quality
   - Add more campaign insights
   - Build email template library

4. **Workflow Builder UI**
   - Visual workflow builder
   - Drag-and-drop interface
   - Workflow templates

5. **Testing**
   - Unit tests for core logic
   - Integration tests for workflows
   - E2E tests for critical flows

6. **Deployment**
   - Set up Vercel deployment
   - Configure production database
   - Set up monitoring (Sentry, PostHog)

## Notes

- The application works in **sandbox mode** by default
- AI features fall back to rule-based logic if API key is not set
- All integrations have mock implementations for development
- Database schema is ready but needs migration for production

