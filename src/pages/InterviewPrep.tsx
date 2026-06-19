// In src/pages/InterviewPrep.tsx
import React, { useState, useRef } from 'react';
import { SEO } from '../components/SEO';
import OpenAI from 'openai';
import { Upload, X, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const InterviewPrep: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [generatedGuide, setGeneratedGuide] = useState('');
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      e.target.value = '';
    } catch (error) {
      console.error("Error parsing file:", error);
      alert("Failed to parse file. Please paste text directly.");
      setFileName('');
      e.target.value = '';
    }
  };

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
      prompt += `\n### JD Clarification & Expert Guidance (HIGH PRIORITY)\nThe user is confused about the following terms/points from the JD: "${confusedPoints}".\nPlease use your vast training data to act as an authoritative expert. Dedicate the FIRST section of the guide (titled "JD Deep Dive & Clarification") to explain these exact points in simple, actionable terms.\n`;
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
    } catch (error) {
      console.error("AI Generation Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`Generation failed: ${errorMessage}`);
      setStep(1);
    }
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
            <label htmlFor="resume-text" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>1. Upload Resume (PDF/Word)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label className="btn-cohere" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Upload size={18} /> Upload File
                <input ref={fileInputRef} type="file" accept=".pdf,.docx" style={{ display: 'none' }} onChange={handleFileUpload} />
              </label>
              {fileName ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#64748b' }}>{fileName}</span>
                  <button 
                    onClick={() => {
                      setFileName('');
                      setResumeText('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.2rem' }}
                    title="Remove file"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <span style={{ color: '#64748b' }}>No file selected</span>
              )}
            </div>
            <textarea 
              id="resume-text"
              placeholder="Or paste your resume text here..." 
              value={resumeText} 
              onChange={(e) => setResumeText(e.target.value)}
              style={{ width: '100%', minHeight: '100px', marginTop: '1rem', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="jd-text" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>2. Paste Job Description (JD)</label>
            <textarea 
              id="jd-text"
              placeholder="Paste the full job description here..." 
              value={jdText} 
              onChange={(e) => setJdText(e.target.value)}
              style={{ width: '100%', minHeight: '150px', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="confused-points" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>3. Confusing JD Points (Optional)</label>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>Not sure what "Kubernetes orchestration" means in the JD? Paste those confusing points here and our AI expert will explain them.</p>
            <textarea 
              id="confused-points"
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

      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', animation: 'fadeIn 0.5s' }}>
          <Loader2 size={48} className="animate-spin" style={{ color: 'var(--primary-color)', marginBottom: '1rem' }} />
          <h2 style={{ color: '#1e293b' }}>Crafting Your Survival Guide...</h2>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Our AI expert is analyzing your resume against the JD.</p>
        </div>
      )}
      {step === 3 && (
        <div className="wizard-step" style={{ animation: 'fadeIn 0.5s', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#1e293b', margin: 0 }}>Your Interview Survival Guide</h2>
            <button 
              className="btn-cohere" 
              onClick={() => {
                setStep(1);
                setGeneratedGuide('');
                setResumeText('');
                setJdText('');
                setConfusedPoints('');
                setFileName('');
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '4px', background: 'transparent', cursor: 'pointer' }}
            >
              Start Over
            </button>
          </div>

          <div className="markdown-body blog-markdown" style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {generatedGuide}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPrep;
