const fs = require('fs');
const appTool = fs.readFileSync('src/pages/AppTool.tsx', 'utf-8');

const providerNameMatch = appTool.match(/type ProviderName = [^;]+;/);
const providersMatch = appTool.match(/const PROVIDERS: Record<ProviderName, \{ name: string, urlPlaceholder: string, description: string, logoUrl: string \| null \}> = \{[\s\S]+?\n\};/);
const defaultModelsMatch = appTool.match(/const DEFAULT_MODELS: Record<ProviderName, string> = \{[\s\S]+?\n\};/);
const modalMatch = appTool.match(/\{\/\* SETTINGS MODAL OVERLAY \*\/\}\n\s*\{isSettingsOpen && \([\s\S]+?\s*\)\}/);

const byokComponentCode = `import React, { useState, useEffect } from 'react';
import OpenAI from 'openai';
import { Server, ChevronDown, Trash2, Settings, Key, EyeOff, Eye, CheckCircle2, XCircle } from 'lucide-react';

${providerNameMatch[0]}

${providersMatch[0]}

${defaultModelsMatch[0]}

interface BYOKModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function useBYOK() {
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

  useEffect(() => {
    const loadedKeys = { ...keys };
    let hasLoaded = false;
    (Object.keys(PROVIDERS) as ProviderName[]).forEach(provider => {
      const storedKey = localStorage.getItem(\`ai_key_\${provider}\`);
      const storedUrl = localStorage.getItem(\`ai_url_\${provider}\`);
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

  const getClient = (): OpenAI | null => {
    const currentCreds = keys[activeProvider];
    if (currentCreds.apiKey) {
      return new OpenAI({
        apiKey: currentCreds.apiKey,
        baseURL: currentCreds.baseUrl || PROVIDERS[activeProvider].urlPlaceholder,
        dangerouslyAllowBrowser: true
      });
    }
    return null;
  };

  const getModelName = (): string => {
    return DEFAULT_MODELS[activeProvider] || 'gpt-4o-mini';
  };

  return { activeProvider, keys, setKeys, setActiveProvider, getClient, getModelName };
}

export const BYOKModal: React.FC<BYOKModalProps & ReturnType<typeof useBYOK>> = ({ 
  isOpen, 
  onClose,
  activeProvider,
  keys,
  setKeys,
  setActiveProvider
}) => {
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [isProviderSelectOpen, setIsProviderSelectOpen] = useState(false);

  // Close provider dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('provider-dropdown-menu');
      const button = document.getElementById('provider-dropdown-button');
      
      if (isProviderSelectOpen && 
          dropdown && !dropdown.contains(event.target as Node) &&
          button && !button.contains(event.target as Node)) {
        setIsProviderSelectOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProviderSelectOpen]);

  if (!isOpen) return null;

  // Replicate handlers
  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setKeys(prev => ({ ...prev, [activeProvider]: { ...prev[activeProvider], apiKey: newKey } }));
    localStorage.setItem(\`ai_key_\${activeProvider}\`, newKey);
    setTestStatus('idle');
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setKeys(prev => ({ ...prev, [activeProvider]: { ...prev[activeProvider], baseUrl: newUrl } }));
    localStorage.setItem(\`ai_url_\${activeProvider}\`, newUrl);
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
    localStorage.removeItem(\`ai_key_\${activeProvider}\`);
    localStorage.removeItem(\`ai_url_\${activeProvider}\`);
    setTestStatus('idle');
  };

  const testConnection = async () => {
    const currentCreds = keys[activeProvider];
    if (!currentCreds.apiKey) return;
    setTestStatus('testing');
    try {
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

  const isSettingsOpen = isOpen;
  const setIsSettingsOpen = (open: boolean) => { if(!open) onClose(); };

  return (
    <>
      ${modalMatch[0].replace(/isSettingsOpen/g, 'isOpen').replace(/setIsSettingsOpen\(false\)/g, 'onClose()').replace(/<button([^>]*)onClick=\{\(\) => setIsProviderSelectOpen\(!isProviderSelectOpen\)\}([^>]*)>/, '<button id="provider-dropdown-button"$1onClick={() => setIsProviderSelectOpen(!isProviderSelectOpen)}$2>').replace(/<div style=\{\{([^}]*)position: 'absolute', top: 'calc\(100% \+ 4px\)'([^}]*)\}\}>/, '<div id="provider-dropdown-menu" style={{position: \'absolute\', top: \'calc(100% + 4px)\'$1}}>')}
      <style dangerouslySetInnerHTML={{__html: \`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      \`}} />
    </>
  );
};
`;

fs.writeFileSync('src/components/BYOKModal.tsx', byokComponentCode);
console.log('BYOKModal.tsx created.');
