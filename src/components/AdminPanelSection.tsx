/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, 
  Unlock, 
  Settings, 
  Youtube, 
  RefreshCw, 
  Check, 
  AlertTriangle, 
  ShieldAlert, 
  LogOut, 
  User, 
  Key, 
  Save, 
  Award, 
  TrendingUp,
  Mail,
  Github,
  Linkedin,
  Globe,
  Image,
  Terminal,
  Camera,
  Phone,
  User2
} from "lucide-react";
import { ARTICLES_DATA, ArticleItem } from "./ArticlesSection";
import { doc, setDoc } from "firebase/firestore";
import { signInWithPopup, signOut } from "firebase/auth";
import { db, auth, googleProvider } from "../lib/firebase";

interface AdminPanelSectionProps {
  setMascotData: (data: { mood: "happy" | "thinking" | "excited" | "proud" | "speaking" | "greeting"; text: string }) => void;
}

export default function AdminPanelSection({ setMascotData }: AdminPanelSectionProps) {
  // Authentication states
  const [userIdInput, setUserIdInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [firebaseUser, setFirebaseUser] = useState<any>(null);

  // Sub-tab state
  const [adminSubTab, setAdminSubTab] = useState<"articles" | "developers">("articles");

  // Saved credentials in storage (or default: admin / admin)
  const [adminId, setAdminId] = useState("admin");
  const [adminPassword, setAdminPassword] = useState("admin");

  // Custom URLs for articles
  const [articleUrls, setArticleUrls] = useState<Record<string, string>>({});
  // Click stats for articles
  const [clickCounts, setClickCounts] = useState<Record<string, number>>({});

  // Developer Gautam state
  const [gautamPhoto, setGautamPhoto] = useState("");
  const [gautamEmail, setGautamEmail] = useState("");
  const [gautamGithub, setGautamGithub] = useState("");
  const [gautamYoutube, setGautamYoutube] = useState("");
  const [gautamLinkedin, setGautamLinkedin] = useState("");
  const [gautamPortfolio, setGautamPortfolio] = useState("");
  const [gautamSaved, setGautamSaved] = useState("");

  // Developer Kushagra state
  const [kushagraPhoto, setKushagraPhoto] = useState("");
  const [kushagraEmail, setKushagraEmail] = useState("");
  const [kushagraGithub, setKushagraGithub] = useState("");
  const [kushagraYoutube, setKushagraYoutube] = useState("");
  const [kushagraLinkedin, setKushagraLinkedin] = useState("");
  const [kushagraPortfolio, setKushagraPortfolio] = useState("");
  const [kushagraSaved, setKushagraSaved] = useState("");

  // Change credentials states
  const [newAdminId, setNewAdminId] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [credMessage, setCredMessage] = useState("");
  const [credError, setCredError] = useState("");

  // Registered mobile for SMS security updates
  const [adminMobile, setAdminMobile] = useState("+91 6350279005");
  const [smsLogs, setSmsLogs] = useState<{ id: string; to: string; body: string; time: string; status: "success" | "pending"; provider: string }[]>([]);
  const [activeSMS, setActiveSMS] = useState<{ id: string; to: string; body: string; time: string; provider: string } | null>(null);

  // Edit action message
  const [saveMessage, setSaveMessage] = useState<Record<string, string>>({});

  // Helper inside panel to parse and generate direct Google Drive image links
  const getDirectImageUrl = (url: string | null): string => {
    if (!url) return "";
    const trimmed = url.trim();
    if (trimmed.startsWith("data:image")) return trimmed;
    
    const driveReg1 = /\/file\/d\/([a-zA-Z0-9_-]+)/;
    const driveReg2 = /[?&]id=([a-zA-Z0-9_-]+)/;
    
    const match1 = trimmed.match(driveReg1);
    if (match1 && match1[1]) {
      return `https://lh3.googleusercontent.com/d/${match1[1]}`;
    }
    
    const match2 = trimmed.match(driveReg2);
    if (match2 && match2[1]) {
      return `https://lh3.googleusercontent.com/d/${match2[1]}`;
    }
    
    return trimmed;
  };

  // Initialize and load configurations
  useEffect(() => {
    // 1. Get stored admin credentials or initialize default
    const storedId = localStorage.getItem("samvidhan_admin_uid");
    const storedPass = localStorage.getItem("samvidhan_admin_pwd");

    if (storedId) {
      setAdminId(storedId);
    } else {
      localStorage.setItem("samvidhan_admin_uid", "admin");
    }

    if (storedPass) {
      setAdminPassword(storedPass);
    } else {
      localStorage.setItem("samvidhan_admin_pwd", "admin");
    }

    // Checking if an active session is saved (in SessionStorage so refresh doesn't logout)
    const sessionActive = sessionStorage.getItem("samvidhan_admin_session") === "true";
    if (sessionActive) {
      setIsAuthenticated(true);
    }

    // 2. Load urls and click stats
    const urls: Record<string, string> = {};
    const clicks: Record<string, number> = {};

    ARTICLES_DATA.forEach((art) => {
      urls[art.id] = localStorage.getItem(`samvidhan_article_yt_${art.id}`) || "";
      clicks[art.id] = Number(localStorage.getItem(`samvidhan_article_clicks_${art.id}`)) || 0;
    });

    setArticleUrls(urls);
    setClickCounts(clicks);

    // 3. Load Developers settings from localStorage
    setGautamPhoto(localStorage.getItem("gautam_photo") || "");
    setGautamEmail(localStorage.getItem("gautam_email") || "technogautam87@gmail.com");
    setGautamGithub(localStorage.getItem("gautam_social_github") || "https://github.com/technogautam87");
    setGautamYoutube(localStorage.getItem("gautam_social_youtube") || "https://youtube.com/@technogautam87");
    setGautamLinkedin(localStorage.getItem("gautam_social_linkedin") || "https://www.linkedin.com/in/chandra-shekhar-gautam");
    setGautamPortfolio(localStorage.getItem("gautam_social_portfolio") || "https://technogautam87.github.io");

    setKushagraPhoto(localStorage.getItem("kushagra_photo") || "");
    setKushagraEmail(localStorage.getItem("kushagra_email") || "kushagragaur87@gmail.com");
    setKushagraGithub(localStorage.getItem("kushagra_social_github") || "https://github.com/kushagragaur87");
    setKushagraYoutube(localStorage.getItem("kushagra_social_youtube") || "https://youtube.com");
    setKushagraLinkedin(localStorage.getItem("kushagra_social_linkedin") || "https://www.linkedin.com/in/kushagragaur");
    setKushagraPortfolio(localStorage.getItem("kushagra_social_portfolio") || "https://kushagaur.github.io");

    // 4. Load configured mobile and SMS trigger logs
    const storedMobile = localStorage.getItem("samvidhan_admin_mobile") || "+91 6350279005";
    setAdminMobile(storedMobile);

    const storedLogs = localStorage.getItem("samvidhan_admin_sms_logs");
    if (storedLogs) {
      try {
        setSmsLogs(JSON.parse(storedLogs));
      } catch (err) {}
    }
  }, []);

  // Subscribe to Firebase Auth and check if admin is logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setFirebaseUser(user);
      if (user && user.email === "technogautam87@gmail.com") {
        setIsAuthenticated(true);
        sessionStorage.setItem("samvidhan_admin_session", "true");
      }
    });
    return unsubscribe;
  }, []);

  // Update Mascot when tab changes or logins happen
  useEffect(() => {
    if (!isAuthenticated) {
      setMascotData({
        mood: "thinking",
        text: "संविधान पोर्टल के एडमिन पैनल में आपका स्वागत है! कृपया आगे बढ़ने के लिए सुरक्षित एडमिन क्रेडेंशियल्स दर्ज करें। 🔐"
      });
    } else {
      setMascotData({
        mood: "excited",
        text: "बधाई हो, एडमिन! आप सफलतापूर्वक लॉग इन हो चुके हैं। यहाँ से आप सभी अनुच्छेदों के यूट्यूब वीडियो लिंक संपादित कर सकते हैं। 🎛️⚙️"
      });
    }
  }, [isAuthenticated, setMascotData]);

  // Dismiss active simulated SMS after 7 seconds automatically
  useEffect(() => {
    if (activeSMS) {
      const timer = setTimeout(() => {
        setActiveSMS(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [activeSMS]);

  // Audio Feedbacks
  const playSfx = (freq: number, type: "sine" | "triangle" | "sawtooth" | "square" = "sine", duration = 0.1) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      }
    } catch {}
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const currentSavedId = localStorage.getItem("samvidhan_admin_uid") || "admin";
    const currentSavedPass = localStorage.getItem("samvidhan_admin_pwd") || "admin";

    if (userIdInput === currentSavedId && passwordInput === currentSavedPass) {
      playSfx(600, "sine", 0.15);
      setTimeout(() => playSfx(800, "sine", 0.2), 100);
      setIsAuthenticated(true);
      sessionStorage.setItem("samvidhan_admin_session", "true");
      setUserIdInput("");
      setPasswordInput("");
    } else {
      playSfx(150, "sawtooth", 0.3);
      setLoginError("अमान्य उपयोगकर्ता नाम (User ID) या सुरक्षा पिन / पासवर्ड!");
    }
  };

  const handleSignOut = () => {
    playSfx(400, "sine", 0.1);
    setIsAuthenticated(false);
    sessionStorage.removeItem("samvidhan_admin_session");
    signOut(auth).catch(err => console.error("Firebase sign out failed:", err));
  };

  // Helper to sync all active custom URLs and click counts to Firestore
  const syncArticlesToFirestore = async (overrideUrls?: Record<string, string>, overrideClicks?: Record<string, number>) => {
    if (auth.currentUser) {
      try {
        const u = overrideUrls || articleUrls;
        const c = overrideClicks || clickCounts;
        const currentUrls: Record<string, string> = {};
        const currentClicks: Record<string, number> = {};
        ARTICLES_DATA.forEach((art) => {
          let urlVal = "";
          if (u[art.id] !== undefined) {
            urlVal = u[art.id];
          } else {
            urlVal = localStorage.getItem(`samvidhan_article_yt_${art.id}`) || "";
          }
          currentUrls[art.id] = urlVal;

          let clickVal = 0;
          if (c[art.id] !== undefined) {
            clickVal = c[art.id];
          } else {
            clickVal = Number(localStorage.getItem(`samvidhan_article_clicks_${art.id}`)) || 0;
          }
          currentClicks[art.id] = clickVal;
        });

        await setDoc(doc(db, "settings", "articles"), {
          customUrls: currentUrls,
          clickCounts: currentClicks
        });
      } catch (err) {
        console.error("Firebase articles write failed:", err);
      }
    }
  };

  // Helper to sync developer profiles to Firestore
  const syncDevelopersToFirestore = async (customOverrides?: Record<string, string>) => {
    if (auth.currentUser) {
      try {
        const data: Record<string, string> = {
          gautam_photo: localStorage.getItem("gautam_photo") || "",
          gautam_email: localStorage.getItem("gautam_email") || "",
          gautam_social_github: localStorage.getItem("gautam_social_github") || "",
          gautam_social_linkedin: localStorage.getItem("gautam_social_linkedin") || "",
          gautam_social_youtube: localStorage.getItem("gautam_social_youtube") || "",
          gautam_social_portfolio: localStorage.getItem("gautam_social_portfolio") || "",
          kushagra_photo: localStorage.getItem("kushagra_photo") || "",
          kushagra_email: localStorage.getItem("kushagra_email") || "",
          kushagra_social_github: localStorage.getItem("kushagra_social_github") || "",
          kushagra_social_linkedin: localStorage.getItem("kushagra_social_linkedin") || "",
          kushagra_social_youtube: localStorage.getItem("kushagra_social_youtube") || "",
          kushagra_social_portfolio: localStorage.getItem("kushagra_social_portfolio") || ""
        };

        if (customOverrides) {
          Object.entries(customOverrides).forEach(([k, v]) => {
            data[k] = v;
          });
        }

        await setDoc(doc(db, "settings", "developers"), data);
      } catch (err) {
        console.error("Firebase developers write failed:", err);
      }
    }
  };

  // Save changes to custom YouTube URLs
  const handleSaveUrl = async (artId: string, customVal: string) => {
    const trimmed = customVal.trim();
    if (trimmed) {
      localStorage.setItem(`samvidhan_article_yt_${artId}`, trimmed);
    } else {
      localStorage.removeItem(`samvidhan_article_yt_${artId}`);
    }

    const nextUrls = { ...articleUrls, [artId]: trimmed };
    setArticleUrls(nextUrls);
    window.dispatchEvent(new Event("storage"));

    playSfx(880, "sine", 0.1);
    setSaveMessage(prev => ({ ...prev, [artId]: "लिंक सहेजा गया! ✅" }));

    // Global cloud sync
    await syncArticlesToFirestore(nextUrls, undefined);

    setTimeout(() => {
      setSaveMessage(prev => {
        const copy = { ...prev };
        delete copy[artId];
        return copy;
      });
    }, 2500);
  };

  // Reset metrics or custom URLs
  const handleResetUrl = async (artId: string) => {
    localStorage.removeItem(`samvidhan_article_yt_${artId}`);
    const nextUrls = { ...articleUrls, [artId]: "" };
    setArticleUrls(nextUrls);
    window.dispatchEvent(new Event("storage"));
    
    playSfx(440, "sine", 0.1);
    setSaveMessage(prev => ({ ...prev, [artId]: "डिफ़ॉल्ट पर रीसेट! 🔄" }));

    // Global cloud sync
    await syncArticlesToFirestore(nextUrls, undefined);

    setTimeout(() => {
      setSaveMessage(prev => {
        const copy = { ...prev };
        delete copy[artId];
        return copy;
      });
    }, 2500);
  };

  // Change Admin Login Credentials
  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setCredError("");
    setCredMessage("");

    const newId = newAdminId.trim();
    if (!newId) return setCredError("User ID खाली नहीं हो सकता!");
    if (newAdminPassword.length < 4) return setCredError("नया क्रेडेंशियल/पासवर्ड कम से कम ४ अक्षरों का होना चाहिए!");
    if (newAdminPassword !== confirmNewPassword) return setCredError("पासवर्ड की पुष्टि मेल नहीं खाती!");

    const mobileClean = adminMobile.trim();
    if (mobileClean.length < 10) {
      return setCredError("कृपया एक वैध १०-अंकों का मोबाइल नंबर दर्ज करें!");
    }

    localStorage.setItem("samvidhan_admin_uid", newId);
    localStorage.setItem("samvidhan_admin_pwd", newAdminPassword);
    localStorage.setItem("samvidhan_admin_mobile", mobileClean);
    
    setAdminId(newId);
    setAdminPassword(newAdminPassword);

    const maskedPwd = newAdminPassword.substring(0, 2) + "*".repeat(Math.max(1, newAdminPassword.length - 2));
    const nowStr = new Date().toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const fullDate = new Date().toLocaleDateString("hi-IN", { day: "numeric", month: "short", year: "numeric" });
    
    const smsId = "SMS-" + Math.floor(Math.random() * 900000 + 100000);
    const smsBody = `🔔 सुरक्षा अलर्ट (Samvidhan Mitra): आपके एडमिन क्रेडेंशियल्स सफलतापूर्वक बदले गए हैं। User ID: ${newId}, पासवर्ड: ${maskedPwd}। समय: ${nowStr}, दिनांक: ${fullDate}। यदि यह आपने नहीं किया है तो तुरंत सहायता पर संपर्क करें!`;
    
    const newLogItem = {
      id: smsId,
      to: mobileClean,
      body: smsBody,
      time: `${fullDate} ${nowStr}`,
      status: "success" as const,
      provider: "JIO-SecureSMS Gateway (Primary)"
    };

    const updatedLogs = [newLogItem, ...smsLogs].slice(0, 10);
    setSmsLogs(updatedLogs);
    localStorage.setItem("samvidhan_admin_sms_logs", JSON.stringify(updatedLogs));

    // Display the simulated push notification on screen
    setActiveSMS({
      id: smsId,
      to: mobileClean,
      body: smsBody,
      time: `${nowStr}`,
      provider: "JIO-SecureSMS Gateway (Primary)"
    });

    playSfx(880, "sine", 0.25);
    setTimeout(() => {
      // Simulate phone text chime sound
      playSfx(587.33, "sine", 0.08); 
      setTimeout(() => playSfx(659.25, "sine", 0.08), 80); 
      setTimeout(() => playSfx(880, "sine", 0.12), 160); 
    }, 400);

    setCredMessage(`सफलता! क्रेडेंशियल बदल दिए गए हैं और पंजीकृत मोबाइल (${mobileClean}) पर पुष्टि सुरक्षा संदेश भेज दिया गया है। 👍`);
    setMascotData({
      mood: "proud",
      text: `सुरक्षा पुष्टि! मैंने आपके पंजीकृत मोबाइल नंबर ${mobileClean} पर सुरक्षा अद्यतन का SMS संदेश सफलतापूर्वक भेज दिया है। 🛡️📱`
    });

    setNewAdminId("");
    setNewAdminPassword("");
    setConfirmNewPassword("");
  };

  // Quick action: override or adjust stats clicks
  const handleSetStatsValue = async (artId: string, val: number) => {
    localStorage.setItem(`samvidhan_article_clicks_${artId}`, String(val));
    const nextClicks = { ...clickCounts, [artId]: val };
    setClickCounts(nextClicks);
    window.dispatchEvent(new Event("storage"));
    playSfx(750, "sine", 0.05);

    // Global cloud sync
    await syncArticlesToFirestore(undefined, nextClicks);
  };

  return (
    <div className="space-y-8 animate-fadeIn font-sans text-left">
      {/* Tab Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-650 to-purple-600 text-white p-6 rounded-[32px] shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="bg-rose-100 text-rose-950 border border-rose-300 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider block w-fit">
            🔐 सुरक्षित नियंत्रण कक्ष • CONTROL PORTAL
          </span>
          <h2 className="text-xl md:text-3xl font-black drop-shadow-xs">
            प्रशासक नियंत्रण कक्ष (Admin Management Control)
          </h2>
          <p className="text-xs text-rose-100/90 font-bold leading-relaxed">
            यहाँ से आप पोर्टल के विभिन्न मापदंडों और संविधान अनुच्छेद के प्रामाणिक यूट्यूब वीडियो लिंक्स को सुरक्षित रूप से संपादित एवं देखरेख कर सकते हैं।
          </p>
        </div>
        <div className="shrink-0 flex items-center justify-center">
          {isAuthenticated ? (
            <Unlock className="w-16 h-16 text-rose-100/30 animate-pulse hidden md:block" />
          ) : (
            <Lock className="w-16 h-16 text-rose-100/30 animate-pulse hidden md:block" />
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          /* LOGIN BOX LAYER */
          <motion.div
            key="login-gate"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-md mx-auto bg-white border-2 border-slate-200 rounded-[32px] p-6 shadow-md space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto border-2 border-rose-100">
                <Lock className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="text-lg font-black text-slate-800">सुरक्षित पोर्टल लॉगिन (Admin Login)</h3>
              <p className="text-xs text-slate-500 font-bold">
                डिफ़ॉल्ट लॉगिन क्रेडेंशियल: 
                <span className="text-rose-600 font-extrabold font-mono bg-rose-50 px-2 py-0.5 rounded border border-rose-150 ml-1">
                  admin / admin
                </span>
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest pl-1">
                  यूज़र ID (User ID):
                </label>
                <div className="relative flex items-center bg-slate-50 border-2 border-slate-200 focus-within:border-rose-500 rounded-xl px-3 py-2.5">
                  <User className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    required
                    value={userIdInput}
                    onChange={(e) => setUserIdInput(e.target.value)}
                    placeholder="जैसे: admin"
                    className="w-full bg-transparent text-slate-800 font-bold text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest pl-1">
                  सुरक्षा पिन / पासवर्ड:
                </label>
                <div className="relative flex items-center bg-slate-50 border-2 border-slate-200 focus-within:border-rose-500 rounded-xl px-3 py-2.5">
                  <Key className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="जैसे: admin"
                    className="w-full bg-transparent text-slate-800 font-bold text-xs focus:outline-none font-mono"
                  />
                </div>
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-[10px] font-bold p-3 rounded-xl flex items-center gap-1.5 justify-center leading-relaxed">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-500 to-pink-650 hover:from-rose-600 hover:to-pink-700 text-white font-black text-xs py-3 rounded-xl border-b-4 border-rose-800 active:border-b-0 cursor-pointer transition flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>सुरक्षित प्रवेश करें (Password Login)</span>
              </button>

              <div className="flex items-center gap-2 text-slate-300 my-4 text-[10px] uppercase font-black tracking-widest select-none">
                <div className="h-[1px] bg-slate-200 flex-1"></div>
                <span>या (OR)</span>
                <div className="h-[1px] bg-slate-200 flex-1"></div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  try {
                    setLoginError("");
                    const result = await signInWithPopup(auth, googleProvider);
                    if (result.user && result.user.email === "technogautam87@gmail.com") {
                      playSfx(600, "sine", 0.15);
                      setTimeout(() => playSfx(800, "sine", 0.2), 100);
                      setIsAuthenticated(true);
                      sessionStorage.setItem("samvidhan_admin_session", "true");
                      setMascotData({
                        mood: "excited",
                        text: "नमस्ते चन्द्र शेखर जी! आप सफलता पूर्वक Google खाते के साथ लॉग इन हो गए हैं। 🎉📜"
                      });
                    } else {
                      await signOut(auth);
                      setLoginError("अनधिकृत खाता! केवल technogautam87@gmail.com को ही प्रशासनिक अनुमतियां प्राप्त हैं।");
                    }
                  } catch (err: any) {
                    console.error("Google login failed:", err);
                    setLoginError("गूगल साइन-इन विफल रहा: " + (err.message || String(err)));
                  }
                }}
                className="w-full bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-extrabold text-xs py-3 rounded-xl shadow-xs cursor-pointer transition flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 shrink-0 animate-pulse" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.67-.35-1.37-.35-2.09v-.54z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google से प्रवेश करें (Admin Google Login)</span>
              </button>
            </form>
          </motion.div>
        ) : (
          /* FULLY AUTHENTICATED ADMIN PANEL CAPABILITIES */
          <motion.div
            key="admin-workspace"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8"
          >
            {/* SUB TAB CONTROLLING AREA */}
            <div className="flex bg-slate-100 p-1 rounded-2xl w-fit border border-slate-200">
              <button
                onClick={() => { playSfx(600); setAdminSubTab("articles"); }}
                className={`px-5 py-2 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer ${
                  adminSubTab === "articles" 
                    ? "bg-rose-500 text-white shadow-md scale-102" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Youtube className="w-4 h-4" />
                <span>यूट्यूब कड़ियाँ (Articles Videos)</span>
              </button>
              <button
                onClick={() => { playSfx(600); setAdminSubTab("developers"); }}
                className={`px-5 py-2 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer ${
                  adminSubTab === "developers" 
                    ? "bg-rose-500 text-white shadow-md scale-102" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <User2 className="w-4 h-4" />
                <span>डेवलपर प्रोफाइल अद्यतन (Developer Profiles)</span>
              </button>
            </div>

            {adminSubTab === "articles" ? (
              /* TAB CONTENT: 2 Column Workspace */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* LEFT COLUMN: SETTINGS/CREDENTIALS */}
                <div className="lg:col-span-1 space-y-6">
                  
                  {/* 1. MASTER LOGIN CHANGE */}
                  <div className="bg-white border-2 border-slate-150 rounded-3xl p-5 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-150 pb-3">
                      <Settings className="w-5 h-5 text-rose-500" />
                      <h3 className="font-black text-sm text-slate-800">मास्टर लॉगिन बदलें (Change Admin Login)</h3>
                    </div>

                    <form onSubmit={handleUpdateCredentials} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 block">नया यूज़र ID:</label>
                        <input
                          type="text"
                          required
                          value={newAdminId}
                          onChange={(e) => setNewAdminId(e.target.value)}
                          placeholder="जैसे: head_admin1"
                          className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-bold text-xs focus:outline-none focus:border-rose-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 block">नया पासवर्ड:</label>
                        <input
                          type="password"
                          required
                          value={newAdminPassword}
                          onChange={(e) => setNewAdminPassword(e.target.value)}
                          placeholder="कम से कम 4 अक्षर"
                          className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-bold text-xs focus:outline-none focus:border-rose-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 block">पासवर्ड दोहराएं (Confirm):</label>
                        <input
                          type="password"
                          required
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="पासवर्ड पुष्टि"
                          className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-bold text-xs focus:outline-none focus:border-rose-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 block">अलर्ट हेतु पंजीकृत मोबाइल (Registered Mobile):</label>
                        <input
                          type="text"
                          required
                          value={adminMobile}
                          onChange={(e) => setAdminMobile(e.target.value)}
                          placeholder="जैसे: +91 6350279005"
                          className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-bold text-xs focus:outline-none focus:border-rose-400 font-mono"
                        />
                        <span className="text-[9px] text-slate-400 font-black block pt-0.5">पासवर्ड बदलने पर इस नंबर पर एसएमएस अलर्ट डिस्पैच होगा।</span>
                      </div>

                      {credError && (
                        <div className="text-[10px] font-bold text-red-650 bg-red-50 border border-red-205 p-2 rounded-lg">
                          ⚠️ {credError}
                        </div>
                      )}

                      {credMessage && (
                        <div className="text-[10px] font-bold text-emerald-850 bg-emerald-50 border border-emerald-250 p-2 rounded-lg">
                          ✅ {credMessage}
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black text-[10px] py-2 rounded-lg border-b-2 border-rose-800 active:border-b-0 cursor-pointer uppercase transition tracking-wide"
                      >
                        क्रेडेंशियल अपडेट करें
                      </button>
                    </form>
                  </div>

                  {/* SMS Secure Alert Hub & Logs */}
                  <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-5 shadow-sm text-slate-100 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                          <Phone className="w-4 h-4" />
                        </span>
                        <div className="text-left">
                          <h4 className="font-black text-xs text-white">एसएमएस सुरक्षा गेटवे (SMS Gateway Alerts)</h4>
                          <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">पंजीकृत मोबाइल: {adminMobile}</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-black bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full px-2 py-0.5 animate-pulse">LIVE</span>
                    </div>

                    <div className="space-y-3">
                      {smsLogs.length === 0 ? (
                        <p className="text-[10px] text-slate-400 font-bold italic text-center py-2">
                          अभी तक कोई सुरक्षा संदेश डिस्पैच नहीं हुआ है। पासवर्ड बदलते ही पहला एसएमएस अलर्ट डिस्पैच होगा।
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {smsLogs.map((log) => (
                            <div key={log.id} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-[10.5px] font-bold space-y-1 block text-left">
                              <div className="flex items-center justify-between">
                                <span className="text-yellow-400 font-mono text-[9px]">{log.id}</span>
                                <span className="text-[9px] text-slate-500 font-mono">{log.time}</span>
                              </div>
                              <p className="text-slate-300 font-medium leading-normal bg-slate-900/50 p-1.5 rounded pr-1" style={{ whiteSpace: "pre-line" }}>{log.body}</p>
                              <div className="flex items-center justify-between pt-1 border-t border-slate-800/50 text-[9px]">
                                <span className="text-slate-400">प्राप्तकर्ता: <strong className="text-slate-200">{log.to}</strong></span>
                                <span className="text-emerald-400 flex items-center gap-0.5 font-mono bg-emerald-500/10 px-1 py-0.2 rounded">✓ DELIVERED</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 2. ADMIN INFO BANNER */}
                  <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-5 text-slate-700 space-y-3.5">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-amber-600" />
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">संशोधन नियमों की मार्गदर्शिका</h4>
                    </div>
                    <ul className="text-[10.5px] font-bold space-y-2 list-disc pl-4 leading-relaxed">
                      <li>नया यूट्यूब लिंक केवल पूर्ण URL कड़ियों <span className="text-indigo-650 font-mono">(e.g.: https://www.youtube.com/watch?v=...)</span> में ही होना चाहिए।</li>
                      <li>लिंक डिलीट या खाली छोड़कर "सहेजें" क्लिक करने से वह अनुच्छेद फिर से डिफ़ॉल्ट वीडियो पर सेट हो जाएगा।</li>
                      <li>यहाँ किया गया कोई भी बदलाव सीधे मुख्य "संविधान अनुच्छेद" टैब पर लाइव अपडेट हो जाता.</li>
                      <li>सत्र सुरक्षा हेतु कार्य समाप्त होने के पश्चात ऊपर दिए गए "लॉग आउट" बटन पर अवश्य क्लिक करें।</li>
                    </ul>
                  </div>

                </div>

                {/* RIGHT 2-COLUMNS: EDIT ARTICLES YOUTUBE LINKS */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white border-2 border-slate-150 rounded-3xl p-6 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-150 pb-4">
                      <div className="space-y-0.5 text-left animate-pulse">
                        <span className="text-[9.5px] bg-red-100 text-red-800 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider block w-fit">
                          📺 वीडियो लिंक संपादक (Centralized URL Editor)
                        </span>
                        <h3 className="text-[16px] font-black text-slate-800">
                          अनुच्छेद-वार यूट्यूब कड़ियाँ (Manage YouTube Links)
                        </h3>
                      </div>
                    </div>

                    {/* ARTICLES LIST WITH INPUT FIELDS */}
                    <div className="space-y-4 divide-y divide-slate-100">
                      {ARTICLES_DATA.map((art) => {
                        const currentVal = articleUrls[art.id] !== undefined ? articleUrls[art.id] : "";
                        const statVal = clickCounts[art.id] || 0;
                        
                        return (
                          <div key={art.id} className="pt-4 first:pt-0 space-y-3 text-left">
                            {/* Article Title Header */}
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-xl shrink-0 p-1 bg-slate-50 border border-slate-200 rounded-lg">{art.icon}</span>
                                <div className="min-w-0">
                                  <h4 className="text-xs font-black text-slate-800 truncate">
                                    {art.number} : {art.title}
                                  </h4>
                                  <span className="text-[8.5px] font-extrabold text-slate-400 uppercase tracking-widest block mt-0.5">
                                    डिफ़ॉल्ट लिंक है: {art.defaultYtUrl.substring(0, 35)}...
                                  </span>
                                </div>
                              </div>

                              {/* View metric Badge / Stats Modifier */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-[8px] font-black text-indigo-500 uppercase">दृश्य:</span>
                                <div className="flex items-center bg-slate-50 border border-slate-250 rounded-lg py-0.5 px-1.5">
                                  <button 
                                    onClick={() => handleSetStatsValue(art.id, Math.max(0, statVal - 1))}
                                    className="w-4 h-4 bg-slate-200 hover:bg-slate-300 font-black text-[9px] rounded flex items-center justify-center cursor-pointer select-none"
                                  >
                                    -
                                  </button>
                                  <span className="text-[10px] font-black text-slate-800 w-8 text-center font-mono">{statVal}</span>
                                  <button 
                                    onClick={() => handleSetStatsValue(art.id, statVal + 1)}
                                    className="w-4 h-4 bg-slate-200 hover:bg-slate-300 font-black text-[9px] rounded flex items-center justify-center cursor-pointer select-none"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* URL Input Form Row */}
                            <div className="flex flex-col sm:flex-row gap-2">
                              <div className="relative flex-1">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-red-500">
                                  <Youtube className="w-4 h-4 select-none" />
                                </span>
                                <input
                                  type="text"
                                  value={currentVal}
                                  onChange={(e) => {
                                    const newVal = e.target.value;
                                    setArticleUrls(prev => ({ ...prev, [art.id]: newVal }));
                                  }}
                                  placeholder="https://www.youtube.com/watch?v=..."
                                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-red-500 rounded-xl pl-9 pr-3 py-2 text-[10.5px] font-mono font-bold text-slate-800 focus:outline-none transition-all placeholder:text-slate-300"
                                />
                              </div>

                              <div className="flex gap-1.5 shrink-0 justify-end">
                                <button
                                  onClick={() => handleSaveUrl(art.id, currentVal)}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[9.5px] px-3.5 py-2 rounded-xl transition cursor-pointer border-b-2 border-indigo-850 active:border-b-0 flex items-center gap-1"
                                  title="कस्टम लिंक सहेजें"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                  <span>सहेजें</span>
                                </button>

                                {currentVal && (
                                  <button
                                    onClick={() => handleResetUrl(art.id)}
                                    className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-600 font-extrabold text-[9.5px] px-2 py-2 rounded-xl transition cursor-pointer"
                                    title="डिफ़ॉल्ट पर रीसेट करें"
                                  >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Quick Message feedback per input row */}
                            {saveMessage[art.id] && (
                              <motion.span 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-[9.5px] text-emerald-650 font-black tracking-wider block pl-1 py-0.5 animate-pulse"
                              >
                                {saveMessage[art.id]}
                              </motion.span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              /* DEVELOPERS EDITING DASHBOARD */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-fadeIn">
                {/* Gautum Profile Edit Container */}
                <div className="bg-white border-2 border-amber-300 rounded-[32px] p-6 shadow-md space-y-6 text-left">
                  <div className="flex items-center gap-3 border-b-2 border-amber-250 pb-4">
                    <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-2xl shadow-inner">
                      <User2 className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-850">श्री चन्द्र शेखर गौतम</h3>
                      <p className="text-[10px] text-amber-600 font-extrabold uppercase tracking-wider">रचयिता एवं मुख्य डेवलपर (Gautam)</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Google Drive Photo URL */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest pl-1 block">फोटो ड्राइव कढ़ी (Google Drive / URL link):</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <Image className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          value={gautamPhoto}
                          onChange={(e) => setGautamPhoto(e.target.value)}
                          placeholder="यहाँ Google Drive शेयरिंग लिंक या इमेज यूआरएल पेस्ट करें"
                          className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-amber-400 rounded-xl pl-9 pr-3 py-2 text-[11px] font-mono font-bold text-slate-800 focus:outline-none transition-all placeholder:text-slate-300 font-mono"
                        />
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold block leading-relaxed pl-1">
                        💡 Google Drive शेयर लिंक (जैसे: <code>https://drive.google.com/file/d/...</code>) अपने आप डायरेक्ट इमेज में बदल जाएगा।
                      </span>
                    </div>

                    {/* Gautam Photo Live Preview */}
                    <div className="bg-stone-50 border border-slate-200 p-3 rounded-2xl flex items-center gap-4">
                      {gautamPhoto ? (
                        <div className="w-16 h-16 rounded-xl shadow-md border-2 border-slate-900 bg-white overflow-hidden shrink-0">
                          <img 
                            src={getDirectImageUrl(gautamPhoto)} 
                            alt="Preview Gautam" 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl border border-dashed border-slate-300 bg-slate-100 flex items-center justify-center shrink-0">
                          <span className="text-[9px] text-slate-400 font-bold text-center p-1">डिफ़ॉल्ट वेक्टर सक्रिय</span>
                        </div>
                      )}
                      <div>
                        <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block">लाइव फोटो पूर्वावलोकन</span>
                        <p className="text-[10px] text-slate-600 font-bold leading-normal mt-0.5">
                          {gautamPhoto ? "गूगल ड्राइव लिंक से फोटो सफलतापूर्वक लोड कर ली गई है।" : "कोई फोटो सेट नहीं है, चन्द्र शेखर जी का डिफ़ॉल्ट वेक्टर दर्शाया जा रहा है।"}
                        </p>
                        {gautamPhoto && (
                          <button
                            onClick={() => {
                              setGautamPhoto("");
                              playSfx(400);
                            }}
                            className="text-[9px] text-red-600 hover:underline font-black mt-1 block h-fit w-fit"
                          >
                            वापस रिस्टोर करके वेक्टर लगाएं 🗑️
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Email URL */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest pl-1 block">संपर्क ईमेल (Email ID):</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <Mail className="w-4 h-4" />
                        </span>
                        <input
                          type="email"
                          value={gautamEmail}
                          onChange={(e) => setGautamEmail(e.target.value)}
                          placeholder="email@example.com"
                          className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-amber-400 rounded-xl pl-9 pr-3 py-2 text-[11px] font-mono font-bold text-slate-800 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Social links details */}
                    <div className="space-y-2.5 pt-2">
                      <span className="text-[10px] text-slate-400 font-black block uppercase tracking-wider">सोशल मीडिया कड़ियाँ (Social Profiles URL):</span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* GitHub */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1"><Github className="w-3.5 h-3.5" /> GitHub:</span>
                          <input
                            type="text"
                            value={gautamGithub}
                            onChange={(e) => setGautamGithub(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10.5px] font-mono"
                          />
                        </div>

                        {/* LinkedIn */}
                        <div className="space-y-1 flex flex-col justify-end">
                          <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1"><Linkedin className="w-3.5 h-3.5" /> LinkedIn:</span>
                          <input
                            type="text"
                            value={gautamLinkedin}
                            onChange={(e) => setGautamLinkedin(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10.5px] font-mono animate-none"
                          />
                        </div>

                        {/* YouTube */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1"><Youtube className="w-3.5 h-3.5" /> YouTube Channel:</span>
                          <input
                            type="text"
                            value={gautamYoutube}
                            onChange={(e) => setGautamYoutube(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10.5px] font-mono"
                          />
                        </div>

                        {/* Portfolio */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> Portfolio Site:</span>
                          <input
                            type="text"
                            value={gautamPortfolio}
                            onChange={(e) => setGautamPortfolio(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10.5px] font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gautam saving status */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    {gautamSaved ? (
                      <span className="text-[10px] text-emerald-650 font-black tracking-wide animate-pulse">{gautamSaved}</span>
                    ) : (
                      <span></span>
                    )}
                    <button
                      onClick={async () => {
                        const gp = gautamPhoto.trim();
                        const ge = gautamEmail.trim();
                        const gg = gautamGithub.trim();
                        const gl = gautamLinkedin.trim();
                        const gy = gautamYoutube.trim();
                        const gport = gautamPortfolio.trim();

                        localStorage.setItem("gautam_photo", gp);
                        localStorage.setItem("gautam_email", ge);
                        localStorage.setItem("gautam_social_github", gg);
                        localStorage.setItem("gautam_social_linkedin", gl);
                        localStorage.setItem("gautam_social_youtube", gy);
                        localStorage.setItem("gautam_social_portfolio", gport);
                        
                        window.dispatchEvent(new Event("storage"));
                        playSfx(880, "sine", 0.2);
                        setGautamSaved("चन्द्र शेखर जी की प्रोफ़ाइल अद्यतन हो गई! ✅");
                        setMascotData({
                          mood: "excited",
                          text: "चन्द्र शेखर गौतम जी की प्रोफ़ाइल की सटीक जानकारी सफलतापूर्वक सहेज ली गई है! 🌟✨"
                        });

                        // Global cloud sync
                        await syncDevelopersToFirestore({
                          gautam_photo: gp,
                          gautam_email: ge,
                          gautam_social_github: gg,
                          gautam_social_linkedin: gl,
                          gautam_social_youtube: gy,
                          gautam_social_portfolio: gport
                        });

                        setTimeout(() => setGautamSaved(""), 3000);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-5 py-2.5 rounded-xl border-b-2 border-emerald-850 active:border-b-0 cursor-pointer transition flex items-center gap-1.5 shrink-0"
                    >
                      <Save className="w-4 h-4" />
                      <span>सुरक्षित सहेजें (Save)</span>
                    </button>
                  </div>
                </div>

                {/* Kushagra Profile Edit Container */}
                <div className="bg-white border-2 border-indigo-300 rounded-[32px] p-6 shadow-md space-y-6 text-left">
                  <div className="flex items-center gap-3 border-b-2 border-indigo-250 pb-4">
                    <div className="p-2.5 bg-indigo-50 border border-indigo-300 rounded-2xl shadow-inner">
                      <User2 className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-850">श्री कुशाग्र गौर</h3>
                      <p className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-wider">सह-रचयिता एवं यूआई डेवलपर (Kushagra)</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Google Drive Photo URL */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest pl-1 block">फोटो ड्राइव कढ़ी (Google Drive / URL link):</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <Image className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          value={kushagraPhoto}
                          onChange={(e) => setKushagraPhoto(e.target.value)}
                          placeholder="यहाँ Google Drive शेयरिंग लिंक या इमेज यूआरएल पेस्ट करें"
                          className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-indigo-400 rounded-xl pl-9 pr-3 py-2 text-[11px] font-mono font-bold text-slate-800 focus:outline-none transition-all placeholder:text-slate-300 font-mono"
                        />
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold block leading-relaxed pl-1">
                        💡 Google Drive शेयर लिंक (जैसे: <code>https://drive.google.com/file/d/...</code>) अपने आप डायरेक्ट इमेज में बदल जाएगा।
                      </span>
                    </div>

                    {/* Kushagra Photo Live Preview */}
                    <div className="bg-stone-50 border border-slate-200 p-3 rounded-2xl flex items-center gap-4">
                      {kushagraPhoto ? (
                        <div className="w-16 h-16 rounded-xl shadow-md border-2 border-slate-900 bg-white overflow-hidden shrink-0">
                          <img 
                            src={getDirectImageUrl(kushagraPhoto)} 
                            alt="Preview Kushagra" 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl border border-dashed border-slate-300 bg-slate-100 flex items-center justify-center shrink-0">
                          <span className="text-[9px] text-slate-400 font-bold text-center p-1">डिफ़ॉल्ट वेक्टर सक्रिय</span>
                        </div>
                      )}
                      <div>
                        <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block">लाइव फोटो पूर्वावलोकन</span>
                        <p className="text-[10px] text-slate-600 font-bold leading-normal mt-0.5">
                          {kushagraPhoto ? "गूगल ड्राइव लिंक से फोटो सफलतापूर्वक लोड कर ली गई है।" : "कोई फोटो सेट नहीं है, कुशाग्र जी का डिफ़ॉल्ट वेक्टर दर्शाया जा रहा है।"}
                        </p>
                        {kushagraPhoto && (
                          <button
                            onClick={() => {
                              setKushagraPhoto("");
                              playSfx(400);
                            }}
                            className="text-[9px] text-red-650 hover:underline font-black mt-1 block h-fit w-fit font-mono"
                          >
                            वापस रिस्टोर करके वेक्टर लगाएं 🗑️
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Email URL */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest pl-1 block">संपर्क ईमेल (Email ID):</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <Mail className="w-4 h-4" />
                        </span>
                        <input
                          type="email"
                          value={kushagraEmail}
                          onChange={(e) => setKushagraEmail(e.target.value)}
                          placeholder="email@example.com"
                          className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-indigo-400 rounded-xl pl-9 pr-3 py-2 text-[11px] font-mono font-bold text-slate-800 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Social links details */}
                    <div className="space-y-2.5 pt-2">
                      <span className="text-[10px] text-slate-400 font-black block uppercase tracking-wider">सोशल मीडिया कड़ियाँ (Social Profiles URL):</span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* GitHub */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1"><Github className="w-3.5 h-3.5" /> GitHub:</span>
                          <input
                            type="text"
                            value={kushagraGithub}
                            onChange={(e) => setKushagraGithub(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10.5px] font-mono"
                          />
                        </div>

                        {/* LinkedIn */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1"><Linkedin className="w-3.5 h-3.5" /> LinkedIn:</span>
                          <input
                            type="text"
                            value={kushagraLinkedin}
                            onChange={(e) => setKushagraLinkedin(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10.5px] font-mono"
                          />
                        </div>

                        {/* YouTube */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1"><Youtube className="w-3.5 h-3.5" /> YouTube Channel:</span>
                          <input
                            type="text"
                            value={kushagraYoutube}
                            onChange={(e) => setKushagraYoutube(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10.5px] font-mono"
                          />
                        </div>

                        {/* Portfolio */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> Portfolio Site:</span>
                          <input
                            type="text"
                            value={kushagraPortfolio}
                            onChange={(e) => setKushagraPortfolio(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10.5px] font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Kushagra saving status */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    {kushagraSaved ? (
                      <span className="text-[10px] text-indigo-650 font-black tracking-wide animate-pulse">{kushagraSaved}</span>
                    ) : (
                      <span></span>
                    )}
                    <button
                      onClick={async () => {
                        const kp = kushagraPhoto.trim();
                        const ke = kushagraEmail.trim();
                        const kg = kushagraGithub.trim();
                        const kl = kushagraLinkedin.trim();
                        const ky = kushagraYoutube.trim();
                        const kport = kushagraPortfolio.trim();

                        localStorage.setItem("kushagra_photo", kp);
                        localStorage.setItem("kushagra_email", ke);
                        localStorage.setItem("kushagra_social_github", kg);
                        localStorage.setItem("kushagra_social_linkedin", kl);
                        localStorage.setItem("kushagra_social_youtube", ky);
                        localStorage.setItem("kushagra_social_portfolio", kport);

                        window.dispatchEvent(new Event("storage"));
                        playSfx(880, "sine", 0.2);
                        setKushagraSaved("कुशाग्र जी की प्रोफ़ाइल अद्यतन हो गई! ✅");
                        setMascotData({
                          mood: "excited",
                          text: "कुशाग्र गौर जी की प्रोफ़ाइल की सटीक जानकारी सफलतापूर्वक सहेज ली गई है! 🌟✨"
                        });

                        // Global cloud sync
                        await syncDevelopersToFirestore({
                          kushagra_photo: kp,
                          kushagra_email: ke,
                          kushagra_social_github: kg,
                          kushagra_social_linkedin: kl,
                          kushagra_social_youtube: ky,
                          kushagra_social_portfolio: kport
                        });

                        setTimeout(() => setKushagraSaved(""), 3000);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-5 py-2.5 rounded-xl border-b-2 border-indigo-850 active:border-b-0 cursor-pointer transition flex items-center gap-1.5 shrink-0"
                    >
                      <Save className="w-4 h-4" />
                      <span>सुरक्षित सहेजें (Save)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

      {/* VIRTUAL SMARTPHONE SMS PUSH BANNER (Simulates phone receiving SMS) */}
      <AnimatePresence>
        {activeSMS && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[9999] max-w-sm w-full bg-slate-900/95 text-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border-2 border-slate-700/80 backdrop-blur-md overflow-hidden p-4 font-sans text-left space-y-3"
          >
            {/* Phone Lock Screen OS Toast Style Banner Header */}
            <div className="flex items-center justify-between text-slate-400 text-[10px] pb-1.5 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <strong className="text-slate-200">सुरक्षा सन्देश (Messages Center)</strong>
              </div>
              <button 
                onClick={() => setActiveSMS(null)}
                className="hover:text-white font-black bg-slate-800 hover:bg-slate-700 w-4 h-4 rounded-full flex items-center justify-center text-[9px] cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Inner Phone Notification Layout */}
            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 rounded-full bg-linear-to-tr from-amber-500 to-rose-500 text-white font-extrabold flex items-center justify-center text-xs shrink-0 border border-slate-700 shadow-md">
                🇮🇳
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-rose-300">Samvidhan Mitra Security</span>
                  <span className="text-[9px] text-slate-500 font-mono">अभी (Just Now)</span>
                </div>
                <p className="text-[11px] font-bold text-slate-100 leading-normal font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  {activeSMS.body}
                </p>
                <span className="text-[9px] text-slate-400 block text-right">सफल वितरण: {activeSMS.to} • {activeSMS.provider}</span>
              </div>
            </div>

            {/* Progress bar countdown indicator */}
            <div className="h-1 bg-gradient-to-r from-rose-500 to-yellow-500 rounded-full w-full origin-left"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
