import React, { useState, useEffect } from 'react';
import OpenAI from 'openai';
import { Upload, FileText, User, Briefcase, GraduationCap, Code, Sparkles, Eye, EyeOff, Key, Trash2, CheckCircle2, XCircle, Settings, Server, ChevronDown, Download } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { parseResumeContent } from '../utils/parser';
import { generateSuggestions } from '../utils/openai';
import { jsPDF } from 'jspdf';
import { SEO } from '../components/SEO';
import { generateParsePrompt, generateOptimizeBulletsPrompt, generateTailorSkillsPrompt, generateOptimizeSummaryPrompt } from '../lib/prompts';

// --- Types ---
interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
}

interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string;
}

// --- Default Data ---
const initialData: ResumeData = {
  personalInfo: {
    fullName: 'Jane Doe',
    jobTitle: 'Senior Data Engineer',
    email: 'jane.doe@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/janedoe',
    summary: 'Data Engineer with 5+ years of experience building scalable ETL pipelines and optimizing cloud data warehouses.',
  },
  experience: [
    {
      id: '1',
      company: 'Tech Corp',
      role: 'Data Engineer',
      startDate: '2022-01',
      endDate: 'Present',
      description: '- Responsible for building data pipelines using Spark and Airflow\n- Worked with Snowflake and Kafka for data processing\n- Used Python and SQL for ETL tasks\n- Collaborated with cross-functional teams',
    }
  ],
  education: [
    {
      id: '1',
      school: 'University of California, Berkeley',
      degree: 'B.S. in Computer Science',
      year: '2021',
    }
  ],
  skills: 'Python, SQL, AWS, Snowflake, Apache Airflow, dbt, Docker, Kubernetes',
};

type TabType = 'import' | 'personal' | 'experience' | 'education' | 'skills';

type ProviderName = 'openai' | 'anthropic' | 'gemini' | 'groq' | 'openrouter' | 'deepseek' | 'siliconflow' | 'qwen' | 'glm' | 'kimi' | 'doubao' | 'minimax' | 'ollama' | 'custom';

const PROVIDERS: Record<ProviderName, { name: string, urlPlaceholder: string, description: string, logoUrl: string | null }> = {
  openai: { name: 'OpenAI', urlPlaceholder: 'https://api.openai.com/v1', description: 'GPT-5.5 Instant, GPT-5.4', logoUrl: 'https://models.dev/logos/openai.svg' },
  anthropic: { name: 'Anthropic', urlPlaceholder: 'https://api.anthropic.com/v1', description: 'Claude Opus 4.8, Sonnet 4.6', logoUrl: 'https://models.dev/logos/anthropic.svg' },
  gemini: { name: 'Google Gemini', urlPlaceholder: 'https://generativelanguage.googleapis.com/v1beta/openai/', description: 'Gemini 3.5 Pro, Flash', logoUrl: 'https://models.dev/logos/gemini.svg' },
  groq: { name: 'Groq', urlPlaceholder: 'https://api.groq.com/openai/v1', description: 'Llama 4, Qwen3.7, GPT-OSS', logoUrl: 'https://models.dev/logos/groq.svg' },
  openrouter: { name: 'OpenRouter', urlPlaceholder: 'https://openrouter.ai/api/v1', description: 'API Aggregator for all models', logoUrl: 'https://models.dev/logos/openrouter.svg' },
  deepseek: { name: 'DeepSeek', urlPlaceholder: 'https://api.deepseek.com/v1', description: 'DeepSeek-V4-Pro, V4-Flash', logoUrl: 'https://models.dev/logos/deepseek.svg' },
  siliconflow: { name: 'SiliconFlow', urlPlaceholder: 'https://api.siliconflow.cn/v1', description: 'High-speed API Aggregator', logoUrl: null },
  qwen: { name: 'Qwen (Alibaba)', urlPlaceholder: 'https://dashscope.aliyuncs.com/compatible-mode/v1', description: 'Qwen3.7-Max, Qwen3.7-Plus', logoUrl: 'https://models.dev/logos/qwen.svg' },
  glm: { name: 'Zhipu (GLM)', urlPlaceholder: 'https://open.bigmodel.cn/api/paas/v4/', description: 'GLM-5, GLM-5-Turbo', logoUrl: 'https://models.dev/logos/zhipu.svg' },
  kimi: { name: 'Moonshot (Kimi)', urlPlaceholder: 'https://api.moonshot.cn/v1', description: 'Kimi K2.6', logoUrl: 'https://models.dev/logos/moonshot.svg' },
  doubao: { name: 'Doubao (ByteDance)', urlPlaceholder: 'https://ark.cn-beijing.volces.com/api/v3', description: 'Seed 2.0 Pro, Lite', logoUrl: null },
  minimax: { name: 'MiniMax', urlPlaceholder: 'https://api.minimax.chat/v1', description: 'MiniMax M3', logoUrl: null },
  ollama: { name: 'Ollama (Local)', urlPlaceholder: 'http://localhost:11434/v1', description: 'Local models', logoUrl: null },
  custom: { name: 'Custom Endpoint', urlPlaceholder: 'https://api.yourdomain.com/v1', description: 'Any OpenAI-compatible API', logoUrl: null },
};

const DEFAULT_MODELS: Record<ProviderName, string> = {
  openai: 'gpt-4o-mini',
  anthropic: 'claude-3-5-sonnet-20240620',
  gemini: 'gemini-1.5-flash',
  groq: 'llama3-8b-8192',
  openrouter: 'openai/gpt-4o-mini',
  deepseek: 'deepseek-chat',
  siliconflow: 'Qwen/Qwen2.5-7B-Instruct',
  qwen: 'qwen-turbo',
  glm: 'glm-4-flash',
  kimi: 'moonshot-v1-8k',
  doubao: 'doubao-lite-4k', 
  minimax: 'abab6.5s-chat',
  ollama: 'llama3',
  custom: 'gpt-4o-mini'
};

const Home: React.FC = () => {
  const [activeProvider, setActiveProvider] = useState<ProviderName>('openai');
  const [keys, setKeys] = useState<Record<ProviderName, { apiKey: string, baseUrl: string }>>({
    openai: { apiKey: '', baseUrl: '' },
    anthropic: { apiKey: '', baseUrl: '' },
    gemini: { apiKey: '', baseUrl: '' },
    groq: { apiKey: '', baseUrl: '' },
    openrouter: { apiKey: '', baseUrl: '' },
    deepseek: { apiKey: '', baseUrl: '' },
    siliconflow: { apiKey: '', baseUrl: '' },
    qwen: { apiKey: '', baseUrl: '' },
    glm: { apiKey: '', baseUrl: '' },
    kimi: { apiKey: '', baseUrl: '' },
    doubao: { apiKey: '', baseUrl: '' },
    minimax: { apiKey: '', baseUrl: '' },
    ollama: { apiKey: '', baseUrl: '' },
    custom: { apiKey: '', baseUrl: '' }
  });
  
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProviderSelectOpen, setIsProviderSelectOpen] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [activeTab, setActiveTab] = useState<TabType>('import');
  const [resumeTheme, setResumeTheme] = useState<'silicon' | 'ivy' | 'modern'>('silicon');
  const [isGenerating, setIsGenerating] = useState(false);
  const [targetJD, setTargetJD] = useState('');
  
  // Import State
  const [rawText, setRawText] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // BYOK Logic
  useEffect(() => {
    const loadedKeys = { ...keys };
    let hasLoaded = false;
    (Object.keys(PROVIDERS) as ProviderName[]).forEach(provider => {
      const storedKey = localStorage.getItem(`ai_key_${provider}`);
      const storedUrl = localStorage.getItem(`ai_url_${provider}`);
      if (storedKey || storedUrl) {
        loadedKeys[provider] = { apiKey: storedKey || '', baseUrl: storedUrl || '' };
        hasLoaded = true;
      }
    });
    if (hasLoaded) setKeys(loadedKeys);
    
    const lastProvider = localStorage.getItem('ai_last_provider') as ProviderName;
    if (lastProvider && PROVIDERS[lastProvider]) {
      setActiveProvider(lastProvider);
    }
  }, []);

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setKeys(prev => ({ ...prev, [activeProvider]: { ...prev[activeProvider], apiKey: newKey } }));
    localStorage.setItem(`ai_key_${activeProvider}`, newKey);
    setTestStatus('idle');
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setKeys(prev => ({ ...prev, [activeProvider]: { ...prev[activeProvider], baseUrl: newUrl } }));
    localStorage.setItem(`ai_url_${activeProvider}`, newUrl);
    setTestStatus('idle');
  };

  const handleProviderSelect = (provider: ProviderName) => {
    setActiveProvider(provider);
    setIsProviderSelectOpen(false);
    setTestStatus('idle');
    localStorage.setItem('ai_last_provider', provider);
  };

  const clearProvider = () => {
    setKeys(prev => ({ ...prev, [activeProvider]: { apiKey: '', baseUrl: '' } }));
    localStorage.removeItem(`ai_key_${activeProvider}`);
    localStorage.removeItem(`ai_url_${activeProvider}`);
    setTestStatus('idle');
  };

  const testConnection = async () => {
    const currentCreds = keys[activeProvider];
    if (!currentCreds.apiKey) return;
    setTestStatus('testing');
    try {
      // Basic ping test via OpenAI client structure (most proxies support models endpoint)
      // Note: In a full app, you'd want provider-specific test logic for Anthropic.
      const openai = new OpenAI({
        apiKey: currentCreds.apiKey,
        baseURL: currentCreds.baseUrl || PROVIDERS[activeProvider].urlPlaceholder,
        dangerouslyAllowBrowser: true
      });
      await openai.models.list();
      setTestStatus('success');
      setTimeout(() => setTestStatus('idle'), 3000);
    } catch (err) {
      setTestStatus('error');
    }
  };

  // --- Handlers for Data Updates ---
  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | ((prev: string) => string)) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id === id) {
          const newValue = typeof value === 'function' ? value(exp[field] as string) : value;
          return { ...exp, [field]: newValue };
        }
        return exp;
      })
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { id: Date.now().toString(), company: '', role: '', startDate: '', endDate: '', description: '' }]
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({ ...prev, experience: prev.experience.filter(exp => exp.id !== id) }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { id: Date.now().toString(), school: '', degree: '', year: '' }]
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({ ...prev, education: prev.education.filter(edu => edu.id !== id) }));
  };

  // --- AI API LOGIC ---
  const getOpenAIClient = (): OpenAI | null => {
    const currentCreds = keys[activeProvider];
    if (currentCreds.apiKey) {
      return new OpenAI({
        apiKey: currentCreds.apiKey,
        baseURL: currentCreds.baseUrl || PROVIDERS[activeProvider].urlPlaceholder,
        dangerouslyAllowBrowser: true
      });
    }

    alert(`Please click the Gear icon ⚙️ to bring your own key (BYOK) for unlimited usage.`);
    setIsSettingsOpen(true);
    return null;
  };

  const DEMO_TEMPLATES = [
    {
      title: "Senior Product Manager",
      data: {
        personalInfo: { fullName: "Alex Chen", jobTitle: "Senior Product Manager", email: "alex.chen@example.com", phone: "(555) 019-2834", location: "New York, NY", linkedin: "linkedin.com/in/alexchen", summary: "Data-driven Senior Product Manager with 7+ years of experience leading cross-functional teams to deliver high-impact B2B SaaS solutions. Proven track record of increasing user retention by 40% and driving $5M+ in ARR." },
        experience: [
          { id: '1', company: 'Acme Software', role: 'Senior Product Manager', startDate: '2021', endDate: 'Present', description: '- Spearheaded the launch of a new AI-powered analytics dashboard, increasing daily active users by 35%.\n- Orchestrated a team of 15 engineers and designers through 12 successful sprint cycles.\n- Conducted 50+ user interviews to redefine product roadmap and prioritize key features.' },
          { id: '2', company: 'TechStart Inc.', role: 'Product Manager', startDate: '2018', endDate: '2021', description: '- Directed the transition to an agile framework, reducing time-to-market for core features by 25%.\n- Grew product revenue by $2M year-over-year through strategic pricing optimization.' }
        ],
        education: [{ id: '1', school: 'New York University', degree: 'MBA', year: '2018' }, { id: '2', school: 'Cornell University', degree: 'B.S. Computer Science', year: '2014' }],
        skills: "Product Strategy, Agile/Scrum, User Discovery, SQL, Jira, Mixpanel, A/B Testing"
      }
    },
    {
      title: "Frontend Engineer",
      data: {
        personalInfo: { fullName: "Sarah Jenkins", jobTitle: "Lead Frontend Engineer", email: "sarah.j@example.com", phone: "(555) 234-5678", location: "San Francisco, CA", linkedin: "linkedin.com/in/sarahjenkins", summary: "UI-focused Lead Frontend Engineer specializing in React and Next.js. Passionate about web accessibility, performance optimization, and building highly scalable design systems used by millions." },
        experience: [
          { id: '1', company: 'FinTech Solutions', role: 'Lead Frontend Engineer', startDate: '2020', endDate: 'Present', description: '- Architected a micro-frontend architecture using Webpack Module Federation, cutting build times by 50%.\n- Mentored 6 junior developers and established code review guidelines.\n- Migrated a legacy monolithic dashboard to React 18, improving Lighthouse scores from 65 to 98.' },
          { id: '2', company: 'Creative Agency', role: 'Web Developer', startDate: '2017', endDate: '2020', description: '- Engineered highly interactive marketing landing pages using Three.js and GSAP.\n- Integrated headless CMS solutions (Sanity) reducing content update overhead by 40%.' }
        ],
        education: [{ id: '1', school: 'University of Washington', degree: 'B.S. Informatics', year: '2017' }],
        skills: "React, TypeScript, Next.js, Redux, Tailwind CSS, GraphQL, Jest, Cypress"
      }
    },
    {
      title: "Data Analyst",
      data: {
        personalInfo: { fullName: "David Park", jobTitle: "Data Analyst", email: "david.park@example.com", phone: "(555) 987-6543", location: "Chicago, IL", linkedin: "linkedin.com/in/davidpark", summary: "Detail-oriented Data Analyst skilled in transforming complex datasets into actionable business intelligence. Expertise in SQL, Tableau, and Python data pipelines." },
        experience: [
          { id: '1', company: 'Global Retail Corp', role: 'Senior Data Analyst', startDate: '2021', endDate: 'Present', description: '- Designed automated Tableau dashboards tracking $50M+ in inventory across 300 stores.\n- Optimized complex SQL queries, reducing report generation time from 2 hours to 5 minutes.\n- Partnered with marketing to identify customer churn patterns, saving an estimated $1M annually.' },
          { id: '2', company: 'Startup Analytics', role: 'Data Analyst', startDate: '2019', endDate: '2021', description: '- Cleaned and processed 500GB+ of raw user event data using Python and Pandas.\n- Built predictive models for user engagement using Scikit-Learn.' }
        ],
        education: [{ id: '1', school: 'University of Illinois', degree: 'M.S. Data Science', year: '2019' }],
        skills: "Python, SQL, Tableau, Power BI, Pandas, Scikit-Learn, Snowflake, dbt"
      }
    }
  ];

  const parseResumeWithAI = async () => {
    if (!rawText.trim()) {
      alert("Please paste your resume text first.");
      return;
    }
    const client = getOpenAIClient();
    if (!client) return;

    setIsGenerating(true);
    
    const openai = client;
    const prompt = generateParsePrompt(rawText, targetJD);

    try {
      const response = await openai.chat.completions.create({
        model: DEFAULT_MODELS[activeProvider] || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
      });

      const jsonStr = response.choices[0].message.content?.trim();
      if (jsonStr) {
        let cleanedStr = jsonStr;
        const jsonMatch = cleanedStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
        if (jsonMatch) {
          cleanedStr = jsonMatch[1].trim();
        } else {
          const start = cleanedStr.indexOf('{');
          const end = cleanedStr.lastIndexOf('}');
          if (start !== -1 && end !== -1 && start < end) {
            cleanedStr = cleanedStr.substring(start, end + 1);
          }
        }
        const parsed = JSON.parse(cleanedStr);
        
        const experienceWithIds = (parsed.experience || []).map((e: any) => ({ ...e, id: Math.random().toString() }));
        const educationWithIds = (parsed.education || []).map((e: any) => ({ ...e, id: Math.random().toString() }));
        
        setResumeData({
          personalInfo: { ...initialData.personalInfo, ...parsed.personalInfo },
          experience: experienceWithIds,
          education: educationWithIds,
          skills: parsed.skills || '',
        });
        
        alert("Resume successfully parsed and populated!");
        setActiveTab('personal');
      }
    } catch (err: any) {
      alert("Error parsing resume: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const optimizeBullets = async (expId: string) => {
    const client = getOpenAIClient();
    if (!client) return;

    const exp = resumeData.experience.find(e => e.id === expId);
    if (!exp) return;

    setIsGenerating(true);
    
    const openai = client;
    const prompt = generateOptimizeBulletsPrompt(
      exp.description, 
      resumeData.personalInfo.jobTitle, 
      exp.company, 
      exp.role, 
      targetJD
    );

    try {
      const stream = await openai.chat.completions.create({
        model: DEFAULT_MODELS[activeProvider] || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      });

      updateExperience(expId, 'description', '');
      let fullResponse = '';
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullResponse += content;
        updateExperience(expId, 'description', fullResponse);
      }
    } catch (err: any) {
      alert("Error generating content: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const tailorSkills = async () => {
    const client = getOpenAIClient();
    if (!client) return;

    setIsGenerating(true);
    
    const openai = client;
    const prompt = generateTailorSkillsPrompt(
      resumeData.skills, 
      resumeData.personalInfo.jobTitle, 
      targetJD
    );

    try {
      const stream = await openai.chat.completions.create({
        model: DEFAULT_MODELS[activeProvider] || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      });

      setResumeData(prev => ({ ...prev, skills: '' }));

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        setResumeData(prev => ({ ...prev, skills: prev.skills + content }));
      }
    } catch (error) {
      console.error(error);
      alert("Failed to tailor skills. Check console.");
    } finally {
      setIsGenerating(false);
    }
  };

  const optimizeSummary = async () => {
    if (!resumeData.personalInfo.summary.trim()) {
      alert("Please write a brief summary first, or parse a resume.");
      return;
    }

    const client = getOpenAIClient();
    if (!client) return;
    
    const openai = client;
    const prompt = generateOptimizeSummaryPrompt(
      resumeData.personalInfo.summary, 
      resumeData.personalInfo.jobTitle, 
      targetJD
    );

    try {
      const stream = await openai.chat.completions.create({
        model: DEFAULT_MODELS[activeProvider] || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      });

      setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, summary: '' } }));

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        setResumeData(prev => ({ 
          ...prev, 
          personalInfo: { ...prev.personalInfo, summary: prev.personalInfo.summary + content } 
        }));
      }
    } catch (error) {
      console.error(error);
      alert("Failed to optimize summary. Check console.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const fileType = file.name.split('.').pop()?.toLowerCase();
    
    try {
      if (fileType === 'txt') {
        const reader = new FileReader();
        reader.onload = (event) => {
          setRawText(event.target?.result as string);
          setIsUploading(false);
        };
        reader.readAsText(file);
      } else if (fileType === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ arrayBuffer });
        setRawText(result.value);
        setIsUploading(false);
      } else if (fileType === 'pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          text += strings.join(' ') + '\n';
        }
        setRawText(text);
        setIsUploading(false);
      } else {
        alert("Unsupported file format. Please upload .txt, .pdf, or .docx");
        setIsUploading(false);
      }
    } catch (err) {
      console.error("Error parsing file:", err);
      alert("Failed to read the file. It might be corrupted or in an unsupported format.");
      setIsUploading(false);
    }
    
    // Clear input so same file can be uploaded again if needed
    e.target.value = '';
  };

  // --- UI Components ---
  const renderTabButton = (type: TabType, label: string, icon: React.ReactNode) => (
    <button 
      onClick={() => setActiveTab(type)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.3rem',
        padding: '0.6rem 0.5rem',
        flex: 1,
        border: 'none',
        borderBottom: activeTab === type ? '3px solid var(--primary-color)' : '3px solid transparent',
        backgroundColor: 'transparent',
        color: activeTab === type ? 'var(--primary-color)' : '#64748b',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 'bold',
        transition: 'all 0.2s ease'
      }}
    >
      {icon}
      <span style={{ display: 'none', '@media(min-width: 768px)': { display: 'inline' } } as any}>{label}</span>
    </button>
  );

  // --- EXPORT LOGIC ---
  const exportToPDF = () => {
    window.print();
  };

  const exportToWord = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: resumeData.personalInfo.fullName || 'YOUR NAME',
            heading: HeadingLevel.HEADING_1,
            alignment: "center"
          }),
          new Paragraph({
            text: [
              resumeData.personalInfo.email,
              resumeData.personalInfo.phone,
              resumeData.personalInfo.location,
              resumeData.personalInfo.linkedin
            ].filter(Boolean).join(" | "),
            alignment: "center"
          }),
          new Paragraph({ text: "" }), // Spacing
          ...(resumeData.personalInfo.summary ? [
            new Paragraph({ text: "Professional Summary", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: resumeData.personalInfo.summary }),
            new Paragraph({ text: "" })
          ] : []),
          ...(resumeData.skills ? [
            new Paragraph({ text: "Technical Skills", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: resumeData.skills }),
            new Paragraph({ text: "" })
          ] : []),
          ...(resumeData.experience.length > 0 ? [
            new Paragraph({ text: "Professional Experience", heading: HeadingLevel.HEADING_2 }),
            ...resumeData.experience.flatMap(exp => [
              new Paragraph({
                children: [
                  new TextRun({ text: exp.company, bold: true }),
                  new TextRun({ text: `\t${exp.startDate} - ${exp.endDate || 'Present'}` })
                ]
              }),
              new Paragraph({
                children: [new TextRun({ text: exp.role, italics: true })]
              }),
              ...exp.description.split('\n').filter(b => b.trim()).map(bullet => 
                new Paragraph({ text: bullet.replace(/^- /, ''), bullet: { level: 0 } })
              ),
              new Paragraph({ text: "" })
            ])
          ] : []),
          ...(resumeData.education.length > 0 ? [
            new Paragraph({ text: "Education", heading: HeadingLevel.HEADING_2 }),
            ...resumeData.education.flatMap(edu => [
              new Paragraph({
                children: [
                  new TextRun({ text: edu.school, bold: true }),
                  new TextRun({ text: `\t${edu.year}` })
                ]
              }),
              new Paragraph({ text: edu.degree }),
              new Paragraph({ text: "" })
            ])
          ] : [])
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${(resumeData.personalInfo.fullName || 'resume').replace(/\s+/g, '_')}_Resume.docx`);
  };

  return (
    <>
      <SEO 
        title="Free AI Resume Optimizer | Career Insight Labs"
        description="Upload your resume, enter a target job, and let our AI optimize your resume to beat the ATS and get you hired."
        url="https://careerinsightlabs.com/app"
      />
      <div className="tool-wrapper" style={{ height: 'calc(100vh - 73px)', overflowY: 'auto' }}>
      <div className="tool-container" style={{ height: 'calc(100vh - 73px)', flexShrink: 0 }}>
      {/* LEFT SIDEBAR: EDITOR */}
      <aside className="tool-sidebar" style={{ width: '500px', flexShrink: 0, position: 'relative' }}>
        <div className="settings-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', letterSpacing: '-0.5px', margin: 0 }}>Resume Optimizer</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

            <button 
              onClick={() => setIsSettingsOpen(true)}
              style={{ 
                background: 'transparent', 
                border: '1px solid var(--border-color)', 
                borderRadius: '8px', 
                padding: '8px', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--ink)',
                transition: 'all 0.2s'
              }}
              title="Model & BYOK Settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* SETTINGS MODAL OVERLAY */}
        {isSettingsOpen && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'var(--bg-color)', 
              borderRadius: '16px', 
              width: '100%', 
              maxWidth: '560px',
              border: '1px solid var(--card-border)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              animation: 'fadeInUp 0.3s ease-out'
            }}>
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Server size={20} color="var(--primary-color)" />
                  AI Model Configuration
                </h3>
                <button onClick={() => setIsSettingsOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <XCircle size={20} />
                </button>
              </div>

              {/* Modal Body: PROFESSIONAL BYOK COMPONENT */}
              <div style={{ padding: '1.5rem' }}>
                <div style={{ border: '1px solid var(--card-border)', borderRadius: '12px', padding: '1.5rem', backgroundColor: 'var(--bg-color)' }}>
                  
                  {/* Provider Header with Dropdown */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
                      
                      <div style={{ position: 'relative' }}>
                        <button 
                          onClick={() => setIsProviderSelectOpen(!isProviderSelectOpen)}
                          style={{ 
                            background: 'var(--surface-color)', 
                            border: '1px solid var(--border-color)', 
                            borderRadius: '8px', 
                            padding: '8px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            minWidth: '200px'
                          }}
                        >
                          {PROVIDERS[activeProvider].logoUrl ? (
                            <img src={PROVIDERS[activeProvider].logoUrl!} alt="" style={{ width: '16px', height: '16px' }} />
                          ) : (
                            <Server size={16} color="var(--text-muted)" />
                          )}
                          <span style={{ fontWeight: 500, flex: 1, textAlign: 'left' }}>{PROVIDERS[activeProvider].name}</span>
                          <ChevronDown size={16} color="var(--text-muted)" />
                        </button>

                        {/* Dropdown Menu */}
                        {isProviderSelectOpen && (
                          <div style={{ 
                            position: 'absolute', top: 'calc(100% + 4px)', left: 0, 
                            background: 'var(--bg-color)', border: '1px solid var(--card-border)', 
                            borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
                            width: '260px', maxHeight: '400px', overflowY: 'auto', zIndex: 10
                          }}>
                            {(Object.keys(PROVIDERS) as ProviderName[]).map(p => (
                              <button 
                                key={p} 
                                onClick={() => handleProviderSelect(p)}
                                style={{ 
                                  width: '100%', textAlign: 'left', padding: '10px 12px', 
                                  background: activeProvider === p ? 'var(--surface-color)' : 'transparent',
                                  border: 'none', borderBottom: '1px solid var(--border-color)', 
                                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' 
                                }}
                              >
                                {PROVIDERS[p].logoUrl ? (
                                  <img src={PROVIDERS[p].logoUrl!} alt="" style={{ width: '16px', height: '16px', flexShrink: 0 }} 
                                    onError={(e) => {
                                      // Fallback to Server icon if img fails to load
                                      e.currentTarget.style.display = 'none';
                                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                      if (fallback) fallback.style.display = 'block';
                                    }}
                                  />
                                ) : null}
                                <div style={{ display: PROVIDERS[p].logoUrl ? 'none' : 'block' }}>
                                  <Server size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                  <span style={{ fontWeight: 500, fontSize: '13px', color: 'var(--ink)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{PROVIDERS[p].name}</span>
                                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{PROVIDERS[p].description}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <span style={{ fontSize: '12px', color: keys[activeProvider].apiKey ? '#10b981' : 'var(--text-muted)' }}>
                          {keys[activeProvider].apiKey ? 'Credentials active' : 'Configuration required'}
                        </span>
                      </div>
                    </div>

                    <button onClick={clearProvider} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', alignSelf: 'center' }}>
                      <Trash2 size={14} /> Clear
                    </button>
                  </div>

                  {/* Configuration Body */}
                  <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                      <Settings size={12} /> {PROVIDERS[activeProvider].name} Configuration
                    </div>

                    {/* API Key */}
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                      <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Key size={14} color="var(--text-muted)" /> API Key
                      </label>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                          <input 
                            type={showKey ? "text" : "password"}
                            value={keys[activeProvider].apiKey} 
                            onChange={handleKeyChange} 
                            placeholder="sk-..."
                            style={{ fontSize: '13px', width: '100%', paddingRight: '40px', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px 12px' }}
                          />
                          <button 
                            onClick={() => setShowKey(!showKey)}
                            style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                          >
                            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        <button 
                          onClick={testConnection}
                          disabled={!keys[activeProvider].apiKey || testStatus === 'testing'}
                          style={{ padding: '8px 16px', backgroundColor: 'var(--soft-stone)', color: 'var(--ink)', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: keys[activeProvider].apiKey ? 'pointer' : 'not-allowed', opacity: keys[activeProvider].apiKey ? 1 : 0.5, display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          {testStatus === 'testing' && <span className="spinner" style={{ width: '14px', height: '14px', border: '2px solid var(--text-muted)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>}
                          {testStatus === 'success' && <CheckCircle2 size={14} color="#10b981" />}
                          {testStatus === 'error' && <XCircle size={14} color="#ef4444" />}
                          {testStatus === 'idle' && 'Test'}
                        </button>
                      </div>
                    </div>

                    {/* Base URL */}
                    <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                      <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Server size={14} color="var(--text-muted)" /> Base URL <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
                      </label>
                      <input 
                        type="text" 
                        value={keys[activeProvider].baseUrl} 
                        onChange={handleUrlChange} 
                        placeholder={PROVIDERS[activeProvider].urlPlaceholder}
                        style={{ fontSize: '13px', width: '100%', marginTop: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px 12px' }}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px' }}>
                    <Key size={12} /> API keys are strictly stored locally in your browser
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}} />
        
        {/* Form Navigation Tabs */}
        <div style={{ display: 'flex', marginTop: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          {renderTabButton('import', 'Import', <FileText size={18} />)}
          {renderTabButton('personal', 'Profile', <User size={18} />)}
          {renderTabButton('skills', 'Skills', <Code size={18} />)}
          {renderTabButton('experience', 'Experience', <Briefcase size={18} />)}
          {renderTabButton('education', 'Education', <GraduationCap size={18} />)}
        </div>

        {/* TAB CONTENTS */}
        <div className="form-contents" style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
          
          {activeTab === 'import' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #bbf7d0', color: '#166534' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 8px 0', fontSize: '14px' }}><CheckCircle2 size={16} /> Two Ways to Build</h4>
                <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5' }}>
                  <strong>1. Basic Formatting:</strong> Manually type your info into the tabs above. The right panel will instantly render a perfectly formatted resume template.<br/>
                  <strong>2. Advanced AI:</strong> Paste your old resume below and let our AI automatically extract, format, and optimize it for ATS algorithms.
                </p>
              </div>

              <div style={{ backgroundColor: '#eff6ff', padding: '1rem', borderRadius: '8px', color: '#1e3a8a', fontSize: '13px' }}>
                <strong>🚀 Fast Start:</strong> Import your existing resume and let AI auto-fill the structured editor.
              </div>
              
              <div className="form-group" style={{ position: 'relative' }}>
                <label>Paste your existing resume (Raw Text / LinkedIn copy-paste)</label>
                <textarea 
                  rows={10} 
                  value={rawText} 
                  onChange={e => setRawText(e.target.value)} 
                  placeholder="Paste your resume content here..."
                  style={{ fontFamily: 'monospace', fontSize: '12px' }}
                />
              </div>

              <div style={{ textAlign: 'center', color: '#64748b', fontSize: '12px', fontWeight: 'bold' }}>OR</div>

              <div className="form-group">
                <label>Upload File (.txt, .pdf, .docx)</label>
                <div style={{ border: '1px dashed var(--border-color)', padding: '2rem', textAlign: 'center', borderRadius: '8px', backgroundColor: '#fafafa', position: 'relative' }}>
                  {isUploading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <span className="spinner" style={{ width: '24px', height: '24px', border: '3px solid #cbd5e1', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                      <span style={{ fontSize: '13px', color: 'var(--primary-color)', fontWeight: 500 }}>Extracting text...</span>
                    </div>
                  ) : (
                    <>
                      <Upload size={24} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
                      <div>
                        <input type="file" accept=".txt,.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileUpload} style={{ fontSize: '12px' }} />
                      </div>
                      <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '0.5rem' }}>Browser-native parsing (No backend required!). All processing is done locally.</p>
                    </>
                  )}
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '2rem', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0f172a', fontWeight: 'bold', marginBottom: '8px' }}>
                  <Sparkles size={16} color="#2563eb" /> Target Job Description (Optional)
                </label>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
                  Paste the JD you are applying for. Our AI will automatically tailor your experience bullets and skills to bypass the ATS for this specific role.
                </p>
                <textarea 
                  rows={4} 
                  placeholder="Paste job requirements here..." 
                  value={targetJD} 
                  onChange={e => setTargetJD(e.target.value)} 
                  style={{ borderColor: '#cbd5e1', backgroundColor: '#ffffff' }} 
                />
              </div>

              <button className="btn-cohere" onClick={parseResumeWithAI} disabled={isGenerating} style={{ width: '100%', marginTop: '10px' }}>
                <Sparkles size={18} /> {isGenerating ? 'Optimizing...' : 'AI Resume Optimizer'}
              </button>
            </div>
          )}

          {activeTab === 'personal' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* ... Same as before ... */}
              <div className="form-group">
                <label>Full Name</label>
                <input value={resumeData.personalInfo.fullName} onChange={e => updatePersonalInfo('fullName', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Target Job Title</label>
                <input value={resumeData.personalInfo.jobTitle} onChange={e => updatePersonalInfo('jobTitle', e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Email</label>
                  <input value={resumeData.personalInfo.email} onChange={e => updatePersonalInfo('email', e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Phone</label>
                  <input value={resumeData.personalInfo.phone} onChange={e => updatePersonalInfo('phone', e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Location</label>
                  <input value={resumeData.personalInfo.location} onChange={e => updatePersonalInfo('location', e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>LinkedIn/Website</label>
                  <input value={resumeData.personalInfo.linkedin} onChange={e => updatePersonalInfo('linkedin', e.target.value)} />
                </div>
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Professional Summary</label>
                <textarea rows={4} value={resumeData.personalInfo.summary} onChange={e => updatePersonalInfo('summary', e.target.value)} />
                <button 
                  className="btn-cohere" 
                  onClick={optimizeSummary}
                  disabled={isGenerating}
                  style={{ marginTop: '12px', width: '100%' }}
                >
                  <Sparkles size={16} /> {isGenerating ? 'Optimizing...' : 'AI Optimize Summary'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="form-group">
              <label>Technical Skills</label>
              <textarea rows={10} value={resumeData.skills} onChange={e => setResumeData(prev => ({...prev, skills: e.target.value}))} style={{ fontSize: '13px' }}/>
              
              <button 
                className="btn-cohere" 
                style={{ width: '100%', marginTop: '1rem' }} 
                onClick={tailorSkills}
                disabled={isGenerating}
              >
                <Sparkles size={16} />
                {isGenerating ? 'Generating...' : 'AI Tailor Skills'}
              </button>
            </div>
          )}

          {activeTab === 'experience' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {resumeData.experience.map((exp, index) => (
                <div key={exp.id} style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '8px', position: 'relative', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <button 
                    onClick={() => removeExperience(exp.id)}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                  >
                    Remove
                  </button>
                  <h4 style={{ marginBottom: '1.5rem', color: '#334155' }}>Experience {index + 1}</h4>
                  
                  <div className="form-group" style={{ marginBottom: '0.8rem' }}>
                    <label>Company</label>
                    <input value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} />
                  </div>
                  <div className="form-group" style={{ marginBottom: '0.8rem' }}>
                    <label>Role / Title</label>
                    <input value={exp.role} onChange={e => updateExperience(exp.id, 'role', e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.8rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Start Date</label>
                      <input value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} placeholder="Jan 2022" />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>End Date</label>
                      <input value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} placeholder="Present" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Bullet Points</label>
                    <textarea rows={6} value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} style={{ fontSize: '13px' }}/>
                  </div>
                  
                  <button 
                    className="btn-cohere" 
                    style={{ width: '100%', marginTop: '1rem' }} 
                    onClick={() => optimizeBullets(exp.id)}
                    disabled={isGenerating}
                  >
                    <Sparkles size={16} />
                    {isGenerating ? 'Generating...' : 'AI Optimize Bullets'}
                  </button>
                </div>
              ))}
              <button className="btn-outline-cohere" onClick={addExperience}>
                + Add Experience
              </button>
            </div>
          )}

          {activeTab === 'education' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {resumeData.education.map((edu, index) => (
                <div key={edu.id} style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '8px', position: 'relative', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <button 
                    onClick={() => removeEducation(edu.id)}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                  >
                    Remove
                  </button>
                  <h4 style={{ marginBottom: '1.5rem', color: '#334155' }}>Education {index + 1}</h4>
                  
                  <div className="form-group" style={{ marginBottom: '0.8rem' }}>
                    <label>School / University</label>
                    <input value={edu.school} onChange={e => updateEducation(edu.id, 'school', e.target.value)} />
                  </div>
                  <div className="form-group" style={{ marginBottom: '0.8rem' }}>
                    <label>Degree / Major</label>
                    <input value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Graduation Year</label>
                    <input value={edu.year} onChange={e => updateEducation(edu.id, 'year', e.target.value)} />
                  </div>
                </div>
              ))}
              <button className="btn-outline-cohere" onClick={addEducation}>
                + Add Education
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* RIGHT SIDEBAR: LIVE PREVIEW */}
      <section className="tool-preview" style={{ position: 'relative' }}>
        <div className="floating-actions" style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px', zIndex: 10 }}>
          <select 
            value={resumeTheme} 
            onChange={(e) => setResumeTheme(e.target.value as any)}
            style={{ padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '13px', backgroundColor: 'white', cursor: 'pointer', outline: 'none' }}
          >
            <option value="silicon">Theme: Silicon Valley</option>
            <option value="ivy">Theme: Ivy League</option>
            <option value="modern">Theme: Modern Minimalist</option>
          </select>
          <button onClick={exportToPDF} className="btn-outline-cohere" style={{ padding: '8px 16px', background: 'white', display: 'flex', alignItems: 'center', gap: '6px', width: 'auto' }}>
            <Download size={16} /> PDF
          </button>
          <button onClick={exportToWord} className="btn-cohere" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={16} /> Word
          </button>
        </div>
        <div className={`preview-paper theme-${resumeTheme}`} style={{ padding: '0', marginTop: '60px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', borderSpacing: 0 }}>
            <thead className="print-spacer">
              <tr><td><div style={{ height: '40px' }}></div></td></tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '0 40px' }}>
                  
                  {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 className="resume-name" style={{ fontSize: '28px', margin: '0 0 5px 0', textTransform: 'uppercase' }}>{resumeData.personalInfo.fullName || 'YOUR NAME'}</h1>
            <div style={{ fontSize: '14px', marginBottom: '5px' }}>
              {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
              {resumeData.personalInfo.phone && <span> | {resumeData.personalInfo.phone}</span>}
              {resumeData.personalInfo.location && <span> | {resumeData.personalInfo.location}</span>}
              {resumeData.personalInfo.linkedin && <span> | {resumeData.personalInfo.linkedin}</span>}
            </div>
          </div>

          {/* Summary */}
          {resumeData.personalInfo.summary && (
            <div style={{ marginBottom: '15px' }}>
              <div className="resume-header" style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase' }}>
                Professional Summary
              </div>
              <p style={{ margin: 0, fontSize: '12px', lineHeight: '1.4' }}>
                {resumeData.personalInfo.summary}
              </p>
            </div>
          )}

          {/* Skills */}
          {resumeData.skills && (
            <div style={{ marginBottom: '15px' }}>
              <div className="resume-header" style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase' }}>
                Technical Skills
              </div>
              <div style={{ fontSize: '12px', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>
                {resumeData.skills}
              </div>
            </div>
          )}

          {/* Experience */}
          {resumeData.experience.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <div className="resume-header" style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase' }}>
                Professional Experience
              </div>
              {resumeData.experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{exp.company}</div>
                    <div style={{ fontSize: '12px' }}>{exp.startDate} {exp.endDate && `- ${exp.endDate}`}</div>
                  </div>
                  <div style={{ fontStyle: 'italic', fontSize: '13px', marginBottom: '4px' }}>{exp.role}</div>
                  <ul style={{ margin: '0 0 0 20px', padding: 0, fontSize: '12px', lineHeight: '1.4' }}>
                    {exp.description.split('\n').map((bullet, i) => bullet.trim() ? (
                      <li key={i}>{bullet.replace(/^- /, '')}</li>
                    ) : null)}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {resumeData.education.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <div className="resume-header" style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase' }}>
                Education
              </div>
              {resumeData.education.map(edu => (
                <div key={edu.id} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{edu.school}</div>
                    <div style={{ fontSize: '12px' }}>{edu.degree}</div>
                  </div>
                  <div style={{ fontSize: '12px' }}>{edu.year}</div>
                </div>
              ))}
            </div>
          )}

                </td>
              </tr>
            </tbody>
            <tfoot className="print-spacer">
              <tr><td><div style={{ height: '40px' }}></div></td></tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>

      {/* SEO & FAQ Section Rendered Below Tool */}
      <section className="seo-content-section" style={{ padding: '4rem 2rem', backgroundColor: '#f8fafc', borderTop: '1px solid var(--border-color)' }}>
        <div className="page-container" style={{ margin: '0 auto', boxShadow: 'none', border: 'none', backgroundColor: 'transparent', maxWidth: '900px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#0f172a' }}>How Our AI Resume Optimizer Works</h2>
          <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '2rem', lineHeight: '1.8' }}>
            The modern job market is highly automated. Over 90% of Fortune 500 companies use an Applicant Tracking System (ATS) to filter resumes before a human ever sees them. Our free AI Resume Optimizer is designed specifically to help you bypass these filters using semantic analysis and keyword embedding.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>1. Import Your Resume</h4>
              <p style={{ color: '#64748b' }}>Simply paste your existing resume or LinkedIn profile. Our AI instantly parses your history into structured data.</p>
            </div>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>2. Semantic Optimization</h4>
              <p style={{ color: '#64748b' }}>We analyze your work experience bullets and rewrite them using strong action verbs and quantified metrics.</p>
            </div>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>3. Real-Time Export</h4>
              <p style={{ color: '#64748b' }}>Watch as your resume is formatted into a professional, ATS-friendly design, ready to be exported instantly.</p>
            </div>
          </div>

          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#0f172a', marginTop: '4rem' }}>Frequently Asked Questions (FAQ)</h2>
          
          <div className="faq-item" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1e293b' }}>Is my data secure and private?</h4>
            <p style={{ color: '#64748b' }}>Yes. We utilize a Bring Your Own Key (BYOK) architecture. Your OpenAI API key and all your personal resume data are stored strictly within your browser's LocalStorage. We do not store your resume on our servers, ensuring 100% privacy.</p>
          </div>
          
          <div className="faq-item" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1e293b' }}>What is an Applicant Tracking System (ATS)?</h4>
            <p style={{ color: '#64748b' }}>An ATS is a software application that enables the electronic handling of recruitment and hiring needs. They parse resumes for keywords, semantic context, and formatting. Our tool ensures your resume is structured exactly how these algorithms prefer.</p>
          </div>
          
          <div className="faq-item" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1e293b' }}>Do I have to pay for this service?</h4>
            <p style={{ color: '#64748b' }}>The core optimizer tool is completely free to use. By providing your own API key, you bypass typical SaaS subscription fees and only pay fractions of a cent directly to the AI provider for your own usage.</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AppTool;
