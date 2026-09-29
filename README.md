# BN STORE - Luxury Cosmetics E-Commerce Frontend

A modern, responsive luxury e-commerce frontend for a cosmetics and beauty brand built with Next.js 14, Tailwind CSS, and Lucide React icons.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Typography**: Playfair Display (Serif) + Inter (Sans-Serif)
- **Language**: TypeScript

## Design System

### Color Palette
- **Primary**: Vibrant Pink/Rose Gold (`#E63974`, `#D81B60`)
- **Background**: Deep Burgundy/Black (`#0D0D0D` to `#1A050A`)
- **Light**: Cream White (`#F9F9F9`)
- **Accent**: Gold (`#D4A574`)

### Typography
- **Headers**: Playfair Display (elegant serif)
- **Body**: Inter (clean sans-serif)

## Components

### Layout
- `TopBar` - Announcement bar + Header with navigation, search, user icons
- `FooterBar` - Value propositions + branding
- `FullFooter` - Extended footer with navigation links

### Sections
- `HeroCarousel` - Auto-playing carousel with navigation arrows and dots
- `CategoryCircleGrid` - 7 circular category cards with hover effects
- `BestSellers` - Product grid + promotional feature card

### UI Components
- `Button` - Multiple variants (primary, secondary, ghost, outline) and sizes
- `Card` - Composable card components (Header, Content, Footer)
- `Input` / `Textarea` / `Select` - Form components with validation
- `Badge` - Status badges with variants
- `Icon` - Lucide React wrapper

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles + Tailwind imports
│   ├── layout.tsx           # Root layout with fonts & metadata
│   └── page.tsx             # Home page composition
├── components/
│   ├── layout/
│   │   ├── TopBar.tsx       # Announcement + Header
│   │   └── Footer.tsx       # Footer variations
│   ├── sections/
│   │   ├── HeroCarousel.tsx # Hero banner carousel
│   │   ├── CategoryCircleGrid.tsx
│   │   └── BestSellers.tsx  # Products + promo card
│   └── ui/                  # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Badge.tsx
│       ├── Icon.tsx
│       └── index.ts
└── lib/
    └── utils.ts             # Utility functions (cn, formatPrice, etc.)
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Features

- ✅ Fully responsive (mobile-first)
- ✅ Accessible (ARIA labels, semantic HTML, focus states)
- ✅ Smooth animations with reduced-motion support
- ✅ Custom design system with design tokens
- ✅ Auto-playing hero carousel with keyboard navigation
- ✅ Hover/touch interactions on all interactive elements
- ✅ SEO optimized with metadata
- ✅ Performance optimized (lazy loading, font optimization)

## Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## License

MIT