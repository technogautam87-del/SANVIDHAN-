/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  Languages, 
  Sparkles, 
  HelpCircle,
  Quote,
  Flame,
  UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PreambleSectionProps {
  setMascotData: (data: { mood: "happy" | "thinking" | "excited" | "proud" | "speaking" | "greeting"; text: string }) => void;
}

const PREAMBLES = {
  hindi: {
    lang: "हिन्दी (Hindi)",
    title: "उद्देशिका (प्रस्तावना)",
    voiceCode: "hi-IN",
    content: [
      "हम, भारत के लोग, भारत को एक सम्पूर्ण प्रभुत्व-सम्पन्न, समाजवादी, पंथनिरपेक्ष, लोकतंत्रात्मक गणराज्य बनाने के लिए, तथा उसके समस्त नागरिकों को:",
      "सामाजिक, आर्थिक और राजनीतिक न्याय,",
      "विचार, अभिव्यक्ति, विश्वास, धर्म और उपासना की स्वतंत्रता,",
      "प्रतिष्ठा और अवसर की समता, प्राप्त कराने के लिए,",
      "तथा उन सब में, व्यक्ति की गरिमा और राष्ट्र की एकता और अखण्डता सुनिश्चित करने वाली बंधुता बढ़ाने के लिए",
      "दृढ़संकल्प होकर अपनी इस संविधान सभा में आज तारीख 26 नवम्बर, 1949 ई० को एतद्द्वारा इस संविधान को अंगीकृत, अधिनियमित और आत्मसमर्पित करते हैं।"
    ],
    meaning: "यह हमारे पूरे संविधान की आत्मा है जो बताती है कि भारत की सर्वोच्च शक्ति यहाँ की जनता में निहित है और हमारा देश सभी नागरिकों को समानता, स्वतंत्रता और न्याय सुनिश्चित करता है।"
  },
  english: {
    lang: "English (अंग्रेज़ी)",
    title: "The Preamble",
    voiceCode: "en-IN",
    content: [
      "WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC and to secure to all its citizens:",
      "JUSTICE, social, economic and political;",
      "LIBERTY of thought, expression, belief, faith and worship;",
      "EQUALITY of status and of opportunity; and to promote among them all",
      "FRATERNITY assuring the dignity of the individual and the unity and integrity of the Nation;",
      "IN OUR CONSTITUENT ASSEMBLY this twenty-sixth day of November, 1949, do HEREBY ADOPT, ENACT AND GIVE TO OURSELVES THIS CONSTITUTION."
    ],
    meaning: "The Preamble is the guiding key to the Constitution, stating that India is supreme, socialist, secular, democratic, and a republic, guaranteeing fundamental liberties to everyone."
  },
  sanskrit: {
    lang: "संस्कृतम् (Sanskrit)",
    title: "उद्देशिका (प्रस्तावना)",
    voiceCode: "hi-IN", // Use Hindi voice for perfect phonetic Devanagari reading
    content: [
      "वयम् भारतस्य जनता, भारतम् एकं सम्पूर्ण-प्रभुत्व-सम्पन्न-समाजवादि-पन्थप्रतिपेक्ष-लोकतान्त्रिक-गणराज्यम् निर्मातुम्, तस्य च समस्तान् नागरिकान्:",
      "सामाजिकम् आर्थिकं राजनैतिकं च न्यायम्,",
      "विचार-अभिव्यक्ति-विश्वास-धर्म-उपासनानां स्वतन्त्रताम्,",
      "प्रतिष्ठायाः अवसरस्य च समताम् प्रापयितुम्,",
      "तेषु च सर्वेषु व्यक्तिगौरवम् राष्ट्रस्य एकताम् अखण्डताम् च सुदृढ़ां कर्तुं बन्धुतां वर्धयितुं कृतदृढसङ्कल्पाः भूत्वा,",
      "अस्याम् अस्माकं संविधानसभायाम् अद्य ख्रिस्ताब्दे एकोनपञ्चाशत्-उत्तर-नवदशशततमे (१९४९) वर्षे नवम्बर मासस्य षड्विंशति-तमे दिवसे एतद्द्वारा इमं संविधानम् अङ्गीकुर्मः, अधिनियमामहः आत्मार्पयामः च।"
    ],
    meaning: "संस्कृत भाषा में प्रस्तुत यह उद्देशिका आदिकालीन और साहित्यिक परिशुद्धता के साथ राष्ट्र की गरिमा, सार्वभौमिकता एवं बंधुत्व के शाश्वत संकल्प को अभिव्यक्त करती है।"
  },
  urdu: {
    lang: "اردو (Urdu)",
    title: "تمہید (آئین کی روح)",
    voiceCode: "ur-PK",
    content: [
      "ہم، بھارت کے لوگ، بھارت کو ایک مقتدر، سماجوادی، لادینی، جمہوریہ بنانے کے لیے اور اس کے تمام شہریوں کو:",
      "سماجی، اقتصادی اور سیاسی انصاف؛",
      "خیال، اظہار، عقیدہ، دین اور عبادت کی آزادی؛",
      "وقار اور موقع کی برابरी حاصل کرانے के लिए,", // Blended with Devnagari reference for proper engine flow
      "اور ان سب میں فرد کی عظمت اور قوم کے اتحاد اور سالمیت کا یقین دلانے والی اخوت بڑھانے کے لیے پختہ عزم ہو کر،",
      "اپنی آئین ساز اسمبلی میں آج 26 نومبر، 1949ء کو بذریعہ ہذا اس آئین کو منظور، وضع اور اپنے اوپر نافذ کرتے ہیں۔"
    ],
    meaning: "اردو زبان میں یہ تمہید ظاہر کرتی ہے کہ ملک میں سبھی شہریوں کو سماجی، معاشی اور سیاسی حقوق کے ساتھ آزادی حاصل ہے۔"
  }
};

type LangKey = "hindi" | "english" | "sanskrit" | "urdu";

export default function PreambleSection({ setMascotData }: PreambleSectionProps) {
  const [selectedLang, setSelectedLang] = useState<LangKey>("hindi");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState<number | null>(null);
  const [activeCharIndex, setActiveCharIndex] = useState<number | null>(null);
  const [speechSpeed, setSpeechSpeed] = useState(0.85); // Child-friendly slow speed
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const visualTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Pre-parse sentence lines into individual word segments with precise character index offsets
  const parsedLines = useMemo(() => {
    const content = PREAMBLES[selectedLang].content;
    const offsets: number[] = [];
    let currentOffset = 0;
    
    content.forEach((lineText) => {
      offsets.push(currentOffset);
      currentOffset += lineText.length + 1; // +1 for space joiner (" ")
    });

    return content.map((lineText, lineIdx) => {
      const lineGlobalStart = offsets[lineIdx];
      const tokens = lineText.split(/(\s+)/);
      let localOffset = 0;

      const segments = tokens.map((token, tokenIdx) => {
        const tokenLength = token.length;
        const segmentStart = lineGlobalStart + localOffset;
        const segmentEnd = segmentStart + tokenLength;
        const isSpace = /^\s+$/.test(token);
        
        localOffset += tokenLength;

        return {
          id: `${lineIdx}-${tokenIdx}`,
          text: token,
          globalStart: segmentStart,
          globalEnd: segmentEnd,
          isSpace
        };
      });

      return {
        lineIdx,
        text: lineText,
        segments
      };
    });
  }, [selectedLang]);

  // List of all word segments for the current language
  const allWordSegments = useMemo(() => {
    const list: Array<{ id: string; text: string; lineIdx: number; globalStart: number; globalEnd: number }> = [];
    parsedLines.forEach((lineObj) => {
      lineObj.segments.forEach((seg) => {
        if (!seg.isSpace && seg.text.trim().length > 0) {
          list.push({
            id: seg.id,
            text: seg.text,
            lineIdx: lineObj.lineIdx,
            globalStart: seg.globalStart,
            globalEnd: seg.globalEnd
          });
        }
      });
    });
    return list;
  }, [parsedLines]);

  // Stop reading when leaving or changing language
  useEffect(() => {
    stopSpeech();
    return () => {
      stopSpeech();
    };
  }, [selectedLang]);

  useEffect(() => {
    setMascotData({
      mood: "proud",
      text: "प्यारे बच्चो! संविधान की उद्देशिका (Preamble) हमारे देश की आत्मा है। यहाँ आप इसे हिन्दी, अंग्रेज़ी, संस्कृत और उर्दू चारों भाषाओं में सुन सकते हैं! नीचे प्ले बटन दबाकर जादुई साउंड के साथ सुनें।"
    });
  }, [selectedLang, setMascotData]);

  const stopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (visualTimerRef.current) {
      clearTimeout(visualTimerRef.current);
      visualTimerRef.current = null;
    }
    setIsPlaying(false);
    setCurrentLineIndex(null);
    setActiveCharIndex(null);
  };

  const startSpeech = () => {
    stopSpeech();
    setIsPlaying(true);

    const preamble = PREAMBLES[selectedLang];
    const fullText = preamble.content.join(" ");

    // Setup speech synthesis with support for multiple languages
    if (window.speechSynthesis) {
      try {
        const utterance = new SpeechSynthesisUtterance(fullText);
        utteranceRef.current = utterance;
        
        // Choose voice based on language code
        utterance.lang = preamble.voiceCode;
        utterance.rate = speechSpeed;

        // Direct language voice bindings
        const voices = window.speechSynthesis.getVoices();
        let selectedVoice = null;

        if (selectedLang === "english") {
          selectedVoice = voices.find(v => v.lang.startsWith("en-IN") || v.lang.startsWith("en-GB") || v.lang.startsWith("en-US"));
        } else if (selectedLang === "urdu") {
          selectedVoice = voices.find(v => v.lang.startsWith("ur") || v.lang.startsWith("hi-IN"));
        } else { // hindi and sanskrit
          selectedVoice = voices.find(v => v.lang.startsWith("hi-IN"));
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        utterance.onend = () => {
          // Handled by our timer
        };
        utterance.onerror = () => {
          // Handled by our timer
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn("SpeechSynthesis error:", err);
      }
    }

    setMascotData({
      mood: "speaking",
      text: `मैं अभी संविधान की उद्देशिका को ${preamble.lang} में पढ़ रहा हूँ। ध्यानपूर्वक प्रत्येक शब्द की शक्ति को समझें!`
    });

    // Elegant and 100% reliable progressive visual word highlight loop
    let wordIdx = 0;
    const highlightNextWord = () => {
      if (wordIdx >= allWordSegments.length) {
        stopSpeech();
        setMascotData({
          mood: "happy",
          text: `शानदार! आपने उद्देशिका सुन ली। चलो इस पावन संदेश को अपने जीवन में अपनाएं। 🌟`
        });
        return;
      }

      const currentWord = allWordSegments[wordIdx];
      setCurrentLineIndex(currentWord.lineIdx);
      setActiveCharIndex(currentWord.globalStart);

      const isSanskritOrHindi = selectedLang === "hindi" || selectedLang === "sanskrit";
      const charFactor = isSanskritOrHindi ? 165 : 115;
      const calculatedMs = currentWord.text.length * charFactor;
      const rateFactor = 1 / speechSpeed;
      const ms = Math.max(340, Math.min(1300, calculatedMs * rateFactor));

      wordIdx++;
      visualTimerRef.current = setTimeout(highlightNextWord, ms);
    };

    highlightNextWord();
  };

  const handleReadSingleLine = (lineText: string, idx: number) => {
    stopSpeech();
    setIsPlaying(true);
    setCurrentLineIndex(idx);

    const preamble = PREAMBLES[selectedLang];

    if (window.speechSynthesis) {
      try {
        const utterance = new SpeechSynthesisUtterance(lineText);
        utteranceRef.current = utterance;
        utterance.lang = preamble.voiceCode;
        utterance.rate = speechSpeed;

        const voices = window.speechSynthesis.getVoices();
        let selectedVoice = voices.find(v => v.lang.startsWith(preamble.voiceCode));
        if (selectedVoice) utterance.voice = selectedVoice;

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn("SpeechSynthesis error:", err);
      }
    }

    const lineObj = parsedLines[idx];
    const lineWords = lineObj.segments.filter(s => !s.isSpace && s.text.trim().length > 0);
    let wordIdx = 0;

    const highlightNextLineWord = () => {
      if (wordIdx >= lineWords.length) {
        stopSpeech();
        return;
      }

      const currentWord = lineWords[wordIdx];
      setActiveCharIndex(currentWord.globalStart);

      const isSanskritOrHindi = selectedLang === "hindi" || selectedLang === "sanskrit";
      const charFactor = isSanskritOrHindi ? 165 : 115;
      const calculatedMs = currentWord.text.length * charFactor;
      const rateFactor = 1 / speechSpeed;
      const ms = Math.max(340, Math.min(1300, calculatedMs * rateFactor));

      wordIdx++;
      visualTimerRef.current = setTimeout(highlightNextLineWord, ms);
    };

    highlightNextLineWord();
  };

  return (
    <div id="preamble-section" className="space-y-8">
      {/* Dynamic Module Header Card */}
      <div className="bg-gradient-to-r from-orange-500 via-stone-50 to-emerald-600 p-1.5 rounded-[36px] shadow-lg">
        <div className="bg-white rounded-[32px] p-6 text-center space-y-3 relative overflow-hidden">
          {/* Subtle Ashok Chakra decoration */}
          <div className="absolute right-4 top-4 text-blue-100 font-bold opacity-30 text-8xl pointer-events-none select-none">
            ☸️
          </div>

          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-blue-200">
            <BookOpen className="w-8 h-8" />
          </div>

          <p className="text-[10px] text-orange-600 font-black tracking-widest uppercase">
            भारतीय संविधान की आधारशिला
          </p>
          <h2 className="text-2xl md:text-3.5xl font-black text-slate-850 tracking-tight">
            📜 संविधान की पावन उद्देशिका (The Preamble)
          </h2>
          <p className="text-xs text-slate-500 font-bold max-w-2xl mx-auto leading-relaxed">
            उद्देशिका हमारे लोकतंत्र की कुंजी है। यह हमें बताती है कि यह पावन देश किस नीति पर चलेगा। इसे हिन्दी, अंग्रेजी, संस्कृत और उर्दू में सुनना व समझना बेहद सरल है!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Language Selection & Audio Controls (Left Panel) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-5 bg-stone-50 border-2 border-slate-200/60 p-5 rounded-[28px] shadow-sm">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
              <Languages className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xs font-black text-slate-700 tracking-wider uppercase">
                भाषा का चयन करें
              </h3>
            </div>

            {/* Language Switcher Buttons */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              {(Object.keys(PREAMBLES) as LangKey[]).map((key) => {
                const isSelected = selectedLang === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedLang(key);
                    }}
                    className={`px-4 py-3.5 rounded-2xl border-2 transition-all font-bold text-xs text-left flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-indigo-600 border-indigo-700 text-white shadow-md transform translate-x-1"
                        : "bg-white hover:bg-slate-100 border-slate-200 text-slate-700"
                    }`}
                  >
                    <span>{PREAMBLES[key].lang}</span>
                    <span className="text-lg">{key === "hindi" ? "🇮🇳" : key === "english" ? "🇬🇧" : key === "sanskrit" ? "🪕" : "🪁"}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dedicated Media Controller Panel */}
          <div className="bg-white border-2 border-indigo-100 rounded-2xl p-4.5 space-y-3 shadow-xs">
            <p className="text-[10px] text-slate-500 font-extrabold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>ऑडियो गाइड प्लेयर</span>
            </p>

            <div className="flex flex-col gap-2">
              {isPlaying ? (
                <button
                  id="stop-preamble-btn"
                  onClick={stopSpeech}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black text-xs py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border-b-4 border-rose-700 cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>Stop Preamble Audio / बंद करें</span>
                </button>
              ) : (
                <button
                  id="play-preamble-btn"
                  onClick={startSpeech}
                  className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600 hover:opacity-95 text-white font-black text-xs py-4 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border-b-4 border-emerald-700 cursor-pointer animate-bounce font-sans text-center"
                >
                  <Play className="w-4 h-4 fill-white animate-pulse" />
                  <span className="tracking-wide">Play Preamble / उद्देशिका वाचन</span>
                </button>
              )}
            </div>

            {/* CCS Dynamic Soundwave Visualizer */}
            <div className="pt-2 flex items-center justify-center gap-1.5 h-8">
              {isPlaying ? (
                Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: [6, 24, 6]
                    }}
                    transition={{
                      duration: 0.5 + Math.random() * 0.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.05
                    }}
                    className="w-1 rounded-full bg-indigo-500"
                  />
                ))
              ) : (
                <div className="text-[10px] text-slate-400 font-bold tracking-wide italic select-none">
                  आवाज सुनने के लिए ऊपर क्लिक करें...
                </div>
              )}
            </div>

            {/* Read Speed Selector */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <div className="flex justify-between text-[10px] text-slate-500 font-extrabold uppercase">
                <span>गति (Speech Rate): {speechSpeed}x</span>
                <span>{speechSpeed < 0.8 ? "धीमी" : speechSpeed > 1.1 ? "तेज़" : "सामान्य"}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={speechSpeed}
                onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Display Sheet (Right Panel) */}
        <div className="lg:col-span-8 bg-amber-50/25 border-3 border-amber-100 rounded-[32px] p-6 md:p-8 space-y-6 relative flex flex-col justify-between">
          <div className="absolute right-6 top-6 text-amber-100 select-none">
            <Quote className="w-14 h-14" />
          </div>

          <div className="space-y-4">
            <div className="inline-flex gap-1.5 items-center px-4 py-1.5 bg-amber-500/10 text-amber-800 text-xs font-black rounded-full border border-amber-200">
              <Flame className="w-4 h-4 text-amber-600" />
              <span>{PREAMBLES[selectedLang].title} ({selectedLang.toUpperCase()})</span>
            </div>

            {/* The Text Block with line-by-line interactive elements */}
            <div 
              className={`space-y-4 ${
                selectedLang === "urdu" ? "text-right font-serif text-xl md:text-2xl leading-loose" : "text-left text-sm md:text-base leading-relaxed"
              } font-medium text-slate-800`}
              dir={selectedLang === "urdu" ? "rtl" : "ltr"}
            >
              {parsedLines.map((lineObj, idx) => {
                const isCurrent = currentLineIndex === idx;
                return (
                  <motion.p
                    key={idx}
                    onClick={() => handleReadSingleLine(lineObj.text, idx)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all border-2 ${
                      isCurrent
                        ? "bg-amber-100/80 border-amber-400 text-amber-950 font-black shadow-inner"
                        : "bg-white hover:bg-amber-50/50 border-white hover:border-amber-200/50 text-slate-800 hover:shadow-xs"
                    }`}
                    whileHover={{ scale: 1.005 }}
                  >
                    {lineObj.segments.map((segment) => {
                      if (segment.isSpace) {
                        return <span key={segment.id}>{segment.text}</span>;
                      }

                      const isWordActive =
                        activeCharIndex !== null &&
                        activeCharIndex >= segment.globalStart &&
                        activeCharIndex < segment.globalEnd;

                      return (
                        <motion.span
                          key={segment.id}
                          className={`inline-block transition-all duration-150 rounded px-1 ${
                            isWordActive
                              ? "bg-amber-300 text-amber-950 font-black shadow-xs scale-105 ring-2 ring-amber-400/80"
                              : "text-slate-800"
                          }`}
                        >
                          {segment.text}
                        </motion.span>
                      );
                    })}
                  </motion.p>
                );
              })}
            </div>
          </div>

          {/* Simple Explanation Banner */}
          <div className="border-t-2 border-dashed border-amber-200 pt-5 mt-4 flex gap-3 items-start bg-amber-100/45 p-4 rounded-2xl">
            <UserCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-xs text-amber-900 font-black block">
                सरल शब्दों में इसका अर्थ (Easy Meaning):
              </strong>
              <p className="text-xs text-slate-600 font-bold leading-normal mt-1">
                {PREAMBLES[selectedLang].meaning}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Embedded Mini Interactive Quiz to verify understanding (Gamified) */}
      <div className="bg-indigo-900 text-white rounded-[32px] p-6 shadow-md border-2 border-indigo-950 space-y-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-indigo-500/20 text-indigo-300 rounded-xl">
            <HelpCircle className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-black text-indigo-200 italic">
              🧠 उद्देशिका माइंड-ट्रेनर (Preamble Challenger)
            </h3>
            <p className="text-[11px] text-indigo-300 font-bold">
              देखें क्या आपने उद्देशिका के मूल शब्दों को ध्यान से सुना! सही शब्द पर क्लिक करें:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Question card */}
          <div className="bg-indigo-950 p-4 rounded-2xl border border-indigo-850 flex flex-col justify-center">
            <span className="text-[10px] text-indigo-400 font-black tracking-widest uppercase">प्रश्न (Question)</span>
            <p className="text-xs md:text-sm font-black text-white mt-1">
              "हम, भारत के लोग..." भारत को एक क्या बनाने के लिए प्रतिज्ञाबद्ध हैं?
            </p>
          </div>

          {/* Answer blocks */}
          <div className="flex flex-col gap-2 justify-center">
            <button
              onClick={() => {
                setMascotData({
                  mood: "excited",
                  text: "बिल्कुल सही जवाब बच्चों! हमारा देश एक 'संपूर्ण प्रभुत्व-सम्पन्न, समाजवादी, पंथनिरपेक्ष, लोकतंत्रात्मक गणराज्य' है। 🧡🤍💚"
                });
              }}
              className="bg-indigo-800 hover:bg-indigo-750 border border-indigo-700 hover:border-indigo-600 p-3 rounded-xl text-left text-xs font-black transition-all flex items-center justify-between group cursor-pointer"
            >
              <span>A) सम्पूर्ण प्रभुत्व-सम्पन्न, समाजवादी, पंथनिरपेक्ष, लोकतंत्रात्मक गणराज्य</span>
              <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">✓</span>
            </button>

            <button
              onClick={() => {
                setMascotData({
                  mood: "thinking",
                  text: "ओह! यह उत्तर सही नहीं है। उद्देशिका को फिर से ध्यान से सुनें और याद करें कि हमारे देश को पांच मुख्य विशेषताओं से संवारा गया है।"
                });
              }}
              className="bg-indigo-800 hover:bg-indigo-750 border border-indigo-700 hover:border-indigo-600 p-3 rounded-xl text-left text-xs font-black transition-all flex items-center justify-between group cursor-pointer"
            >
              <span>B) एक सामान्य राजशाही रियासत व उपनिवेश</span>
              <span className="text-red-400 group-hover:translate-x-1 transition-transform">✗</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
