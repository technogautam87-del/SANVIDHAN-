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
  Compass,
  Star,
  Phone,
  Github,
  Linkedin,
  Youtube,
  Globe
} from "lucide-react";

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
  // Hardcoded permanent developer lists 
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
      skills: ["Founder", "Special Education", "ISL Interpreter", "React Web Apps", "Educational Role Game Design"],
      socials: [
        {
          platform: "github",
          url: "https://github.com/technogautam87",
          label: "GitHub",
          color: "bg-slate-900 hover:bg-slate-950 border-slate-950 text-white"
        },
        {
          platform: "youtube",
          url: "https://youtube.com/@technogautam87",
          label: "YouTube",
          color: "bg-red-600 hover:bg-red-700 border-red-800 text-white"
        },
        {
          platform: "linkedin",
          url: "https://www.linkedin.com/in/chandra-shekhar-gautam",
          label: "LinkedIn Connect",
          color: "bg-blue-600 hover:bg-blue-700 border-blue-800 text-white"
        },
        {
          platform: "portfolio",
          url: "https://technogautam87.github.io",
          label: "Website / Log",
          color: "bg-amber-600 hover:bg-amber-700 border-amber-800 text-white"
        }
      ]
    },
    {
      id: "kushagra",
      name: "Kushagra Gaur",
      role: "को-फाउंडर (Co-Founder) - BCI (Basic Computer Instructor) व सीनियर सॉफ्टवेयर इंजीनियर",
      posting: "राजकीय बालिका उच्च माध्यमिक विद्यालय (Govt Girls Senior Secondary School) बोरखेड़ा, भीलवाड़ा राजस्थान",
      bio: "आप 'संविधान मित्र' के सह-संस्थापक (Co-Founder), एक BCI (Basic Computer Instructor) हैं जो कि एक सीनियर सॉफ्टवेयर इंजीनियर हैं। आपकी पदस्थापना राजकीय बालिका उच्च माध्यमिक विद्यालय (Govt Girls Senior Secondary School) बोरखेड़ा, भीलवाड़ा राजस्थान में है। बच्चों के बेहतर भविष्य के लिए तकनीक व शिक्षा का सही समन्वय ही आपका मुख्य लक्ष्य है।",
      favValue: "स्वतंत्रता का अधिकार (Right to Freedom) - Article 19",
      email: "kushagragaur87@gmail.com",
      phone: "+91 XXXXXXXXXX",
      colorTheme: "from-indigo-500 to-purple-500 border-indigo-400",
      skills: ["Co-Founder", "UI/UX Developer", "Full Stack Engineer", "React Developer", "Educational Technology"],
      socials: [
        {
          platform: "github",
          url: "https://github.com/kushagragaur87",
          label: "GitHub",
          color: "bg-slate-900 hover:bg-slate-950 border-slate-950 text-white"
        },
        {
          platform: "linkedin",
          url: "https://www.linkedin.com/in/kushagaur",
          label: "LinkedIn Connect",
          color: "bg-blue-600 hover:bg-blue-700 border-blue-800 text-white"
        },
        {
          platform: "youtube",
          url: "https://youtube.com",
          label: "YouTube",
          color: "bg-red-600 hover:bg-red-700 border-red-800 text-white"
        },
        {
          platform: "portfolio",
          url: "https://kushagaur.github.io",
          label: "Website / Log",
          color: "bg-indigo-600 hover:bg-indigo-700 border-indigo-800 text-white"
        }
      ]
    }
  ];

  const [secretCode, setSecretCode] = useState("");
  const [consoleMsg, setConsoleMsg] = useState("टाइप करें 'INDIA' या 'SAMVIDHAN' कोई जादुई संदेश देखने के लिए!");

  const [gautamPhoto, setGautamPhoto] = useState<string | null>(null);
  const [kushagraPhoto, setKushagraPhoto] = useState<string | null>(null);

  const [gautamSocials, setGautamSocials] = useState({
    github: "https://github.com/technogautam87",
    youtube: "https://youtube.com/@technogautam87",
    linkedin: "https://www.linkedin.com/in/chandra-shekhar-gautam",
    portfolio: "https://technogautam87.github.io"
  });

  const [kushagraSocials, setKushagraSocials] = useState({
    github: "https://github.com/kushagragaur87",
    youtube: "https://youtube",
    linkedin: "https://www.linkedin.com/in/kushagragaur",
    portfolio: "https://kushagaur.github.io"
  });

  const [gautamEmail, setGautamEmail] = useState("technogautam87@gmail.com");
  const [kushagraEmail, setKushagraEmail] = useState("kushagragaur87@gmail.com");

  // Safe Google Drive & Direct URL Image Extractor Helper
  const getDirectImageUrl = (url: string | null): string => {
    if (!url) return "";
    let trimmed = url.trim();
    if (trimmed.startsWith("data:") || trimmed.startsWith("blob:") || trimmed.includes("unsplash.com")) {
      return trimmed;
    }
    if (trimmed.includes("drive.google.com")) {
      try {
        let fileId = "";
        if (trimmed.includes("/file/d/")) {
          const parts = trimmed.split("/file/d/");
          if (parts[1]) fileId = parts[1].split("/")[0];
        } else if (trimmed.includes("?id=")) {
          const parts = trimmed.split("?id=");
          if (parts[1]) fileId = parts[1].split("&")[0];
        } else if (trimmed.includes("&id=")) {
          const parts = trimmed.split("&id=");
          if (parts[1]) fileId = parts[1].split("&")[0];
        }
        if (fileId) {
          return `https://lh3.googleusercontent.com/u/0/d/${fileId}=w500-h500-no`;
        }
      } catch (e) {
        console.error("Error parsing Google Drive link:", e);
      }
    }
    return trimmed;
  };

  // Sync state reactivity when local storage updates (loaded from Firebase centrally in App.tsx)
  useEffect(() => {
    const syncLocalStorage = () => {
      setGautamPhoto(localStorage.getItem("gautam_photo"));
      setKushagraPhoto(localStorage.getItem("kushagra_photo"));
      
      setGautamEmail(localStorage.getItem("gautam_email") || "technogautam87@gmail.com");
      setKushagraEmail(localStorage.getItem("kushagra_email") || "kushagragaur87@gmail.com");
      
      setGautamSocials({
        github: localStorage.getItem("gautam_social_github") || "https://github.com/technogautam87",
        youtube: localStorage.getItem("gautam_social_youtube") || "https://youtube.com/@technogautam87",
        linkedin: localStorage.getItem("gautam_social_linkedin") || "https://www.linkedin.com/in/chandra-shekhar-gautam",
        portfolio: localStorage.getItem("gautam_social_portfolio") || "https://technogautam87.github.io"
      });

      setKushagraSocials({
        github: localStorage.getItem("kushagra_social_github") || "https://github.com/kushagragaur87",
        youtube: localStorage.getItem("kushagra_social_youtube") || "https://youtube",
        linkedin: localStorage.getItem("kushagra_social_linkedin") || "https://www.linkedin.com/in/kushagaur",
        portfolio: localStorage.getItem("kushagra_social_portfolio") || "https://kushagaur.github.io"
      });
    };

    syncLocalStorage();
    window.addEventListener("storage", syncLocalStorage);
    return () => window.removeEventListener("storage", syncLocalStorage);
  }, []);

  const executeSecretCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = secretCode.trim().toUpperCase();
    if (cleanCode === "INDIA") {
      setConsoleMsg("🎉 जय हिन्द! 🇮🇳 'सत्यमेव जयते' - भारत हमारा देश है और इसकी संस्कृति महान है!");
      setMascotData({ mood: "excited", text: "वाह बच्चों! तुमने राष्ट्रीय कोड खोला! जय हिन्द! 🧡🤍💚" });
    } else if (cleanCode === "SAMVIDHAN") {
      setConsoleMsg("📜 'हम, भारत के लोग...' - संविधान की प्रस्तावना ही हमारे लोकतंत्र की आत्मा है!");
      setMascotData({ mood: "proud", text: "बहुत बढ़िया! संविधान कोड सफल रहा। भारत माता की जय!" });
    } else if (cleanCode === "ELECTION") {
      setConsoleMsg("🗳️ चुनाव भारतीय नागरिक की सबसे बड़ी शक्ति है। निष्पक्ष मतदान करें!");
    } else {
      setConsoleMsg("❌ गलत कोड। कृपया 'INDIA' या 'SAMVIDHAN' लिखकर प्रयास करें!");
    }
    setSecretCode("");
  };

  // Dedicated SVG generator to draw Chandra Shekhar 
  const renderChandraShekharSVG = () => (
    <svg viewBox="0 0 100 100" className="w-24 h-24 rounded-2xl shadow-md border-4 border-white bg-slate-100 flex-shrink-0">
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
      
      <rect x="0" y="0" width="100" height="60" fill="url(#gautam-bg)" />
      <path d="M-10,60 L20,35 L45,55 L80,30 L110,60" fill="#0284c7" opacity="0.4" />
      <path d="M10,60 L40,40 L65,58 L95,35 L120,60" fill="#0369a1" opacity="0.6" />
      <rect x="0" y="55" width="100" height="45" fill="url(#water-grad)" />
      <path d="M10,65 Q30,62 50,65 T90,65" stroke="#bae6fd" strokeWidth="0.5" fill="none" opacity="0.6" />
      <path d="M15,90 L 85,90 L 95,65 L 5,65 Z" fill="#ffffff" opacity="0.9" stroke="#d1d5db" strokeWidth="1" />
      <path d="M 55,65 C 75,65 95,45 95,25 C 95,5 85,15 75,25 Z" fill="#facc15" stroke="#eab308" strokeWidth="1" />
      <path d="M 15,100 L 85,100 L 75,70 L 25,70 Z" fill="#ffffff" stroke="#e5e7eb" strokeWidth="0.5" />
      <path d="M 40,70 L 50,82 L 60,70 Z" fill="#e5e5e5" />
      <path d="M 38,70 L 45,78 L 47,70 Z" fill="#ffffff" stroke="#d1d5db" strokeWidth="0.5" />
      <rect x="44" y="62" width="12" height="12" fill="url(#skin-gautam)" />
      <ellipse cx="50" cy="50" rx="14" ry="17" fill="url(#skin-gautam)" />
      <path d="M 34,42 C 34,30 44,28 50,28 C 56,28 66,30 66,42 C 64,36 58,34 50,35 C 42,34 36,36 34,42 Z" fill="#1e293b" />
      <rect x="37" y="44" width="11" height="8" rx="4" fill="#0f172a" stroke="#d1d5db" strokeWidth="0.8" />
      <rect x="52" y="44" width="11" height="8" rx="4" fill="#0f172a" stroke="#d1d5db" strokeWidth="0.8" />
      <path d="M 48,46 L 52,46" stroke="#94a3b8" strokeWidth="1.2" />
      <path d="M 48,51 L 50,56 L 52,51" fill="none" stroke="#d4a373" strokeWidth="1" strokeLinecap="round" />
      <path d="M 43,58 Q 50,64 57,58" fill="none" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );

  // Dedicated SVG generator to draw Kushagra 
  const renderKushagraSVG = () => (
    <svg viewBox="0 0 100 100" className="w-24 h-24 rounded-2xl shadow-md border-4 border-white bg-slate-100 flex-shrink-0">
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
        </pattern>
      </defs>

      <rect x="0" y="0" width="100" height="100" fill="url(#office-bg)" />
      <rect x="5" y="30" width="23" height="35" rx="3" fill="#1e293b" opacity="0.7" />
      <rect x="14" y="65" width="5" height="10" fill="#475569" opacity="0.7" />
      <path d="M 12,100 L 88,100 L 76,72 L 24,72 Z" fill="url(#plaid-pattern)" stroke="#334155" strokeWidth="0.5" />
      <path d="M 38,72 L 50,85 L 62,72" fill="#334155" />
      <rect x="43" y="64" width="14" height="12" fill="url(#skin-kushagra)" />
      <ellipse cx="50" cy="48" rx="14" ry="17.5" fill="url(#skin-kushagra)" />
      <path d="M 34,39 C 33,26 44,24 50,24 C 56,24 67,26 66,39 C 64,32 58,30 50,31 C 42,30 36,32 34,39 Z" fill="#1a1a1a" />
      <path d="M 40,51 Q 50,47 60,51 Q 50,56 40,51 Z" fill="#1a1a1a" />
      <path d="M 35,44 Q 35,66 50,67 Q 65,66 65,44 Q 61,56 50,56 Q 39,56 35,44 Z" fill="#1a1a1a" />
      <path d="M 36,39 C 40,36 45,39 46,40" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M 64,39 C 60,36 55,39 54,40" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M 38,42 Q 42,39 46,42" fill="none" stroke="#1a1a1a" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="42" cy="43.5" r="1.5" fill="#1a1a1a" />
      <path d="M 54,42 Q 58,39 62,42" fill="none" stroke="#1a1a1a" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="58" cy="43.5" r="1.5" fill="#1a1a1a" />
      <path d="M 48,46 L 50,52 L 52,46" fill="none" stroke="#b98260" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M 43,55 Q 50,62 57,55 Q 50,56 43,55 Z" fill="#3a0c0c" />
    </svg>
  );

  const developersWithDynamicSocials = developers.map((dev) => {
    if (dev.id === "gautam") {
      return {
        ...dev,
        email: gautamEmail,
        socials: dev.socials.map((soc) => {
          const customUrl = gautamSocials[soc.platform as keyof typeof gautamSocials] || soc.url;
          return {
            ...soc,
            url: customUrl
          };
        })
      };
    } else if (dev.id === "kushagra") {
      return {
        ...dev,
        email: kushagraEmail,
        socials: dev.socials.map((soc) => {
          const customUrl = kushagraSocials[soc.platform as keyof typeof kushagraSocials] || soc.url;
          return {
            ...soc,
            url: customUrl
          };
        })
      };
    }
    return dev;
  });

  return (
    <div className="space-y-8 animate-fadeIn font-sans text-left">
      
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

      {/* Developer Profile List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {developersWithDynamicSocials.map((dev) => {
          const hasPhoto = dev.id === "gautam" ? gautamPhoto : kushagraPhoto;
          return (
            <div
              key={dev.id}
              className={`bg-white border-3 rounded-[32px] overflow-hidden shadow-md hover:shadow-xl transition-all relative ${
                dev.id === "gautam" ? "border-amber-400" : "border-indigo-400"
              }`}
            >
              <div className={`h-24 bg-gradient-to-r ${dev.colorTheme} relative flex items-end justify-between px-6 pb-2`}>
                <span className="text-5xl opacity-30 select-none absolute right-4 top-2">⚖️</span>
                <span className="text-white text-[10px] font-black tracking-widest bg-black/25 px-2.5 py-1 rounded-md backdrop-blur-xs uppercase flex items-center gap-1">
                  <span>{dev.id.toUpperCase()}</span>
                </span>
              </div>

              {/* Profile Avatar Frame */}
              <div className="px-6 -mt-12 relative flex justify-between items-end">
                <div className="relative">
                  <div className="relative rounded-2xl select-none">
                    {dev.id === "gautam" ? (
                      gautamPhoto ? (
                        <div className="w-24 h-24 rounded-2xl shadow-md border-4 border-slate-900 bg-slate-100 flex-shrink-0 relative overflow-hidden">
                          <img 
                            src={getDirectImageUrl(gautamPhoto)} 
                            alt={dev.name} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : (
                        renderChandraShekharSVG()
                      )
                    ) : (
                      kushagraPhoto ? (
                        <div className="w-24 h-24 rounded-2xl shadow-md border-4 border-slate-900 bg-slate-100 flex-shrink-0 relative overflow-hidden">
                          <img 
                            src={getDirectImageUrl(kushagraPhoto)} 
                            alt={dev.name} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : (
                        renderKushagraSVG()
                      )
                    )}
                  </div>
                </div>
                
                {/* Visual Label */}
                <div className="flex flex-col items-end gap-1">
                  <div className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg text-[9px] text-slate-500 font-extrabold shadow-inner flex items-center gap-1 select-none">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>आधिकारिक डेटा</span>
                  </div>
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
                    <a 
                      href={`mailto:${dev.email}`}
                      className="text-indigo-650 font-black mt-0.5 block hover:underline truncate"
                      title={dev.email}
                    >
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 inline-block" />
                        <span>{dev.email}</span>
                      </span>
                    </a>
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
              </div>
            </div>
          );
        })}
      </div>

      {/* Patriotic Code Terminal for kids */}
      <div className="bg-slate-900 text-white rounded-[32px] p-6 shadow-md border-2 border-slate-750 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-850 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-yellow-400/10 text-yellow-500 rounded-lg">
              <Terminal className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-xs font-black tracking-wide font-mono md:text-sm text-yellow-300">
                🧭 कोड वर्कस्पेस - Patriotic Codes
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold">
                इस एप में कुछ गुप्त संदेश शब्द छिपे हैं, टाइप करके जादुई संदेश देखें!
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg font-black font-mono">
            <Star className="w-3 h-3 text-emerald-400 animate-spin" />
            <span>ACTIVE WORKSPACE</span>
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
              placeholder="यहाँ गुप्त कोड टाइप करें (जैसे: INDIA, SAMVIDHAN)"
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
}
