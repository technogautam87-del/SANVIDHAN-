/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Award, 
  Heart, 
  Terminal, 
  Cpu,
  Mail,
  MapPin,
  Lock,
  Unlock,
  Compass,
  Star,
  Upload,
  Trash2,
  Camera,
  Phone,
  Github,
  Linkedin,
  Youtube,
  Globe,
  Eye,
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DeveloperSocial {
  platform: "github" | "linkedin" | "youtube" | "portfolio";
  url: string;
  label: string;
  color: string;
}

interface Developer {
  id: string;
  name: string;
  role: string;
  posting: string;
  bio: string;
  favValue: string;
  email: string;
  phone: string;
  colorTheme: string; // Tailwind gradient classes
  skills: string[];
  socials: DeveloperSocial[];
}

interface DevelopersSectionProps {
  setMascotData: (data: { mood: "happy" | "thinking" | "excited" | "proud" | "speaking" | "greeting"; text: string }) => void;
}

export default function DevelopersSection({ setMascotData }: DevelopersSectionProps) {
  // Hardcoded permanent developer lists - Fully Locked
  const developers: Developer[] = [
    {
      id: "gautam",
      name: "Chandra Shekhar Gautam",
      role: "फाउंडर (Founder) - विशेष शिक्षक व भारतीय सांकेतिक भाषा दुभाषिया (Special Teacher & ISL Interpreter)",
      posting: "रिसोर्स रूम, केसरी सिंह राजकीय उच्च माध्यमिक विद्यालय (GSSS) पहाड़ी (पहाड़ी जिला डीग, राजस्थान)",
      bio: "आप 'संविधान मित्र' के संस्थापक (Founder), एक समर्पित स्पेशल टीचर व भारतीय सांकेतिक भाषा दुभाषिया हैं जो कि डेफ (मूक-बधिर) बच्चों को पढ़ाते हैं। आपकी पदस्थापना पहाड़ी जिला डीग, राजस्थान के अंतर्गत रिसोर्स रूम, केसरी सिंह राजकीय उच्च माध्यमिक विद्यालय (GSSS) पहाड़ी में है। बच्चों को खेल-खेल में डिजिटल नागरिक शास्त्र व अधिकार सिखाने के लिए ही आपने इस 'संविधान मित्र' एप की परिकल्पना और निर्माण किया है।",
      favValue: "समानता और समावेशी शिक्षा का अधिकार (Right to Equality) - Article 14",
      email: "technogautam87@gmail.com",
      phone: "+91 6350279005",
      colorTheme: "from-orange-500 to-amber-500 border-amber-400",
      skills: ["Founder", "Special Education", "ISL Interpreter", "React Web Apps", "Educational Game Design"],
      socials: [
        {
          platform: "github",
          url: "https://github.com/technogautam87",
          label: "GitHub प्रोफ़ाइल",
          color: "bg-slate-900 hover:bg-slate-950 border-slate-950 text-white"
        },
        {
          platform: "youtube",
          url: "https://youtube.com/@technogautam87",
          label: "YouTube चैनल",
          color: "bg-red-600 hover:bg-red-700 border-red-800 text-white"
        },
        {
          platform: "linkedin",
          url: "https://www.linkedin.com/in/chandra-shekhar-gautam",
          label: "LinkedIn कनेक्ट",
          color: "bg-blue-600 hover:bg-blue-700 border-blue-800 text-white"
        },
        {
          platform: "portfolio",
          url: "https://technogautam87.github.io",
          label: "वेबसाइट / ब्लॉग",
          color: "bg-amber-600 hover:bg-amber-700 border-amber-800 text-white"
        }
      ]
    },
    {
      id: "kushagra",
      name: "Kushagra Gaur",
      role: "को-फाउंडर (Co-Founder) - BCI (Basic Computer Instructor) व सीनियर सॉफ्टवेयर इंजीनियर",
      posting: "राजकीय बालिका उच्च माध्यमिक विद्यालय (Govt Girls Senior Secondary School) बोरखेड़ा, भीलवाड़ा राजस्थान",
      bio: "आप 'संविधान मित्र' के सह-संस्थापक (Co-Founder), एक BCI (Basic Computer Instructor) हैं जो कि एक सीनियर सॉफ्टवेयर इंजीनियर हैं। आपकी पदस्थापना राजकीय बालिका उच्च माध्यमिक विद्यालय (Govt Girls Senior Secondary School) बोरखेड़ा, भीलवाड़ा में है। आप इंटरएक्टिव USER इंटरफेस (UI/UX) डिजाइनिंग, विज़ुअल एनिमेशन और आधुनिक वेब कोडिंग तकनीकों को भारतीय शिक्षा में एकीकृत करने वाले विशेषज्ञ हैं।",
      favValue: "शिक्षा का अधिकार (Right to Education) - Article 21A",
      email: "kushagragaur87@gmail.com",
      phone: "+91 6376224992",
      colorTheme: "from-indigo-600 to-purple-500 border-purple-400",
      skills: ["Co-Founder", "Basic Computer Instructor", "React/Vite", "UI/UX Animations", "Tailwind CSS Specialist"],
      socials: [
        {
          platform: "github",
          url: "https://github.com/kushagragaur87",
          label: "GitHub प्रोफ़ाइल",
          color: "bg-slate-900 hover:bg-slate-950 border-slate-950 text-white"
        },
        {
          platform: "linkedin",
          url: "https://www.linkedin.com/in/kushagragaur",
          label: "LinkedIn कनेक्ट",
          color: "bg-blue-650 hover:bg-blue-750 border-blue-850 text-white"
        },
        {
          platform: "portfolio",
          url: "https://kushagaur.github.io",
          label: "पोर्टफोलियो",
          color: "bg-teal-600 hover:bg-teal-700 border-teal-850 text-white"
        },
        {
          platform: "youtube",
          url: "https://youtube.com",
          label: "YouTube चैनल",
          color: "bg-rose-600 hover:bg-rose-700 border-rose-800 text-white"
        }
      ]
    }
  ];

  const [secretCode, setSecretCode] = useState("");
  const [consoleMsg, setConsoleMsg] = useState("टाइप करें 'INDIA', 'SAMVIDHAN', 'UNLOCK' या 'LOCK' कोई जादुई और सुरक्षित संदेश देखने के लिए!");

  const [gautamPhoto, setGautamPhoto] = useState<string | null>(null);
  const [kushagraPhoto, setKushagraPhoto] = useState<string | null>(null);

  // Load photos and lock state from localStorage on mount
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return localStorage.getItem("developers_photos_unlocked") === "true";
  });
  const [isDragging, setIsDragging] = useState<string | null>(null); // To trace dragging "gautam" | "kushagra"
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showMskPassword, setShowMskPassword] = useState(false);

  // Load custom social profiles URL state
  const [gautamSocials, setGautamSocials] = useState(() => ({
    github: localStorage.getItem("gautam_social_github") || "https://github.com/technogautam87",
    youtube: localStorage.getItem("gautam_social_youtube") || "https://youtube.com/@technogautam87",
    linkedin: localStorage.getItem("gautam_social_linkedin") || "https://www.linkedin.com/in/chandra-shekhar-gautam",
    portfolio: localStorage.getItem("gautam_social_portfolio") || "https://technogautam87.github.io"
  }));

  const [kushagraSocials, setKushagraSocials] = useState(() => ({
    github: localStorage.getItem("kushagra_social_github") || "https://github.com/kushagragaur87",
    youtube: localStorage.getItem("kushagra_social_youtube") || "https://youtube.com",
    linkedin: localStorage.getItem("kushagra_social_linkedin") || "https://www.linkedin.com/in/kushagragaur",
    portfolio: localStorage.getItem("kushagra_social_portfolio") || "https://kushagaur.github.io"
  }));

  // Temporary editing states for social profiles
  const [tempGautamSocials, setTempGautamSocials] = useState(() => ({ ...gautamSocials }));
  const [tempKushagraSocials, setTempKushagraSocials] = useState(() => ({ ...kushagraSocials }));

  // Load custom emails of developers
  const [gautamEmail, setGautamEmail] = useState(() => {
    return localStorage.getItem("gautam_email") || "technogautam87@gmail.com";
  });
  const [kushagraEmail, setKushagraEmail] = useState(() => {
    return localStorage.getItem("kushagra_email") || "kushagragaur87@gmail.com";
  });

  const [tempGautamEmail, setTempGautamEmail] = useState(gautamEmail);
  const [tempKushagraEmail, setTempKushagraEmail] = useState(kushagraEmail);
  const [editingEmailId, setEditingEmailId] = useState<string | null>(null);

  useEffect(() => {
    if (isUnlocked) {
      setTempGautamEmail(gautamEmail);
      setTempKushagraEmail(kushagraEmail);
    }
  }, [isUnlocked, gautamEmail, kushagraEmail]);

  const isValidUrl = (url: string) => {
    if (!url || url.trim() === "") return true; // valid if empty or cleared
    const regex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/i;
    return regex.test(url.trim());
  };

  useEffect(() => {
    if (isUnlocked) {
      setTempGautamSocials({ ...gautamSocials });
      setTempKushagraSocials({ ...kushagraSocials });
    }
  }, [isUnlocked, gautamSocials, kushagraSocials]);

  const developersWithDynamicSocials = developers.map((dev) => {
    const currentSocials = dev.id === "gautam" ? gautamSocials : kushagraSocials;
    return {
      ...dev,
      email: dev.id === "gautam" ? gautamEmail : kushagraEmail,
      socials: dev.socials.map((social) => ({
        ...social,
        url: currentSocials[social.platform as keyof typeof currentSocials] || social.url
      }))
    };
  });

  useEffect(() => {
    const savedGautam = localStorage.getItem("gautam_photo");
    const savedKushagra = localStorage.getItem("kushagra_photo");
    if (savedGautam) setGautamPhoto(savedGautam);
    if (savedKushagra) setKushagraPhoto(savedKushagra);
  }, []);

  useEffect(() => {
    if (isUnlocked) {
      setMascotData({
        mood: "excited",
        text: "वाह बच्चों! आपने सुरक्षा घेरा अनलॉक कर दिया है। अब आप फोटो फ्रेम पर क्लिक करके या ड्रैग करके डेवलपर्स की मनपसंद असली फोटो बदल सकते हैं! 🖼️🔓"
      });
    } else {
      setMascotData({
        mood: "proud",
        text: "प्यारे बच्चों! 'संविधान मित्र' के रचयिता श्री चन्द्र शेखर गौतम जी और श्री कुशाग्र गौर जी की असली फोटो को पूरी तरह से सुरक्षित रूप से लॉक कर दिया गया है! अब इसमें कोई बदलाव नहीं किया जा सकता है। 🔐✨"
      });
    }
  }, [isUnlocked, setMascotData]);

  // Audio/Visual Feedback Engine
  const playSystemSound = (type: "success" | "unlock" | "lock" | "delete") => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "success") {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === "unlock") {
        osc.frequency.setValueAtTime(392.00, ctx.currentTime); // G4
        osc.frequency.setValueAtTime(493.88, ctx.currentTime + 0.08); // B4
        osc.frequency.setValueAtTime(587.33, ctx.currentTime + 0.16); // D5
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === "lock") {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(493.88, ctx.currentTime + 0.08); // B4
        osc.frequency.setValueAtTime(392.00, ctx.currentTime + 0.16); // G4
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === "delete") {
        osc.frequency.setValueAtTime(330, ctx.currentTime); // E4
        osc.frequency.setValueAtTime(220, ctx.currentTime + 0.1); // A3
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch {}
  };

  const processFile = (file: File, id: "gautam" | "kushagra") => {
    if (!file.type.startsWith("image/")) {
      alert("कृपया केवल फोटो (Image) फाइल ही अपलोड करें!");
      return;
    }
    
    // Limit file size to 1.5MB to avoid exceeding localStorage quota
    if (file.size > 1.5 * 1024 * 1024) {
      alert("फ़ाइल बहुत बड़ी है! कृपया 1.5MB से छोटी फोटो अपलोड करें।");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        if (id === "gautam") {
          setGautamPhoto(base64);
          localStorage.setItem("gautam_photo", base64);
        } else {
          setKushagraPhoto(base64);
          localStorage.setItem("kushagra_photo", base64);
        }
        playSystemSound("success");
        setMascotData({
          mood: "excited",
          text: `अद्भुत! ${id === "gautam" ? "चन्द्र शेखर जी" : "कुशाग्र जी"} की असली फोटो सफलतापूर्वक सेट कर दी गई है! 🌟✨`
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileDrop = (e: React.DragEvent, id: "gautam" | "kushagra") => {
    e.preventDefault();
    setIsDragging(null);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file, id);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, id: "gautam" | "kushagra") => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file, id);
    }
  };

  const executeSecretCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = secretCode.trim().toUpperCase();
    if (cleanCode === "INDIA") {
      setConsoleMsg("🎉 जय हिन्द! 🇮🇳 'सत्यमेव जयते' - भारत हमारा देश है और इसकी संस्कृति महान है!");
      setMascotData({ mood: "excited", text: "वाह! तुमने राष्ट्रीय कोड खोला! जय हिन्द! 🧡🤍💚" });
    } else if (cleanCode === "SAMVIDHAN") {
      setConsoleMsg("📜 'हम, भारत के लोग...' - संविधान की प्रस्तावना ही हमारे लोकतंत्र की आत्मा है!");
      setMascotData({ mood: "proud", text: "बहुत बढ़िया! संविधान कोड सफल रहा। भारत माता की जय!" });
    } else if (cleanCode === "ELECTION") {
      setConsoleMsg("🗳️ चुनाव भारतीय नागरिक की सबसे बड़ी शक्ति है। निष्पक्ष मतदान करें!");
    } else if (cleanCode === "UNLOCK") {
      if (isUnlocked) {
        setConsoleMsg("🔓 प्रोफाइल पहले से ही अनलॉक है!");
      } else {
        setShowPasswordInput(true);
        setMascotData({
          mood: "excited",
          text: "अनलॉक करने के लिए कृपया ऊपर सुरक्षा पासवर्ड दर्ज करें! 🔒🗝️"
        });
      }
    } else if (cleanCode === "LOCK") {
      setIsUnlocked(false);
      localStorage.setItem("developers_photos_unlocked", "false");
      setConsoleMsg("🔒 सफलता! 'सुरक्षा चक्र' पुनः सक्रिय कर दिया गया है। चित्र फिर से सील कर दिए गए हैं।");
      setMascotData({
        mood: "proud",
        text: "बहुत बढ़िया! आपने सुरक्षा चक्र को वापस सक्रिय करके फोटो प्रोफाइल को लॉक कर दिया है। 🔐🛡️"
      });
      playSystemSound("lock");
    } else {
      setConsoleMsg("❌ गलत कोड। कृपया 'INDIA' या 'SAMVIDHAN' या 'UNLOCK' या 'LOCK' लिखकर प्रयास करें!");
    }
    setSecretCode("");
  };

  // Dedicated SVG generator to draw Chandra Shekhar exactly like the uploaded photo
  const renderChandraShekharSVG = () => (
    <svg viewBox="0 0 100 100" className="w-24 h-24 rounded-2xl shadow-md border-4 border-white bg-slate-100 flex-shrink-0 animate-pulse">
      <defs>
        <linearGradient id="gautam-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="60%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient id="water-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="skin-gautam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5d0a9" />
          <stop offset="100%" stopColor="#e2b182" />
        </linearGradient>
      </defs>
      
      {/* Sky and soft sun */}
      <rect x="0" y="0" width="100" height="60" fill="url(#gautam-bg)" />
      
      {/* Hills in background */}
      <path d="M-10,60 L20,35 L45,55 L80,30 L110,60" fill="#0284c7" opacity="0.4" />
      <path d="M10,60 L40,40 L65,58 L95,35 L120,60" fill="#0369a1" opacity="0.6" />

      {/* Blue rippling water */}
      <rect x="0" y="55" width="100" height="45" fill="url(#water-grad)" />
      <path d="M10,65 Q30,62 50,65 T90,65" stroke="#bae6fd" strokeWidth="0.5" fill="none" opacity="0.6" />
      <path d="M5,75 Q25,72 45,75 T85,75" stroke="#bae6fd" strokeWidth="0.5" fill="none" opacity="0.6" />
      <path d="M20,85 Q40,82 60,85 T100,85" stroke="#bae6fd" strokeWidth="0.5" fill="none" opacity="0.6" />

      {/* White boat body behind */}
      <path d="M 15,90 L 85,90 L 95,65 L 5,65 Z" fill="#ffffff" opacity="0.9" stroke="#d1d5db" strokeWidth="1" />
      {/* Yellow boat padding/cushion */}
      <path d="M 55,65 C 75,65 95,45 95,25 C 95,5 85,15 75,25 Z" fill="#facc15" stroke="#eab308" strokeWidth="1" />

      {/* Shoulders - White collared shirt */}
      <path d="M 15,100 L 85,100 L 75,70 L 25,70 Z" fill="#ffffff" stroke="#e5e7eb" strokeWidth="0.5" />
      
      {/* Collars */}
      <path d="M 40,70 L 50,82 L 60,70 Z" fill="#e5e5e5" />
      <path d="M 38,70 L 45,78 L 47,70 Z" fill="#ffffff" stroke="#d1d5db" strokeWidth="0.5" />
      <path d="M 62,70 L 55,78 L 53,70 Z" fill="#ffffff" stroke="#d1d5db" strokeWidth="0.5" />

      {/* Neck */}
      <rect x="44" y="62" width="12" height="12" fill="url(#skin-gautam)" />
      <path d="M 44,70 C 44,74 56,74 56,70" fill="none" stroke="#d4a373" strokeWidth="0.5" />

      {/* Head */}
      <ellipse cx="50" cy="50" rx="14" ry="17" fill="url(#skin-gautam)" />

      {/* Black hair hairstyle */}
      <path d="M 34,42 C 34,30 44,28 50,28 C 56,28 66,30 66,42 C 64,36 58,34 50,35 C 42,34 36,36 34,42 Z" fill="#1e293b" />
      <path d="M 35,42 L 37,48 L 39,45 L 36,42 Z" fill="#1e293b" />
      <path d="M 65,42 L 63,48 L 61,45 L 64,42 Z" fill="#1e293b" />

      {/* Eyebrows */}
      <path d="M 36,41 C 40,39 45,41 46,42" fill="none" stroke="#1e293b" strokeWidth="1.2" />
      <path d="M 64,41 C 60,39 55,41 54,42" fill="none" stroke="#1e293b" strokeWidth="1.2" />

      {/* Sunglasses (Black stylish lenses with light reflection) */}
      <rect x="37" y="44" width="11" height="8" rx="4" fill="#0f172a" stroke="#d1d5db" strokeWidth="0.8" />
      <rect x="52" y="44" width="11" height="8" rx="4" fill="#0f172a" stroke="#d1d5db" strokeWidth="0.8" />
      <path d="M 48,46 L 52,46" stroke="#94a3b8" strokeWidth="1.2" />
      <path d="M 34,46 L 37,46" stroke="#94a3b8" strokeWidth="0.8" />
      <path d="M 63,46 L 66,46" stroke="#94a3b8" strokeWidth="0.8" />
      <path d="M 39,45 L 43,49" stroke="#ffffff" strokeWidth="0.8" opacity="0.5" />
      <path d="M 54,45 L 58,49" stroke="#ffffff" strokeWidth="0.8" opacity="0.5" />

      {/* Nose */}
      <path d="M 48,51 L 50,56 L 52,51" fill="none" stroke="#d4a373" strokeWidth="1" strokeLinecap="round" />

      {/* Friendly gentle Smile */}
      <path d="M 43,58 Q 50,64 57,58" fill="none" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" />

      {/* Silver wristwatch on left arm corner */}
      <g transform="translate(15, 82)">
        <rect x="0" y="0" width="12" height="6" rx="1" fill="#94a3b8" opacity="0.9" />
        <circle cx="6" cy="3" r="3" fill="#ffffff" stroke="#64748b" strokeWidth="0.5" />
        <path d="M 6,3 L 7.5,3" stroke="#0f172a" strokeWidth="0.4" />
      </g>
    </svg>
  );

  // Dedicated SVG generator to draw Kushagra exactly like the uploaded photo
  const renderKushagraSVG = () => (
    <svg viewBox="0 0 100 100" className="w-24 h-24 rounded-2xl shadow-md border-4 border-white bg-slate-100 flex-shrink-0 animate-pulse">
      <defs>
        <linearGradient id="office-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id="skin-kushagra" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ecd5bf" />
          <stop offset="100%" stopColor="#d9af93" />
        </linearGradient>
        <pattern id="plaid-pattern" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill="#475569" />
          <rect x="0" y="0" width="4" height="16" fill="#8b5cf6" opacity="0.3" />
          <rect x="8" y="0" width="2" height="16" fill="#3b82f6" opacity="0.3" />
          <rect x="0" y="0" width="16" height="4" fill="#8b5cf6" opacity="0.3" />
          <rect x="0" y="8" width="16" height="2" fill="#3b82f6" opacity="0.3" />
          <line x1="6" y1="0" x2="6" y2="16" stroke="#ffffff" strokeWidth="0.3" opacity="0.5" />
          <line x1="0" y1="6" x2="16" y2="6" stroke="#ffffff" strokeWidth="0.3" opacity="0.5" />
        </pattern>
      </defs>

      {/* Room back wall */}
      <rect x="0" y="0" width="100" height="100" fill="url(#office-bg)" />

      {/* Office chair and computer screens in background */}
      <rect x="5" y="30" width="23" height="35" rx="3" fill="#1e293b" opacity="0.7" />
      <rect x="14" y="65" width="5" height="10" fill="#475569" opacity="0.7" />
      <rect x="80" y="40" width="15" height="45" rx="4" fill="#334155" opacity="0.5" />

      {/* Shoulders - Plaid pattern shirt wear */}
      <path d="M 12,100 L 88,100 L 76,72 L 24,72 Z" fill="url(#plaid-pattern)" stroke="#334155" strokeWidth="0.5" />
      
      {/* Dark Collars */}
      <path d="M 38,72 L 50,85 L 62,72" fill="#334155" />
      <path d="M 35,72 L 45,82 L 47,72 Z" fill="#475569" stroke="#1e293b" strokeWidth="0.5" />
      <path d="M 65,72 L 55,82 L 53,72 Z" fill="#475569" stroke="#1e293b" strokeWidth="0.5" />

      {/* Neck */}
      <rect x="43" y="64" width="14" height="12" fill="url(#skin-kushagra)" />
      <path d="M 43,72 C 43,76 57,76 57,72" fill="none" stroke="#b98260" strokeWidth="0.5" />

      {/* Profile Head */}
      <ellipse cx="50" cy="48" rx="14" ry="17.5" fill="url(#skin-kushagra)" />

      {/* Short dark hairstyle */}
      <path d="M 34,39 C 33,26 44,24 50,24 C 56,24 67,26 66,39 C 64,32 58,30 50,31 C 42,30 36,32 34,39 Z" fill="#1a1a1a" />
      <path d="M 34,39 L 36,44 L 38,42 L 35,39 Z" fill="#1a1a1a" />
      <path d="M 66,39 L 64,44 L 62,42 L 65,39 Z" fill="#1a1a1a" />

      {/* Full Beard and Mustache detailing connecting cheek and chin */}
      <path d="M 40,51 Q 50,47 60,51 Q 50,56 40,51 Z" fill="#1a1a1a" />
      <path d="M 35,44 Q 35,66 50,67 Q 65,66 65,44 Q 61,56 50,56 Q 39,56 35,44 Z" fill="#1a1a1a" />

      {/* Thick strong eyebrows */}
      <path d="M 36,39 C 40,36 45,39 46,40" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M 64,39 C 60,36 55,39 54,40" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" />

      {/* Eyes with smiling look */}
      <path d="M 38,42 Q 42,39 46,42" fill="none" stroke="#1a1a1a" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="42" cy="43.5" r="1.5" fill="#1a1a1a" />
      <path d="M 54,42 Q 58,39 62,42" fill="none" stroke="#1a1a1a" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="58" cy="43.5" r="1.5" fill="#1a1a1a" />

      {/* Nose */}
      <path d="M 48,46 L 50,52 L 52,46" fill="none" stroke="#b98260" strokeWidth="1.2" strokeLinecap="round" />

      {/* Bright teethy smile */}
      <path d="M 43,55 Q 50,62 57,55 Q 50,56 43,55 Z" fill="#3a0c0c" />
      <path d="M 45,55.5 Q 50,58 55,55.5" fill="#ffffff" />

      {/* Reddish cheek shine blush */}
      <circle cx="38" cy="48" r="1.5" fill="#f87171" opacity="0.3" />
      <circle cx="62" cy="48" r="1.5" fill="#f87171" opacity="0.3" />
    </svg>
  );

  return (
    <div className="space-y-8 animate-fadeIn font-sans">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full border border-purple-200">
          💻 रचनाकार परिचय • Dedicated Creators
        </span>
        <h2 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
          <span>संविधान मित्र के डेवलपर (Developers Room)</span>
        </h2>
        <p className="text-xs md:text-sm text-slate-500 font-extrabold leading-relaxed">
          हमारे देश के बच्चों को सरल और खेल-खेल में डिजिटल नागरिक शास्त्र सिखाने वाले उत्साही कोडिंग व शैक्षणिक मास्टर्स!
        </p>
      </div>

      {/* Photo Unlock Center (Compact Locker Layout) */}
      <div className="max-w-xs sm:max-w-sm mx-auto bg-gradient-to-r from-amber-50 to-orange-50 border-3 border-amber-300 p-3 sm:p-4 rounded-[24px] shadow-sm transition-all space-y-3">
        <div className="flex flex-col items-center justify-center text-center gap-3">
          <div className="flex items-center gap-2.5 justify-center">
            <div className={`p-2 rounded-xl h-10 w-10 flex items-center justify-center ${isUnlocked ? "bg-emerald-100 animate-bounce" : "bg-red-100"} shrink-0`}>
              {isUnlocked ? (
                <Unlock className="w-5 h-5 text-emerald-700" />
              ) : (
                <Lock className="w-5 h-5 text-red-700" />
              )}
            </div>
            <div className="text-left leading-tight">
              <h4 className="text-[10.5px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                <span>सुरक्षा घेरा (Locker)</span>
                <span className={`text-[8.5px] px-1.5 py-0.5 rounded-full font-black ${isUnlocked ? "bg-emerald-200 text-emerald-800" : "bg-red-200 text-red-800"}`}>
                  {isUnlocked ? "अनलॉक" : "लॉक"}
                </span>
              </h4>
              <p className="text-[9.5px] text-slate-500 font-extrabold mt-0.5">
                पिन प्रयुक्त करें या "UNLOCK" कोड चलाएं
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (isUnlocked) {
                setIsUnlocked(false);
                setShowPasswordInput(false);
                setPasswordValue("");
                setPasswordError("");
                localStorage.setItem("developers_photos_unlocked", "false");
                playSystemSound("lock");
              } else {
                setShowPasswordInput(prev => !prev);
                setPasswordError("");
                setPasswordValue("");
              }
            }}
            className={`shrink-0 w-full px-3 py-2 rounded-xl text-[10.5px] font-black transition cursor-pointer flex items-center justify-center gap-1 border-b-2 active:border-b-0 hover:scale-102 shadow-xs duration-100 ${
              isUnlocked
                ? "bg-red-500 hover:bg-red-600 border-red-700 text-white"
                : showPasswordInput 
                  ? "bg-slate-500 hover:bg-slate-600 border-slate-700 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 border-emerald-800 text-white"
            }`}
          >
            {isUnlocked ? (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>सुरक्षित लॉक करें 🔒</span>
              </>
            ) : showPasswordInput ? (
              <>
                <span>पिन फॉर्म बंद करें ❌</span>
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5" />
                <span>अनलॉक फोटो 🔓</span>
              </>
            )}
          </button>
        </div>

        {/* Inline Password Dialog Container */}
        {!isUnlocked && showPasswordInput && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-100/60 border-2 border-amber-200 p-4 rounded-2xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-750" />
                <span>अनलॉक पासवर्ड प्रविष्ट करें:</span>
              </label>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md">
                सुरक्षा जांच
              </span>
            </div>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (passwordValue.trim() === "2026") {
                  setIsUnlocked(true);
                  setShowPasswordInput(false);
                  setPasswordError("");
                  setPasswordValue("");
                  localStorage.setItem("developers_photos_unlocked", "true");
                  setMascotData({
                    mood: "excited",
                    text: "सफलता! आपने सही पासवर्ड दर्ज किया है। अब आप प्रोफाइल फोटो व सोशल कड़ियाँ बदल सकते हैं! 🖼️🎉"
                  });
                  setConsoleMsg("🔓 पासवर्ड सफल हुआ! सुरक्षा चक्र हट गया है।");
                  playSystemSound("unlock");
                } else {
                  setPasswordError("गलत पासवर्ड! कृपया सही पासवर्ड दर्ज करें।");
                  playSystemSound("lock");
                  setMascotData({
                    mood: "thinking",
                    text: "ओह! आपने गलत पासवर्ड प्रविष्ट किया है। कृपया सही पासवर्ड दर्ज करें! 🔐"
                  });
                }
              }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <div className="relative flex-1 flex items-center bg-white border-2 border-amber-300 focus-within:border-amber-500 rounded-xl px-3 py-1.5 focus:outline-none transition-all">
                <input
                  type={showMskPassword ? "text" : "password"}
                  maxLength={15}
                  value={passwordValue}
                  onChange={(e) => {
                    setPasswordValue(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  placeholder="सुरक्षित पिन..."
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none font-mono"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowMskPassword(!showMskPassword)}
                  className="p-1 hover:bg-amber-100 rounded text-amber-800 focus:outline-none transition-all cursor-pointer flex items-center justify-center"
                  title={showMskPassword ? "पासवर्ड छुपाएं" : "पासवर्ड दिखाएं"}
                >
                  {showMskPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-750 text-white font-black text-xs px-5 py-2.5 rounded-xl transition-all border-b-4 border-purple-800 active:border-b-0 cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
              >
                <Unlock className="w-4 h-4" />
                <span>सत्यापित करें 🔓</span>
              </button>
            </form>
            {passwordError && (
              <p className="text-[11px] text-red-650 font-black flex items-center gap-1">
                ⚠️ {passwordError}
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Developer Profile List - Secure Locked Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {developersWithDynamicSocials.map((dev) => {
          return (
            <div
              key={dev.id}
              className={`bg-white border-3 rounded-[32px] overflow-hidden shadow-md hover:shadow-xl transition-all relative ${
                dev.id === "gautam" ? "border-amber-400" : "border-indigo-400"
              }`}
            >
              {/* Card Colored banner with Lock Badge */}
              <div className={`h-24 bg-gradient-to-r ${dev.colorTheme} relative flex items-end justify-between px-6 pb-2`}>
                <span className="text-5xl opacity-30 select-none absolute right-4 top-2">⚖️</span>
                <span className="text-white text-[10px] font-black tracking-widest bg-black/25 px-2.5 py-1 rounded-md backdrop-blur-xs uppercase flex items-center gap-1">
                  {isUnlocked ? (
                    <>
                      <Unlock className="w-3 h-3 text-amber-300" />
                      <span>{dev.id.toUpperCase()} (UNLOCKED)</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3 text-emerald-300" />
                      <span>{dev.id.toUpperCase()} (LOCKED)</span>
                    </>
                  )}
                </span>
              </div>

              {/* Profile Avatar Frame rendering personalized SVG or Real Photo */}
              <div className="px-6 -mt-12 relative flex justify-between items-end">
                <div className="relative">
                  <div 
                    className={`relative cursor-pointer group rounded-2xl transition-all duration-200 select-none ${
                      isUnlocked 
                        ? "ring-4 ring-amber-400 ring-offset-2 scale-102 hover:brightness-110 active:scale-98" 
                        : ""
                    }`}
                    onDragOver={(e) => {
                      if (!isUnlocked) return;
                      e.preventDefault();
                      setIsDragging(dev.id);
                    }}
                    onDragLeave={() => {
                      setIsDragging(null);
                    }}
                    onDrop={(e) => {
                      if (!isUnlocked) return;
                      handleFileDrop(e, dev.id as "gautam" | "kushagra");
                    }}
                    onClick={() => {
                      if (!isUnlocked) return;
                      document.getElementById(`file-input-${dev.id}`)?.click();
                    }}
                    title={isUnlocked ? "फोटो बदलने के लिए क्लिक या ड्रैग करें" : "यह फोटो अभी सुरक्षित रूप से लॉक है"}
                  >
                    {/* File Input */}
                    <input
                      type="file"
                      id={`file-input-${dev.id}`}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e, dev.id as "gautam" | "kushagra")}
                    />

                    {/* Drag and Drop Indication Overlay */}
                    {isDragging === dev.id && (
                      <div className="absolute inset-0 bg-amber-500/90 rounded-2xl flex flex-col items-center justify-center text-slate-950 font-black text-[10px] z-30 animate-pulse text-center p-1">
                        <Upload className="w-6 h-6 mb-0.5" />
                        <span>यहाँ छोड़ें!</span>
                      </div>
                    )}

                    {/* Regular avatar rendering */}
                    {dev.id === "gautam" ? (
                      gautamPhoto ? (
                        <div className="w-24 h-24 rounded-2xl shadow-md border-4 border-slate-900 bg-slate-100 flex-shrink-0 relative overflow-hidden">
                          <img 
                            src={gautamPhoto} 
                            alt={dev.name} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : (
                        renderChandraShekharGautam()
                      )
                    ) : (
                      kushagraPhoto ? (
                        <div className="w-24 h-24 rounded-2xl shadow-md border-4 border-slate-900 bg-slate-100 flex-shrink-0 relative overflow-hidden">
                          <img 
                            src={kushagraPhoto} 
                            alt={dev.name} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : (
                        renderKushagraSVG()
                      )
                    )}

                    {/* Hover Upload icon overlay in unlocked mode */}
                    {isUnlocked && (
                      <div className="absolute inset-0 bg-black/40 hover:bg-black/60 rounded-2xl flex flex-col items-center justify-center text-white font-black text-[9px] z-25 transition-all text-center p-1">
                        <Camera className="w-5 h-5 mb-0.5 text-amber-300 animate-bounce" />
                        <span>बदलें (ड्रैग/क्लिक)</span>
                      </div>
                    )}

                    {/* Locked/Unlocked status pin */}
                    <div className={`absolute -bottom-1 -right-1 rounded-lg p-1 border-2 border-white shadow-xs z-10 text-white ${isUnlocked ? 'bg-amber-500' : 'bg-emerald-600'}`}>
                      {isUnlocked ? <Unlock className="w-3 h-3 text-slate-950" /> : <Lock className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
                
                {/* Visual Image Upload Guide or Locked Banner */}
                <div className="flex flex-col items-end gap-1">
                  <div className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg text-[9px] text-slate-500 font-extrabold shadow-inner flex items-center gap-1 select-none">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500 animate-spin" />
                    <span>आधिकारिक डेटा</span>
                  </div>
                  
                  {isUnlocked ? (
                    <>
                      {/* Badge if custom photo is present */}
                      {((dev.id === "gautam" && gautamPhoto) || (dev.id === "kushagra" && kushagraPhoto)) ? (
                        <button
                          onClick={() => {
                            if (dev.id === "gautam") {
                              setGautamPhoto(null);
                              localStorage.removeItem("gautam_photo");
                            } else {
                              setKushagraPhoto(null);
                              localStorage.removeItem("kushagra_photo");
                            }
                            playSystemSound("delete");
                            setMascotData({
                              mood: "happy",
                              text: `सफलतापूर्वक ${dev.name} का चित्र रीसेट करके वेक्टर स्थापित कर दिया गया है! 🎨✨`
                            });
                          }}
                          className="bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 text-[9px] font-black px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95 z-20"
                          title="अपलोड की गई फोटो हटाएं"
                        >
                          <Trash2 className="w-3 h-3 text-red-600" />
                          <span>फोटो हटाकर वेक्टर लाएं 🗑️</span>
                        </button>
                      ) : (
                        <div className="bg-amber-100 border border-amber-300 text-amber-800 text-[9px] font-black px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1 select-none animate-pulse">
                          <Unlock className="w-3 h-3 text-amber-700" />
                          <span>चित्र बदलें 📸</span>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Real Photo Locked Badge */
                    <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 text-[9px] font-black px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1 select-none">
                      <Lock className="w-3 h-3 text-emerald-700" />
                      <span>प्रोफ़ाइल फ़ोटो लॉक है</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dev Info Core */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-base md:text-lg font-black text-slate-850 tracking-tight flex items-center gap-1.5">
                    <span>{dev.name}</span>
                  </h3>
                  <p className="text-xs text-orange-600 font-black flex items-center gap-1 mt-1">
                    <Award className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <span>{dev.role}</span>
                  </p>
                </div>

                {/* Location / Posting details */}
                <div className="bg-stone-50 border border-slate-200/50 p-3 rounded-2xl flex gap-2 items-start text-xs text-slate-600">
                  <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 font-black block">पदस्थापना (Current Posting):</strong>
                    <span className="font-bold">{dev.posting}</span>
                  </div>
                </div>

                {/* Bio text detail */}
                <p className="text-xs text-slate-600 font-bold leading-relaxed bg-indigo-50/30 p-3 rounded-2xl border border-indigo-100/40">
                  "{dev.bio}"
                </p>

                {/* Sub Info Blocks */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/50">
                    <span className="text-[10px] text-slate-400 font-black block uppercase tracking-wide">पसंदीदा मूल्य:</span>
                    <p className="text-slate-700 font-black mt-0.5 flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                      <span>{dev.favValue.split(" - ")[0]}</span>
                    </p>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/50 flex flex-col justify-between min-h-16 relative">
                    <span className="text-[10px] text-slate-400 font-black block uppercase tracking-wide">संपर्क ईमेल:</span>
                    {isUnlocked ? (
                      editingEmailId === dev.id ? (
                        <div className="flex items-center gap-1 mt-1">
                          <input
                            type="email"
                            value={dev.id === "gautam" ? tempGautamEmail : tempKushagraEmail}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (dev.id === "gautam") {
                                setTempGautamEmail(val);
                              } else {
                                setTempKushagraEmail(val);
                              }
                            }}
                            className="bg-white border-2 border-amber-300 rounded-lg px-2 py-0.5 text-[9.5px] font-bold focus:outline-none w-full font-mono text-slate-800"
                            placeholder="email@example.com"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newEmail = (dev.id === "gautam" ? tempGautamEmail : tempKushagraEmail).trim();
                              if (newEmail === "") {
                                alert("कृपया एक वैध ईमेल पता दर्ज़ करें!");
                                return;
                              }
                              if (dev.id === "gautam") {
                                setGautamEmail(newEmail);
                                localStorage.setItem("gautam_email", newEmail);
                              } else {
                                setKushagraEmail(newEmail);
                                localStorage.setItem("kushagra_email", newEmail);
                              }
                              setEditingEmailId(null);
                              playSystemSound("success");
                              setMascotData({
                                mood: "happy",
                                text: `सफलतापूर्वक! ${dev.name} का ईमेल आईडी अद्यतनित (updated) कर दिया गया है! 📧✨`
                              });
                            }}
                            className="bg-emerald-600 text-white rounded px-2 py-1 cursor-pointer font-black text-[9.5px] hover:bg-emerald-700 shrink-0 border-b shadow-xs active:border-b-0"
                            title="सहेजें (Save)"
                          >
                            ✓
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-1 mt-1">
                          <span className="text-indigo-600 font-black truncate text-[10.5px] flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 inline-block" />
                            <span>{dev.email}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingEmailId(dev.id);
                              if (dev.id === "gautam") {
                                setTempGautamEmail(gautamEmail);
                              } else {
                                setTempKushagraEmail(kushagraEmail);
                              }
                            }}
                            className="bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 rounded-lg px-2 py-1 cursor-pointer font-black text-[8px] uppercase shrink-0 active:scale-95 transition"
                            title="ईमेल बदलें"
                          >
                            बदलें 📧
                          </button>
                        </div>
                      )
                    ) : (
                      <a 
                        href={`mailto:${dev.email}`}
                        className="text-indigo-600 font-black mt-0.5 block hover:underline truncate"
                        title={dev.email}
                      >
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 inline-block" />
                          <span>{dev.email}</span>
                        </span>
                      </a>
                    )}
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/50">
                    <span className="text-[10px] text-slate-400 font-black block uppercase tracking-wide">संपर्क मोबाइल:</span>
                    <a 
                      href={`tel:${dev.phone}`}
                      className="text-emerald-750 font-black mt-0.5 block hover:underline truncate"
                      title={dev.phone}
                    >
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 inline-block text-emerald-650" />
                        <span>{dev.phone}</span>
                      </span>
                    </a>
                  </div>
                </div>

                {/* Social Media Links Connecting */}
                <div>
                  <span className="text-[9px] text-slate-400 font-black block uppercase tracking-wider mb-1.5">सोशल मीडिया संपर्क (Social Media Profiles)</span>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
                    {dev.socials.map((social, sIdx) => {
                      let IconComp = Globe;
                      if (social.platform === "github") IconComp = Github;
                      if (social.platform === "linkedin") IconComp = Linkedin;
                      if (social.platform === "youtube") IconComp = Youtube;
                      
                      return (
                        <a 
                          key={sIdx}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-black border-b-2 shadow-xs transition active:scale-95 duration-100 ${social.color}`}
                          title={social.label}
                        >
                          <IconComp className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{social.label}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>

                 {/* Editable Social Links Form Panel when Unlocked */}
                {isUnlocked && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-amber-50/50 p-4 rounded-2xl border-2 border-amber-200 mt-2 space-y-3 animate-fadeIn overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-amber-800 font-black flex items-center gap-1.5">
                        <Unlock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                        <span>सोशल मीडिया कड़ियाँ संपादित करें (Edit Media Links)</span>
                      </span>
                      <span className="text-[9px] bg-amber-200 text-amber-900 font-black px-2 py-0.5 rounded-md uppercase">
                        अनलॉक मोड़
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {dev.socials.map((social) => {
                        let PlatformIcon = Globe;
                        if (social.platform === "github") PlatformIcon = Github;
                        if (social.platform === "linkedin") PlatformIcon = Linkedin;
                        if (social.platform === "youtube") PlatformIcon = Youtube;
                        
                        const isGautam = dev.id === "gautam";
                        const currentVal = isGautam 
                          ? (tempGautamSocials[social.platform as keyof typeof tempGautamSocials] || "")
                          : (tempKushagraSocials[social.platform as keyof typeof tempKushagraSocials] || "");
                        
                        const urlIsValid = isValidUrl(currentVal);

                        return (
                          <div key={social.platform} className="flex flex-col gap-1 text-left">
                            <label className="text-[10.5px] font-extrabold text-slate-700 flex items-center gap-1.5 ml-1">
                              <PlatformIcon className="w-3.5 h-3.5 text-slate-500" />
                              <span className="capitalize">{social.platform === "portfolio" ? "Portfolio" : social.platform} URL:</span>
                            </label>
                            <input
                              type="text"
                              value={currentVal}
                              onChange={(e) => {
                                const newUrl = e.target.value;
                                if (isGautam) {
                                  setTempGautamSocials(prev => ({ ...prev, [social.platform]: newUrl }));
                                } else {
                                  setTempKushagraSocials(prev => ({ ...prev, [social.platform]: newUrl }));
                                }
                              }}
                              placeholder="https://..."
                              className={`bg-white border-2 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none transition-all placeholder:text-slate-300 font-mono ${
                                urlIsValid 
                                  ? "border-slate-200 hover:border-amber-300 focus:border-amber-400 text-slate-800" 
                                  : "border-red-300 hover:border-red-400 focus:border-red-500 text-red-700 bg-red-50"
                              }`}
                            />
                            {!urlIsValid && (
                              <span className="text-[9px] text-red-650 font-black ml-1.5 animate-pulse">
                                ⚠️ अवैध URL प्रारूप (जैसे: https://...)
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Commit/Save Button for edited social links */}
                    <div className="pt-2.5 border-t border-amber-200 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          const isGautam = dev.id === "gautam";
                          const targetSocials = (isGautam ? tempGautamSocials : tempKushagraSocials) as Record<string, string>;
                          
                          // Final validation check to make sure
                          const invalidKeys = Object.keys(targetSocials).filter(
                            (key) => !isValidUrl(targetSocials[key])
                          );

                          if (invalidKeys.length > 0) {
                            alert("कुछ कड़ियों में अमान्य URL पैटर्न है। कृपया उन्हें सुधारे!");
                            return;
                          }

                          if (isGautam) {
                            setGautamSocials(tempGautamSocials);
                            Object.entries(tempGautamSocials).forEach(([key, val]) => {
                              localStorage.setItem(`gautam_social_${key}`, val as string);
                            });
                          } else {
                            setKushagraSocials(tempKushagraSocials);
                            Object.entries(tempKushagraSocials).forEach(([key, val]) => {
                              localStorage.setItem(`kushagra_social_${key}`, val as string);
                            });
                          }

                          playSystemSound("success");
                          setMascotData({
                            mood: "happy",
                            text: `सफलतापूर्वक! ${dev.name} के सोशल मीडिया लिंक्स सहेज लिए गए हैं! ✨📱`
                          });
                        }}
                        disabled={
                          Object.values(dev.id === "gautam" ? tempGautamSocials : tempKushagraSocials).some((val) => !isValidUrl(val as string))
                        }
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:border-b-0 disabled:cursor-not-allowed text-white font-black text-xs px-4 py-2 rounded-xl transition duration-150 border-b-4 border-emerald-800 active:border-b-0 cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>कड़ियाँ सहेजें (Save URLs)</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Skill Tags */}
                <div>
                  <span className="text-[9px] text-slate-400 font-black block uppercase tracking-wider mb-1.5">विशेषज्ञता (Key Expertise)</span>
                  <div className="flex flex-wrap gap-1.5">
                    {dev.skills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[9px] font-black px-2 py-0.5 rounded-md uppercase"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Easter Egg / Interactive Sandbox terminal for kids */}
      <div className="bg-slate-900 text-white rounded-[32px] p-6 shadow-md border-2 border-slate-750 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-850 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-yellow-400/10 text-yellow-500 rounded-lg">
              <Terminal className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-xs font-black tracking-wide font-mono md:text-sm text-yellow-300">
                🧭 कोड वर्कस्पेस - Secret Patriotic Codes
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold">
                इस एप में कुछ गुप्त संस्कृत राष्ट्रवादी शब्द छिपे हैं, टाइप करके जादुई संदेश देखें!
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg font-black font-mono">
            {isUnlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            <span>SECURE MODULE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 min-h-24 flex items-center justify-center font-mono text-center text-xs text-yellow-400 leading-normal">
            <p className="font-extrabold">{consoleMsg}</p>
          </div>

          <form onSubmit={executeSecretCode} className="lg:col-span-8 flex gap-2">
            <input
              type="text"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              placeholder="यहाँ गुप्त कोड टाइप करें (जैसे: INDIA, SAMVIDHAN, UNLOCK, LOCK)"
              className="flex-1 bg-slate-950 border-2 border-slate-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-xs text-yellow-300 font-mono font-bold focus:outline-none transition-all placeholder:text-slate-600"
            />
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-black text-xs px-5 py-3 rounded-xl transition shadow-md border border-yellow-400 hover:scale-102 flex items-center gap-1"
            >
              <Cpu className="w-4 h-4" />
              <span>रन कोड</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  // Helper alias to render Chandra Shekhar
  function renderChandraShekharGautam() {
    return renderChandraShekharSVG();
  }
}
