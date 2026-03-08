/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, User, Sun, Moon, X, Camera, LogOut, Edit2, Music, Volume2, VolumeX } from 'lucide-react';

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

export default function App() {
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [isDark, setIsDark] = useState(false);
  const [view, setView] = useState<'main' | 'more'>('main');
  
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
      nano: "Kevin NANO",
      max: "Kevin MAX",
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
      nano: "Kevin NANO",
      max: "Kevin MAX",
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans transition-colors duration-500 bg-bg-primary text-text-primary">
      {/* Breathing Ambient Light Background */}
      <AnimatePresence>
        {isMusicPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1],
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background: isDark 
                ? 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 70%)'
                : 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
              filter: 'blur(100px)'
            }}
          />
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
            <motion.a
              href="https://nano.frgzn.cn"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.08, y: -5, backgroundColor: "var(--surface)" }}
              className="w-32 h-32 md:w-40 md:h-40 bg-surface border border-border-subtle shadow-sm rounded-3xl flex items-center justify-center text-center p-4 hover:shadow-lg transition-all group"
            >
              <span className="text-sm font-medium text-gray-500 group-hover:text-text-primary transition-colors">{t.nano}</span>
            </motion.a>

            {/* Center Large Square */}
            <motion.a
              href="https://cn.frgzn.cn"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05, y: -8, backgroundColor: "var(--surface)" }}
              className="w-64 h-64 md:w-80 md:h-80 bg-surface border border-border-subtle shadow-md rounded-[3rem] flex items-center justify-center text-center p-8 hover:shadow-2xl transition-all group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-text-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-2xl md:text-3xl font-semibold tracking-tight">{t.aigc}</span>
            </motion.a>

            {/* Right Small Square */}
            <motion.a
              href="https://max.frgzn.cn"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.08, y: -5, backgroundColor: "var(--surface)" }}
              className="w-32 h-32 md:w-40 md:h-40 bg-surface border border-border-subtle shadow-sm rounded-3xl flex items-center justify-center text-center p-4 hover:shadow-lg transition-all group"
            >
              <span className="text-sm font-medium text-gray-500 group-hover:text-text-primary transition-colors">
                Kevin <span className="text-red-500 font-bold">MAX</span>
              </span>
            </motion.a>
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
