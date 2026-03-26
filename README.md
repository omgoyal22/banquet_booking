# Hotel Banquet Booking Platform

A full-stack web application for browsing and managing hotel banquet halls across multiple cities in India.

## Features

### For Users
- Browse banquet halls by location (8 cities available)
- View detailed information including images, descriptions, and pricing
- Send WhatsApp queries directly to venue owners
- Clean, modern, and responsive design
- Up to 5 banquet halls displayed per location

### For Administrators
- Secure authentication system (signup/login)
- Full CRUD operations for banquet listings
- Upload multiple images per banquet
- Publish/unpublish banquets
- Filter banquets by location
- Real-time dashboard with statistics

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Plain CSS (no frameworks)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage for images
- **Build Tool**: Vite
- **Icons**: Lucide React

## Project Structure

```
project/
├── src/
│   ├── components/
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Header.css
│   │   ├── BanquetForm.tsx     # Add/Edit banquet modal
│   │   └── BanquetForm.css
│   ├── context/
│   │   └── AuthContext.tsx     # Authentication state management
│   ├── lib/
│   │   └── supabase.ts         # Supabase client & types
│   ├── pages/
│   │   ├── Home.tsx            # Homepage with locations
│   │   ├── Home.css
│   │   ├── LocationDetail.tsx  # Banquet listing page
│   │   ├── LocationDetail.css
│   │   ├── Admin.tsx           # Admin dashboard
│   │   ├── Admin.css
│   │   ├── Login.tsx           # Login page
│   │   ├── Signup.tsx          # Signup page
│   │   └── Auth.css
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # App entry point
│   └── index.css               # Global styles
├── .env                        # Environment variables
└── package.json
```

## Database Schema

### Banquets Table
- `id` - UUID primary key
- `name` - Banquet hall name
- `description` - Detailed description
- `price` - Price in INR
- `location` - City (restricted to 8 locations)
- `images` - Array of image URLs
- `published` - Boolean visibility flag
- `user_id` - Reference to authenticated user
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Storage
- Bucket: `banquet-images` (public)
- Path structure: `{user_id}/{timestamp}_{filename}`

## Setup Instructions

### Prerequisites
- Node.js 16+ installed
- Supabase account (already configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Database is already set up with:
   - Banquets table with RLS policies
   - Storage bucket for images
   - Proper indexes for performance

### Running the Application

Development mode (auto-reload):
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Usage Guide

### For Regular Users

1. **Browse Locations**: Visit the homepage to see all 8 available cities
2. **View Banquets**: Click on any city to see up to 5 published banquet halls
3. **Send Query**: Click "Send Query" button to open WhatsApp with a pre-filled message

### For Administrators

1. **Sign Up**: Create an account using email and password
2. **Sign In**: Log in to access the admin dashboard
3. **Add Banquet**:
   - Click "Add Banquet" button
   - Fill in name, location, price, and description
   - Upload one or more images
   - Check "Publish" to make it visible to users
   - Click "Create Banquet"
4. **Edit Banquet**: Click the edit icon on any banquet row
5. **Delete Banquet**: Click the delete icon (confirmation required)
6. **Publish/Unpublish**: Click the eye icon to toggle visibility
7. **Filter**: Use the location dropdown to filter your banquets

## Available Locations

- Delhi
- Mumbai
- Indore
- Lucknow
- Noida
- Gurgaon
- Banaras
- Ahmedabad

## Security Features

- Row Level Security (RLS) enabled on all tables
- Users can only manage their own banquets
- Public users can only view published banquets
- Secure image uploads with user-specific folders
- JWT-based authentication
- Password validation (minimum 6 characters)

## API Features

All database operations are handled through Supabase's auto-generated REST API:
- GET published banquets by location (limited to 5)
- POST new banquets (authenticated)
- PUT update banquets (authenticated, owner only)
- DELETE banquets (authenticated, owner only)
- File upload to Supabase Storage

## Responsive Design

The application is fully responsive with breakpoints for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## Image Handling

- Multiple images per banquet
- Image preview before upload
- Automatic resize and optimization
- Stored in Supabase Storage
- Public URLs generated automatically
- First image shown as thumbnail

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

- Lazy loading of images
- Efficient database queries with indexes
- Limited results per query (5 banquets max)
- Optimized bundle size with Vite
- CSS animations with hardware acceleration

## License

MIT License - feel free to use this project for learning or commercial purposes.
