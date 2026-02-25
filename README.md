# Codewars Leaderboard

A dynamic web application that allows users to compare Codewars rankings across different programming languages. This project fetches real-time data from the [Codewars API](https://dev.codewars.com/) and provides a filterable, sorted leaderboard.

## 🚀 Live Demo
**https://cyf-codewars-leaderboard-iswat.netlify.app/**

## ✨ Features
- **Batch User Search:** Accepts a comma-separated list of Codewars usernames.
- **Dynamic Leaderboard:** Displays Username, Clan, and Score in a sorted table (highest to lowest).
- **Language Filtering:** Automatically detects all languages the searched users have ranks in and allows the user to filter the leaderboard by specific languages.
- **Winner Celebration:** Visually highlights the top-ranked user with a 🏆 trophy icon and a gold background.
- **Robust Error Handling:** 
    - Identifies and notifies the user of invalid usernames (404 errors).
    - Detects and reports network connectivity issues.
- **100% Accessible:** Built with a focus on accessibility, achieving a perfect score of 100 in Chrome Lighthouse.

## 🛠️ Technologies Used
- **HTML5:** Semantic structure and use of `<template>` tags for efficient DOM rendering.
- **CSS3:** Responsive layout with a focus on high color contrast and touch-target accessibility.
- **Vanilla JavaScript (ES Modules):** Organized into `api.mjs` (Logic) and `script.mjs` (UI/Interaction).
- **Node.js Native Test Runner:** Used for automated unit testing.
- **Nock & Chai:** Libraries used to mock API calls and perform assertions.

## 📦 Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the project locally:**
   Since this project uses ES Modules, it must be viewed via a local server.
   - Using VS Code: Right-click `index.html` and select **"Open with Live Server"**.
   - Using Terminal: Run `npx http-serve`

## 🧪 Testing

This project includes automated unit tests for non-trivial logic, such as data sanitization, API handling, and the sorting/filtering of leaderboard data.

To run the tests:
```bash
npm test
```

For a detailed breakdown of how each project requirement was tested, please refer to [TESTING.md](./TESTING.md).

## 📝 Project Structure
- `index.html`: The main user interface.
- `style.css`: All styling, including accessibility optimizations.
- `api.mjs`: Core logic functions (API fetching, data processing, input cleaning).
- `script.mjs`: UI orchestration, event listeners, and DOM updates.
- `api.test.mjs`: Automated test suite.
- `package.json`: Project metadata and test configuration.
- `package-lock.json`: Dependency lock file for reproducible installs.
