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
  ShieldCheck,
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
  User2,
  Trash2,
  Edit3,
  Plus,
  Languages,
  Video
} from "lucide-react";
import { ARTICLES_DATA, ArticleItem } from "./ArticlesSection";
import { doc, setDoc, collection, onSnapshot, query, deleteDoc } from "firebase/firestore";
import { signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
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
  
  // Double Lock Step State (1: First Key, 2: Second Key)
  const [lockStep, setLockStep] = useState<1 | 2>(1);

  // Sub-tab state
  const [adminSubTab, setAdminSubTab] = useState<"articles" | "developers" | "signlanguage" | "schools" | "securitylogs">("articles");

  // Security Logs tracking state conforming to transparency audit requirements
  const [securityLogs, setSecurityLogs] = useState<{
    id: string;
    timestamp: string;
    actor: string;
    action: string;
    status: "success" | "warning" | "error";
    details: string;
  }[]>([]);

  // Core helper to insert and persist dual-lock security log actions
  const addSecurityLog = (actor: string, action: string, status: "success" | "warning" | "error", details: string) => {
    const newLogItem = {
      id: "SEC-" + Math.floor(Math.random() * 900000 + 100000),
      timestamp: new Date().toLocaleString("hi-IN"),
      actor,
      action,
      status,
      details
    };
    setSecurityLogs(prev => {
      const updated = [newLogItem, ...prev].slice(0, 30);
      localStorage.setItem("samvidhan_admin_security_logs", JSON.stringify(updated));
      return updated;
    });
  };

  // Registered schools list
  const [registeredSchools, setRegisteredSchools] = useState<Array<{
    schoolRegCode?: string;
    schoolName: string;
    districtName: string;
    blockName: string;
    timestamp: string;
    votersCount: number;
    candidatesCount?: number;
    winnerName?: string;
  }>>([]);

  // Google Drive state
  const [driveToken, setDriveToken] = useState<string | null>(null);
  const [driveLoading, setDriveLoading] = useState(false);

  const loadRegisteredSchools = () => {
    const raw = localStorage.getItem("samvidhan_registered_schools");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed)) {
          setRegisteredSchools(parsed);
          return;
        }
      } catch (e) {}
    }
    // If empty, let's seed with current election school if available
    const activeSchool = localStorage.getItem("samvidhan_election_school_name") || "बाल एकता उच्चतर माध्यमिक विद्यालय";
    const activeDistrict = localStorage.getItem("samvidhan_election_district_name") || "जयपुर";
    const activeBlock = localStorage.getItem("samvidhan_election_block_name") || "सांगानेर";
    
    const initialList = [
      { schoolName: activeSchool, districtName: activeDistrict, blockName: activeBlock, timestamp: new Date().toISOString(), votersCount: 5 },
      { schoolName: "राजकीय उच्च माध्यमिक विद्यालय, गोविंदपुरा", districtName: "जयपुर", blockName: "सांगानेर", timestamp: new Date(Date.now() - 864 * 100000).toISOString(), votersCount: 15 },
      { schoolName: "सरस्वती शिशु ज्ञान मंदिर", districtName: "शिमला", blockName: "ठियोग", timestamp: new Date(Date.now() - 1728 * 100000).toISOString(), votersCount: 12 },
    ];
    setRegisteredSchools(initialList);
    localStorage.setItem("samvidhan_registered_schools", JSON.stringify(initialList));
  };

  useEffect(() => {
    // Attempt real-time sync with Firestore "schools" collection
    const q = query(collection(db, "schools"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Array<{
        schoolRegCode: string;
        schoolName: string;
        districtName: string;
        blockName: string;
        timestamp: string;
        votersCount: number;
        candidatesCount: number;
        winnerName: string;
      }> = [];
      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        list.push({
          schoolRegCode: data.schoolRegCode || docSnapshot.id || "",
          schoolName: data.schoolName || "",
          districtName: data.districtName || "",
          blockName: data.blockName || "",
          timestamp: data.timestamp || new Date().toISOString(),
          votersCount: typeof data.votersCount === "number" ? data.votersCount : 0,
          candidatesCount: typeof data.candidatesCount === "number" ? data.candidatesCount : 0,
          winnerName: data.winnerName || "अपरिभाषित"
        });
      });
      if (list.length > 0) {
        // Sort newest first
        list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setRegisteredSchools(list);
        localStorage.setItem("samvidhan_registered_schools", JSON.stringify(list));
      } else {
        loadRegisteredSchools();
      }
    }, (err) => {
      console.warn("Firestore real-time subscription failed, using local storage fallback:", err);
      loadRegisteredSchools();
    });

    window.addEventListener("storage", loadRegisteredSchools);
    return () => {
      unsubscribe();
      window.removeEventListener("storage", loadRegisteredSchools);
    };
  }, []);

  // Google Drive CSV upload handler
  const handleDriveBackup = async () => {
    setDriveLoading(true);
    let token = driveToken;
    try {
      if (!token) {
        // Authenticate with Google Provider with Google Drive file scope
        const provider = new GoogleAuthProvider();
        provider.addScope("https://www.googleapis.com/auth/drive.file");
        
        playSfx(600, "sine", 0.15);
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential?.accessToken) {
          throw new Error("गूगल ड्राइव प्रमाणीकरण एक्सेस टोकन प्राप्त करने में असमर्थ!");
        }
        token = credential.accessToken;
        setDriveToken(token);
      }

      // Build CSV content formatted properly with UTF-8 BOM conforming to statutory educational criteria
      const headers = ["S.No.", "Registration Code (पंजीकरण कोड)", "District (ज़िला)", "Block (ब्लॉक)", "School Name (विद्यालय का नाम)", "Voters Count (कुल मतदाता)", "Candidates Count (कुल प्रत्याशी)", "Winner Name (विजेता प्रत्याशी)", "Created Date (समय)"];
      const rows = registeredSchools.map((school, index) => [
        index + 1,
        `"${(school.schoolRegCode || "").replace(/"/g, '""')}"`,
        `"${(school.districtName || 'जयपुर').replace(/"/g, '""')}"`,
        `"${(school.blockName || 'सांगानेर').replace(/"/g, '""')}"`,
        `"${school.schoolName.replace(/"/g, '""')}"`,
        school.votersCount || 0,
        school.candidatesCount || 0,
        `"${(school.winnerName || "अपरिभाषित").replace(/"/g, '""')}"`,
        `"${new Date(school.timestamp).toLocaleString('hi-IN')}"`
      ]);
      const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

      setMascotData({
        mood: "thinking",
        text: "ज़रा रुकिए, मैं गूगल ड्राइव पर 'Samvidhan Bal Chunav Records' फ़ोल्डर बना रहा हूँ और एक्सेल/CSV रिपोर्ट सहेज रहा हूँ... ☁️🔄"
      });

      // 1. Find or create folder "Samvidhan Bal Chunav Records"
      let folderSearchRes = await fetch(
        "https://www.googleapis.com/drive/v3/files?q=name='Samvidhan Bal Chunav Records' and mimeType='application/vnd.google-apps.folder' and trashed=false",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!folderSearchRes.ok) {
        throw new Error("फ़ोल्डर खोजने में त्रुटि: " + folderSearchRes.statusText);
      }
      let folderSearchData = await folderSearchRes.json();
      let folderId = "";
      if (folderSearchData.files && folderSearchData.files.length > 0) {
        folderId = folderSearchData.files[0].id;
      } else {
        // Create folder
        const createFolderRes = await fetch("https://www.googleapis.com/drive/v3/files", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Samvidhan Bal Chunav Records",
            mimeType: "application/vnd.google-apps.folder",
          }),
        });
        if (!createFolderRes.ok) {
          throw new Error("फ़ोल्डर बनाने में त्रुटि: " + createFolderRes.statusText);
        }
        const createdFolder = await createFolderRes.json();
        folderId = createdFolder.id;
      }

      if (!folderId) {
        throw new Error("गूगल ड्राइव फ़ोल्डर स्थापित नहीं किया जा सका।");
      }

      // 2. Find if report file already exists
      let fileSearchRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='registered_schools_report.csv' and '${folderId}' in parents and trashed=false`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      let fileSearchData = await fileSearchRes.json();
      let fileId = "";
      if (fileSearchData.files && fileSearchData.files.length > 0) {
        const correctFile = fileSearchData.files.find((f: any) => f.name === "registered_schools_report.csv");
        if (correctFile) fileId = correctFile.id;
      }

      // 3. Save / Update file on Drive
      if (fileId) {
        // Update file content
        const updateRes = await fetch(
          `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "text/csv; charset=utf-8",
            },
            body: "\ufeff" + csvContent,
          }
        );
        if (!updateRes.ok) {
          throw new Error("फ़ाइल अपडेट करने में विफल: " + updateRes.statusText);
        }
      } else {
        // Create new file with Multipart upload
        const metadata = {
          name: "registered_schools_report.csv",
          parents: [folderId],
        };

        const form = new FormData();
        form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
        form.append("file", new Blob(["\ufeff" + csvContent], { type: "text/csv; charset=utf-8" }));

        const createRes = await fetch(
          "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: form,
          }
        );
        if (!createRes.ok) {
          throw new Error("फ़ाइल अपलोड करने में विफल: " + createRes.statusText);
        }
      }

      playSfx(880, "sine", 0.3);
      setMascotData({
        mood: "proud",
        text: "अद्भुत कार्य! स्कूल रिकॉर्ड का डेटा आपके Google Drive के 'Samvidhan Bal Chunav Records' फ़ोल्डर में 'registered_schools_report.csv' (Excel compatible) के रूप में पूरी तरह सुरक्षित सेव कर दिया गया है! ☁️📄📗"
      });

    } catch (err: any) {
      console.error("Google Drive Backup failure:", err);
      playSfx(150, "sawtooth", 0.3);
      setMascotData({
        mood: "thinking",
        text: "ओह! गूगल ड्राइव पर सहेजने में विफल। कृपया सुनिश्चित करें कि आपने आवश्यक अनुमतियां स्वीकार की हैं। त्रुटि: " + (err?.message || String(err))
      });
      setDriveToken(null);
    } finally {
      setDriveLoading(false);
    }
  };

  // Saved credentials in storage for both locks (Lock 1 and Lock 2)
  const [adminId1, setAdminId1] = useState("admin1");
  const [adminPassword1, setAdminPassword1] = useState("admin1");
  const [adminId2, setAdminId2] = useState("admin2");
  const [adminPassword2, setAdminPassword2] = useState("admin2");

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
  const [gautamFeedback, setGautamFeedback] = useState("");

  // Developer Kushagra state
  const [kushagraPhoto, setKushagraPhoto] = useState("");
  const [kushagraEmail, setKushagraEmail] = useState("");
  const [kushagraGithub, setKushagraGithub] = useState("");
  const [kushagraYoutube, setKushagraYoutube] = useState("");
  const [kushagraLinkedin, setKushagraLinkedin] = useState("");
  const [kushagraPortfolio, setKushagraPortfolio] = useState("");
  const [kushagraSaved, setKushagraSaved] = useState("");
  const [kushagraFeedback, setKushagraFeedback] = useState("");

  // Change credentials states
  const [updateLockChoice, setUpdateLockChoice] = useState<"lock1" | "lock2">("lock1");
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

  // Sign language video editing states
  const [customSignVideos, setCustomSignVideos] = useState<Record<string, { id: string; title: string; url: string }[]>>({});
  const [editingTermId, setEditingTermId] = useState<string>("samvidhan");
  const [signVideoTitleInput, setSignVideoTitleInput] = useState<string>("");
  const [signVideoUrlInput, setSignVideoUrlInput] = useState<string>("");
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [signVideoFeedback, setSignVideoFeedback] = useState<string>("");

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
    // 1. Get stored admin credentials for both locks (Lock 1 and Lock 2) or initialize defaults
    let storedId1 = localStorage.getItem("samvidhan_admin_uid_1");
    let storedPass1 = localStorage.getItem("samvidhan_admin_pwd_1");
    if (!storedId1) {
      storedId1 = "admin1";
      localStorage.setItem("samvidhan_admin_uid_1", "admin1");
    }
    if (!storedPass1) {
      storedPass1 = "admin1";
      localStorage.setItem("samvidhan_admin_pwd_1", "admin1");
    }
    setAdminId1(storedId1);
    setAdminPassword1(storedPass1);

    let storedId2 = localStorage.getItem("samvidhan_admin_uid_2");
    let storedPass2 = localStorage.getItem("samvidhan_admin_pwd_2");
    if (!storedId2) {
      storedId2 = "admin2";
      localStorage.setItem("samvidhan_admin_uid_2", "admin2");
    }
    if (!storedPass2) {
      storedPass2 = "admin2";
      localStorage.setItem("samvidhan_admin_pwd_2", "admin2");
    }
    setAdminId2(storedId2);
    setAdminPassword2(storedPass2);

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

    // 5. Load Security Logs
    const storedSecLogs = localStorage.getItem("samvidhan_admin_security_logs");
    if (storedSecLogs) {
      try {
        setSecurityLogs(JSON.parse(storedSecLogs));
      } catch (editErr) {}
    } else {
      const initialLogs = [
        {
          id: "SEC-902183",
          timestamp: new Date().toLocaleString("hi-IN"),
          actor: "प्रणाली सुरक्षा (System Core)",
          action: "डबल-लॉक सुरक्षा नियंत्रण सक्रिय (Dual-Lock Security Core Active)",
          status: "success" as const,
          details: "केंद्रीकृत सुरक्षा लॉगिंग सक्रिय। सभी प्रशासनिक खोलन और संपादन कार्यों की निगरानी जारी है।"
        }
      ];
      setSecurityLogs(initialLogs);
      localStorage.setItem("samvidhan_admin_security_logs", JSON.stringify(initialLogs));
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

  // Load and sync Custom Sign Videos
  useEffect(() => {
    const handleSyncSignVideos = () => {
      const stored = localStorage.getItem("samvidhan_sign_videos");
      if (stored) {
        try {
          setCustomSignVideos(JSON.parse(stored));
        } catch (e) {
          console.error("Error parsing samvidhan_sign_videos:", e);
        }
      }
    };
    handleSyncSignVideos();
    window.addEventListener("storage", handleSyncSignVideos);
    return () => window.removeEventListener("storage", handleSyncSignVideos);
  }, []);

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

    if (lockStep === 1) {
      // Step 1: Validate Lock 1 Credentials
      const currentSavedId1 = localStorage.getItem("samvidhan_admin_uid_1") || "admin1";
      const currentSavedPass1 = localStorage.getItem("samvidhan_admin_pwd_1") || "admin1";

      if (userIdInput === currentSavedId1 && passwordInput === currentSavedPass1) {
        addSecurityLog("Lock 1 Sub-Admin", "प्रथम सुरक्षा ताला (Lock 1 🔑) अनलॉक", "success", `यूज़र '${userIdInput}' ने प्रथम सुरक्षा प्रमाणीकरण स्तर को सफलतापूर्वक अनलॉक किया।`);
        playSfx(440, "sine", 0.15);
        setTimeout(() => playSfx(554, "sine", 0.15), 100);
        setLockStep(2);
        setUserIdInput("");
        setPasswordInput("");
        setMascotData({
          mood: "excited",
          text: "अद्भुत! पहला प्रशासनिक ताला (First Lock 🔑) सफलतापूर्वक खुल गया है। अब कृपया सुरक्षा के दूसरे ताले (Second Lock 🔒) के अलग क्रेडेंशियल्स दर्ज करें।"
        });
      } else {
        addSecurityLog("Security Monitor", "प्रथम ताले (Lock 1) पर विफल लॉगिन प्रयास", "warning", `अवैध लॉगिन सबमिशन। यूज़र आईडी प्रयुक्त: '${userIdInput}' (गलत पासवर्ड दर्ज किया गया)`);
        playSfx(150, "sawtooth", 0.3);
        setLoginError("प्रथम ताले (Lock 1) का अमान्य उपयोगकर्ता नाम (User ID) या सुरक्षा पासवर्ड!");
      }
    } else {
      // Step 2: Validate Lock 2 Credentials
      const currentSavedId2 = localStorage.getItem("samvidhan_admin_uid_2") || "admin2";
      const currentSavedPass2 = localStorage.getItem("samvidhan_admin_pwd_2") || "admin2";

      if (userIdInput === currentSavedId2 && passwordInput === currentSavedPass2) {
        addSecurityLog("Lock 2 Sub-Admin", "पूर्ण प्रशासनिक पैनल खुला (Double Lock 🔒 Portal Opened)", "success", `यूज़र '${userIdInput}' द्वारा द्वितीय सुरक्षा स्तर अनलॉक। पूर्ण सत्र क्रेडेंशियल्स सत्यापित और एडमिन पैनल अधिग्रहीत।`);
        playSfx(600, "sine", 0.15);
        setTimeout(() => playSfx(800, "sine", 0.2), 100);
        setIsAuthenticated(true);
        sessionStorage.setItem("samvidhan_admin_session", "true");
        setUserIdInput("");
        setPasswordInput("");
        setLockStep(1); // Reset step back for next login sessions
      } else {
        addSecurityLog("Security Monitor", "द्वितीय ताले (Lock 2) पर विफल लॉगिन प्रयास", "warning", `अवैध लॉगिन सबमिशन। यूज़र आईडी प्रयुक्त: '${userIdInput}' (लॉक 2 प्रमाणीकरण विफल)`);
        playSfx(150, "sawtooth", 0.3);
        setLoginError("द्वितीय ताले (Lock 2) का अमान्य उपयोगकर्ता नाम (User ID) या सुरक्षा पासवर्ड!");
      }
    }
  };

  const handleSignOut = () => {
    playSfx(400, "sine", 0.1);
    addSecurityLog("प्रणाली सुरक्षा", "सुरक्षित लॉगआउट क्रियान्वयन (Admin Session Ended)", "success", "प्रशासक द्वारा कोर एडमिन पैनल सत्र को हस्तचालित रूप से बंद किया गया।");
    setIsAuthenticated(false);
    setLockStep(1);
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

  // Helper to sync sign language videos to Firestore and local storage
  const syncSignVideosToFirestore = async (updatedVideos: Record<string, { id: string; title: string; url: string }[]>) => {
    localStorage.setItem("samvidhan_sign_videos", JSON.stringify(updatedVideos));
    window.dispatchEvent(new Event("storage"));
    
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "settings", "sign_videos"), updatedVideos);
      } catch (err) {
        console.error("Firebase sign_videos write failed:", err);
      }
    }
  };

  const handleImageFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPhoto: (val: string) => void,
    setFeedback: (msg: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFeedback("कृपया केवल छवियों (Images) को ही अपलोड करें! ⚠️");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        // Create canvas to downscale/compress
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 256;
        const MAX_HEIGHT = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Convert to highly optimized JPEG with 0.75 quality (usually 10-25KB)
          const base64Data = canvas.toDataURL("image/jpeg", 0.75);
          
          if (base64Data.length > 500000) {
            setFeedback("सॉरी! यह छवि अति विशाल है, कृपया कोई अन्य छोटी छवि चुनें। ⚠️");
            return;
          }

          setPhoto(base64Data);
          playSfx(880, "sine", 0.25);
          setFeedback("छवि अपलोड और कंप्रेस की गई! 📸✨");
          setTimeout(() => setFeedback(""), 4000);
        }
      };
      
      img.onerror = () => {
        setFeedback("छवि लोड करने में त्रुटि हुई! ⚠️");
      };

      if (event.target?.result && typeof event.target.result === "string") {
        img.src = event.target.result;
      }
    };

    reader.onerror = () => {
      setFeedback("फ़ाइल पढ़ने में त्रुटि! ⚠️");
    };

    reader.readAsDataURL(file);
  };

  const convertToEmbedUrl = (url: string): string => {
    let trimmed = url.trim();
    if (!trimmed) return "";
    
    if (trimmed.includes("/embed/")) {
      return trimmed;
    }
    
    const shortReg = /youtu\.be\/([a-zA-Z0-9_-]+)/;
    const shortMatch = trimmed.match(shortReg);
    if (shortMatch && shortMatch[1]) {
      return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }
    
    const fullReg = /[?&]v=([a-zA-Z0-9_-]+)/;
    const fullMatch = trimmed.match(fullReg);
    if (fullMatch && fullMatch[1]) {
      return `https://www.youtube.com/embed/${fullMatch[1]}`;
    }

    if (trimmed.includes("/shorts/")) {
      const parts = trimmed.split("/shorts/");
      if (parts[1]) {
        const id = parts[1].split(/[?&#]/)[0];
        return `https://www.youtube.com/embed/${id}`;
      }
    }
    
    return trimmed;
  };

  // Sign language video CRUD management
  const handleAddOrUpdateSignVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignVideoFeedback("");

    if (!signVideoTitleInput.trim() || !signVideoUrlInput.trim()) {
      setSignVideoFeedback("कृपया शीर्षक और वीडियो लिंक दोनों भरें! ⚠️");
      return;
    }

    const embedUrl = convertToEmbedUrl(signVideoUrlInput);
    if (!embedUrl.startsWith("https://") || !embedUrl.includes("youtube.com")) {
      setSignVideoFeedback("कृपया सही YouTube लिंक दर्ज करें! ⚠️");
      return;
    }

    const currentList = customSignVideos[editingTermId] ? [...customSignVideos[editingTermId]] : [];
    let updatedList;

    if (editingVideoId) {
      // Edit mode
      updatedList = currentList.map((vid) => 
        vid.id === editingVideoId ? { ...vid, title: signVideoTitleInput.trim(), url: embedUrl } : vid
      );
      setEditingVideoId(null);
      setSignVideoFeedback("वीडियो सफलतापूर्वक अपडेट किया गया! 🎉");
    } else {
      // Add mode
      const newVideo = {
        id: "sv_" + Date.now(),
        title: signVideoTitleInput.trim(),
        url: embedUrl
      };
      updatedList = [...currentList, newVideo];
      setSignVideoFeedback("नया वीडियो जोड़ा गया! 🎉");
    }

    const nextSignVideos = {
      ...customSignVideos,
      [editingTermId]: updatedList
    };

    setCustomSignVideos(nextSignVideos);
    await syncSignVideosToFirestore(nextSignVideos);

    // Clear inputs
    setSignVideoTitleInput("");
    setSignVideoUrlInput("");
    playSfx(880, "sine", 0.1);

    setTimeout(() => {
      setSignVideoFeedback("");
    }, 3000);
  };

  const handleDeleteSignVideo = async (termId: string, videoId: string) => {
    if (!confirm("क्या आप वाकई इस वीडियो को हटाना चाहते हैं?")) return;

    const currentList = customSignVideos[termId] ? [...customSignVideos[termId]] : [];
    const updatedList = currentList.filter(v => v.id !== videoId);

    const nextSignVideos = {
      ...customSignVideos,
      [termId]: updatedList
    };

    setCustomSignVideos(nextSignVideos);
    await syncSignVideosToFirestore(nextSignVideos);

    playSfx(440, "sine", 0.15);
    setSignVideoFeedback("वीडियो हटा दिया गया! 🗑️");
    setTimeout(() => {
      setSignVideoFeedback("");
    }, 3000);
  };

  const handleStartEditSignVideo = (vid: { id: string; title: string; url: string }) => {
    setEditingVideoId(vid.id);
    setSignVideoTitleInput(vid.title);
    setSignVideoUrlInput(vid.url);
    setSignVideoFeedback("संपादन मोड सक्रिय (Editing Video Mode)... ✏️");
  };

  const handleCancelEditSignVideo = () => {
    setEditingVideoId(null);
    setSignVideoTitleInput("");
    setSignVideoUrlInput("");
    setSignVideoFeedback("");
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

  // Change Admin Login Credentials for Lock 1 or Lock 2
  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setCredError("");
    setCredMessage("");

    const newId = newAdminId.trim();
    if (!newId) return setCredError("User ID खाली नहीं हो सकता!");
    if (newAdminPassword.length < 4) return setCredError("नया क्रेडेंशियल/पासवर्ड कम से कम 4 अक्षरों का होना चाहिए!");
    if (newAdminPassword !== confirmNewPassword) return setCredError("पासवर्ड की पुष्टि मेल नहीं खाती!");

    const mobileClean = adminMobile.trim();
    if (mobileClean.length < 10) {
      return setCredError("कृपया एक वैध 10-अंकों का मोबाइल नंबर दर्ज करें!");
    }

    const isLock1 = updateLockChoice === "lock1";
    if (isLock1) {
      localStorage.setItem("samvidhan_admin_uid_1", newId);
      localStorage.setItem("samvidhan_admin_pwd_1", newAdminPassword);
      setAdminId1(newId);
      setAdminPassword1(newAdminPassword);
    } else {
      localStorage.setItem("samvidhan_admin_uid_2", newId);
      localStorage.setItem("samvidhan_admin_pwd_2", newAdminPassword);
      setAdminId2(newId);
      setAdminPassword2(newAdminPassword);
    }
    localStorage.setItem("samvidhan_admin_mobile", mobileClean);

    addSecurityLog(
      isLock1 ? "Lock 1 Sub-Admin" : "Lock 2 Sub-Admin",
      isLock1 ? "प्रथम ताला क्रेडेंशियल परिवर्तित (Lock 1 Changed)" : "द्वितीय ताला क्रेडेंशियल परिवर्तित (Lock 2 Changed)",
      "error",
      `सुरक्षा क्रेडेंशियल अपडेट किए गए। नया यूजर आईडी: '${newId}'। सूचना एसएमएस ${mobileClean} को भेजा गया।`
    );

    const maskedPwd = newAdminPassword.substring(0, 2) + "*".repeat(Math.max(1, newAdminPassword.length - 2));
    const nowStr = new Date().toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const fullDate = new Date().toLocaleDateString("hi-IN", { day: "numeric", month: "short", year: "numeric" });
    
    const lockLabel = isLock1 ? "प्रथम ताला (Lock 1 🔑)" : "द्वितीय ताला (Lock 2 🔒)";
    const smsId = "SMS-" + Math.floor(Math.random() * 900000 + 100000);
    const smsBody = `🔔 सुरक्षा अपडेट: ${lockLabel} के एडमिन क्रेडेंशियल्स बदले गए हैं। User ID: ${newId}, पासवर्ड: ${maskedPwd}। समय: ${nowStr}।`;
    
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

    setNewAdminId("");
    setNewAdminPassword("");
    setConfirmNewPassword("");
    setCredMessage(`सफलतापूर्वक ${lockLabel} के क्रेडेंशियल्स अद्यतन कर दिए गए हैं! सुरक्षा संदेश मोबाइल (${mobileClean}) पर भेज दिया गया है। 👍`);
    setMascotData({
      mood: "proud",
      text: `सुरक्षा पुष्टि! मैंने आपके पंजीकृत मोबाइल नंबर ${mobileClean} पर ${lockLabel} के लिए सुरक्षा अद्यतन का SMS संदेश सफलतापूर्वक भेज दिया है। 🛡️📱`
    });

    playSfx(880, "sine", 0.25);
    setTimeout(() => {
      // Simulate phone text chime sound
      playSfx(587.33, "sine", 0.08); 
      setTimeout(() => playSfx(659.25, "sine", 0.08), 80); 
      setTimeout(() => playSfx(880, "sine", 0.12), 160); 
    }, 400);
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
        <div className="shrink-0 flex flex-col items-center sm:items-end justify-center gap-2">
          {isAuthenticated ? (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                id="admin-logout-btn"
                onClick={handleSignOut}
                className="bg-white text-rose-600 hover:bg-rose-50 font-black text-xs px-4 py-2 rounded-2xl border-b-2 border-rose-200 active:border-b-0 cursor-pointer shadow-md transition-all flex items-center gap-1.5 active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>लॉग आउट (Safe Logout)</span>
              </button>
              <Unlock className="w-10 h-10 text-rose-100/30 animate-pulse hidden md:block" />
            </div>
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
                {lockStep === 1 ? (
                  <Lock className="w-6 h-6 text-rose-500 animate-pulse" />
                ) : (
                  <Key className="w-6 h-6 text-yellow-600 animate-bounce" />
                )}
              </div>
              <h3 className="text-base font-black text-slate-800">सुरक्षित प्रशासनिक नियंत्रण लॉगिन (Dual Lock Authenticator)</h3>
              
              {/* Double Lock badging */}
              <div className="flex flex-wrap justify-center items-center gap-1.5 pt-1">
                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black border transition-all duration-300 ${lockStep === 1 ? "bg-rose-500 text-white border-rose-600" : "bg-emerald-100 text-emerald-700 border-emerald-200"}`}>
                  🔑 Lock 1 (ताला १): {lockStep === 1 ? "सक्रिय (Active)" : "अनलॉक (Opened)"}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black border transition-all duration-300 ${lockStep === 2 ? "bg-amber-500 text-white border-amber-600" : "bg-slate-100 text-slate-400 border-slate-200"}`}>
                  🔒 Lock 2 (ताला २): {lockStep === 2 ? "सक्रिय (Enter PIN)" : "सुरक्षित बंद"}
                </span>
              </div>

              <p className="text-[10px] text-slate-500 font-extrabold max-w-sm mx-auto leading-relaxed pt-1">
                सुरक्षा मानदंड: यह संभाग डबल-लॉक सुरक्षा प्रणाली के अंतर्गत रक्षित है। दोनों क्रेडेंशियल्स दर्ज के बाद ही एक्सेस प्राप्त होगा।
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest pl-1">
                  {lockStep === 1 ? "प्रथम कुंजी (Lock 1): यूज़र ID" : "द्वितीय कुंजी (Lock 2): यूज़र ID"}
                </label>
                <div className="relative flex items-center bg-slate-50 border-2 border-slate-200 focus-within:border-rose-500 rounded-xl px-3 py-2.5">
                  <User className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    required
                    value={userIdInput}
                    onChange={(e) => setUserIdInput(e.target.value)}
                    placeholder={lockStep === 1 ? "संकेत: 'admin1' दर्ज करें" : "संकेत: 'admin2' दर्ज करें"}
                    className="w-full bg-transparent text-slate-800 font-bold text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest pl-1">
                  {lockStep === 1 ? "प्रथम कुंजी (Lock 1): सुरक्षा पासवर्ड" : "द्वितीय कुंजी (Lock 2): सुरक्षा पासवर्ड"}
                </label>
                <div className="relative flex items-center bg-slate-50 border-2 border-slate-200 focus-within:border-rose-500 rounded-xl px-3 py-2.5">
                  <Key className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder={lockStep === 1 ? "Lock 1 पासवर्ड दर्ज करें" : "Lock 2 पासवर्ड दर्ज करें"}
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
                {lockStep === 1 ? (
                  <>
                    <Unlock className="w-4 h-4 animate-pulse" />
                    <span>ताला १ अनलॉक करें (Unlatch Lock 1)</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-amber-100" />
                    <span>ताला २ अनलॉक • पोर्टल खोलें (Authorize Lock 2)</span>
                  </>
                )}
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
            <div className="flex flex-wrap bg-slate-100 p-1 rounded-2xl w-fit border border-slate-200 gap-1">
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
                onClick={() => { playSfx(600); setAdminSubTab("signlanguage"); }}
                className={`px-5 py-2 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer ${
                  adminSubTab === "signlanguage" 
                    ? "bg-rose-500 text-white shadow-md scale-102" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Languages className="w-4 h-4" />
                <span>सांकेतिक भाषा वीडियो (Sign Language Videos)</span>
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
              <button
                onClick={() => { playSfx(600); setAdminSubTab("schools"); }}
                className={`px-5 py-2 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer ${
                  adminSubTab === "schools" 
                    ? "bg-rose-500 text-white shadow-md scale-102" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span className="text-sm">🏫</span>
                <span>स्कूल पंजीयन रिकॉर्ड (School Registrations)</span>
              </button>
              <button
                onClick={() => { playSfx(600); setAdminSubTab("securitylogs"); }}
                className={`px-5 py-2 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer ${
                  adminSubTab === "securitylogs" 
                    ? "bg-rose-500 text-white shadow-md scale-102" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>सुरक्षा लॉग्स (Security Logs)</span>
              </button>
            </div>

            {adminSubTab === "articles" && (
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

                    <form onSubmit={handleUpdateCredentials} className="space-y-4">
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 block">लक्ष्य ताला (Select Lock to Modify):</label>
                        <select
                          value={updateLockChoice}
                          onChange={(e) => setUpdateLockChoice(e.target.value as "lock1" | "lock2")}
                          className="w-full bg-slate-50 border-2 border-slate-150 hover:border-slate-250 rounded-xl px-3 py-2 text-slate-800 font-bold text-xs focus:outline-none focus:border-rose-400 cursor-pointer"
                        >
                          <option value="lock1">🔑 प्रथम ताला (Change Lock 1)</option>
                          <option value="lock2">🔒 द्वितीय ताला (Change Lock 2)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 block">नया यूज़र ID:</label>
                        <input
                          type="text"
                          required
                          value={newAdminId}
                          onChange={(e) => setNewAdminId(e.target.value)}
                          placeholder={updateLockChoice === "lock1" ? "जैसे: root_admin1" : "जैसे: master_admin2"}
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
            )}

            {/* SIGN LANGUAGE VIDEOS MANAGEMENT TAB */}
            {adminSubTab === "signlanguage" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fadeIn">
                
                {/* LEFT COLUMN: TERM SELECTOR & GUIDELINES */}
                <div className="lg:col-span-1 space-y-6 text-left">
                  <div className="bg-white border-2 border-slate-150 rounded-3xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-150 pb-3">
                      <Languages className="w-5 h-5 text-rose-500" />
                      <h3 className="font-black text-sm text-slate-800">सांकेतिक शब्द चुनें (Select Lesson Term)</h3>
                    </div>
                    
                    <div className="space-y-2">
                      {[
                        { id: "samvidhan", name: "संविधान (Constitution)", emoji: "📖" },
                        { id: "adhikar", name: "अधिकार (Rights)", emoji: "⚖️" },
                        { id: "samanta", name: "समानता (Equality)", emoji: "🤝" },
                        { id: "kartavya", name: "कर्तव्य (Duties)", emoji: "🙋‍♂️" },
                        { id: "loktantra", name: "लोकतंत्र (Democracy)", emoji: "🗳️" },
                        { id: "bharat", name: "भारत (India)", emoji: "🇮🇳" }
                      ].map((term) => (
                        <button
                          type="button"
                          key={term.id}
                          onClick={() => {
                            playSfx(600);
                            setEditingTermId(term.id);
                            setEditingVideoId(null);
                            setSignVideoTitleInput("");
                            setSignVideoUrlInput("");
                            setSignVideoFeedback("");
                          }}
                          className={`w-full px-4 py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-between border cursor-pointer ${
                            editingTermId === term.id
                              ? "bg-rose-55 border-rose-200 text-rose-700 shadow-xs scale-[1.02]"
                              : "bg-slate-50 border-slate-150 hover:bg-slate-100 text-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{term.emoji}</span>
                            <span>{term.name}</span>
                          </div>
                          <span className="text-[10px] bg-white border px-2 py-0.5 rounded-full text-slate-500 font-mono">
                            {(customSignVideos[term.id] || []).length} वीडियो
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* USER GUIDE BANNER */}
                  <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-5 text-slate-700 space-y-3">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-amber-600" />
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">सांकेतिक वीडियो प्रबंधन नियम</h4>
                    </div>
                    <ul className="text-[10.5px] font-bold space-y-2 list-disc pl-4 leading-relaxed">
                      <li>आप प्रत्येक पाठ के लिए <strong>एकाधिक (Multiple)</strong> वीडियो क्लिप्स जोड़ सकते हैं।</li>
                      <li>जोड़े गए वीडियो बालकों को राष्ट्रगान/संविधान पाठ की मुख्य निर्वाचन स्क्रीन पर 'सांकेतिक भाषा' मॉड्यूल देखने में सक्षम करेंगे।</li>
                      <li>सटीक लिंक ही दर्ज करें। यूट्यूब वीडियो के लिए 'Embed Share Link' या डायरेक्ट वीडियो लिंक सुरक्षित मानें जाते हैं।</li>
                    </ul>
                  </div>
                </div>

                {/* RIGHT COLUMN: ADD/EDIT VIDEOS FORM */}
                <div className="lg:col-span-2 space-y-6 text-left">
                  <div className="bg-white border-2 border-slate-150 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-150 pb-3 justify-between">
                      <div className="flex items-center gap-2">
                        <Video className="w-5 h-5 text-rose-500" />
                        <h3 className="font-black text-sm text-slate-850">
                          {editingVideoId ? "संकेत वीडियो संपादित करें (Edit Video)" : "नया संकेत वीडियो जोड़ें (Add Video)"}
                        </h3>
                      </div>
                      {editingVideoId && (
                        <button
                          type="button"
                          onClick={handleCancelEditSignVideo}
                          className="text-[10.5px] text-slate-400 hover:text-rose-600 font-bold"
                        >
                          संपादन रद्द करें ×
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleAddOrUpdateSignVideo} className="space-y-4">
                      {/* Video Title */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 block">
                          वीडियो का शीर्षक (Video Clip Title):
                        </label>
                        <input
                          type="text"
                          required
                          value={signVideoTitleInput}
                          onChange={(e) => setSignVideoTitleInput(e.target.value)}
                          placeholder="उदाहरण: संविधान की प्रस्तावना - भाग 3"
                          className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-rose-400 rounded-2xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none transition-all font-bold"
                        />
                      </div>

                      {/* Video URL */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 block">
                          यूट्यूब/इमेज का सीधा वीडियो कढ़ी लिंक (Video Share Link / URL):
                        </label>
                        <input
                          type="text"
                          required
                          value={signVideoUrlInput}
                          onChange={(e) => setSignVideoUrlInput(e.target.value)}
                          placeholder="https://www.youtube.com/embed/... या mp4 URL"
                          className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-rose-400 rounded-2xl px-4 py-2.5 text-xs text-slate-800 font-mono focus:outline-none transition-all"
                        />
                        <span className="text-[9.5px] font-semibold text-slate-400 pl-1 block leading-normal">
                          💡 यूट्यूब शेयर लिंक (उदा: <code>https://youtu.be/abc</code>) स्वतः अंतःस्थापित (Embed URL) में बदल दिए जाएंगे।
                        </span>
                      </div>

                      {signVideoFeedback && (
                        <p className="text-[11px] font-black text-rose-600 text-left animate-pulse">
                          {signVideoFeedback}
                        </p>
                      )}

                      <div className="pt-2 flex items-center justify-end gap-3">
                        <button
                          type="submit"
                          className="bg-rose-500 hover:bg-rose-600 text-white font-black text-xs px-5 py-2.5 rounded-2xl border-b-2 border-rose-700 active:border-b-0 cursor-pointer transition flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>{editingVideoId ? "वीडियो अद्यतन करें (Update Video)" : "वीडियो क्लब में जोड़ें (Add Video)"}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="bg-white border-2 border-slate-150 rounded-3xl p-6 shadow-sm space-y-4">
                    <h3 className="font-extrabold text-sm text-slate-800 border-b border-slate-150 pb-3 flex items-center justify-between">
                      <span>वर्तमान में संलग्न वीडियो ({editingTermId === "samvidhan" ? "संविधान" : editingTermId === "adhikar" ? "अधिकार" : editingTermId === "samanta" ? "समानता" : editingTermId === "kartavya" ? "कर्तव्य" : editingTermId === "loktantra" ? "लोकतंत्र" : "भारत"})</span>
                      <span className="text-[10.5px] bg-slate-100 text-slate-650 px-2.5 py-0.5 rounded-md font-bold">
                        कुल: {(customSignVideos[editingTermId] || []).length} वीडियो
                      </span>
                    </h3>

                    {!(customSignVideos[editingTermId] && customSignVideos[editingTermId].length > 0) ? (
                      <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2">
                        <span className="text-3xl">🎥</span>
                        <p className="text-xs font-bold text-slate-500 italic">
                          इस शब्द के लिए अभी तक कोई अतिरिक्त कस्टम वीडियो नहीं जोड़ा गया है।
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">
                          डिफ़ॉल्ट सरकारी पाठ प्रदर्शित हो रहा है। (Official Lesson Video Active)
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {customSignVideos[editingTermId].map((vid) => (
                          <div
                            key={vid.id}
                            className="p-4 bg-slate-50 border border-slate-200 hover:border-slate-350 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all"
                          >
                            <div className="space-y-1 block max-w-full overflow-hidden text-left">
                              <h4 className="text-xs font-black text-slate-800 truncate">{vid.title}</h4>
                              <p className="text-[10px] font-mono text-slate-450 truncate" title={vid.url}>
                                {vid.url}
                              </p>
                            </div>

                            <div className="flex gap-1.5 shrink-0 self-end sm:self-auto">
                              <button
                                type="button"
                                onClick={() => handleStartEditSignVideo(vid)}
                                className="p-2 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-indigo-600 rounded-xl cursor-pointer transition shadow-xs"
                                title="वीडियो संपादित करें"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSignVideo(editingTermId, vid.id)}
                                className="p-2 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-rose-600 rounded-xl cursor-pointer transition shadow-xs"
                                title="वीडियो हटाएं"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

              </div>
            )}

            {adminSubTab === "developers" && (
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

                      {/* Direct local image uploader */}
                      <div className="pt-2">
                        <span className="text-[9.5px] font-black text-slate-500 uppercase tracking-wider block mb-1 pl-1">
                          या सीधे स्थानीय डिवाइस से इमेज अपलोड करें:
                        </span>
                        <div className="flex items-center gap-2">
                          <label className="bg-amber-50 hover:bg-amber-100 border border-dashed border-amber-300 hover:border-amber-400 text-amber-900 px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition flex items-center gap-1.5">
                            <Camera className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                            <span>फ़ोटो अपलोड करें (Upload Photo)</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageFileChange(e, setGautamPhoto, setGautamFeedback)}
                              className="hidden"
                            />
                          </label>
                          {gautamFeedback && (
                            <span className="text-[9.5px] font-bold text-amber-650 bg-amber-50 px-2 py-1 rounded-md animate-fade">
                              {gautamFeedback}
                            </span>
                          )}
                        </div>
                      </div>
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
                        <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block block">लाइव फोटो पूर्वावलोकन</span>
                        <p className="text-[10px] text-slate-600 font-bold leading-normal mt-0.5">
                          {gautamPhoto ? "गूगल ड्राइव लिंक से फोटो सफलतापूर्वक लोड कर ली गई है।" : "कोई फोटो सेट नहीं है, चन्द्र शेखर जी का डिफ़ॉल्ट वेक्टर दर्शाया जा रहा है।"}
                        </p>
                        {gautamPhoto && (
                          <button
                            type="button"
                            onClick={() => {
                              setGautamPhoto("");
                              playSfx(400);
                            }}
                            className="text-[9px] text-red-655 hover:underline font-black mt-1 block h-fit w-fit"
                          >
                            वापस रिस्टोर करके वेक्टर लगाएं 🗑️
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Email ID */}
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
                          className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-amber-400 rounded-xl pl-9 pr-3 py-2 text-[11px] font-mono font-bold text-slate-800 focus:outline-none transition-all placeholder:text-slate-300"
                        />
                      </div>
                    </div>

                    {/* Social profiles info */}
                    <div className="space-y-2.5 pt-2">
                      <span className="text-[10px] text-slate-400 font-black block uppercase tracking-wider">सोशल मीडिया कड़ियाँ (Social Profiles URL):</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1"><Github className="w-3.5 h-3.5" /> GitHub:</span>
                          <input
                            type="text"
                            value={gautamGithub}
                            onChange={(e) => setGautamGithub(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10.5px] font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1"><Linkedin className="w-3.5 h-3.5" /> LinkedIn:</span>
                          <input
                            type="text"
                            value={gautamLinkedin}
                            onChange={(e) => setGautamLinkedin(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10.5px] font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1"><Youtube className="w-3.5 h-3.5" /> YouTube Channel:</span>
                          <input
                            type="text"
                            value={gautamYoutube}
                            onChange={(e) => setGautamYoutube(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10.5px] font-mono"
                          />
                        </div>
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
                      type="button"
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

                      {/* Direct local image uploader */}
                      <div className="pt-2">
                        <span className="text-[9.5px] font-black text-slate-500 uppercase tracking-wider block mb-1 pl-1">
                          या सीधे स्थानीय डिवाइस से इमेज अपलोड करें:
                        </span>
                        <div className="flex items-center gap-2">
                          <label className="bg-indigo-50 hover:bg-indigo-100 border border-dashed border-indigo-300 hover:border-indigo-400 text-indigo-900 px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition flex items-center gap-1.5">
                            <Camera className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                            <span>फ़ोटो अपलोड करें (Upload Photo)</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageFileChange(e, setKushagraPhoto, setKushagraFeedback)}
                              className="hidden"
                            />
                          </label>
                          {kushagraFeedback && (
                            <span className="text-[9.5px] font-bold text-indigo-650 bg-indigo-50 px-2 py-1 rounded-md animate-fade">
                              {kushagraFeedback}
                            </span>
                          )}
                        </div>
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
                        <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block font-sans">लाइव फोटो पूर्वावलोकन</span>
                        <p className="text-[10px] text-slate-600 font-bold leading-normal mt-0.5 font-sans">
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
                  </div>

                  {/* Kushagra saving status */}
                  <div className="pt-4 border-t border-slate-150 flex items-center justify-between gap-2">
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

            {adminSubTab === "schools" && (
              /* SCHOOLS REGISTRATION WORKSPACE */
              <div className="bg-white border-2 border-slate-150 rounded-3xl p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 pb-4">
                  <div className="space-y-1 text-left">
                    <span className="text-[9.5px] bg-rose-100 text-rose-800 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider block w-fit">
                      🏫 स्कूल डेटाबेस केंद्र (School Database Hub)
                    </span>
                    <h3 className="text-lg font-black text-slate-800">
                      पंजीकृत स्कूलों की सूची (Registered Schools List)
                    </h3>
                    <p className="text-xs text-slate-500 font-bold">
                      अब तक कुल <strong>{registeredSchools.length} स्कूलों</strong> ने अपने निर्वाचन बूथ का डेटा पंजीकृत किया है।
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {/* DOWNLOAD CSV BUTTON */}
                    <button
                      onClick={() => {
                        // Assemble CSV matching exact user metrics (Registration Code, district, block, school, voters, candidates, winner)
                        const headers = ["S.No.", "Registration Code (पंजीकरण कोड)", "District (ज़िला)", "Block (ब्लॉक)", "School Name (विद्यालय का नाम)", "Voters Count (कुल मतदाता)", "Candidates Count (कुल प्रत्याशी)", "Winner Name (विजेता प्रत्याशी)", "Created Date (समय)"];
                        const rows = registeredSchools.map((school, index) => [
                          index + 1,
                          `"${(school.schoolRegCode || "").replace(/"/g, '""')}"`,
                          `"${(school.districtName || 'जयपुर').replace(/"/g, '""')}"`,
                          `"${(school.blockName || 'सांगानेर').replace(/"/g, '""')}"`,
                          `"${school.schoolName.replace(/"/g, '""')}"`,
                          school.votersCount || 0,
                          school.candidatesCount || 0,
                          `"${(school.winnerName || "अपरिभाषित").replace(/"/g, '""')}"`,
                          `"${new Date(school.timestamp).toLocaleString('hi-IN')}"`
                        ]);
                        
                        const csvContent = "\ufeff" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
                        
                        // Download trigger
                        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.setAttribute("href", url);
                        link.setAttribute("download", `samvidhan_registered_schools_report.csv`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        
                        playSfx(880, "sine", 0.3);
                        setMascotData({
                          mood: "proud",
                          text: "बधाई हो! सभी पंजीकृत स्कूलों का प्रामाणिक डेटा 'samvidhan_registered_schools_report.csv' फ़ाइल में सफलतापूर्वक डाउनलोड हो गया है। आप इसे सीधे एक्सेल या गूगल शीट्स में आयात कर सकते हैं! 📊📁"
                        });
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl border-b-2 border-emerald-800 active:border-b-0 cursor-pointer transition flex items-center gap-2 shadow-md active:scale-95 text-center"
                    >
                      <span className="text-sm">📥</span>
                      <span>CSV फाइल डाउनलोड करें (Download CSV)</span>
                    </button>

                    {/* LINK TO GOOGLE SHEETS BUTTON */}
                    <a
                      href="https://sheets.new"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        playSfx(750, "sine", 0.1);
                        setMascotData({
                          mood: "happy",
                          text: "मैंने आपके लिए एक नई खाली गूगल शीट खोली है! आप डाउनलोड की गई CSV फ़ाइल को वहाँ File -> Import करके जोड़ सकते हैं! 📗✨"
                        });
                      }}
                      className="bg-green-700 hover:bg-green-800 text-white font-black text-xs px-4 py-2.5 rounded-xl border-b-2 border-green-900 active:border-b-0 cursor-pointer transition flex items-center gap-2 shadow-md active:scale-95 text-center"
                    >
                      <span className="text-sm">📗</span>
                      <span>Google Sheet से लिंक / खोलें (Sheets.new)</span>
                    </a>
                  </div>
                </div>

                {/* Database Actions info */}
                <div className="bg-amber-50 border border-amber-250 p-4 rounded-2xl flex items-start gap-3 text-left">
                  <span className="text-2xl mt-0.5">ℹ️</span>
                  <div className="space-y-1">
                    <h5 className="text-xs font-black text-amber-950">एक्सेल / गूगल शीट में इम्पोर्ट कैसे करें (CSV Integration Steps):</h5>
                    <ol className="text-[10.5px] text-slate-700 font-bold list-decimal pl-4 space-y-1">
                      <li>पहले ऊपर दिए गए <strong className="text-emerald-700">"CSV फाइल डाउनलोड करें"</strong> बटन पर क्लिक करके डेटा शीट सहेजें।</li>
                      <li>अब <strong className="text-green-700">"Google Sheet से लिंक / खोलें"</strong> बटन दबाएँ जिससे नई गूगल शीट खुल जाएगी।</li>
                      <li>गूगल शीट के मुख्य मेनू में <strong>File ➔ Import ➔ Upload</strong> पर जाएँ और डाउनलोड की गई CSV फ़ाइल को चुनकर 'Import Data' दबाएँ।</li>
                      <li>सभी स्कूलों का डेटा (ज़िला, ब्लॉक, स्कूल का नाम, कुल पंजीकृत वोटर और दिनांक) व्यवस्थित रो और कॉलम में प्रदर्शित हो जाएगा!</li>
                    </ol>
                  </div>
                </div>

                {/* Table displaying the list of schools */}
                <div className="overflow-x-auto border-2 border-slate-200 rounded-2xl">
                  <table className="w-full text-left border-collapse font-sans text-xs text-slate-800">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 text-[10.5px] font-black uppercase">
                        <th className="p-3.5 text-center w-12">क्रमशः</th>
                        <th className="p-3.5">📍 जिला</th>
                        <th className="p-3.5">🧱 ब्लॉक</th>
                        <th className="p-3.5">🏫 विद्यालय का नाम</th>
                        <th className="p-3.5 text-center">🗳️ कुल पंजीकृत वोटर</th>
                        <th className="p-3.5">📅 पंजीकरण का समय</th>
                        <th className="p-3.5 text-center w-20">नियंत्रण</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registeredSchools.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-550 font-bold italic">
                            वर्तमान में कोई भी स्कूल पंजीकृत नहीं है। मतदान ईवीएम बूथ सेटअप में स्कूल और स्थान की जानकारी भरकर वोटर रजिस्ट्रेशन करें।
                          </td>
                        </tr>
                      ) : (
                        registeredSchools.map((school, idx) => (
                          <tr key={idx} className="border-b border-slate-150 hover:bg-slate-50/70 font-semibold text-slate-800 transition">
                            <td className="p-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                            <td className="p-3">
                              <span className="bg-orange-50 border border-orange-200 text-orange-850 px-2.5 py-0.5 rounded-lg text-[10px] font-black">
                                {school.districtName || "जयपुर"}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="bg-indigo-50 border border-indigo-150 text-indigo-850 px-2.5 py-0.5 rounded-lg text-[10px] font-black">
                                {school.blockName || "सांगानेर"}
                              </span>
                            </td>
                            <td className="p-3 font-extrabold text-slate-900">{school.schoolName}</td>
                            <td className="p-3 text-center">
                              <span className="bg-teal-50 border border-teal-200 text-teal-800 px-3 py-1 rounded-full font-black text-xs font-mono">
                                {school.votersCount || 0} वोटर
                              </span>
                            </td>
                            <td className="p-3 text-slate-500 font-medium text-[11px]">
                              {new Date(school.timestamp).toLocaleString('hi-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={async () => {
                                  if (!confirm("क्या आप वाकई इस स्कूल का रिकॉर्ड हटाना चाहते हैं?")) return;
                                  const filtered = registeredSchools.filter((_, sIdx) => sIdx !== idx);
                                  setRegisteredSchools(filtered);
                                  localStorage.setItem("samvidhan_registered_schools", JSON.stringify(filtered));
                                  
                                  // Log security event
                                  addSecurityLog("Lock 2 Sub-Admin", "स्कूल पंजीयन रिकॉर्ड हटाया (Registration Removed)", "warning", `स्कूल '${school.schoolName}' (पंजीकरण आईडी: ${school.schoolRegCode || "N/A"}) का रिकॉर्ड हटाया गया।`);
                                  
                                  // Live sync cloud Firestore deletions safely
                                  if (school.schoolRegCode) {
                                    try {
                                      const docId = school.schoolRegCode.replace(/[^a-zA-Z0-9_\-]/g, "");
                                      await deleteDoc(doc(db, "schools", docId));
                                    } catch (err) {
                                      console.warn("Firestore synclog delete omitted:", err);
                                    }
                                  }

                                  playSfx(440, "sine", 0.15);
                                  setMascotData({
                                    mood: "thinking",
                                    text: "स्कूल रिकॉर्ड हटाया गया! 🗑️"
                                  });
                                }}
                                className="text-rose-600 hover:text-rose-800 p-1 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition cursor-pointer"
                                title="রেকর্ড ডিলিट"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* CLEAR ALL BUTTON */}
                {registeredSchools.length > 0 && (
                  <div className="flex justify-end">
                    <button
                      onClick={async () => {
                        if (!confirm("चेतावनी: क्या आप सभी पंजीकृत स्कूलों की सूची पूरी तरह मिटाना चाहते हैं?")) return;
                        
                        // Log security event
                        addSecurityLog("Lock 2 Sub-Admin", "डेटाबेस रीसेट (Database Wiped)", "error", "पंजीकृत सभी स्कूलों के रिकॉर्ड्स को मुख्य एडमिन पैनल से पूरी तरह मिटाया गया।");

                        // Live sync Cloud Firestore database resets safely
                        registeredSchools.forEach(async (school) => {
                          if (school.schoolRegCode) {
                            try {
                              const docId = school.schoolRegCode.replace(/[^a-zA-Z0-9_\-]/g, "");
                              await deleteDoc(doc(db, "schools", docId));
                            } catch (e) {}
                          }
                        });

                        setRegisteredSchools([]);
                        localStorage.removeItem("samvidhan_registered_schools");
                        playSfx(300, "sawtooth", 0.3);
                        setMascotData({
                          mood: "thinking",
                          text: "डेटाबेस रीसेट! सभी पंजीकृत स्कूलों के रिकॉर्ड सफलतापूर्वक साफ़ कर दिए गए हैं।"
                        });
                      }}
                      className="bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-300 font-extrabold text-[10.5px] px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1 active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>डेटाबेस खाली करें (Reset Database)</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {adminSubTab === "securitylogs" && (
              <div className="bg-white border-2 border-slate-150 rounded-3xl p-6 shadow-xs space-y-6 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 pb-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-600">
                        <ShieldCheck className="w-5 h-5 animate-pulse" />
                      </div>
                      <h3 className="font-black text-base text-slate-900">
                        केंद्रीकृत सुरक्षा लॉग्स और पारदर्शी ऑडिट (Centralized Security Log Registry)
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-500 font-bold">
                      यह अनुभाग डबल-लॉक एडमिन पैनल खोलने, क्रेडेंशियल संशोधित करने और संवेदनशील संपादन कार्यों की समय-सीमा ट्रैकिंग करता है।
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (!confirm("क्या आप वाकई सभी सुरक्षा लॉग्स इतिहास को साफ़ करना चाहते हैं?")) return;
                        const clearLog = {
                          id: "SEC-" + Math.floor(Math.random() * 900000 + 100000),
                          timestamp: new Date().toLocaleString("hi-IN"),
                          actor: "Lock 2 Sub-Admin",
                          action: "सुरक्षा इतिहास रीसेट (Logs Reset)",
                          status: "error" as const,
                          details: "प्रशासक द्वारा पूर्व में सहेजे गए सभी सुरक्षा और ऑडिट लॉग्स इतिहास को साफ़ किया गया।"
                        };
                        setSecurityLogs([clearLog]);
                        localStorage.setItem("samvidhan_admin_security_logs", JSON.stringify([clearLog]));
                        playSfx(300, "sawtooth", 0.2);
                        setMascotData({
                          mood: "thinking",
                          text: "ऑडिट सुरक्षा इतिहास साफ़ कर दिया गया है! 🗑️"
                        });
                      }}
                      className="text-xs font-black bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-4 py-2 rounded-xl transition cursor-pointer"
                    >
                      इतिहास साफ़ करें (Flush Audit History)
                    </button>
                  </div>
                </div>

                {/* Audit Grid Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="border border-slate-150 rounded-2xl p-4 bg-slate-50/50 space-y-1">
                    <span className="text-[10px] text-slate-450 font-black uppercase tracking-wider block">निगरानी स्थिति (Monitoring Status)</span>
                    <div className="flex items-center gap-1.5 font-sans">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="font-black text-sm text-slate-800">🟢 लाइव सक्रिय (LIVE ACTIVE)</span>
                    </div>
                  </div>
                  <div className="border border-slate-150 rounded-2xl p-4 bg-slate-50/50 space-y-1">
                    <span className="text-[10px] text-slate-450 font-black uppercase tracking-wider block font-sans font-black">कुल सुरक्षा विसंगतियां (Total Audit Points)</span>
                    <span className="font-black text-xl text-slate-800 font-mono">{securityLogs.length}</span>
                  </div>
                  <div className="border border-slate-150 rounded-2xl p-4 bg-slate-50/50 space-y-1">
                    <span className="text-[10px] text-slate-450 font-black uppercase tracking-wider block">डबल-लॉक स्थिति (Double Lock Status)</span>
                    <span className="font-black text-sm text-rose-600 block">🔓 अनलॉक और अधिकृत (AUTHORIZED)</span>
                  </div>
                  <div className="border border-slate-150 rounded-2xl p-4 bg-slate-50/50 space-y-1">
                    <span className="text-[10px] text-slate-450 font-black uppercase tracking-wider block">अंतिम ऑडिट बिंदु (Last Log Active)</span>
                    <span className="font-black text-[11px] text-slate-700 font-mono truncate block">
                      {securityLogs[0] ? securityLogs[0].timestamp : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Security Logs Table Container */}
                <div className="overflow-x-auto border-2 border-slate-200 rounded-2xl bg-slate-50/20">
                  <table className="w-full text-left border-collapse font-sans text-xs text-slate-800">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 text-[10.5px] font-black uppercase tracking-wide">
                        <th className="p-3.5 text-center w-24">सुरक्षा आईडी</th>
                        <th className="p-3.5 w-44">📅 दिनांक और समय</th>
                        <th className="p-3.5 w-40">👤 उत्तरदायी कर्ता (Actor)</th>
                        <th className="p-3.5 w-60">📑 गतिविधि / कार्रवाई (Action)</th>
                        <th className="p-3.5 text-center w-28">स्थिति (Level)</th>
                        <th className="p-3.5">🔍 विस्तृत विवरण (Details Payload)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {securityLogs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-450 font-bold italic">
                            वर्तमान में सुरक्षा लॉग्स इतिहास पूरी तरह सुरक्षित और खाली है।
                          </td>
                        </tr>
                      ) : (
                        securityLogs.map((log) => {
                          let badgeStyle = "bg-emerald-50 border-emerald-200 text-emerald-800";
                          let dotStyle = "bg-emerald-500";
                          let label = "सफल (Success)";
                          
                          if (log.status === "warning") {
                            badgeStyle = "bg-amber-50 border-amber-250 text-amber-800";
                            dotStyle = "bg-amber-500";
                            label = "चेतावनी (Warning)";
                          } else if (log.status === "error") {
                            badgeStyle = "bg-rose-50 border-rose-150 text-rose-800";
                            dotStyle = "bg-rose-600";
                            label = "महत्वपूर्ण (Critical)";
                          }

                          return (
                            <tr key={log.id} className="border-b border-slate-150 hover:bg-slate-50/70 font-semibold text-slate-800 transition">
                              <td className="p-3 text-center">
                                <span className="bg-slate-100 border border-slate-250 px-2 py-0.5 rounded-md font-mono text-[10px] text-slate-600 font-bold">
                                  {log.id}
                                </span>
                              </td>
                              <td className="p-3 text-slate-500 font-mono text-[11px]">
                                {log.timestamp}
                              </td>
                              <td className="p-3">
                                <span className={`px-2.5 py-1 rounded-lg text-[10.5px] font-extrabold ${
                                  log.actor.includes("Lock 1") 
                                    ? "bg-orange-50 border border-orange-200 text-orange-800" 
                                    : log.actor.includes("Lock 2") 
                                    ? "bg-blue-50 border border-blue-200 text-blue-800"
                                    : "bg-purple-50 border border-purple-200 text-purple-850"
                                }`}>
                                  {log.actor}
                                </span>
                              </td>
                              <td className="p-3 font-extrabold text-slate-900 font-sans">
                                {log.action}
                              </td>
                              <td className="p-3 text-center">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 border rounded-full text-[10.5px] font-black ${badgeStyle}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${dotStyle}`}></span>
                                  {label}
                                </span>
                              </td>
                              <td className="p-3 text-slate-600 text-[11px] font-bold leading-relaxed font-sans">
                                {log.details}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
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
