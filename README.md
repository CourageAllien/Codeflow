# ColdFlow — The Cold Email Command Center

ColdFlow is an AI-powered command center for cold email professionals. It's an IDE-style interface where users orchestrate their entire outreach stack — from lead sourcing to inbox placement to reply handling — using plain English commands.

## Features

- **Command-Line Interface**: Natural language commands to control your entire cold email stack
- **Sandbox Mode**: Learn and test without risk using realistic dummy data
- **Multi-Platform Orchestration**: Connect Apollo, Instantly, MillionVerifier, and more
- **AI-Powered**: Personalization, reply classification, and campaign insights
- **Workflow Automation**: Save and automate repetitive sequences

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma
- **Authentication**: Clerk
- **AI**: Anthropic Claude API
- **State Management**: Zustand
- **Type Safety**: TypeScript + tRPC

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Clerk account (for authentication)
- Anthropic API key (for command parsing)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Fill in:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `DATABASE_URL`
   - `ANTHROPIC_API_KEY`

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
/app                 # Next.js app directory
  /app              # Main application pages
  /api              # API routes
/components         # React components
  /terminal         # Terminal UI component
  /layout           # Layout components
  /ui               # Reusable UI components
/lib                # Utilities and business logic
  /commands         # Command parsing and validation
  /sandbox          # Sandbox data generation and simulation
/prisma             # Database schema
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:studio` - Open Prisma Studio
- `npm run lint` - Run ESLint

## Features

### ✅ Implemented
- Terminal command interface with natural language parsing
- Sandbox mode with 5,000 realistic dummy leads
- Campaign management dashboard
- Deliverability monitoring
- Reply inbox with AI classification
- Integration hub (Apollo, MillionVerifier, Instantly)
- Workflow automation engine
- Multi-workspace support for agencies
- Team collaboration features
- AI-powered personalization, email writing, and campaign diagnosis

### 🚧 In Progress / Future
- Visual workflow builder
- Additional integrations (Smartlead, HubSpot, Clay)
- Real-time collaboration
- Advanced analytics
- Mobile app
- CLI tool

## License

MIT

