/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Users, FileText, BookOpen, Sparkles, ChevronLeft, ChevronRight, HelpCircle, Play, Pause, Volume2, VolumeX, Shield, UserCheck, Feather, Landmark, Award, Map, MapPin, Compass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HistorySectionProps {
  setMascotData: (data: { mood: "happy" | "thinking" | "excited" | "proud" | "speaking" | "greeting"; text: string }) => void;
}

interface HistoricalMilestone {
  id: number;
  year: string;
  title: string;
  description: string;
  detail: string;
  speechText: string; // Narration text
  iconName: string;
  illustrationType: "assembly" | "writing" | "document" | "flag" | "calligrapher";
}

const HISTORICAL_MILESTONES: HistoricalMilestone[] = [
  {
    id: 1,
    year: "1946",
    title: "कदम 01: पहला ऐतिहासिक कदम - संविधान सभा",
    description: "आजाद भारत का अपना कानून बनाने के लिए देश के ज्ञानी नेता एक साथ आए।",
    detail: "9 दिसंबर 1946 को नई दिल्ली के पुस्तकालय भवन में देश भर से 299 प्रकांड विद्वान और देशभक्त पहली बार मिलकर बैठे। पूरे देश की सुख-शांति व भाईचारे के लिए उन्होंने दुनिया का सबसे विस्तृत संविधान बनाने का बीड़ा उठाया। इस सभा के पहले अस्थायी अध्यक्ष सच्चिदानंद सिन्हा और स्थायी अध्यक्ष डॉ. राजेंद्र प्रसाद जी थे!",
    speechText: "9 दिसंबर 1946 को नई दिल्ली में देश के 299 महान ज्ञानी नेता पहली बार एकत्रित हुए ताकि स्वतंत्र भारत के उज्ज्वल भविष्य के लिए सर्वसम्मति से सुंदर संविधान की नींव रखी जा सके।",
    iconName: "Users",
    illustrationType: "assembly"
  },
  {
    id: 2,
    year: "1947",
    title: "कदम 02: महान प्रारूप समिति का गठन",
    description: "डॉ. भीमराव अंबेडकर जी के अद्भुत नेतृत्व में प्रारूप लेखन की शुरुआत हुई।",
    detail: "भारत की आजादी के कुछ दिनों बाद ही 29 अगस्त 1947 को एक 'प्रारूप समिति' (Drafting Committee) बनाई गई। इस अति महत्वपूर्ण समिति के अध्यक्ष बाबा साहब डॉ. भीमराव अंबेडकर जी थे। उन्होंने रात-दिन जागकर दुनिया के 60 से अधिक देशों के श्रेष्ठ नियमों का अध्ययन किया और हमारे अनेकता में एकता वाले भारत के लिए एक बेजोड़ मसौदा तैयार किया।",
    speechText: "29 अगस्त 1947 को डॉ. भीमराव अंबेडकर की अध्यक्षता में प्रारूप समिति बनाई गई। उन्होंने दुनिया के साठ से ज्यादा देशों के नियमों का गहन अध्ययन किया और देश के हितों के संरक्षण के लिए अद्वितीय मसौदा लिखा।",
    iconName: "FileText",
    illustrationType: "writing"
  },
  {
    id: 3,
    year: "1949",
    title: "कदम 03: संविधान बनकर तैयार",
    description: "पूरे 2 साल, 11 महीने और 18 दिन की अटूट तपस्या के बाद पुस्तक को स्वीकृति मिली।",
    detail: "लंबी गंभीर चर्चाओं, सुधारों और लगभग 2,400 संशोधानों के बाद, आखिरकार 26 नवंबर 1949 को भारत का संविधान संविधान सभा द्वारा सहर्ष अंगीकार (स्वीकृत) कर लिया गया। इस पावन अवसर पर संविधान सभा के सभी 284 सदस्यों ने इसपर अपने हस्ताक्षर किए, जिनमें 15 तेजस्वी और साहसी महिलाएं भी शामिल थीं। हर साल 26 नवंबर को हम 'संविधान दिवस' (Constitution Day) मनाते हैं!",
    speechText: "पूरे दो साल, ग्यारह महीने और अठारह दिन की अटूट तपस्या के बाद, छब्बीस नवंबर उन्नीस सौ उनचास को हमारा संविधान स्वीकृत हो गया। इसीलिए इस गौरवशाली दिन को हम प्रति वर्ष संविधान दिवस मनाते हैं।",
    iconName: "BookOpen",
    illustrationType: "document"
  },
  {
    id: 4,
    year: "1950",
    title: "कदम 04: सम्पूर्ण गणतंत्र घोषित - संविधान लागू",
    description: "26 जनवरी के पावन प्रभात को हमारा संविधान पूरे देश में शान से लागू हुआ।",
    detail: "26 जनवरी 1950 को पूरे हिन्दुस्तान में हमारा अपना प्यारा कानून पूरी तरह से प्रभावी हो गया। ब्रिटिश हुकूमत का अंतिम साया भी खत्म हो गया और भारत एक 'सम्पूर्ण संप्रभु संपन्न लोकतंत्र' बना। जनता को वोट डालने, और अपना प्रतिनिधि चुनने की ताकत मिली। इस ऐतिहासिक दिन की याद में देश के प्रथम नागरिक (राष्ट्रपति) तिरंगा लहराते हैं और हम उल्लास से 'गणतंत्र दिवस' (Republic Day) मनाते हैं!",
    speechText: "छब्बीस जनवरी उन्नीस सौ पचास को स्वतंत्र भारत का संविधान पूरे देश में शान से लागू हुआ और भारत एक संप्रभु गणतंत्र बना। इस महान उत्सव को हम गणतंत्र दिवस के रूप में आकर्षक झांकियों के साथ मनाते हैं।",
    iconName: "Sparkles",
    illustrationType: "flag"
  },
  {
    id: 5,
    year: "बोनस",
    title: "मजेदार कहानी: प्रेम बिहारी जी और सुंदर सुलेखन",
    description: "क्या आपको पता है? हमारा संविधान छापा नहीं गया था, उसे हाथ से लिखा गया था!",
    detail: "भारतीय संविधान का मूल रूप हिंदी व अंग्रेजी में अत्यंत सुंदर अक्षरों में श्री प्रेम बिहारी नारायण रायजादा जी द्वारा हाथ से लिखा गया था। उन्होंने इटैलिक सुलेखन शैली (calligraphy) में बिना किसी फीस के इसे लिखा। उनकी केवल एक शर्त थी कि संविधान के प्रत्येक पृष्ठ पर उनका नाम हो और अंतिम पृष्ठ पर उनके बाबा रामप्रसाद का नाम भी हो। उन्होंने इसे पूरा करने में 303 विशेष पेन-निब का इस्तेमाल किया था।",
    speechText: "क्या आपको मालूम है, हमारे संविधान को हाथ से इटैलिक कैलोग्राफी में प्रेम बिहारी नारायण रायजादा ने लिखा था। उन्होंने फीस के बदले अधिकार पत्र के अंत में अपने दादा जी और स्वयं का नाम लिखने की अनमोल शर्त रखी थी।",
    iconName: "Feather",
    illustrationType: "calligrapher"
  }
];

interface HistoricFigure {
  name: string;
  role: string;
  quote: string;
  superpower: string;
  avatar: string;
  desc: string;
}

const HISTORIC_FIGURES: HistoricFigure[] = [
  {
    name: "बाबा साहब डॉ. बी.आर. अंबेडकर",
    role: "प्रारूप समिति के अध्यक्ष (जनक)",
    quote: "संविधान केवल वकीलों का दस्तावेज नहीं है, बल्कि यह जीवन जीने का एक माध्यम है जो सभी को सुरक्षा देता है।",
    superpower: "असीम ज्ञान और सामाजिक न्याय की दृढ़ भावना 🛡️",
    avatar: "👨‍🏫",
    desc: "बाबा साहब ने जीवन भर कमजोरों और बालिकाओं की शिक्षा व समान अधिकारों के लिए लड़ाई लड़ी। उन्हें भारतीय संविधान के मुख्य वास्तुकार के रूप में वैश्विक ख्याति प्राप्त है।"
  },
  {
    name: "पंडित जवाहरलाल नेहरू",
    role: "उद्देश्य प्रस्ताव पेश कर्ता व प्रथम प्रधानमंत्री",
    quote: "नागरिक अधिकारों की सुरक्षा और देश में धर्मनिरपेक्षता ही हमारे लोकतंत्र की सच्ची ताकत होगी।",
    superpower: "वैश्विक दूरदृष्टि और बाल शिक्षा प्रेमी ✏️",
    avatar: "🌹",
    desc: "चाचा नेहरू ने ही संविधान सभा में प्रस्तावना का मुख्य 'उद्देश्य-प्रस्ताव' पेश किया था। उन्होंने देश को आधुनिक विज्ञान और शिक्षा की राह पर अग्रसर किया।"
  },
  {
    name: "डॉ. राजेंद्र प्रसाद",
    role: "संविधान सभा के स्थायी अध्यक्ष",
    quote: "हमारा संविधान तभी उत्कृष्ट साबित होगा, जब इसे चलाने वाले लोग निष्ठावान और चरित्रवान देशभक्त होंगे।",
    superpower: "महान संयम, अनुशासन एवं सरलता ⭐️",
    avatar: "🎓",
    desc: "ये स्वतंत्र भारत के प्रथम राष्ट्रपति थे। इन्होंने लगभग 3 वर्षों तक संविधान सभा की बहसों और सत्रों का शांत, अनुशासित व न्यायपूर्ण ढंग से संचालन किया।"
  },
  {
    name: "सरदार वल्लभभाई पटेल",
    role: "गृहमंत्री व एकता के शिल्पकार",
    quote: "यदि हमारे नागरिकों में आपसी एकता और राष्ट्रभक्ति नहीं होगी, तो कोई भी उत्तम नियम पुस्तक देश को नहीं बचा पाएगी।",
    superpower: "अदम्य लौह इच्छाशक्ति और राष्ट्रीय एकता 🇮🇳",
    avatar: "🦁",
    desc: "इन्होंने स्वतंत्रता के पश्चात 560 से अधिक छोटी-बड़ी रियासतों का भारत संघ में विलीनीकरण कराया ताकि हमारा अखंड राष्ट्र बन सके।"
  }
];

interface SpotPuzzle {
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

const SPOT_PUZZLES: SpotPuzzle[] = [
  {
    question: "संविधान सभा की चर्चाओं में भाग लेने वाले 299 सदस्यों में कुल कितनी साहसी और देशभक्त महिलाएं शामिल थीं?",
    options: ["5 महिलाएं", "15 महिलाएं", "25 महिलाएं"],
    correctIdx: 1,
    explanation: "बिल्कुल सही! स्वतंत्र भारत का कानून तय करने वाले 284 हस्ताक्षर कर्ताओं में 15 महिला सेनानी व विदुषियां भी शामिल थीं, जिन्होंने समान शिक्षा अधिकारों पर जोर दिया।"
  },
  {
    question: "सुलेखक प्रेम बिहारी नारायण जी ने हमारे संविधान को सुंदर लेखन में संपूर्ण करने के लिए कुल कितने विशेष निब का इस्तेमाल किया था?",
    options: ["103 निब", "303 निब", "503 निब"],
    correctIdx: 1,
    explanation: "शानदार! उन्होंने सुंदर इटैलिक लेखन के लिए पूरे 303 नंबर वाले विशेष होल्डर पेन-निब का इस्तेमाल कर इस पवित्र दस्तावेज को सुंदर रूप दिया।"
  },
  {
    question: "हमारा संविधान बनने में कुल कितना समय लगा था?",
    options: ["1 वर्ष 5 महीने", "2 वर्ष 11 महीने 18 दिन", "4 वर्ष 2 महीने"],
    correctIdx: 1,
    explanation: "अति उत्तम! हमारे विद्वानों ने संविधान पूरा करने में निरंतर 2 साल, 11 महीने और 18 दिन का कठोर परिश्रम किया।"
  }
];

export interface StateContribution {
  id: string;
  name: string;
  members: string[];
  historicalFact: string;
  quoteOrInspiration: string;
  colorTheme: string;
  mapCoordinates: { x: number; y: number; label: string };
}

export const REGIONAL_CONTRIBUTIONS: StateContribution[] = [
  {
    id: "UP",
    name: "उत्तर प्रदेश (United Provinces)",
    members: ["पंडित जवाहरलाल नेहरू", "गोविंद बल्लभ पंत", "पुरुषोत्तम दास टंडन", "बेगम ऐज़ाज़ रसूल (एकमात्र मुस्लिम महिला सदस्य 👩‍💼)", "सुचेता कृपलानी"],
    historicalFact: "संविधान सभा में सबसे अधिक 55 सदस्य संयुक्त प्रांत (अब उत्तर प्रदेश) से थे! इन्होंने देश की संघ संरचना (Federal structure) और राजभाषा हिन्दी के निर्धारण में बहुत महत्वपूर्ण भूमिका निभाई। महिलाओं के अधिकारों और अल्पसंख्यकों के संरक्षण पर यहाँ के सदस्यों ने प्रखर आवाज़ उठाई थी।",
    quoteOrInspiration: "बेगम ऐज़ाज़ रसूल ने पृथक निर्वाचिका के खिलाफ तर्क दिया, जिससे देश में धार्मिक सौहार्द और एकजुटता का मार्ग प्रशस्त हुआ!",
    colorTheme: "amber",
    mapCoordinates: { x: 42, y: 38, label: "उत्तर प्रदेश" }
  },
  {
    id: "BIHAR",
    name: "बिहार (Bihar Province)",
    members: ["डॉ. राजेंद्र प्रसाद (सभा अध्यक्ष 🎓)", "डॉ. सच्चिदानंद सिन्हा (प्रथम अस्थायी अध्यक्ष)", "जगजीवन राम (महान दलित नेता व श्रम मंत्री)", "रामेश्वर प्रसाद सिंह"],
    historicalFact: "संविधान निर्माण की शुरुआत का श्रेय बिहार को जाता है! सभा के सबसे वरिष्ठ सदस्य डॉ. सच्चिदानंद सिन्हा को 9 दिसंबर 1946 को पहला अस्थायी अध्यक्ष चुना गया था। तत्पक्षात, बिहार के ही गौरव डॉ. राजेंद्र प्रसाद जी को सर्वसम्मति से स्थायी अध्यक्ष नियुक्त किया गया, जिन्होंने पूरे 3 साल तक बहसों का कुशल नेतृत्व किया।",
    quoteOrInspiration: "डॉ. राजेंद्र प्रसाद ने कहा था कि संविधान की सफलता इसे लागू करने वाले लोगों की सच्चाई और चरित्र पर और अधिक निर्भर करेगी!",
    colorTheme: "rose",
    mapCoordinates: { x: 62, y: 44, label: "बिहार" }
  },
  {
    id: "MAHARASHTRA",
    name: "महाराष्ट्र (Bombay Province)",
    members: ["डॉ. भीमराव अंबेडकर (जनक 🛡️)", "कन्हैयालाल माणिकलाल मुंशी (K.M. Munshi)", "हंसा मेहता (महिला अधिकार संरक्षक 👩)", "एम.आर. जयकर"],
    historicalFact: "बंबई प्रांत (अब महाराष्ट्र व गुजरात) ने भारत रत्न बाबा साहब डॉ. भीमराव अंबेडकर जी को प्रारूप समिति का अध्यक्ष चुनकर देश को राह दी। बंबई से सदस्य हंसा मेहता ने संयुक्त राष्ट्र मानवाधिकार घोषणापत्र में 'All men are born free' के स्थान पर 'All human beings' लिखवाकर वैश्विक स्तर पर नारी शक्ति का लोहा मनवाया था!",
    quoteOrInspiration: "हंसा मेहता ने संविधान सभा में महिलाओं की शिक्षा, मुफ्त स्वास्थ्य और समान नागरिक अधिकारों की पुरज़ोर मांग उठाई थी।",
    colorTheme: "indigo",
    mapCoordinates: { x: 28, y: 64, label: "महाराष्ट्र" }
  },
  {
    id: "GUJARAT",
    name: "गुजरात (Western States)",
    members: ["सरदार वल्लभभाई पटेल (लौह पुरुष 🦁)", "के.एम. मुंशी", "बहादुर भाई पटेल", "हंसा मेहता"],
    historicalFact: "सरदार वल्लभभाई पटेल ने 560 से अधिक रजवाड़ों को भारत में मिलाया, जिससे पूरे देश का एक कानून बन सका। वे संविधान सभा की 'मौलिक अधिकारों, अल्पसंख्यकों और जनजातीय क्षेत्रों' की परामर्श समिति के अध्यक्ष भी थे। उन्होंने मौलिक अधिकारों को हर बच्चे और हर नागरिक के लिए रक्षा कवच बनाया।",
    quoteOrInspiration: "सरदार पटेल ने कड़े शब्दों में कहा था, 'यदि देश के भीतर छोटे-छोटे स्वतंत्र टुकड़े रहेंगे तो हमारी आज़ादी सुरक्षित नहीं रह पाएगी।'",
    colorTheme: "orange",
    mapCoordinates: { x: 18, y: 48, label: "गुजरात" }
  },
  {
    id: "TAMIL_NADU",
    name: "तमिलनाडु व मद्रास प्रांत (Madras Province)",
    members: ["सी. राजगोपालाचारी", "डॉ. अमू स्वामीनाथन (बालिका शिक्षा सेनानी)", "दक्षायनी वेलायुधन (एकमात्र दलित महिला सदस्य 👩🏽‍🌾)", "जी. दुर्गाबाई देशमुख"],
    historicalFact: "मद्रास प्रांत से आए सदस्यों का भारतीय संविधान की धर्मनिरपेक्षता (Secularism), सामाजिक कल्याण और विकेंद्रीकरण पर गहरा प्रभाव था। दक्षायनी वेलायुधन और दुर्गाबाई देशमुख जी ने देश में छुआछूत और भेदभाव को पूरी तरह कानूनन बंद कराने की लड़ाई लड़ी और बालिकाओं को मुफ्त शिक्षा का मार्ग दिखाया।",
    quoteOrInspiration: "दक्षायनी वेलायुधन ने कहा था कि संविधान केवल नियमों का बंडल नहीं है, बल्कि यह हाशिए के लोगों को पहली बार मुख्यधारा में लाने का ऐतिहासिक अवसर है!",
    colorTheme: "emerald",
    mapCoordinates: { x: 38, y: 88, label: "तमिलनाडु" }
  },
  {
    id: "WEST_BENGAL",
    name: "पश्चिम बंगाल (Bengal Province)",
    members: ["डॉ. श्यामा प्रसाद मुखर्जी", "रेणुका राय (समाज सुधारक 👩🏻)", "लीला रॉय", "हरेंद्र कुमार मुखर्जी (H.C. Mookerjee - उपाध्यक्ष)"],
    historicalFact: "बंगाल प्रांत के सदस्यों ने संविधान बहसों में वैज्ञानिक दृष्टिकोण, शिक्षा का प्रसार और मानव अधिकारों पर बल दिया। हरेंद्र कुमार मुखर्जी संविधान सभा के उपाध्यक्ष चुने गए थे। रेणुका राय जी ने महिलाओं के पैतृक संपत्ति अधिकारों को संविधान में सुनिश्चित करने के लिए अभूतपूर्व योगदान दिया।",
    quoteOrInspiration: "रेणुका राय ने संपत्ति के अधिकार और महिलाओं के सामाजिक न्याय के मुद्दे पर संविधान सभा में ऐतिहासिक भाषण दिया था!",
    colorTheme: "purple",
    mapCoordinates: { x: 74, y: 50, label: "पश्चिम बंगाल" }
  },
  {
    id: "PUNJAB",
    name: "पंजाब (East Punjab Province)",
    members: ["सरदार बलदेव सिंह (भारत के प्रथम रक्षा मंत्री 🛡️)", "राजकुमारी अमरित कौर (प्रथम स्वास्थ्य मंत्री 👩‍⚕️)", "ज्ञानी गुरुमुख सिंह मुसाफिर", "भूपिंदर सिंह मान"],
    historicalFact: "विभाजन की भयंकर त्रासदी का दंश झेलने वाले पंजाब के जांबाज नेताओं ने देश की रक्षा, स्वास्थ्य सुरक्षा और शरणार्थियों के पुनर्वास को संविधान में प्रमुखता दिलाई। राजकुमारी अमृत कौर (जो कपूरथला राजघराने से थीं) ने वर्षों तक देश की स्वास्थ्य संरचना का आधार रखा और बाल विवाह प्रथा पर पूर्ण प्रतिबंध की मांग की।",
    quoteOrInspiration: "राजकुमारी अमृत कौर ने तर्क दिया कि बालिकाओं के स्वास्थ्य और शिक्षा के विकास के बिना भारत कभी भी विश्वगुरु नहीं बन सकता।",
    colorTheme: "teal",
    mapCoordinates: { x: 30, y: 22, label: "पंजाब" }
  },
  {
    id: "MADHYA_PRADESH",
    name: "मध्य प्रदेश (Central Provinces & Berar)",
    members: ["डॉ. हरी सिंह गौर (महान शिक्षाविद् 🏫)", "सेठ गोविन्द दास", "रविशंकर शुक्ल", "अमृतलाल वी. ठक्कर"],
    historicalFact: "मध्य भारत के इन प्रखर विचारकों ने हिन्दी को राजभाषा बनाने व आदिवासियों व पिछड़े व जनजातीय क्षेत्रों के विकास के लिए विशेष कानूनी आयोगों के गठन की पुरज़ोर सिफारिश की। डॉ. हरी सिंह गौर ने उच्च शिक्षा सुधार और न्यायिक स्वायत्तता पर बेहतरीन सुधार प्रस्तुत किए थे।",
    quoteOrInspiration: "डॉ. हरी सिंह गौर ने देश में प्राथमिक स्कूलों के साथ-साथ गुणवत्तापूर्ण विश्वविद्यालयों की स्थापना को संविधान की आत्मा के समान महत्वपूर्ण माना!",
    colorTheme: "cyan",
    mapCoordinates: { x: 44, y: 56, label: "मध्य प्रदेश" }
  }
];

export default function HistorySection({ setMascotData }: HistorySectionProps) {
  const [activeTab, setActiveTab] = useState<"theater" | "map" | "figures" | "puzzle">("theater");
  const [selectedRegionId, setSelectedRegionId] = useState<string>("UP");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [selectedPuzzleOpt, setSelectedPuzzleOpt] = useState<number | null>(null);
  const [revealPuzzle, setRevealPuzzle] = useState(false);
  const [solvedPuzzles, setSolvedPuzzles] = useState<boolean[]>(() => {
    const saved = localStorage.getItem("samvidhan_history_puzzles");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return new Array(SPOT_PUZZLES.length).fill(false);
  });

  // Preserve history puzzle progress in localStorage
  useEffect(() => {
    localStorage.setItem("samvidhan_history_puzzles", JSON.stringify(solvedPuzzles));
    window.dispatchEvent(new Event("storage"));
  }, [solvedPuzzles]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const playProgressRef = useRef<number>(0);
  const [progressPercent, setProgressPercent] = useState(0);

  const currentItem = HISTORICAL_MILESTONES[selectedIndex];

  // Custom audio feedback chime for interactive state selection
  const playStateSfx = (freq = 523.25) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  // Speech Synthesizer
  const speakText = (textToSpeak: string) => {
    if (!window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel(); // Stop talking previous lines
      if (!voiceEnabled) return;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "hi-IN";
      utterance.rate = 0.95; // kids comfortable speed
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  };

  // Sync mascot when timeline node changes
  useEffect(() => {
    if (activeTab === "theater" && currentItem) {
      setMascotData({
        mood: selectedIndex === 4 ? "excited" : "happy",
        text: `दोस्तो, क्या आपको पता है, ${currentItem.year === "बोनस" ? "एक अनमोल रहस्य" : currentItem.year + " की ऐतिहासिक गाथा"}? ${currentItem.description}`
      });
      speakText(currentItem.speechText);
    } else if (activeTab === "map") {
      const region = REGIONAL_CONTRIBUTIONS.find(r => r.id === selectedRegionId);
      if (region) {
        setMascotData({
          mood: "excited",
          text: `बच्चों! क्या आपने देखा? ${region.name} ने हमारे संविधान निर्माण में कितना महान योगदान दिया है! उनके बारे में नीचे गौर से पढ़ें।`
        });
        speakText(`${region.name} से संविधान सभा में प्रमुख सदस्य शामिल थे जैसे ${region.members.slice(0, 3).join(", ")}।`);
      }
    } else if (activeTab === "figures") {
      setMascotData({
        mood: "proud",
        text: "बच्चों! ये हैं हमारे देश के महान निर्माता और स्वतंत्रता संग्राम के सच्चे सेनानी। इनके जीवन संग्राम और राष्ट्रभक्ति वाले विचारों को ध्यान से पढ़ें!"
      });
    } else if (activeTab === "puzzle") {
      setMascotData({
        mood: "thinking",
        text: "इतिहास की सैर तो हो गई, अब अपनी समझ का प्रमाण दें! इस मजेदार ऐतिहासिक पहेली का सही उत्तर खोजें।"
      });
    }
  }, [selectedIndex, activeTab, voiceEnabled, selectedRegionId]);

  // Handle theater movie auto-play scenario
  useEffect(() => {
    if (isPlaying) {
      playProgressRef.current = 0;
      setProgressPercent(0);

      const intervalTime = 100; // update progress bar every 100ms
      const totalDuration = 8000; // 8 seconds per slide

      timerRef.current = setInterval(() => {
        playProgressRef.current += intervalTime;
        const currentPct = (playProgressRef.current / totalDuration) * 100;
        setProgressPercent(Math.min(currentPct, 100));

        if (playProgressRef.current >= totalDuration) {
          // Time to slide next!
          setSelectedIndex((prev) => {
            if (prev < HISTORICAL_MILESTONES.length - 1) {
              return prev + 1;
            } else {
              setIsPlaying(false); // Finished loop
              return 0;
            }
          });
          playProgressRef.current = 0;
          setProgressPercent(0);
        }
      }, intervalTime);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setProgressPercent(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, selectedIndex]);

  // Clean speaking on component unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleVoice = () => {
    const nextVoice = !voiceEnabled;
    setVoiceEnabled(nextVoice);
    if (nextVoice && activeTab === "theater") {
      setTimeout(() => speakText(currentItem.speechText), 100);
    } else if (!nextVoice) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    setIsPlaying(false);
    if (selectedIndex < HISTORICAL_MILESTONES.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const handleSolvePuzzle = (optIdx: number) => {
    if (revealPuzzle) return;
    setSelectedPuzzleOpt(optIdx);
    setRevealPuzzle(true);

    const isCorrect = optIdx === SPOT_PUZZLES[puzzleIndex].correctIdx;

    if (isCorrect) {
      const updated = [...solvedPuzzles];
      updated[puzzleIndex] = true;
      setSolvedPuzzles(updated);
      setMascotData({
        mood: "excited",
        text: `शानदार जवाब! बिल्कुल सही चुना। ${SPOT_PUZZLES[puzzleIndex].explanation}`
      });
    } else {
      setMascotData({
        mood: "thinking",
        text: `ओहो! थोडा सा चूक गए। सही उत्तर है विकल्प: '${SPOT_PUZZLES[puzzleIndex].options[SPOT_PUZZLES[puzzleIndex].correctIdx]}'। ${SPOT_PUZZLES[puzzleIndex].explanation}`
      });
    }
  };

  const handleNextPuzzle = () => {
    setSelectedPuzzleOpt(null);
    setRevealPuzzle(false);
    if (puzzleIndex < SPOT_PUZZLES.length - 1) {
      setPuzzleIndex(puzzleIndex + 1);
    } else {
      setPuzzleIndex(0); // Loop back
    }
  };

  return (
    <div id="history-section-module" className="space-y-8">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-5 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            🕒 भारत का गौरवशाली इतिहास
          </h2>
          <p className="text-xs text-slate-500 font-bold mt-1">
            देखें और सुने कि किस तरह रंगीन चित्रों, महानायकों और मजेदार सिनेमा के माध्यम से हमारा महान कानून बना!
          </p>
        </div>

        {/* Tab Controls for History sections */}
        <div className="bg-slate-100 p-1.5 rounded-2xl md:rounded-full flex flex-wrap gap-1 self-start md:self-auto border">
          <button
            onClick={() => setActiveTab("theater")}
            className={`px-4 py-2 rounded-full text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "theater"
                ? "bg-orange-500 text-white shadow-md"
                : "text-slate-650 hover:text-slate-900"
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>🎬 इतिहास थियेटर</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("map");
              playStateSfx(440); // play beautiful root chime A4
            }}
            className={`px-4 py-2 rounded-full text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "map"
                ? "bg-amber-500 text-white shadow-md"
                : "text-slate-650 hover:text-slate-900"
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>🗺️ इतिहास नक्शा (Map)</span>
          </button>
          <button
            onClick={() => setActiveTab("figures")}
            className={`px-4 py-2 rounded-full text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "figures"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-650 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>👥 महान निर्माता</span>
          </button>
          <button
            onClick={() => setActiveTab("puzzle")}
            className={`px-4 py-2 rounded-full text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "puzzle"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-slate-650 hover:text-slate-900"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>✨ ऐतिहासिक पहेली</span>
          </button>
        </div>
      </div>

      {activeTab === "theater" && (
        <div className="space-y-6">
          {/* Timeline Nodes Panel: Multi-Colored Interactive 3D blocks */}
          <div className="bg-slate-50 border-4 border-slate-200 p-4 rounded-[32px] shadow-inner mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 md:gap-4 justify-center items-stretch">
              {HISTORICAL_MILESTONES.map((item, index) => {
                const active = selectedIndex === index;
                
                // Beautiful vibrant themes for each step node
                const colorTabConfigs = [
                  {
                    // 1946 (Orangish Saffron)
                    activeCls: "bg-gradient-to-br from-orange-500 to-amber-500 border-orange-400 text-white shadow-md shadow-orange-500/30 scale-[1.03] z-10 ring-4 ring-orange-250 font-black",
                    inactiveCls: "bg-white hover:bg-orange-50 border-slate-200 text-slate-700 hover:border-orange-350 hover:text-orange-950"
                  },
                  {
                    // 1947 (Crimson Red)
                    activeCls: "bg-gradient-to-br from-rose-500 to-red-600 border-rose-400 text-white shadow-md shadow-rose-500/30 scale-[1.03] z-10 ring-4 ring-rose-250 font-black",
                    inactiveCls: "bg-white hover:bg-rose-50 border-slate-200 text-slate-700 hover:border-rose-350 hover:text-rose-950"
                  },
                  {
                    // 1949 (Purple Indigo)
                    activeCls: "bg-gradient-to-br from-indigo-500 to-purple-650 border-indigo-400 text-white shadow-md shadow-indigo-500/30 scale-[1.03] z-10 ring-4 ring-indigo-250 font-black",
                    inactiveCls: "bg-white hover:bg-indigo-50 border-slate-200 text-slate-700 hover:border-indigo-350 hover:text-indigo-950"
                  },
                  {
                    // 1950 (Emerald Green)
                    activeCls: "bg-gradient-to-br from-emerald-600 to-teal-650 border-emerald-400 text-white shadow-md shadow-emerald-500/30 scale-[1.03] z-10 ring-4 ring-emerald-250 font-black",
                    inactiveCls: "bg-white hover:bg-emerald-50 border-slate-200 text-slate-700 hover:border-emerald-350 hover:text-emerald-950"
                  },
                  {
                    // Bonus (Golden Amber)
                    activeCls: "bg-gradient-to-br from-amber-500 to-yellow-500 border-amber-400 text-white shadow-md shadow-amber-500/30 scale-[1.03] z-10 ring-4 ring-amber-250 font-black",
                    inactiveCls: "bg-white hover:bg-amber-50 border-slate-200 text-slate-700 hover:border-amber-350 hover:text-amber-950"
                  }
                ];

                const cfg = colorTabConfigs[index] || colorTabConfigs[0];
                const finalStyle = active ? cfg.activeCls : cfg.inactiveCls;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setIsPlaying(false);
                      setSelectedIndex(index);
                    }}
                    className={`relative px-3 py-3 md:py-4 rounded-[24px] border-[3px] cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-1.5 text-center select-none ${finalStyle} ${
                      index === 4 && !active ? "sm:col-span-1 col-span-2" : ""
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${active ? "bg-white/20" : "bg-slate-100"}`}>
                      {item.iconName === "Users" && <Users className="w-4.5 h-4.5" />}
                      {item.iconName === "FileText" && <FileText className="w-4.5 h-4.5" />}
                      {item.iconName === "BookOpen" && <BookOpen className="w-4.5 h-4.5" />}
                      {item.iconName === "Sparkles" && <Sparkles className="w-4.5 h-4.5" />}
                      {item.iconName === "Feather" && <Feather className="w-4.5 h-4.5" />}
                    </div>
                    <div className="flex flex-col items-center leading-none">
                      <span className="text-[10px] md:text-[11px] font-extrabold tracking-tight block">
                        {item.year === "बोनस" ? "💡 रोचक गाथा" : `कदम 0${index + 1}`}
                      </span>
                      <span className={`text-[11px] md:text-sm font-black mt-1 ${active ? "text-yellow-150" : "text-slate-600"}`}>
                        {item.year === "बोनस" ? "गुप्त रहस्य" : item.year}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Player Display Section: simulates cartoon and animated sequence */}
          <div className="bg-slate-900 border-4 border-slate-950 rounded-[40px] p-6 md:p-8 text-white relative overflow-hidden shadow-2xl">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-orange-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-50px] left-[-30px] w-64 h-64 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              {/* Left Side: Dynamic Visual Comic Box */}
              <div className="lg:col-span-4 bg-slate-800/80 p-5 rounded-[32px] border-2 border-slate-700/60 aspect-square flex flex-col items-center justify-center text-center relative overflow-hidden shadow-inner group">
                {/* Visual spinning chakra wheel */}
                <div className="absolute w-48 h-48 border-[6px] border-dashed border-slate-700/50 rounded-full animate-spin duration-[40s] pointer-events-none"></div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentItem.id}
                    initial={{ scale: 0.85, opacity: 0, rotate: -5 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.85, opacity: 0, rotate: 5 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="flex flex-col items-center justify-center p-4 w-full h-full"
                  >
                    {currentItem.illustrationType === "assembly" && (
                      <div className="space-y-3">
                        <div className="flex justify-center -space-x-3">
                          <span className="w-14 h-14 rounded-full bg-slate-900 text-2xl flex items-center justify-center border-2 border-slate-700 shadow-md">👨‍⚖️</span>
                          <span className="w-14 h-14 rounded-full bg-slate-900 text-2xl flex items-center justify-center border-2 border-slate-700 shadow-md z-10">👴</span>
                          <span className="w-14 h-14 rounded-full bg-slate-900 text-2xl flex items-center justify-center border-2 border-slate-700 shadow-md">👳</span>
                        </div>
                        <span className="block text-[11px] bg-slate-750 border border-slate-700 px-3 py-1 rounded-full text-slate-300 font-bold">299 संविधान निर्माता चर्चा में</span>
                        <h4 className="text-sm font-black text-white">संसद की पहली बैठक 🇮🇳</h4>
                      </div>
                    )}

                    {currentItem.illustrationType === "writing" && (
                      <div className="space-y-3">
                        <div className="relative">
                          <span className="w-16 h-16 rounded-3xl bg-slate-900 flex items-center justify-center text-4xl shadow-xl border-2 border-amber-400 mx-auto">👨‍🏫</span>
                          <span className="absolute bottom-[-5px] right-[5px] text-xl">✒️</span>
                        </div>
                        <span className="block text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full font-bold">डॉ. भीमराव अंबेडकर</span>
                        <h4 className="text-sm font-black text-white leading-relaxed">60 से अधिक देशों के श्रेष्ठ नियमों की पुस्तक</h4>
                      </div>
                    )}

                    {currentItem.illustrationType === "document" && (
                      <div className="space-y-3">
                        <div className="relative">
                          <div className="w-20 h-24 bg-gradient-to-b from-amber-600 to-amber-700 rounded-lg shadow-2xl border-4 border-yellow-400 p-2 text-center text-white flex flex-col justify-center gap-1.5 mx-auto">
                            <span className="text-[7px] font-black tracking-widest uppercase block bg-blue-900/40 rounded py-0.5">सत्यमेव जयते</span>
                            <span className="text-[10px] font-black tracking-tight leading-none block">भारत का संविधान</span>
                            <div className="w-4 h-4 rounded-full border border-yellow-250 mx-auto mt-0.5 flex items-center justify-center text-[7px]">🇮🇳</div>
                          </div>
                          <span className="absolute bottom-[-10px] right-[25%] text-2xl animate-bounce">✍️</span>
                        </div>
                        <span className="block text-[10px] leading-relaxed font-bold text-slate-300">284 सदस्यों का हस्ताक्षर क्षण</span>
                      </div>
                    )}

                    {currentItem.illustrationType === "flag" && (
                      <div className="space-y-4">
                        <div className="flex flex-col w-24 h-12 border border-slate-700 shadow-xl rounded-md overflow-hidden mx-auto transform rotate-6">
                          <div className="h-1/3 bg-orange-500"></div>
                          <div className="h-1/3 bg-white flex justify-center items-center relative">
                            <div className="w-3.5 h-3.5 rounded-full border border-blue-900 flex justify-center items-center">
                              <span className="text-[6px] text-blue-900">⚙️</span>
                            </div>
                          </div>
                          <div className="h-1/3 bg-emerald-600"></div>
                        </div>
                        <div className="text-xs font-black text-emerald-400 animate-pulse">26 जनवरी: गणतंत्र दिवस! ⭐️</div>
                        <span className="block text-[10px] text-slate-400">भारतीय तोपखाना सलामी</span>
                      </div>
                    )}

                    {currentItem.illustrationType === "calligrapher" && (
                      <div className="space-y-3">
                        <div className="relative">
                          <span className="w-16 h-16 rounded-3xl bg-slate-900 flex items-center justify-center text-4xl shadow-xl border-2 border-indigo-400 mx-auto">✍️</span>
                          <span className="absolute top-[-5px] right-2 text-xl animate-pulse">✒️</span>
                        </div>
                        <span className="block text-[11px] bg-slate-750 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full font-bold">प्रेम बिहारी रायजादा</span>
                        <h4 className="text-xs font-black text-white px-2">हाथ से सुंदर अक्षरों में रचा इतिहास</h4>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Side: Narrative Details */}
              <div className="lg:col-span-8 flex flex-col min-h-[300px] justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1.5 bg-orange-500 text-white text-xs font-black rounded-xl uppercase tracking-wider">
                      {currentItem.year === "बोनस" ? "💡 रोचक गाथा" : `गौरव वर्ष - ${currentItem.year}`}
                    </span>

                    {/* Speech buttons */}
                    <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
                      <button
                        onClick={handleToggleVoice}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                          voiceEnabled ? "bg-orange-500 text-white" : "text-slate-400 hover:text-white"
                        }`}
                        title={voiceEnabled ? "वॉइसओवर ऑफ करें" : "कमेंट्री (ऑडियो) चालू करें"}
                      >
                        {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      </button>
                      <span className="text-[10px] text-slate-350 pr-2 font-bold hidden sm:inline">
                        {voiceEnabled ? "🗣️ कमेंट्री शुरू है" : "ऑडियो बंद"}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-200 to-green-400 leading-tight">
                    {currentItem.title}
                  </h3>
                  
                  <p className="text-xs md:text-sm font-black text-slate-300 leading-relaxed italic border-l-3 border-orange-500 pl-3">
                    "{currentItem.description}"
                  </p>

                  <p className="text-xs md:text-sm text-slate-100 font-medium leading-relaxed bg-slate-800/60 p-4 rounded-2xl border border-slate-750 shadow-inner">
                    {currentItem.detail}
                  </p>
                </div>

                {/* Simulated Movie / Progress Controls */}
                <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-4 justify-between">
                  
                  {/* Play Buttons Bar */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer flex items-center gap-1 px-3 shadow Transition-colors ${
                        isPlaying
                          ? "bg-rose-600 hover:bg-rose-500 text-white"
                          : "bg-orange-500 hover:bg-orange-400 text-white"
                      }`}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                      <span>{isPlaying ? "सिनेमा रोकें (Pause)" : "🎬 सिनेमा चलाएं (Play Mode)"}</span>
                    </button>

                    <span className="text-[10px] text-slate-405 font-medium shrink-0">
                      {isPlaying ? "ऑटो-प्ले मोड जारी है (8s)" : "खुद अपनी गति से पढ़ें"}
                    </span>
                  </div>

                  {/* Slider Manual overrides */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={handlePrev}
                      disabled={selectedIndex === 0}
                      className="p-2 bg-slate-800 border border-slate-700 text-white rounded-xl hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
                      title="पिछला कदम"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      onClick={handleNext}
                      disabled={selectedIndex === HISTORICAL_MILESTONES.length - 1}
                      className="px-4 py-2 bg-slate-800 border border-slate-700 text-white font-black text-xs rounded-xl hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition flex items-center gap-1"
                    >
                      <span>अगला कदम</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Ticker Progress loading bar for Cinema Mode */}
                {isPlaying && (
                  <div className="w-full h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-green-500 rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* 📜 सचित्र एनिमेटेड टाइमलाइन (Scroll-Triggered Timeline Segment) */}
          <div className="mt-12 space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[10px] font-black text-orange-600 bg-orange-100 border-2 border-orange-300 px-3 py-1 rounded-full uppercase tracking-widest inline-block animate-bounce">
                📜 जादूई स्क्रॉल यात्रा
              </span>
              <h3 className="text-2xl font-black text-slate-800">
                यात्रा पथ: संविधान निर्माण के गौरवशाली कदम 🌟
              </h3>
              <p className="text-xs text-slate-500 font-bold">
                जैसे-जैसे आप नीचे स्क्रॉल करेंगे, इतिहास के सुनहरे पन्ने और सुंदर तिरंगे झंडे खुद-ब-खुद प्रकट होंगे!
              </p>
            </div>

            <div className="relative border-l-4 border-dashed border-indigo-200 pl-8 md:pl-12 space-y-12 max-w-4xl mx-auto py-6">
              {HISTORICAL_MILESTONES.map((item, index) => {
                // Determine step-specific colorful accents and blocks
                const scrollBlockConfigs = [
                  {
                    // 1946 Saffron Block
                    cardBg: "bg-gradient-to-br from-amber-50 to-orange-50/50 border-orange-300 hover:border-orange-500 shadow-orange-100/50 hover:shadow-orange-200/50",
                    badgeCls: "bg-orange-100 text-orange-950 border-orange-200",
                    accentLine: "border-orange-400",
                    sidePanelBg: "bg-gradient-to-br from-orange-500 to-amber-500 border-orange-600"
                  },
                  {
                    // 1947 Rose/Red Block
                    cardBg: "bg-gradient-to-br from-rose-50 to-red-50/50 border-rose-300 hover:border-rose-500 shadow-rose-100/50 hover:shadow-rose-200/50",
                    badgeCls: "bg-rose-100 text-rose-950 border-rose-200",
                    accentLine: "border-rose-400",
                    sidePanelBg: "bg-gradient-to-br from-rose-500 to-red-600 border-rose-600"
                  },
                  {
                    // 1949 Purple/Indigo Block
                    cardBg: "bg-gradient-to-br from-purple-50 to-indigo-50/50 border-purple-300 hover:border-purple-500 shadow-purple-100/50 hover:shadow-purple-200/50",
                    badgeCls: "bg-purple-100 text-purple-950 border-purple-200",
                    accentLine: "border-purple-400",
                    sidePanelBg: "bg-gradient-to-br from-indigo-500 to-purple-650 border-indigo-600"
                  },
                  {
                    // 1950 Emerald/Green Block
                    cardBg: "bg-gradient-to-br from-emerald-51 to-teal-50/50 border-emerald-300 hover:border-emerald-500 shadow-emerald-100/50 hover:shadow-emerald-200/50",
                    badgeCls: "bg-emerald-100 text-emerald-950 border-emerald-200",
                    accentLine: "border-emerald-400",
                    sidePanelBg: "bg-gradient-to-br from-emerald-600 to-teal-650 border-emerald-705"
                  },
                  {
                    // Bonus Gold Block
                    cardBg: "bg-gradient-to-br from-amber-50/95 to-yellow-50/50 border-amber-300 hover:border-amber-500 shadow-amber-100/50 hover:shadow-yellow-250/50",
                    badgeCls: "bg-amber-100 text-amber-950 border-amber-200",
                    accentLine: "border-amber-400",
                    sidePanelBg: "bg-gradient-to-br from-amber-500 to-yellow-500 border-amber-600"
                  }
                ];

                const cfg = scrollBlockConfigs[index] || scrollBlockConfigs[0];

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -40, y: 30 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ type: "spring", stiffness: 80, delay: 0.05 }}
                    className={`relative border-3 p-6 md:p-8 rounded-[35px] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-6 items-center ${cfg.cardBg}`}
                  >
                    {/* Animated Flag flying in on scroll */}
                    <div className="absolute top-6 -left-[51px] md:-left-[69px] z-20">
                      <motion.div
                        initial={{ scale: 0, rotate: -60, y: 20 }}
                        whileInView={{ scale: 1, rotate: 0, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ type: "spring", stiffness: 180, damping: 11, delay: 0.15 }}
                        className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-red-500 border-3 border-white shadow-xl flex items-center justify-center text-lg md:text-2xl cursor-pointer"
                        whileHover={{ scale: 1.15, rotate: 10 }}
                      >
                        <motion.span
                          animate={{ 
                             rotate: [0, 12, -12, 12, 0],
                             y: [0, -3, 0]
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 3, 
                            ease: "easeInOut"
                          }}
                          className="inline-block"
                        >
                          🇮🇳
                        </motion.span>
                      </motion.div>
                    </div>

                    {/* Left node label */}
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-black border px-3 py-1 rounded-xl uppercase ${cfg.badgeCls}`}>
                          वर्ष {item.year}
                        </span>
                        <h4 className="text-base font-black text-slate-900">
                          {item.title}
                        </h4>
                      </div>

                      <p className={`text-xs md:text-sm font-black text-slate-800 leading-relaxed italic border-l-3 pl-2 ${cfg.accentLine}`}>
                        "{item.description}"
                      </p>

                      <p className="text-xs text-slate-700 font-bold leading-relaxed bg-white/80 p-4 rounded-2xl border border-white/50">
                        {item.detail}
                      </p>
                    </div>

                    {/* Side Character Graphic Panel */}
                    <div className={`w-full md:w-36 border-2 border-black/10 rounded-[28px] p-4 text-white flex flex-col items-center justify-center text-center relative overflow-hidden shrink-0 aspect-video md:aspect-square shadow-md ${cfg.sidePanelBg}`}>
                      <div className="absolute top-[-20px] right-[-20px] w-20 h-20 bg-white/5 rounded-full filter blur-xl"></div>
                      <div className="text-3xl filter drop-shadow">
                        {item.illustrationType === "assembly" && "👨‍⚖️"}
                        {item.illustrationType === "writing" && "✒️"}
                        {item.illustrationType === "document" && "📜"}
                        {item.illustrationType === "flag" && "🌟"}
                        {item.illustrationType === "calligrapher" && "✍️"}
                      </div>
                      <span className="text-[9px] font-black text-white/90 mt-2 block tracking-wider uppercase">
                        {item.illustrationType === "assembly" && "संविधान सभा"}
                        {item.illustrationType === "writing" && "प्रारूप लेखन"}
                        {item.illustrationType === "document" && "पावन ग्रंथ"}
                        {item.illustrationType === "flag" && "लागू उत्सव"}
                        {item.illustrationType === "calligrapher" && "हस्तलेखन कला"}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Fact note block */}
          <div className="bg-amber-50 border-3 border-dashed border-amber-300 p-5 rounded-3xl flex gap-3 items-start">
            <span className="text-xl shrink-0">💡</span>
            <div>
              <h5 className="text-amber-950 font-black text-xs">क्या आप जानते हैं? (Amazing Fact Check):</h5>
              <p className="text-[11px] text-amber-900 leading-relaxed font-bold mt-1">
                हमारे संविधान की मूल हिंदी तथा अंग्रेजी हस्ताक्षरित प्रतियों को नष्ट होने से बचाने के लिए संसद भवन के पुस्तकालय भवन में **हीलियम गैस (Helium Gas)** के विशेष पारदर्शी डिब्बे में बंद कर रखा गया है, ताकि यह अनमोल धरोहर कई पीढ़ियों तक सुरक्षित रहे!
              </p>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === "map" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Header Description */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-black text-amber-600 bg-amber-100 border-2 border-amber-300 px-3 py-1 rounded-full uppercase tracking-widest inline-block animate-pulse">
              🗺️ भारत मानचित्र साहसिक यात्रा
            </span>
            <h3 className="text-2xl font-black text-slate-800">
              संवैधानिक इतिहास मानचित्र (Constitutional Unity Map)
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              भारत के विभिन्न क्षेत्रों/प्रांतों पर क्लिक करें और देखें कि किस तरह पूरे देश के महान निर्माताओं ने मिलकर हमारे पवित्र संविधान के पन्नों को अपने आदर्शों से सजाया!
            </p>
          </div>

          {/* Core Interactive Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Box: SVG Interactive Vector Map Container */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border-4 border-slate-950 rounded-[40px] p-5 shadow-2xl relative flex flex-col justify-between overflow-hidden min-h-[460px]">
              {/* Grid Lines Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:30px_30px] opacity-15 pointer-events-none"></div>

              {/* Decorative Compass and Shield */}
              <div className="absolute top-4 left-4 flex items-center gap-2 text-slate-400 select-none z-10">
                <Compass className="w-5 h-5 text-amber-400 animate-spin duration-[40s]" />
                <span className="text-[9px] font-mono tracking-widest opacity-60">NORTH PATHFINDER</span>
              </div>

              {/* Saffron-White-Green Gradient Ring on top-right corner representing Indian Tricolor subtly */}
              <div className="absolute top-4 right-4 flex gap-1 z-10 bg-slate-800/40 p-1 rounded-xl">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              </div>

              {/* Decorative title inside map frame */}
              <div className="text-center pt-2 pb-1 relative z-10">
                <span className="text-[10px] bg-slate-800 text-slate-350 border border-slate-700 px-3 py-1 rounded-full font-black tracking-wider uppercase">
                  संवैधानिक एकता सूत्र (Unity Web)
                </span>
              </div>

              {/* Map SVG Canvas */}
              <div className="relative flex-1 flex items-center justify-center py-4">
                <svg
                  viewBox="0 0 380 430"
                  className="w-full h-auto max-h-[380px] drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] select-none"
                >
                  {/* Decorative stylized dotted boundaries of Indian coastline & border outline */}
                  <path
                    d="M 120,40 L 150,45 L 180,60 L 210,50 L 220,70 L 240,80 L 230,105 L 260,115 L 290,130 L 310,135 L 340,150 L 330,175 L 300,185 L 280,180 L 290,205 L 320,210 L 330,225 L 310,240 L 285,235 L 275,250 L 260,265 L 245,280 L 240,300 L 225,320 L 215,340 L 195,365 L 180,390 L 165,410 L 160,390 L 150,370 L 140,350 L 130,330 L 125,310 L 115,295 L 105,275 L 110,260 L 95,250 L 80,240 L 60,235 L 45,215 L 60,200 L 75,185 L 90,165 L 95,150 L 115,130 Z"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="3"
                    strokeDasharray="6,4"
                    className="opacity-70"
                  />
                  
                  {/* Glowing stylized Curved Networks (indicating drafting integration threads between provinces) */}
                  <g className="stroke-slate-750 stroke-[1.5] fill-none opacity-40">
                    <path d="M 120,110 Q 185,175 185,175" /> {/* Punjab to UP */}
                    <path d="M 75,220 Q 185,175 185,175" />  {/* Gujarat to UP */}
                    <path d="M 120,290 Q 185,175 185,175" /> {/* Bombay to UP */}
                    <path d="M 175,240 Q 185,175 185,175" /> {/* MP to UP */}
                    <path d="M 265,200 Q 185,175 185,175" /> {/* Bihar to UP */}
                    <path d="M 310,225 Q 265,200 265,200" /> {/* Bengal to Bihar */}
                    <path d="M 165,390 Q 120,290 120,290" /> {/* Madras to Bombay */}
                    <path d="M 165,390 Q 175,240 175,240" /> {/* Madras to MP */}
                  </g>

                  {/* Pulsing state marker nodes */}
                  {REGIONAL_CONTRIBUTIONS.map((state) => {
                    const isSelected = selectedRegionId === state.id;
                    const coords = state.mapCoordinates;

                    // Match coordinates to standard SVG layout scale (approximate points for visualization)
                    const nodeX = state.id === "PUNJAB" ? 115 : 
                                  state.id === "GUJARAT" ? 70 :
                                  state.id === "MAHARASHTRA" ? 110 :
                                  state.id === "UP" ? 180 :
                                  state.id === "MADHYA_PRADESH" ? 170 :
                                  state.id === "BIHAR" ? 255 :
                                  state.id === "WEST_BENGAL" ? 300 : 
                                  state.id === "TAMIL_NADU" ? 170 : coords.x;
                                  
                    const nodeY = state.id === "PUNJAB" ? 95 : 
                                  state.id === "GUJARAT" ? 200 :
                                  state.id === "MAHARASHTRA" ? 285 :
                                  state.id === "UP" ? 155 :
                                  state.id === "MADHYA_PRADESH" ? 220 :
                                  state.id === "BIHAR" ? 180 :
                                  state.id === "WEST_BENGAL" ? 205 : 
                                  state.id === "TAMIL_NADU" ? 370 : coords.y;

                    // Emojis mapping for state representation
                    const emojiMap: Record<string, string> = {
                      UP: "🤝",
                      BIHAR: "🎓",
                      MAHARASHTRA: "⚖️",
                      GUJARAT: "🦁",
                      TAMIL_NADU: "🌴",
                      WEST_BENGAL: "🎨",
                      PUNJAB: "🛡️",
                      MADHYA_PRADESH: "🏫"
                    };

                    let colorThemeCls = "fill-amber-500 stroke-amber-400";
                    let ringCls = "stroke-amber-400";
                    if (state.colorTheme === "rose") { colorThemeCls = "fill-rose-500 stroke-rose-400"; ringCls = "stroke-rose-400"; }
                    if (state.colorTheme === "indigo") { colorThemeCls = "fill-indigo-500 stroke-indigo-400"; ringCls = "stroke-indigo-400"; }
                    if (state.colorTheme === "orange") { colorThemeCls = "fill-orange-500 stroke-orange-400"; ringCls = "stroke-orange-400"; }
                    if (state.colorTheme === "emerald") { colorThemeCls = "fill-emerald-500 stroke-emerald-400"; ringCls = "stroke-emerald-400"; }
                    if (state.colorTheme === "purple") { colorThemeCls = "fill-purple-500 stroke-purple-400"; ringCls = "stroke-purple-400"; }
                    if (state.colorTheme === "teal") { colorThemeCls = "fill-teal-500 stroke-teal-400"; ringCls = "stroke-teal-400"; }
                    if (state.colorTheme === "cyan") { colorThemeCls = "fill-cyan-500 stroke-cyan-400"; ringCls = "stroke-cyan-400"; }

                    return (
                      <g
                        key={state.id}
                        className="cursor-pointer group"
                        onClick={() => {
                          setSelectedRegionId(state.id);
                          // Click SFX pitch based on state frequency
                          const pitchFreq = state.id === "UP" ? 523 :
                                            state.id === "BIHAR" ? 587 :
                                            state.id === "MAHARASHTRA" ? 659 :
                                            state.id === "GUJARAT" ? 698 :
                                            state.id === "TAMIL_NADU" ? 784 :
                                            state.id === "WEST_BENGAL" ? 880 :
                                            state.id === "PUNJAB" ? 987 : 1046;
                          playStateSfx(pitchFreq);
                        }}
                      >
                        {/* Selected State soft outer highlight halo */}
                        {isSelected && (
                          <circle
                            cx={nodeX}
                            cy={nodeY}
                            r="24"
                            className="fill-white/10 animate-pulse stroke-slate-500 stroke-[0.5] stroke-dasharray-[3,2]"
                          />
                        )}

                        {/* Interactive Ripple ring on hover/select */}
                        <circle
                          cx={nodeX}
                          cy={nodeY}
                          r={isSelected ? "18" : "14"}
                          className={`fill-none stroke-2 opacity-55 ${ringCls} ${
                            isSelected ? "animate-ping opacity-30" : "group-hover:scale-125 transition-transform"
                          }`}
                        />

                        {/* Node body circle */}
                        <circle
                          cx={nodeX}
                          cy={nodeY}
                          r={isSelected ? "12" : "10"}
                          className={`stroke-2 transition-all duration-300 ${colorThemeCls} ${
                            isSelected ? "r-12 shadow-lg filter saturate-150" : "group-hover:r-[11px]"
                          }`}
                        />

                        {/* Inside emoji / icon */}
                        <text
                          x={nodeX}
                          y={nodeY + 4}
                          textAnchor="middle"
                          fontSize={isSelected ? "11" : "9"}
                          className="pointer-events-none select-none font-bold"
                        >
                          {emojiMap[state.id] || "📍"}
                        </text>

                        {/* Sleek Floating Hover Tag Label */}
                        <g transform={`translate(${nodeX}, ${nodeY + 22})`}>
                          <rect
                            x="-38"
                            y="-9"
                            width="76"
                            height="16"
                            rx="5"
                            className={`${
                              isSelected 
                                ? "fill-slate-100 stroke-amber-450 text-slate-900 font-extrabold" 
                                : "fill-slate-800/85 stroke-slate-750 text-slate-400 group-hover:fill-slate-700"
                            } stroke-[1] transition-colors`}
                          />
                          <text
                            x="0"
                            y="2"
                            textAnchor="middle"
                            fontSize="8.5"
                            className={`font-black tracking-tight leading-none pointer-events-none select-none ${
                              isSelected ? "fill-slate-950 font-black" : "fill-slate-300"
                            }`}
                          >
                            {state.mapCoordinates.label}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Little map navigation clue */}
              <div className="text-slate-400 text-center text-[10px] font-bold py-2 bg-slate-900 border-t border-slate-800 rounded-b-[30px]">
                💡 मानचित्र पर राज्यों के रंगों और चिह्नों पर उंगली/माउस ले जाकर क्लिक करें!
              </div>
            </div>

            {/* Right Box: State Contribution Bento Details View */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-6">
              
              {/* State Horizontal Buttons Grid for quick mobile/tablet accessibility */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-[28px] p-3 shadow-inner">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">
                  📌 त्वरित राज्य ब्राउज़र (Touch State Selector):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 justify-stretch">
                  {REGIONAL_CONTRIBUTIONS.map((s) => {
                    const isSelected = selectedRegionId === s.id;
                    
                    // Thematic button colors based on colorTheme
                    const themeColors: Record<string, string> = {
                      amber: "border-amber-300 bg-amber-50 text-amber-950 ring-amber-300/40 hover:bg-amber-100",
                      rose: "border-rose-300 bg-rose-50 text-rose-950 ring-rose-300/40 hover:bg-rose-100",
                      indigo: "border-indigo-300 bg-indigo-50 text-indigo-950 ring-indigo-300/40 hover:bg-indigo-100",
                      orange: "border-orange-300 bg-orange-50 text-orange-950 ring-orange-300/40 hover:bg-orange-100",
                      emerald: "border-emerald-300 bg-emerald-50 text-emerald-950 ring-emerald-300/40 hover:bg-emerald-100",
                      purple: "border-purple-300 bg-purple-50 text-purple-950 ring-purple-300/40 hover:bg-purple-100",
                      teal: "border-teal-300 bg-teal-50 text-teal-950 ring-teal-300/40 hover:bg-teal-100",
                      cyan: "border-cyan-300 bg-cyan-50 text-cyan-950 ring-cyan-300/40 hover:bg-cyan-100"
                    };

                    const finalColorStyle = isSelected
                      ? "bg-slate-900 border-slate-900 text-white shadow-md scale-[1.02] font-black"
                      : `${themeColors[s.colorTheme]} text-slate-700 font-bold`;

                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setSelectedRegionId(s.id);
                          playStateSfx(550);
                        }}
                        className={`py-2 px-2.5 rounded-xl border-1.5 text-[11px] text-center leading-none truncate transition-all duration-250 cursor-pointer ${finalColorStyle}`}
                      >
                        {s.mapCoordinates.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bento Box Container with micro-details */}
              {(() => {
                const currentRegion = REGIONAL_CONTRIBUTIONS.find(r => r.id === selectedRegionId) || REGIONAL_CONTRIBUTIONS[0];

                // Design state banners matching theme
                const themeBanners: Record<string, { bannerBg: string; textCls: string; accentBorder: string; badgeCls: string }> = {
                  amber: { bannerBg: "from-amber-400 to-amber-650", textCls: "text-amber-950", accentBorder: "border-amber-300 bg-amber-50", badgeCls: "bg-amber-100 text-amber-955 border-amber-300" },
                  rose: { bannerBg: "from-rose-400 to-rose-650", textCls: "text-rose-950", accentBorder: "border-rose-300 bg-rose-50", badgeCls: "bg-rose-100 text-rose-955 border-rose-300" },
                  indigo: { bannerBg: "from-indigo-500 to-indigo-700", textCls: "text-indigo-950", accentBorder: "border-indigo-300 bg-indigo-50", badgeCls: "bg-indigo-100 text-indigo-955 border-indigo-300" },
                  orange: { bannerBg: "from-orange-400 to-orange-650", textCls: "text-orange-950", accentBorder: "border-orange-300 bg-orange-50", badgeCls: "bg-orange-100 text-orange-955 border-orange-300" },
                  emerald: { bannerBg: "from-emerald-500 to-emerald-700", textCls: "text-emerald-950", accentBorder: "border-emerald-300 bg-emerald-50", badgeCls: "bg-emerald-100 text-emerald-955 border-emerald-300" },
                  purple: { bannerBg: "from-purple-500 to-purple-700", textCls: "text-purple-950", accentBorder: "border-purple-300 bg-purple-50", badgeCls: "bg-purple-100 text-purple-955 border-purple-300" },
                  teal: { bannerBg: "from-teal-500 to-teal-700", textCls: "text-teal-950", accentBorder: "border-teal-300 bg-teal-50", badgeCls: "bg-teal-105 text-teal-955 border-teal-300" },
                  cyan: { bannerBg: "from-cyan-550 to-cyan-700", textCls: "text-cyan-950", accentBorder: "border-cyan-300 bg-cyan-50", badgeCls: "bg-cyan-100 text-cyan-955 border-cyan-300" }
                };

                const bannerStyle = themeBanners[currentRegion.colorTheme] || themeBanners.amber;

                return (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentRegion.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.25 }}
                      className="bg-white border-4 border-slate-200 rounded-[35px] overflow-hidden shadow-xl flex flex-col justify-between flex-1"
                    >
                      {/* State Title Banner Panel */}
                      <div className={`bg-gradient-to-r ${bannerStyle.bannerBg} p-5 text-white flex justify-between items-center relative overflow-hidden shrink-0`}>
                        <div className="absolute top-[-30px] right-[-30px] w-36 h-36 bg-white/5 rounded-full filter blur-xl"></div>
                        
                        <div className="flex items-center gap-3 relative z-10">
                          <span className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-2xl select-none border border-white/30 backdrop-blur-xs">
                            {currentRegion.id === "UP" && "🤝"}
                            {currentRegion.id === "BIHAR" && "🎓"}
                            {currentRegion.id === "MAHARASHTRA" && "⚖️"}
                            {currentRegion.id === "GUJARAT" && "🦁"}
                            {currentRegion.id === "TAMIL_NADU" && "🌴"}
                            {currentRegion.id === "WEST_BENGAL" && "🎨"}
                            {currentRegion.id === "PUNJAB" && "🛡️"}
                            {currentRegion.id === "MADHYA_PRADESH" && "🏫"}
                          </span>
                          <div>
                            <span className="text-[10px] bg-black/25 text-white/95 px-2.5 py-0.5 rounded-full font-black tracking-wide uppercase">
                              क्षेत्रीय इतिहास गाथा
                            </span>
                            <h4 className="text-base sm:text-xl font-black mt-0.5 select-all leading-tight">
                              {currentRegion.name}
                            </h4>
                          </div>
                        </div>

                        {/* Speech buttons specific to map region content */}
                        <button
                          type="button"
                          onClick={() => {
                            if (window.speechSynthesis) {
                              window.speechSynthesis.cancel();
                            }
                            // Narrate the beautiful contribution
                            const textToSpeak = `${currentRegion.name} के प्रमुख सदस्यों में शामिल थे ${currentRegion.members.join(", ")}। ${currentRegion.historicalFact}`;
                            const utterance = new SpeechSynthesisUtterance(textToSpeak);
                            utterance.lang = "hi-IN";
                            utterance.rate = 0.95;
                            window.speechSynthesis.speak(utterance);
                            playStateSfx(880);
                          }}
                          className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 text-[10px] font-black rounded-xl hover:bg-slate-800 flex items-center gap-1.5 transition text-white self-center shadow cursor-pointer relative z-10 shrink-0"
                          title="इस क्षेत्र का इतिहास भाषण सुनें"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                          <span className="hidden sm:inline">कहानी सुनें</span>
                        </button>
                      </div>

                      {/* Content Details Grid (Bento columns) */}
                      <div className="p-5 md:p-6 space-y-5 flex-1 flex flex-col justify-between">
                        
                        {/* Section 1: Constitutional Draft & Historical Fact Contribution */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs">📜</span>
                            <h5 className="text-[11px] font-mono tracking-wider font-bold text-slate-400 uppercase">
                              संविधान सभा में योगदान तथा इतिहास:
                            </h5>
                          </div>
                          <p className="text-xs md:text-sm text-slate-850 font-bold leading-relaxed bg-slate-50 border border-slate-150 p-4 rounded-2xl relative shadow-inner">
                            {currentRegion.historicalFact}
                          </p>
                        </div>

                        {/* Section 2: Core Personalities / Leaders (Constituent Assembly members) */}
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs">👥</span>
                            <h5 className="text-[11px] font-mono tracking-wider font-bold text-slate-400 uppercase">
                              प्रमुख संविधान निर्माता (Key Assembly Members):
                            </h5>
                          </div>
                          
                          {/* Horizontal chips list */}
                          <div className="flex flex-wrap gap-2">
                            {currentRegion.members.map((member, mIdx) => {
                              // Detect women leaders specifically to accent them
                              const isWoman = member.includes("बेगम") || member.includes("महिला") || member.includes("कृपलानी") || member.includes("मेहता") || member.includes("स्वामीनाथन") || member.includes("वेलायुधन") || member.includes("देशमुख") || member.includes("राय") || member.includes("लॉय") || member.includes("कौर");
                              
                              return (
                                <div
                                  key={mIdx}
                                  className={`px-3 py-1.5 rounded-xl border text-[11px] font-black transition-colors flex items-center gap-1.5 ${
                                    isWoman
                                      ? "bg-rose-50 border-rose-300 text-rose-900 shadow-sm"
                                      : `${bannerStyle.accentBorder} text-slate-900`
                                  }`}
                                >
                                  {isWoman ? (
                                    <span className="text-xs">👩‍⚖️</span>
                                  ) : (
                                    <span className="text-xs">🎓</span>
                                  )}
                                  <span>{member}</span>
                                  {isWoman && (
                                    <span className="text-[8px] bg-rose-200 text-rose-800 font-extrabold px-1 rounded">
                                      महिला सदस्य
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Section 3: Quote card / Wisdom for students */}
                        <div className={`p-4 rounded-2xl border-l-[6px] text-xs font-semibold relative overflow-hidden ${bannerStyle.accentBorder} tracking-normal`}>
                          <span className="text-slate-350/50 font-serif text-5xl absolute top-[-5px] right-2 select-none pointer-events-none">“</span>
                          <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase mb-1">
                            ⭐️ बच्चों के लिए प्रेरक ज्ञान/विचार:
                          </span>
                          <p className="text-slate-800 font-medium italic pl-1 text-[11px] leading-relaxed relative z-10 pr-4">
                            "{currentRegion.quoteOrInspiration}"
                          </p>
                        </div>

                      </div>
                    </motion.div>
                  </AnimatePresence>
                );
              })()}

            </div>

          </div>

          {/* Saffron-White-Green tricolor divider banner */}
          <div className="h-2 w-full rounded-full flex overflow-hidden">
            <div className="h-full bg-orange-500 w-1/3"></div>
            <div className="h-full bg-white w-1/3"></div>
            <div className="h-full bg-emerald-600 w-1/3"></div>
          </div>
        </div>
      )}

      {activeTab === "figures" && (
        <div className="space-y-8">
          <div className="text-center md:text-left max-w-xl">
            <h3 className="text-xl font-black text-indigo-950">संविधान सभा के महानायक</h3>
            <p className="text-xs text-slate-500 font-bold mt-1">
              आइए बात करते हैं हमारे संविधान निर्माण की प्रेरक ताकतों से, जिन्होंने अपने ज्ञान से भारत की दिशा बदली!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {HISTORIC_FIGURES.map((fig) => (
              <motion.div
                key={fig.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.01 }}
                className="bg-white border-4 border-slate-150 rounded-[35px] p-6 shadow-xl flex flex-col md:flex-row gap-5 items-start justify-between"
              >
                {/* Profile Character Icon */}
                <div className="w-20 h-20 rounded-[28px] bg-indigo-50 border-3 border-indigo-200 flex-shrink-0 flex items-center justify-center text-4xl shadow-inner md:mx-auto">
                  {fig.avatar}
                </div>

                <div className="space-y-3 flex-1">
                  <div>
                    <span className="text-[10px] font-black text-indigo-700 uppercase tracking-wider block bg-indigo-50 px-2.5 py-1 border border-indigo-150 rounded-xl w-fit">
                      {fig.role}
                    </span>
                    <h4 className="text-lg font-black text-slate-900 mt-1">{fig.name}</h4>
                  </div>
                  
                  <p className="text-xs text-slate-500 font-bold leading-relaxed">
                    {fig.desc}
                  </p>

                  <div className="bg-slate-50 p-3 rounded-2xl border text-xs text-slate-700 italic font-semibold relative">
                    <span className="text-indigo-400 font-serif text-3xl absolute top-[-5px] left-2">“</span>
                    <p className="pl-6 font-medium">"{fig.quote}"</p>
                  </div>

                  <div className="text-[10px] text-slate-400 font-bold">
                    🛡️ विशिष्ट बुद्धिमत्ता: <strong className="text-slate-700 font-black">{fig.superpower}</strong>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Inspirational Note */}
          <div className="bg-indigo-50 border border-indigo-200 p-5 rounded-3xl flex gap-3 items-center">
            <span className="text-xl">👩‍⚖️</span>
            <p className="text-[11px] text-indigo-900 font-black leading-relaxed">
              * संविधान बनाने में कुल 15 महिला सदस्य भी शामिल थीं, जिन्होंने समानता तथा वयस्क मताधिकार को पक्का करने के लिए अपने उत्कृष्ट तर्क संसद में पेश किए थे।
            </p>
          </div>
        </div>
      )}

      {activeTab === "puzzle" && (
        <div className="bg-slate-50 p-6 md:p-8 border-4 border-slate-200 rounded-[40px] max-w-xl mx-auto space-y-6 shadow-xl">
          <div className="text-center space-y-1">
            <div className="w-14 h-14 bg-emerald-100 border-2 border-emerald-300 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-sm">
              ✨
            </div>
            <h3 className="text-xl font-black text-emerald-950">ऐतिहासिक पहेली (Historic Spot Quiz)</h3>
            <p className="text-xs text-slate-505 font-bold text-slate-500">
              देखें आपने इतिहास की रंगीन झांकियों से क्या-क्या सीखा है!
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-[10px] bg-slate-900 text-white font-black px-2.5 py-1 rounded-xl">
                पहेली 0{puzzleIndex + 1} / 0{SPOT_PUZZLES.length}
              </span>
              <span className="text-[10px] text-slate-400 font-bold">
                सफलता दर: {solvedPuzzles.filter(Boolean).length} हल
              </span>
            </div>

            <h4 className="text-sm md:text-base font-black text-slate-800 leading-snug">
              {SPOT_PUZZLES[puzzleIndex].question}
            </h4>

            <div className="space-y-3">
              {SPOT_PUZZLES[puzzleIndex].options.map((opt, idx) => {
                const isSelected = selectedPuzzleOpt === idx;
                const isCorrect = idx === SPOT_PUZZLES[puzzleIndex].correctIdx;

                let style = "border-slate-150 hover:bg-slate-50 text-slate-700 bg-white hover:border-slate-550";

                if (revealPuzzle) {
                  if (isCorrect) {
                    style = "border-emerald-500 bg-emerald-50 text-emerald-950 font-black ring-2 ring-emerald-500/10";
                  } else if (isSelected) {
                    style = "border-rose-500 bg-rose-50 text-rose-950 font-black ring-2 ring-rose-500/10";
                  } else {
                    style = "border-slate-100 bg-slate-50 text-slate-350 opacity-50";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={revealPuzzle}
                    onClick={() => handleSolvePuzzle(idx)}
                    className={`w-full p-3.5 rounded-2xl border-2 text-left text-xs md:text-sm font-bold cursor-pointer transition ${style}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {revealPuzzle && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-150 text-xs text-slate-700 leading-relaxed font-semibold transition"
              >
                <strong className="text-emerald-950 font-black block mb-1">💡 पहेली का हल रहस्य:</strong>
                {SPOT_PUZZLES[puzzleIndex].explanation}
                
                <div className="flex justify-end mt-3 border-t pt-2 border-emerald-200">
                  <button
                    onClick={handleNextPuzzle}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] rounded-xl cursor-pointer"
                  >
                    {puzzleIndex < SPOT_PUZZLES.length - 1 ? "अगली पहेली ➔" : "शुरुआत से खेलें"}
                  </button>
                </div>
              </motion.div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
