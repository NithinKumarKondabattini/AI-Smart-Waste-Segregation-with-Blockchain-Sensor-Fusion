# AI Smart Waste Segregation with Blockchain Sensor Fusion

This project is a Smart Waste Management Dashboard website with a React frontend and a Node.js/Express backend.

## Modules

- `client`: responsive dashboard UI, user interaction page, analytics panels, and CSV export
- `server`: MongoDB-backed authentication API using bcrypt password verification and JWT session handling

## Main Features

- User interaction page for QR or user ID, waste type, weight, area, and optional image input
- Automatic redirect from data entry to the main dashboard
- Real-time styled dashboard with waste category cards, locality analytics, live feed, and performance tables
- Sidebar navigation with working actions and smooth section scrolling
- MongoDB login flow with protected routes

## Run Locally

1. Install dependencies from the root:
```bash
npm install
npm run install-all
```

2. Create `server/.env` from `server/.env.example`

3. Start backend:
```bash
cd server
npm run dev
```

4. Start frontend:
```bash
cd client
npm run dev
```

5. Open `http://localhost:5173`
