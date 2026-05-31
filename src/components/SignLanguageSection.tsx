import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Check, 
  HelpCircle, 
  Volume2, 
  Award,
  Video
} from "lucide-react";

interface SignTerm {
  id: string;
  word: string;
  english: string;
  emoji: string;
  gestureDescription: string;
  stepByStepHindi: string[];
  pointsReward: number;
  signGraphicCode: string; // Describes hand shapes (e.g. "दोनों हाथों की उंगलियों को मिलाकर...")
  videoUrlPlaceholder: string;
}

interface SignLanguageSectionProps {
  setMascotData: (data: { mood: "happy" | "thinking" | "excited" | "proud" | "speaking" | "greeting"; text: string }) => void;
  incrementScore: (points: number) => void;
}

export default function SignLanguageSection({ setMascotData, incrementScore }: SignLanguageSectionProps) {
  // Key Constitutional Indian Sign Language (ISL) Gloss Term List
  const signTerms: SignTerm[] = [
    {
      id: "samvidhan",
      word: "संविधान (Constitution)",
      english: "CONSTITUTION",
      emoji: "📖",
      gestureDescription: "दोनों हथेलियों को आमने-सामने रखकर एक 'किताब' की तरह खोलने का इशारा करें, फिर 'नियम' दर्शाने के लिए इंडेक्स उंगली से हवा में कानून का चार्ट (वर्ग) बनाएं।",
      stepByStepHindi: [
        "दोनों हाथों के पंजों को आपस में जोड़ें जैसे नमस्ते करते हैं।",
        "अब उन्हें धीरे से खोलें मानो आप कोई भारी धार्मिक किताब (Book) खोल रहे हों।",
        "दाहिने हाथ की इंडेक्स फिंगर (तर्जनी) से हवा में एक चौकोर दस्तावेज़ का आकार बनाएं।"
      ],
      pointsReward: 15,
      signGraphicCode: "👐 📜 📖",
      videoUrlPlaceholder: "https://www.youtube.com/embed/S_8q1yI7d2g"
    },
    {
      id: "adhikar",
      word: "अधिकार (Rights)",
      english: "RIGHTS / FREEDOM",
      emoji: "⚖️",
      gestureDescription: "दाहिने हाथ की मुट्ठी को छाती के पास रखें, फिर विश्वास के साथ हाथ को खोलते हुए आगे की ओर बढ़ाएं, जैसे आप अपना हक मांग रहे हों।",
      stepByStepHindi: [
        "अपने दाहिने हाथ की मुट्ठी को बंद करके दिल के करीब लाएं।",
        "गहरी सांस लें और मुट्ठी को सीधे आगे आसमान की ओर ले जाएं।",
        "पूरी ताकत से हथेली खोलें ताकि वह सूर्य की किरणों की तरह फैले।"
      ],
      pointsReward: 15,
      signGraphicCode: "✊ ➔ ✋ ✨",
      videoUrlPlaceholder: "https://www.youtube.com/embed/N-YHe6M-Glg"
    },
    {
      id: "samanta",
      word: "समानता (Equality)",
      english: "EQUALITY",
      emoji: "🤝",
      gestureDescription: "दोनों हाथों की हथेलियों को नीचे की तरफ समानांतर (parallel) रखें और बिना ऊपर-नीचे किए क्षैतिज रूप से घुमाएं ताकि 'बराबर' होने का बोध हो।",
      stepByStepHindi: [
        "दोनों हाथों को पेट के स्तर पर सामने लाएं, हथेलियां जमीन की तरफ हों।",
        "दोनों हाथों को बिल्कुल एक ही ऊंचाई (स्तर) पर रखें।",
        "इन्हें एक साथ धीरे-धीरे बाईं से दाईं ओर ले जाएं, जिससे समतल स्तर दिखे।"
      ],
      pointsReward: 15,
      signGraphicCode: "🫱 ⚖️ 🫲",
      videoUrlPlaceholder: "https://www.youtube.com/embed/3A-4e8slyrU"
    },
    {
      id: "kartavya",
      word: "कर्तव्य (Duties)",
      english: "DUTIES / RESPONSIBILITY",
      emoji: "🙋‍♂️",
      gestureDescription: "दाहिने हाथ की तर्जनी और मध्यमा उंगली को मिलाकर अपने कंधे पर दो बार थपथपाएं, जो कि ज़िम्मेदारी के भारीपन और कर्तव्य का प्रतीक है।",
      stepByStepHindi: [
        "दाहिने हाथ की 'V' मुद्रा (तर्जनी और मध्यमा) को आपस में सटाएं।",
        "इसे अपने दाहिने कंधे पर धीरे से स्पर्श कराएं जिसे ज़िम्मेदारी का बिल्ला माना जाता है।",
        "चेहरे पर दृढ़ संकल्प के भाव के साथ सिर को दो बार हाँ में हिलाएं।"
      ],
      pointsReward: 15,
      signGraphicCode: "✌️ ➔ 👤 🎖️",
      videoUrlPlaceholder: "https://www.youtube.com/embed/9Bv_3fO8O5Q"
    },
    {
      id: "loktantra",
      word: "लोकतंत्र (Democracy / Vote)",
      english: "DEMOCRACY / VOTE",
      emoji: "🗳️",
      gestureDescription: "हाथ में बैलेट पेपर पकड़ने का अभिनय करें और उसे काल्पनिक मतपेटी (बॉक्स) के संकीर्ण छेद में डालने का इशारा करें, फिर गर्व से अपनी स्याही लगी उंगली दिखाएं।",
      stepByStepHindi: [
        "अंगूठे और तर्जनी उंगली को आपस में मिलाकर एक छोटे कागज़ को पकड़ने की मुद्रा बनाएं।",
        "हाथ को नीचे ले जाते हुए काल्पनिक बॉक्स में कागज़ डालने का इशारा करें।",
        "अंत में अपनी तर्जनी उंगली (Index finger) को ऊपर उठाकर वोट डालने का गौरव दिखाएं।"
      ],
      pointsReward: 15,
      signGraphicCode: "👌 ➔ 🗳️ ➔ ☝️",
      videoUrlPlaceholder: "https://www.youtube.com/embed/8vRclqVj6-w"
    },
    {
      id: "bharat",
      word: "भारत (India)",
      english: "INDIA",
      emoji: "🇮🇳",
      gestureDescription: "दोनों हाथों की हथेलियों को जोड़कर गोल घूमता हुआ चक्र बनाएं जो विविधता और एकता के चक्र को दर्शाता है, फिर माथे पर बिंदी/तिलक का इशारा करें।",
      stepByStepHindi: [
        "दोनों हाथों की उंगलियों को फैलाकर आपस में गुंथ लें (इंटरलोक करें) जिससे कश्मीर से कन्याकुमारी तक की एकता दिखे।",
        "अब उंगलियों को माथे के केंद्र की ओर ले जाएं और बिंदी या तिलक का इशारा करें।",
        "चेहरे पर सस्मित (मुस्कुराहट) के साथ दोनों हाथों को खोलकर पूरे देश को समर्पित करें।"
      ],
      pointsReward: 20,
      signGraphicCode: "👐 ➔ 🤝 ➔ 🇮🇳",
      videoUrlPlaceholder: "https://www.youtube.com/embed/q0_0n6FqgO8"
    }
  ];

  const [selectedTerm, setSelectedTerm] = useState<SignTerm>(signTerms[0]);
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem("samvidhan_completed_sign_lessons");
    return saved ? JSON.parse(saved) : [];
  });

  const [composedSentence, setComposedSentence] = useState<string[]>([]);
  const [successScoreClaimed, setSuccessScoreClaimed] = useState<string | null>(null);

  const [customVideos, setCustomVideos] = useState<Record<string, { id: string; title: string; url: string }[]>>({});
  const [activeVideoId, setActiveVideoId] = useState<string>("default");

  useEffect(() => {
    const handleSync = () => {
      const stored = localStorage.getItem("samvidhan_sign_videos");
      if (stored) {
        try {
          setCustomVideos(JSON.parse(stored));
        } catch (e) {
          console.error("Error parsing sign language videos:", e);
        }
      }
    };
    handleSync();
    window.addEventListener("storage", handleSync);
    return () => window.removeEventListener("storage", handleSync);
  }, []);

  const termVideos = customVideos[selectedTerm.id] && customVideos[selectedTerm.id].length > 0
    ? customVideos[selectedTerm.id]
    : [{ id: "default", title: "प्रमुख सांकेतिक पाठ (Official Guide)", url: selectedTerm.videoUrlPlaceholder }];

  const activeVideo = termVideos.find(v => v.id === activeVideoId) || termVideos[0];

  useEffect(() => {
    if (termVideos.length > 0) {
      const exists = termVideos.some(v => v.id === activeVideoId);
      if (!exists) {
        setActiveVideoId(termVideos[0].id);
      }
    }
  }, [selectedTerm, customVideos, termVideos, activeVideoId]);

  // Alphabet sign indicators (Interactive standard Indian fingerspelling chart helper)
  const fingerspellingAlphabets = [
    { letter: "A", gesture: "✊ (मुट्ठी बंद, अंगूठा बगल में)" },
    { letter: "B", gesture: "✋ (हथेली खुली, उंगलियां सटी)" },
    { letter: "C", gesture: "👌 (उंगलियों को आधा मोड़कर 'C' आकार)" },
    { letter: "D", gesture: "☝️ (तर्जनी आसमान की तरफ, बाकी बंद)" },
    { letter: "E", gesture: "✊ (उंगलियों को मोड़कर अंगूठे पर रखना)" },
    { letter: "F", gesture: "👌 (तर्जनी और अंगूठे को सटाकर गोल)" },
    { letter: "G", gesture: "👉 (तर्जनी और अंगूठा समानांतर बाहर की ओर)" },
    { letter: "H", gesture: "👉 (तर्जनी + मध्यमा दोनों बाहर की ओर)" }
  ];

  useEffect(() => {
    setMascotData({
      mood: "greeting",
      text: "नमस्कार दोस्तों! आज हम सीखेंगे कि कैसे हमारे मूक-बधिर (Hearing-impaired) सहपाठी सुंदर सांकेतिक भाषा (Sign Language) से हमारे देश के महान संविधान को सीखते हैं। चलो मिलकर अभ्यास करें!"
    });
  }, [setMascotData]);

  const handleLessonComplete = (term: SignTerm) => {
    if (completedLessons.includes(term.id)) {
      setMascotData({
        mood: "happy",
        text: `अरे वाह! आपने '${term.word}' के इशारों का अभ्यास पहले ही कर लिया है! इसे बार-बार करने से आपकी पकड़ मजबूत होगी!`
      });
      return;
    }

    const nextCompleted = [...completedLessons, term.id];
    setCompletedLessons(nextCompleted);
    localStorage.setItem("samvidhan_completed_sign_lessons", JSON.stringify(nextCompleted));

    // Increment global scoreboard points
    incrementScore(term.pointsReward);

    setMascotData({
      mood: "proud",
      text: `शाबाश बच्चों! आपने '${term.word}' का इशारा सही ढंग से सीख लिया है और आपको पुरस्कार स्वरूप +${term.pointsReward} अंक मिले हैं! कुल प्रगति बढ़ रही है!`
    });

    setSuccessScoreClaimed(`🎉 बधाई! आपने +${term.pointsReward} राष्ट्रीय बाल अभियान पॉइंट्स अर्जित किए!`);
    setTimeout(() => {
      setSuccessScoreClaimed(null);
    }, 4000);
  };

  const handleAddToSentence = (word: string) => {
    if (composedSentence.length >= 4) {
      setMascotData({
        mood: "thinking",
        text: "आपका वाक्य काफी बड़ा हो गया है! वाक्य को साफ़ करके नया वाक्य बनाएं।"
      });
      return;
    }
    setComposedSentence(prev => [...prev, word]);
    
    // Auto speech helper text
    try {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "hi-IN";
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch {}
  };

  const clearSentence = () => {
    setComposedSentence([]);
  };

  return (
    <div className="space-y-10">
      {/* 🌟 Splash Hero Header */}
      <div className="bg-gradient-to-br from-teal-500 via-indigo-600 to-indigo-800 text-white p-6 md:p-10 rounded-[40px] text-center space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl transform translate-x-12 -translate-y-12"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl transform -translate-x-20 translate-y-20"></div>

        <div className="flex flex-col items-center space-y-3">
          <div className="p-3.5 bg-white/15 rounded-3xl backdrop-blur-md border border-white/20 shadow-md">
            <span className="text-5xl block animate-pulse">🤟</span>
          </div>
          <span className="text-xs font-black bg-teal-450/30 text-teal-200 border-2 border-teal-300 px-4 py-1.5 rounded-full uppercase tracking-widest select-none">
            विशेष बाल समावेशी शिक्षा • Inclusive Education
          </span>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight">
            मूक-बधिर साक्षरता: सांकेतिक भाषा (Sign Language)
          </h2>
          <p className="text-xs md:text-sm font-bold text-slate-100 max-w-2xl leading-relaxed">
            हमारे विशेष बच्चों (Hearing-impaired students) के साथ कदम से कदम मिलाकर आगे बढ़ें! संविधान के मुख्य स्तंभों जैसे कानून, चुनाव, अधिकार व कर्तव्य को सरल सुंदर हाथ के इशारों (ISL) द्वारा सीखें और एक जागरूक भारतीय बनें! 🇮🇳
          </p>
        </div>
      </div>

      {/* Rewards Center Indicator */}
      <div className="bg-white border-3 border-teal-500 rounded-[28px] p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-teal-50 p-2.5 rounded-2xl border border-teal-200 text-3xl">🎖️</div>
          <div className="text-left">
            <h3 className="text-base font-black text-slate-800">साइन लैंग्वेज मास्टर मेडल</h3>
            <p className="text-[11px] text-slate-500 font-bold">जितने अधिक इशारों का अभ्यास करेंगे, उतने अधिक मेडल और राष्ट्रीय पॉइंट मिलेंगे!</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-650 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            कुल सहेजे गए अभ्यास:
          </span>
          <span className="text-lg font-black text-teal-650 bg-teal-100/90 border-2 border-teal-300 px-4 py-1 rounded-2xl font-mono">
            {completedLessons.length} / {signTerms.length}
          </span>
        </div>
      </div>

      {/* Main Two-Column Classroom Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Term Selectors List (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest pl-2">
            📖 सीखें मुख्य संविधान शब्दावली:
          </h4>

          <div className="grid grid-cols-1 gap-2.5">
            {signTerms.map((term) => {
              const completed = completedLessons.includes(term.id);
              const isActive = selectedTerm.id === term.id;
              return (
                <button
                  key={term.id}
                  onClick={() => setSelectedTerm(term)}
                  className={`w-full text-left p-4 rounded-[24px] border-2 transition-all cursor-pointer flex items-center justify-between group ${
                    isActive
                      ? "bg-teal-500 border-teal-600 text-white shadow-md transform -translate-y-1"
                      : "bg-white border-slate-200 hover:border-teal-400 text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-3xl p-1.5 bg-slate-100 rounded-xl group-hover:scale-110 transition shrink-0">
                      {term.emoji}
                    </span>
                    <div className="min-w-0 text-left">
                      <p className={`font-black text-xs leading-tight truncate uppercase tracking-tight`}>
                        {term.english}
                      </p>
                      <h4 className={`text-sm font-bold truncate leading-snug mt-0.5 ${isActive ? "text-white" : "text-slate-800"}`}>
                        {term.word}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {completed ? (
                      <span className="bg-emerald-500 text-white border-2 border-emerald-300 rounded-full p-1 text-[10px] shadow-sm font-black flex items-center justify-center w-6 h-6">
                        ✓
                      </span>
                    ) : (
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${isActive ? "bg-teal-600 text-white" : "bg-teal-50 text-teal-600 border border-teal-200"}`}>
                        +{term.pointsReward} PTS
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Banner for Fingerspelling Alphabet */}
          <div className="bg-slate-900 text-slate-100 p-5 rounded-[28px] border-2 border-slate-800 space-y-4 shadow-sm text-left">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🖐️</span>
              <div>
                <h4 className="font-black text-[12px] uppercase text-slate-300 tracking-wider">
                  भारतीय साइन चार्ट (ISL Symbols)
                </h4>
                <p className="text-[10px] text-slate-500 font-extrabold">मूलभूत वर्णमाला के इशारे</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10.5px]">
              {fingerspellingAlphabets.map((item) => (
                <div key={item.letter} className="bg-slate-950 p-2 rounded-xl border border-slate-850 flex items-center gap-2">
                  <span className="font-mono bg-teal-500 text-slate-950 font-black px-2 py-0.5 rounded-md">
                    {item.letter}
                  </span>
                  <span className="font-bold text-slate-400 text-[10px] truncate">{item.gesture}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Classroom Display (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTerm.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="bg-white border-4 border-slate-200 rounded-[36px] p-6 md:p-8 space-y-6 shadow-xs text-left"
            >
              {/* Header inside display card */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl p-2.5 bg-teal-100 border border-teal-200 rounded-2xl block">{selectedTerm.emoji}</span>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900">{selectedTerm.word}</h3>
                    <p className="text-xs font-mono text-indigo-600 uppercase tracking-widest font-extrabold mt-0.5">
                      INDIAN SIGN LANGUAGE GLOSS: {selectedTerm.english}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto self-end">
                  {completedLessons.includes(selectedTerm.id) ? (
                    <div className="bg-emerald-50 text-emerald-800 border-2 border-emerald-400 rounded-full px-4 py-1.5 text-xs font-black flex items-center gap-1.5 shadow-xs w-full justify-center">
                      <span className="text-lg">✓</span>
                      <span>अभ्यास पूर्ण हो गया</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleLessonComplete(selectedTerm)}
                      className="w-full bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 text-white font-black text-xs px-5 py-2.5 rounded-xl border-b-4 border-indigo-850 active:border-b-0 cursor-pointer shadow-md transition-all duration-150 flex items-center justify-center gap-1.5 animate-pulse"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300 animate-bounce" />
                      <span>मैने इशारा सीख लिया + {selectedTerm.pointsReward} PTS</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Status Alert for newly claimed score */}
              {successScoreClaimed && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-emerald-50 border-3 border-emerald-400 rounded-2xl p-3 text-center text-xs font-black text-emerald-800 animate-bounce"
                >
                  {successScoreClaimed}
                </motion.div>
              )}

              {/* Visual Simulated Hand-Movement Board */}
              <div className="p-6 bg-gradient-to-b from-teal-900 to-slate-950 border-3 border-teal-500 rounded-[30px] text-white space-y-4 text-center shadow-lg relative overflow-hidden">
                <span className="absolute top-2 right-2 text-xs font-black text-teal-400/40 font-mono tracking-wider">CLASSROOM PROJECTION</span>
                
                <div className="flex justify-center items-center gap-4 py-6">
                  {/* Digital hand gesture indicators */}
                  <span className="text-6xl animate-pulse filter drop-shadow-[0_4px_10px_rgba(20,184,166,0.6)]">🤟</span>
                  <div className="bg-white/10 border border-white/20 px-4 py-2.5 rounded-2xl font-mono text-sm tracking-widest text-teal-300 font-black">
                    {selectedTerm.signGraphicCode}
                  </div>
                  <span className="text-6xl animate-bounce filter drop-shadow-[0_4px_10px_rgba(99,102,241,0.6)]">👋</span>
                </div>

                <div className="space-y-1.5 max-w-lg mx-auto">
                  <span className="text-[10px] bg-teal-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full select-none uppercase tracking-widest">
                    गतिविधि का मुख्य संकेत (Main Gesture Sign)
                  </span>
                  <p className="text-xs md:text-sm font-extrabold text-slate-200 mt-1 leading-relaxed">
                    {selectedTerm.gestureDescription}
                  </p>
                </div>
              </div>

              {/* Step By Step Instructions Table */}
              <div className="space-y-3 text-left">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  💡 कदम-दर-कदम अभ्यास प्रक्रिया (Step-by-Step Training):
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {selectedTerm.stepByStepHindi.map((step, idx) => (
                    <div key={idx} className="bg-slate-50 border-2 border-slate-200 rounded-[20px] p-4 space-y-2 hover:border-teal-300 transition-colors">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-teal-500 text-white font-extrabold text-[11px] rounded-lg w-5 h-5 flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-[10px] text-teal-600 font-extrabold uppercase font-mono">चरण (Step)</span>
                      </div>
                      <p className="text-xs text-slate-700 font-bold leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* YouTube Sign Training Video for realistic learning experience */}
              <div className="border-2 border-slate-200 rounded-[28px] overflow-hidden bg-slate-50 p-4 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 text-xl">📺</span>
                    <h4 className="font-black text-xs text-slate-800">वीडियो से सीखें: भारतीय सांकेतिक भाषा (ISL Academy Guide)</h4>
                  </div>
                  <span className="text-[9.5px] bg-teal-50 border border-teal-200 text-teal-700 font-black px-2 py-0.5 rounded-md self-start sm:self-auto">
                    LIVE SIGN LESSON: {activeVideo.title}
                  </span>
                </div>

                {termVideos.length > 1 && (
                  <div className="flex flex-wrap gap-1.5 p-2 bg-slate-100 rounded-2xl border border-slate-200">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block w-full mb-1 pl-1">चुनें अन्य सहायक वीडियो (Alternate Sign Guides):</span>
                    {termVideos.map((vid) => (
                      <button
                        key={vid.id}
                        type="button"
                        onClick={() => setActiveVideoId(vid.id)}
                        className={`px-3 py-1.5 text-[10.5px] font-bold rounded-xl transition-all cursor-pointer border shadow-xs ${
                          activeVideoId === vid.id
                            ? "bg-teal-500 text-white border-teal-600 scale-[1.02]"
                            : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {vid.title}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-inner border border-slate-350 bg-slate-900">
                  <iframe
                    className="w-full h-full"
                    src={`${activeVideo.url}?controls=1&modestbranding=1`}
                    title="Indian Sign Language Training Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

          {/* 🧩 Interactive Sign Composer Game Box (वाक्य रचना खेल) */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-100 border-4 border-amber-300 rounded-[36px] p-6 md:p-8 space-y-6 shadow-sm text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-amber-200/50 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl animate-bounce">💬</span>
                <div>
                  <h3 className="text-lg font-black text-slate-900">वाक्य निर्माता खेल (Compose sign sentences)</h3>
                  <p className="text-xs text-slate-550 font-bold">शब्दावली के पत्तों को आपस में जोड़कर नया कथन बनाएं और सांकेतिक आवाज़ सुनें!</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={clearSentence}
                  className="px-3.5 py-1.5 bg-white hover:bg-rose-50 border-2 border-slate-250 text-slate-650 hover:text-rose-600 rounded-xl text-[10px] font-black cursor-pointer select-none transition-all"
                >
                  रीसेट करें (Reset)
                </button>
              </div>
            </div>

            {/* Display Board for sentence composed */}
            <div className="bg-white/95 border-3 border-dashed border-slate-300 rounded-[24px] p-5 min-h-[90px] flex flex-wrap gap-2 items-center justify-center shadow-inner">
              {composedSentence.length === 0 ? (
                <div className="text-center py-2 text-slate-400">
                  <span className="text-2xl block mb-1">👈👇</span>
                  <p className="text-[10px] font-black uppercase tracking-wider">नीचे दी गई शब्दावली से शब्द चुनें</p>
                </div>
              ) : (
                composedSentence.map((word, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-indigo-600 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-sm border-2 border-indigo-400 select-none cursor-pointer"
                  >
                    <span>{word}</span>
                    <span className="text-[9px] bg-indigo-800 text-white p-0.5 rounded-full block">🤟</span>
                  </motion.div>
                ))
              )}
            </div>

            {/* Tap triggers lists */}
            <div className="space-y-2">
              <span className="text-[10px] font-black text-amber-800 tracking-wider block uppercase">शब्दावली चयन बॉक्स (Click to Add Word):</span>
              <div className="flex flex-wrap gap-2">
                {[
                  "समानता", 
                  "हमारा", 
                  "अधिकार हैं", 
                  "कर्तव्य", 
                  "सबसे बड़ा है", 
                  "संविधान", 
                  "सर्वोपरी है", 
                  "भारत",
                  "एक महान",
                  "लोकतंत्र है"
                ].map((word) => (
                  <button
                    key={word}
                    onClick={() => handleAddToSentence(word)}
                    className="bg-white hover:bg-indigo-50 border-2 border-amber-300 hover:border-indigo-400 font-extrabold text-slate-800 text-[11px] px-3.5 py-2 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xs shrink-0 cursor-pointer"
                  >
                    🚀 {word}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
