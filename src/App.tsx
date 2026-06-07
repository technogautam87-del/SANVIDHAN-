/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from "react";
import { Landmark, Award, BookOpen, Star, HelpCircle, Volume2, ShieldAlert, Heart, RefreshCw } from "lucide-react";
import HomeSection from "./components/HomeSection";
import HistorySection from "./components/HistorySection";
import FeaturesSection from "./components/FeaturesSection";
import RightsSection from "./components/RightsSection";
import DutiesSection from "./components/DutiesSection";
import ElectionSection from "./components/ElectionSection";
import QuizSection from "./components/QuizSection";
import PreambleSection from "./components/PreambleSection";
import SamvidhanMitra from "./components/SamvidhanMitra";
import DevelopersSection from "./components/DevelopersSection";
import ArticlesSection from "./components/ArticlesSection";
import SignLanguageSection from "./components/SignLanguageSection";
import AdminPanelSection from "./components/AdminPanelSection";
import BadgesSection from "./components/BadgesSection";
import { MascotMood } from "./types";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "./lib/firebase";
import BadgeCelebrationModal, { BadgeInfo } from "./components/BadgeCelebrationModal";
import LegalDictionary from "./components/LegalDictionary";

export const BADGES: BadgeInfo[] = [
  {
    id: "history",
    name: "इतिहास अन्वेषक पदक",
    englishName: "History Investigator Badge",
    emoji: "⏳",
    desc: "भारत के गौरवशाली इतिहास तथा प्रारूप समिति की सभी पहेलियों को शत-प्रतिशत सही सुलझाने वाले प्रतिभाशाली विद्यार्थी को यह सम्मान दिया जाता है।",
    color: "from-amber-400 via-orange-500 to-amber-600",
    accent: "bg-orange-500"
  },
  {
    id: "rights",
    name: "अधिकार रक्षक पदक",
    englishName: "Guardian of Rights Medal",
    emoji: "🛡️",
    desc: "समानता, स्वतंत्रता और शिक्षा के सभी ६ मौलिक अधिकार सिमुलेशन खेलों को समझदारी से खेलकर समाज में अधिकारों की रक्षा करने वाले रक्षक को यह मेडल मिलता है।",
    color: "from-pink-400 via-rose-500 to-pink-600",
    accent: "bg-pink-505"
  },
  {
    id: "duties",
    name: "कर्तव्यनिष्ठ नागरिक पदक",
    englishName: "Dutybound Citizen Medal",
    emoji: "🌱",
    desc: "राष्ट्रगान का सम्मान, तिरंगे की शान, और स्वच्छता जैसे ११ मौलिक कर्तव्यों व सुसंस्कृत आदतों की सही पहचान करने वाले देशभक्त बाल नागरिक को यह पदक मिलता है।",
    color: "from-yellow-400 via-emerald-500 to-green-600",
    accent: "bg-emerald-500"
  },
  {
    id: "election",
    name: "सक्रिय जागरूक मतदाता पदक",
    englishName: "Aware Active Voter Medal",
    emoji: "🗳️",
    desc: "सफलतापूर्वक अपना वोटर आईडी कार्ड बनाने, सुरक्षित ईवीएम मतदान करने तथा मतगणना और लोकतांत्रिक परिणामों का प्रत्यक्ष सिमुलेशन पूर्ण करने हेतु मिलता है।",
    color: "from-purple-400 via-indigo-500 to-purple-600",
    accent: "bg-purple-500"
  },
  {
    id: "quiz",
    name: "संविधान सुपरस्टार पदक",
    englishName: "Constitution Quiz Superstar Badge",
    emoji: "👑",
    desc: "सीखो व खेलो क्विज़ में संविधान से संबंधित कठिन प्रश्नों का त्वरित व उच्चतम कौशल के साथ उत्तर (न्यूनतम ८/१२ मार्क्स) देकर सर्वोच्च प्रतिष्ठा हासिल करने पर मिलता है।",
    color: "from-yellow-300 via-amber-400 to-orange-500",
    accent: "bg-amber-500"
  },
  {
    id: "sign",
    name: "समरसता दूत सम्मान पदक",
    englishName: "Harmony Sign Language Ambassador",
    emoji: "🤝",
    desc: "संविधान, भारत, स्वतंत्रता, और लोकतंत्र जैसे भारतीय सांकेतिक भाषा के सभी ६ महत्वपूर्ण मूक-बधिर साक्षरता पाठों को कुशलतापूर्वक पूर्ण करने वाले दूत को समर्पित।",
    color: "from-teal-400 via-cyan-500 to-teal-600",
    accent: "bg-teal-500"
  }
];

export default function App() {
  const [activeTab, setActiveTabInternal] = useState<string>("home");
  const [score, setScore] = useState<number>(() => {
    const saved = localStorage.getItem("samvidhan_score");
    return saved ? parseInt(saved, 10) : 0;
  });

  // Track global web page clicks & total system-wide views (loads & page transitions)
  const [totalWebPageClicks, setTotalWebPageClicks] = useState<number>(() => {
    const saved = localStorage.getItem("samvidhan_total_clicks");
    if (saved) return Number(saved);
    // Combine previous tab click stats + excellent legacy active baseline
    const oldArticleClicks = Number(localStorage.getItem("samvidhan_articles_tab_clicks")) || 0;
    const firstSeed = 385 + oldArticleClicks;
    localStorage.setItem("samvidhan_total_clicks", String(firstSeed));
    return firstSeed;
  });
  const [totalWebPageViews, setTotalWebPageViews] = useState<number>(() => {
    const saved = localStorage.getItem("samvidhan_total_views");
    if (saved) return Number(saved);
    // Combine previous tab view stats + excellent legacy active baseline
    const oldArticleViews = Number(localStorage.getItem("samvidhan_articles_tab_displays")) || 0;
    const firstSeed = 842 + oldArticleViews;
    localStorage.setItem("samvidhan_total_views", String(firstSeed));
    return firstSeed;
  });

  // Increment total views on load and listen to global clicks anywhere on the web page
  useEffect(() => {
    setTotalWebPageViews((prev) => {
      const nextViews = prev + 1;
      localStorage.setItem("samvidhan_total_views", String(nextViews));
      return nextViews;
    });

    const handleGlobalClick = () => {
      setTotalWebPageClicks((prev) => {
        const nextClicks = prev + 1;
        localStorage.setItem("samvidhan_total_clicks", String(nextClicks));
        return nextClicks;
      });
    };

    window.addEventListener("click", handleGlobalClick);
    return () => {
      window.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  // Real-time globally synced Firebase settings (articles and developers info)
  useEffect(() => {
    // Listen to /settings/articles
    const unsubscribeArticles = onSnapshot(doc(db, "settings", "articles"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const customUrls = data.customUrls || {};
        const clickCounts = data.clickCounts || {};

        // Sync into localStorage
        Object.entries(customUrls).forEach(([artId, val]) => {
          if (val) {
            localStorage.setItem(`samvidhan_article_yt_${artId}`, String(val));
          } else {
            localStorage.removeItem(`samvidhan_article_yt_${artId}`);
          }
        });

        Object.entries(clickCounts).forEach(([artId, count]) => {
          localStorage.setItem(`samvidhan_article_clicks_${artId}`, String(count));
        });

        // Fire global memory event
        window.dispatchEvent(new Event("storage"));
      }
    }, (error) => {
      console.warn("Firestore articles listener subscription error:", error);
    });

    // Listen to /settings/developers
    const unsubscribeDevelopers = onSnapshot(doc(db, "settings", "developers"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        
        // Gautam settings sync
        const gKeys = [
          "gautam_photo",
          "gautam_email",
          "gautam_social_github",
          "gautam_social_linkedin",
          "gautam_social_youtube",
          "gautam_social_portfolio"
        ];
        gKeys.forEach((key) => {
          if (data[key] !== undefined) {
            localStorage.setItem(key, String(data[key]));
          }
        });

        // Kushagra settings sync
        const kKeys = [
          "kushagra_photo",
          "kushagra_email",
          "kushagra_social_github",
          "kushagra_social_linkedin",
          "kushagra_social_youtube",
          "kushagra_social_portfolio"
        ];
        kKeys.forEach((key) => {
          if (data[key] !== undefined) {
            localStorage.setItem(key, String(data[key]));
          }
        });

        // Fire global memory event
        window.dispatchEvent(new Event("storage"));
      }
    }, (error) => {
      console.warn("Firestore developers listener subscription error:", error);
    });

    // Listen to /settings/sign_videos
    const unsubscribeSignVideos = onSnapshot(doc(db, "settings", "sign_videos"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        localStorage.setItem("samvidhan_sign_videos", JSON.stringify(data));
        // Fire global memory event
        window.dispatchEvent(new Event("storage"));
      }
    }, (error) => {
      console.warn("Firestore sign_videos listener subscription error:", error);
    });

    return () => {
      unsubscribeArticles();
      unsubscribeDevelopers();
      unsubscribeSignVideos();
    };
  }, []);

  const setActiveTab = (tabId: string) => {
    setActiveTabInternal(tabId);
    // Increment total views on tab transition for responsive tracking
    setTotalWebPageViews((prev) => {
      const nextViews = prev + 1;
      localStorage.setItem("samvidhan_total_views", String(nextViews));
      return nextViews;
    });
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("samvidhan_voice");
    return saved ? saved === "true" : true;
  });

  const [mascotData, setMascotData] = useState<{ mood: MascotMood; text: string }>({
    mood: "greeting",
    text: "नमस्ते बच्चो! मैं हूँ 'संविधान मित्र'। आज हम मिलकर खेल-खेल में हमारे प्यारे भारत के संविधान को अत्यंत सरल शब्दों में सीखेंगे।"
  });

  // Keep score in localstorage
  useEffect(() => {
    localStorage.setItem("samvidhan_score", score.toString());
  }, [score]);

  // Keep voice preference
  useEffect(() => {
    localStorage.setItem("samvidhan_voice", voiceEnabled.toString());
  }, [voiceEnabled]);

  const incrementScore = useCallback((points: number) => {
    setScore(prev => prev + points);
  }, []);

  const resetAllProgress = () => {
    if (confirm("यदि आप प्रगति रीसेट करते हैं, तो आपका पूरा स्कोर शून्य (0) हो जाएगा। क्या आप प्रगति मिटाना चाहते हैं?")) {
      setScore(0);
      localStorage.removeItem("samvidhan_score");
      localStorage.removeItem("samvidhan_completed_rights");
      localStorage.removeItem("samvidhan_duties_classifications");
      localStorage.removeItem("samvidhan_duties_evaluated");
      localStorage.removeItem("samvidhan_election_step");
      localStorage.removeItem("samvidhan_election_voter_name");
      localStorage.removeItem("samvidhan_election_voter_age");
      localStorage.removeItem("samvidhan_election_voter_symbol");
      localStorage.removeItem("samvidhan_election_voter_id");
      localStorage.removeItem("samvidhan_election_completed");
      localStorage.removeItem("samvidhan_quiz_high_score");
      localStorage.removeItem("samvidhan_features_viewed");
      localStorage.removeItem("samvidhan_history_puzzles");
      localStorage.removeItem("samvidhan_celebrated_badges");
      setActiveTab("home");
      setMascotData({
        mood: "happy",
        text: "आपकी प्रगति रीसेट कर दी गई है! चलो फिर से आरंभ से शुरू करते हैं।"
      });
    }
  };

  // Active state for celebrating badge unlocks
  const [activeCelebratingBadge, setActiveCelebratingBadge] = useState<BadgeInfo | null>(null);

  // Analyze badge completions in real-time and award accolades
  useEffect(() => {
    const handleCheckBadges = () => {
      // 1. History Investigator Badge
      let historyDone = false;
      try {
        const saved = localStorage.getItem("samvidhan_history_puzzles");
        if (saved) {
          const parsed = JSON.parse(saved);
          historyDone = Array.isArray(parsed) && parsed.filter(Boolean).length === 3;
        }
      } catch (e) {}

      // 2. Guardian of Rights Medal
      let rightsDone = false;
      try {
        const saved = localStorage.getItem("samvidhan_completed_rights");
        if (saved) {
          const parsed = JSON.parse(saved);
          rightsDone = Array.isArray(parsed) && parsed.length === 6;
        }
      } catch (e) {}

      // 3. Dutybound Citizen Medal
      let dutiesDone = false;
      try {
        const saved = localStorage.getItem("samvidhan_duties_evaluated");
        if (saved) {
          const parsed = JSON.parse(saved);
          dutiesDone = Array.isArray(parsed) && parsed.length === 6;
        }
      } catch (e) {}

      // 4. Aware Active Voter Medal
      const votingDone = localStorage.getItem("samvidhan_election_completed") === "true";

      // 5. Constitution Quiz Superstar Badge
      const quizScore = parseInt(localStorage.getItem("samvidhan_quiz_high_score") || "0", 10);
      const quizDone = quizScore >= 8;

      // 6. Harmony Sign Language Ambassador Badge
      let signDone = false;
      try {
        const saved = localStorage.getItem("samvidhan_completed_sign_lessons");
        if (saved) {
          const parsed = JSON.parse(saved);
          signDone = Array.isArray(parsed) && parsed.length === 6;
        }
      } catch (e) {}

      // Load celebrated badges list
      let celebrated: string[] = [];
      try {
        const saved = localStorage.getItem("samvidhan_celebrated_badges");
        celebrated = saved ? JSON.parse(saved) : [];
      } catch (e) {}

      const checkAndAwardBadge = (badgeId: string, isCompleted: boolean) => {
        if (isCompleted && !celebrated.includes(badgeId)) {
          celebrated.push(badgeId);
          localStorage.setItem("samvidhan_celebrated_badges", JSON.stringify(celebrated));
          
          // Display the celebratory accolades
          const currentBadge = BADGES.find((b) => b.id === badgeId);
          if (currentBadge) {
            setActiveCelebratingBadge(currentBadge);
            setScore((prev) => prev + 50); // Give +50 bonus XP reward
          }
          return true; // Award one badge per check turn to build suspense
        }
        return false;
      };

      // Check and award badges sequentially
      if (checkAndAwardBadge("rights", rightsDone)) return;
      if (checkAndAwardBadge("duties", dutiesDone)) return;
      if (checkAndAwardBadge("election", votingDone)) return;
      if (checkAndAwardBadge("quiz", quizDone)) return;
      if (checkAndAwardBadge("sign", signDone)) return;
      if (checkAndAwardBadge("history", historyDone)) return;
    };

    // Initialize checking
    handleCheckBadges();

    // Attach listener for real-time internal updates
    window.addEventListener("storage", handleCheckBadges);
    return () => {
      window.removeEventListener("storage", handleCheckBadges);
    };
  }, []);

  const handleToggleVoice = () => {
    setVoiceEnabled(prev => !prev);
  };

  // Safe callback setter for sub-modules to update the mascot globally
  const handleSetMascotData = useCallback((data: { mood: MascotMood; text: string }) => {
    setMascotData(data);
  }, []);

  const navigationTabs = [
    { id: "home", label: "🏠 होम", color: "hover:border-orange-400 text-slate-700 hover:text-orange-600 font-bold" },
    { id: "history", label: "🕒 इतिहास", color: "hover:border-blue-400 text-slate-700 hover:text-blue-600 font-bold" },
    { id: "preamble", label: "📜 उद्देशिका", color: "hover:border-indigo-400 text-slate-700 hover:text-indigo-600 font-bold" },
    { id: "features", label: "🔰 विशेषताएँ", color: "hover:border-emerald-400 text-slate-700 hover:text-emerald-600 font-bold" },
    { id: "articles", label: "📖 संविधान अनुच्छेद", color: "hover:border-cyan-400 text-slate-700 hover:text-cyan-600 font-bold" },
    { id: "signlanguage", label: "🤟 सांकेतिक भाषा", color: "hover:border-teal-400 text-slate-700 hover:text-teal-600 font-bold" },
    { id: "rights", label: "⚖️ अधिकार खेल", color: "hover:border-pink-400 text-slate-700 hover:text-pink-600 font-bold" },
    { id: "duties", label: "🎉 कर्तव्य बोर्ड", color: "hover:border-yellow-400 text-slate-700 hover:text-yellow-600 font-bold" },
    { id: "election", label: "🗳️ चुनाव बूथ", color: "hover:border-green-400 text-slate-700 hover:text-green-600 font-bold" },
    { id: "quiz", label: "🎯 सीखो व खेलो", color: "hover:border-amber-400 text-slate-700 hover:text-amber-600 font-bold" },
    { id: "badges", label: "🏆 मेडल गैलरी", color: "hover:border-amber-400 text-slate-700 hover:text-amber-600 font-bold" },
    { id: "developers", label: "💻 डेवलपर्स", color: "hover:border-purple-400 text-slate-700 hover:text-purple-600 font-bold" },
    { id: "admin", label: "🔐 एडमिन पैनल", color: "hover:border-rose-400 text-slate-750 hover:text-rose-600 font-bold" }
  ];

  const getTabBorderColor = () => {
    switch (activeTab) {
      case "history": return "border-blue-400 shadow-[0_12px_0_#3b82f6]";
      case "preamble": return "border-indigo-400 shadow-[0_12px_0_#6366f1]";
      case "articles": return "border-cyan-400 shadow-[0_12px_0_#06b6d4]";
      case "signlanguage": return "border-teal-500 shadow-[0_12px_0_#14b8a6]";
      case "rights": return "border-pink-500 shadow-[0_12px_0_#ec4899]";
      case "duties": return "border-yellow-400 shadow-[0_12px_0_#facc15]";
      case "election": return "border-green-500 shadow-[0_12px_0_#22c55e]";
      case "quiz": return "border-amber-500 shadow-[0_12px_0_#f59e0b]";
      case "badges": return "border-amber-400 shadow-[0_12px_0_#d97706]";
      case "developers": return "border-purple-500 shadow-[0_12px_0_#a855f7]";
      case "admin": return "border-rose-500 shadow-[0_12px_0_#f43f5e]";
      default: return "border-orange-400 shadow-[0_12px_0_#f97316]";
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 text-slate-800 pb-20 font-sans selection:bg-orange-100 selection:text-orange-900 antialiased">
      {/* Decorative Tricolor Top bar */}
      <div className="h-2 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600"></div>

      {/* Main Header */}
      <header className="bg-white border-b-4 border-orange-400 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-11 h-11 bg-orange-500 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg transform group-hover:scale-110 transition-transform">
              स
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-green-600 italic flex items-center gap-2">
                <span>संविधान मित्र</span>
                <span className="text-[10px] non-italic text-amber-900 bg-amber-100 border-2 border-amber-300 px-2.5 py-0.5 rounded-full font-black">
                  बाल संस्करण
                </span>
              </h1>
              <p className="text-[10px] text-slate-500 font-extrabold hidden md:block">
                भारतीय संविधान: खेल-खेल में सीखें
              </p>
            </div>
          </div>

          {/* Nav Links for Laptop Displays */}
          <nav className="hidden lg:flex items-center gap-2">
            {navigationTabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`px-4 py-2 text-xs font-black rounded-xl transition-all border-2 cursor-pointer ${
                    active
                      ? "bg-orange-100 border-orange-400 text-orange-700 shadow-inner"
                      : `bg-white border-transparent ${tab.color}`
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Action pills (Score, voice, reset) */}
          <div className="flex items-center gap-3">
            {/* Overall Game Score */}
            <div className="bg-yellow-50 border-3 border-yellow-300 px-4 py-2 rounded-2xl flex items-center gap-1.5 text-xs font-black shadow-md text-yellow-850" title="आपका कुल स्कोर">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>पॉइंट्स: <strong>{score} XP</strong></span>
            </div>

            {/* Narration helper */}
            <button
              onClick={handleToggleVoice}
              className={`p-2.5 rounded-xl transition cursor-pointer border-2 ${
                voiceEnabled
                  ? "bg-emerald-50 border-emerald-400 text-emerald-700 hover:bg-emerald-100 shadow-sm"
                  : "bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200"
              }`}
              title={voiceEnabled ? "ऑडियो विवरण बंद करें" : "ऑडियो विवरण ऑन करें"}
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Clear progress */}
            <button
              onClick={resetAllProgress}
              className="p-2.5 border-2 border-slate-300 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl transition cursor-pointer shadow-xs"
              title="अपनी पूरी प्रगति साफ़ करें"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar for smaller screens */}
        <div className="border-t border-slate-100 lg:hidden py-3 bg-white flex overflow-x-auto px-4 gap-2 h-14 scrollbar-none">
          {navigationTabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-4 py-1 text-[11px] font-black rounded-full flex-shrink-0 cursor-pointer transition-all border ${
                  active
                    ? "bg-orange-500 text-white border-orange-600 shadow-sm"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Body Stage */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-10">
        
        {/* Dynamic Mounted Module Route Renderer */}
        <div className={`bg-white border-4 rounded-[40px] p-5 md:p-8 transition-all duration-300 ${getTabBorderColor()}`}>
          {activeTab === "home" && (
            <HomeSection onNavigate={handleTabClick} setMascotData={handleSetMascotData} />
          )}
          {activeTab === "history" && (
            <HistorySection setMascotData={handleSetMascotData} />
          )}
          {activeTab === "preamble" && (
            <PreambleSection setMascotData={handleSetMascotData} />
          )}
          {activeTab === "features" && (
            <FeaturesSection onNavigate={handleTabClick} setMascotData={handleSetMascotData} />
          )}
          {activeTab === "articles" && (
            <ArticlesSection setMascotData={handleSetMascotData} />
          )}
          {activeTab === "signlanguage" && (
            <SignLanguageSection setMascotData={handleSetMascotData} incrementScore={incrementScore} />
          )}
          {activeTab === "rights" && (
            <RightsSection setMascotData={handleSetMascotData} incrementScore={incrementScore} />
          )}
          {activeTab === "duties" && (
            <DutiesSection setMascotData={handleSetMascotData} incrementScore={incrementScore} />
          )}
          {activeTab === "election" && (
            <ElectionSection setMascotData={handleSetMascotData} incrementScore={incrementScore} />
          )}
          {activeTab === "quiz" && (
            <QuizSection setMascotData={handleSetMascotData} incrementScore={incrementScore} gameScore={score} />
          )}
          {activeTab === "badges" && (
            <BadgesSection onNavigate={handleTabClick} setMascotData={handleSetMascotData} score={score} />
          )}
          {activeTab === "developers" && (
            <DevelopersSection setMascotData={handleSetMascotData} />
          )}
          {activeTab === "admin" && (
            <AdminPanelSection setMascotData={handleSetMascotData} />
          )}
        </div>

        {/* Persistent Mascot "Samvidhan Mitra Notification Console" */}
        <section className="mt-8 border-t pt-8">
          <div className="flex justify-center md:justify-end">
            <SamvidhanMitra
              mood={mascotData.mood}
              text={mascotData.text}
              voiceEnabled={voiceEnabled}
              onToggleVoice={handleToggleVoice}
            />
          </div>
        </section>
      </main>

      {/* Humble Aesthetic Footer */}
      <footer className="mt-12 py-8 bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 text-slate-200 border-t-4 border-orange-500 font-sans shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left Side: Real-time Web Portal/Entire App global click & view tracker */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950/85 border border-indigo-500/30 rounded-[28px] p-4 text-xs shadow-inner w-full md:w-auto">
            <div className="flex items-center gap-2 mb-2 sm:mb-0">
              <span className="text-3xl animate-bounce">📊</span>
              <div className="text-left">
                <h4 className="font-black text-[12px] text-slate-100 uppercase tracking-wide leading-none">
                  संपूर्ण पोर्टल ट्रैकर • Total Portal Hits
                </h4>
                <p className="text-[10px] text-emerald-400 font-extrabold mt-1.5 uppercase tracking-wider">
                  ⚡ LIVE PORTAL ENGAGEMENT
                </p>
              </div>
            </div>
            
            <div className="flex gap-2.5 shrink-0">
              <div className="bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-800 flex flex-col items-center shadow-xs">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">कुल क्लिक (Total Clicks)</span>
                <span className="text-sm font-black text-amber-400 font-mono mt-0.5 animate-pulse">
                  {totalWebPageClicks} बार
                </span>
              </div>
              
              <div className="bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-800 flex flex-col items-center shadow-xs">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">कुल पेज व्यूज (Total Views)</span>
                <span className="text-sm font-black text-rose-400 font-mono mt-0.5">
                  {totalWebPageViews} बार
                </span>
              </div>
            </div>
          </div>

          {/* Right/Center Side: Slogans & Copyright details */}
          <div className="text-center md:text-right space-y-2.5">
            <p className="text-[12.5px] font-black text-amber-300 drop-shadow-sm tracking-wide">
              © 2026 भारत सरकार डिजिटल बाल साक्षरता अभियान। विशेष संस्करण।
            </p>
            <p className="text-slate-300 font-extrabold text-[11px] select-none tracking-wide italic">
              "अनेकता में एकता, यही है भारत की विशेषता!" 🇮🇳
            </p>
            <div className="pt-3 border-t border-slate-800 text-[10px] text-orange-400 font-mono tracking-wider font-black uppercase flex flex-col sm:flex-row items-center justify-center md:justify-end gap-2.5 sm:gap-4">
              <span className="text-[11px] text-amber-400 font-black flex items-center gap-1.5 animate-pulse">
                🚀 DEVELOPED BY :
              </span>
              <div className="flex flex-wrap gap-2.5 justify-center">
                <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-slate-950 font-extrabold px-4 py-2 rounded-2xl border-2 border-orange-300 shadow-md hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer select-none flex items-center gap-1.5">
                  🎓 Chandra Shekhar Gautam
                </span>
                <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-extrabold px-4 py-2 rounded-2xl border-2 border-emerald-300 shadow-md hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer select-none flex items-center gap-1.5">
                  🚀 Kushagra Gaur
                </span>
              </div>
            </div>
          </div>

        </div>
      </footer>

      <BadgeCelebrationModal
        isOpen={activeCelebratingBadge !== null}
        badge={activeCelebratingBadge}
        onClose={() => setActiveCelebratingBadge(null)}
      />
      <LegalDictionary />
    </div>
  );
}
