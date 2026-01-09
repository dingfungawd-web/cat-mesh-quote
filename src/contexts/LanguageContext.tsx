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
    "confirm.riskScore": "風險評估得分",
    "confirm.catCount": "貓咪數量：",
    "confirm.windowBehavior": "窗邊行為：",
    "confirm.windowStructure": "窗戶結構：",
    "confirm.catPersonality": "貓咪性格：",
    "confirm.highRisk": "高危環境：",
    "confirm.expectation": "安裝預期：",
    "confirm.totalScore": "總分：",
    "confirm.submitNote": "提交後，我們的專業團隊將根據您的評估結果，為您準備度尺方案。您也可以匯出 PDF 報告以供參考。",
    
    // Buttons
    "btn.next": "下一步",
    "btn.back": "上一步",
    "btn.submit": "提交資料，獲取報告",
    "btn.submitting": "提交中...",
    "btn.export": "匯出 PDF 報告",
    "btn.reset": "重新評估",
    
    // Toast
    "toast.fillAll": "請填寫所有必填項目",
    "toast.fillAllDesc": "所有欄位均為必填",
    "toast.completeAll": "請完成所有評分問題",
    "toast.completeAllDesc": "請為每個問題選擇一個選項",
    "toast.success": "提交成功！",
    "toast.successDesc": "您的評估已成功提交，我們的團隊會盡快與您聯繫。",
    "toast.error": "提交失敗",
    "toast.errorDesc": "請稍後再試或聯繫我們",
    "toast.generating": "正在生成 PDF...",
    "toast.generatingDesc": "請稍候，正在生成4頁報告",
    "toast.downloaded": "PDF 已下載",
    "toast.downloadedDesc": "您的4頁評估報告已成功匯出",
    "toast.exportError": "匯出失敗",
    "toast.exportErrorDesc": "請稍後再試",
    
    // Units
    "unit.pieces": "個",
    "unit.kg": "Kg",
    "unit.points": "分",
    
    // Result Page
    "result.scrollHint": "⬇️ 請向下滾動至底部匯出 PDF 報告 ⬇️",
    "result.title": "貓咪居家安全評估報告",
    "result.date": "評估日期：",
    "result.riskLow": "【穩健安全級別】",
    "result.riskMedium": "【加固防護級別】",
    "result.riskHigh": "【極高風險警告】",
    "result.assessment": "評估結果：",
    "result.recommendation": "DF 專業建議：",
    "result.advice": "安全顧問叮囑：",
    "result.details": "評估詳情",
    "result.basicInfo": "基本資料",
    "result.whatsapp": "Whatsapp電話號碼",
    "result.buildingType": "戶型",
    "result.floor": "樓層",
    "result.windowCount": "窗數量",
    "result.doorCount": "門數量",
    "result.heaviestCat": "最重貓咪體重",
    "result.scoreBreakdown": "評分明細",
    "result.catCount": "貓咪數量",
    "result.windowBehavior": "窗邊行為模式",
    "result.windowStructure": "窗戶結構習慣",
    "result.catPersonality": "貓咪性格",
    "result.highRisk": "高危環境",
    "result.expectation": "安裝預期",
    "result.thanks": "感謝您完成《DF 貓咪居家安全顧問問卷》",
    "result.thanksDesc": "我們相信，作為全港領先的防貓網工程公司，我們的職責不僅是安裝一張網，更是",
    "result.thanksHighlight": "成為您貓咪一生的守護顧問。",
    "result.thanksNote": "我們的專業團隊將會在預約時間準時上門，為您度身訂造「最安全」的守護方案。",
    "result.reference": "📚 參考資料",
    
    // Risk Levels
    "risk.low.assessment": "根據您的初步評估，您的家居環境屬於「低風險」。您的貓咪性格較溫和，且家中環境穩定，發生突發衝擊的機會相對較低。",
    "risk.low.recommendation": "選用 DF 標準系列防貓網已足以應付日常需要。雖然風險較低，但我們絕不掉以輕心。度尺師傅上門時，會因應你和貓貓的生活習慣，提供款式、位置和安裝的專業意見。",
    "risk.low.advice": "「即使主子性格文靜，窗戶安全亦是防患未然。我們會確保安裝後的網面平整且受力均勻，給您最安心的防護。」",
    "risk.medium.assessment": "注意！您的評估顯示家居存在「中度風險」。這通常與多貓家庭、貓咪性格較活潑（如喜愛抓網或跳躍）有關。沒有測試的防貓網結構在面對連續衝擊時，穩定性可能不足。",
    "risk.medium.recommendation": "我們強烈建議選用 DF 專業系列防貓網。此方案會針對網面扣件及滑軌進行補強，並加裝專用的「防開安全鎖」，防止聰明的貓咪自行撥開網窗。",
    "risk.medium.advice": "「多貓環境下，網面的磨損與受壓是呈倍數增長的。度尺師傅會現場評估您的家居設計和空間，為您制定一套具備『抗抓』及『高承重』的加固方案。」",
    "risk.high.assessment": "緊急預警！您的評估分數極高，屬於「極高風險類別」。這代表您的貓咪具備極強的破壞力或衝刺力（如暴衝習慣），或者您的窗戶結構已面臨老化風險。在這種情況下，低強度的防貓網絕對無法保障貓咪安全。",
    "risk.high.recommendation": "必須選用最高強度的 DF Pro 守護系列。此系列採用高強度不鏽鋼網身及強化鋁合金框架，專為高空、多貓及極度活躍的貓咪設計。",
    "risk.high.advice": "「作為專業的防貓網公司，我們必須坦誠告誡：您的情況若選用不當材料，極易發生意外。度尺師傅將以貓貓生命為大前提建議方案。如最終方案未能達到我們的安全標準，我們寧願拒絕接單，亦絕不拿貓咪生命冒險。」",
    
    // Reference Pages
    "ref1.title": "參考資料（一）：貓種特徵分析",
    "ref1.desc": "了解不同貓種的特性，有助於選擇最適合的防護方案",
    "ref1.high": "🔴 高活力品種（需加強防護）",
    "ref1.medium": "🟠 中等活力品種（建議加固）",
    "ref1.low": "🟢 溫和品種（基本防護即可）",
    "ref1.mixed": "🐈 唐貓 / 混種貓",
    "ref1.note": "以上僅供參考，每隻貓咪都有獨特性格。無論品種如何，我們的度尺師傅會根據您家中貓咪的實際行為表現，制定最合適的防護方案。",
    
    "ref2.title": "參考資料（二）：多貓飼養行為分析",
    "ref2.desc": "貓咪數量會直接影響家居安全風險",
    "ref2.single": "一隻貓飼養",
    "ref2.double": "兩隻貓飼養",
    "ref2.multiple": "三隻或以上多貓飼養",
    "ref2.note": "無論飼養多少隻貓，都應預留「安全餘量」。我們的度尺師傅會評估您家中貓咪的互動模式，確保防護方案能應對最壞情況。",
    
    "ref3.title": "參考資料（三）：物理實測對照",
    "ref3.desc": "以中型貓（體重中位數 4.5kg）為基準的衝擊力分析",
    "ref3.basis": "基準：中型貓體重中位數",
    "ref3.behavior": "行為狀態",
    "ref3.multiplier": "體重倍數",
    "ref3.impact": "等效衝擊力",
    "ref3.description": "說明",
    "ref3.static": "靜態站立 / 躺臥",
    "ref3.staticDesc": "貓咪平靜地趴在網面上",
    "ref3.climb": "攀爬 / 跳躍落地",
    "ref3.climbDesc": "貓咪跳上窗台或從高處跳落網面",
    "ref3.rush": "全速衝撞",
    "ref3.rushDesc": "貓咪追逐獵物或受驚暴衝直撞網面",
    "ref3.scratch": "持續抓撓",
    "ref3.scratchDesc": "貓咪用爪抓網，產生集中點壓力",
    "ref3.extreme": "極端情況",
    "ref3.extremeDesc": "多貓同時衝撞時，衝擊力會疊加。兩隻4.5kg貓同時暴衝可產生超過100kg的瞬間衝擊力。",
    "ref3.wear": "抓撓損耗",
    "ref3.wearDesc": "持續抓撓會造成網面局部疲勞，長期累積可使網面強度下降30-50%。",
    "ref3.disclaimer": "以上數據基於中型貓體重中位數估算，實際衝擊力會因貓咪品種、體型及個體行為差異而有所不同，僅供參考。",
    "ref3.footer": "我們的專業團隊將會在預約時間準時上門，為您度身訂造「最安全」的守護方案。",
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
    "confirm.riskScore": "Risk Assessment Score",
    "confirm.catCount": "Number of cats:",
    "confirm.windowBehavior": "Window behavior:",
    "confirm.windowStructure": "Window structure:",
    "confirm.catPersonality": "Cat personality:",
    "confirm.highRisk": "High-risk environment:",
    "confirm.expectation": "Installation expectation:",
    "confirm.totalScore": "Total Score:",
    "confirm.submitNote": "After submission, our professional team will prepare a measurement plan based on your assessment results. You can also export a PDF report for reference.",
    
    // Buttons
    "btn.next": "Next",
    "btn.back": "Back",
    "btn.submit": "Submit & Get Report",
    "btn.submitting": "Submitting...",
    "btn.export": "Export PDF Report",
    "btn.reset": "Reassess",
    
    // Toast
    "toast.fillAll": "Please fill in all required fields",
    "toast.fillAllDesc": "All fields are required",
    "toast.completeAll": "Please complete all questions",
    "toast.completeAllDesc": "Please select an option for each question",
    "toast.success": "Submitted successfully!",
    "toast.successDesc": "Your assessment has been submitted. Our team will contact you soon.",
    "toast.error": "Submission failed",
    "toast.errorDesc": "Please try again later or contact us",
    "toast.generating": "Generating PDF...",
    "toast.generatingDesc": "Please wait, generating 4-page report",
    "toast.downloaded": "PDF Downloaded",
    "toast.downloadedDesc": "Your 4-page assessment report has been exported",
    "toast.exportError": "Export failed",
    "toast.exportErrorDesc": "Please try again later",
    
    // Units
    "unit.pieces": "pcs",
    "unit.kg": "Kg",
    "unit.points": "pts",
    
    // Result Page
    "result.scrollHint": "⬇️ Scroll down to export PDF report ⬇️",
    "result.title": "Cat Home Safety Assessment Report",
    "result.date": "Assessment Date:",
    "result.riskLow": "【Safe & Stable Level】",
    "result.riskMedium": "【Enhanced Protection Level】",
    "result.riskHigh": "【Extreme Risk Warning】",
    "result.assessment": "Assessment Result:",
    "result.recommendation": "DF Professional Recommendation:",
    "result.advice": "Safety Consultant's Note:",
    "result.details": "Assessment Details",
    "result.basicInfo": "Basic Information",
    "result.whatsapp": "WhatsApp Phone Number",
    "result.buildingType": "Property Type",
    "result.floor": "Floor",
    "result.windowCount": "Windows",
    "result.doorCount": "Doors",
    "result.heaviestCat": "Heaviest Cat Weight",
    "result.scoreBreakdown": "Score Breakdown",
    "result.catCount": "Number of Cats",
    "result.windowBehavior": "Window Behavior",
    "result.windowStructure": "Window Structure",
    "result.catPersonality": "Cat Personality",
    "result.highRisk": "High-risk Environment",
    "result.expectation": "Installation Expectation",
    "result.thanks": "Thank you for completing the DF Cat Home Safety Consultant Questionnaire",
    "result.thanksDesc": "We believe that as Hong Kong's leading cat net installation company, our duty is not just to install a net, but to",
    "result.thanksHighlight": "become your cat's lifetime guardian consultant.",
    "result.thanksNote": "Our professional team will arrive on time for your scheduled appointment to create the 'safest' protection solution for you.",
    "result.reference": "📚 Reference Materials",
    
    // Risk Levels
    "risk.low.assessment": "Based on your preliminary assessment, your home environment is 'low risk'. Your cat has a mild temperament and your home environment is stable, with relatively low chances of sudden impacts.",
    "risk.low.recommendation": "The DF Standard Series cat net is sufficient for daily needs. Although the risk is low, we never take it lightly. Our measurement specialist will provide professional advice on styles, positions, and installation based on you and your cat's lifestyle.",
    "risk.low.advice": "\"Even if your cat is calm, window safety is still a precaution. We will ensure the net is flat and evenly stressed after installation, giving you the most reassuring protection.\"",
    "risk.medium.assessment": "Attention! Your assessment shows 'moderate risk' in your home. This is usually related to multi-cat households or active cat personalities (such as scratching or jumping). Untested cat net structures may be unstable under continuous impact.",
    "risk.medium.recommendation": "We strongly recommend the DF Professional Series cat net. This solution reinforces the net fasteners and tracks, and adds a special 'anti-opening safety lock' to prevent clever cats from opening the net.",
    "risk.medium.advice": "\"In multi-cat environments, net wear and pressure increase exponentially. Our measurement specialist will assess your home design and space on-site to create a 'scratch-resistant' and 'high-load' reinforcement plan.\"",
    "risk.high.assessment": "Emergency Warning! Your assessment score is extremely high, in the 'extreme risk category'. This means your cat has very strong destructive power or sprint ability (such as zoomies), or your window structure is facing aging risks. In this case, low-strength cat nets absolutely cannot guarantee your cat's safety.",
    "risk.high.recommendation": "You must use the highest strength DF Pro Guardian Series. This series uses high-strength stainless steel mesh and reinforced aluminum alloy frame, specially designed for high floors, multi-cat and extremely active cats.",
    "risk.high.advice": "\"As a professional cat net company, we must honestly warn you: if you use inappropriate materials in your situation, accidents are highly likely. Our measurement specialist will recommend solutions with your cat's life as the top priority. If the final solution cannot meet our safety standards, we would rather refuse the order than risk your cat's life.\"",
    
    // Reference Pages
    "ref1.title": "Reference (1): Cat Breed Analysis",
    "ref1.desc": "Understanding different cat breed characteristics helps choose the most suitable protection solution",
    "ref1.high": "🔴 High Energy Breeds (Enhanced Protection Needed)",
    "ref1.medium": "🟠 Medium Energy Breeds (Reinforcement Recommended)",
    "ref1.low": "🟢 Gentle Breeds (Basic Protection Sufficient)",
    "ref1.mixed": "🐈 Domestic / Mixed Breed Cats",
    "ref1.note": "The above is for reference only. Each cat has a unique personality. Regardless of breed, our measurement specialist will create the most suitable protection solution based on your cat's actual behavior.",
    
    "ref2.title": "Reference (2): Multi-Cat Behavior Analysis",
    "ref2.desc": "The number of cats directly affects home safety risk",
    "ref2.single": "Single Cat Household",
    "ref2.double": "Two Cat Household",
    "ref2.multiple": "Three or More Cats",
    "ref2.note": "Regardless of how many cats you have, always leave a 'safety margin'. Our measurement specialist will assess your cats' interaction patterns to ensure the protection solution can handle worst-case scenarios.",
    
    "ref3.title": "Reference (3): Physical Impact Analysis",
    "ref3.desc": "Impact force analysis based on medium-sized cat (median weight 4.5kg)",
    "ref3.basis": "Basis: Medium cat median weight",
    "ref3.behavior": "Behavior State",
    "ref3.multiplier": "Weight Multiplier",
    "ref3.impact": "Equivalent Impact Force",
    "ref3.description": "Description",
    "ref3.static": "Static Standing / Lying",
    "ref3.staticDesc": "Cat calmly lying on the net",
    "ref3.climb": "Climbing / Jump Landing",
    "ref3.climbDesc": "Cat jumps onto windowsill or lands on net from height",
    "ref3.rush": "Full Speed Collision",
    "ref3.rushDesc": "Cat chasing prey or startled zoomies directly hitting net",
    "ref3.scratch": "Continuous Scratching",
    "ref3.scratchDesc": "Cat scratching net with claws, creating concentrated pressure points",
    "ref3.extreme": "Extreme Situation",
    "ref3.extremeDesc": "When multiple cats collide simultaneously, impact forces add up. Two 4.5kg cats zooming together can generate over 100kg of instantaneous impact.",
    "ref3.wear": "Scratch Wear",
    "ref3.wearDesc": "Continuous scratching causes local fatigue in the net, and long-term accumulation can reduce net strength by 30-50%.",
    "ref3.disclaimer": "The above data is estimated based on the median weight of medium-sized cats. Actual impact force may vary due to cat breed, size, and individual behavioral differences. For reference only.",
    "ref3.footer": "Our professional team will arrive on time for your scheduled appointment to create the 'safest' protection solution for you.",
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
