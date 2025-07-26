# Email Management Frontend

A modern web application for email verification, AI-powered content generation, and template management built with React, TypeScript, and Tailwind CSS.

## Features

- **Email Verification**
  - Real-time email address validation
  - Comprehensive validation metrics (SMTP, MX records, disposable detection)
  - Safety score assessment

- **AI Content Generation**
  - Google Gemini-powered email content creation
  - Customizable tone and style
  - Pre-built prompt templates
  - One-click content copying

- **Template Management**
  - Hierarchical template organization
  - Preview and edit capabilities
  - Variable support for personalization
  - Quick template application

## Tech Stack

- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context
- **API Integration**: Native Fetch API
- **Build Tool**: Vite
- **Package Manager**: npm/bun

## Getting Started

### Prerequisites

- Node.js 18+ or Bun 1.0+
- A Google Gemini API key for AI features
- Access to backend services

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Frontend
```

2. Install dependencies:
```bash
npm install
# or with bun
bun install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables:
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_GEMINI_API_KEY=your_api_key_here
```

5. Start development server:
```bash
npm run dev
# or
bun dev
```

## Project Structure

```
src/
├── components/        # React components
├── context/          # Context providers
├── hooks/            # Custom React hooks
├── lib/             # Utility functions
├── pages/           # Route components
└── styles/          # Global styles
```

## API Integration

The frontend integrates with several API endpoints:

- `/verify-email/:email` - Email validation
- `/generate-email-content` - AI content generation
- `/email-templates` - Template management
- `/send-email` - Email sending

## Development

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write meaningful component documentation

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format with Prettier

## Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` directory to your hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

[MIT License](LICENSE)
