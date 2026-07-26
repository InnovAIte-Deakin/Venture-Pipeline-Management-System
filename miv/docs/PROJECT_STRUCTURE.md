# MIV Platform - Project Structure

## 📁 **Organized File Structure**

```
miv/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 api/                      # API Routes
│   │   ├── 📁 ai/                   # AI Services
│   │   │   ├── analyze-venture/
│   │   │   └── gedsi-insights/
│   │   ├── 📁 analytics/            # Analytics API
│   │   ├── 📁 auth/                 # Authentication
│   │   │   └── [...nextauth]/
│   │   ├── 📁 gedsi-metrics/        # GEDSI Metrics API
│   │   └── 📁 ventures/             # Ventures API
│   │       └── [id]/
│   │           └── gedsi/
│   ├── 📁 dashboard/                # Main Dashboard
│   │   ├── 📁 capital-facilitation/ # Capital Management
│   │   ├── 📁 diagnostics/          # Venture Diagnostics
│   │   ├── 📁 gedsi-tracker/        # GEDSI Tracking
│   │   ├── 📁 impact-reports/       # Impact Reporting
│   │   ├── 📁 performance-analytics/# Performance Analytics
│   │   ├── 📁 system-settings/      # System Configuration
│   │   ├── 📁 team-management/      # Team Management
│   │   ├── 📁 venture-intake/       # Venture Intake
│   │   ├── layout.tsx               # Dashboard Layout
│   │   └── page.tsx                 # Dashboard Home
│   ├── favicon.ico                  # App Icon
│   ├── globals.css                  # Global Styles
│   ├── layout.tsx                   # Root Layout
│   └── page.tsx                     # Home Page (Redirects to Dashboard)
│
├── 📁 components/                   # React Components
│   ├── 📁 enterprise/               # Enterprise Components
│   │   ├── advanced-data-table.tsx  # Advanced Data Table
│   │   ├── advanced-filters.tsx     # Advanced Filters
│   │   ├── analytics-dashboard.tsx  # Analytics Dashboard
│   │   └── notification-center.tsx  # Notification Center
│   ├── 📁 ui/                       # UI Components (shadcn/ui)
│   │   ├── alert.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── chart.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   └── toast.tsx
│   ├── document-manager.tsx         # Document Management
│   ├── gedsi-tracker.tsx            # GEDSI Tracking
│   ├── sidebar.tsx                  # Navigation Sidebar
│   ├── theme-provider.tsx           # Theme Provider
│   └── venture-intake-form.tsx      # Venture Intake Form
│
├── 📁 docs/                         # Documentation
│   ├── CURRENT_STATE_ASSESSMENT.md  # Current State Analysis
│   ├── ENTERPRISE_ARCHITECTURE.md   # Enterprise Architecture
│   ├── IMPLEMENTATION_GUIDE.md      # Implementation Guide
│   ├── MIGRATION_STRATEGY.md        # Migration Strategy
│   ├── SECURITY_PRIVACY_CHECKLIST.md# Security & Privacy
│   ├── UX_FLOWCHART_STRUCTURE.md    # UX Design & User Flows
│   └── WIREFRAMES_UX_GUIDE.md       # Visual Design & Wireframes
│
├── 📁 lib/                          # Utility Libraries
│   ├── ai-services.ts               # AI Service Integration
│   ├── iris-metrics.ts              # IRIS+ Metrics
│   ├── prisma.ts                    # Database Client
│   └── utils.ts                     # Utility Functions
│
├── 📁 prisma/                       # Database
│   ├── dev.db                       # SQLite Database (Dev)
│   ├── schema.prisma                # Database Schema
│   └── seed.ts                      # Database Seeding
│
├── .gitignore                       # Git Ignore Rules
├── components.json                  # shadcn/ui Configuration
├── eslint.config.mjs               # ESLint Configuration
├── next-env.d.ts                   # Next.js Types
├── next.config.ts                  # Next.js Configuration
├── package.json                    # Dependencies & Scripts
├── package-lock.json               # Locked Dependencies
├── postcss.config.mjs              # PostCSS Configuration
├── README.md                       # Project Documentation
├── tailwind.config.ts              # Tailwind CSS Configuration
└── tsconfig.json                   # TypeScript Configuration
```

## 🗑️ **Removed Files & Directories**

### **Development/Testing Files:**
- `test-ai.js` - Standalone AI test script
- `app/test/` - Development testing page
- `app/simple-test/` - Development demo page
- `app/navigation/` - Development navigation hub
- `scripts/` - Development setup scripts

### **Marketing Pages (Not Integrated):**
- `app/about/` - Standalone about page
- `app/contact/` - Standalone contact page

### **Build Artifacts:**
- `.next/` - Next.js build cache
- `tsconfig.tsbuildinfo` - TypeScript build cache

## 🎯 **Current Application Structure**

### **Core Application Flow:**
1. **Entry Point**: `/` → Redirects to `/dashboard`
2. **Main Dashboard**: `/dashboard` - Enterprise dashboard with analytics
3. **Venture Management**: `/dashboard/venture-intake` - Venture intake form
4. **GEDSI Tracking**: `/dashboard/gedsi-tracker` - GEDSI metrics tracking
5. **Capital Facilitation**: `/dashboard/capital-facilitation` - Capital management
6. **Analytics**: `/dashboard/performance-analytics` - Performance analytics
7. **Team Management**: `/dashboard/team-management` - Team management
8. **System Settings**: `/dashboard/system-settings` - System configuration

### **API Structure:**
- **Ventures**: `/api/ventures` - Venture CRUD operations
- **GEDSI Metrics**: `/api/gedsi-metrics` - GEDSI metrics management
- **AI Services**: `/api/ai/*` - AI-powered analysis
- **Analytics**: `/api/analytics` - Analytics data
- **Authentication**: `/api/auth/*` - NextAuth.js authentication

## 📊 **File Count Summary**

- **Total Files**: ~150 files
- **Source Code**: ~80 files
- **Documentation**: 7 files
- **Configuration**: 8 files
- **Dependencies**: 1 file (package-lock.json)

## ✅ **Benefits of Organization**

1. **Clean Structure**: Removed all development/testing artifacts
2. **Focused Codebase**: Only production-ready code remains
3. **Clear Navigation**: Streamlined app structure
4. **Reduced Complexity**: Eliminated unused routes and components
5. **Better Maintenance**: Easier to understand and maintain
6. **Faster Builds**: Removed build cache and artifacts

## 🚀 **Next Steps**

The project is now organized and ready for:
1. **Database Migration**: SQLite → PostgreSQL
2. **Docker Setup**: Containerization
3. **API Gateway**: Service layer implementation
4. **Testing Setup**: Unit and integration tests
5. **Production Deployment**: Kubernetes setup

All unnecessary files have been removed, and the codebase is now focused on the core MIV platform functionality. 
