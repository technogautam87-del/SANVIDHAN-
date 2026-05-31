/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from "react";
import { BookOpen, Award, Compass, HelpCircle, ArrowRight, Sparkles, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from "recharts";

interface HomeSectionProps {
  onNavigate: (section: string) => void;
  setMascotData: (data: { mood: "happy" | "thinking" | "excited" | "proud" | "speaking" | "greeting"; text: string }) => void;
}

export default function HomeSection({ onNavigate, setMascotData }: HomeSectionProps) {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    const closed = sessionStorage.getItem("samvidhan_welcome_closed");
    if (!closed) {
      setShowWelcomeModal(true);
    }
  }, []);

  const closeWelcomeModal = () => {
    sessionStorage.setItem("samvidhan_welcome_closed", "true");
    setShowWelcomeModal(false);
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {}
  };

  const [chartType, setChartType] = useState<"radar" | "bar">("radar");

  const assemblyQuotes = [
    {
      author: "डॉ. भीमराव आंबेडकर (Dr. B.R. Ambedkar)",
      role: "संविधान निर्माता • प्रारूप समिति अध्यक्ष",
      quote: "संविधान केवल एक कानूनी दस्तावेज़ नहीं है, यह तो एक युग-परिवर्तक जीवन मार्गदर्शक है। इसकी आत्मा हमेशा समाज और बच्चों की स्वतंत्रता, समानता और बंधुत्व की रक्षा करती है। 🌟",
      bannerStyle: "from-orange-50 to-amber-50 border-orange-300 text-slate-850",
      accentDot: "bg-amber-600"
    },
    {
      author: "पंडित जवाहरलाल नेहरू (Jawaharlal Nehru)",
      role: "राष्ट्र निर्माता • स्वतंत्र भारत के प्रथम प्रधानमंत्री",
      quote: "संविधान सभा का यह पावन कार्य केवल नियमों को संजोना नहीं है, वरन् हमारे देश के प्रत्येक बालक और भावी पीढ़ी के लिए एक सुंदर, समृद्ध व समतावादी राष्ट्र का संकल्प है। 🌹",
      bannerStyle: "from-rose-50 to-orange-50 border-rose-300 text-slate-850",
      accentDot: "bg-rose-500"
    },
    {
      author: "डॉ. राजेंद्र प्रसाद (Dr. Rajendra Prasad)",
      role: "संविधान सभा के अध्यक्ष • प्रथम राष्ट्रपति",
      quote: "यदि हमारे भावी कर्णधार बच्चे और जनप्रतिनिधि चरित्रवान, परोपकारी व सच्चे देशप्रेमी होंगे, तो यह संविधान सोने की कसौटी पर खड़ा उतरेगा और देश को नई ऊंचाइयों पर ले जाएगा। 🤝",
      bannerStyle: "from-emerald-50 to-teal-50 border-emerald-300 text-slate-850",
      accentDot: "bg-emerald-500"
    }
  ];

  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveQuoteIndex((prev) => (prev + 1) % assemblyQuotes.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setMascotData({
      mood: "greeting",
      text: "नमस्ते बच्चों! मैं हूँ आपका 'संविधान मित्र'। आज हम मिलकर हमारे प्यारे भारत के सबसे बड़े नियम-कानून की किताब—'संविधान' को बहुत ही सरल, मजेदार और खेल-खेल में समझेंगे। चलो शुरू करें!"
    });
  }, [setMascotData]);

  // Raw solved counts parsing for accurate historical reports
  const solvedPuzzles = useMemo(() => {
    const saved = localStorage.getItem("samvidhan_history_puzzles");
    if (!saved) return 0;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter(Boolean).length : 0;
    } catch {
      return 0;
    }
  }, []);

  const solvedRights = useMemo(() => {
    const saved = localStorage.getItem("samvidhan_completed_rights");
    if (!saved) return 0;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  }, []);

  const solvedDuties = useMemo(() => {
    const savedEval = localStorage.getItem("samvidhan_duties_evaluated");
    if (!savedEval) return 0;
    try {
      const evaluated = JSON.parse(savedEval);
      return Array.isArray(evaluated) ? evaluated.length : 0;
    } catch {
      return 0;
    }
  }, []);

  const solvedSign = useMemo(() => {
    const saved = localStorage.getItem("samvidhan_completed_sign_lessons");
    if (!saved) return 0;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  }, []);

  const quizHighScore = useMemo(() => {
    const savedScore = localStorage.getItem("samvidhan_quiz_high_score");
    return savedScore ? parseInt(savedScore, 10) || 0 : 0;
  }, []);

  const electionStatusRaw = useMemo(() => {
    const completed = localStorage.getItem("samvidhan_election_completed") === "true";
    if (completed) return "परिणाम (Voted & Outcome Decided) 🎉";
    const step = localStorage.getItem("samvidhan_election_step");
    if (step === "winner") return "विजेता घोषित 👑";
    if (step === "counting") return "गणना हो रही है 📈";
    if (step === "booth") return "वोट डाला गया 🗳️";
    if (step === "card-creation") return "वोटर कार्ड बना 🆔";
    return "वोट नहीं डाला 🚫";
  }, []);

  // Dynamic progress parsing from localStorage for History Section mini puzzles
  const historyPct = useMemo(() => {
    return Math.round((solvedPuzzles / 3) * 100);
  }, [solvedPuzzles]);

  // Dynamic progress parsing from localStorage for Rights Simulators
  const rightsPct = useMemo(() => {
    return Math.round((solvedRights / 6) * 100);
  }, [solvedRights]);

  // Dynamic progress parsing from localStorage for Duties game
  const dutiesPct = useMemo(() => {
    return Math.round((solvedDuties / 6) * 100);
  }, [solvedDuties]);

  // Dynamic progress parsing from localStorage for Sign Language lessons
  const signPct = useMemo(() => {
    return Math.round((solvedSign / 6) * 100);
  }, [solvedSign]);

  // Dynamic progress parsing from localStorage for election booth steps
  const electionPct = useMemo(() => {
    const completed = localStorage.getItem("samvidhan_election_completed") === "true";
    if (completed) return 100;
    const step = localStorage.getItem("samvidhan_election_step");
    if (step === "winner") return 100;
    if (step === "counting") return 75;
    if (step === "booth") return 50;
    if (step === "card-creation") return 25;
    return 0;
  }, []);

  // Dynamic progress parsing from localStorage for Quiz superstars
  const quizPct = useMemo(() => {
    return Math.round((quizHighScore / 12) * 100);
  }, [quizHighScore]);

  // Calculate global average mastery rating (out of 6 core sections)
  const averagePct = useMemo(() => {
    return Math.round((historyPct + rightsPct + dutiesPct + electionPct + quizPct + signPct) / 6);
  }, [historyPct, rightsPct, dutiesPct, electionPct, quizPct, signPct]);

  // Chart data formatting
  const chartData = useMemo(() => [
    { name: "इतिहास (History)", percentage: historyPct, color: "#f97316" },
    { name: "अधिकार (Rights)", percentage: rightsPct, color: "#ec4899" },
    { name: "कर्तव्य (Duties)", percentage: dutiesPct, color: "#eab308" },
    { name: "चुनाव (Elections)", percentage: electionPct, color: "#22c55e" },
    { name: "क्विज़ (Quiz)", percentage: quizPct, color: "#d97706" },
    { name: "सांकेतिक (Sign)", percentage: signPct, color: "#14b8a6" }
  ], [historyPct, rightsPct, dutiesPct, electionPct, quizPct, signPct]);

  // Multi-lingual kid-friendly grade evaluation
  const getGradeDetails = (pct: number) => {
    if (pct >= 90) return { grade: "A+", desc: "🎖️ संविधान महानायक (Supreme Hero) ! आप लोकतंत्र के असली रक्षक हैं।" };
    if (pct >= 70) return { grade: "A", desc: "🛡️ लोकतंत्र योद्धा (Democracy Warrior) ! आपको नागरिक अधिकारों की उत्तम समझ है।" };
    if (pct >= 50) return { grade: "B", desc: "🎓 संविधान विशेषज्ञ (Constitution Expert) ! आप एक जागरूक राष्ट्र निर्माता बन रहे हैं।" };
    if (pct >= 20) return { grade: "C", desc: "🌱 जागरूक बाल नागरिक (Aware Kid Citizen) ! अच्छी शुरुआत है, इसे और आगे बढ़ाएं।" };
    return { grade: "D", desc: "🚀 नव शिक्षार्थी (Young Learner) ! चलो सारे सिमुलेशन खेलकर अपनी प्रगति बढ़ाते हैं।" };
  };

  const gradeInfo = useMemo(() => getGradeDetails(averagePct), [averagePct]);

  const cards = [
    {
      id: "history",
      title: "संविधान का इतिहास",
      desc: "एनिमेशन के साथ देखें कि हमारे देश का संविधान कब और कैसे बना, और इसके जनक कौन हैं।",
      color: "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100",
      accent: "bg-orange-500",
      icon: BookOpen,
      actionText: "इतिहास देखें",
      progress: historyPct
    },
    {
      id: "rights",
      title: "अधिकार चुनो और जानो",
      desc: "क्या आप जानते हैं कि आपके पास समानता और पढ़ाई के क्या अधिकार हैं? सिमुलेशन से खुद जानें!",
      color: "bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100",
      accent: "bg-sky-500",
      icon: Compass,
      actionText: "अधिकार चुनें",
      progress: rightsPct
    },
    {
      id: "duties",
      title: "प्यारा कर्तव्य खेल",
      desc: "तिरंगे का सम्मान और पर्यावरण की रक्षा जैसे हमारे 11 पावन कर्तव्य। सही आदतें चुनें!",
      color: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100",
      accent: "bg-emerald-500",
      icon: Award,
      actionText: "कर्तव्य खेलें",
      progress: dutiesPct
    },
    {
      id: "election",
      title: "चुनाव और लोकतंत्र",
      desc: "अपना वोटर कार्ड खुद बनाएं, ईवीएम मशीन से वोट डालें और लाइव चुनाव परिणाम देखें!",
      color: "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100",
      accent: "bg-purple-500",
      icon: Sparkles,
      actionText: "वोट डालें",
      progress: electionPct
    },
    {
      id: "quiz",
      title: "सीखो और खेलो क्विज़",
      desc: "क्या आप संविधान का 'सुपरस्टार' बनना चाहते हैं? प्रश्नों के सही उत्तर दें और स्कोर बोर्ड में नाम दर्ज कराएं!",
      color: "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100",
      accent: "bg-amber-500",
      icon: HelpCircle,
      actionText: "क्विज़ शुरू करें",
      progress: quizPct
    }
  ];

  return (
    <div id="home-section" className="space-y-8 py-2">
      {/* 🔮 BEAUTIFUL WELCOME POPUP MODAL (सादर आमंत्रण पॉपअप) */}
      <AnimatePresence>
        {showWelcomeModal && (
          <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              className="bg-white border-4 border-amber-400 rounded-[35px] max-w-md w-full p-6 text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-orange-500 via-yellow-400 to-green-500"></div>
              
              <span className="text-5xl block my-3 filter drop-shadow-sm select-none animate-bounce">🇮🇳🎓</span>
              
              <h3 className="text-xl font-black text-slate-800">
                नमस्ते बाल नागरिक! 🌟
              </h3>
              <p className="text-xs text-orange-600 font-extrabold tracking-wide uppercase mt-1">
                "हमारा संविधान" डिजिटल पाठशाला में आपका स्वागत है!
              </p>

              <div className="my-5 bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs font-semibold text-slate-700 leading-relaxed text-left space-y-2">
                <p>
                  यहाँ आप खेल-खेल में जानेंगे हमारे भारत के सबसे महत्वपूर्ण नियम कानून की किताब 'संविधान' के बारे में!
                </p>
                <p>
                  ईवीएम से वोट डालें, अपने अधिकारों और कर्तव्यों को समझें और मजेदार खेल खेलें।
                </p>
              </div>

              <button
                type="button"
                onClick={closeWelcomeModal}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black py-3 px-6 rounded-2xl shadow-md hover:opacity-90 transform active:scale-95 transition-all text-xs"
              >
                चलो शुरू करें! 🚀
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🌟 HERO HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-[40px] p-8 relative overflow-hidden shadow-xl border-4 border-slate-800 text-left"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3.5 py-1 rounded-full text-xs font-black tracking-wide mb-4">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            🇮🇳 बाल संविधान साक्षरता अभियान
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4">
            हमारा संविधान, <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">हमारा मान!</span>
          </h1>
          <p className="text-sm md:text-base text-slate-300 font-semibold leading-relaxed">
            आओ बच्चों, खेल-खेल में हमारे महान लोकतंत्र की बुनियाद को जानें। सिमुलेशन चलाएं, वोटर कार्ड बनाएं, ईवीएम परीक्षण करें और भारत के गर्वित बाल नागरिक बनें!
          </p>
        </div>
      </motion.div>

      {/* 📜 DYNAMIC ASSEMBLY QUOTES SWITCHER */}
      <div className="relative min-h-[170px] flex items-center justify-center py-2 z-10">
        <AnimatePresence mode="wait">
          {assemblyQuotes.map((q, idx) => {
            if (idx !== activeQuoteIndex) return null;
            return (
              <motion.div
                key={q.author}
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ duration: 0.4 }}
                className={`w-full bg-gradient-to-r ${q.bannerStyle} p-6 md:p-8 rounded-2xl border-2 flex flex-col justify-between gap-4`}
              >
                {/* Calligraphy Quote Content - No photo, bold letters */}
                <div className="relative text-left">
                  <span className="text-6xl text-amber-300 absolute -top-8 -left-3 select-none opacity-40 font-serif leading-none">“</span>
                  <p className="text-base sm:text-lg md:text-xl font-black text-slate-900 leading-relaxed pl-4 tracking-wide font-sans">
                    {q.quote}
                  </p>
                </div>

                {/* Speaker Credits */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-left">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${q.accentDot}`}></span>
                    <span className="text-xs font-black text-slate-900 font-sans tracking-wide">
                      {q.author}
                    </span>
                  </div>
                  <span className="text-[10px] bg-slate-100 border px-2.5 py-0.5 rounded-full font-black text-slate-500 uppercase tracking-wide">
                    {q.role}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 📊 MY DESKTOP / MOBILE ADAPTIVE progress report panel */}
      <div className="bg-white border-2 border-slate-150 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-rose-100 pb-4 gap-4 text-left">
          <div>
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              📊 आपकी समग्र राष्ट्र-निर्माण प्रगति (Overall Progress Report)
            </h3>
            <p className="text-xs text-slate-500 font-bold mt-1">
              सभी विषयों को खेल-खेल में पूरा करें और अपनी प्रगति रिपोर्ट कार्ड में देखें!
            </p>
          </div>

          {/* Toggle buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto shrink-0 font-sans">
            <button
               type="button"
               onClick={() => setChartType("radar")}
               className={`px-3 py-1.5 rounded-lg text-[11px] font-black cursor-pointer transition ${
                 chartType === "radar" ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
               }`}
            >
              रेडार ग्राफ़
            </button>
            <button
               type="button"
               onClick={() => setChartType("bar")}
               className={`px-3 py-1.5 rounded-lg text-[11px] font-black cursor-pointer transition ${
                 chartType === "bar" ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
               }`}
            >
              बार ग्राफ़
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Column 1: Interactive Mastery Charts */}
          <div className="lg:col-span-7 bg-slate-50 border-2 border-slate-100 rounded-[30px] p-4 flex flex-col items-center justify-center min-h-[340px] relative font-sans">
            <div className="w-full h-80">
              {chartType === "radar" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                    <PolarAngleAxis
                      dataKey="name"
                      tick={{ fill: "#334155", fontSize: 10, fontWeight: "bold" }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 9 }} />
                    <Radar
                      name="योग्यता (Mastery %)"
                      dataKey="percentage"
                      stroke="#f97316"
                      fill="#ffd8a8"
                      fillOpacity={0.6}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white border-2 border-slate-200 p-2.5 rounded-xl shadow-md text-xs font-bold leading-relaxed text-left font-sans">
                              <p className="text-slate-900 font-extrabold">{data.name}</p>
                              <p className="text-orange-600 font-black">मास्टरी स्तर: {data.percentage}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 10, left: -25, bottom: 5 }}>
                    <XAxis
                      dataKey="name"
                      tickFormatter={(value) => value.split(" ")[0]}
                      tick={{ fill: "#334155", fontSize: 10, fontWeight: "bold" }}
                    />
                    <YAxis domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 9 }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white border-2 border-slate-200 p-2.5 rounded-xl shadow-md text-xs font-bold leading-relaxed text-left font-sans">
                              <p className="text-slate-900 font-extrabold">{data.name}</p>
                              <p className="text-indigo-600 font-black">मास्टरी स्तर: {data.percentage}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="percentage" radius={[10, 10, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            
            <p className="text-[10px] text-slate-400 font-bold mt-2 text-center">
              💡 प्रत्येक क्षेत्र को दोबारा खेलकर 100% मास्टरी पर ले जाएं और सर्वश्रेष्ठ ग्रेड हासिल करें!
            </p>
          </div>

          {/* Column 2: Average Mastery Grade Card & Reports */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-3 border-orange-200 rounded-3xl p-5 relative overflow-hidden flex items-center justify-between gap-4">
              <div className="text-left font-sans">
                <span className="text-[10px] text-orange-850 font-black tracking-widest uppercase block mb-1">
                  कुल औसत समझ (Overall Rating)
                </span>
                <div className="text-5xl font-black text-orange-900 flex items-baseline gap-1">
                  <span>{averagePct}%</span>
                  <span className="text-sm font-bold text-slate-500">मास्टरी</span>
                </div>
                <p className="text-xs text-orange-850 font-bold mt-2 leading-relaxed">
                  {gradeInfo.desc}
                </p>
              </div>

              {/* Kid friendly Grade Badge */}
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl flex flex-col items-center justify-center border-4 border-white shadow-lg rotate-6 hover:rotate-0 transition-all cursor-pointer flex-shrink-0">
                <span className="text-[9px] font-bold tracking-wider uppercase opacity-80">ग्रेड</span>
                <span className="text-3xl font-black">{gradeInfo.grade}</span>
              </div>
            </div>

            {/* Structured progress list */}
            <div className="space-y-3 font-sans text-left">
              <h4 className="text-[11px] font-black text-slate-400 tracking-wider uppercase block">विषयवार संचित रिपोर्ट कार्ड:</h4>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-orange-50/50 border-2 border-orange-100 p-3 rounded-2xl text-xs font-bold">
                <div className="space-y-0.5">
                  <span className="text-orange-900 block font-black">1. संविधान इतिहास और जनक</span>
                  <span className="text-[10px] text-orange-600 block">सुलझी खेल पहेलियां: {solvedPuzzles} / 3</span>
                </div>
                <span className="bg-orange-100 text-orange-900 px-2.5 py-1 rounded-full font-black text-center shrink-0 self-start sm:self-auto">{historyPct}%</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-pink-50/50 border-2 border-pink-100 p-3 rounded-2xl text-xs font-bold">
                <div className="space-y-0.5">
                  <span className="text-pink-900 block font-black">2. मौलिक अधिकार सिमुलेशन</span>
                  <span className="text-[10px] text-pink-600 block">अर्जित सीखे गए अधिकार: {solvedRights} / 6</span>
                </div>
                <span className="bg-pink-100 text-pink-900 px-2.5 py-1 rounded-full font-black text-center shrink-0 self-start sm:self-auto">{rightsPct}%</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-yellow-50/50 border-2 border-yellow-100 p-3 rounded-2xl text-xs font-bold">
                <div className="space-y-0.5">
                  <span className="text-yellow-905 block font-black">3. प्यारे मौलिक कर्तव्य आदतें</span>
                  <span className="text-[10px] text-yellow-800 block">सुलझाई आदत परिस्थितियां: {solvedDuties} / 6</span>
                </div>
                <span className="bg-yellow-100 text-yellow-950 px-2.5 py-1 rounded-full font-black text-center shrink-0 self-start sm:self-auto">{dutiesPct}%</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-green-50/50 border-2 border-green-100 p-3 rounded-2xl text-xs font-bold">
                <div className="space-y-0.5">
                  <span className="text-green-905 block font-black">4. चुनाव बूथ और ईवीएम मशीन</span>
                  <span className="text-[10px] text-green-700 block">वोटिंग लाइफ-स्टेटस: {electionStatusRaw}</span>
                </div>
                <span className="bg-green-100 text-green-900 px-2.5 py-1 rounded-full font-black text-center shrink-0 self-start sm:self-auto">{electionPct}%</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-amber-50/50 border-2 border-amber-100 p-3 rounded-2xl text-xs font-bold font-sans">
                <div className="space-y-0.5">
                  <span className="text-amber-900 block font-black">5. सीखो व खेलो क्विज़ Superstar</span>
                  <span className="text-[10px] text-amber-600 block">सर्वोच्च अंक (High Score): {quizHighScore} / 12 XP</span>
                </div>
                <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full font-black text-center shrink-0 self-start sm:self-auto">{quizPct}%</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-teal-50/50 border-2 border-teal-100 p-3 rounded-2xl text-xs font-bold font-sans">
                <div className="space-y-0.5">
                  <span className="text-teal-900 block font-black">6. मूक-बधिर साक्षरता: सांकेतिक भाषा</span>
                  <span className="text-[10px] text-teal-600 block">सीखे गए सांकेतिक पाठ शब्द: {solvedSign} / 6</span>
                </div>
                <span className="bg-teal-100 text-teal-900 px-2.5 py-1 rounded-full font-black text-center shrink-0 self-start sm:self-auto">{signPct}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Interactive Zones */}
      <div>
        <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
          ⭐ खेलने और सीखने के क्षेत्र चुनें:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => {
            const IconComponent = card.icon;
            // Determine custom bottom border and bar colors for card modules
            let borderClass = "border-b-8 border-b-blue-500";
            let barColor = "bg-blue-500";
            if (card.id === "rights") {
              borderClass = "border-b-8 border-b-pink-500";
              barColor = "bg-pink-500";
            } else if (card.id === "duties") {
              borderClass = "border-b-8 border-b-yellow-400";
              barColor = "bg-yellow-400";
            } else if (card.id === "election") {
              borderClass = "border-b-8 border-b-green-500";
              barColor = "bg-green-500";
            } else if (card.id === "quiz") {
              borderClass = "border-b-8 border-b-amber-500";
              barColor = "bg-amber-500";
            } else if (card.id === "history") {
              borderClass = "border-b-8 border-b-orange-500";
              barColor = "bg-orange-500";
            }

            const progressVal = `${card.progress}%`;

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => onNavigate(card.id)}
                className={`bg-white rounded-[40px] p-6 shadow-xl ${borderClass} hover:transform hover:-translate-y-2 transition-all cursor-pointer group flex flex-col justify-between`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`${card.accent} text-white p-3 rounded-2xl shadow-md group-hover:rotate-12 transition-transform`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] bg-slate-50 px-2.5 py-0.5 rounded-full border-2 border-slate-100 font-black text-slate-500 uppercase tracking-widest">
                      ज़ोन 0{idx + 1}
                    </span>
                  </div>

                  <h4 className="text-xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed mb-4">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-4">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">प्रगति बार (Progress)</span>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                    <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: progressVal }}></div>
                  </div>

                  <div className="flex items-center text-xs font-black gap-1 mt-auto group-hover:gap-2 transition-all text-slate-700">
                    <span>{card.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
