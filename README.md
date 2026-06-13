# 🚀 Career Insight Labs - AI Resume Optimizer

A premium, 100% client-side ATS-friendly resume builder and AI optimizer. Built with React 19, TypeScript, and Vite, this tool allows job seekers to parse their existing resumes, inject target Job Description (JD) keywords, and re-write their experience bullets using flagship LLMs—all without sacrificing their privacy to a backend database.

## ✨ Key Features

- **100% Privacy-First (Zero Data Retention)**: Your personal data never touches our servers. All document parsing and AI generation happen securely within your browser.
- **BYOK (Bring Your Own Key) Ecosystem**: Natively connects to 14+ leading 2026 LLM providers directly from the client. Supports OpenAI, Anthropic, Google Gemini, DeepSeek-V4, Qwen3.7, GLM-5, Groq, and more via dynamic BaseURLs.
- **Local Document Parsing**: Uses `pdfjs-dist` and `mammoth` to extract raw text from PDF and DOCX files instantly in the browser.
- **ATS-Optimized Elite Templates**: Ships with 3 premium, recruiter-approved templates (*Silicon Valley*, *Ivy League*, and *Modern Minimalist*) designed specifically to parse perfectly in Applicant Tracking Systems.
- **AI Resume Optimizer**: Automatically restructures experience bullets into the STAR format (Situation, Task, Action, Result) and semantically injects keywords from your target Job Description.
- **Pixel-Perfect PDF Export**: Features an advanced CSS `@media print` engine with a bulletproof `Table Thead/Tfoot` wrapper pattern to guarantee perfect multi-page pagination and margins without browser-injected metadata.
- **SEO-Optimized Blog System**: Includes a built-in markdown-based blogging system with multimedia embedding to drive long-tail organic traffic.

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Vanilla CSS (Custom Design System, Premium Minimalist Aesthetic)
- **Routing**: React Router DOM
- **AI Integration**: Official OpenAI Node SDK (`dangerouslyAllowBrowser: true` for BYOK)
- **Document Processing**: `pdfjs-dist` (PDF), `mammoth` (DOCX)
- **Export**: Native Browser Print (PDF), `docx` & `file-saver` (Word Export)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-resume-builder-saas.git
   cd ai-resume-builder-saas
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

## 💡 How to Use

1. **Configure BYOK**: Click on the ⚙️ Settings icon in the app. Select your preferred LLM provider, enter the BaseURL (if using an OpenAI-compatible proxy), and paste your API Key.
2. **Import Resume**: Go to the "Import" tab and upload your existing PDF or Word resume. The app will extract the raw text locally.
3. **AI Optimization**: Paste the Job Description you are targeting and hit the **AI Resume Optimizer** button. The app will map your experience to the JD and generate high-impact bullets.
4. **Customize**: Tweak your personal info, skills, and education manually if needed. Switch between different elite themes to match your industry.
5. **Export**: Hit the **PDF** button to natively print a perfectly paginated, metadata-free resume.

## 🚧 Roadmap
 
 - [ ] Connect repository to Vercel/Netlify for public edge hosting.
 - [x] **Serverless Backend (Contact Form)**: Implement Vercel Serverless Functions (`/api/contact.ts`) to securely process form submissions via the Resend API without exposing credentials on the client.
 - [ ] **Backend Decision (Free Tries)**: Finalize whether the 3 "Free Tries" remain a local mock or transition to a real serverless backend to allow actual AI calls for free users.
 - [ ] Polish the mobile responsiveness of the App Tool editor layout.
 - [ ] Introduce a real-time ATS keyword matching score.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/ai-resume-builder-saas/issues).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
