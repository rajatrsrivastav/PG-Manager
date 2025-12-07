# PG Manager

A comprehensive web application for managing Paying Guest (PG) properties, students, fees, and payments. Built with Next.js, TypeScript, and Prisma.

## Hosted Frontend URL

[Insert your hosted frontend URL here]

## Proposal

### Problem Statement

Managing multiple Paying Guest (PG) properties involves tracking numerous students, collecting monthly fees, and maintaining payment records. Traditional manual methods using spreadsheets or paper records are prone to errors, time-consuming, and inefficient. Landlords and property managers struggle with:

- Tracking student information and occupancy
- Managing monthly fee collections
- Recording payment histories
- Generating reports on outstanding dues
- Coordinating between multiple properties

This leads to financial losses, administrative overhead, and poor tenant experience.

### Solution

PG Manager is a web-based application that streamlines PG property management through:

- **User Authentication**: Secure login system for property owners
- **Property Management**: Add and manage multiple PG properties
- **Student Management**: Track student details, assignments to properties
- **Fee Management**: Set monthly fees per student
- **Payment Tracking**: Record and monitor payments with due dates
- **Dashboard**: Overview of properties, students, and financial status

### Features

- Secure user authentication and authorization
- CRUD operations for PG properties, students, and payments
- Responsive dashboard with key metrics
- Database integration with PostgreSQL via Prisma
- Modern UI with shadcn/ui components

### Technology Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: Custom implementation with bcrypt and JWT

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rajatrsrivastav/PG-Manager.git
cd pg-manager
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```
DATABASE_URL="postgresql://username:password@localhost:5432/pgmanager"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Seed the database (optional):
```bash
npm run seed
```

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Schema

The application uses the following main entities:
- **Users**: Property owners/managers
- **PGs**: Paying Guest properties
- **Students**: Tenants living in PGs
- **Payments**: Monthly fee payment records

## API Routes

- `/api/auth/*`: Authentication endpoints
- `/api/pgs/*`: PG property management
- `/api/students/*`: Student management
- `/api/payments/*`: Payment tracking

## Deployment

The application can be deployed on Vercel, Netlify, or any platform supporting Next.js.

1. Push your code to GitHub
2. Connect your repository to your deployment platform
3. Set environment variables in the deployment settings
4. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
