# Wooden Lines — React frontend

This is a complete React/Vite frontend wired to the supplied `carpentry-mern` Express/MongoDB API.

## What is included
- Public home page based on the uploaded **Final woodlines** design: warm layered browns, Playfair-style headings, Tamil/English toggle, story, services, portfolio, reviews and contact.
- Real supplied portfolio photos in `public/images/`.
- API-backed project gallery, project detail, services and testimonials.
- Contact form connected to `POST /api/inquiries`.
- Small bilingual chatbot that routes visitors to the gallery, phone or WhatsApp.
- Admin login/session restore using the supplied JWT API.
- Admin dashboard with Recharts using `/api/stats/dashboard`.
- Admin CRUD screens for projects, services, inquiries and testimonials, plus admin-only staff creation.
- Multipart image upload compatible with the backend's `images` field and `/uploads` public URLs.

## Run

1. Start the supplied backend first.
2. Copy `.env.example` to `.env` and keep:
   `VITE_API_URL=http://localhost:5000/api`
3. In this folder:
   `npm install`
4. Start:
   `npm run dev`

The backend seed credentials supplied in the original package are `admin@example.com / changeme123`. Change them before deployment.

## Notes
The public site can still show the supplied portfolio photos when the API is not reachable, so the visual frontend can be reviewed independently. Database content takes precedence when the API responds.

The backend uses absolute upload URLs, so uploaded project images should render directly in the React app as long as the backend is reachable from the browser.
