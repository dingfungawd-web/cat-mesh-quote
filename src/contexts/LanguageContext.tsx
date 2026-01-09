import { createContext, useContext, useState, ReactNode } from "react";

type Language = "zh" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  zh: {
    // Header & Hero
    "hero.badge": "度尺前預先評估",
    "hero.title": "《DF 貓咪居家安全顧問問卷》",
    "hero.description": "透過此問卷，我們將預先了解您家中的環境與貓咪習性，以便度尺時為您提供最適合的防護方案。",
    "footer.copyright": "© 2017 DF 創意家居 · 全港領先防貓網工程公司",
    "footer.tagline": "成為您貓咪一生的守護顧問",
    
    // Form Steps
    "step.of": "步驟",
    "step.complete": "完成",
    "step.basic": "基本資料",
    "step.risk": "風險評估",
    "step.confirm": "確認提交",
    
    // Step 1
    "form.whatsapp": "請輸入你的Whatsapp電話號碼",
    "form.whatsapp.placeholder": "請輸入您的電話號碼",
    "form.q1": "一、戶型與居住樓層？",
    "form.buildingType": "戶型",
    "form.buildingType.select": "請選擇",
    "form.buildingType.building": "大廈",
    "form.buildingType.house": "村屋/別墅",
    "form.floor": "樓層",
    "form.floor.placeholder": "例如：15",
    "form.q2": "二、家中門窗戶總數量？",
    "form.window": "窗",
    "form.door": "門",
    "form.quantity": "數量",
    "form.q3.weight": "三、最重貓咪的體重？（單位：Kg）",
    "form.weight.placeholder": "例如：5.5",
    
    // Step 2
    "form.riskTitle": "風險評估問題",
    "form.riskDesc": "以下問題將用於評估您家中的防護需求等級",
    "q3.title": "三、家中的貓咪總數？",
    "q3.opt1": "1 分：1 隻",
    "q3.opt2": "2 分：2 隻",
    "q3.opt3": "3 分：3 隻",
    "q3.opt4": "4 分：4 隻或以上",
    "q5.title": "四、貓咪的窗邊行為模式？",
    "q5.opt1": "0 分：只會睡在窗邊或遠觀",
    "q5.opt2": "1 分：偶爾會跳上窗台，但不會推網或抓網",
    "q5.opt3": "2 分：經常會扒窗、推網或抓咬網邊",
    "q5.opt4": "3 分：有嘗試過掙脫或打開紗窗、推開舊網的行為",
    "q6.title": "五、窗戶結構與通風習慣？",
    "q6.opt1": "0 分：門窗沒有老化，只會有時打開部份門窗",
    "q6.opt2": "1 分：門窗有老化情況，只會有時打開部份門窗",
    "q6.opt3": "2 分：門窗沒有老化，會長時間打開門窗",
    "q6.opt4": "3 分：門窗有老化情況，並會長時間打開門窗",
    "q7.title": "六、您最活潑的貓咪性格屬於？",
    "q7.opt1": "0 分：安靜、年老、不愛跳躍",
    "q7.opt2": "1 分：一般好動，喜歡在貓跳台上休息",
    "q7.opt3": "2 分：極度活躍，經常玩追逐遊戲或跑跳",
    "q7.opt4": "3 分：有「暴衝」或貓咪間打架追逐，可能高速衝撞窗口",
    "q8.title": "七、家中是否有其他高危險環境？",
    "q8.opt1": "0 分：無",
    "q8.opt2": "1 分：貓跳台/櫃子緊鄰窗戶，貓咪可直接跳上窗台",
    "q8.opt3": "2 分：家中經常有幼童或大型寵物，可能誤推防貓網",
    "q8.opt4": "3 分：以上兩點皆有",
    "q9.title": "八、您對「防貓網」的安裝預期？",
    "q9.opt1": "0 分：安全穩固，貓咪生命安全最重要",
    "q9.opt2": "1 分：安全固然重要，但希望兼顧最大採光和美觀",
    "q9.opt3": "2 分：希望用最實惠的方案，能擋住貓咪就足夠",
    "q9.opt4": "3 分：希望做出來「視覺隱形」，並且希望盡量節省預算",
    
    // Step 3
    "confirm.title": "確認提交",
    "confirm.basicInfo": "基本資料",
    "confirm.address": "地址：",
    "confirm.buildingType": "戶型：",
    "confirm.floor": "樓層：",
    "confirm.windowCount": "窗數量：",
    "confirm.doorCount": "門數量：",
    "confirm.heaviestCat": "最重貓咪：",
    "confirm.riskScore": "風險評分",
    "confirm.totalScore": "總分：",
    "confirm.submitNote": "確認提交後，我們的專業團隊將會盡快與您聯繫，安排上門度尺時間。",
    
    // Buttons
    "btn.next": "下一步",
    "btn.back": "返回",
    "btn.submit": "提交評估",
    "btn.submitting": "提交中...",
    
    // Toast
    "toast.fillAll": "請填寫所有必填項目",
    "toast.fillAllDesc": "所有欄位均為必填",
    "toast.completeAll": "請完成所有評分問題",
    "toast.completeAllDesc": "請為每個問題選擇一個選項",
    "toast.success": "提交成功！",
    "toast.successDesc": "您的評估已成功提交，我們的團隊會盡快與您聯繫。",
    "toast.error": "提交失敗",
    "toast.errorDesc": "請稍後再試或聯繫我們",
    
    // Units
    "unit.pieces": "個",
    "unit.kg": "Kg",
    "unit.points": "分",
  },
  en: {
    // Header & Hero
    "hero.badge": "Pre-measurement Assessment",
    "hero.title": "DF Cat Home Safety Consultant Questionnaire",
    "hero.description": "Through this questionnaire, we will understand your home environment and cat habits in advance, so we can provide the most suitable protection solution during measurement.",
    "footer.copyright": "© 2017 DF Creative Home · Hong Kong's Leading Cat Net Installation Company",
    "footer.tagline": "Your cat's lifetime guardian consultant",
    
    // Form Steps
    "step.of": "Step",
    "step.complete": "Complete",
    "step.basic": "Basic Info",
    "step.risk": "Risk Assessment",
    "step.confirm": "Confirm",
    
    // Step 1
    "form.whatsapp": "Please enter your WhatsApp phone number",
    "form.whatsapp.placeholder": "Enter your phone number",
    "form.q1": "1. Property type and floor level?",
    "form.buildingType": "Property Type",
    "form.buildingType.select": "Please select",
    "form.buildingType.building": "Apartment",
    "form.buildingType.house": "House/Villa",
    "form.floor": "Floor",
    "form.floor.placeholder": "e.g. 15",
    "form.q2": "2. Total number of doors and windows?",
    "form.window": "Windows",
    "form.door": "Doors",
    "form.quantity": "Quantity",
    "form.q3.weight": "3. Weight of heaviest cat? (in Kg)",
    "form.weight.placeholder": "e.g. 5.5",
    
    // Step 2
    "form.riskTitle": "Risk Assessment Questions",
    "form.riskDesc": "The following questions will be used to assess your home's protection needs",
    "q3.title": "3. Total number of cats at home?",
    "q3.opt1": "1 pt: 1 cat",
    "q3.opt2": "2 pts: 2 cats",
    "q3.opt3": "3 pts: 3 cats",
    "q3.opt4": "4 pts: 4 or more cats",
    "q5.title": "4. Cat's window behavior pattern?",
    "q5.opt1": "0 pts: Only sleeps by window or observes from afar",
    "q5.opt2": "1 pt: Occasionally jumps onto windowsill, but doesn't push or scratch the net",
    "q5.opt3": "2 pts: Frequently scratches window, pushes or bites the net",
    "q5.opt4": "3 pts: Has attempted to escape or open screen/push old nets",
    "q6.title": "5. Window structure and ventilation habits?",
    "q6.opt1": "0 pts: Windows not aged, only sometimes open",
    "q6.opt2": "1 pt: Windows showing aging, only sometimes open",
    "q6.opt3": "2 pts: Windows not aged, open for long periods",
    "q6.opt4": "3 pts: Windows showing aging, open for long periods",
    "q7.title": "6. Your most active cat's personality?",
    "q7.opt1": "0 pts: Quiet, elderly, doesn't like jumping",
    "q7.opt2": "1 pt: Generally active, likes resting on cat tower",
    "q7.opt3": "2 pts: Extremely active, often plays chase games or runs/jumps",
    "q7.opt4": "3 pts: Has 'zoomies' or cats fight/chase, may crash into windows at high speed",
    "q8.title": "7. Any other high-risk environments at home?",
    "q8.opt1": "0 pts: None",
    "q8.opt2": "1 pt: Cat tower/cabinet near window, cat can jump directly to windowsill",
    "q8.opt3": "2 pts: Young children or large pets may accidentally push cat net",
    "q8.opt4": "3 pts: Both of the above",
    "q9.title": "8. Your expectations for cat net installation?",
    "q9.opt1": "0 pts: Safety first, cat's life is most important",
    "q9.opt2": "1 pt: Safety is important, but also want maximum light and aesthetics",
    "q9.opt3": "2 pts: Want the most affordable option, as long as it blocks cats",
    "q9.opt4": "3 pts: Want it 'visually invisible' and save as much budget as possible",
    
    // Step 3
    "confirm.title": "Confirm Submission",
    "confirm.basicInfo": "Basic Information",
    "confirm.address": "Address:",
    "confirm.buildingType": "Property Type:",
    "confirm.floor": "Floor:",
    "confirm.windowCount": "Windows:",
    "confirm.doorCount": "Doors:",
    "confirm.heaviestCat": "Heaviest Cat:",
    "confirm.riskScore": "Risk Score",
    "confirm.totalScore": "Total Score:",
    "confirm.submitNote": "After submission, our professional team will contact you shortly to arrange an on-site measurement appointment.",
    
    // Buttons
    "btn.next": "Next",
    "btn.back": "Back",
    "btn.submit": "Submit Assessment",
    "btn.submitting": "Submitting...",
    
    // Toast
    "toast.fillAll": "Please fill in all required fields",
    "toast.fillAllDesc": "All fields are required",
    "toast.completeAll": "Please complete all questions",
    "toast.completeAllDesc": "Please select an option for each question",
    "toast.success": "Submitted successfully!",
    "toast.successDesc": "Your assessment has been submitted. Our team will contact you soon.",
    "toast.error": "Submission failed",
    "toast.errorDesc": "Please try again later or contact us",
    
    // Units
    "unit.pieces": "pcs",
    "unit.kg": "Kg",
    "unit.points": "pts",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("zh");

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
