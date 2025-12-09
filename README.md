# ticktock - Timesheet Management Application

A modern SaaS-style timesheet management application built with Next.js 15, TypeScript, and TailwindCSS.

## Features

- Authentication with next-auth
-  Dashboard with timesheet management
-  Add/Edit/Delete timesheet entries
-  Filter status
-  Pagination support
-  Form validation with Formik & Yup

## Tech Stack

- Next.js 15, TypeScript, TailwindCSS
- shadcn/ui, Formik, Yup, dayjs
- next-auth (JWT strategy)


### Note
- Calender filter is not working well, So i have to skip its stale logic
- Didn't have much time to write test cases. So I unit tested and patched most of the edge case for this test.

### Time Spent
- 24 hrs

## Getting Started

### Prerequisites


### Installation

1. Install dependencies:
```bash
npm install
```


2. Run dev server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Usage

### Login Credentials

- Email: `john.doe@example.com` / Password: `password123`
- Email: `jane.smith@example.com` / Password: `password123`

### Dashboard

- View timesheets in table format
- Filter by date range and status (Completed, Incomplete, Missing)
- Use pagination to navigate
- Click View/Update/Create to manage entries

### Timesheet Entries

- **View**: View entries for completed timesheets
- **Update**: Add/modify entries for incomplete timesheets
- **Create**: Add entries for missing timesheets

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # Next-auth configuration
│   │   └── timesheets/             # Timesheet API routes
│   ├── dashboard/                  # Dashboard pages & layout
│   │   └── timesheets/[id]/        # Timesheet entries page
│   ├── login/                      # Login page
│   └── layout.tsx                  # Root layout
├── components/
│   ├── dashboard/                  # Dashboard components
│   ├── forms/                      # Form components
│   ├── providers/                  # Session provider
│   ├── timesheets/                 # Timesheet components
│   └── ui/                         # shadcn/ui components
├── lib/
│   ├── mock-data.ts                # Mock users, timesheets, projects
│   ├── schemas.ts                  # Form validation schemas (Yup)
│   ├── url-params.ts               # URL parameter helpers
│   └── utils.ts                    # Utility functions (date formatting, etc.)
└── types/
    └── next-auth.d.ts              # Next-auth type definitions
```

## Lib Directory

The `lib/` directory contains shared utilities and helpers:

- **`mock-data.ts`**: Mock data for users, timesheets, projects, and work types
- **`schemas.ts`**: Yup validation schemas (login, entry forms)
- **`url-params.ts`**: Helper functions for managing URL search parameters
- **`utils.ts`**: Utility functions (date formatting, status badge classes, etc.)

## API Routes

- `GET /api/timesheets` - Get timesheets (with filters & pagination)
- `GET /api/timesheets/[id]` - Get specific timesheet
- `GET /api/timesheets/[id]/entries` - Get entries
- `POST /api/timesheets/[id]/entries` - Create entry
- `PUT /api/timesheets/[id]/entries/[entryId]` - Update entry
- `DELETE /api/timesheets/[id]/entries/[entryId]` - Delete entry

## Status Definitions

- **COMPLETED**: 40 hours logged
- **INCOMPLETE**: Less than 40 hours logged
- **MISSING**: No hours logged

## Build

```bash
npm run build
npm start
```

## License

© 2024 tentwenty. All rights reserved.
