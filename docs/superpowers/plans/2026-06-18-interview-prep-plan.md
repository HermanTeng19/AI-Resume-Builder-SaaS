# Interview Prep Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a multi-step BYOK AI tool that takes a resume, JD, and optional confusing points to generate a targeted interview prep guide.

**Architecture:** A new routed page (`InterviewPrep.tsx`) containing a 3-step wizard (Form -> Loading -> Markdown Results). Uses existing `openai` SDK with `localStorage` config.

**Tech Stack:** React 19, TypeScript, React Router, OpenAI SDK, pdfjs-dist, mammoth, ReactMarkdown.

---

### Task 1: Route Setup and Basic Component

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/layouts/MainLayout.tsx`
- Create: `src/pages/InterviewPrep.tsx`

- [ ] **Step 1: Create the basic component wrapper**

```tsx
// src/pages/InterviewPrep.tsx
import React, { useState } from 'react';
import { SEO } from '../components/SEO';

const InterviewPrep: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <SEO 
        title="AI Interview Prep Guide | Career Insight Labs"
        description="Generate a highly targeted interview preparation guide based on your resume and job description."
        url="https://careerinsightlabs.com/interview-prep"
      />
      
      {step === 1 && <h2>Step 1: Configuration</h2>}
      {step === 2 && <h2>Generating...</h2>}
      {step === 3 && <h2>Results</h2>}
    </div>
  );
};

export default InterviewPrep;
```

- [ ] **Step 2: Add route to App.tsx**

```tsx
// In src/App.tsx
import InterviewPrep from './pages/InterviewPrep';

// Inside the Routes block, add:
<Route path="interview-prep" element={<InterviewPrep />} />
```

- [ ] **Step 3: Add link to Navbar**

```tsx
// In src/layouts/MainLayout.tsx
// Find the <div className={`navbar-links`}> section and add this next to the Free Resume Optimizer CTA:

<Link to="/interview-prep" className="nav-cta" style={{ background: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)' }} onClick={scrollToTop}>
  Interview Prep
</Link>
```

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/layouts/MainLayout.tsx src/pages/InterviewPrep.tsx
git commit -m "feat: setup routing and basic component for Interview Prep"
```

### Task 2: Build the Wizard UI (Step 1)

**Files:**
- Modify: `src/pages/InterviewPrep.tsx`

- [ ] **Step 1: Add State and Form UI**

```tsx
// In src/pages/InterviewPrep.tsx
import React, { useState } from 'react';
import { SEO } from '../components/SEO';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';

const InterviewPrep: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [confusedPoints, setConfusedPoints] = useState('');
  const [modules, setModules] = useState({
    core: true,
    deepDive: true,
    behavioral: true,
    technical: false
  });
  const [fileName, setFileName] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    
    try {
      if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ arrayBuffer });
        setResumeText(result.value);
      } else if (file.name.endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: any) => item.str).join(' ') + '\n';
        }
        setResumeText(text);
      }
    } catch (error) {
      console.error("Error parsing file:", error);
      alert("Failed to parse file. Please paste text directly.");
    }
  };

  const handleGenerate = () => {
    if (!resumeText || !jdText) {
      alert("Please provide both Resume and Job Description.");
      return;
    }
    setStep(2);
    // AI call will go here
  };

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <SEO 
        title="AI Interview Prep Guide | Career Insight Labs"
        description="Generate a highly targeted interview preparation guide based on your resume and job description."
        url="https://careerinsightlabs.com/interview-prep"
      />
      
      {step === 1 && (
        <div className="wizard-step" style={{ animation: 'fadeInUp 0.5s ease-out' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#1e293b' }}>Generate Your Interview Survival Guide</h1>
          
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>1. Upload Resume (PDF/Word)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label className="btn-cohere" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Upload size={18} /> Upload File
                <input type="file" accept=".pdf,.docx" style={{ display: 'none' }} onChange={handleFileUpload} />
              </label>
              <span style={{ color: '#64748b' }}>{fileName || "No file selected"}</span>
            </div>
            {!fileName && (
              <textarea 
                placeholder="Or paste your resume text here..." 
                value={resumeText} 
                onChange={(e) => setResumeText(e.target.value)}
                style={{ width: '100%', minHeight: '100px', marginTop: '1rem', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
              />
            )}
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>2. Paste Job Description (JD)</label>
            <textarea 
              placeholder="Paste the full job description here..." 
              value={jdText} 
              onChange={(e) => setJdText(e.target.value)}
              style={{ width: '100%', minHeight: '150px', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>3. Confusing JD Points (Optional)</label>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>Not sure what "Kubernetes orchestration" means in the JD? Paste those confusing points here and our AI expert will explain them.</p>
            <textarea 
              placeholder="e.g., Cross-functional agile matrix, B2B SaaS GTM strategies..." 
              value={confusedPoints} 
              onChange={(e) => setConfusedPoints(e.target.value)}
              style={{ width: '100%', minHeight: '80px', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '1rem' }}>4. Select Modules</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={modules.core} onChange={(e) => setModules({...modules, core: e.target.checked})} />
                Core Competency Breakdown
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={modules.deepDive} onChange={(e) => setModules({...modules, deepDive: e.target.checked})} />
                Resume Deep-Dive & Trap Questions
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={modules.behavioral} onChange={(e) => setModules({...modules, behavioral: e.target.checked})} />
                Behavioral Questions (STAR format)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={modules.technical} onChange={(e) => setModules({...modules, technical: e.target.checked})} />
                Technical / Domain Specific Questions
              </label>
            </div>
          </div>

          <button className="btn-cohere" style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' }} onClick={handleGenerate}>
            Generate Interview Guide
          </button>
        </div>
      )}

      {step === 2 && <h2>Generating...</h2>}
      {step === 3 && <h2>Results</h2>}
    </div>
  );
};

export default InterviewPrep;
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/InterviewPrep.tsx
git commit -m "feat: build form UI for Interview Prep"
```

### Task 3: Build the BYOK Integration (Step 2)

**Files:**
- Modify: `src/pages/InterviewPrep.tsx`

- [ ] **Step 1: Add AI Generation Logic**

```tsx
// At the top of InterviewPrep.tsx, add:
import OpenAI from 'openai';
import { Loader2 } from 'lucide-react';

// Inside InterviewPrep component, add state:
const [generatedGuide, setGeneratedGuide] = useState('');

// Replace handleGenerate and add generateGuide:
const handleGenerate = () => {
  if (!resumeText || !jdText) {
    alert("Please provide both Resume and Job Description.");
    return;
  }
  setStep(2);
  generateGuide();
};

const generateGuide = async () => {
  const apiKey = localStorage.getItem('LLM_API_KEY');
  const baseURL = localStorage.getItem('LLM_BASE_URL') || 'https://api.openai.com/v1';
  const modelName = localStorage.getItem('LLM_MODEL_NAME') || 'gpt-4o-mini';

  if (!apiKey) {
    alert("Please configure your API Key in the Settings first.");
    setStep(1);
    return;
  }

  const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: baseURL,
    dangerouslyAllowBrowser: true
  });

  let prompt = `You are an elite FAANG-level executive recruiter and technical interviewer. Generate a highly targeted interview preparation guide formatted purely in Markdown.

### Resume Context:
${resumeText}

### Job Description Context:
${jdText}
`;

  if (confusedPoints) {
    prompt += `\n### JD Clarification & Expert Guidance (HIGH PRIORITY)
The user is confused about the following terms/points from the JD: "${confusedPoints}".
Please use your vast training data to act as an authoritative expert. Dedicate the FIRST section of the guide (titled "JD Deep Dive & Clarification") to explain these exact points in simple, actionable terms.\n`;
  }

  prompt += `\nPlease include the following sections based on user request:\n`;
  if (modules.core) prompt += `- Core Competency Breakdown: Analyze what the JD is really asking for.\n`;
  if (modules.deepDive) prompt += `- Resume Deep-Dive & Trap Questions: Look at the user's resume, find weaknesses or areas the interviewer will likely grill them on, and suggest how to pivot.\n`;
  if (modules.behavioral) prompt += `- Behavioral Questions (STAR): 3 likely behavioral questions with advice on structuring a STAR response based on their resume.\n`;
  if (modules.technical) prompt += `- Technical/Domain Specific: 3-5 likely hard-skills questions.\n`;

  prompt += `\nMake the tone encouraging but highly professional. Output ONLY Markdown.`;

  try {
    const response = await openai.chat.completions.create({
      model: modelName,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });
    
    const content = response.choices[0]?.message?.content || 'No content generated.';
    setGeneratedGuide(content);
    setStep(3);
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    alert(`Generation failed: ${error.message}`);
    setStep(1);
  }
};
```

- [ ] **Step 2: Update Step 2 UI Rendering**

```tsx
// Replace `{step === 2 && <h2>Generating...</h2>}` with:

{step === 2 && (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', animation: 'fadeIn 0.5s' }}>
    <Loader2 size={48} className="lucide-spin" style={{ color: 'var(--primary-color)', marginBottom: '1rem' }} />
    <h2 style={{ color: '#1e293b' }}>Crafting Your Survival Guide...</h2>
    <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Our AI expert is analyzing your resume against the JD.</p>
  </div>
)}
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/InterviewPrep.tsx
git commit -m "feat: implement BYOK AI generation logic for Interview Prep"
```

### Task 4: Build Results View (Step 3)

**Files:**
- Modify: `src/pages/InterviewPrep.tsx`

- [ ] **Step 1: Add Markdown Import and UI**

```tsx
// At the top of InterviewPrep.tsx, add:
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Replace `{step === 3 && <h2>Results</h2>}` with:

{step === 3 && (
  <div style={{ animation: 'fadeInUp 0.5s ease-out' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
      <h2 style={{ color: '#1e293b', margin: 0 }}>Your Interview Guide</h2>
      <button className="btn-cohere" onClick={() => setStep(1)} style={{ background: 'transparent', color: 'var(--primary-color)', border: '1px solid var(--primary-color)' }}>
        Modify & Regenerate
      </button>
    </div>
    
    <div className="markdown-body blog-markdown" style={{ background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {generatedGuide}
      </ReactMarkdown>
    </div>
  </div>
)}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/InterviewPrep.tsx
git commit -m "feat: implement markdown results view for Interview Prep"
```

### Task 5: Verify & Add Styling Tweaks
Since we reused `.btn-cohere`, `.markdown-body`, and `.blog-markdown`, the styling will mostly be perfect out of the box. Ensure the global app runs and compiles successfully.

- [ ] **Step 1: Build Check**

Run: `npm run build`
Expected: Successful build with no TS errors.

- [ ] **Step 2: Commit**

```bash
git commit --allow-empty -m "chore: verify interview prep build"
```
