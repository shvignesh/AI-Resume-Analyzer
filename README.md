# ResumeAI - Career Optimizer

AI-powered resume analyzer that provides match scores, skill gap analysis, and role-specific improvements using Gemini 3 Flash.

## 📸 Screenshots

### 1. Landing Page
![Landing Page](public/screenshots/landing.png)
*The main interface of ResumeAI, designed for a seamless user experience.*

### 2. Upload & Analyze
![Upload Section](public/screenshots/upload.png)
*Easily upload your resume and paste the job description for instant analysis.*

### 3. Analysis Summary
![Analysis Summary](public/screenshots/summary.png)
*Get a comprehensive match score and quality rating for your profile.*

### 4. Role-Specific Improvements
![Improvements](public/screenshots/improvements.png)
*Actionable tips tailored to the specific job role you're targeting.*

### 5. Skills Gap Analysis
![Skills Analysis](public/screenshots/skills.png)
*Identify matched and missing skills to bridge the gap.*

### 6. ATS Compatibility & Keywords
![ATS and Keywords](public/screenshots/ats_keywords.png)
*Ensure your resume is ATS-friendly and contains the right keywords.*

## ⚙️ Working Process

1.  **Upload Resume**: Start by uploading your resume in PDF, TXT, DOC, or DOCX format.
2.  **Paste Job Description**: Provide the full job listing you are aiming for.
3.  **AI Analysis**: Our Gemini-powered engine analyzes your resume against the job requirements.
4.  **Review Insights**: Get detailed feedback on match percentage, skill gaps, and ATS compatibility.
5.  **Iterate**: Use the suggestions to refine your resume and re-analyze for a better score.

## 🎯 Key Uses

*   **Resume Optimization**: Tailor your resume to specific job descriptions effectively.
*   **Skill Gap Identification**: Know exactly what skills you're missing for a target role.
*   **ATS Optimization**: Improve your chances of passing through automated screening systems.
*   **Career Guidance**: Get professional-grade suggestions on how to quantify your impact.

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
