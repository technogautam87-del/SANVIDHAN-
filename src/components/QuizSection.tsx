/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { quizQuestions } from "../data";
import { QuizQuestion } from "../types";
import {
  Award,
  Zap,
  RefreshCw,
  Volume2,
  VolumeX,
  HelpCircle,
  AlertCircle,
  Trophy,
  User,
  Star,
  Sparkles,
  ArrowRight,
  Smile,
  CheckCircle2,
  XCircle,
  BadgeHelp,
  ListRestart
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface QuizSectionProps {
  setMascotData: (data: { mood: "happy" | "thinking" | "excited" | "proud" | "speaking" | "greeting"; text: string }) => void;
  incrementScore: (points: number) => void;
  gameScore: number;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  avatar: string;
  badge: string;
  isCurrentUser?: boolean;
}

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { id: "1", name: "प्रिया शर्मा", score: 155, avatar: "👧", badge: "बाल राष्ट्रपति 🏅" },
  { id: "2", name: "आरव कुमार", score: 135, avatar: "👦", badge: "कानून रक्षक 🛡️" },
  { id: "3", name: "वीर सिंह", score: 120, avatar: "🦁", badge: "जागरूक नागरिक 🌟" },
  { id: "4", name: "दीया पटेल", score: 105, avatar: "🌸", badge: "संविधान प्रेमी 📖" },
  { id: "5", name: "कबीर अहमद", score: 75, avatar: "⚽", badge: "बाल सांसद 🏫" }
];

const AVATARS = ["👧", "👦", "🤖", "🦁", "🌸", "⚽", "⭐", "👑", "🚀", "🎓"];

export default function QuizSection({ setMascotData, incrementScore, gameScore }: QuizSectionProps) {
  const [activeTab, setActiveTab] = useState<"quiz" | "leaderboard" | "games" | "situations">("quiz");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [revealMode, setRevealMode] = useState(false);
  const [votedCorrectlyCount, setVotedCorrectlyCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isTypingMode, setIsTypingMode] = useState(false);
  
  // Track incorrect/correct logs for progress map
  const [answerLogs, setAnswerLogs] = useState<("correct" | "incorrect" | "pending")[]>(
    new Array(quizQuestions.length).fill("pending")
  );

  // Leaderboard states
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userName, setUserName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("👧");
  const [isSavedInLeaderboard, setIsSavedInLeaderboard] = useState(false);

  const currentQuestion = quizQuestions[currentIndex];

  // Initialize Leaderboard on mount
  useEffect(() => {
    const stored = localStorage.getItem("samvidhan_leaderboard");
    if (stored) {
      try {
        setLeaderboard(JSON.parse(stored));
      } catch (e) {
        setLeaderboard(DEFAULT_LEADERBOARD);
      }
    } else {
      setLeaderboard(DEFAULT_LEADERBOARD);
      localStorage.setItem("samvidhan_leaderboard", JSON.stringify(DEFAULT_LEADERBOARD));
    }
  }, []);

  // Sync mascot when question or tab changes
  useEffect(() => {
    if (activeTab === "leaderboard") {
      setMascotData({
        mood: "proud",
        text: "वाह बच्चों! यह है हमारा बाल लीडरबोर्ड। यहाँ हमारे स्कूल के सबसे बुद्धिमान और जागरूक नागरियों की सूची है। क्या आपका नाम शीर्ष पर है? अधिक से अधिक खेलें और नंबर 1 बनें!"
      });
    } else if (activeTab === "situations") {
      setMascotData({
        mood: "thinking",
        text: "प्यारे बच्चों! 'परिस्थिति-आधारित' प्रश्न मंच में आपका स्वागत है। यहाँ दैनिक जीवन की विशेष परिस्थितियों के माध्यम से हम संविधान की शक्ति और अपने अधिकारों को समझेंगे। चलो, सही निर्णय लें! ⚖️🇮🇳"
      });
    } else if (activeTab === "games") {
      setMascotData({
        mood: "excited",
        text: "प्यारे बच्चों! 'संविधान खेल केंद्र' में आपका स्वागत है! यहाँ अनेक ज्ञानवर्धक और मनोरंजक खेल हैं। इन्हें खेलें और हमारे संविधान को बहुत ही सरल व सुन्दर ढंग से समझें! 🎮✨"
      });
    } else if (quizFinished) {
      setMascotData({
        mood: votedCorrectlyCount >= 8 ? "excited" : "proud",
        text: `अद्भुत प्रयास प्यारे बच्चों! क्विज़ पूरा हो गया। आपने ${quizQuestions.length} में से कुल ${votedCorrectlyCount} प्रश्नों के शानदार और सही जवाब दिए हैं। आपका कुल स्कोर अब ${gameScore} XP हो गया है। अपना नाम लीडरबोर्ड में दर्ज करें!`
      });
    } else {
      let qTypeStr = "बहुविकल्पीय";
      if (currentQuestion.type === "boolean") qTypeStr = "सही-गलत";
      if (currentQuestion.type === "blank") qTypeStr = "खाली स्थान भरने वाला";

      setMascotData({
        mood: "thinking",
        text: `प्रश्न सं. 0${currentIndex + 1} (${qTypeStr} प्रश्न): ${currentQuestion.question} ध्यान से सोचें और सही उत्तर को लॉक करें!`
      });
    }
  }, [currentIndex, quizFinished, activeTab, setMascotData]);

  // Save quiz high score to localStorage when quiz finishes
  useEffect(() => {
    if (quizFinished) {
      const savedHighScore = parseInt(localStorage.getItem("samvidhan_quiz_high_score") || "0", 10);
      if (votedCorrectlyCount > savedHighScore) {
        localStorage.setItem("samvidhan_quiz_high_score", votedCorrectlyCount.toString());
        window.dispatchEvent(new Event("storage"));
      }
    }
  }, [quizFinished, votedCorrectlyCount]);

  // Visual/Audio synthesizer for correct answers
  const playSoundCorrect = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      // Sweet two-note ascending chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5 note
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // E5 note
      gain.gain.setValueAtTime(0.08, ctx.currentTime);

      osc1.start();
      osc1.stop(ctx.currentTime + 0.35);
    } catch {}
  };

  // Visual/Audio synthesizer for incorrect answers
  const playSoundWrong = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      // Low dual buzzing tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "triangle";
      osc.frequency.setValueAtTime(220.0, ctx.currentTime); // A3 note flat buzz
      gain.gain.setValueAtTime(0.12, ctx.currentTime);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {}
  };

  const handleSelectOption = (optIdx: number) => {
    if (revealMode) return;
    setSelectedOption(optIdx);
    setRevealMode(true);

    const isCorrect = optIdx === currentQuestion.answerIndex;
    const newLogs = [...answerLogs];

    if (isCorrect) {
      playSoundCorrect();
      setVotedCorrectlyCount(prev => prev + 1);
      incrementScore(15); // Add 15 points per correct answer
      newLogs[currentIndex] = "correct";
      setMascotData({
        mood: "excited",
        text: `अति सुंदर! बिल्कुल सही जवाब दिया! ${currentQuestion.explanation}`
      });
    } else {
      playSoundWrong();
      newLogs[currentIndex] = "incorrect";
      setMascotData({
        mood: "thinking",
        text: `ओह, कोई बात नहीं! सही उत्तर है: '${currentQuestion.options[currentQuestion.answerIndex]}'। ${currentQuestion.explanation}`
      });
    }
    setAnswerLogs(newLogs);
  };

  const handleSubmitText = () => {
    if (revealMode || !typedAnswer.trim()) return;
    setRevealMode(true);

    // Normalize comparison: remove spaces, punctuation, lowercase
    const normalizedTyped = typedAnswer.trim().toLowerCase().replace(/[\s\.\,\-\_]/g, "");
    const normalizedCorrect = (currentQuestion.blankAnswer || "").trim().toLowerCase().replace(/[\s\.\,\-\_]/g, "");

    const isCorrect = normalizedTyped === normalizedCorrect || 
                     currentQuestion.options[currentQuestion.answerIndex].toLowerCase().includes(normalizedTyped);

    const newLogs = [...answerLogs];

    if (isCorrect) {
      playSoundCorrect();
      setVotedCorrectlyCount(prev => prev + 1);
      incrementScore(20); // Extra bonus for typing the correct answer (+20 points!)
      newLogs[currentIndex] = "correct";
      setMascotData({
        mood: "excited",
        text: `कमाल कर दिया! आपने लिखकर सही उत्तर दिया है! आपको 20 पॉइंट्स मिले हैं! ${currentQuestion.explanation}`
      });
    } else {
      playSoundWrong();
      newLogs[currentIndex] = "incorrect";
      setMascotData({
        mood: "thinking",
        text: `ओहो! सही उत्तर है: '${currentQuestion.blankAnswer || currentQuestion.options[currentQuestion.answerIndex]}'। ${currentQuestion.explanation}`
      });
    }
    setAnswerLogs(newLogs);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setTypedAnswer("");
    setRevealMode(false);

    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setTypedAnswer("");
    setRevealMode(false);
    setQuizFinished(false);
    setVotedCorrectlyCount(0);
    setIsSavedInLeaderboard(false);
    setAnswerLogs(new Array(quizQuestions.length).fill("pending"));
  };

  // Register in Leaderboard
  const handleSaveToLeaderboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    let kidsBadge = "जागरूक बाल नागरिक 🌱";
    if (votedCorrectlyCount === quizQuestions.length) {
      kidsBadge = "संविधान सुपरस्टार 🏆";
    } else if (votedCorrectlyCount >= 8) {
      kidsBadge = "लोकतंत्र योद्धा 🛡️";
    } else if (votedCorrectlyCount >= 5) {
      kidsBadge = "संविधान मित्र विशेषज्ञ 🎓";
    }

    const newEntry: LeaderboardEntry = {
      id: "current_user_" + Date.now(),
      name: userName.trim(),
      score: gameScore,
      avatar: selectedAvatar,
      badge: kidsBadge,
      isCurrentUser: true
    };

    // Filter out previous current-user logs to keep only the latest high score or simply append and sort
    const existingFiltered = leaderboard.filter(item => !item.isCurrentUser);
    const updated = [...existingFiltered, newEntry].sort((a, b) => b.score - a.score);

    setLeaderboard(updated);
    localStorage.setItem("samvidhan_leaderboard", JSON.stringify(updated));
    setIsSavedInLeaderboard(true);
    
    // Switch to leaderboard tab to show and celebrate progress!
    setTimeout(() => {
      setActiveTab("leaderboard");
    }, 700);
  };

  const getRatingSummary = () => {
    const pct = Math.round((votedCorrectlyCount / quizQuestions.length) * 100);
    if (pct === 100) {
      return {
        title: "संविधान महानायक (Supreme Leader of Constitution) 👑",
        desc: "अतुलनीय! आपने सभी 12 प्रश्नों के शत-प्रतिशत सटीक उत्तर दिए। हमारा भारत आपके जैसे समझदार बच्चों के हाथों में पूरी तरह सुरक्षित है!",
        color: "from-amber-500 to-yellow-400 text-amber-950 border-amber-400"
      };
    }
    if (pct >= 70) {
      return {
        title: "लोकतंत्र रक्षक (Democracy Defender) 🛡️",
        desc: "अद्भुत कार्य! आपको भारतीय संविधान और इसके गौरवशाली इतिहास की सर्वश्रेष्ठ समझ है। शाबाश बच्चों!",
        color: "from-blue-500 to-indigo-500 text-white border-blue-400"
      };
    }
    if (pct >= 40) {
      return {
        title: "उभरते बाल संसद सदस्य (Junior Parliament Member) 🏛️",
        desc: "बहुत बढ़िया प्रयास! आप देश के संविधान को गहराई से सीख रहे हैं। एक बार फिर प्रयास कर के 100% स्कोर हासिल करें!",
        color: "from-emerald-500 to-teal-500 text-white border-emerald-400"
      };
    }
    return {
      title: "जिज्ञासु बाल नागरिक (Curious Citizen) 🌱",
      desc: "अच्छा प्रयास! संविधान को जानना और समझना हर नागरिक का कर्तव्य है। 'संविधान मित्र' के साथ इतिहास और अधिकार खंडों को एक बार पुनः पढ़ें और फिर से खेलें!",
      color: "from-slate-500 to-slate-600 text-white border-slate-400"
    };
  };

  const rating = getRatingSummary();

  return (
    <div id="quiz-section-container" className="space-y-8">
      {/* Dynamic Subheader & Active Tab Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-5 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            🎯 संविधान क्विज़ और लीडरबोर्ड
          </h2>
          <p className="text-xs text-slate-500 font-bold mt-1">
            बहुविकल्पीय प्रश्न, सही/गलत और रिक्त स्थान भरो - सब खेलें और ज्ञान का लोहा मनवाएं!
          </p>
        </div>

        {/* Tab Controls */}
        <div className="bg-slate-100 p-1.5 rounded-full flex gap-1 self-start md:self-auto border flex-wrap">
          <button
            onClick={() => setActiveTab("quiz")}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "quiz"
                ? "bg-orange-500 text-white shadow-md active:scale-95"
                : "text-slate-650 hover:text-slate-900"
            }`}
          >
            <BadgeHelp className="w-4 h-4" />
            <span>🎯 खेलें क्विज़</span>
          </button>
          <button
            onClick={() => setActiveTab("situations")}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "situations"
                ? "bg-amber-600 text-white shadow-md active:scale-95"
                : "text-slate-650 hover:text-slate-900"
            }`}
          >
            <AlertCircle className="w-4 h-4 text-amber-200 animate-pulse" />
            <span>⚖️ परिस्थिति आधारित</span>
          </button>
          <button
            onClick={() => setActiveTab("games")}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "games"
                ? "bg-pink-600 text-white shadow-md active:scale-95"
                : "text-slate-650 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>🎮 विशेष गेम्स</span>
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "leaderboard"
                ? "bg-purple-600 text-white shadow-md active:scale-95"
                : "text-slate-650 hover:text-slate-900"
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>🏆 लीडरबोर्ड</span>
          </button>
        </div>
      </div>

      {activeTab === "quiz" && (
        !quizFinished ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Frame: Questions and Animation */}
            <div className="lg:col-span-8 bg-white border-4 border-slate-150 rounded-[40px] p-6 md:p-8 shadow-xl space-y-6 relative overflow-hidden">
              
              {/* Question metadata / category */}
              <div className="flex flex-wrap justify-between items-center gap-3 border-b border-dashed pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black tracking-widest bg-slate-950 text-white px-3.5 py-1.5 rounded-xl uppercase">
                    प्रश्न {currentIndex + 1} / {quizQuestions.length}
                  </span>

                  {/* Dynamic Category Badges */}
                  {currentQuestion.type === "mcq" && (
                    <span className="text-[9px] font-black bg-pink-100 text-pink-800 border-2 border-pink-200 px-3 py-1 rounded-xl uppercase tracking-wider">
                      ● बहुविकल्पीय (MCQ)
                    </span>
                  )}
                  {currentQuestion.type === "boolean" && (
                    <span className="text-[9px] font-black bg-sky-100 text-sky-800 border-2 border-sky-200 px-3 py-1 rounded-xl uppercase tracking-wider">
                      ● सही / गलत (True/False)
                    </span>
                  )}
                  {currentQuestion.type === "blank" && (
                    <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 border-2 border-emerald-200 px-3 py-1 rounded-xl uppercase tracking-wider">
                      ● खाली स्थान भरो
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs font-black text-slate-500 bg-slate-50 border px-3 py-1.5 rounded-xl">
                  <Zap className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400 animate-bounce" />
                  <span>प्रगति पॉइंट्स: <span className="text-blue-600">{gameScore} XP</span></span>
                </div>
              </div>

              {/* Progress Tracker (Custom Colored Dots map) */}
              <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none border-b border-slate-50 pb-4">
                <span className="text-[10px] uppercase font-black text-slate-400 mr-2 flex-shrink-0">ट्रैकर:</span>
                {answerLogs.map((status, idx) => {
                  let color = "bg-slate-100 border-slate-200";
                  if (idx === currentIndex) color = "bg-yellow-400 border-yellow-300 scale-125 ring-2 ring-yellow-200";
                  else if (status === "correct") color = "bg-emerald-500 border-emerald-400 text-white flex items-center justify-center";
                  else if (status === "incorrect") color = "bg-rose-500 border-rose-400 text-white flex items-center justify-center";

                  return (
                    <div
                      key={idx}
                      className={`w-6 h-6 rounded-full border-2 text-[8px] font-black flex items-center justify-center transition-all ${color}`}
                    >
                      {status === "correct" ? "✓" : status === "incorrect" ? "✗" : idx + 1}
                    </div>
                  );
                })}
              </div>

              {/* Question Screen */}
              <div className="space-y-6">
                
                {/* Under the blank style or Normal question */}
                {currentQuestion.type === "blank" ? (
                  <div className="space-y-4">
                    <p className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 p-2.5 rounded-2xl w-fit font-bold">
                      💡 संकेत: नीचे दिए गए विकल्पों में से सबसे सही शब्द को चुनें या लिखकर प्रयास करें!
                    </p>
                    <h3 className="text-lg md:text-2xl font-black text-slate-900 leading-snug">
                      {/* Render text with empty placeholder */}
                      {revealMode ? (
                        <span>
                          {currentQuestion.question.replace(
                            "______",
                            `[ ${currentQuestion.blankAnswer || currentQuestion.options[currentQuestion.answerIndex]} ]`
                          )}
                        </span>
                      ) : (
                        <span>
                          {currentQuestion.question.split("______")[0]}
                          <motion.span
                            animate={{ scale: [0.98, 1.02, 0.98] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="inline-block mx-2.5 px-4 py-1.5 bg-yellow-100 border-2 border-dashed border-yellow-400 text-slate-900 font-extrabold text-xs md:text-sm rounded-xl cursor-default"
                          >
                            यहाँ क्या आएगा? 🤔
                          </motion.span>
                          {currentQuestion.question.split("______")[1]}
                        </span>
                      )}
                    </h3>
                  </div>
                ) : (
                  <h3 className="text-lg md:text-2xl font-black text-slate-900 leading-snug">
                    {currentQuestion.question}
                  </h3>
                )}

                {/* Interactive Blanks Mode / Layout toggler if blank */}
                {currentQuestion.type === "blank" && !revealMode && (
                  <div className="flex gap-4 border-b pb-4 text-xs font-bold">
                    <button
                      onClick={() => setIsTypingMode(false)}
                      className={`pb-2 border-b-2 transition-colors ${
                        !isTypingMode ? "border-emerald-500 text-emerald-800 font-black" : "border-transparent text-slate-500"
                      }`}
                    >
                      🗣️ शब्द चुनें (Select word)
                    </button>
                    <button
                      onClick={() => setIsTypingMode(true)}
                      className={`pb-2 border-b-2 transition-colors ${
                        isTypingMode ? "border-emerald-500 text-emerald-800 font-black" : "border-transparent text-slate-500"
                      }`}
                    >
                      ⌨️ खुद लिखकर प्रयास करें (+5 बोनस!)
                    </button>
                  </div>
                )}

                {/* Render Option Blocks */}
                {isTypingMode && currentQuestion.type === "blank" && !revealMode ? (
                  <div className="bg-slate-50 p-5 rounded-3xl border-2 border-slate-200 border-dashed space-y-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-black text-slate-700">⌨️ अपना जवाब यहाँ लिखें:</label>
                      <input
                        type="text"
                        value={typedAnswer}
                        onChange={(e) => setTypedAnswer(e.target.value)}
                        placeholder="जैसे: डॉ. भीमराव अंबेडकर, हीलियम, दो आदि..."
                        className="w-full bg-white border-2 border-slate-300 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-emerald-500 text-slate-900"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSubmitText();
                        }}
                      />
                    </div>
                    <button
                      onClick={handleSubmitText}
                      disabled={!typedAnswer.trim()}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-black text-xs rounded-2xl border-b-4 border-emerald-800 transition active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      उत्तर सबमिट करें (Submit Answer) ➔
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrectIndex = idx === currentQuestion.answerIndex;

                      let btnStyle = "border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-slate-800 bg-white";
                      let indicatorCls = "bg-slate-100 text-slate-600 border border-slate-300";

                      if (revealMode) {
                        if (isCorrectIndex) {
                          btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-black ring-4 ring-emerald-500/10";
                          indicatorCls = "bg-emerald-500 text-white border-emerald-600";
                        } else if (isSelected) {
                          btnStyle = "border-rose-500 bg-rose-50 text-rose-950 font-black ring-4 ring-rose-500/10";
                          indicatorCls = "bg-rose-500 text-white border-rose-600";
                        } else {
                          btnStyle = "border-slate-100 bg-slate-50 text-slate-400 opacity-60";
                          indicatorCls = "bg-slate-100 text-slate-305 border-slate-200";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={revealMode}
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full p-4 md:p-5 rounded-3xl border-3 text-left text-xs md:text-sm font-black transition-all duration-150 cursor-pointer flex gap-4 items-center justify-between ${btnStyle} group`}
                        >
                          <div className="flex items-center gap-4">
                            <span className={`w-8 h-8 rounded-2xl font-black text-xs flex items-center justify-center transition-colors group-hover:rotate-6 ${indicatorCls}`}>
                              {idx === 0 ? "A" : idx === 1 ? "B" : "C"}
                            </span>
                            <span>{option}</span>
                          </div>

                          {revealMode && isCorrectIndex && (
                            <span className="text-emerald-700 bg-emerald-100 border border-emerald-300 font-black px-2.5 py-1 rounded-xl text-[10px] uppercase flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              सही
                            </span>
                          )}
                          {revealMode && isSelected && !isCorrectIndex && (
                            <span className="text-rose-700 bg-rose-100 border border-rose-300 font-black px-2.5 py-1 rounded-xl text-[10px] uppercase flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              गलत जवाब
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Detailed Rule Explanation Frame */}
              <AnimatePresence>
                {revealMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: 15 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-amber-50/70 border-3 border-amber-300 rounded-3xl p-5 space-y-4"
                  >
                    <div className="flex gap-3 text-slate-800">
                      <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5 animate-pulse" />
                      <div className="font-sans text-xs md:text-sm text-slate-750 leading-relaxed font-semibold">
                        <strong className="text-amber-950 font-black block text-sm mb-1">💡 नियम एवं जानकारी स्पष्टीकरण:</strong>
                        {currentQuestion.explanation}
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleNext}
                        className="px-6 py-3 bg-slate-900 border-b-4 border-slate-950 hover:bg-slate-800 text-white font-black text-xs rounded-2xl cursor-pointer shadow-md flex items-center gap-2 transform hover:-translate-y-0.5 transition"
                      >
                        <span>{currentIndex < quizQuestions.length - 1 ? "अगला प्रश्न " : "क्विज़ समाप्त करें"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Widget: Classroom Stats Panel */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Scoreboard block */}
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-4 border-indigo-200 rounded-[35px] p-6 shadow-xl space-y-4">
                <h4 className="font-black text-indigo-950 border-b border-indigo-200/60 pb-3 text-xs uppercase tracking-widest flex items-center gap-1.5">
                  📈 लाइव प्रगति रिपोर्ट कार्ड
                </h4>

                <div className="space-y-3 font-sans font-semibold text-slate-700 text-xs">
                  <div className="flex justify-between items-center bg-white/50 p-2.5 rounded-xl border border-indigo-100">
                    <span>कुल हल प्रश्न:</span>
                    <strong className="text-slate-900 font-extrabold">{revealMode ? currentIndex + 1 : currentIndex} / {quizQuestions.length}</strong>
                  </div>
                  <div className="flex justify-between items-center bg-white/50 p-2.5 rounded-xl border border-indigo-100">
                    <span>सही उत्तर (Correct):</span>
                    <strong className="text-emerald-700 font-black">{votedCorrectlyCount}</strong>
                  </div>
                  <div className="flex justify-between items-center bg-white/50 p-2.5 rounded-xl border border-indigo-100">
                    <span>सफलता प्रतिशत (Accuracy):</span>
                    <strong className="text-indigo-800 font-black">
                      {votedCorrectlyCount > 0
                        ? `${Math.round((votedCorrectlyCount / quizQuestions.length) * 100)}%`
                        : "0%"}
                    </strong>
                  </div>
                </div>

                <div className="bg-white border-2 border-indigo-200 rounded-3xl p-5 text-center shadow-sm">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">आपका संचित स्कोर (Score)</span>
                  <div className="text-4xl font-black text-indigo-700 mt-1.5 tracking-tight flex items-center justify-center gap-1">
                    <span>{gameScore}</span>
                    <span className="text-xs text-indigo-500 font-bold font-mono">XP</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full mt-3 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                      style={{ width: `${(currentIndex / quizQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold mt-2">
                    तैयार हो जाएं! अगला प्रश्न हल करने पर +15 प्राप्त करें।
                  </p>
                </div>
              </div>

              {/* Classroom Motivation Poster */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-5 flex items-start gap-4">
                <div className="p-2.5 bg-amber-400 rounded-2xl text-white font-bold h-fit shrink-0">🎓</div>
                <div className="space-y-1">
                  <h5 className="text-xs font-black text-amber-950 uppercase">शिक्षक युक्ति (Friendly Tip):</h5>
                  <p className="text-[11px] text-amber-900 leading-relaxed font-semibold">
                    संविधान मित्र से सीखे गए बिंदुओं जैसे "हीलियम गैस", "6 से 14 वर्ष के अधिकार" और "11 मौलिक कर्तव्य" को ध्यान में रखें, प्रश्न इन्हीं इतिहासिक पन्नों से हैं।
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* SECTION: Final Quiz Result Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border-4 border-slate-200 p-8 rounded-[40px] text-center max-w-2xl mx-auto shadow-2xl space-y-6"
          >
            <div className={`p-1 bg-gradient-to-r ${rating.color.includes("text-white") ? "from-orange-400 via-white to-green-500" : "from-amber-400 to-yellow-300"} rounded-[35px] w-fit mx-auto shadow-xl`}>
              <div className="bg-slate-900 px-8 py-7 rounded-[32px] text-center">
                <div className="w-16 h-16 bg-amber-400 border-4 border-yellow-250 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg mx-auto animate-bounce mb-3.5">
                  🏆
                </div>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full uppercase font-black tracking-widest block w-fit mx-auto">
                  परीक्षा पूर्ण घोषित
                </span>
                <h3 className="text-2xl font-black text-white mt-3 leading-snug">
                  {rating.title}
                </h3>
              </div>
            </div>

            <p className="text-sm font-bold text-slate-600 max-w-lg mx-auto italic leading-relaxed">
              "{rating.desc}"
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border p-5 rounded-3xl">
              <div className="bg-white p-3.5 rounded-2xl shadow-xs border">
                <span className="text-[10px] text-slate-400 font-black block uppercase tracking-wider">सही उत्तर count</span>
                <div className="text-xl font-black text-emerald-600 mt-0.5">{votedCorrectlyCount} / {quizQuestions.length}</div>
              </div>
              <div className="bg-white p-3.5 rounded-2xl shadow-xs border">
                <span className="text-[10px] text-slate-400 font-black block uppercase tracking-wider">सफलता दर</span>
                <div className="text-xl font-black text-blue-600 mt-0.5">{Math.round((votedCorrectlyCount / quizQuestions.length) * 100)}%</div>
              </div>
              <div className="bg-white p-3.5 rounded-2xl shadow-xs border">
                <span className="text-[10px] text-slate-400 font-black block uppercase tracking-wider">कुल प्राप्त अंक</span>
                <div className="text-xl font-black text-indigo-600 mt-0.5 font-mono">{gameScore} XP</div>
              </div>
            </div>

            {/* Leaderboard Submission Block */}
            {!isSavedInLeaderboard ? (
              <div className="bg-purple-50 border-2 border-purple-200 p-6 rounded-[32px] text-left space-y-4 shadow-sm">
                <h4 className="text-sm font-black text-purple-950 flex items-center gap-1.5 border-b pb-2">
                  <Star className="w-4 h-4 text-purple-600 fill-purple-300" />
                  <span>लीडरबोर्ड में अपना स्थान आरक्षित करें!</span>
                </h4>

                <form onSubmit={handleSaveToLeaderboard} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">अपना नाम दर्ज करें:</label>
                      <input
                        type="text"
                        required
                        maxLength={25}
                        placeholder="जैसे: राहुल कुमार..."
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="bg-white border-2 border-purple-200 rounded-xl px-4 py-3 text-xs md:text-sm font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    {/* Avatar choice */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">अपना बाल अवतार चुनें:</label>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto bg-white p-2 border-2 border-purple-200 rounded-xl">
                        {AVATARS.map((av) => (
                          <button
                            key={av}
                            type="button"
                            onClick={() => setSelectedAvatar(av)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition ${
                              selectedAvatar === av
                                ? "bg-purple-100 border-purple-500 scale-110"
                                : "border-slate-100 hover:bg-slate-50"
                            }`}
                          >
                            {av}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl border-b-4 border-purple-800 transition active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5 shadow"
                  >
                    🚀 संजोएं और लाइव लीडरबोर्ड में जोड़ें ➔
                  </button>
                </form>
              </div>
            ) : (
              <p className="text-xs text-purple-700 bg-purple-100 font-bold p-3.5 rounded-full border border-purple-200 w-fit mx-auto">
                ✓ आपका नाम सफलतापूर्वक लीडरबोर्ड में सहेज दिया गया है!
              </p>
            )}

            <div className="flex flex-wrap gap-4 items-center justify-center pt-2">
              <button
                onClick={handleRestart}
                className="px-6 py-3 bg-slate-900 border-b-4 border-slate-950 hover:bg-slate-800 text-white font-black text-xs rounded-2xl cursor-pointer shadow flex items-center gap-2 transition"
              >
                <ListRestart className="w-4 h-4" />
                <span>क्विज़ फिर से खेलें</span>
              </button>
              <button
                onClick={() => setActiveTab("leaderboard")}
                className="px-6 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 font-black text-xs rounded-2xl cursor-pointer border-2 border-purple-300 transition"
              >
                🏆 सीधे लीडरबोर्ड देखें
              </button>
            </div>
          </motion.div>
        )
      )}

      {activeTab === "leaderboard" && (
        /* SECTION: Interactive Leaderboard Tab */
        <div className="bg-white border-4 border-slate-200 rounded-[40px] p-6 md:p-8 shadow-xl max-w-3xl mx-auto space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 border-2 border-purple-300 text-purple-600 rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-sm mb-2.5">
              🏆
            </div>
            <h3 className="text-2xl font-black text-purple-950">महान बाल लीडरबोर्ड</h3>
            <p className="text-xs text-slate-500 font-bold mt-1">
              स्कूल में जागरूक नागरिकों का राष्ट्रीय संचयी सम्मान पटल!
            </p>
          </div>

          <div className="bg-slate-50 rounded-[35px] border border-slate-200 overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-purple-900 text-white p-4 text-[10px] font-black uppercase tracking-wider">
              <div className="col-span-2 text-center">रैंक</div>
              <div className="col-span-5">बाल नागरिक प्रोफाइल</div>
              <div className="col-span-3 text-right">उपाधि / बैज</div>
              <div className="col-span-2 text-center">कुल XP</div>
            </div>

            {/* List entries */}
            <div className="divide-y divide-slate-150">
              {leaderboard.map((player, idx) => {
                const isUser = player.isCurrentUser;
                let rankVisual: React.ReactNode = idx + 1;
                
                // Medal highlights
                if (idx === 0) rankVisual = <span className="text-2xl" title="विजेता">🥇</span>;
                else if (idx === 1) rankVisual = <span className="text-2xl" title="द्वितीय">🥈</span>;
                else if (idx === 2) rankVisual = <span className="text-2xl" title="तृतीय">🥉</span>;

                return (
                  <div
                    key={player.id}
                    className={`grid grid-cols-12 items-center p-4 transition-colors font-sans text-xs ${
                      isUser
                        ? "bg-purple-100/90 font-black text-purple-950 border-l-4 border-l-purple-600"
                        : "bg-white text-slate-700"
                    }`}
                  >
                    <div className="col-span-2 text-center font-extrabold flex items-center justify-center">
                      {rankVisual}
                    </div>

                    <div className="col-span-5 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-slate-100 border flex items-center justify-center text-lg">
                        {player.avatar || "👦"}
                      </span>
                      <div>
                        <span className={`block font-black ${isUser ? "text-purple-950 text-sm" : "text-slate-800"}`}>
                          {player.name}
                          {isUser && <span className="ml-1.5 text-[8px] bg-purple-600 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider font-sans">आप (You)</span>}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-3 text-right font-bold text-slate-500">
                      <span className={`px-2 py-0.5 text-[10px] rounded-full border ${isUser ? "bg-purple-200 text-purple-900 border-purple-300" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                        {player.badge}
                      </span>
                    </div>

                    <div className="col-span-2 text-center font-black text-slate-900 font-mono">
                      {player.score} XP
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center bg-purple-50 p-4 border border-purple-250 rounded-2xl text-[11px] font-bold text-purple-900 leading-relaxed">
            <span className="flex items-center gap-1.5">
              💡 <span className="font-extrabold">सुझाव:</span> जितने अधिक अध्यायों को पढ़ेंगे और क्विज़ को सही हल करेंगे, उतने अधिक पॉइंट्स मिलेंगे!
            </span>
            <button
              onClick={() => {
                localStorage.removeItem("samvidhan_leaderboard");
                setLeaderboard(DEFAULT_LEADERBOARD);
              }}
              className="text-[10px] text-rose-600 hover:text-rose-700 font-black cursor-pointer bg-white px-2.5 py-1 rounded-lg border shadow-xs"
              title="लीडरबोर्ड रीसेट करें"
            >
              रीसेट
            </button>
          </div>
        </div>
      )}

      {activeTab === "situations" && (
        <SituationQuizSection incrementScore={incrementScore} setMascotData={setMascotData} />
      )}

      {activeTab === "games" && (
        <GamesHubSection incrementScore={incrementScore} setMascotData={setMascotData} />
      )}
    </div>
  );
}

/* ==========================================================================
   🎮 SECTION: GAMES HUB SECTION (संविधान खेल केंद्र)
   ========================================================================== */

interface GamesHubSectionProps {
  incrementScore: (points: number) => void;
  setMascotData: (data: { mood: "happy" | "thinking" | "excited" | "proud" | "speaking" | "greeting"; text: string }) => void;
}

function GamesHubSection({ incrementScore, setMascotData }: GamesHubSectionProps) {
  const [activeGame, setActiveGame] = useState<"scramble" | "shield" | "sorting">("scramble");

  // Game 1: Word Scramble state
  const scrambleWords = [
    {
      word: "संविधान",
      hint: "हमारे देश का सर्वोच्च नियम-संग्रह जिसके द्वारा भारत का शासन चलता है।",
      scrambled: ["धा", "न", "सं", "वि"],
      correctSeq: ["सं", "वि", "धा", "न"],
      fact: "संविधान सभा ने 2 वर्ष, 11 माह और 18 दिनों में भारतीय संविधान तैयार किया था!"
    },
    {
      word: "समानता",
      hint: "बिना किसी भेदभाव के हर नागरिक को बराबर सम्मान और समान अधिकार मिलना।",
      scrambled: ["ता", "न", "स", "मा"],
      correctSeq: ["स", "मा", "न", "ता"],
      fact: "समानता का अधिकार संविधान के अनुच्छेद 14 से 18 में सुरक्षित है।"
    },
    {
      word: "स्वतंत्रता",
      hint: "हर भारतीय को मर्यादित स्वतंत्रता, विचार व्यक्त करने और सुखी जीवन जीने का अधिकार।",
      scrambled: ["त्र", "ता", "स्व", "तं"],
      correctSeq: ["स्व", "तं", "त्र", "ता"],
      fact: "अनुच्छेद 19 हमें विचार, भाषण देने और शांतिपूर्ण सभा करने की स्वतंत्रता देता है।"
    }
  ];

  const [scrambleIndex, setScrambleIndex] = useState(0);
  const [selectedSyllables, setSelectedSyllables] = useState<string[]>([]);
  const [scrambleResult, setScrambleResult] = useState<"correct" | "incorrect" | null>(null);
  const [scramblePointsEarned, setScramblePointsEarned] = useState(false);

  const currentScramble = scrambleWords[scrambleIndex];

  const handleSyllableClick = (syllable: string) => {
    if (scrambleResult === "correct") return;
    setSelectedSyllables(prev => [...prev, syllable]);
  };

  const handleClearScramble = () => {
    setSelectedSyllables([]);
    setScrambleResult(null);
  };

  const handleCheckScramble = () => {
    const isCorrect = selectedSyllables.length === currentScramble.correctSeq.length &&
      selectedSyllables.every((val, index) => val === currentScramble.correctSeq[index]);

    if (isCorrect) {
      setScrambleResult("correct");
      if (!scramblePointsEarned) {
        incrementScore(20); // Reward 20 XP
        setScramblePointsEarned(true);
      }
      setMascotData({
        mood: "excited",
        text: `अद्भुत बच्चों! शब्द बना '${currentScramble.word}'। ${currentScramble.hint} आपको 20 पॉइंट्स (XP) मिल चुके हैं! 🎉`
      });
      
      // Play ascending success chime
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
          osc.frequency.setValueAtTime(698.46, ctx.currentTime + 0.1); // F5
          osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.2); // A5
          gain.gain.setValueAtTime(0.06, ctx.currentTime);
          osc.start();
          osc.stop(ctx.currentTime + 0.4);
        }
      } catch {}
    } else {
      setScrambleResult("incorrect");
      setMascotData({
        mood: "thinking",
        text: "ओह! वर्णों का क्रम सही नहीं है। कृपया 'साफ़ करें' दबाकर फिर से प्रयास करें और सही उच्चारण क्रम में जोड़ें।"
      });
      // Play sad error buzz
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(180, ctx.currentTime);
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        }
      } catch {}
    }
  };

  const handleNextScramble = () => {
    setScrambleIndex((scrambleIndex + 1) % scrambleWords.length);
    setSelectedSyllables([]);
    setScrambleResult(null);
    setScramblePointsEarned(false);
  };


  // Game 2: Shield (अधिकार ढाल) state
  const shieldCases = [
    {
      narrative: "10 साल के सोनू को एक चाय की दुकान पर सुबह से रात तक बर्तन साफ़ करने के भारी काम पर रखा गया है और मालिक उसे डांटता भी है।",
      question: "सोनू की सुरक्षा के लिए कौन सा 'अधिकार ढाल' इस्तेमाल किया जाना चाहिए?",
      options: [
        { text: "A) समानता का अधिकार (Right to Equality)", isCorrect: false },
        { text: "B) शोषण के विरुद्ध अधिकार और शिक्षा का अधिकार (Exploitation & RTE)", isCorrect: true },
        { text: "C) अपनी पसंद की भाषा बोलने का अधिकार", isCorrect: false }
      ],
      explanation: "बिल्कुल सही! अनुच्छेद 24 14 वर्ष से कम आयु के बच्चों से बाल-श्रम कराना सख़्त वर्जित करता है और अनुच्छेद 21A निःशुल्क शिक्षा सुनिश्चित करता है।"
    },
    {
      narrative: "छात्रा मीरा को गाँव की पाठशाला की बाल-संसद में बोलने से रोक दिया गया क्योंकि वह लड़की है।",
      question: "मीरा के सम्मान और अवसरों की समानता के लिए कौन सी ढाल काम करेगी?",
      options: [
        { text: "A) समानता और भेदभाव की समाप्ति का अधिकार (Article 15)", isCorrect: true },
        { text: "B) धार्मिक स्वतंत्रता का अधिकार", isCorrect: false },
        { text: "C) कोई अधिकार नहीं है", isCorrect: false }
      ],
      explanation: "शानदार! भारत के संविधान का अनुच्छेद 15 धर्म, लिंग, जाति या जन्मस्थान के आधार पर किसी भी नागरिक के साथ भेदभाव को पूरी तरह प्रतिबंधित करता है।"
    },
    {
      narrative: "अमित अन्य राज्य से भीलवाड़ा आया है, वह वहाँ घूमना और व्यापार खोलना चाहता है परन्तु स्थानीय दबंग उसे भगा रहे हैं।",
      question: "अमित को भारत में स्वतंत्र रूप से रहने व कार्य करने के लिए कौन सी ढाल चाहिए?",
      options: [
        { text: "A) धार्मिक स्वतंत्रता", isCorrect: false },
        { text: "B) शोषण के विरुद्ध अधिकार", isCorrect: false },
        { text: "C) स्वतंत्रता का अधिकार (रहने और आजीविका की आजादी)", isCorrect: true }
      ],
      explanation: "अविश्वसनीय! भारत के प्रत्येक नागरिक को देश के किसी भी भाग में स्वतंत्र रूप से रहने, घूमने और व्यवसाय करने का अधिकार अनुच्छेद 19 सुनिश्चित करता है।"
    }
  ];

  const [shieldIndex, setShieldIndex] = useState(0);
  const [selectedShield, setSelectedShield] = useState<number | null>(null);
  const [shieldPointsEarned, setShieldPointsEarned] = useState(false);

  const currentShieldCase = shieldCases[shieldIndex];

  const handleShieldOption = (optIdx: number) => {
    setSelectedShield(optIdx);
    const correct = currentShieldCase.options[optIdx].isCorrect;

    if (correct) {
      if (!shieldPointsEarned) {
        incrementScore(15);
        setShieldPointsEarned(true);
      }
      setMascotData({
        mood: "excited",
        text: `बहुत ही उत्तम! ढाल बिल्कुल सही लगी। ${currentShieldCase.explanation}`
      });
    } else {
      setMascotData({
        mood: "thinking",
        text: "ओह! यह ढाल कानूनन सोनू की रक्षा नहीं कर पायेगी। पुनः सोचें और सही अधिकार ढाल चुनें!"
      });
    }
  };

  const handleNextShieldCase = () => {
    setShieldIndex((shieldIndex + 1) % shieldCases.length);
    setSelectedShield(null);
    setShieldPointsEarned(false);
  };


  // Game 3: Duty Sorting state
  const dutyItems = [
    {
      action: "पार्क में राष्ट्रध्वज तिरंगा ज़मीन पर गिरा हुआ दिखने पर गर्व से उठाकर सुरक्षित स्थान पर संजोना।",
      isDuty: true,
      hint: "राष्ट्रध्वज और राष्ट्रगान का सम्मान करना हमारे संविधान में मौलिक कर्तव्य है।"
    },
    {
      action: "विंटेज या ऐतिहासिक किलों और राष्ट्रीय स्मारकों की दीवारों पर नुकीले पत्थरों से नाम खुरचना।",
      isDuty: false,
      hint: "राष्ट्रीय धरोहरों को बचाना कर्तव्य है, उन्हें विकृत करना दंडनीय अपराध व अत्यंत अशोभनीय काम है।"
    },
    {
      action: "सार्वजनिक स्थलों जैसे बस स्टेशन, रेलवे स्टेशन या स्कूल परिसर में गंदगी फैलाना और खिड़की तोडना।",
      isDuty: false,
      hint: "सार्वजनिक संपत्ति की रक्षा करना और हिंसा से दूर रहना हर भारतीय बच्चे का मौलिक कर्तव्य 11A में है।"
    },
    {
      action: "जलाशयों, नदियों और जंगलों को साफ रखना, प्लास्टिक कचरा न डालना व वन्य जीवों की रक्षा करना।",
      isDuty: true,
      hint: "प्राकृतिक पर्यावरण की रक्षा और जीवों के प्रति दयाभाव रखना हमारा पावन मौलिक कर्तव्य है (51A - g)।"
    },
    {
      action: "वैज्ञानिक सोच रखना, नए ज्ञान को उत्सुकता से सीखना और पूरे समाज की भलाई के लिए कार्य करना।",
      isDuty: true,
      hint: "वैज्ञानिक दृष्टिकोण, मानववाद और ज्ञानार्जन तथा सुधार की भावना का विकास करना हमारा मौलिक कर्तव्य है।"
    }
  ];

  const [dutyIndex, setDutyIndex] = useState(0);
  const [dutyResult, setDutyResult] = useState<"correct" | "incorrect" | null>(null);
  const [evaluatingDuty, setEvaluatingDuty] = useState<boolean | null>(null);
  const [dutyPointsEarned, setDutyPointsEarned] = useState(false);

  const currentDuty = dutyItems[dutyIndex];

  const handleSortDuty = (userChoice: boolean) => {
    setEvaluatingDuty(userChoice);
    const correct = currentDuty.isDuty === userChoice;

    if (correct) {
      setDutyResult("correct");
      if (!dutyPointsEarned) {
        incrementScore(15);
        setDutyPointsEarned(true);
      }
      setMascotData({
        mood: "happy",
        text: `शानदार नागरिक! बिल्कुल सही वर्गीकृत किया। ${currentDuty.hint}`
      });
    } else {
      setDutyResult("incorrect");
      setMascotData({
        mood: "thinking",
        text: "ओह! गलत बर्ताव है। सोचें कि क्या यह हमारे देश को स्वच्छ, सुंदर और सुरक्षित बनाने में मदद करता है?"
      });
    }
  };

  const handleNextDuty = () => {
    setDutyIndex((dutyIndex + 1) % dutyItems.length);
    setDutyResult(null);
    setEvaluatingDuty(null);
    setDutyPointsEarned(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Selector Toolbar */}
      <div className="bg-slate-50 p-2.5 rounded-[24px] border border-slate-200 flex flex-wrap gap-2 items-center justify-center shadow-xs">
        <button
          onClick={() => setActiveGame("scramble")}
          className={`px-4.5 py-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
            activeGame === "scramble"
              ? "bg-orange-500 text-white shadow"
              : "bg-white hover:bg-slate-100 text-slate-700"
          }`}
        >
          <span>✏️</span>
          <span>संविधान शब्द पहेली</span>
        </button>

        <button
          onClick={() => setActiveGame("shield")}
          className={`px-4.5 py-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
            activeGame === "shield"
              ? "bg-pink-600 text-white shadow"
              : "bg-white hover:bg-slate-100 text-slate-700"
          }`}
        >
          <span>🛡️</span>
          <span>अधिकार ढाल खेल</span>
        </button>

        <button
          onClick={() => setActiveGame("sorting")}
          className={`px-4.5 py-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
            activeGame === "sorting"
              ? "bg-emerald-600 text-white shadow"
              : "bg-white hover:bg-slate-100 text-slate-700"
          }`}
        >
          <span>👮</span>
          <span>कर्तव्य सिपाही खेल</span>
        </button>
      </div>

      {/* GAME 1: DEVANAGARI WORD SCRAMBLE */}
      {activeGame === "scramble" && (
        <div className="bg-white border-2 border-orange-100 rounded-[30px] p-6 space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between border-b pb-3 border-dashed">
            <div>
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest block">खेल - 1 (Word Hunt)</span>
              <h3 className="text-lg font-black text-slate-800">🧩 संविधान शब्द पहेली</h3>
            </div>
            <div className="bg-orange-100 text-orange-850 text-[10px] font-black px-3.5 py-1.5 rounded-xl border border-orange-300">
              प्रगति: {scrambleIndex + 1} / {scrambleWords.length}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-orange-50/40 p-4 rounded-2xl border border-orange-100 text-xs md:text-sm font-bold text-slate-700">
              <span className="font-black text-orange-800 block mb-1">💡 अर्थ (Meaning / Hint):</span>
              "{currentScramble.hint}"
            </div>

            {/* Answer Display Grid */}
            <div className="bg-slate-100/60 p-5 rounded-[24px] border border-slate-200 min-h-20 flex flex-wrap items-center justify-center gap-2 shadow-inner">
              {selectedSyllables.length === 0 ? (
                <span className="text-xs text-slate-400 font-extrabold italic select-none">
                  वर्ण चुनने के लिए नीचे दिए गए कार्ड्स पर क्लिक करें...
                </span>
              ) : (
                selectedSyllables.map((syl, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-12 h-12 rounded-xl bg-orange-500 border-2 border-orange-600 text-white font-black text-base flex items-center justify-center shadow-md cursor-default pointer-events-none"
                  >
                    {syl}
                  </motion.div>
                ))
              )}
            </div>

            {/* Action syllabled options */}
            <div className="space-y-2">
              <span className="text-[9px] text-slate-400 font-black tracking-widest uppercase block text-center">क्लिक करें और चुने (Syllable Cards):</span>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {currentScramble.scrambled.map((syl, idx) => {
                  // Count matches so duplicate syllables can still be clicked individually
                  const countInSelection = selectedSyllables.filter(item => item === syl).length;
                  const countInScrambled = currentScramble.scrambled.filter(item => item === syl).length;
                  const alreadyUsed = countInSelection >= countInScrambled;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSyllableClick(syl)}
                      disabled={alreadyUsed || scrambleResult === "correct"}
                      className={`w-14 h-14 rounded-2xl border-2 font-black text-lg shadow transition-all flex items-center justify-center cursor-pointer ${
                        alreadyUsed
                          ? "bg-slate-150 border-slate-200 text-slate-300 scale-95 opacity-50 cursor-not-allowed"
                          : "bg-white hover:bg-orange-50 border-orange-300 hover:border-orange-500 text-orange-900 hover:scale-105 active:scale-90"
                      }`}
                    >
                      {syl}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Verification and Navigation controls */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-dashed">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearScramble}
                  className="px-5 py-2 rounded-xl bg-slate-250 border-2 border-slate-350 hover:bg-slate-300 text-slate-800 font-black text-xs cursor-pointer shadow-xs"
                >
                  🧹 साफ़ करें
                </button>
                <button
                  onClick={handleCheckScramble}
                  disabled={selectedSyllables.length !== currentScramble.correctSeq.length}
                  className="px-6 py-2 bg-orange-600 hover:bg-orange-550 border-b-4 border-orange-850 disabled:bg-slate-200 disabled:border-slate-300 disabled:text-slate-400 disabled:translate-y-0 text-white font-black text-xs rounded-xl shadow cursor-pointer flex items-center gap-1 transition"
                >
                  🔒 उत्तर जांचें
                </button>
              </div>

              {scrambleResult === "correct" && (
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-black text-xs">✓ सही उत्तर! (+20 XP मिला)</span>
                  <button
                    onClick={handleNextScramble}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white font-black text-xs rounded-xl cursor-pointer shadow flex items-center gap-1.5 border-b-4 border-indigo-850"
                  >
                    <span>अगला शब्द ➔</span>
                  </button>
                </div>
              )}
            </div>

            {/* Fact board */}
            {scrambleResult === "correct" && (
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-[11px] font-bold text-emerald-800 flex items-start gap-2 animate-bounce">
                <span>📚</span>
                <div>
                  <strong className="block font-black">क्या आप जानते हैं (Amazing Fact):</strong>
                  {currentScramble.fact}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GAME 2: SHIELD DEFENDER */}
      {activeGame === "shield" && (
        <div className="bg-white border-2 border-pink-100 rounded-[30px] p-6 space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between border-b pb-3 border-dashed">
            <div>
              <span className="text-[10px] font-black text-pink-600 uppercase tracking-widest block">खेल - 2 (Rights Defender)</span>
              <h3 className="text-lg font-black text-slate-800">🛡️ अधिकार ढाल रक्षक</h3>
            </div>
            <div className="bg-pink-100 text-pink-850 text-[10px] font-black px-4 py-1.5 rounded-xl border border-pink-300">
              प्रगति: {shieldIndex + 1} / {shieldCases.length}
            </div>
          </div>

          <div className="space-y-5">
            {/* Story scene */}
            <div className="bg-stone-50 p-4 rounded-2xl border-2 border-slate-200/60 space-y-2">
              <span className="text-[10px] font-black text-red-650 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-md uppercase tracking-wide">
                ⚠️ संकटपूर्ण परिस्थिति (Situation Narrative):
              </span>
              <p className="text-xs md:text-sm font-bold text-slate-800 leading-relaxed italic">
                "{currentShieldCase.narrative}"
              </p>
            </div>

            {/* The Question */}
            <div className="space-y-3">
              <span className="text-xs font-black text-slate-600 flex items-center gap-1">
                ❓ {currentShieldCase.question}
              </span>

              {/* Shields Options Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {currentShieldCase.options.map((opt, idx) => {
                  const isAnswered = selectedShield !== null;
                  const isSelected = selectedShield === idx;
                  let cardStyle = "bg-white border-slate-200 hover:bg-slate-50 text-slate-700";

                  if (isAnswered) {
                    if (opt.isCorrect) {
                      cardStyle = "bg-emerald-50 border-emerald-400 text-emerald-900 font-extrabold shadow-inner";
                    } else if (isSelected) {
                      cardStyle = "bg-rose-50 border-rose-400 text-rose-900";
                    } else {
                      cardStyle = "bg-slate-50 border-slate-100 text-slate-300 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleShieldOption(idx)}
                      className={`p-4 rounded-2xl border-2 text-xs font-black text-left shadow-sm transition-all focus:outline-none flex flex-col justify-between gap-2 cursor-pointer ${cardStyle}`}
                    >
                      <span>{opt.text}</span>
                      {isAnswered && opt.isCorrect && (
                        <span className="text-[9px] bg-emerald-600 text-white px-2 py-0.5 rounded-md self-end tracking-wider uppercase">सफल शील्ड 🛡️</span>
                      )}
                      {isAnswered && isSelected && !opt.isCorrect && (
                        <span className="text-[9px] bg-rose-600 text-white px-2 py-0.5 rounded-md self-end tracking-wider uppercase">असक्षम</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Answer feedback */}
            {selectedShield !== null && (
              <div className="pt-2.5 border-t border-dashed flex flex-wrap items-center justify-between gap-3">
                <div className="text-left max-w-lg">
                  {currentShieldCase.options[selectedShield].isCorrect ? (
                    <p className="text-xs text-emerald-800 font-bold leading-normal">
                      🎉 <strong className="font-sans font-black">बधाई हो!</strong> {currentShieldCase.explanation}
                    </p>
                  ) : (
                    <p className="text-xs text-rose-700 font-bold leading-normal">
                      ❌ <strong className="font-sans font-black">प्रयास करें!</strong> सोनू की रक्षा के लिए वह अधिकार ढाल चुनें जो बच्चों को कारखानों से बचाती है।
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0">
                  <button
                    onClick={handleNextShieldCase}
                    className="px-5 py-2.5 bg-pink-600 hover:bg-pink-550 border-b-4 border-pink-850 text-white font-black text-xs rounded-xl cursor-pointer shadow flex items-center gap-1"
                  >
                    <span>अगला संकट ➔</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GAME 3: DUTIES SORTING */}
      {activeGame === "sorting" && (
        <div className="bg-white border-2 border-emerald-100 rounded-[30px] p-6 space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between border-b pb-3 border-dashed">
            <div>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block">खेल - 3 (Citizen Duties Classifier)</span>
              <h3 className="text-lg font-black text-slate-800">👮 कर्तव्य सिपाही</h3>
            </div>
            <div className="bg-emerald-100 text-emerald-850 text-[10px] font-black px-4 py-1.5 rounded-xl border border-emerald-300">
              प्रगति: {dutyIndex + 1} / {dutyItems.length}
            </div>
          </div>

          <div className="space-y-5">
            {/* Behavior Case Cards */}
            <div className="bg-emerald-50/30 p-5 rounded-2xl border-2 border-dashed border-emerald-250/70 text-center space-y-1">
              <span className="text-[9px] font-black tracking-widest uppercase text-emerald-850 block">नागरिक का व्यवहार / आचरण आलेख:</span>
              <p className="text-sm md:text-base font-black text-slate-900 leading-relaxed max-w-xl mx-auto">
                "{currentDuty.action}"
              </p>
            </div>

            {/* Click Classifier options */}
            <div className="flex items-center justify-center gap-4">
              <button
                disabled={evaluatingDuty !== null}
                onClick={() => handleSortDuty(true)}
                className={`flex-1 max-w-xs py-4 rounded-2xl border-2 font-black text-xs md:text-sm shadow-sm transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                  evaluatingDuty === null
                    ? "bg-white hover:bg-emerald-50 border-emerald-300 text-emerald-900 active:scale-95"
                    : evaluatingDuty === true && currentDuty.isDuty
                    ? "bg-emerald-500 border-emerald-600 text-white shadow-inner"
                    : evaluatingDuty === true && !currentDuty.isDuty
                    ? "bg-rose-500 border-rose-600 text-white"
                    : "bg-slate-50 border-slate-100 text-slate-300 opacity-50"
                }`}
              >
                <span className="text-2xl">🌟</span>
                <span>अच्छी कर्तव्य आदत (Duty)</span>
              </button>

              <button
                disabled={evaluatingDuty !== null}
                onClick={() => handleSortDuty(false)}
                className={`flex-1 max-w-xs py-4 rounded-2xl border-2 font-black text-xs md:text-sm shadow-sm transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                  evaluatingDuty === null
                    ? "bg-white hover:bg-rose-50 border-rose-300 text-rose-900 active:scale-95"
                    : evaluatingDuty === false && !currentDuty.isDuty
                    ? "bg-emerald-500 border-emerald-600 text-white shadow-inner"
                    : evaluatingDuty === false && currentDuty.isDuty
                    ? "bg-rose-500 border-rose-600 text-white"
                    : "bg-slate-50 border-slate-100 text-slate-300 opacity-50"
                }`}
              >
                <span className="text-2xl">⚠️</span>
                <span>गलत / मना किया व्यवहार</span>
              </button>
            </div>

            {/* Sorting evaluation feedback */}
            {dutyResult !== null && (
              <div className="pt-2.5 border-t border-dashed flex flex-wrap items-center justify-between gap-3">
                <div className="text-left">
                  {dutyResult === "correct" ? (
                    <p className="text-xs text-emerald-800 font-bold leading-relaxed">
                      🎉 <strong className="font-black text-emerald-950 block">शाबाश! बिल्कुल सही वर्गीकरण।</strong>
                      {currentDuty.hint} (+15 XP संचित)
                    </p>
                  ) : (
                    <p className="text-xs text-rose-700 font-bold leading-relaxed">
                      ❌ <strong className="font-black text-rose-950 block">पुनः आचरण को समझें!</strong>
                      क्या यह आदत देश के प्रति उत्तरदायित्व बढ़ाती है? पुनः प्रयास करें।
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0">
                  <button
                    onClick={handleNextDuty}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-555 border-b-4 border-emerald-850 text-white font-black text-xs rounded-xl cursor-pointer shadow flex items-center gap-1"
                  >
                    <span>अगला आचरण ➔</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

/* ==========================================================================
   ⚖️ SECTION: SITUATION QUIZ SECTION (परिस्थिति-आधारित खेल)
   ========================================================================== */

interface SituationQuestion {
  id: number;
  scenarioTitle: string;
  situationText: string;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
  badgeAward: string;
  icon: string;
}

const SITUATION_QUESTIONS_POOL: SituationQuestion[] = [
  {
    id: 1,
    scenarioTitle: "सड़क का निर्माण और राजू का मकान",
    situationText: "सरकार लोकहित में एक बड़ा राष्ट्रीय राजमार्ग (National Highway) बना रही है। इसमें राजू के परिवार के पुराने मकान का कुछ हिस्सा हटाया जाना अनिवार्य हो गया है। ऐसी स्थिति में कानून क्या कहता है?",
    options: [
      { text: "सरकार बिना किसी सूचना या मुआवजे के किसी भी समय मकान को तोड़ सकती है", isCorrect: false },
      { text: "संविधान और कानून के तहत राजू के परिवार को उचित मुआवजा (Compensation) और पुनर्वास सहायता मिलनी चाहिए", isCorrect: true },
      { text: "राजू के परिवार को विरोध करने के लिए सीधे जेल में बंद कर देना चाहिए", isCorrect: false }
    ],
    explanation: "अनुच्छेद 21 (प्राण और दैहिक स्वतंत्रता का अधिकार) तथा भूमि अधिग्रहण नीतियों के तहत, लोकहित में संपत्ति लेने से पहले सरकार को उचित कानूनी प्रक्रिया, मुआवजा और बसावट की व्यवस्था करनी पड़ती है।",
    badgeAward: "अधिकार रक्षक 🛡️",
    icon: "🏠"
  },
  {
    id: 2,
    scenarioTitle: "समानता और स्कूल का मध्याह्न भोजन",
    situationText: "मध्याह्न भोजन (मिड-डे मील) के समय स्कूल के कुछ बाहरी लोग चाहते हैं कि अलग-अलग जाति या समूह के बच्चे अलग-अलग पंक्तियों में दूर बैठकर भोजन करें। क्या यह सही है?",
    options: [
      { text: "हाँ, समाज की पुरानी परंपरा माननी चाहिए ताकि कोई विवाद न हो", isCorrect: false },
      { text: "नहीं, भारतीय संविधान सभी को समानता का अधिकार देता है, इसलिए सभी बच्चे सम्मान से एक साथ खाएंगे", isCorrect: true },
      { text: "बच्चों को स्कूल में मिलना बंद करके घर से टिफिन लाने को बोलना चाहिए", isCorrect: false }
    ],
    explanation: "अनुच्छेद 15 धर्म, मूलवंश, जाति, लिंग या जन्मस्थान के आधार पर किसी भी नागरिक के साथ सार्वजनिक स्थानों, कुओं, या सरकारी स्कूलों में भेदभाव को पूरी तरह प्रतिबंधित करता है।",
    badgeAward: "समता दूत 🤝",
    icon: "🍛"
  },
  {
    id: 3,
    scenarioTitle: "पड़ोसी पटाखा फैक्ट्री में बाल-श्रम",
    situationText: "11 वर्षीय सोनू ने देखा कि पड़ोस की एक पटाखा फैक्ट्री के अंदर कुछ छोटे बच्चे ज्वलनशील रसायनों और बारूद के बीच बिना किसी सुरक्षा उपकरण के रात-दिन काम करते हैं। सोनू को क्या करना चाहिए?",
    options: [
      { text: "उसे चुप रहना चाहिए क्योंकि वह उनके काम का मामला है", isCorrect: false },
      { text: "बाल श्रम हेल्पलाइन (Childline 1098) या पुलिस को सूचित कर बच्चों को रेस्क्यू कराना चाहिए", isCorrect: true },
      { text: "उन बच्चों को और तेज़ी से काम करने को बोलना चाहिए ताकि वे अतिरिक्त कमाई कर सकें", isCorrect: false }
    ],
    explanation: "अनुच्छेद 24 के अंतर्गत 14 वर्ष से कम आयु के बच्चों को किसी कारखाने, खान, या अन्य जोखिम वाले रोजगार में काम पर लगाना अत्यंत गंभीर दंडनीय अपराध है (सच्चा बाल संरक्षण)।",
    badgeAward: "बाल रक्षक 🏆",
    icon: "🏭"
  },
  {
    id: 4,
    scenarioTitle: "धार्मिक त्योहार मनाने से रोकना",
    situationText: "एक बहु-धार्मिक कॉलोनी में कुछ लोग दूसरे धर्म के एक शांत पड़ोसी परिवार को अपने घर के भीतर शांतिपूर्वक सामूहिक प्रार्थना करने और धार्मिक त्योहार का दीया जलाने से रोक रहे हैं।",
    options: [
      { text: "उन्हें रोकना चाहिए यदि उनके विचार आपस में मेल नहीं खाते", isCorrect: false },
      { text: "प्रत्येक भारतीय नागरिक को अपने धर्म को मानने, आचरण करने तथा शांति से त्योहार मनाने का पूर्ण अधिकार है", isCorrect: true },
      { text: "परिवार पर भारी जुर्माना लगाना चाहिए", isCorrect: false }
    ],
    explanation: "अनुच्छेद 25 से 28 के तहत भारत एक पंथनिरपेक्ष (Secular) देश है और प्रत्येक व्यक्ति को व्यक्तिगत व सामूहिक धार्मिक स्वतंत्रता और शांत उपासना का अधिकार देता है।",
    badgeAward: "पंथनिरपेक्ष योद्धा 🕊️",
    icon: "🪔"
  },
  {
    id: 5,
    scenarioTitle: "गाँव की महिला सरपंच और रूढ़िवादी सोच",
    situationText: "रामगढ़ गाँव में सरपंच का चुनाव एक योग्य शिक्षित महिला सुजाता ने जीता। कुछ गाँव वाले कहते हैं कि महिलाओं को केवल घर संभालना चाहिए और पुरुष ही पंचायत चलाएंगे। इस पर संविधान क्या कहता है?",
    options: [
      { text: "गाँव वालों की बात सही है क्योंकि पुरुष अधिक अनुभवी होते हैं", isCorrect: false },
      { text: "संविधान सभी को बिना लिंगभेद के समान राजनीतिक अधिकार देता है, सुजाता को पूर्ण स्वतंत्रता है और यह उनका हक है", isCorrect: true },
      { text: "महिला सरपंच को अपना पद किसी पुरुष रिश्तेदार को सौंप देना चाहिए", isCorrect: false }
    ],
    explanation: "अनुच्छेद 14 (समानता) और अनुच्छेद 15(3) महिलाओं के सशक्तिकरण को बढ़ावा देते हैं, तथा 73वें संविधान संशोधन द्वारा पंचायतों में महिलाओं की मजबूत राजनीतिक भागीदारी सुनिश्चित की गई है।",
    badgeAward: "महिला सशक्तिकरण प्रहरी ♀️",
    icon: "🗳️"
  },
  {
    id: 6,
    scenarioTitle: "नदी में केमिकल बहता गंदा पानी",
    situationText: "एक बड़ी सीमेंट और कपड़ा फैक्ट्री अपना जहरीला गंदा पानी बिना साफ़ किए सीधे सार्वजनिक नदी में बहा रही है, जिससे पर्यावरण नष्ट हो रहा है और पशु बीमार हो रहे हैं।",
    options: [
      { text: "फैक्ट्री से टैक्स और रोज़गार मिलता है, इसलिए नदी प्रदूषण को अनदेखा करना चाहिए", isCorrect: false },
      { text: "प्राकृतिक पर्यावरण व नदियों की रक्षा करना राज्य का कर्तव्य और हर जागरूक नागरिक का संवेधानिक मूल कर्तव्य भी है", isCorrect: true },
      { text: "गाँव वालों को नदी का पानी पीना बंद कर देना चाहिए और शिकायत नहीं करनी चाहिए", isCorrect: false }
    ],
    explanation: "अनुच्छेद 48A (राज्य का नीति निदेशक तत्व) तथा अनुच्छेद 51A(g) (नागरिकों का मौलिक कर्तव्य) स्पष्ट करते हैं कि वनों, झीलों, नदियों व वन्य जीवों सहित पर्यावरण की रक्षा तथा उस पर दया भाव रखना हमारा राष्ट्रीय कर्तव्य है।",
    badgeAward: "पर्यावरण मित्र 🌱",
    icon: "🌊"
  },
  {
    id: 7,
    scenarioTitle: "अंजलि और बाल विवाह की चुनौती",
    situationText: "अंजलि 14 वर्ष की है और वह आगे पढ़कर डॉक्टर बनना चाहती है, लेकिन उसके घरवाले उस पर पढ़ाई छोड़कर चुपचाप शादी करने का दबाव बना रहे हैं। अंजलि के पास क्या उपाय है?",
    options: [
      { text: "उसे चुपचाप मान जाना चाहिए क्योंकि माता-पिता सबसे बेहतर जानते हैं", isCorrect: false },
      { text: "वह चाइल्ड हेल्पलाइन, शिक्षक या स्थानीय अधिकारियों की सहायता से इस गैर-कानूनी बाल विवाह को रुकवा सकती है", isCorrect: true },
      { text: "उसे स्कूल से नाम कटवाकर सिलाई सीखनी शुरू कर देनी चाहिए", isCorrect: false }
    ],
    explanation: "बाल विवाह गैर-कानूनी और मानवाधिकारों/संविधान के अनुच्छेद 21(A) के तहत मिले अनिवार्य शिक्षा के मौलिक अधिकार का हनन है। कानूनन बाल विवाह करवाना अपराध है।",
    badgeAward: "विद्रोह की किरण ⚡",
    icon: "🎓"
  },
  {
    id: 8,
    scenarioTitle: "सरकारी योजना की जानकारी और सूचना का अधिकार",
    situationText: "गाँव के विकास के लिए सरकार ने 10 लाख रुपये भेजे थे, पर सरपंच सारा काम बीच में रोक कर बजट छिपा रहा है। गाँव के रामदीन को इस ख़र्च की जानकारी कैसे मिल सकती है?",
    options: [
      { text: "रामदीन को सीधे सरपंच से लड़ाई करनी चाहिए", isCorrect: false },
      { text: "रामदीन 'सूचना का अधिकार' (RTI - Right to Information) कानून के जरिए आधिकारिक जानकारी और बिल मांग सकता है", isCorrect: true },
      { text: "उसे सब कुछ भाग्य पर छोड़ देना चाहिए क्योंकि गाँव वालों को ये जानने का हक नहीं है", isCorrect: false }
    ],
    explanation: "भारतीय संविधान के अनुच्छेद 19(1)(a) के तहत विचार और अभिव्यक्ति की स्वतंत्रता में 'जानने का अधिकार' भी शामिल है। सूचना का अधिकार कानून 2005 देशवासियों को सरकारी कामों में पारदर्शिता दिलाता है।",
    badgeAward: "पारदर्शिता नायक 🔎",
    icon: "📄"
  },
  {
    id: 9,
    scenarioTitle: "झूठे इल्ज़ाम और गिरफ्तारी",
    situationText: "बिना किसी वारंट या ठोस वजह के पुलिसकर्मी रवि को सीधे थाने ले गए और उसे 24 घंटे से अधिक समय तक बिना किसी मजिस्ट्रेट के सामने पेश किए बंद रखा। रव‌ि के पास क्या अधिकार है?",
    options: [
      { text: "उसे हमेशा जेल में ही सड़ना पड़ेगा क्योंकि पुलिस सर्वोपरि है", isCorrect: false },
      { text: "गिरफ्तारी के 24 घंटे के भीतर मजिस्ट्रेट के सामने पेश होने तथा मनपसंद वकील से सलाह लेने का उसे पूरा अधिकार है", isCorrect: true },
      { text: "उसे पुलिस की सभी झूठी बातें स्वीकार कर लेनी चाहिए", isCorrect: false }
    ],
    explanation: "अनुच्छेद 22 के तहत मनमानी गिरफ्तारी और निरोध से संरक्षण का अधिकार मिलता है। किसी भी बंदी व्यक्ति को 24 घंटे के भीतर निकटतम मजिस्ट्रेट के समक्ष पेश करना कानूनन अनिवार्य है।",
    badgeAward: "न्याय सैनिक ⚖️",
    icon: "👮"
  },
  {
    id: 10,
    scenarioTitle: "धरोहरों पर नाम लिखना",
    situationText: "पिकनिक के दौरान हरीश ने देखा कि कुछ लड़के ताजमहल और किलों की ऐतिहासिक प्राचीन दीवारों पर नुकीले पत्थरों से अपना नाम खोद रहे हैं। हरीश को क्या करना चाहिए?",
    options: [
      { text: "उसे भी अपना नाम लिखकर अपनी यादें छोड़नी चाहिए", isCorrect: false },
      { text: "उसे उन युवकों को समझाना चाहिए कि राष्ट्रीय महत्व की स्मारकों व धरोहरों को सुरक्षित रखना हमारा मूलभूत कर्तव्य है", isCorrect: true },
      { text: "वहाँ से चुपके से चले जाना चाहिए ताकि कोई झंझट न हो", isCorrect: false }
    ],
    explanation: "अनुच्छेद 51A(f) तथा 51A(i) के अनुसार हमारी सामासिक संस्कृति की गौरवशाली परंपरा का महत्व समझना और ऐतिहासिक स्मारकों तथा सार्वजनिक संपत्ति को सुरक्षित रखना हमारा कर्तव्य है।",
    badgeAward: "धरोहर रक्षक 🏛️",
    icon: "🏯"
  },
  {
    id: 11,
    scenarioTitle: "अल्पसंख्यक स्कूल और शिक्षण संस्थान",
    situationText: "एक छोटे धार्मिक या भाषाई अल्पसंख्यक समुदाय के लोग अपने बच्चों को अपनी विशिष्ट संस्कृति व भाषा सिखाने के लिए एक अलग स्कूल खोलना चाहते हैं, पर पड़ोसी समुदाय विरोध कर रहा है।",
    options: [
      { text: "अल्पसंख्यकों को अपने स्कूल खोलने का कोई हक नहीं है", isCorrect: false },
      { text: "संविधान अल्पसंख्यकों को अपनी रुचि के अनुसार शिक्षण संस्थान स्थापित करने और संचालित करने का पूर्ण अधिकार देता है", isCorrect: true },
      { text: "अल्पसंख्यकों को अपनी लिपि और भाषा भूल जानी चाहिए", isCorrect: false }
    ],
    explanation: "अनुच्छेद 30 के तहत सभी अल्पसंख्यक वर्गों को, चाहे वे धर्म पर आधारित हों या भाषा पर, अपनी पसंद की शिक्षा संस्थाओं की स्थापना और प्रशासन का अधिकार पूर्ण रूप से मिलता है।",
    badgeAward: "संस्कृति रक्षक 🎨",
    icon: "🏫"
  },
  {
    id: 12,
    scenarioTitle: "वोट डालने से रोकना",
    situationText: "चुनाव के दिन श्यामलाल को कुछ दबंग लोग मतदान केंद्र पर जाने से बलपूर्वक रोक रहे हैं ताकि वह अपनी मर्ज़ी के उम्मीदवार को वोट न डाल सके। क्या कानून इसकी रक्षा करेगा?",
    options: [
      { text: "श्यामलाल को अपनी सुरक्षा के लिए घर पर ही बैठ जाना चाहिए", isCorrect: false },
      { text: "वह तुरंत चुनाव आयोग के पर्यवेक्षकों या स्थानीय पुलिस से सुरक्षा मांग सकता है, क्योंकि निष्पक्ष मतदान उसका अधिकार है", isCorrect: true },
      { text: "श्यामलाल को उन दबंगों के बताए अनुसार ही चुपचाप वोट दे देना चाहिए", isCorrect: false }
    ],
    explanation: "संविधान के अनुच्छेद 326 के तहत प्रत्येक वयस्क नागरिक को मतदान का अधिकार मिलता है और शांतिपूर्ण एवं भयमुक्त चुनाव संपन्न कराना चुनाव आयोग का दायित्व है।",
    badgeAward: "सजग मतदाता 🗳️",
    icon: "✊"
  }
];

// Helper to shuffle questions
function shuffleAndSelectQuestions(): SituationQuestion[] {
  const shuffled = [...SITUATION_QUESTIONS_POOL];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 10);
}

interface SituationQuizSectionProps {
  incrementScore: (points: number) => void;
  setMascotData: (data: { mood: "happy" | "thinking" | "excited" | "proud" | "speaking" | "greeting"; text: string }) => void;
}

function SituationQuizSection({ incrementScore, setMascotData }: SituationQuizSectionProps) {
  const [questions, setQuestions] = useState<SituationQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  // Initialize randomized 10 questions of pool
  useEffect(() => {
    resetQuiz();
  }, []);

  const resetQuiz = () => {
    const selected = shuffleAndSelectQuestions();
    setQuestions(selected);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setIsFinished(false);
    setXpEarned(0);

    setMascotData({
      mood: "thinking",
      text: "शानदार! चलो पहले परिस्थिति का मुकाबला करते हैं। समस्या को ध्यान से पढ़ें और उचित संवैधानिक उत्तर चुनें!"
    });
  };

  const playChime = (isCorrect: boolean) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (isCorrect) {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else {
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
        osc.frequency.setValueAtTime(180, ctx.currentTime + 0.15); // Low buzz
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch {}
  };

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleLockAnswer = () => {
    if (selectedOption === null || isAnswered) return;

    const q = questions[currentIndex];
    const optionSelected = q.options[selectedOption];
    const isCorrect = optionSelected.isCorrect;

    setIsAnswered(true);
    playChime(isCorrect);

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      setXpEarned(prev => prev + 20); // 20 XP per correct question
      incrementScore(20);
      setMascotData({
        mood: "excited",
        text: `बिल्कुल सही जवाब! आपने उत्कृष्ट नागरिक समझ दिखाई है। ${q.badgeAward} बैज अर्जित हुआ!`
      });
    } else {
      setMascotData({
        mood: "thinking",
        text: `ओहो! यह गलत निर्णय था। कोई बात नहीं, संविधान सूत्र को पढ़कर नया दृष्टिकोण सीखें। आगे हम और बेहतर करेंगे!`
      });
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);

      const nextQ = questions[currentIndex + 1];
      setMascotData({
        mood: "thinking",
        text: `अगला पड़ाव: ${nextQ.scenarioTitle}। ध्यान से सोच समझकर निर्णय लें!`
      });
    } else {
      setIsFinished(true);
      const scoreRatio = correctCount / questions.length;
      let finalMood: "proud" | "excited" | "happy" = "happy";
      let speech = "";

      if (scoreRatio >= 0.8) {
        finalMood = "excited";
        speech = `असाधारण प्रदर्शन! आपने 10 में से ${correctCount} परिस्थितियों का बिल्कुल संविधान सम्मत समाधान किया। आप सचमुच एक आदर्श बाल न्यायविद हैं! 🏆🌟`;
      } else if (scoreRatio >= 0.5) {
        finalMood = "proud";
        speech = `बहुत बढ़िया! आपने 10 में से ${correctCount} उत्तर सही चुने। आपकी अधिकारों की बुनियादी समझ बेहद मजबूत है।`;
      } else {
        finalMood = "happy";
        speech = `प्रशंसनीय प्रयास! आपने 10 में से ${correctCount} उत्तर सही किए। संविधान की धाराओं के बारे में और अधिक पढ़कर आप आगे शत-प्रतिशत अंक पा सकते हैं।`;
      }

      setMascotData({
        mood: finalMood,
        text: speech
      });
    }
  };

  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="mt-8 space-y-6">
      <AnimatePresence mode="wait">
        {!isFinished ? (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left Console Panel */}
            <div className="lg:col-span-8 bg-white border-4 border-slate-150 rounded-[40px] p-6 md:p-8 shadow-xl space-y-6 relative overflow-hidden">
              {/* Head stats row */}
              <div className="flex items-center justify-between border-b border-dashed pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black bg-slate-900 text-amber-300 px-3.5 py-1.5 rounded-xl uppercase tracking-wider">
                    परिस्थिति {currentIndex + 1} / 10
                  </span>
                  <span className="text-[9px] font-black bg-amber-100 text-amber-800 border-2 border-amber-250 px-3 py-1 rounded-xl uppercase tracking-wider hidden sm:inline-block animate-pulse">
                    ● कानून मित्र परीक्षा
                  </span>
                </div>
                <div className="font-mono text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-250 px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xs">
                  <Zap className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500 animate-bounce" />
                  <span>+{xpEarned} XP</span>
                </div>
              </div>

              {/* Scenario Context Frame */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl bg-slate-100 p-2.5 rounded-3xl shrink-0 shadow-xs ring-4 ring-slate-50">
                    {currentQ.icon}
                  </span>
                  <h3 className="text-xl font-black text-slate-800 leading-snug">
                    {currentQ.scenarioTitle}
                  </h3>
                </div>

                <div className="bg-gradient-to-tr from-slate-50 to-slate-100 p-6 md:p-8 rounded-[32px] border-3 border-slate-150 shadow-inner relative">
                  <span className="absolute -top-3.5 left-6 bg-amber-500 text-slate-950 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border border-amber-600">
                    घटना चक्र (Case Scenario)
                  </span>
                  <p className="text-xs md:text-sm font-black text-slate-700 leading-relaxed italic">
                    "{currentQ.situationText}"
                  </p>
                </div>
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-3 pt-2">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
                  संवैधानिक विकल्प: उचित एवं कानून-सम्मत विकल्प चुनें
                </p>

                <div className="space-y-2.5">
                  {currentQ.options.map((opt, oIdx) => {
                    const isSelected = selectedOption === oIdx;
                    const isCoreCorrect = opt.isCorrect;
                    
                    let cardStyle = "border-slate-150 bg-white hover:border-slate-300 text-slate-800";
                    if (isSelected) {
                      cardStyle = "border-amber-500 bg-amber-50 text-amber-950 font-black scale-[1.008] shadow-md";
                    }
                    if (isAnswered) {
                      if (isCoreCorrect) {
                        cardStyle = "border-emerald-500 bg-emerald-50/80 text-emerald-950 font-black shadow-md ring-2 ring-emerald-300";
                      } else if (isSelected) {
                        cardStyle = "border-rose-400 bg-rose-50/60 text-rose-950 font-medium scale-98 shrink-0 saturate-50";
                      } else {
                        cardStyle = "border-slate-100 bg-slate-50/20 text-slate-400 cursor-not-allowed pointer-events-none";
                      }
                    }

                    return (
                      <motion.button
                        key={oIdx}
                        onClick={() => handleOptionClick(oIdx)}
                        disabled={isAnswered}
                        className={`w-full text-left p-4 rounded-3xl border-3 md:text-xs text-[11px] font-bold transition-all flex items-start gap-3 cursor-pointer ${cardStyle}`}
                        whileHover={{ scale: isAnswered ? 1 : 1.005 }}
                        whileTap={{ scale: isAnswered ? 1 : 0.995 }}
                      >
                        <div className={`w-5 h-5 rounded-full flex shrink-0 items-center justify-center text-[10px] border-2 font-black ${
                          isSelected ? "bg-amber-500 border-amber-600 text-slate-950" : "bg-slate-50 border-slate-350 text-slate-500"
                        } ${isAnswered && isCoreCorrect ? "bg-emerald-500 border-emerald-600 text-white" : ""}`}>
                          {isAnswered && isCoreCorrect ? "✓" : String.fromCharCode(65 + oIdx)}
                        </div>
                        <span className="flex-1 leading-relaxed">{opt.text}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Action and Explanations bar */}
              <div className="pt-4 border-t border-dashed space-y-4">
                {!isAnswered ? (
                  <div className="flex justify-end">
                    <button
                      onClick={handleLockAnswer}
                      disabled={selectedOption === null}
                      className={`px-6 py-3 rounded-2xl font-black text-xs cursor-pointer shadow-md transition-all flex items-center gap-1 border-b-4 ${
                        selectedOption !== null
                          ? "bg-amber-500 border-amber-700 text-slate-950 hover:bg-amber-455 active:translate-y-0.5 active:border-b-2"
                          : "bg-slate-200 border-slate-350 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      <span>ताला लगाओ! (Lock Option)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 bg-slate-50 border border-slate-200 p-5 rounded-[28px] relative overflow-hidden"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-xl shrink-0">📖</span>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest block">
                          संविधान सूत्र और व्याख्या (Article Focus)
                        </span>
                        <p className="text-xs text-slate-650 leading-relaxed font-black">
                          {currentQ.explanation}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap shrink-0 items-center justify-between gap-3 pt-3 border-t border-slate-200">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-250 flex items-center gap-1">
                          🎖️ पुरस्कार बैज: <strong className="text-amber-950">{currentQ.badgeAward}</strong>
                        </span>
                      </div>

                      <button
                        onClick={handleNext}
                        className="px-5 py-2.5 bg-slate-900 border-b-4 border-slate-950 text-white hover:bg-slate-800 font-black text-xs rounded-xl cursor-pointer shadow flex items-center gap-1"
                      >
                        <span>{currentIndex + 1 < questions.length ? "अगली परिस्थिति ➔" : "परिणाम देखें 🏆"}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right Side Info Box */}
            <div className="lg:col-span-4 space-y-6">
              {/* Rules and motivation */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-3 border-amber-300 p-6 rounded-[35px] shadow-md space-y-4">
                <span className="text-3xl block">⚖️</span>
                <h4 className="text-sm font-black text-amber-950">
                  परिस्थिति-आधारित कसौटी कैसे खेलें?
                </h4>
                <ul className="text-xs text-slate-700 font-bold space-y-2 pb-2">
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-black">1.</span>
                    <span>आपको 10 यादृच्छिक रूप से बदली गई दैनिक परिस्थितियों का सामना करना होगा।</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-black">2.</span>
                    <span>प्रत्येक सही परिस्थिति समाधान पर <strong>+20 XP</strong> प्राप्त होंगे।</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-black">3.</span>
                    <span>नीचे दिया 'संविधान सूत्र' ज्ञान का गुप्त सूत्र है, इसे ध्यान से जरूर पढ़ें।</span>
                  </li>
                </ul>
              </div>

              {/* Progress Panel */}
              <div className="bg-white border-3 border-slate-150 p-6 rounded-[35px] shadow-md space-y-3">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  परीक्षा प्रगति चक्र (Progress Ring)
                </h4>
                <div className="grid grid-cols-5 gap-2 pt-1.5">
                  {questions.map((_, qIdx) => {
                    const isActive = currentIndex === qIdx;
                    const isPassed = qIdx < currentIndex;
                    return (
                      <div
                        key={qIdx}
                        className={`aspect-square rounded-xl border flex items-center justify-center font-mono text-[10px] font-black transition-all ${
                          isActive
                            ? "bg-amber-500 border-amber-600 text-slate-950 ring-2 ring-amber-300 animate-pulse"
                            : isPassed
                            ? "bg-emerald-100 border-emerald-300 text-emerald-850"
                            : "bg-slate-50 border-slate-200 text-slate-400"
                        }`}
                      >
                        {qIdx + 1}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Dynamic Rich Completion Dashboard */
          <motion.div
            key="finished"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto bg-white border-4 border-slate-150 rounded-[45px] p-8 md:p-12 shadow-2xl relative overflow-hidden text-center space-y-8"
          >
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-orange-400 via-white to-green-500"></div>
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-500/10 rounded-full filter blur-xl"></div>
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-indigo-500/10 rounded-full filter blur-xl"></div>

            <div className="space-y-3">
              <span className="text-6xl animate-bounce inline-block">🏆</span>
              <h2 className="text-3xl font-black text-slate-800">
                अद्भुत निर्णय क्षमता! आप बने "संविधान प्रहरी"
              </h2>
              <p className="text-sm font-bold text-slate-500 max-w-lg mx-auto leading-relaxed">
                आपने सभी 10 कठिन सामाजिक परिस्थितियों को सुलझाकर देश के कानून और संविधान के प्रति उत्कृष्ट दायित्व एवं सम्मान प्रदर्शित किया है।
              </p>
            </div>

            {/* Score Bento Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
              <div className="bg-amber-50 border-3 border-amber-200 p-6 rounded-[30px] shadow-inner flex flex-col justify-center items-center">
                <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest">सत्यता प्रतिशत (Correctness)</span>
                <span className="text-4xl font-black text-amber-950 font-mono mt-1">{(correctCount / questions.length) * 100}%</span>
                <span className="text-[11px] text-amber-700 font-bold mt-1">10 में से {correctCount} सही समाधान</span>
              </div>

              <div className="bg-emerald-50 border-3 border-emerald-200 p-6 rounded-[30px] shadow-inner flex flex-col justify-center items-center">
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest font-mono">अर्जित अंक</span>
                <span className="text-4xl font-black text-emerald-950 font-mono mt-1">+{correctCount * 20} XP</span>
                <span className="text-[11px] text-emerald-700 font-bold mt-1">कुल बाल संचित अंक (Trophy Room)</span>
              </div>
            </div>

            {/* Interactive Badge Segment */}
            <div className="bg-slate-50 border-2 border-slate-200 p-6 rounded-[38px] max-w-md mx-auto space-y-3">
              <span className="text-xs text-slate-400 font-extrabold uppercase">संवैधानिक सम्मान पदक</span>
              <div className="flex justify-center">
                <motion.div
                  className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 border-4 border-white shadow-xl flex items-center justify-center text-4xl relative cursor-pointer"
                  whileHover={{ scale: 1.12, rotate: 10 }}
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  ⚖️
                  <div className="absolute -bottom-2 bg-slate-900 border border-slate-950 text-[9px] text-amber-300 px-3 py-1 rounded-full font-black uppercase">
                    {correctCount >= 8 ? "सर्वोच्च न्यायनायक" : correctCount >= 5 ? "जागरूक नागरिक" : "संविधान अध्येता"}
                  </div>
                </motion.div>
              </div>
              <p className="text-xs font-black text-slate-650 leading-relaxed pt-2">
                {correctCount >= 8
                  ? "असाधारण विवेक! आपने सिद्ध कर दिया कि आप कानून की मूल चेतना से पूरी तरह परिचित हैं।"
                  : correctCount >= 5
                  ? "सराहनीय कार्य! आप देश के प्रति उत्तरदायी और जागरूक बालक हैं। ज्ञान को और निखारें!"
                  : "अच्छा प्रयास! दोबारा प्रयास करें और समस्त संविधान सूत्रों को कंठस्थ करके विजय प्राप्त करें।"}
              </p>
            </div>

            {/* Restart section */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-indigo-600 border-b-4 border-indigo-850 hover:bg-indigo-555 text-white font-black text-xs rounded-2xl cursor-pointer shadow flex items-center justify-center gap-1.5 min-w-44 transition-all active:translate-y-0.5 active:border-b-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>पुनः खेलें (New Shuffled Pool)</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

