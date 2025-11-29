# Claude.md - Project Documentation

## IMPORTANT: 
Always update claude.md if necessary if something changes and certain parts become out of date because of your changes

## Project Overview
This is a Next.js application for generating email icebreakers. Users can input a company name and website URL to generate personalized email icebreakers.

## Security

### Environment Variables
- **NEXT_PUBLIC_API_URL**: The base URL for the backend API (required)
  - Example: `https://primary-production-19e5.up.railway.app`
  - This must be set in `.env.local` for local development
  - For production, set this in your deployment platform's environment variables

### Security Best Practices
- All sensitive configuration is stored in environment variables
- API endpoints are not hardcoded in the codebase
- `.env*` files are properly excluded from git via `.gitignore`
- No API keys, secrets, or tokens are exposed in the codebase

## Development

### Setup
1. Copy `.env.example` to `.env.local`
2. Fill in the required environment variables
3. Run `npm install`
4. Run `npm run dev`

### Build & Lint
- Always run `npm run build` and `npm run lint` before committing changes
- Fix any errors that appear

## Mobile Optimization
This Next.js project is optimized for both desktop and mobile viewing.

