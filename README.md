# Neuland Student Verification System

A secure web application for verifying student status at Technische Hochschule Ingolstadt (THI) for Neuland Ingolstadt e.V. members. Students are exempt from membership fees according to the organization's bylaws, and this system ensures only verified students receive this benefit.

## 🎯 Overview

The Neuland Student Verification System is a multi-step verification process that:

- **Step 1**: Verifies member identity via their registered private email
- **Step 2**: Confirms student status via THI institutional email
- **Step 3**: Final confirmation and status update in member management system

## ✨ Features

- **Multi-step Verification**: Secure 3-step process with email verification
- **Bot Protection**: Altcha proof-of-work challenge to prevent automated abuse
- **Member Management Integration**: EasyVerein backend
- **Professional Email Templates**: Beautiful, responsive email designs using React Email
- **Token-based Security**: JWT tokens with expiration for secure verification links
- **Bulk Email Support**: CLI tool for sending initial verification emails to members
- **Docker Support**: Containerized deployment with multi-stage builds
- **Modern Tech Stack**: Built with Next.js 16, React 19, and TypeScript

## 🚀 Quick Start

### Prerequisites

- Node.js 22 or higher
- pnpm package manager
- Azure Communication Services account (for email delivery)
- EasyVerein account with API access

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/neuland-ingolstadt/neuland-student-verification.git
   cd neuland-student-verification
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration:

   ```env
   BASE_URL=http://localhost:3000
   AZURE_COMMUNICATION_SERVICE_CONNECTION_STRING=your_azure_connection_string
   JWT_SECRET=your_jwt_secret
   EASYVEREIN_API_KEY=your_api_key
   ALTCHA_SECRET=your_altcha_secret  # generate with: openssl rand -base64 32
   ```

4. **Start development server**

   ```bash
   pnpm dev
   ```

5. **Visit** `http://localhost:3000`

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 16 (App Router, Server Actions)
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Forms**: React Hook Form with Zod validation
- **Email**: React Email, Azure Communication Services
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: Altcha (self-hosted proof-of-work bot protection)
- **Deployment**: Docker, Node.js
- **Code Quality**: Biome (linting & formatting)

### Project Structure

```
├── app/                    # Next.js app router
│   ├── step1/             # Email verification UI + server action
│   ├── step2/             # Student email verification UI + server action
│   └── step3/             # Final confirmation UI + server action
├── components/            # Shared UI components (shadcn/ui)
├── etc/                   # External service integrations
│   └── easyverein/        # easyVerein API client + member management
├── lib/                   # Utility functions
├── mail/                  # Email templates (React Email)
├── services/              # External service clients
└── public/                # Static assets
```

## 📧 Email System

The system uses **React Email** for creating beautiful, responsive email templates:

- **Step 0**: Initial verification invitation (bulk sending)
- **Step 1**: Private email verification
- **Step 2**: Student email verification
- **Step 3**: Completion confirmation

### Email Development

```bash
# Start email development server
pnpm dev:email

# Export email templates
pnpm export
```

## 🔧 Member Management Integration

Member data is managed through EasyVerein:

```env
EASYVEREIN_API_KEY=your_api_key
EASYVEREIN_EMAIL_CF=custom_field_id
EASYVEREIN_DATE_CF=custom_field_id
```

## 📨 Bulk Email Sending

Send verification invitations to all members:

```bash
# Place member CSV export in root directory as 'Mitgliederliste.csv'
pnpm send
```

The CSV should contain columns: `Vorname`, `Nachname`, `Primäre E-Mail`

## 🐳 Docker Deployment

### Build and Run

```bash
# Build the image
docker build -t neuland-verification .

# Run container
docker run -p 3000:3000 \
  -e AZURE_COMMUNICATION_SERVICE_CONNECTION_STRING="your_connection_string" \
  -e JWT_SECRET="your_secret" \
  neuland-verification
```

### Docker Compose

```yaml
version: '3.8'
services:
  verification:
    build: .
    ports:
      - "3000:3000"
    environment:
      - BASE_URL=https://verification.yourdomain.com
      - AZURE_COMMUNICATION_SERVICE_CONNECTION_STRING=your_connection_string
      - JWT_SECRET=your_jwt_secret
      - EASYVEREIN_API_KEY=your_api_key
    restart: unless-stopped
```

## 🔒 Security Features

- **Bot Protection**: Altcha proof-of-work challenge prevents automated abuse without third-party services or cookies
- **JWT Token Security**: Time-limited verification tokens (24h expiration)
- **Email Validation**: Strict THI email format validation (`abc1234@thi.de`)
- **Server-side Validation**: All inputs re-validated in server actions with Zod
- **Rate Limiting**: Built-in Next.js protections

## 🛠️ Development

### Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm check        # Run TypeScript and linting checks
pnpm check:fix    # Auto-fix linting issues
pnpm dev:email    # Start email development server
pnpm export       # Export email templates
pnpm send         # Send bulk verification emails
```

### Code Quality

This project uses **Biome** for consistent code formatting and linting:

```bash
# Check code quality
pnpm check

# Auto-fix issues
pnpm check:fix
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `BASE_URL` | Application base URL | ✅ |
| `AZURE_COMMUNICATION_SERVICE_CONNECTION_STRING` | Azure email service | ✅ |
| `JWT_SECRET` | Secret for signing JWT tokens | ✅ |
| `EASYVEREIN_API_KEY` | EasyVerein API key | ✅ |
| `ALTCHA_SECRET` | HMAC secret for Altcha challenges (`openssl rand -base64 32`) | ✅ |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Biome for code formatting
- Test email templates in the email development server
- Ensure proper error handling and user feedback

## 📄 License

This project is licensed under the [MIT License](LICENSE).
