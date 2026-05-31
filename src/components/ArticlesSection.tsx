/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  BookOpen, 
  Youtube, 
  Sparkles, 
  Search, 
  X 
} from "lucide-react";

export interface ArticleItem {
  id: string;
  number: string;
  title: string;
  description: string;
  defaultYtUrl: string;
  icon: string;
  color: string;
}

export interface ArticlesSectionProps {
  setMascotData: (data: { mood: "happy" | "thinking" | "excited" | "proud" | "speaking" | "greeting"; text: string }) => void;
}

interface ArticleFlipCardProps {
  key?: string;
  art: ArticleItem;
  index: number;
  customUrl: string;
  clickCounts: Record<string, number>;
  handleArticleClick: (artId: string) => void;
  playClickTick: () => void;
}

function ArticleFlipCard({
  art,
  customUrl,
  clickCounts,
  handleArticleClick,
  playClickTick,
}: ArticleFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent, flipTo: boolean) => {
    if (e.key === "Enter" || e.key === " " || e.code === "Space") {
      e.preventDefault();
      setIsFlipped(flipTo);
      playClickTick();
    }
  };

  return (
    <div 
      style={{ perspective: "1200px" }}
      className="w-full min-h-[340px] h-[340px]"
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* FRONT SIDE */}
        <div
          tabIndex={0}
          onClick={() => {
            setIsFlipped(true);
            playClickTick();
          }}
          onKeyDown={(e) => handleKeyDown(e, true)}
          style={{ 
            backfaceVisibility: "hidden", 
            position: "absolute", 
            width: "100%", 
            height: "100%", 
            top: 0, 
            left: 0,
            WebkitBackfaceVisibility: "hidden"
          }}
          className={`p-6 rounded-[28px] border-3 shadow-xs hover:shadow-lg flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-4 focus:ring-cyan-400 select-none transition-all ${art.color}`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-3xl p-2 bg-white/90 rounded-2xl shadow-xs border border-white/60">{art.icon}</span>
                <span className="text-xs font-black bg-gradient-to-r from-orange-500 to-amber-600 text-white px-3 py-1 rounded-full select-none">
                  {art.number}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center border border-indigo-200">
                <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" />
              </div>
            </div>

            <div className="space-y-3 py-4 text-center">
              <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                {art.title}
              </h3>
              <p className="text-[10px] text-cyan-650 font-extrabold uppercase tracking-widest bg-cyan-100/60 py-1.5 px-3 rounded-xl inline-block">
                🧐 क्या आप इसका अर्थ जानते हैं?
              </p>
            </div>
          </div>

          <div className="pt-3 border-t-2 border-dashed border-slate-300/40 flex items-center justify-center gap-2 bg-white/45 py-2.5 rounded-2xl">
            <span className="text-xl animate-bounce">🔄</span>
            <span className="text-[11px] font-black text-slate-800 tracking-wide">
              स्पष्टीकरण देखने के लिए थपथपाएं! (Tap/Press Enter to Flip)
            </span>
          </div>
        </div>

        {/* BACK SIDE */}
        <div
          tabIndex={0}
          onClick={() => {
            setIsFlipped(false);
            playClickTick();
          }}
          onKeyDown={(e) => handleKeyDown(e, false)}
          style={{ 
            backfaceVisibility: "hidden", 
            position: "absolute", 
            width: "100%", 
            height: "100%", 
            top: 0, 
            left: 0,
            transform: "rotateY(180deg)",
            WebkitBackfaceVisibility: "hidden"
          }}
          className={`p-5 rounded-[28px] border-3 shadow-xs hover:shadow-lg flex flex-col justify-between overflow-y-auto cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-400 select-none transition-all ${art.color}`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl p-1.5 bg-white/90 rounded-xl shadow-xs border border-white/50">{art.icon}</span>
                <span className="text-[10px] font-black bg-gradient-to-r from-cyan-600 to-indigo-600 text-white px-2.5 py-0.5 rounded-full select-none">
                  {art.number}
                </span>
              </div>
              <span className="text-[9.5px] text-indigo-700 bg-white/80 font-black px-2.5 py-0.5 rounded-full border border-indigo-200 uppercase tracking-wider">
                💡 सरल स्पष्टीकरण
              </span>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">{art.title} (सरल शब्दों में):</h4>
              <p className="text-[13px] md:text-[13.5px] font-bold text-slate-800 leading-relaxed bg-white/80 p-3 rounded-2xl border border-white/50 shadow-inner">
                {art.description}
              </p>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-300/60 flex flex-col gap-2 shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col text-left min-w-0" onClick={(e) => e.stopPropagation()}>
                <span className="text-[8.5px] text-slate-500 font-bold font-mono truncate max-w-[120px]" title={customUrl || art.defaultYtUrl}>
                  {customUrl ? "कस्टम लिंक सक्रिय" : "डिफ़ॉल्ट वीडियो"}
                </span>
                <span className="text-[9.5px] text-indigo-650 font-black flex items-center gap-1 mt-0.5 bg-indigo-100/60 px-2.5 py-0.5 rounded-md w-fit">
                  👁️ देखा: {clickCounts[art.id] || 0} बार
                </span>
              </div>

              <a
                href={customUrl || art.defaultYtUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleArticleClick(art.id);
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-black text-[10px] px-3.5 py-2 rounded-xl transition duration-150 border-b-2 border-red-800 active:border-b-0 cursor-pointer flex items-center gap-1 shadow-xs shrink-0"
              >
                <Youtube className="w-4 h-4 text-white fill-current animate-pulse animate-duration-1000" />
                <span>वीडियो देखें ➔</span>
              </a>
            </div>

            <p className="text-[9px] text-slate-500 font-black text-center uppercase tracking-wider leading-none">
              🔄 वापस जाने के लिए कहीं भी क्लिक करें
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export const ARTICLES_DATA: ArticleItem[] = [
  {
    id: "art-1",
    number: "अनुच्छेद १",
    title: "भारत: राज्यों का संघ (Union of States)",
    description: "हमारा प्यारा भारत विभिन्न राज्यों और संस्कृतियों का एक अटूट संघ है, जो विविधता में एकता का भव्य संदेश देता है।",
    defaultYtUrl: "https://www.youtube.com/watch?v=0fZDyK_tVFU",
    icon: "🗺️",
    color: "from-orange-500 to-amber-500 border-orange-200 bg-orange-50/50"
  },
  {
    id: "art-14",
    number: "अनुच्छेद १४",
    title: "समानता का अधिकार (Equality before Law)",
    description: "कानून की नजरों में सभी बराबर हैं! चाहे अमीर हो या गरीब, लड़का हो या लड़की, संविधान सबको एक समान सुरक्षा प्रदान करता है।",
    defaultYtUrl: "https://www.youtube.com/watch?v=FAtasE6P110",
    icon: "⚖️",
    color: "from-sky-500 to-indigo-500 border-sky-200 bg-sky-50/50"
  },
  {
    id: "art-15",
    number: "अनुच्छेद १५",
    title: "भेदभाव का अंत (Prohibition of Discrimination)",
    description: "किसी भी बच्चे के साथ धर्म, जाति, लिंग या जन्मस्थान के आधार पर स्कूल, खेल के मैदान या सार्वजनिक स्थलों पर भेदभाव नहीं किया जा सकता।",
    defaultYtUrl: "https://www.youtube.com/watch?v=FAtasE6P110",
    icon: "🤝",
    color: "from-teal-500 to-emerald-500 border-teal-200 bg-teal-50/50"
  },
  {
    id: "art-19",
    number: "अनुच्छेद १९",
    title: "बोलने व विचार रखने की आजादी (Freedom of Speech)",
    description: "सभी बच्चों को अपनी बात रखने, सवाल पूछने, चित्र बनाने, और शांतिपूर्ण ढंग से मित्र बनाने का पूरा संवैधानिक अधिकार है।",
    defaultYtUrl: "https://www.youtube.com/watch?v=7uV8-w8w6kE",
    icon: "🗣️",
    color: "from-rose-500 to-pink-500 border-rose-200 bg-rose-50/50"
  },
  {
    id: "art-21",
    number: "अनुच्छेद २१",
    title: "जीवन और सम्मान का अधिकार (Right to Life & Liberty)",
    description: "प्रत्येक व्यक्ति को सम्मान के साथ जीने, स्वच्छ हवा-पानी का आनंद लेने और सुरक्षित माहौल में स्वतंत्र रहने का मौलिक अधिकार प्राप्त है।",
    defaultYtUrl: "https://www.youtube.com/watch?v=W0q34N8P-bA",
    icon: "🕊️",
    color: "from-violet-500 to-purple-500 border-violet-200 bg-violet-50/50"
  },
  {
    id: "art-21a",
    number: "अनुच्छेद २१ए",
    title: "मुफ़्त व अनिवार्य शिक्षा (Right to Education)",
    description: "६ से १४ साल के सभी बच्चों के लिए स्कूली शिक्षा पाना उनका मौलिक अधिकार है। 'आधी रोटी खाएंगे, स्कूल जरूर जाएंगे!'",
    defaultYtUrl: "https://www.youtube.com/watch?v=34d7U0f42vU",
    icon: "🎒",
    color: "from-amber-500 to-yellow-500 border-amber-200 bg-amber-50/55"
  },
  {
    id: "art-32",
    number: "अनुच्छेद ३२",
    title: "संवैधानिक उपचार (Constitutional Remedies)",
    description: "यदि कोई आपके मौलिक अधिकारों को छीनने की कोशिश करे, तो आप सीधे उच्चतम न्यायालय (Supreme Court) जाकर इंसाफ मांग सकते हैं।",
    defaultYtUrl: "https://www.youtube.com/watch?v=UqQ-n6_YtD4",
    icon: "🏛️",
    color: "from-purple-600 to-indigo-600 border-purple-200 bg-purple-50/50"
  },
  {
    id: "art-51a",
    number: "अनुच्छेद ५१ए",
    title: "हमारे मूलभूत कर्तव्य (Fundamental Duties)",
    description: "जैसे संविधान हमें अधिकार देता है, वैसे ही राष्ट्रगान का आदर करना, प्रकृति को स्वच्छ रखना और वैज्ञानिक दृष्टिकोण अपनाना हमारा पावन कर्तव्य है।",
    defaultYtUrl: "https://www.youtube.com/watch?v=e_wK_I-n1wU",
    icon: "🇮🇳",
    color: "from-emerald-600 to-lime-600 border-emerald-250 bg-emerald-50/50"
  },
  {
    id: "art-326",
    number: "अनुच्छेद ३२६",
    title: "वयस्क मताधिकार (Universal Adult Suffrage)",
    description: "१८ वर्ष या उससे बड़े प्रत्येक भारतीय नागरिक को बिना किसी भेदभाव के वोट देने और पसंदीदा सरकार चुनने का सर्वोच्च अधिकार प्राप्त है।",
    defaultYtUrl: "https://www.youtube.com/watch?v=T_8V06qO58A",
    icon: "🗳️",
    color: "from-fuchsia-600 to-pink-600 border-fuchsia-200 bg-fuchsia-50/50"
  }
];

export default function ArticlesSection({ setMascotData }: ArticlesSectionProps) {
  const articles = ARTICLES_DATA;

  const loadUrls = () => {
    const loaded: Record<string, string> = {};
    articles.forEach((art) => {
      loaded[art.id] = localStorage.getItem(`samvidhan_article_yt_${art.id}`) || "";
    });
    return loaded;
  };

  const loadClicks = () => {
    const counts: Record<string, number> = {};
    articles.forEach((art) => {
      counts[art.id] = Number(localStorage.getItem(`samvidhan_article_clicks_${art.id}`)) || 0;
    });
    return counts;
  };

  const [urls, setUrls] = useState<Record<string, string>>(loadUrls);
  const [clickCounts, setClickCounts] = useState<Record<string, number>>(loadClicks);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = articles.filter(art => {
    const q = searchQuery.toLowerCase().trim();
    return (
      art.title.toLowerCase().includes(q) ||
      art.description.toLowerCase().includes(q) ||
      art.number.toLowerCase().includes(q) ||
      art.id.toLowerCase().includes(q)
    );
  });

  const playClickTick = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      }
    } catch {}
  };

  const handleArticleClick = (artId: string) => {
    const newCount = (clickCounts[artId] || 0) + 1;
    setClickCounts(prev => ({ ...prev, [artId]: newCount }));
    localStorage.setItem(`samvidhan_article_clicks_${artId}`, String(newCount));
    
    // Play a friendly feedback sound
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(440, ctx.currentTime); 
        osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.08); 
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.16); 
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.24);
      }
    } catch {}
    // Trigger storage event so that other tabs update immediately if needed
    window.dispatchEvent(new Event("storage"));
  };

  const handleResetClicks = () => {
    if (window.confirm("क्या आप सचमुच सभी वीडियो क्लिक आँकड़े शून्य (0) करना चाहते हैं?")) {
      const fresh: Record<string, number> = {};
      articles.forEach((art) => {
        fresh[art.id] = 0;
        localStorage.removeItem(`samvidhan_article_clicks_${art.id}`);
      });
      setClickCounts(fresh);
      setMascotData({
        mood: "thinking",
        text: "क्लिक आँकड़े सफलतापूर्वक रीसेट कर दिए गए हैं! 📊🔄"
      });
      window.dispatchEvent(new Event("storage"));
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setUrls(loadUrls());
      setClickCounts(loadClicks());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    setMascotData({
      mood: "proud",
      text: "प्यारे बच्चों! इस तालिका में भारत के महत्वपूर्ण अनुच्छेदों की सूची सुंदर एनिमेशन के साथ लगाईं गई है। इनके सचित्र यूट्यूब वीडियो देखने के लिए कार्ड पलटें! 🧭⚔️"
    });
  }, [setMascotData]);

  return (
    <div className="space-y-8 animate-fadeIn font-sans text-left">
      {/* Tab Banner */}
      <div className="bg-gradient-to-r from-cyan-500 via-sky-600 to-indigo-700 text-white p-6 rounded-[32px] shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="bg-cyan-100 text-cyan-950 border border-cyan-300 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider block w-fit">
            📜 जादूई स्क्रॉल यात्रा • MAGICAL SCROLL JOURNEY
          </span>
          <h2 className="text-xl md:text-3xl font-black drop-shadow-xs">
            जादूई स्क्रॉल यात्रा: संविधान अनुच्छेद (Article Scroll Journey)
          </h2>
          <p className="text-xs text-cyan-100/90 font-bold leading-relaxed font-sans">
            यहाँ हमारे पावन संविधान के महत्वपूर्ण अनुच्छेदों को बच्चों के लिए सरल शब्दों और सुंदर चित्रों द्वारा प्रस्तुत किया गया है। साथ ही आगे दिए गए यूट्यूब बटन पर क्लिक करके सुंदर सचित्र व्याख्यात्मक वीडियो देख सकते हैं!
          </p>
        </div>
        <div className="shrink-0 flex items-center justify-center">
          <BookOpen className="w-16 h-16 text-cyan-100/30 animate-pulse hidden md:block" />
        </div>
      </div>

      {/* 🔍 SEARCH AND FILTERS BAR */}
      <div className="bg-white border-2 border-slate-200 rounded-[24px] p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <Search className="w-4.5 h-4.5" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              playClickTick();
            }}
            placeholder="अनुच्छेद क्रमांक, विषय या विवरण खोजें... (उदा: समानता, शिक्षा, ३२)"
            className="w-full bg-slate-50 border-2 border-slate-200 hover:border-slate-300 focus:border-cyan-500 focus:bg-white text-slate-800 font-bold text-xs pl-10 pr-10 py-2.5 rounded-xl focus:outline-none transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                playClickTick();
              }}
              className="absolute inset-y-0 right-0 flex items-center pr-3 hover:text-cyan-600 text-slate-400 font-black cursor-pointer"
              title="खोज साफ़ करें"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className="text-[11px] text-slate-500 font-extrabold text-right">
          कुल प्रदर्शित: {filteredArticles.length} / {articles.length} अनुच्छेद
        </p>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="bg-white border-2 border-slate-200 rounded-[28px] p-12 text-center space-y-4">
          <span className="text-4xl animate-bounce inline-block">🔍</span>
          <h3 className="text-lg font-black text-slate-800">कोई अनुच्छेद नहीं मिला!</h3>
          <p className="text-xs text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">
            सर्च बॉक्स में कुछ और टाइप करें। आप अनुच्छेद संख्या (जैसे: 19, 21ए) या शीर्षक (जैसे: समानता, शिक्षा) के माध्यम से ढूंढ सकते हैं।
          </p>
        </div>
      ) : (
        <div id="articles-section" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((art, index) => {
            const customUrl = urls[art.id];
            return (
              <ArticleFlipCard
                key={art.id}
                art={art}
                index={index}
                customUrl={customUrl}
                clickCounts={clickCounts}
                handleArticleClick={handleArticleClick}
                playClickTick={playClickTick}
              />
            );
          })}
        </div>
      )}

      {/* 📊 FOOTER CLICK STATS GRAPH DISPLAY */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200 rounded-[32px] p-6 shadow-xs space-y-6 mt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1 text-left">
            <span className="text-[9.5px] bg-slate-200 text-slate-800 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider block w-fit">
              📊 आँकड़े तथा प्रदर्शन रिपोर्ट • View Analytics
            </span>
            <h3 className="text-lg font-black text-slate-800">
              वीडियो दर्शन संख्या विश्लेषिकी (YouTube View Counts Tracker)
            </h3>
            <p className="text-xs text-slate-500 font-bold leading-relaxed">
              प्यारे बच्चों! यहाँ पर आप देख सकते हैं कि किस संविधान अनुच्छेद से जुड़े वीडियो को कितनी बार खोला (क्लिक) किया गया है।
            </p>
          </div>
          {articles.some(art => (clickCounts[art.id] || 0) > 0) && (
            <button
              onClick={handleResetClicks}
              className="bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 font-black text-[10px] px-3.5 py-1.5 rounded-xl cursor-pointer transition active:scale-95 uppercase flex items-center gap-1 shrink-0"
            >
              🔄 रीसेट करें (Reset Stats)
            </button>
          )}
        </div>

        {/* STATS MATRIX */}
        {(() => {
          const clicksArray = articles.map(art => clickCounts[art.id] || 0);
          const totalClicks = clicksArray.reduce((acc, curr) => acc + curr, 0);
          const maxClicks = Math.max(...clicksArray, 1);

          if (totalClicks === 0) {
            return (
              <div className="py-8 text-center space-y-3">
                <div className="text-4xl animate-bounce">🎬</div>
                <h4 className="text-sm font-black text-slate-700">अभी तक कोई वीडियो नहीं देखा गया है!</h4>
                <p className="text-xs text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">
                  ऊपर दी गई मार्गदर्शिका में किसी भी अनुच्छेद के पास दिए गए 
                  <span className="text-red-500 font-extrabold"> "वीडियो देखें ➔" </span> 
                  लाल बटन को दबाकर वीडियो देखना शुरू करें! इसके बाद यहाँ वास्तविक लाइव ग्राफ़ प्रदर्शित होगा।
                </p>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              
              {/* GRAND TOTAL CIRCLE BADGE */}
              <div className="bg-white border-2 border-slate-150 p-5 rounded-[24px] flex flex-col justify-center items-center text-center space-y-3">
                <span className="text-3xl">🎉</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">कुल देखे गए वीडियो</span>
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-xs">
                  {totalClicks}
                </div>
                <span className="text-[10px] font-extrabold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
                  बार यूट्यूब कड़ियाँ खोली गयीं
                </span>
              </div>

              {/* BAR GRAPH OF EACH ARTICLE */}
              <div className="lg:col-span-2 bg-white border-2 border-slate-150 p-5 rounded-[24px] space-y-3 text-left">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 leading-none">
                  अनुच्छेद-वार दृश्य ग्राफ़ • (Clicks per Article)
                </span>
                
                <div className="space-y-2.5">
                  {articles.map((art) => {
                    const count = clickCounts[art.id] || 0;
                    const percent = (count / maxClicks) * 100;
                    
                    return (
                      <div key={art.id} className="flex items-center gap-3">
                        <div className="w-24 shrink-0 flex items-center gap-1.5">
                          <span className="text-sm select-none shrink-0" title={art.title}>{art.icon}</span>
                          <span className="text-[9.5px] font-black text-slate-700 truncate leading-none" title={art.title}>
                            {art.number}
                          </span>
                        </div>

                        <div className="flex-grow bg-slate-50 rounded-full h-5 border border-slate-200 relative overflow-hidden flex items-center">
                          {count > 0 ? (
                            <div
                              style={{ width: `${percent}%` }}
                              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full flex items-center justify-end px-2 transition-all duration-500"
                            >
                              <span className="text-[8.5px] font-black text-white leading-none whitespace-nowrap drop-shadow-xs">
                                {count} {count > 1 ? 'Clicks' : 'Click'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[8.5px] font-black text-slate-400 pl-2 leading-none">
                              0 क्लिक
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          );
        })()}
      </div>

    </div>
  );
}
