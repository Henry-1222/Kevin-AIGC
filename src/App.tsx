/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, User, Sun, Moon, X, Camera, LogOut, Edit2, Music, Volume2, VolumeX, Plus, MessageSquare, Send, Search, Zap, Code, Sparkles, ChevronLeft, Trash2, History } from 'lucide-react';
import Markdown from 'react-markdown';

interface UserData {
  avatar: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  phoneRegion: string;
  email: string;
  region: string;
  password: string;
  hasEdited: boolean;
}

const SourceCodeView = ({ code, onBack }: { code: string; onBack: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black text-green-500 p-8 font-mono overflow-auto z-[100]"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-green-900 pb-4">
          <h2 className="text-xl font-bold">SYSTEM_SOURCE_CODE_ACCESS_GRANTED</h2>
          <button onClick={onBack} className="text-white hover:text-green-400 transition-colors cursor-pointer">
            [ EXIT_DEBUG_MODE ]
          </button>
        </div>
        <pre className="text-sm whitespace-pre-wrap leading-relaxed">
          {code}
        </pre>
      </div>
    </motion.div>
  );
};

const KevinLogo = () => {
  return (
    <div className="flex items-center justify-center font-sans text-7xl md:text-9xl tracking-tighter select-none h-[1.2em]">
      {/* K - Right half is a moon */}
      <div className="relative flex items-center h-full">
        <span className="font-bold leading-none text-text-primary">K</span>
        {/* Moon shape overlapping the right side of K */}
        <div className="absolute right-[-0.15em] top-1/2 -translate-y-1/2 w-[0.5em] h-[0.5em] pointer-events-none">
          {/* Visual Moon */}
          <div className="absolute inset-0 bg-bg-primary rounded-full overflow-hidden">
             <div className="absolute right-0 w-full h-full bg-text-primary rounded-full translate-x-1/3"></div>
          </div>
        </div>
      </div>
      
      {/* e - Grok-like (minimalist slash/geometric) */}
      <div className="relative flex items-center h-full ml-[-0.05em]">
        <span className="font-medium lowercase leading-none text-text-primary" style={{ fontSize: '1.2em' }}>e</span>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-[0.7em] h-[3px] bg-text-primary rotate-[-45deg] opacity-30"></div>
        </div>
      </div>

      {/* v */}
      <span className="font-medium lowercase leading-none ml-[-0.05em] text-text-primary" style={{ fontSize: '1.2em' }}>v</span>

      {/* i - Dot is a sun */}
      <div className="relative flex items-center h-full ml-[-0.05em]">
        <span className="font-medium lowercase leading-none text-text-primary" style={{ fontSize: '1.2em' }}>i</span>
        {/* Sun dot - STAYS ORANGE */}
        <div className="absolute top-[0.1em] left-1/2 -translate-x-1/2 w-[0.2em] h-[0.2em] bg-orange-500 rounded-full shadow-[0_0_12px_rgba(249,115,22,0.8)] border border-orange-300"></div>
      </div>

      {/* n */}
      <span className="font-medium lowercase leading-none ml-[-0.05em] text-text-primary" style={{ fontSize: '1.2em' }}>n</span>
    </div>
  );
};

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: number;
}

const CreaStyleView = ({ onBack, isDark, lang, t }: { onBack: () => void; isDark: boolean; lang: 'zh' | 'en'; t: any }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [subView, setSubView] = useState<'main' | 'new' | 'history'>('main');

  const ct = {
    zh: {
      newProject: "新建项目",
      history: "历史记录",
      backWorkspace: "返回工作区",
      preview: "预览",
      code: "代码",
      placeholder: "让 CreaStyle 构建一些东西...",
      startConv: "开始对话以生成代码",
      assistantMsg: "本页面进处于测试及演示阶段，尚未完成API配置。",
      newProjectTitle: "新项目",
      newProjectDesc: "使用 CreaStyle AI 创造精彩内容。",
      historyTitle: "历史项目",
      project: "项目"
    },
    en: {
      newProject: "NEW PROJECT",
      history: "HISTORY",
      backWorkspace: "BACK TO WORKSPACE",
      preview: "PREVIEW",
      code: "CODE",
      placeholder: "Ask CreaStyle to build something...",
      startConv: "Start a conversation to generate code",
      assistantMsg: "The project is still in the closed beta stage, and the MiMO API has not yet been configured.",
      newProjectTitle: "NEW PROJECT",
      newProjectDesc: "Create something amazing with CreaStyle AI.",
      historyTitle: "HISTORY PROJECTS",
      project: "Project"
    }
  }[lang];

  const defaultCode = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <!-- 设置视口，适配移动端显示 -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>你好hello</title>
    <style>
        /* 简单样式，让文字居中且字号更大 */
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-size: 48px;
            font-family: "Microsoft YaHei", sans-serif;
        }
    </style>
</head>
<body>
    <!-- 核心内容：你好hello -->
    你好hello
</body>
</html>`;

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user' as const, content: input }];
    setMessages(newMessages);
    setInput('');
    setTimeout(() => {
      setMessages([...newMessages, { role: 'assistant' as const, content: ct.assistantMsg }]);
    }, 500);
  };

  const Logo = () => (
    <div className="flex items-center font-sans tracking-tighter select-none text-2xl md:text-3xl">
      <div className="relative flex items-center">
        <span className="font-bold leading-none">C</span>
        <div className="absolute -right-[0.1em] top-1/2 -translate-y-1/2 w-[0.3em] h-[0.3em] bg-blue-500 rounded-full opacity-60 blur-[1px]"></div>
      </div>
      <span className="font-medium lowercase leading-none ml-[-0.05em]">r</span>
      <div className="relative flex items-center ml-[-0.05em]">
        <span className="font-medium lowercase leading-none">e</span>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-[0.8em] h-[2px] bg-current rotate-[-45deg] opacity-30"></div>
        </div>
      </div>
      <span className="font-medium lowercase leading-none ml-[-0.05em]">a</span>
      <div className="relative flex items-center ml-[0.1em]">
        <span className="font-black uppercase leading-none text-blue-500">S</span>
        <div className="absolute inset-0 bg-blue-500/20 blur-lg -z-10"></div>
      </div>
      <span className="font-medium lowercase leading-none ml-[-0.05em]">t</span>
      <span className="font-medium lowercase leading-none ml-[-0.05em]">y</span>
      <span className="font-medium lowercase leading-none ml-[-0.05em]">l</span>
      <div className="relative flex items-center ml-[-0.05em]">
        <span className="font-medium lowercase leading-none">e</span>
        <div className="absolute -top-[0.1em] right-0 w-[0.15em] h-[0.15em] bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>
      </div>
    </div>
  );

  if (subView === 'new') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}
      >
        <div className="absolute top-8 left-8">
          <Logo />
        </div>
        <h2 className="text-5xl font-bold mb-8 tracking-tight">{ct.newProjectTitle}</h2>
        <p className="text-gray-500 mb-12">{ct.newProjectDesc}</p>
        <button 
          onClick={() => setSubView('main')} 
          className="px-8 py-3 border-2 border-current rounded-2xl font-bold hover:bg-current hover:text-bg-primary transition-all"
        >
          {ct.backWorkspace}
        </button>
      </motion.div>
    );
  }

  if (subView === 'history') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}
      >
        <div className="absolute top-8 left-8">
          <Logo />
        </div>
        <h2 className="text-5xl font-bold mb-8 tracking-tight">{ct.historyTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full px-6 mb-12">
          {[1, 2, 3].map(i => (
            <div key={i} className="aspect-video bg-current/5 border border-current/10 rounded-3xl flex items-center justify-center opacity-40">
              <span className="font-bold">{ct.project} {i}</span>
            </div>
          ))}
        </div>
        <button 
          onClick={() => setSubView('main')} 
          className="px-8 py-3 border-2 border-current rounded-2xl font-bold hover:bg-current hover:text-bg-primary transition-all"
        >
          {ct.backWorkspace}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex flex-col ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-white text-gray-900'}`}
    >
      {/* Top Header */}
      <div className="h-16 border-b border-border-subtle flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-black/5 rounded-lg transition-colors">
            <ChevronLeft size={20} />
          </button>
          <Logo />
        </div>
        <div className="flex items-center gap-2 bg-black/5 p-1 rounded-xl">
          <button 
            onClick={() => setViewMode('preview')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === 'preview' ? (isDark ? 'bg-white/20' : 'bg-white shadow-sm') : 'opacity-50'}`}
          >
            {ct.preview}
          </button>
          <button 
            onClick={() => setViewMode('code')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === 'code' ? (isDark ? 'bg-white/20' : 'bg-white shadow-sm') : 'opacity-50'}`}
          >
            {ct.code}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Chat & Navigation */}
        <div className="w-full md:w-1/3 border-r border-border-subtle flex flex-col p-6 gap-6 overflow-hidden">
          <div className="flex gap-4 shrink-0">
            <button 
              onClick={() => setSubView('new')}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-text-primary text-bg-primary rounded-2xl font-bold text-sm hover:opacity-90 transition-all"
            >
              <Plus size={18} />
              {ct.newProject}
            </button>
            <button 
              onClick={() => setSubView('history')}
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-border-subtle rounded-2xl font-bold text-sm hover:bg-black/5 transition-all"
            >
              <History size={18} />
              {ct.history}
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                <Sparkles size={48} className="mb-4" />
                <p className="text-sm font-medium">{ct.startConv}</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[90%] p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-blue-500 text-white' : (isDark ? 'bg-white/10' : 'bg-black/5')}`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="relative shrink-0">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={ct.placeholder}
              className={`w-full ${isDark ? 'bg-white/5' : 'bg-black/5'} border-none rounded-2xl px-4 py-4 pr-12 text-sm resize-none h-24 outline-none focus:ring-2 focus:ring-black/10 transition-all`}
            />
            <button 
              onClick={handleSend}
              className="absolute bottom-4 right-4 p-2 bg-text-primary text-bg-primary rounded-xl hover:scale-105 transition-all"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* Right Content: Code/Preview */}
        <div className="hidden md:flex flex-1 bg-gray-50 overflow-hidden relative">
          {viewMode === 'code' ? (
            <div className="h-full w-full p-6 overflow-auto font-mono text-sm leading-relaxed bg-[#1e1e1e] text-gray-300">
              <pre className="whitespace-pre-wrap">{defaultCode}</pre>
            </div>
          ) : (
            <iframe 
              srcDoc={defaultCode}
              className="w-full h-full border-none bg-white"
              title="Preview"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ChatView = ({ 
  model, 
  user, 
  onBack, 
  isDark,
  lang,
  t
}: { 
  model: 'claw' | 'aigc' | 'max'; 
  user: UserData | null; 
  onBack: () => void;
  isDark: boolean;
  lang: 'zh' | 'en';
  t: any;
}) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentSession = sessions.find(s => s.id === currentSessionId);

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: lang === 'zh' ? '新对话' : 'New Conversation',
      messages: [],
      timestamp: Date.now()
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.id);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(sessions.filter(s => s.id !== id));
    if (currentSessionId === id) setCurrentSessionId(null);
  };

  const handleSend = async () => {
    if (!input.trim() || !currentSessionId) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const updatedSessions = sessions.map(s => {
      if (s.id === currentSessionId) {
        return {
          ...s,
          messages: [...s.messages, userMessage],
          title: s.messages.length === 0 ? input.slice(0, 20) + (input.length > 20 ? '...' : '') : s.title
        };
      }
      return s;
    });
    setSessions(updatedSessions);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const assistantMessage: ChatMessage = { 
        role: 'assistant', 
        content: lang === 'zh' 
          ? "项目仍处于封测阶段，尚未配置MiMO API。"
          : "The project is still in the closed beta stage, and the MiMO API has not yet been configured."
      };
      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return { ...s, messages: [...s.messages, assistantMessage] };
        }
        return s;
      }));
      setIsTyping(false);
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentSessionId) {
      const userMessage: ChatMessage = { role: 'user', content: `[File Uploaded: ${file.name}]` };
      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return { ...s, messages: [...s.messages, userMessage] };
        }
        return s;
      }));
      setIsTyping(true);
      setTimeout(() => {
        const assistantMessage: ChatMessage = { 
          role: 'assistant', 
          content: lang === 'zh' 
            ? `已接收文件: ${file.name}。由于尚未配置API，无法进行分析。`
            : `Received file: ${file.name}. Analysis is unavailable as the API is not yet configured.`
        };
        setSessions(prev => prev.map(s => {
          if (s.id === currentSessionId) {
            return { ...s, messages: [...s.messages, assistantMessage] };
          }
          return s;
        }));
        setIsTyping(false);
      }, 1000);
    }
  };

  const isMax = model === 'max';
  const isClaw = model === 'claw';

  const chatT = {
    zh: {
      newChat: "新建对话",
      welcome: isClaw ? "欢迎使用 Kevin Claw" : `欢迎使用 Kevin ${model.toUpperCase()}`,
      clawDesc: "基于 OpenCLAW 架构的下一代对话 AI。",
      aigcDesc: "全能型 AIGC，满足您的所有创意需求。",
      maxDesc: "性能强劲、训练有素的伙伴。",
      startBtn: "开始对话",
      placeholder: isClaw ? "给 Kevin Claw 发送消息或上传文件..." : `给 Kevin ${model.toUpperCase()} 发送消息...`,
      webSearch: "联网搜索",
      deepThinking: "深度思考",
      codeExpert: "代码专家模式",
      grantPerms: "给予系统权限"
    },
    en: {
      newChat: "New Chat",
      welcome: isClaw ? "Welcome to Kevin Claw" : `Welcome to Kevin ${model.toUpperCase()}`,
      clawDesc: "Next-gen conversational AI based on OpenCLAW architecture.",
      aigcDesc: "General purpose AIGC for all your creative needs.",
      maxDesc: "A powerful and well-trained companion.",
      startBtn: "Start Chatting",
      placeholder: isClaw ? "Message Kevin Claw or upload files..." : `Message Kevin ${model.toUpperCase()}...`,
      webSearch: "Web Search",
      deepThinking: "Deep Thinking",
      codeExpert: "Code Expert Mode",
      grantPerms: "Grant Permissions"
    }
  }[lang];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`fixed inset-0 z-50 flex flex-col md:flex-row ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-white text-gray-900'}`}
    >
      {/* Sidebar */}
      <div className={`w-full md:w-72 border-r ${isDark ? 'border-white/10 bg-white/5' : 'border-black/5 bg-gray-50'} flex flex-col`}>
        <div className="p-4 flex items-center justify-between">
          <button onClick={onBack} className="p-2 hover:bg-black/5 rounded-lg transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isMax ? 'bg-purple-500' : isClaw ? 'bg-orange-500' : 'bg-emerald-500'}`} />
            <span className="text-sm font-bold tracking-tight">Kevin {isClaw ? 'Claw' : model.toUpperCase()}</span>
          </div>
        </div>

        <button 
          onClick={createNewChat}
          className={`mx-4 mb-4 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed ${isDark ? 'border-white/20 hover:border-white/40' : 'border-black/10 hover:border-black/20'} transition-all text-sm font-medium`}
        >
          <Plus size={16} />
          {chatT.newChat}
        </button>

        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {sessions.map(session => (
            <div
              key={session.id}
              onClick={() => setCurrentSessionId(session.id)}
              className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                currentSessionId === session.id 
                  ? (isDark ? 'bg-white/10' : 'bg-black/5') 
                  : 'hover:bg-black/5'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare size={16} className="shrink-0 opacity-50" />
                <span className="text-sm truncate">{session.title}</span>
              </div>
              <button 
                onClick={(e) => deleteSession(session.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {user && (
          <div className={`p-4 border-t ${isDark ? 'border-white/10' : 'border-black/5'} flex items-center gap-3`}>
            {user.avatar ? (
              <img src={user.avatar} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                {user.name[0]}
              </div>
            )}
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold truncate">{user.name}</span>
              <span className="text-[10px] opacity-50 truncate">{user.email}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {!currentSessionId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${
              isMax ? 'bg-purple-500/10 text-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.2)]' : 
              isClaw ? 'bg-orange-500/10 text-orange-500' : 
              'bg-emerald-500/10 text-emerald-500'
            }`}>
              {isMax ? <Code size={40} /> : isClaw ? <Zap size={40} /> : <Sparkles size={40} />}
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight mb-2">{chatT.welcome}</h3>
              <p className="text-sm opacity-50 max-w-sm mx-auto">
                {isMax ? chatT.maxDesc : 
                 isClaw ? chatT.clawDesc : 
                 chatT.aigcDesc}
              </p>
            </div>
            <button 
              onClick={createNewChat}
              className={`px-8 py-3 rounded-2xl font-bold transition-all ${
                isMax ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20 hover:scale-105' : 
                isClaw ? 'bg-orange-500 text-white hover:opacity-90' :
                'bg-text-primary text-bg-primary hover:opacity-90'
              }`}
            >
              {chatT.startBtn}
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
              {currentSession.messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx} 
                  className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                    msg.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : (isMax ? 'bg-purple-500 text-white' : isClaw ? 'bg-orange-500 text-white' : 'bg-emerald-500 text-white')
                  }`}>
                    {msg.role === 'user' ? 'U' : 'K'}
                  </div>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? (isDark ? 'bg-white/10' : 'bg-black/5') 
                      : (isMax ? 'bg-purple-500/5 border border-purple-500/20' : isClaw ? 'bg-orange-500/5 border border-orange-500/20' : (isDark ? 'bg-white/5' : 'bg-gray-50'))
                  }`}>
                    <div className="markdown-body">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${isMax ? 'bg-purple-500' : isClaw ? 'bg-orange-500' : 'bg-emerald-500'} text-white`}>K</div>
                  <div className="p-4 rounded-2xl bg-black/5 flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className={`p-4 md:p-8 pt-0 ${isMax ? 'bg-gradient-to-t from-purple-500/5 to-transparent' : isClaw ? 'bg-gradient-to-t from-orange-500/5 to-transparent' : ''}`}>
              <div className="max-w-3xl mx-auto relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={chatT.placeholder}
                  className={`w-full bg-transparent border-2 ${
                    isMax ? 'border-purple-500/30 focus:border-purple-500' : 
                    isClaw ? 'border-orange-500/30 focus:border-orange-500' :
                    isDark ? 'border-white/10 focus:border-white/30' : 'border-black/10 focus:border-black/30'
                  } rounded-2xl px-4 py-4 pr-12 text-sm resize-none h-24 outline-none transition-all`}
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  {isClaw && (
                    <>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        className="hidden" 
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-2 rounded-xl transition-all border ${isDark ? 'border-white/20 hover:bg-white/10' : 'border-black/10 hover:bg-black/5'} flex items-center gap-2 text-[10px] font-bold uppercase`}
                        title={chatT.grantPerms}
                      >
                        <Plus size={14} />
                        <span className="hidden sm:inline">{chatT.grantPerms}</span>
                      </button>
                    </>
                  )}
                  <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className={`p-2 rounded-xl transition-all ${
                      input.trim() ? (isMax ? 'bg-purple-500 text-white' : isClaw ? 'bg-orange-500 text-white' : 'bg-emerald-500 text-white') : 'opacity-20'
                    }`}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
              
              {/* Feature Tags */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {!isClaw && (
                  <>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      isDark ? 'border-white/10 bg-white/5' : 'border-black/5 bg-black/5'
                    }`}>
                      <Search size={10} />
                      {chatT.webSearch}
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      isDark ? 'border-white/10 bg-white/5' : 'border-black/5 bg-black/5'
                    }`}>
                      <Zap size={10} />
                      {chatT.deepThinking}
                    </div>
                  </>
                )}
                {isMax && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-purple-500/30 bg-purple-500/10 text-purple-500">
                    <Code size={10} />
                    {chatT.codeExpert}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default function App() {
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [isDark, setIsDark] = useState(false);
  const [view, setView] = useState<'main' | 'more' | 'claw' | 'aigc' | 'max' | 'creastyle'>('main');
  
  // User State
  const [user, setUser] = useState<UserData | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSourceCode, setShowSourceCode] = useState(false);
  const [appSourceCode, setAppSourceCode] = useState('');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<UserData>>({
    phoneRegion: '+86',
    region: '深圳',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch source code for the easter egg
    fetch(window.location.href)
      .then(res => res.text())
      .then(text => setAppSourceCode(text))
      .catch(() => setAppSourceCode("// Failed to load source code."));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Easter Egg Check
    const isEasterEgg = 
      !formData.firstName && 
      !formData.lastName && 
      !formData.avatar && 
      !formData.phone && 
      formData.email === 'david996655@gmail.com' && 
      formData.name === 'code' && 
      formData.region === '深圳' &&
      formData.password === 'code';

    if (isEasterEgg) {
      setShowSourceCode(true);
      setShowLogin(false);
      return;
    }

    // Normal Login
    const newUser: UserData = {
      avatar: formData.avatar || '',
      name: formData.name || 'User',
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      phone: formData.phone || '',
      phoneRegion: formData.phoneRegion || '+86',
      email: formData.email || '',
      region: formData.region || '',
      password: formData.password || '',
      hasEdited: false,
    };
    setUser(newUser);
    setShowLogin(false);
    setFormData({ phoneRegion: '+86', region: '深圳' });
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.hasEdited) return;

    setUser({
      ...user,
      name: formData.name || user.name,
      avatar: formData.avatar || user.avatar,
      hasEdited: true,
    });
    setIsEditing(false);
    setShowProfileMenu(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=space-ambient-sci-fi-10105.mp3');
      audioRef.current.loop = true;
    }
    
    if (isMusicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  const t = {
    zh: {
      powered: "Powered by Xiaomi MiMO, know in you.",
      login: "登录",
      logout: "退出登录",
      edit: "编辑资料",
      more: "更多",
      aigc: "Kevin AIGC",
      claw: "Kevin Claw",
      max: "Kevin MAX",
      creastyle: "创新风格工坊",
      ourGame: "Our Game",
      gameTitle: "The Reah:Red Matter",
      study: "预习与复习",
      back: "返回",
      name: "名字",
      firstName: "姓氏",
      lastName: "名字",
      phone: "电话",
      email: "邮箱",
      region: "地区",
      password: "密码",
      avatar: "头像",
      submit: "确定",
      cancel: "取消",
      editLimit: "仅限修改一次名字与头像",
    },
    en: {
      powered: "Powered by Xiaomi MiMO, know in you.",
      login: "Login",
      logout: "Logout",
      edit: "Edit Profile",
      more: "More",
      aigc: "Kevin AIGC",
      claw: "Kevin Claw",
      max: "Kevin MAX",
      creastyle: "CreaStyle",
      ourGame: "Our Game",
      gameTitle: "The Reah:Red Matter",
      study: "Preview & Review",
      back: "Back",
      name: "Name",
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone",
      email: "Email",
      region: "Region",
      password: "Password",
      avatar: "Avatar",
      submit: "Submit",
      cancel: "Cancel",
      editLimit: "Name and avatar can only be edited once",
    }
  }[lang];

  if (showSourceCode) {
    return <SourceCodeView code={appSourceCode} onBack={() => setShowSourceCode(false)} />;
  }

  if (['claw', 'aigc', 'max', 'creastyle'].includes(view)) {
    if (view === 'creastyle') {
      return <CreaStyleView onBack={() => setView('main')} isDark={isDark || isMusicPlaying} lang={lang} t={t} />;
    }
    return (
      <ChatView 
        model={view as 'claw' | 'aigc' | 'max'} 
        user={user} 
        onBack={() => setView('main')}
        isDark={isDark || isMusicPlaying}
        lang={lang}
        t={t}
      />
    );
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans transition-all duration-1000 ${isMusicPlaying ? 'bg-black text-white' : 'bg-bg-primary text-text-primary'}`}>
      {/* Breathing Ambient Light Background */}
      <AnimatePresence>
        {isMusicPlaying && (
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Orange Blob */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                x: [0, 100, -50, 0],
                y: [0, -50, 100, 0],
                scale: [1, 1.5, 0.8, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] rounded-full bg-orange-500/20 blur-[120px]"
            />
            {/* Blue Blob */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                x: [0, -120, 80, 0],
                y: [0, 100, -60, 0],
                scale: [1, 1.2, 1.5, 1],
                opacity: [0.15, 0.35, 0.15]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-1/4 right-1/4 w-[65vw] h-[65vw] rounded-full bg-blue-500/20 blur-[120px]"
            />
            {/* Green Blob */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                x: [0, 60, -100, 0],
                y: [0, 80, 50, 0],
                scale: [1, 0.9, 1.3, 1],
                opacity: [0.1, 0.3, 0.1]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55vw] h-[55vw] rounded-full bg-emerald-500/15 blur-[120px]"
            />
          </div>
        )}
      </AnimatePresence>

      {/* Top Left Music Toggle */}
      <div className="absolute top-8 left-8 z-10">
        <button 
          onClick={toggleMusic}
          className="p-3 rounded-full bg-bg-secondary border border-border-subtle hover:bg-bg-tertiary transition-all cursor-pointer group flex items-center gap-2"
          title={isMusicPlaying ? "Close Music" : "Play Music"}
        >
          {isMusicPlaying ? (
            <Volume2 className="w-5 h-5 text-orange-500 animate-pulse" />
          ) : (
            <VolumeX className="w-5 h-5 opacity-50" />
          )}
          <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {isMusicPlaying ? "Space Ambient" : "Play Music"}
          </span>
        </button>
      </div>

      {/* Top Right Actions */}
      <div className="absolute top-8 right-8 flex items-center gap-4 md:gap-6 z-10">
        {view === 'more' && (
          <button 
            onClick={() => setView('main')}
            className="text-sm font-medium hover:opacity-70 transition-opacity cursor-pointer px-4 py-2 border border-border-subtle rounded-full"
          >
            {t.back}
          </button>
        )}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-text-primary/5 transition-colors cursor-pointer"
          title="Toggle Theme"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button 
          onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
          className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity cursor-pointer"
        >
          <Globe size={18} />
          <span className="hidden sm:inline">{lang === 'zh' ? 'EN' : '中文'}</span>
        </button>
        
        {/* User Profile / Login Button */}
        <div className="relative">
          {user ? (
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 bg-surface border border-border-subtle p-1.5 pr-4 rounded-full hover:shadow-md transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-border-subtle">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <User size={16} />
                  </div>
                )}
              </div>
              <span className="text-sm font-medium">{user.name}</span>
            </button>
          ) : (
            <button 
              onClick={() => setShowLogin(true)}
              className="flex items-center gap-2 text-sm font-medium bg-text-primary text-bg-primary px-4 py-2 rounded-full hover:opacity-80 transition-all cursor-pointer"
            >
              <User size={18} />
              <span className="hidden sm:inline">{t.login}</span>
            </button>
          )}

          {/* Profile Menu Dropdown */}
          <AnimatePresence>
            {showProfileMenu && user && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-48 bg-surface border border-border-subtle shadow-xl rounded-2xl overflow-hidden z-50"
              >
                <button 
                  onClick={() => {
                    setIsEditing(true);
                    setFormData({ name: user.name, avatar: user.avatar });
                    setShowProfileMenu(false);
                  }}
                  disabled={user.hasEdited}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-text-primary/5 transition-colors ${user.hasEdited ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <Edit2 size={16} />
                  <span>{t.edit}</span>
                </button>
                <button 
                  onClick={() => {
                    setUser(null);
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>{t.logout}</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[60]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogin(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-surface border border-border-subtle shadow-2xl rounded-[2.5rem] p-8 overflow-hidden"
            >
              <button 
                onClick={() => setShowLogin(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-text-primary/5 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-2xl font-bold mb-8 text-center">{t.login}</h2>
              
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center mb-6">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-text-primary transition-colors overflow-hidden group relative"
                  >
                    {formData.avatar ? (
                      <img src={formData.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <Camera size={24} className="text-gray-400 group-hover:text-text-primary transition-colors" />
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera size={20} className="text-white" />
                    </div>
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  <span className="text-xs text-gray-400 mt-2">{t.avatar}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t.firstName}</label>
                    <input 
                      type="text" 
                      placeholder="Surname"
                      className="w-full bg-text-primary/5 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-text-primary/20 outline-none"
                      onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t.lastName}</label>
                    <input 
                      type="text" 
                      placeholder="Name"
                      className="w-full bg-text-primary/5 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-text-primary/20 outline-none"
                      onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t.name}</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Display Name"
                    className="w-full bg-text-primary/5 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-text-primary/20 outline-none"
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t.phone}</label>
                  <div className="flex gap-2">
                    <select 
                      className="bg-text-primary/5 border-none rounded-xl px-2 py-2.5 text-sm focus:ring-2 focus:ring-text-primary/20 outline-none"
                      onChange={e => setFormData({ ...formData, phoneRegion: e.target.value })}
                      value={formData.phoneRegion}
                    >
                      <option value="+86">+86</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+81">+81</option>
                    </select>
                    <input 
                      type="tel" 
                      placeholder="Phone Number"
                      className="flex-1 bg-text-primary/5 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-text-primary/20 outline-none"
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t.email}</label>
                  <input 
                    type="email" 
                    required
                    placeholder="example@email.com"
                    className="w-full bg-text-primary/5 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-text-primary/20 outline-none"
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t.region}</label>
                  <input 
                    type="text" 
                    placeholder="City / Region"
                    value={formData.region}
                    className="w-full bg-text-primary/5 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-text-primary/20 outline-none"
                    onChange={e => setFormData({ ...formData, region: e.target.value })}
                  />
                </div>

                <div className="space-y-1 pb-4">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t.password}</label>
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full bg-text-primary/5 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-text-primary/20 outline-none"
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-text-primary text-bg-primary font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity cursor-pointer"
                >
                  {t.login}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && user && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[60]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-surface border border-border-subtle shadow-2xl rounded-[2.5rem] p-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-center">{t.edit}</h2>
              <p className="text-xs text-red-500 text-center mb-8">{t.editLimit}</p>
              
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="flex flex-col items-center">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-text-primary transition-colors overflow-hidden group relative"
                  >
                    {formData.avatar ? (
                      <img src={formData.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <Camera size={24} className="text-gray-400" />
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera size={20} className="text-white" />
                    </div>
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t.name}</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    className="w-full bg-text-primary/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-text-primary/20 outline-none"
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 border border-border-subtle font-bold py-3 rounded-xl hover:bg-text-primary/5 transition-colors cursor-pointer"
                  >
                    {t.cancel}
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-text-primary text-bg-primary font-bold py-3 rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    {t.submit}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <header className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <KevinLogo />
          <p className="mt-4 text-sm md:text-base font-light text-gray-500 tracking-widest uppercase">
            {t.powered}
          </p>
        </motion.div>
      </header>

      {/* Main Content Grid */}
      <div className="relative w-full max-w-6xl flex items-center justify-center">
        {view === 'main' ? (
          <motion.main 
            key="main-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col md:flex-row items-center justify-center gap-8 w-full"
          >
            {/* Left Small Square */}
            <motion.div
              onClick={() => setView('claw')}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.08, y: -5, backgroundColor: "var(--surface)" }}
              className="w-32 h-32 md:w-40 md:h-40 bg-surface border border-border-subtle shadow-sm rounded-3xl flex items-center justify-center text-center p-4 hover:shadow-lg transition-all group cursor-pointer"
            >
              <span className="text-sm font-medium text-gray-500 group-hover:text-text-primary transition-colors">{t.claw}</span>
            </motion.div>

            {/* Center Large Square */}
            <motion.div
              onClick={() => setView('aigc')}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05, y: -8, backgroundColor: "var(--surface)" }}
              className="w-64 h-64 md:w-80 md:h-80 bg-surface border border-border-subtle shadow-md rounded-[3rem] flex items-center justify-center text-center p-8 hover:shadow-2xl transition-all group relative overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-text-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-2xl md:text-3xl font-semibold tracking-tight">{t.aigc}</span>
            </motion.div>

            {/* Right Small Square */}
            <motion.div
              onClick={() => setView('max')}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.08, y: -5, backgroundColor: "var(--surface)" }}
              className="w-32 h-32 md:w-40 md:h-40 bg-surface border border-border-subtle shadow-sm rounded-3xl flex items-center justify-center text-center p-4 hover:shadow-lg transition-all group cursor-pointer"
            >
              <span className="text-sm font-medium text-gray-500 group-hover:text-text-primary transition-colors">
                Kevin <span className="text-red-500 font-bold">MAX</span>
              </span>
            </motion.div>
          </motion.main>
        ) : (
          <motion.div 
            key="more-view"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex flex-col md:flex-row items-center justify-center gap-8 w-full"
          >
            {/* Left Square: Our Game */}
            <motion.a
              href="https://game.frgzn.cn"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.08, y: -5, backgroundColor: "var(--surface)" }}
              className="w-64 h-64 md:w-80 md:h-80 bg-surface border border-border-subtle shadow-md rounded-[3rem] flex flex-col items-center justify-center text-center p-8 hover:shadow-2xl transition-all group cursor-pointer"
            >
              <span className="text-lg font-medium text-gray-500 mb-2">{t.ourGame}</span>
              <span className="text-xl md:text-2xl font-semibold tracking-tight">{t.gameTitle}</span>
            </motion.a>

            {/* Right Square: Study */}
            <motion.a
              href="https://study.frgzn.cn"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.08, y: -5, backgroundColor: "var(--surface)" }}
              className="w-64 h-64 md:w-80 md:h-80 bg-surface border border-border-subtle shadow-md rounded-[3rem] flex items-center justify-center text-center p-8 hover:shadow-2xl transition-all group"
            >
              <span className="text-2xl md:text-3xl font-semibold tracking-tight">{t.study}</span>
            </motion.a>
          </motion.div>
        )}
      </div>

      {/* Vertical Panel on the Left - Symmetrical to More button */}
      <motion.button
        onClick={() => setView('creastyle')}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        whileHover={{ x: 8, backgroundColor: "var(--surface)" }}
        className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col w-20 h-[480px] bg-surface border border-border-subtle shadow-sm rounded-[2.5rem] p-4 items-center justify-between cursor-pointer hover:shadow-2xl transition-all z-10"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="pt-6"
        >
          <span className="text-xs font-bold text-gray-400 tracking-[0.2em] vertical-text uppercase">
            {t.creastyle}
          </span>
        </motion.div>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div 
              key={i} 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2 + (i * 0.03) }}
              className="w-1.5 h-1.5 rounded-full bg-text-primary/10" 
            />
          ))}
        </div>
      </motion.button>

      {/* Vertical Panel on the Right - Moved to the far right edge */}
      <motion.button
        onClick={() => setView(view === 'main' ? 'more' : 'main')}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        whileHover={{ x: -8, backgroundColor: "var(--surface)" }}
        className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col w-20 h-[480px] bg-surface border border-border-subtle shadow-sm rounded-[2.5rem] p-4 items-center justify-between cursor-pointer hover:shadow-2xl transition-all z-10"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="pt-6"
        >
          <span className="text-xs font-light text-gray-400 uppercase tracking-[0.3em] vertical-text">
            {view === 'main' ? t.more : t.back}
          </span>
        </motion.div>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div 
              key={i} 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2 + (i * 0.03) }}
              className="w-1.5 h-1.5 rounded-full bg-text-primary/10" 
            />
          ))}
        </div>
      </motion.button>

      {/* Mobile Dot Grid (Fallback for vertical panel) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="lg:hidden mt-12 grid grid-cols-5 gap-3"
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-gray-200" />
        ))}
      </motion.div>

      <style>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </div>
  );
}
