/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Book, Search, X, Volume2, HelpCircle, Star, Sparkles, AlertCircle, ArrowRight, ShieldCheck, Milestone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface DictionaryTerm {
  key: string;
  english: string;
  definition: string;
  kidsExample: string;
  emoji: string;
  category: "मूलभूत" | "कानून" | "सरकार" | "अधिकार";
}

export const DICTIONARY_TERMS: DictionaryTerm[] = [
  {
    key: "संविधान",
    english: "Constitution",
    definition: "देश को सुचारू रूप से चलाने वाले सभी बुनियादी नियमों और कानूनों का पावन संग्रह।",
    kidsExample: "जैसे स्कूल में अनुशासन और पढ़ाई के नियम बताने वाली डायरी या नियम-पुस्तिका होती है, वैसे ही संपूर्ण भारत को चलाने वाली महा-किताब 'संविधान' है।",
    emoji: "📖",
    category: "मूलभूत"
  },
  {
    key: "अधिनियम",
    english: "Act",
    definition: "संसद (विधायिका) द्वारा स्वीकृत किया गया वह आधिकारिक नियम जो पूरे देश पर कानून के रूप में लागू होता है।",
    kidsExample: "जब सरकार बच्चों की सुरक्षा या शिक्षा के लिए संसद में कोई नया नियम पूरी तरह पारित कर देती है, तो उसे 'अधिनियम' यानी कानून कहा जाता है।",
    emoji: "📜",
    category: "कानून"
  },
  {
    key: "न्यायपालिका",
    english: "Judiciary",
    definition: "देश के न्यायालयों (कोर्ट) का समूह जो संविधान की रक्षा करता है तथा निष्पक्षता से फैसला सुनाता है।",
    kidsExample: "यदि किन्हीं दो समूहों में खेलने की बात को लेकर या किसी अधिकार पर असमंजस हो, तो जो समझदार पंच या रेफरी की तरह सही फैसला सुनाते हैं, वही 'न्यायपालिका' है।",
    emoji: "⚖️",
    category: "सरकार"
  },
  {
    key: "कार्यपालिका",
    english: "Executive",
    definition: "संसद द्वारा बनाए गए कानूनों को जमीनी स्तर पर जनता के बीच पूर्णतः लागू करने वाला सरकारी तंत्र।",
    kidsExample: "प्रधानमंत्री, देश के राष्ट्रपति, राज्यों के मुख्यमंत्रियों तथा पुलिस अधिकारियों का वह दल जो कानून का पालन सुनिश्चित करवाता है।",
    emoji: "🏢",
    category: "सरकार"
  },
  {
    key: "विधायिका",
    english: "Legislature",
    definition: "देश के विकास और सुरक्षा के लिए नए-नए नियम व योजनाएं बनाने वाली जनप्रतिनिधियों की सभा।",
    kidsExample: "हमारे द्वारा चुने गए नेतागण जहाँ बैठकर देश के लिए अच्छे नियम सोचते और चर्चा करते हैं (जैसे लोकसभा व राज्यसभा), वही 'विधायिका' है।",
    emoji: "🏛️",
    category: "सरकार"
  },
  {
    key: "उद्देशिका",
    english: "Preamble",
    definition: "संविधान का सबसे पहला प्रस्तावना पन्ना जो इसके मूल उद्देश्यों, मूल्यों और सपनों को प्रदर्शित करता है।",
    kidsExample: "जैसे किसी कहानी की मुख्य किताब के सबसे पहले आमुख पृष्ठ पर पाठकों के लिए एक सुंदर परिचय-गाथा लिखी होती है, वैसे ही उद्देशिका संविधान की 'आत्मा' का संक्षिप्त परिचय है।",
    emoji: "📜",
    category: "मूलभूत"
  },
  {
    key: "प्रस्तावना",
    english: "Preamble",
    definition: "संविधान का सबसे पहला परिचय पत्र जो यह बताता है कि हमारा देश कैसा होना चाहिए और नागरिकों को क्या अधिकार मिलने चाहिए।",
    kidsExample: "जैसे किसी नए खेल को खेलने से पहले उसके मुख्य नियमों का संक्षेप में लिखा कार्ड, जो आपको खेल समझाता है।",
    emoji: "🎗️",
    category: "मूलभूत"
  },
  {
    key: "धर्मनिरपेक्ष",
    english: "Secular",
    definition: "ऐसा राज्य जहाँ सरकार किसी एक धर्म का पक्ष नहीं लेती, बल्कि सभी धार्मिक आस्थाओं का समान आदर करती है।",
    kidsExample: "इसका अर्थ है कि आपके स्कूल या कॉलोनी में हिंदू, मुस्लिम, सिख, ईसाई सभी बच्चे बिना किसी संकोच के एक साथ मिलकर सभी त्यौहार खुशी-खुशी मना सकते हैं।",
    emoji: "🤝",
    category: "मूलभूत"
  },
  {
    key: "संप्रभु",
    english: "Sovereign",
    definition: "एक पूर्णतः स्वतंत्र राष्ट्र, जो अपने समस्त आंतरिक एवं बाहरी फैसले लेने के लिए सर्वोच्च स्वतंत्र शक्ति रखता है।",
    kidsExample: "जैसे एक स्वतंत्र जागरूक बालक अपने खिलौनों की पसंद और खेल का फैसला खुद करता है, और कोई बाहरी बच्चा उस पर हुक्म नहीं चला सकता, वैसे ही भारत संप्रभु है।",
    emoji: "🦁",
    category: "मूलभूत"
  },
  {
    key: "गणतंत्र",
    english: "Republic",
    definition: "ऐसा लोकतांत्रिक देश जहाँ का मुखिया (जैसे माननीय राष्ट्रपति) वंशानुगत (राजा का बेटा) न होकर जनता की इच्छा से चुना जाता है।",
    kidsExample: "पुराने काल में राजा का बेटा ही अगला राजा घोषित होता था, लेकिन गणतंत्र में कोई भी योग्य नागरिक देश का सर्वोच्च मुखिया चुना जा सकता है।",
    emoji: "🗳️",
    category: "सरकार"
  },
  {
    key: "समाजवादी",
    english: "Socialist",
    definition: "ऐसी राष्ट्रीय व्यवस्था जहाँ देश की संपत्ति और अवसरों का सभी नागरिकों में समान और न्यायपूर्ण वितरण हो।",
    kidsExample: "जैसे शिक्षक द्वारा कक्षा के सभी बालकों के बीच खेलकूद के उपकरण और रंगीन चाक समान रूप से वितरित किए जाते हैं ताकि कोई अछूता न रहे।",
    emoji: "🌱",
    category: "मूलभूत"
  },
  {
    key: "मताधिकार",
    english: "Franchise",
    definition: "18 वर्ष या उससे ऊपर के प्रत्येक भारतीय नागरिक को अपनी पसंदीदा सरकार चुनने के लिए वोट देने का संवैधानिक अधिकार।",
    kidsExample: "जैसे कक्षा में नया मॉनिटर चुनने के लिए सभी विद्यार्थी निष्पक्षता से अपने मनपसंद छात्र के लिए हाथ उठाते हैं, वही बड़ों का 'वोट अधिकार' है।",
    emoji: "☝️",
    category: "अधिकार"
  },
  {
    key: "नागरिक",
    english: "Citizen",
    definition: "देश का वह हिस्सा या व्यक्ति जो कानूनन उस देश सदस्य है और जिसे देश के संरक्षण तथा सभी अधिकार प्राप्त हैं।",
    kidsExample: "हम सब जो भारत माता की गोद में रहकर पढ़ते, खेलते और बड़े हो रहे हैं, वे सब इस देश के संप्रभु 'नागरिक' हैं।",
    emoji: "🎒",
    category: "मूलभूत"
  },
  {
    key: "अनुच्छेद",
    english: "Article",
    definition: "संविधान की पुस्तक में लिखे नियमों के खंड या नंबरदार बिंदु, जो नियमों को व्यवस्थित रखते हैं।",
    kidsExample: "जैसे आपके सिलेबस की किताब में पाठ-1 या पॉइंट-2 लिखे होते हैं, ताकि आप ढूंढ सकें, ठीक उसी तरह संविधान की किताब में 'अनुच्छेद' (Articles) दिए गए हैं।",
    emoji: "📖",
    category: "कानून"
  },
  {
    key: "विधेयक",
    english: "Bill",
    definition: "कानून का वह प्रारंभिक रूप या कच्चा प्रस्ताव प्रस्ताव पत्र, जिस पर कानून बनने से पूर्व संसद में गहन बहस होती है।",
    kidsExample: "जैसे आप अपनी अध्यापिका के सामने प्रस्ताव रखते हैं कि 'क्या हम कल चित्रकला प्रतियोगिता कर सकते हैं?' मंजूर होने पर ही वह पक्का कार्यक्रम बनता है।",
    emoji: "📝",
    category: "कानून"
  },
  {
    key: "संसद",
    english: "Parliament",
    definition: "देश की महा-सभा जहाँ चुने हुए लोकसभा और राज्यसभा के सदस्य एकत्र होकर राष्ट्र के विकास के अहम फैसले करते हैं।",
    kidsExample: "नई दिल्ली में स्थित वह विशाल भवन जहाँ देश की तरक्की के नियम तय करने के लिए बड़ी बैठकें बुलाई जाती हैं।",
    emoji: "🏛️",
    category: "सरकार"
  },
  {
    key: "न्यायाधीश",
    english: "Judge",
    definition: "न्यायालय में पूर्ण ईमानदारी, सत्यता और सबूतों के आधार पर निरपक्ष रूप से न्याय प्रदान करने वाले मुख्य अधिकारी।",
    kidsExample: "खेल के मैदान में जो अंपायर निष्पक्ष होकर नियमों के उल्लंघन पर सीटी बजाते हैं, वही कोर्ट में फैसला सुनाने वाले न्यायाधीश (जज साहब) होते हैं।",
    emoji: "👨‍⚖️",
    category: "सरकार"
  },
  {
    key: "अधिकार",
    english: "Rights",
    definition: "संविधान द्वारा बालकों व नागरिकों को दी गई वे आवश्यक आजादी व सुरक्षा सुविधाएं, जो उनके उत्तम विकास के लिए अनिवार्य हैं।",
    kidsExample: "जैसे स्कूल में अच्छी पढ़ाई पाने, खेलने और स्वतंत्रता से हँसने का आपका बुनियादी हक़, यही 'अधिकार' है।",
    emoji: "🛡️",
    category: "अधिकार"
  },
  {
    key: "कर्तव्य",
    english: "Duties",
    definition: "राष्ट्र के प्रति हमारी नैतिक और संवैधानिक जिम्मेदारियां जिनका पालन करना हर देशभक्त का दायित्व है।",
    kidsExample: "जैसे वर्ग में गंदगी न फैलाना व पेड़-पौधों को पानी देना आपकी अच्छी आदत है, वैसे ही देश के प्रति अच्छे कार्य करना हमारा 'कर्तव्य' है।",
    emoji: "🌸",
    category: "अधिकार"
  },
  {
    key: "अंगीकृत",
    english: "Adopted",
    definition: "संविधान सभा द्वारा संविधान को सर्वसम्मति से पूर्ण रूप से खुद के लिए स्वीकार और अंगीकार करना।",
    kidsExample: "जब सभी सेनानियों तथा विद्वानों ने सामूहिक रूप से अपनी सहमति दी और हस्तलिखित संविधान की ओर इशारा कर कहा कि 'यही हमारे देश का सत्य कानून है'।",
    emoji: "🙏",
    category: "मूलभूत"
  },
  {
    key: "घोषणा",
    english: "Declaration",
    definition: "किसी महत्वपूर्ण निर्णय को सार्वजनिक तौर पर सबके सामने गर्व और ईमानदारी से बताना।",
    kidsExample: "जैसे कल स्कूल में छुट्टी होने की घोषणा प्रधानाचार्य महोदय द्वारा जोर से माइक पर की जाती है।",
    emoji: "📢",
    category: "कानून"
  },
  {
    key: "शपथ",
    english: "Oath",
    definition: "किसी पद या जिम्मेदारी को पूरी निष्ठा और सच्चाई से निभाने के लिए भगवान या संविधान के सामने ली जाने वाली गंभीर प्रतिज्ञा।",
    kidsExample: "जैसे स्कूल में बाल-संसद के चुने हुए मंत्रियों को शपथ दिलाई जाती है कि 'मैं जिम्मेदारी के साथ क्लास की भलाई के लिए कार्य करूँगा'।",
    emoji: "✋",
    category: "कानून"
  },
  {
    key: "सर्वोच्च न्यायालय",
    english: "Supreme Court",
    definition: "भारत का सबसे बड़ा और अंतिम न्यायालय, जो संविधान और नागरिक अधिकारों का सर्वोच्च रक्षक है।",
    kidsExample: "जैसे पूरे स्कूल में अंतिम फैसला लेने का अधिकार प्रिंसिपल ऑफिस को होता है, वैसे ही पूरे देश में अंतिम कानूनी फैसला सुप्रीम कोर्ट सुनाता है।",
    emoji: "🏛️",
    category: "सरकार"
  }
];

export default function LegalDictionary() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTerm, setSelectedTerm] = useState<DictionaryTerm | null>(null);
  const [speechActive, setSpeechActive] = useState(false);
  const [alertShowing, setAlertShowing] = useState(false);
  const [foundTermNotification, setFoundTermNotification] = useState<string | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Stop speech when closing or changing selected term
  const stopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeechActive(false);
  };

  useEffect(() => {
    stopSpeech();
  }, [selectedTerm]);

  useEffect(() => {
    return () => {
      stopSpeech();
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  // Global Mouse Up / Double Click / Tapping Text Listener
  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Ignore if user clicks inside the dictionary drawer panel or buttons to avoid hijacking user interactions
      if (
        target.closest(".legal-dictionary-panel") ||
        target.closest(".no-dictionary") ||
        target.closest("button") ||
        target.closest("input") ||
        target.closest("select") ||
        target.closest("textarea")
      ) {
        return;
      }

      let selectedText = "";
      const selection = window.getSelection();
      
      // Fallback: If text selection is active, use it
      if (selection && selection.toString().trim().length > 0) {
        selectedText = selection.toString().trim();
      } else {
        // Find the word exactly clicked under caret position cross-browser
        try {
          const range = document.caretRangeFromPoint
            ? document.caretRangeFromPoint(e.clientX, e.clientY)
            : (document as any).caretPositionFromPoint
            ? (document as any).caretPositionFromPoint(e.clientX, e.clientY)
            : null;

          if (range) {
            let textNode = null;
            let offset = 0;
            if ((range as any).startContainer) {
              textNode = (range as any).startContainer;
              offset = (range as any).startOffset;
            } else if ((range as any).offsetNode) {
              textNode = (range as any).offsetNode;
              offset = (range as any).offset;
            }

            if (textNode && textNode.nodeType === Node.TEXT_NODE) {
              const content = textNode.textContent || "";
              
              // Find the start index of the clicked word (supports Devanagari block + letters)
              let start = offset;
              while (start > 0 && /\w|[\u0900-\u097F]/.test(content[start - 1])) {
                start--;
              }
              // Find the end index
              let end = offset;
              while (end < content.length && /\w|[\u0900-\u097F]/.test(content[end])) {
                end++;
              }
              selectedText = content.substring(start, end).trim();
            }
          }
        } catch (err) {
          console.warn("Caret range calculation error: ", err);
        }
      }

      // Check if this selected word is present in our dictionary
      if (selectedText) {
        // Strip out punctuation symbols attached to word
        const cleanWord = selectedText
          .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'!।]/g, "")
          .trim()
          .toLowerCase();

        if (cleanWord.length > 2) {
          const matched = DICTIONARY_TERMS.find((term) => {
            const keyH = term.key.toLowerCase();
            const keyE = term.english.toLowerCase();

            // Word forms stemming e.g. "न्यायपालिका" matches "न्यायपालिकायें", "कार्यपालिका" matches "कार्यपालिकाओं"
            return (
              cleanWord === keyH ||
              cleanWord === keyE ||
              (cleanWord.length >= 4 && keyH.startsWith(cleanWord)) ||
              (keyH.length >= 4 && cleanWord.startsWith(keyH)) ||
              (cleanWord.length >= 4 && keyE.startsWith(cleanWord)) ||
              (keyE.length >= 4 && cleanWord.startsWith(keyE))
            );
          });

          if (matched) {
            // Found a constitutional term! Open dictionary and highlight it beautifully
            setSelectedTerm(matched);
            setIsOpen(true);
            setFoundTermNotification(matched.key);
            
            // Auto hide notification banner in 4.5 seconds
            if (notificationTimeoutRef.current) {
              clearTimeout(notificationTimeoutRef.current);
            }
            notificationTimeoutRef.current = setTimeout(() => {
              setFoundTermNotification(null);
            }, 4500);

            // Light chime of excitement
            try {
              const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
              if (AudioCtx) {
                const ctx = new AudioCtx();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.setValueAtTime(660, ctx.currentTime);
                gain.gain.setValueAtTime(0, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
                osc.start();
                osc.stop(ctx.currentTime + 0.3);
              }
            } catch {}
          }
        }
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Filter dictionary terms based on user search
  const filteredTerms = useMemo(() => {
    if (!searchQuery.trim()) return DICTIONARY_TERMS;
    const query = searchQuery.trim().toLowerCase();
    return DICTIONARY_TERMS.filter(
      (t) =>
        t.key.toLowerCase().includes(query) ||
        t.english.toLowerCase().includes(query) ||
        t.definition.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Read out definition in soft native language speech
  const handleHearSpeech = (term: DictionaryTerm) => {
    if (!window.speechSynthesis) {
      alert("मशीनी आवाज आपके ब्राउज़र में सपोर्ट नहीं करती है!");
      return;
    }

    if (speechActive) {
      stopSpeech();
      return;
    }

    setSpeechActive(true);
    const textToSpeak = `${term.key}, अंग्रेजी शब्द ${term.english}। इसका सरल अर्थ है: ${term.definition} बालकों के लिए इसका उदाहरण: ${term.kidsExample}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;
    
    // Choose Hindi Voice
    const voices = window.speechSynthesis.getVoices();
    const hiVoice = voices.find((v) => v.lang.startsWith("hi-IN") || v.lang.startsWith("hi"));
    if (hiVoice) {
      utterance.voice = hiVoice;
    }
    utterance.lang = "hi-IN";
    utterance.rate = 0.82; // Kid friendly pacing

    utterance.onend = () => {
      setSpeechActive(false);
    };
    utterance.onerror = () => {
      setSpeechActive(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      {/* 📙 PERSISTENT FLOATING TRICOLOR TRIGGER BUTTON */}
      <div className="fixed bottom-6 right-6 z-40 print:hidden no-dictionary">
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-orange-500 via-white to-emerald-600 border-[3.5px] border-amber-400 p-1.5 rounded-full shadow-[0_10px_25px_-5px_rgba(217,119,6,0.35)] flex items-center gap-2 cursor-pointer group"
          title="बाल कानूनी शब्दकोश • Interactive Constitution Glossary"
          id="legal-dictionary-trigger-btn"
        >
          <div className="bg-slate-900 border border-slate-800 text-amber-400 px-4 py-2.5 rounded-full flex items-center gap-2 text-xs font-black uppercase">
            <span className="text-lg group-hover:rotate-12 transition-transform">📙</span>
            <span className="text-[10px] md:text-xs">कानूनी शब्दकोश</span>
            <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-md animate-pulse">संशोधित</span>
          </div>
        </motion.button>
      </div>

      {/* MATCHED WORD FLOATING TOP NOTIFICATION HUD (Triggers on text interaction) */}
      <AnimatePresence>
        {foundTermNotification && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 16 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-950 text-white border-2 border-amber-400 px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 text-xs font-black pointer-events-none font-sans whitespace-nowrap"
          >
            <span className="text-xl">💡</span>
            <span>शब्दकोश खोज: <strong className="text-amber-300 font-black italic">"{foundTermNotification}"</strong> का अर्थ मिला!</span>
            <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase leading-none">दिखा रहा है</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🧾 EXPANDED SLIDING DRAWER / DICTIONARY PANEL OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Modal Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsOpen(false);
                stopSpeech();
              }}
              className="fixed inset-0 bg-slate-950 z-40 select-none print:hidden no-dictionary"
            />

            {/* Sliding Drawer Body Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-white border-l-4 border-amber-400 z-50 flex flex-col shadow-2xl overflow-hidden font-sans legal-dictionary-panel text-slate-800 print:hidden no-dictionary"
            >
              {/* Decorative top tricolor strip */}
              <div className="h-2 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600"></div>

              {/* Drawer Header Area */}
              <div className="bg-gradient-to-b from-amber-50 to-white px-5 py-4.5 border-b border-amber-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center font-black shadow-inner select-none text-md">
                    📙
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight leading-tight flex items-center gap-1.5">
                      संविधान शब्दकोश (Glossary)
                    </h3>
                    <p className="text-[10px] text-slate-500 font-extrabold font-mono uppercase tracking-widest leading-none mt-1">
                      constitutional dictionary
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    stopSpeech();
                  }}
                  className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full transition cursor-pointer"
                  title="बंद करें (Close)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Dynamic Interactive Tutorial Card */}
              <div className="bg-gradient-to-r from-indigo-950 to-slate-900 text-white p-4 text-[11px] leading-relaxed relative flex items-start gap-4">
                <div className="text-2xl animate-bounce shrink-0">👶</div>
                <div>
                  <h4 className="font-black text-amber-300 leading-tight">खेल-खेल में सीखें: जादुई टच तकनीक!</h4>
                  <p className="text-slate-300 mt-1">
                    मित्रों! ऐप की किसी भी कहानी या प्रश्नोत्तरी में लिखे किसी कठिन शब्द पर आप बस <strong>दो बार क्लिक (Double Click)</strong> करें, हमारा शब्दकोश स्वतः खुलकर उसका बाल-सुलभ सरल अर्थ समझा देगा!
                  </p>
                </div>
              </div>

              {/* Term Search and Query Input */}
              <div className="p-4 bg-slate-50 border-b border-slate-100 space-y-3 shrink-0">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="कठिन शब्द खोजें... (जैसे संविधान, अधिनियम)"
                    className="w-full bg-white hover:bg-slate-50/50 border-2 border-slate-200/80 rounded-2xl py-2 px-10 text-xs font-black tracking-wide outline-none focus:border-amber-400 transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold px-1"
                    >
                      मूर्ख रफ़
                    </button>
                  )}
                </div>

                {/* Filter chip tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
                  <button
                    onClick={() => setSearchQuery("")}
                    className={`text-[9.5px] font-black px-2.5 py-1 rounded-full border shrink-0 cursor-pointer ${
                      !searchQuery ? "bg-amber-400 text-slate-950 border-amber-400" : "bg-white text-slate-600 hover:bg-slate-100 border-slate-200"
                    }`}
                  >
                    सभी शब्द
                  </button>
                  {["मूलभूत", "कानून", "सरकार", "अधिकार"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSearchQuery(cat)}
                      className={`text-[9.5px] font-black px-2.5 py-1 rounded-full border shrink-0 cursor-pointer ${
                        searchQuery === cat ? "bg-amber-400 text-slate-950 border-amber-400" : "bg-white text-slate-600 hover:bg-slate-100 border-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drawer Scrollable dictionary body workspace */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5">
                
                {/* Selected Active Term Detailed View Card */}
                {selectedTerm ? (
                  <motion.div
                    key={selectedTerm.key}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="border-3 border-amber-400 bg-amber-50/45 rounded-[26px] p-5 space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-3xl shrink-0 bg-white p-1 rounded-2xl shadow-xs leading-none">
                        {selectedTerm.emoji}
                      </span>
                      <span className="bg-amber-200/80 text-amber-900 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border border-amber-300">
                        {selectedTerm.category} वर्ग
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-slate-900 tracking-tight leading-none italic">
                        {selectedTerm.key}
                      </h4>
                      <p className="text-xs text-indigo-700 font-extrabold uppercase tracking-widest font-mono">
                        {selectedTerm.english}
                      </p>
                    </div>

                    <div className="h-px bg-amber-200/60"></div>

                    {/* Detailed Simplified Meaning Box */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-amber-900 font-extrabold uppercase tracking-wider leading-none block">
                        • सरल शब्द अर्थ (Simplified Meaning) :
                      </span>
                      <p className="text-xs leading-relaxed text-slate-800 font-bold">
                        {selectedTerm.definition}
                      </p>
                    </div>

                    {/* Kid-friendly easy Analogy Box */}
                    <div className="bg-white border-2 border-dashed border-amber-300 rounded-2xl p-4 space-y-1.5 shadow-xs">
                      <span className="text-[9.5px] text-emerald-700 font-extrabold uppercase tracking-wide flex items-center gap-1.5 leading-none">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100" />
                        <span>बच्चों के लिए सरल उदाहरण (Analogy)</span>
                      </span>
                      <p className="text-[11.5px] leading-relaxed text-slate-600 font-medium italic">
                        "{selectedTerm.kidsExample}"
                      </p>
                    </div>

                    {/* Speech hearing interactive block */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleHearSpeech(selectedTerm)}
                        className={`w-full text-xs font-black py-2.5 px-4 rounded-xl shadow-xs transition-all active:scale-97 cursor-pointer flex items-center justify-center gap-1.5 ${
                          speechActive
                            ? "bg-rose-500 text-white hover:bg-rose-600"
                            : "bg-slate-900 text-amber-400 hover:bg-slate-800"
                        }`}
                      >
                        <Volume2 className={`w-4 h-4 ${speechActive ? "animate-bounce" : ""}`} />
                        <span>{speechActive ? "आवाज बंद करें (Stop)" : "🔊 आवाज में सुनें (Speak)"}</span>
                      </button>

                      <button
                        onClick={() => setSelectedTerm(null)}
                        className="bg-white border border-slate-350 hover:bg-slate-50 text-slate-700 text-xs font-black py-2.5 px-4 rounded-xl cursor-pointer"
                      >
                        सूची पर जाएँ
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* Notification tutorial showing when no active term is loaded */
                  <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-4 rounded-2xl text-center space-y-1">
                    <HelpCircle className="w-8 h-8 text-slate-400 mx-auto opacity-75" />
                    <h5 className="text-[11.5px] font-black text-slate-700 uppercase">
                      कोई कठिन शब्द सिलेक्टेड नहीं है
                    </h5>
                    <p className="text-[10px] text-slate-500 font-medium">
                      नीचे दी गई संपूर्ण संविधान शब्दावली में से किसी भी शब्द पर क्लिक करके उसका अर्थ पढ़ें या ऊपर खोजें।
                    </p>
                  </div>
                )}

                {/* Grid list of index items */}
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none pt-4">
                  📘 संपूर्ण शब्द सूची (Word Index - {filteredTerms.length} शब्द)
                </h4>

                <div className="grid grid-cols-1 gap-2.5">
                  {filteredTerms.map((term) => {
                    const active = selectedTerm?.key === term.key;
                    return (
                      <div
                        key={term.key}
                        onClick={() => setSelectedTerm(term)}
                        className={`rounded-2xl p-3 border-2 text-left cursor-pointer transition select-none flex items-center justify-between ${
                          active
                            ? "bg-amber-400/10 border-amber-400 shadow-xs"
                            : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl leading-none">{term.emoji}</span>
                          <div>
                            <h5 className="text-xs font-black text-slate-900 leading-tight">
                              {term.key}
                            </h5>
                            <p className="text-[10px] text-indigo-700 font-semibold font-mono uppercase">
                              {term.english}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="bg-slate-100 text-slate-500 text-[8.5px] font-bold px-2 py-0.5 rounded-full uppercase">
                            {term.category}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      </div>
                    );
                  })}

                  {filteredTerms.length === 0 && (
                    <div className="text-center py-8 text-slate-400 space-y-1.5">
                      <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-xs font-bold uppercase tracking-wider">कोई शब्द नहीं मिला!</p>
                      <p className="text-[10px] font-medium text-slate-400">अपनी खोज प्रक्रिया को बदलें तथा पुनः प्रयास करें।</p>
                    </div>
                  )}
                </div>

              </div>

              {/* Drawer Fixed Footer Branding */}
              <div className="bg-slate-50 border-t border-slate-100 p-4 text-center text-[10px] text-slate-400 font-medium">
                📚 भारत सरकार डिजिटल साक्षरता मंच • बाल शब्दकोश
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
