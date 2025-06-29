# PayPal Clone - Mobile Payment Application

A fully responsive PayPal clone built with React, Express, and TypeScript. Features mobile-first design, real-time balance updates, and complete payment functionality.

## Features

- 📱 Mobile-first responsive design
- 💰 Send money with form validation
- 💳 Add money from bank accounts
- 📊 Transaction history and activity tracking
- 🏦 Payment method management
- 🎨 PayPal-inspired UI with blue color scheme
- ⚡ Real-time balance updates

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, Node.js, TypeScript
- **State Management**: TanStack React Query
- **Form Handling**: React Hook Form + Zod validation
- **Routing**: Wouter
- **Build Tool**: Vite

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development: `npm run dev`
4. Open http://localhost:5000

## Deployment on Vercel

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Vercel will automatically detect the configuration
4. Deploy with one click

## Demo Account

- **User**: John Smith (john.smith@email.com)
- **Balance**: $1,284.50
- **Payment Methods**: Visa, Mastercard, Bank of America

## API Endpoints

- `GET /api/user` - Get current user
- `GET /api/payment-methods` - Get payment methods
- `GET /api/transactions` - Get transaction history
- `POST /api/send-money` - Send money to another user
- `POST /api/add-money` - Add money from bank

## Project Structure

```
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared types and schemas
├── vercel.json      # Vercel deployment config
└── package.json     # Dependencies and scripts
```

## License

MIT License - feel free to use for learning and projects.