# Kim Tae Kyun VFX DEV LOG Website

## Project Overview
This is Kim Tae Kyun's personal website built with Next.js, featuring portfolio content managed through Notion CMS and contact form functionality.

## Tech Stack
- **Framework**: Next.js 15.5.2
- **Styling**: SASS/SCSS with custom fonts
- **CMS**: Notion API integration
- **Email**: Nodemailer with SMTP
- **Analytics**: Google Analytics
- **Animations**: GSAP and Framer Motion

## Environment Setup
The project is configured to run on Replit with:
- **Development**: Port 5000 with host 0.0.0.0
- **Environment Variables**: 
  - `NOTION_TOKEN` - Notion API authentication
  - `NOTION_DATABASE_ID` & `NOTION_DATABASE_ID2` - Notion database IDs
  - `MAIL_USER` & `MAIL_PASS` - SMTP email credentials
  - `GOOGLE_ANALYTICS` - GA tracking ID
  - `NEXT_PUBLIC_API_URL` - Public API endpoint

## Architecture
- **Pages**: Home, About, Works, Blogs, Contact
- **Content Management**: Notion databases for blog posts and portfolio items
- **Contact Form**: Server-side API route with email integration
- **Responsive Design**: Mobile-first approach with custom breakpoints

## Development Notes
- Uses deprecated Sass @import rules (consider migrating to @use in future)
- Some Next.js Link components use legacy behavior
- Configured for Replit deployment with autoscale target

## Recent Changes
- September 09, 2025: Initial Replit setup with environment configuration
- Configured Next.js dev server for Replit proxy compatibility
- Set up deployment configuration for production use