# ResumeAI - Career Optimizer

AI-powered resume analyzer that provides match scores, skill gap analysis, and role-specific improvements using Gemini 3 Flash.

## 🚀 Local Setup

To run this application on your computer, follow these steps:

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

### 2. Installation
1. Download the project as a ZIP from AI Studio Build (Settings > Export > Download as ZIP) and extract it.
2. Open your terminal and navigate to the project folder.
3. Install the dependencies:
   ```bash
   npm install
   ```

### 3. Configuration
1. Create a file named `.env` in the root directory.
2. Copy the contents from `.env.example` into your new `.env` file.
3. Add your Gemini API key to the `GEMINI_API_KEY` field:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### 4. Running the App
Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

## 📂 Project Structure
- `src/App.tsx`: Main frontend application.
- `server.ts`: Express backend that handles the Gemini API calls.
- `vite.config.ts`: Frontend build configuration.

## 🛠️ Built With
- **Frontend**: React, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express.
- **AI**: Google Gemini 3 Flash.

## 🚀 Publishing to GitHub
1. Create a new repository on [GitHub](https://github.com/new).
2. Initialize git in your local project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```
