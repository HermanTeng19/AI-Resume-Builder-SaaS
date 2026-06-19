import React, { useState, useEffect } from 'react';
import OpenAI from 'openai';
import { Server, ChevronDown, Trash2, Settings, Key, EyeOff, Eye, CheckCircle2, XCircle } from 'lucide-react';

export type ProviderName = 'openai' | 'anthropic' | 'gemini' | 'groq' | 'openrouter' | 'deepseek' | 'siliconflow' | 'qwen' | 'glm' | 'kimi' | 'doubao' | 'minimax' | 'ollama' | 'custom';

export const PROVIDERS: Record<ProviderName, { name: string, urlPlaceholder: string, description: string, logoUrl: string | null }> = {
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

export const DEFAULT_MODELS: Record<ProviderName, string> = {
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

export interface BYOKModalProps {
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

  return (
    <>
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
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <XCircle size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div style={{ padding: '1.5rem' }}>
            <div style={{ border: '1px solid var(--card-border)', borderRadius: '12px', padding: '1.5rem', backgroundColor: 'var(--bg-color)' }}>
              
              {/* Provider Header with Dropdown */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
                  
                  <div style={{ position: 'relative' }}>
                    <button 
                      id="provider-dropdown-button"
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
                      <div id="provider-dropdown-menu" style={{ 
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
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </>
  );
};
