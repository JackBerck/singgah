# PROJECT SPECIFICATION: SINGGAH

## 1. GENERAL INFORMATION
* **App Name:** Singgah
* **Slogan:** Jelajahi Keindahan Desa
* **Description:** A web-based platform designed to promote Indonesian tourism villages (Desa Wisata) and local creative economies (UMKM). It serves as a centralized hub for tourists to explore attractions, accommodations, and culinary spots, while empowering village managers to maintain their digital presence independently.
* **Core Value:** Emphasizes local creative economy, AI-driven personalization for trip planning, and independent data management by village communities.

## 2. TECH STACK
* **Backend:** Laravel 12
* **Frontend:** React (integrated via Laravel Starter Kit / Inertia), TailwindCSS, Shadcn UI
* **Database:** PostgreSQL
* **AI Integration:** To be determined (for AI Travel Assistant)

## 3. USER ROLES & FEATURES

### A. Visitor (Pengunjung)
* **Explore Village Profile:** View general description, media gallery, interactive map (Google Maps), and upcoming events.
* **Explore Entities:** View detailed information (rich text description, pricing, media, contacts) for:
  * Attractions (Wisata)
  * Local Culinary/UMKM
  * Accommodations
* **Community Interaction:** Leave ratings and comments on villages/entities.
* **AI Travel Assistant:** Chatbot interface to get personalized destination recommendations based on user preferences.

### B. Village Manager (Pengelola Desa)
* **Village CMS Dashboard:** Manage (CRUD) village profile, attractions, UMKM, accommodations, and events.

### C. Super Admin
* **Admin Dashboard:** * Verify and approve village manager registrations and village listings.
  * Manage users.
  * Moderate content (reviews, village information).

## 4. DATABASE SCHEMA DESIGN (NORMALIZED GUIDELINES)
*Agent Directive: Ensure optimal relationships, indexing, and data types for PostgreSQL.*

* **Users Table:** Standard Laravel Auth + `avatar` (string/nullable), `phone` (string/nullable), `address` (text/nullable), `role` (enum: admin, manager, user).
* **Villages Table:** `id`, `manager_id` (FK to Users), `name`, `description` (text), `map_url` (string), `status` (enum: pending, verified, rejected).
* **Village_Events Table:** `id`, `village_id` (FK), `name`, `description` (rich text), `event_date` (datetime), `contact_info` (string).
* **Attractions Table:** `id`, `village_id` (FK), `name`, `description` (rich text), `price_min` (decimal), `price_max` (decimal), `contact_info` (string).
* **Culinary_UMKM Table:** `id`, `village_id` (FK), `name`, `description` (rich text), `price_min` (decimal), `price_max` (decimal), `contact_info` (string).
* **Accommodations Table:** `id`, `village_id` (FK), `name`, `description` (rich text), `price_min` (decimal), `price_max` (decimal), `contact_info` (string).
* **Reviews Table:** `id`, `user_id` (FK), `reviewable_id`, `reviewable_type` (Polymorphic relation to allow reviews on Villages, Attractions, or Accommodations), `rating` (integer 1-5), `comment` (text).
* **Media Table (Polymorphic):** `id`, `mediable_id`, `mediable_type`, `file_path`, `type` (image/video). *Directive: Enforce max limits and file size validation at the application level.*

## 5. BACKEND ARCHITECTURE & CODING STANDARDS
*Agent Directive: Strictly adhere to the following architectural patterns when generating Laravel code.*

1. **Validation & Localization:** All incoming requests must be validated. Validation feedback messages must be in Indonesian.
2. **Skinny Controllers:** Controllers must only handle HTTP request and response routing. No complex business logic or queries inside controllers.
3. **Form Requests:** Use Custom Form Request classes for validation instead of `$request->validate()` in controllers.
4. **Action Pattern:** Extract business logic into Action classes (e.g., `CreateVillageAction`, `UploadMediaAction`).
5. **Data Transfer Objects (DTO):** Use DTOs to ensure type safety and standardize data structures passed into business logic/actions.
6. **Query Management:** Utilize Eloquent Scopes or Custom Query Builders to abstract complex database queries. Avoid N+1 query issues by strictly defining eager loading (`with()`).
7. **Strict File Validation:** Media uploads must have strict MIME type, file size, and quantity limit validations enforced via Form Requests.

## 6. FRONTEND ARCHITECTURE & DESIGN GUIDELINES
*Agent Directive: Strictly adhere to the following frontend structure, styling rules, and UI/UX principles to ensure a highly consistent and accessible user interface.*

1. **Standardized Layout Structure:** All pages must follow a uniform layout pattern to maintain consistent margins and padding across the application. Use the following JSX/TSX boilerplate for every new page:
  ```jsx
  <Layout>
      {/* Example: Hero / Header Section */}
      <section className="section-padding-x">
          <div className="container max-w-7xl">
              {/* Hero Section Content */}
          </div>
      </section>

      {/* Example: Content / Categories Section */}
      <section className="section-padding-x py-6">
          <div className="container max-w-7xl">
              {/* Categories Section Content */}
          </div>
      </section>
  </Layout>
  ```
2. **Typography:** All font sizes must strictly use the standardized utility classes or variables defined within app.css. Avoid hardcoding custom font-size values inline or in module classes.
3. **Color Palette & CSS Variables:**
    - Theme: Bright, fresh, and inviting. The primary color scheme should focus on Green (representing nature/village) and Blue (representing sky/water/trust).
    - Implementation: All theme colors must be defined as CSS variables within app.css (e.g., --primary-green, --secondary-blue, --bg-light). Do not hardcode HEX or RGB values directly into the React components; always reference these CSS variables (via Tailwind config or direct CSS).
    - UI/UX Consistency: Maintain a strict design system. Buttons, input fields, cards, spacing, and hover effects must be visually consistent across all features and pages.
4. **Accessibility & Simplicity (User-Friendly):** The design must be clean, simple, and intuitive. It should be highly accessible for users of all demographics and ages ("ramah di semua kalangan masyarakat"). Prioritize clear typography, high contrast for text, and straightforward navigation over complex animations or convoluted layouts.
