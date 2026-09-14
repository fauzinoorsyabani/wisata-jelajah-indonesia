
# Wisata Jelajah Indonesia

A modern tourism discovery and booking platform designed to make exploring Indonesian destinations simpler, more structured, and accessible through a single digital experience.

**Live Demo:** https://pesona-nusantara.vercel.app/

---

## Overview

Wisata Jelajah Indonesia is a web-based tourism platform that brings destination discovery, travel information, and ticket booking into one interface.

The project focuses on reducing friction in the early stages of travel planning. Instead of requiring users to search across different sources, the platform presents destinations through categorized discovery, search and filtering, destination information, and booking-oriented interactions.

The interface was designed with a clean, approachable visual language to keep travel information easy to scan while giving destinations enough visual emphasis to inspire exploration.

---

## Core Features

- **Destination Discovery** — Browse curated Indonesian destinations from a centralized interface.
- **Search & Filtering** — Find destinations using search, date, and category-based controls.
- **Destination Categories** — Organize destinations into categories such as nature, culture, recreation, and other travel interests.
- **Destination Cards** — Present essential information such as location, rating, and starting price in a compact format.
- **Booking-Oriented Experience** — Provide clear calls to action for users who want to continue toward ticket or travel booking.
- **Promotional Section** — Highlight relevant offers and promotional information without interrupting the main discovery flow.
- **Responsive Interface** — Designed to remain usable across different screen sizes.
- **Structured Navigation** — Provide clear access to destinations, promotions, help, account actions, and other key areas.

---

## Design Approach

The interface is built around a simple principle:

> **Make discovering Indonesia feel easy before asking users to make a decision.**

The homepage therefore prioritizes:

1. **Discovery** — A prominent hero section introduces the platform and gives users an immediate way to search.
2. **Trust & clarity** — Supporting benefits explain why the platform is useful before users browse destinations.
3. **Visual exploration** — Destination cards use photography and concise information to encourage comparison.
4. **Action** — Clear calls to action guide users from discovery toward destination details and booking.

The visual system combines photography, spacious layouts, rounded interface elements, and strong blue/green accents to create a travel-oriented but functional experience.

---

## Technical Overview

The project is primarily written in **TypeScript** and uses a component-based frontend architecture.

### Technology

- **Language:** TypeScript
- **Frontend:** React
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Backend:** Node.js / server-side application layer
- **Database & Services:** Supabase
- **Deployment:** Vercel

> The exact dependency versions are defined in `package.json`.

---

## Project Structure

```text
wisata-jelajah-indonesia/
├── public/             # Static assets
├── src/                # Frontend application
├── server/             # Server-side logic
├── supabase/           # Supabase configuration / database resources
├── package.json        # Project dependencies and scripts
├── vite.config.ts      # Vite configuration
├── tailwind.config.ts  # Tailwind configuration
└── tsconfig.json       # TypeScript configuration
Getting Started
1. Clone the repository
git clone https://github.com/fauzinoorsyabani/wisata-jelajah-indonesia.git
cd wisata-jelajah-indonesia
2. Install dependencies
npm install
3. Configure environment variables

Create the environment file required by the application and provide the Supabase / application credentials used by your deployment.

Do not commit production secrets or private credentials to the repository.

4. Start the development server
npm run dev

Then open the local development URL shown by Vite.

Deployment

The project is deployed on Vercel with production and preview deployments.

Production: https://pesona-nusantara.vercel.app/

Security & Code Quality

The repository is structured with a clear separation between frontend, server-side logic, and Supabase resources.

Security-sensitive configuration is kept outside the application source through environment variables. The project also includes ESLint and TypeScript configuration to support consistent code quality during development.

Project Status

Status: Deployed

This project is an independently developed portfolio project exploring how a digital tourism platform can combine destination discovery, structured information, and booking-oriented user flows into one cohesive experience.

Author

Fauzi Noorsyabani

Information Systems — Universitas Siliwangi

GitHub: https://github.com/fauzinoorsyabani
Live Project: https://pesona-nusantara.vercel.app/
License

This project is created for portfolio and educational purposes.
