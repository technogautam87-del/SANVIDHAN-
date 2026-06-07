/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from "react";
import { Award, Compass, Star, Trophy, Sparkles, CheckCircle2, Bookmark, Flame, Heart, FileText, ArrowRight, Printer } from "lucide-react";
import { motion } from "motion/react";

interface BadgesSectionProps {
  onNavigate: (section: string) => void;
  setMascotData: (data: { mood: "happy" | "thinking" | "excited" | "proud" | "speaking" | "greeting"; text: string }) => void;
  score: number;
}

export default function BadgesSection({ onNavigate, setMascotData, score }: BadgesSectionProps) {
  const [voterName, setVoterName] = useState(() => {
    return localStorage.getItem("samvidhan_election_voter_name") || "शालीन बाल छात्र";
  });

  // Calculate real-time completion counts from localStorage matching the app's standard keys
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

  const electionCompleted = useMemo(() => {
    return localStorage.getItem("samvidhan_election_completed") === "true";
  }, []);

  // Configure badges mapping
  const badges = useMemo(() => {
    return [
      {
        id: "history",
        targetTab: "history",
        name: "इतिहास अन्वेषक पदक",
        englishName: "History Investigator Badge",
        emoji: "⏳",
        desc: "भारत के गौरवशाली इतिहास तथा प्रारूप समिति की सभी पहेलियों को शत-प्रतिशत सही सुलझाने वाले प्रतिभाशाली विद्यार्थी को यह सम्मान दिया जाता है।",
        conditionText: "इतिहास की सभी 3 पहेलियाँ पूर्ण करें",
        current: solvedPuzzles,
        required: 3,
        unlocked: solvedPuzzles >= 3,
        color: "from-amber-400 via-orange-500 to-amber-600",
        audioFreq: 587.33, // D5 Note
        achievementPoint: "+50 XP Bonus"
      },
      {
        id: "rights",
        targetTab: "rights",
        name: "अधिकार रक्षक पदक",
        englishName: "Guardian of Rights Medal",
        emoji: "🛡️",
        desc: "समानता, स्वतंत्रता और शिक्षा के सभी 6 मौलिक अधिकार सिमुलेशन खेलों को समझदारी से खेलकर समाज में अधिकारों की रक्षा करने वाले रक्षक को यह मेडल मिलता है।",
        conditionText: "सभी 6 मौलिक अधिकार परिस्थितियों का अध्ययन पूर्ण करें",
        current: solvedRights,
        required: 6,
        unlocked: solvedRights >= 6,
        color: "from-pink-400 via-rose-500 to-pink-600",
        audioFreq: 659.25, // E5 Note
        achievementPoint: "+50 XP Bonus"
      },
      {
        id: "duties",
        targetTab: "duties",
        name: "कर्तव्यनिष्ठ नागरिक पदक",
        englishName: "Dutybound Citizen Medal",
        emoji: "🌱",
        desc: "राष्ट्रगान का सम्मान, तिरंगे की शान, और स्वच्छता जैसे 11 मौलिक कर्तव्यों व सुसंस्कृत आदतों की सही पहचान करने वाले देशभक्त बाल नागरिक को यह पदक मिलता है।",
        conditionText: "कर्तव्य बोर्ड की सभी 6 परिस्थितियों का सही निर्णय लें",
        current: solvedDuties,
        required: 6,
        unlocked: solvedDuties >= 6,
        color: "from-yellow-400 via-emerald-500 to-green-600",
        audioFreq: 783.99, // G5 Note
        achievementPoint: "+50 XP Bonus"
      },
      {
        id: "election",
        targetTab: "election",
        name: "सक्रिय जागरूक मतदाता पदक",
        englishName: "Aware Active Voter Medal",
        emoji: "🗳️",
        desc: "सफलतापूर्वक अपना वोटर आईडी कार्ड बनाने, सुरक्षित ईवीएम मतदान करने तथा मतगणना और लोकतांत्रिक परिणामों का प्रत्यक्ष सिमुलेशन पूर्ण करने हेतु मिलता है।",
        conditionText: "वोटर आईडी बनाकर मतदान और मतगणना सिमुलेशन पूर्ण करें",
        current: electionCompleted ? 1 : 0,
        required: 1,
        unlocked: electionCompleted,
        color: "from-purple-400 via-indigo-500 to-purple-600",
        audioFreq: 880.00, // A5 Note
        achievementPoint: "+50 XP Bonus"
      },
      {
        id: "quiz",
        targetTab: "quiz",
        name: "संविधान सुपरस्टार पदक",
        englishName: "Constitution Quiz Superstar Badge",
        emoji: "👑",
        desc: "सीखो व खेलो क्विज़ में संविधान से संबंधित कठिन प्रश्नों का त्वरित व उच्चतम कौशल के साथ उत्तर देकर सर्वोच्च राष्ट्रीय बाल साक्षरता प्रतिष्ठा हासिल करने पर मिलता है।",
        conditionText: "क्विज़ में न्यूनतम 8 प्रश्नों का सटीक उत्तर दें (8/12)",
        current: quizHighScore,
        required: 8,
        unlocked: quizHighScore >= 8,
        color: "from-yellow-300 via-amber-400 to-orange-500",
        audioFreq: 987.77, // B5 Note
        achievementPoint: "+50 XP Bonus"
      },
      {
        id: "sign",
        targetTab: "signlanguage",
        name: "समरसता दूत सम्मान पदक",
        englishName: "Harmony Sign Language Ambassador",
        emoji: "🤝",
        desc: "संविधान, भारत, स्वतंत्रता, और लोकतंत्र जैसे भारतीय सांकेतिक भाषा के सभी 6 महत्वपूर्ण मूक-बधिर साक्षरता पाठों को कुशलतापूर्वक पूर्ण करने वाले दूत को समर्पित।",
        conditionText: "भारतीय सांकेतिक भाषा के सभी 6 पाठ पूर्ण करें",
        current: solvedSign,
        required: 6,
        unlocked: solvedSign >= 6,
        color: "from-teal-400 via-cyan-500 to-teal-600",
        audioFreq: 1046.50, // C6 Note
        achievementPoint: "+50 XP Bonus"
      }
    ];
  }, [solvedPuzzles, solvedRights, solvedDuties, electionCompleted, quizHighScore, solvedSign]);

  const unlockedCount = useMemo(() => badges.filter((b) => b.unlocked).length, [badges]);

  // Set mascot interaction text on tab launch
  React.useEffect(() => {
    if (unlockedCount === 6) {
      setMascotData({
        mood: "proud",
        text: "अतुलनीय! अतुलनीय! प्रिय बाल नागरिक, आपने सभी 6 विशिष्ट मेडल हासिल कर राष्ट्रीय बाल नागरिकता साक्षरता प्रमाण पत्र प्राप्त कर लिया है! आप भारत के सच्चे गौरव हैं! 🇮🇳🤝"
      });
    } else if (unlockedCount > 0) {
      setMascotData({
        mood: "excited",
        text: `शानदार प्रयास! आपने 299 सेनानियों की प्रेरणा से 6 में से ${unlockedCount} मेडल पूरे कर लिए हैं। चलो बाकी भी जल्द अनलॉक करें!`
      });
    } else {
      setMascotData({
        mood: "thinking",
        text: "मेडल गैलरी में सबका स्वागत है! यहाँ आप खेल-खेल में संविधान के अलग-अलग विषय पूरे करके सुंदर बैज अनलॉक कर सकते हैं। चलो पहला मेडल कमाते हैं!"
      });
    }
  }, [unlockedCount, setMascotData]);

  // Trigger happy sound chip manually for each unlocked badge
  const playBadgeChime = (freq: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.type = "sine";
        
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch {}
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-10 text-slate-800">
      
      {/* 🚀 Header Poster Banner */}
      <div className="relative rounded-[36px] bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-8 overflow-hidden shadow-xl border-4 border-amber-400">
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-orange-500 via-white to-emerald-600"></div>
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase font-black tracking-widest bg-amber-400 text-slate-950 rounded-full shadow-sm">
              🏆 मेडल रिवॉर्ड्स • Gamified Awards Hub 🏆
            </span>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-amber-300">
              राष्ट्रीय बाल नागरिक साक्षरता मेडल गैलरी
            </h2>
            <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed">
              बधाई हो बाल नागरिक! जैसे-जैसे आप हमारे संविधान के विभिन्न रोचक अध्यायों जैसे मौलिक अधिकार, कर्तव्य, मतदान सिमुलेशन और क्विज़ को पूरा करते हैं, आप हमारे डिजिटल मेडल अनलॉक करते जाएंगे। सभी मेडल पूर्ण करने पर आपको "राष्ट्रीय बाल साक्षरता प्रमाणपत्र" प्रदान किया जाएगा।
            </p>
          </div>

          {/* Large Trophy Stat Box */}
          <div className="bg-slate-950/80 border-2 border-amber-400/40 p-5 rounded-[28px] text-center w-full md:w-56 shadow-2xl relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[10px] px-3 py-0.5 rounded-full font-black uppercase">
              प्रगति मीटर
            </div>
            <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-2 animate-bounce drop-shadow" />
            <div className="text-3xl font-black text-white font-mono leading-none">
              {unlockedCount} <span className="text-lg text-slate-400">/ 6</span>
            </div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-1.5 leading-none">
              अनलॉक किए गए मेडल
            </p>
            
            {/* Custom mini progress slider */}
            <div className="mt-4 bg-slate-800 h-2.5 rounded-full overflow-hidden w-full p-0.5">
              <div 
                className="bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${(unlockedCount / 6) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 🏅 Interactive Grid of All 6 Medals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge, idx) => {
          const progressPct = Math.min((badge.current / badge.required) * 100, 100);

          return (
            <div
              key={badge.id}
              className={`relative rounded-[32px] p-6 text-left transition-all duration-300 border-4 bg-white flex flex-col justify-between ${
                badge.unlocked
                  ? "border-amber-400 shadow-lg hover:shadow-2xl hover:-translate-y-1.5"
                  : "border-slate-200/80 hover:border-slate-300"
              }`}
            >
              {/* Highlight ribbon tag */}
              {badge.unlocked ? (
                <div className="absolute top-4 right-4 bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] px-2.5 py-1 rounded-full font-black flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-50/10" />
                  अर्जित! (+50 XP)
                </div>
              ) : (
                <div className="absolute top-4 right-4 bg-slate-100 text-slate-400 text-[10px] px-2.5 py-1 rounded-full font-black border border-slate-200">
                  🔒 ताला लगा है
                </div>
              )}

              {/* Badge Visual Aspect */}
              <div className="flex items-start gap-4 mb-5 mt-2">
                <div className={`w-18 h-18 rounded-full p-1 shrink-0 flex items-center justify-center relative ${
                  badge.unlocked
                    ? `bg-gradient-to-tr ${badge.color} shadow-lg ring-4 ring-amber-100`
                    : "bg-slate-200 border border-slate-300"
                }`}>
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-inner">
                    <span 
                      onClick={() => badge.unlocked && playBadgeChime(badge.audioFreq)}
                      className={`text-4xl drop-shadow select-none cursor-pointer transition-transform duration-150 active:scale-90 ${
                        badge.unlocked ? "hover:scale-110 filter hue-rotate-15 animate-pulse" : "grayscale opacity-35"
                      }`}
                      title={badge.unlocked ? "सुर बजाएं!" : "लॉक है"}
                    >
                      {badge.unlocked ? badge.emoji : "🔒"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className={`text-base font-black tracking-tight leading-tight ${
                    badge.unlocked ? "text-slate-800" : "text-slate-400"
                  }`}>
                    {badge.name}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none font-mono">
                    {badge.englishName}
                  </p>
                </div>
              </div>

              {/* Description Body */}
              <div className="space-y-4 mb-6">
                <p className={`text-xs leading-relaxed font-medium ${
                  badge.unlocked ? "text-slate-600" : "text-slate-400 italic"
                }`}>
                  {badge.desc}
                </p>

                {/* Progress calculation UI */}
                <div className="space-y-1.5 bg-slate-50 border border-slate-200/60 p-3 rounded-2xl">
                  <div className="flex items-center justify-between text-[11px] font-black">
                    <span className="text-slate-500">अनलॉक लक्ष्य:</span>
                    <span className={badge.unlocked ? "text-emerald-600" : "text-slate-700"}>
                      {badge.current} / {badge.required} {badge.id === "election" ? "Booths" : "Tasks"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        badge.unlocked ? "bg-emerald-500" : "bg-indigo-400"
                      }`}
                      style={{ width: `${progressPct}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold italic leading-tight">
                    💡 {badge.conditionText}
                  </p>
                </div>
              </div>

              {/* CTA Navigation Action and interactive sounds */}
              <div>
                {badge.unlocked ? (
                  <button
                    type="button"
                    onClick={() => playBadgeChime(badge.audioFreq)}
                    className={`w-full bg-gradient-to-r ${badge.color} hover:opacity-95 text-white text-xs font-black py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5`}
                  >
                    <span>🔔 मेडल की धुन बजाएं</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onNavigate(badge.targetTab)}
                    className="w-full bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-slate-100 text-xs font-black py-2.5 px-4 rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>खेलें और मेडल खोजें</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 🧾 ULTIMATE NATIONAL FLAG TRICOLOR LITERACY CERTIFICATE SECTION (Earned when 6/6 complete) */}
      {unlockedCount === 6 ? (
        <div className="mt-12 bg-white rounded-[45px] border-8 border-double border-amber-400 shadow-2xl p-6 md:p-12 text-center max-w-4xl mx-auto relative overflow-hidden print:border-4 print:shadow-none print:m-0 print:p-8">
          
          {/* Top tricolor thick neon header */}
          <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-r from-orange-500 via-white to-emerald-600"></div>
          
          {/* Glowing Aura Backdrops */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Header Seal */}
          <div className="relative flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-600 rounded-full flex items-center justify-center p-1.5 shadow-2xl relative">
              <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center shadow-inner select-none relative overflow-hidden">
                <span className="text-3xl">🇮🇳</span>
                <span className="text-[6.5px] font-black text-orange-600 uppercase tracking-tighter leading-none mt-1">SAMVIDHAN</span>
              </div>
              <div className="absolute -bottom-1 bg-emerald-600 font-extrabold text-[8px] text-white px-2.5 py-0.5 rounded-full border border-white uppercase shadow">
                VERIFIED
              </div>
            </div>
          </div>

          <p className="text-orange-600 font-extrabold text-xs uppercase tracking-widest mb-1.5">
            ।। भारत का संविधान: बाल साक्षरता अभियान ।।
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight leading-none mb-2 font-sans italic">
            राष्ट्रीय बाल साक्षरता प्रमाण पत्र
          </h2>
          <p className="text-[10px] md:text-xs text-slate-400 tracking-widest font-mono uppercase font-black mb-8">
            National Child Constitutional Literacy Certificate
          </p>

          <div className="h-px w-2/3 bg-slate-200 mx-auto my-6"></div>

          {/* Certificate Body text */}
          <div className="space-y-5 max-w-2xl mx-auto my-6 font-medium text-slate-700">
            <p className="text-xs md:text-sm italic">
              अत्यंत गौरव के साथ प्रमाणित किया जाता है कि बाल नागरिक
            </p>
            
            {/* Input name directly integrated */}
            <div className="relative inline-block max-w-sm w-full">
              <input
                type="text"
                value={voterName}
                onChange={(e) => {
                  setVoterName(e.target.value);
                  localStorage.setItem("samvidhan_election_voter_name", e.target.value);
                }}
                className="w-full bg-slate-50 hover:bg-slate-100/50 border-b-2 border-dashed border-amber-400 text-center font-black text-xl md:text-3xl text-indigo-900 py-1.5 px-4 tracking-wide rounded-t-lg outline-none focus:border-indigo-600 transition-all cursor-edit"
                placeholder="अपना शुभ नाम यहाँ लिखें"
              />
              <span className="absolute -bottom-4 right-2 text-[9px] text-amber-900 font-bold">✏️ यहाँ क्लिक कर नाम बदलें</span>
            </div>

            <p className="text-xs md:text-base leading-relaxed md:px-6">
              ने <strong>'संविधान मित्र (बाल संस्करण)'</strong> शैक्षणिक सिमुलेशन खेल के अंतर्गत संविधान के सभी 6 महत्वपूर्ण मरुद्गण— गौरवशाली इतिहास पहेली, 6 मौलिक अधिकार, 11 कर्तव्य बोर्ड, चुनाव बूथ प्रत्यक्ष मतदान और राष्ट्रीय क्विज़ में <strong>शत-प्रतिशत (100%)</strong> असाधारण योग्यता अर्जित कर उत्कृष्ट प्रदर्शन दर्ज किया है।
            </p>
            <p className="text-xs leading-relaxed text-slate-500 italic mt-4 md:px-12">
              "हम यह घोषणा करते हैं कि आप संविधान के सिद्धांतों का सदैव सम्मान करेंगे, भाईचारे को सुदृढ़ करेंगे तथा एक सच्चे कर्तव्यनिष्ठ भारतीय नागरिक की तरह देश की उन्नति में योगदान देंगे।"
            </p>
          </div>

          <div className="h-px w-2/3 bg-slate-200 mx-auto my-8"></div>

          {/* Signatures & Seal Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center max-w-3xl mx-auto text-center mt-10">
            
            {/* Signature A */}
            <div className="space-y-1">
              <div className="h-8 flex items-end justify-center">
                <span className="font-mono text-slate-400 text-[11px] font-black italic">C. S. Gautam (Verified)</span>
              </div>
              <div className="h-0.5 bg-slate-200 w-3/4 mx-auto"></div>
              <h4 className="text-xs font-black text-slate-800">चन्द्र शेखर गौतम</h4>
              <p className="text-[9px] text-slate-400 font-extrabold uppercase">वरिष्ठ तकनीकी डेवलपर</p>
            </div>

            {/* Middle Seal Symbol */}
            <div className="flex justify-center order-first md:order-none">
              <div className="w-18 h-18 bg-amber-50 rounded-full border-2 border-dashed border-amber-400 flex items-center justify-center p-1">
                <div className="w-full h-full rounded-full bg-amber-100 flex flex-col items-center justify-center select-none">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-300" />
                  <span className="text-[7px] text-amber-800 font-black uppercase tracking-tighter mt-1">GOLD SEAL</span>
                </div>
              </div>
            </div>

            {/* Signature B */}
            <div className="space-y-1">
              <div className="h-8 flex items-end justify-center">
                <span className="font-mono text-slate-400 text-[11px] font-black italic">Kushagra Gaur (Verified)</span>
              </div>
              <div className="h-0.5 bg-slate-200 w-3/4 mx-auto"></div>
              <h4 className="text-xs font-black text-slate-800">कुशाग्र गौर</h4>
              <p className="text-[9px] text-slate-400 font-extrabold uppercase">वरिष्ठ डिजाइन एवं प्रोग्रामिंग प्रमुख</p>
            </div>

          </div>

          {/* Print/Download Button Action */}
          <div className="mt-12 flex justify-center gap-4 print:hidden">
            <button
              onClick={handlePrintCertificate}
              className="bg-indigo-650 hover:bg-indigo-700 text-white font-black text-xs py-3 px-6 rounded-2xl shadow-lg transition-all active:scale-97 cursor-pointer flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>प्रमाण पत्र प्रिंट करें / PDF सेव करें</span>
            </button>
          </div>

        </div>
      ) : (
        /* Status board lock notification */
        <div className="bg-slate-100 border-2 border-dashed border-slate-350 p-6 rounded-[32px] text-slate-500 text-center max-w-lg mx-auto space-y-2.5">
          <FileText className="w-10 h-10 text-slate-400 mx-auto mb-1 opacity-80" />
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
            🔒 राष्ट्रीय बाल साक्षरता प्रमाण पत्र लॉक है (Locked)
          </h4>
          <p className="text-[11px] font-medium leading-relaxed px-4">
            प्रमाण पत्र प्राप्त करने के लिए सभी 6 विशिष्ट मेडल अर्जित करें! वर्तमान में आपने <strong>{unlockedCount} / 6 मेडल</strong> अर्जित किए हैं। शेष विषयों के सिमुलेशन पूर्ण कर मेडल अनलॉक करें।
          </p>
        </div>
      )}

    </div>
  );
}
