# 🌿 EWIT Hackathon Management Platform
### *National Level 24-Hour Hackathon Digital Ecosystem (Theme: Earth & Innovation)*

An enterprise-grade, paperless, and secure role-based platform designed for **East West Institute of Technology (EWIT)**. This application manages the entire lifecycle of a national hackathon—from participant registrations, team formation, and sandbox payments to real camera QR pass check-ins, meal coupon redemptions, judge scorecards, and administrative overrides.

---

## 🌟 Key Features

### 🚀 1. Participant Workspace
* **Team Builder**: Form or join teams (2-4 members) using unique secure group codes.
* **Team Lock**: Enforce finalized compositions.
* **Sandbox Payments**: Built-in mock payment sandbox verifying registration fees.
* **Digital QR Pass**: Real-time generated QR passes carrying participant profiles.
* **Coupon Checklist**: Live tracking of Breakfast, Lunch, and Dinner coupon statuses (Unused, Redeemed).
* **Project Submission Desk**: Lock and submit project title, descriptions, GitHub repository, and slide decks.

### ⚖️ 2. Judge Evaluation Portal
* **Assigned Queue**: Grid overview of assigned team profiles.
* **Interactive Scorecard**: Numeric grading across four parameters:
  1. *Innovation & Design*
  2. *Technical Complexity*
  3. *Impact & Relevance*
  4. *Presentation Quality*
* **Submission Locking**: Securely submit scorecards to prevent changes after locking.

### 🎟️ 3. Coordinator Operations Desk
* **Camera QR Scanner**: Active device camera scanning (via `html5-qrcode`) to instantly verify participant entry.
* **Check-In Logger**: Mark attendee gate entry in one click.
* **Paperless Coupons**: Redeem Breakfast, Lunch, and Dinner coupons (states transition from Unused ➔ Redeemed ➔ Locked).
* **Infrastructure Helpdesk**: Log Wi-Fi, power, or refreshment issues to the main administrative desk.

### 🎓 4. HOD Dashboard
* **Lock Overrides**: Bypass team composition locks for academic corrections.
* **Live Rankings**: Sort and filter leaderboard standings dynamically from database score tallies.
* **Announcements**: Publish notices to target student dashboards.
* **Report Compiler**: Compile and download `.csv` reports of registrations and judging matrices.
* **Super Admin Audit Exclusions**: Audit logs query excludes Super Admin actions to maintain system override confidentiality.

### 👑 5. Tech Head Portal (Super Admin)
* **Super Admin Operations**: Run system diagnostics, take Postgres backups, and generate batch certificates.
* **Score Overrides**: Adjust and edit team marks directly, bypassing judge scorecard locks.
* **Live Audit Logs**: Monitor all coordinator and administrator actions in real-time.

---

## 🛠️ Technology Stack
* **Frontend**: Next.js 14 (App Router, Custom Glassmorphic CSS Variables Design System)
* **Backend**: FastAPI (Python REST API, Uvicorn)
* **Database**: PostgreSQL (SQLAlchemy ORM, auto-schema creation, SQLite fallback)
* **QR Scanning**: `html5-qrcode` camera scanning integration
* **Containerization**: Docker & Docker Compose

---

## 📦 Monorepo Structure

```
d:/code/HACKATHON/
├── backend/
│   ├── app/
│   │   ├── api/             # REST endpoint routers
│   │   ├── core/            # Config settings, security, DB setup
│   │   ├── models/          # SQLAlchemy database models
│   │   ├── schemas/         # Pydantic schemas validation
│   │   └── main.py          # FastAPI server entry point
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Backend container build instructions
├── frontend/
│   ├── src/
│   │   └── app/             # Next.js pages and style modules
│   ├── package.json         # Node packages
│   └── Dockerfile           # Frontend container build instructions
├── docker-compose.yml       # Orchestrates frontend, backend, & database
└── README.md                # Project documentation
```

---

## 🐳 Deployment Instructions

Ensure you have **Docker** and **Docker Compose** installed, then run the orchestrator:

```bash
# Clone the repository and execute from the root directory:
docker-compose up --build
```

This starts the following services:
1. **PostgreSQL Database** at port `5432`
2. **FastAPI Backend Server** at port `8000` (automatically creates tables and seeds super-user accounts)
3. **Next.js Frontend Client** at port `3000`

---

## ⚙️ Development & Testing Credentials

Use these credentials to log in and inspect the platform's superuser dashboard:

* **Role**: Tech Head (Super Admin)
* **Email**: `echoplayzop@gmail.com`
* **Password**: `8520147963`

*Other roles (HOD, Judge, Coordinator, Participant) can be selected interactively on the `/login` page via the **Developer Quick Access** panel.*

---

## 📄 Shared Database Synchronization
All scoring cards, average ranks, leaderboards, and overrides share the same storage state. Any override performed by the Tech Head immediately updates HOD Standings and Judge scoreboards in real-time, matching database-driven applications behavior.
