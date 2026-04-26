# 📸 IG Transparency Dashboard

An interactive dashboard to analyze your Instagram data export. Understand how Meta profiles you, track your digital footprint, and audit your social relationships—all locally and privately.

![Local Analysis Only](https://img.shields.io/badge/Privacy-Local%20Only-green?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js%2014-black?style=for-the-badge&logo=next.js)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-blue?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- **📢 Ads Profiling**: Discover what categories Meta has assigned to you and which advertisers are targeting your profile.
- **👣 Digital Footprint**: Analyze your login history (IPs, devices, browsers) and the link history of websites you've visited via the Instagram browser.
- **👥 Social Audit**: 
  - Identify mutual followers.
  - Detect "Fans" (people who follow you, but you don't follow back).
  - List "Not Follow Back" (people you follow, but they don't follow you).
  - **🤖 Bot Detection**: Heuristic-based detection of suspicious/bot-like accounts in your following list.
- **🧭 File GPS**: Integrated guide to help you find the correct JSON files within your Meta data export.

## 🛡️ Privacy First

This application is built with privacy as a core value:
- **No Data Uploads**: Your JSON files are processed entirely in your browser using client-side JavaScript.
- **Local Analysis**: No data is sent to any server. Your sensitive information stays on your machine.
- **Safe Commits**: The project is pre-configured to ignore all data files via `.gitignore`.

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/RozyBrt/ig-transparency-dashboard.git
cd ig-transparency-dashboard
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 How to Export Your Data

1. Go to Instagram **Settings** > **Accounts Center** > **Your information and permissions** > **Download your information**.
2. Select **Download or transfer information**.
3. Choose **Some of your information**.
4. Select the following categories:
   - **Ads information**
   - **Logged information**
   - **Connections (Followers and Following)**
5. Choose **JSON** as the format and set the media quality to **Low** (since we only need text data).
6. Once ready, download and extract the ZIP file.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Components**: [Shadcn UI](https://ui.shadcn.com/)

---
Built with ❤️ for Data Transparency.
