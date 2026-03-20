# egekaya.net

Personal portfolio site for Ege Kaya, built with Next.js. The project combines a cybersecurity-focused profile, a photography portfolio, and a contact form backed by a server-side mail route.

## Stack

- Next.js 16 with the App Router
- React 19
- TypeScript
- Tailwind CSS 4
- GSAP for reveal and menu animations
- Nodemailer for contact form email delivery

## Pages

- `/` home page with the interactive profile card
- `/about` personal background, education, and interests
- `/cyber-security` technical profile and infrastructure summary
- `/photography` photography story, gear summary, and portfolio gallery
- `/contact` contact page with email form
- `/api/health` JSON health endpoint
- `/api/contact` POST endpoint for contact form submissions

## Project Structure

- `src/app/` app routes, layouts, global CSS, and API handlers
- `src/components/` reusable UI, animation, navigation, profile, and page-level components
- `src/lib/` shared constants and client-side effects policy helpers
- `public/` static assets including the profile image, SVG mask, and portfolio photos

## Environment Variables

Create a local `.env` file based on `.env.example`.

- `APP_NAME` display name returned by the health endpoint
- `APP_URL` base site URL for deployment or future integrations
- `GMAIL_USER` Gmail address used to send contact form emails
- `GMAIL_APP_PASSWORD` Gmail app password used by Nodemailer SMTP auth

## Local Development

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Useful scripts:

- `npm run dev` start the development server
- `npm run build` create a production build
- `npm run start` run the production server
- `npm run lint` run ESLint
- `npm run typecheck` run TypeScript without emitting files

## Contact Form

The contact form submits to `POST /api/contact`. The API route validates and sanitizes the payload, then sends the message to the configured Gmail inbox through `smtp.gmail.com` on port `465`.

## Photography Gallery

The photography page reads files from `public/images/portfolio` on the server and renders them automatically in filename order. Add or remove supported image files in that directory to update the gallery.

## GitHub Notes

- Do not commit the real `.env` file.
- `package-lock.json` should be committed.
- Static assets in `public/` are part of the site and should be committed.
