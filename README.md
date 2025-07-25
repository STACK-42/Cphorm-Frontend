# Cphorm Frontend

Frontend repo for Cphorm Project

---

## Features

- Doctor dashboard with sidebar navigation
- Patient management (add, view, manage patients)
- Dynamic form builder for custom medical forms
- Data insights and analytics ("Explore Data")
- Responsive, modern UI with custom branding

---

## 🛠 Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

---

## ⚡️ Getting Started

1. **Clone the repository:**

   ```sh
   git clone https://github.com/STACK-42/cphorm-web-bloom.git
   cd cphorm-web-bloom
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Start the development server:**
   ```sh
   npm run dev
   ```
   - Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 📁 Project Structure

```
cphorm-web-bloom/
├── public/                # Static assets (favicon, robots.txt, etc.)
├── src/
│   ├── assets/            # Images, logos, profile pictures
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Main app pages (Dashboard, Patients, ManageForms, etc.)
│   ├── App.tsx            # App entry (routing)
│   └── main.tsx           # React root
├── tailwind.config.ts     # Tailwind CSS config
├── package.json           # Project metadata & scripts
└── README.md              # This file
```