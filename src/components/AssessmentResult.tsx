import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, RotateCcw, Shield, AlertTriangle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import dfLogo from "@/assets/df-logo.jpg";

interface FormData {
  address: string;
  buildingType: string;
  floorLevel: string;
  windowCount: string;
  doorCount: string;
  heaviestCatWeight: string;
  q3Score: number;
  q5Score: number;
  q6Score: number;
  q7Score: number;
  q8Score: number;
  q9Score: number;
}

interface AssessmentResultProps {
  formData: FormData;
  totalScore: number;
  onReset: () => void;
}

export function AssessmentResult({ formData, totalScore, onReset }: AssessmentResultProps) {
  const { toast } = useToast();

  const getRiskLevel = () => {
    if (totalScore <= 6) {
      return {
        level: "low",
        label: "【穩健安全級別】",
        color: "bg-risk-low",
        textColor: "text-risk-low",
        borderColor: "border-risk-low",
        icon: Shield,
        assessment: "根據您的初步評估，您的家居環境屬於「低風險」。您的貓咪性格較溫和，且家中環境穩定，發生突發衝擊的機會相對較低。",
        recommendation: "選用 DF 標準系列防貓網已足以應付日常需要。雖然風險較低，但我們絕不掉以輕心。度尺師傅上門時，會因應你和貓貓的生活習慣，提供款式、位置和安裝的專業意見。",
        advice: "「即使主子性格文靜，窗戶安全亦是防患未然。我們會確保安裝後的網面平整且受力均勻，給您最安心的防護。」",
      };
    } else if (totalScore <= 13) {
      return {
        level: "medium",
        label: "【加固防護級別】",
        color: "bg-risk-medium",
        textColor: "text-risk-medium",
        borderColor: "border-risk-medium",
        icon: AlertTriangle,
        assessment: "注意！您的評估顯示家居存在「中度風險」。這通常與多貓家庭、貓咪性格較活潑（如喜愛抓網或跳躍）有關。沒有測試的防貓網結構在面對連續衝擊時，穩定性可能不足。",
        recommendation: "我們強烈建議選用 DF 專業系列防貓網。此方案會針對網面扣件及滑軌進行補強，並加裝專用的「防開安全鎖」，防止聰明的貓咪自行撥開網窗。",
        advice: "「多貓環境下，網面的磨損與受壓是呈倍數增長的。度尺師傅會現場評估您的家居設計和空間，為您制定一套具備『抗抓』及『高承重』的加固方案。」",
      };
    } else {
      return {
        level: "high",
        label: "【極高風險警告】",
        color: "bg-risk-high",
        textColor: "text-risk-high",
        borderColor: "border-risk-high",
        icon: AlertCircle,
        assessment: "緊急預警！您的評估分數極高，屬於「極高風險類別」。這代表您的貓咪具備極強的破壞力或衝刺力（如暴衝習慣），或者您的窗戶結構已面臨老化風險。在這種情況下，低強度的防貓網絕對無法保障貓咪安全。",
        recommendation: "必須選用最高強度的 DF Pro 守護系列。此系列採用高強度不鏽鋼網身及強化鋁合金框架，專為高空、多貓及極度活躍的貓咪設計。",
        advice: "「作為專業的防貓網公司，我們必須坦誠告誡：您的情況若選用不當材料，極易發生意外。度尺師傅將以貓貓生命為大前提建議方案。如最終方案未能達到我們的安全標準，我們寧願拒絕接單，亦絕不拿貓咪生命冒險。」",
      };
    }
  };

  const risk = getRiskLevel();
  const RiskIcon = risk.icon;

  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const page3Ref = useRef<HTMLDivElement>(null);
  const page4Ref = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (!page1Ref.current || !page2Ref.current || !page3Ref.current || !page4Ref.current) return;

    toast({
      title: "正在生成 PDF...",
      description: "請稍候，正在生成4頁報告",
    });

    try {
      // Avoid text baseline shift in canvas rendering
      await (document as any).fonts?.ready;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const renderPage = async (el: HTMLElement) => {
        return await html2canvas(
          el,
          {
            scale: 3,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
            windowWidth: el.scrollWidth,
            windowHeight: el.scrollHeight,
            scrollX: 0,
            scrollY: 0,
          } as any
        );
      };

      const addCanvasToPdf = (canvas: HTMLCanvasElement) => {
        const imgData = canvas.toDataURL("image/png");
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, Math.min(imgHeight, pdfHeight));
      };

      // Page 1 - Main Report
      addCanvasToPdf(await renderPage(page1Ref.current));

      // Page 2 - Cat Breed Analysis
      pdf.addPage();
      addCanvasToPdf(await renderPage(page2Ref.current));

      // Page 3 - Multi-Cat Behavior Analysis
      pdf.addPage();
      addCanvasToPdf(await renderPage(page3Ref.current));

      // Page 4 - Physical Impact Analysis
      pdf.addPage();
      addCanvasToPdf(await renderPage(page4Ref.current));

      pdf.save(`DF貓咪居家安全評估_${formData.address}_${new Date().toLocaleDateString("zh-HK")}.pdf`);

      toast({
        title: "PDF 已下載",
        description: "您的4頁評估報告已成功匯出",
      });
    } catch (error) {
      toast({
        title: "匯出失敗",
        description: "請稍後再試",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      {/* ===== PAGE 1: Main Assessment Report ===== */}
      <div ref={page1Ref} className="space-y-4 bg-background p-4">
        {/* Header */}
        <Card className="p-6 shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-4">
              <img 
                src={dfLogo} 
                alt="DF 創意家居" 
                className="h-12 w-auto object-contain"
              />
              <div>
                <h1 className="text-xl font-bold">貓咪居家安全評估報告</h1>
                <p className="text-sm text-muted-foreground">
                  評估日期：{new Date().toLocaleDateString("zh-HK")}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Risk Level Card */}
        <Card className={`p-5 shadow-lg border-2 ${risk.borderColor}`}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full ${risk.color} flex items-center justify-center flex-shrink-0 ${risk.level === 'high' ? 'animate-warning-flash' : ''}`}>
              <RiskIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="mb-2">
                <span
                  className={`inline-flex h-9 items-center justify-center rounded-full px-4 text-sm font-semibold leading-none ${risk.color} text-white`}
                >
                  {risk.label}
                </span>
                <span className="ml-3 inline-flex h-9 items-center text-2xl font-bold leading-none">{totalScore}/19</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm mb-1">評估結果：</h4>
                  <p className="text-sm text-foreground leading-relaxed">{risk.assessment}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm mb-1">DF 專業建議：</h4>
                  <p className="text-sm text-foreground leading-relaxed">{risk.recommendation}</p>
                </div>
                
                <div className="bg-secondary/50 rounded-lg p-2">
                  <h4 className="font-semibold text-sm mb-1">安全顧問叮囑：</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed italic">{risk.advice}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Details Card */}
        <Card className="p-5 shadow-lg">
          <h2 className="text-base font-semibold mb-3">評估詳情</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            {/* Basic Info */}
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground border-b border-border pb-1">基本資料</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Whatsapp電話號碼</span>
                  <span className="font-medium text-right max-w-[60%]">{formData.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">戶型</span>
                  <span className="font-medium">{formData.buildingType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">樓層</span>
                  <span className="font-medium">{formData.floorLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">窗數量</span>
                  <span className="font-medium">{formData.windowCount} 個</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">門數量</span>
                  <span className="font-medium">{formData.doorCount} 個</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">最重貓咪體重</span>
                  <span className="font-medium">{formData.heaviestCatWeight} Kg</span>
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground border-b border-border pb-1">評分明細</h3>
              <table className="w-full text-xs">
                <tbody>
                  <tr>
                    <td className="py-2 text-muted-foreground">貓咪數量</td>
                    <td className="py-2 text-right">
                      <span
                        className={`inline-flex h-9 min-w-14 items-center justify-center rounded-md px-3 font-semibold leading-none ${
                          formData.q3Score >= 3 ? "bg-risk-high/10 text-risk-high" : "bg-secondary text-foreground"
                        }`}
                      >
                        {formData.q3Score} 分
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-muted-foreground">窗邊行為模式</td>
                    <td className="py-2 text-right">
                      <span
                        className={`inline-flex h-9 min-w-14 items-center justify-center rounded-md px-3 font-semibold leading-none ${
                          formData.q5Score >= 2 ? "bg-risk-high/10 text-risk-high" : "bg-secondary text-foreground"
                        }`}
                      >
                        {formData.q5Score} 分
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-muted-foreground">窗戶結構習慣</td>
                    <td className="py-2 text-right">
                      <span
                        className={`inline-flex h-9 min-w-14 items-center justify-center rounded-md px-3 font-semibold leading-none ${
                          formData.q6Score >= 2 ? "bg-risk-high/10 text-risk-high" : "bg-secondary text-foreground"
                        }`}
                      >
                        {formData.q6Score} 分
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-muted-foreground">貓咪性格</td>
                    <td className="py-2 text-right">
                      <span
                        className={`inline-flex h-9 min-w-14 items-center justify-center rounded-md px-3 font-semibold leading-none ${
                          formData.q7Score >= 2 ? "bg-risk-high/10 text-risk-high" : "bg-secondary text-foreground"
                        }`}
                      >
                        {formData.q7Score} 分
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-muted-foreground">高危環境</td>
                    <td className="py-2 text-right">
                      <span
                        className={`inline-flex h-9 min-w-14 items-center justify-center rounded-md px-3 font-semibold leading-none ${
                          formData.q8Score >= 2 ? "bg-risk-high/10 text-risk-high" : "bg-secondary text-foreground"
                        }`}
                      >
                        {formData.q8Score} 分
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-muted-foreground">安裝預期</td>
                    <td className="py-2 text-right">
                      <span
                        className={`inline-flex h-9 min-w-14 items-center justify-center rounded-md px-3 font-semibold leading-none ${
                          formData.q9Score >= 2 ? "bg-risk-high/10 text-risk-high" : "bg-secondary text-foreground"
                        }`}
                      >
                        {formData.q9Score} 分
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Footer Message */}
        <Card className="p-4 shadow-lg bg-gradient-card">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-base">感謝您完成《DF 貓咪居家安全顧問問卷》</h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-lg mx-auto">
              我們相信，作為全港領先的防貓網工程公司，我們的職責不僅是安裝一張網，更是
              <strong className="text-foreground">成為您貓咪一生的守護顧問。</strong>
            </p>
            <p className="text-xs text-muted-foreground">
              我們的專業團隊將會在預約時間準時上門，為您度身訂造「最安全」的守護方案。
            </p>
          </div>
        </Card>
      </div>

      {/* Section Divider */}
      <div className="my-8 text-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full">
          <span className="text-sm font-medium text-primary">📚 參考資料</span>
        </div>
      </div>

      {/* ===== PAGE 2: Cat Breed Analysis ===== */}
      <div ref={page2Ref} className="space-y-4 bg-background p-4">
        <Card className="p-4 shadow-lg overflow-hidden relative">
          <div className="flex items-center gap-3">
            <img 
              src={dfLogo} 
              alt="DF 創意家居" 
              className="h-8 w-auto object-contain"
            />
            <div>
              <h2 className="text-base font-bold">參考資料（一）：貓種特徵分析</h2>
              <p className="text-xs text-muted-foreground">了解不同貓種的特性，有助於選擇最適合的防護方案</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 shadow-lg">
          <div className="grid gap-3 md:grid-cols-2">
            {/* Active/High Energy Breeds */}
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-risk-high border-b border-border pb-1">🔴 高活力品種（需加強防護）</h3>
              <div className="space-y-1.5 text-xs">
                <div className="p-2 bg-risk-high/5 rounded-lg border border-risk-high/20">
                  <p className="font-medium">孟加拉貓 Bengal</p>
                  <p className="text-muted-foreground text-[10px]">極度活躍、好奇心強、喜愛跳躍攀爬，衝擊力大</p>
                </div>
                <div className="p-2 bg-risk-high/5 rounded-lg border border-risk-high/20">
                  <p className="font-medium">阿比西尼亞貓 Abyssinian</p>
                  <p className="text-muted-foreground text-[10px]">活潑好動、喜歡探索高處、對窗外事物敏感</p>
                </div>
                <div className="p-2 bg-risk-high/5 rounded-lg border border-risk-high/20">
                  <p className="font-medium">暹羅貓 Siamese</p>
                  <p className="text-muted-foreground text-[10px]">聰明機靈、會嘗試開窗、情緒波動較大</p>
                </div>
                <div className="p-2 bg-risk-high/5 rounded-lg border border-risk-high/20">
                  <p className="font-medium">緬因貓 Maine Coon</p>
                  <p className="text-muted-foreground text-[10px]">體型龐大（可達10kg+）、力量強、撞擊力高</p>
                </div>
              </div>
            </div>

            {/* Medium Energy Breeds */}
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-risk-medium border-b border-border pb-1">🟠 中等活力品種（建議加固）</h3>
              <div className="space-y-1.5 text-xs">
                <div className="p-2 bg-risk-medium/5 rounded-lg border border-risk-medium/20">
                  <p className="font-medium">英國短毛貓 British Shorthair</p>
                  <p className="text-muted-foreground text-[10px]">體型壯實、平時溫和但會突然暴衝</p>
                </div>
                <div className="p-2 bg-risk-medium/5 rounded-lg border border-risk-medium/20">
                  <p className="font-medium">美國短毛貓 American Shorthair</p>
                  <p className="text-muted-foreground text-[10px]">性格活潑、好奇心強、喜歡追逐</p>
                </div>
                <div className="p-2 bg-risk-medium/5 rounded-lg border border-risk-medium/20">
                  <p className="font-medium">蘇格蘭摺耳貓 Scottish Fold</p>
                  <p className="text-muted-foreground text-[10px]">喜歡觀望窗外、偶爾會撲向窗戶</p>
                </div>
                <div className="p-2 bg-risk-medium/5 rounded-lg border border-risk-medium/20">
                  <p className="font-medium">俄羅斯藍貓 Russian Blue</p>
                  <p className="text-muted-foreground text-[10px]">敏感警覺、受驚時可能衝撞</p>
                </div>
              </div>
            </div>

            {/* Calm Breeds */}
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-risk-low border-b border-border pb-1">🟢 溫和品種（基本防護即可）</h3>
              <div className="space-y-1.5 text-xs">
                <div className="p-2 bg-risk-low/5 rounded-lg border border-risk-low/20">
                  <p className="font-medium">波斯貓 Persian</p>
                  <p className="text-muted-foreground text-[10px]">性格慵懶、活動量低、少攀爬</p>
                </div>
                <div className="p-2 bg-risk-low/5 rounded-lg border border-risk-low/20">
                  <p className="font-medium">布偶貓 Ragdoll</p>
                  <p className="text-muted-foreground text-[10px]">性格溫馴、放鬆、較少跳躍衝撞</p>
                </div>
                <div className="p-2 bg-risk-low/5 rounded-lg border border-risk-low/20">
                  <p className="font-medium">異國短毛貓 Exotic Shorthair</p>
                  <p className="text-muted-foreground text-[10px]">溫和安靜、活動量較低</p>
                </div>
              </div>
            </div>

            {/* Mixed Breeds */}
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground border-b border-border pb-1">🐈 唐貓 / 混種貓</h3>
              <div className="space-y-1.5 text-xs">
                <div className="p-2 bg-secondary/50 rounded-lg border border-border">
                  <p className="font-medium">唐貓 Domestic Cat</p>
                  <p className="text-muted-foreground text-[10px]">性格多變、視乎個體差異，建議依實際行為評估</p>
                </div>
                <div className="p-2 bg-secondary/50 rounded-lg border border-border">
                  <p className="font-medium">領養貓 Rescue Cat</p>
                  <p className="text-muted-foreground text-[10px]">可能有創傷經歷、受驚時反應較大，建議加強防護</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 p-2 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-[10px] text-muted-foreground">
              <strong className="text-foreground">⚠️ 重要提示：</strong>
              以上僅供參考，每隻貓咪都有獨特性格。無論品種如何，我們的度尺師傅會根據您家中貓咪的實際行為表現，制定最合適的防護方案。
            </p>
          </div>
        </Card>
      </div>

      {/* ===== PAGE 3: Multi-Cat Behavior Analysis ===== */}
      <div ref={page3Ref} className="space-y-4 bg-background p-4 mt-6">
        <Card className="p-4 shadow-lg overflow-hidden relative">
          <div className="flex items-center gap-3">
            <img 
              src={dfLogo} 
              alt="DF 創意家居" 
              className="h-8 w-auto object-contain"
            />
            <div>
              <h2 className="text-base font-bold">參考資料（二）：多貓飼養行為分析</h2>
              <p className="text-xs text-muted-foreground">貓咪數量會直接影響家居安全風險</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 shadow-lg">
          <div className="space-y-3">
            {/* Single Cat */}
            <div className="p-3 bg-risk-low/5 rounded-lg border border-risk-low/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-risk-low/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">1️⃣</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-risk-low text-sm mb-1">一隻貓飼養</h3>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p><strong className="text-foreground">常見行為：</strong></p>
                    <ul className="list-disc list-inside space-y-0.5 ml-2 text-[11px]">
                      <li>獨處時間長，容易對窗外事物產生興趣</li>
                      <li>缺乏玩伴時，可能在窗邊長時間觀望飛鳥、昆蟲</li>
                      <li>較易發展出「獵人本能」，追逐窗外移動物體</li>
                      <li>主人外出時，可能因無聊而嘗試探索窗戶</li>
                    </ul>
                    <p className="mt-1 text-[11px]"><strong className="text-foreground">風險提示：</strong>單貓家庭雖較穩定，但貓咪獨處時的行為難以預測，仍需確保窗戶防護到位。</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Two Cats */}
            <div className="p-3 bg-risk-medium/5 rounded-lg border border-risk-medium/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-risk-medium/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">2️⃣</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-risk-medium text-sm mb-1">兩隻貓飼養</h3>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p><strong className="text-foreground">常見行為：</strong></p>
                    <ul className="list-disc list-inside space-y-0.5 ml-2 text-[11px]">
                      <li>互相追逐時容易「暴衝」，速度極快、方向難測</li>
                      <li>爭奪窗邊觀景位置，可能推撞對方</li>
                      <li>玩耍時可能同時撲向窗戶或網面</li>
                      <li>其中一隻受驚時，另一隻可能跟隨衝撞</li>
                      <li>建立地盤意識，窗邊成為「必爭之地」</li>
                    </ul>
                    <p className="mt-1 text-[11px]"><strong className="text-foreground">風險提示：</strong>兩貓互動產生的衝擊力是單貓的數倍，網面需承受更高強度的撞擊。</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Multiple Cats */}
            <div className="p-3 bg-risk-high/5 rounded-lg border border-risk-high/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-risk-high/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">3️⃣+</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-risk-high text-sm mb-1">三隻或以上多貓飼養</h3>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p><strong className="text-foreground">常見行為：</strong></p>
                    <ul className="list-disc list-inside space-y-0.5 ml-2 text-[11px]">
                      <li>群體追逐場面混亂，「連環暴衝」頻繁發生</li>
                      <li>貓咪之間可能產生衝突，打鬥時失控衝撞</li>
                      <li>地盤爭奪更激烈，窗邊區域壓力倍增</li>
                      <li>「羊群效應」：一隻衝，全部跟著衝</li>
                      <li>網面長期受多隻貓抓撓，磨損速度加快</li>
                      <li>新貓加入時適應期更易發生意外</li>
                    </ul>
                    <p className="mt-1 text-[11px]"><strong className="text-foreground">風險提示：</strong>多貓家庭屬於高風險類別，網面承受的壓力呈倍數增長，必須選用高強度防護方案。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 p-2 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-[10px] text-muted-foreground">
              <strong className="text-foreground">💡 專業建議：</strong>
              無論飼養多少隻貓，都應預留「安全餘量」。我們的度尺師傅會評估您家中貓咪的互動模式，確保防護方案能應對最壞情況。
            </p>
          </div>
        </Card>

      </div>

      {/* ===== PAGE 4: Physical Impact Analysis ===== */}
      <div ref={page4Ref} className="space-y-4 bg-background p-4 mt-6">
        <Card className="p-4 shadow-lg overflow-hidden relative">
          <div className="flex items-center gap-3">
            <img 
              src={dfLogo} 
              alt="DF 創意家居" 
              className="h-8 w-auto object-contain"
            />
            <div>
              <h2 className="text-base font-bold">參考資料（三）：物理實測對照</h2>
              <p className="text-xs text-muted-foreground">以中型貓（體重中位數 4.5kg）為基準的衝擊力分析</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 shadow-lg">
          <div className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-xs text-muted-foreground">
                基準：中型貓體重中位數 <span className="font-bold text-foreground">4.5 kg</span>
              </p>
            </div>

            {/* Impact Force Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-primary/10">
                    <th className="border border-border p-2 text-left font-semibold">行為狀態</th>
                    <th className="border border-border p-2 text-center font-semibold">體重倍數</th>
                    <th className="border border-border p-2 text-center font-semibold">等效衝擊力</th>
                    <th className="border border-border p-2 text-left font-semibold">說明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-risk-low/5">
                    <td className="border border-border p-2">
                      <div className="flex items-center gap-2">
                        <span className="text-risk-low">🟢</span>
                        <span className="font-medium">靜態站立 / 躺臥</span>
                      </div>
                    </td>
                    <td className="border border-border p-2 text-center font-bold">1x</td>
                    <td className="border border-border p-2 text-center">4.5 kg</td>
                    <td className="border border-border p-2 text-muted-foreground">貓咪平靜地趴在網面上</td>
                  </tr>
                  <tr className="bg-risk-medium/5">
                    <td className="border border-border p-2">
                      <div className="flex items-center gap-2">
                        <span className="text-risk-medium">🟠</span>
                        <span className="font-medium">攀爬 / 跳躍落地</span>
                      </div>
                    </td>
                    <td className="border border-border p-2 text-center font-bold">3-5x</td>
                    <td className="border border-border p-2 text-center">13.5 - 22.5 kg</td>
                    <td className="border border-border p-2 text-muted-foreground">貓咪跳上窗台或從高處跳落網面</td>
                  </tr>
                  <tr className="bg-risk-high/5">
                    <td className="border border-border p-2">
                      <div className="flex items-center gap-2">
                        <span className="text-risk-high">🔴</span>
                        <span className="font-medium">全速衝撞</span>
                      </div>
                    </td>
                    <td className="border border-border p-2 text-center font-bold">8-12x</td>
                    <td className="border border-border p-2 text-center">36 - 54 kg</td>
                    <td className="border border-border p-2 text-muted-foreground">貓咪追逐獵物或受驚暴衝直撞網面</td>
                  </tr>
                  <tr className="bg-secondary/50">
                    <td className="border border-border p-2">
                      <div className="flex items-center gap-2">
                        <span>🐾</span>
                        <span className="font-medium">持續抓撓</span>
                      </div>
                    </td>
                    <td className="border border-border p-2 text-center font-bold">2-4x</td>
                    <td className="border border-border p-2 text-center">9 - 18 kg</td>
                    <td className="border border-border p-2 text-muted-foreground">貓咪用爪抓網，產生集中點壓力</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Additional Notes */}
            <div className="grid gap-3 md:grid-cols-2 mt-4">
              <div className="p-3 bg-risk-high/5 rounded-lg border border-risk-high/20">
                <h4 className="font-medium text-xs text-risk-high mb-1">⚠️ 極端情況</h4>
                <p className="text-[10px] text-muted-foreground">
                  多貓同時衝撞時，衝擊力會疊加。兩隻4.5kg貓同時暴衝可產生<strong className="text-foreground">超過100kg</strong>的瞬間衝擊力。
                </p>
              </div>
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-medium text-xs text-primary mb-1">💡 抓撓損耗</h4>
                <p className="text-[10px] text-muted-foreground">
                  持續抓撓會造成網面局部疲勞，長期累積可使網面強度下降<strong className="text-foreground">30-50%</strong>。
                </p>
              </div>
            </div>

            <div className="p-2 bg-secondary/50 rounded-lg border border-border">
              <p className="text-[10px] text-muted-foreground text-center">
                <strong className="text-foreground">⚠️ 重要提示：</strong>以上數據基於中型貓體重中位數估算，實際衝擊力會因貓咪品種、體型及個體行為差異而有所不同，僅供參考。
              </p>
            </div>
          </div>
        </Card>

        {/* Footer for Page 4 */}
        <Card className="p-4 shadow-lg bg-gradient-card">
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              © DF 創意家居 | 全港領先的防貓網工程公司
            </p>
            <p className="text-[10px] text-muted-foreground">
              我們的專業團隊將會在預約時間準時上門，為您度身訂造「最安全」的守護方案。
            </p>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Button
          onClick={handleExportPDF}
          className="flex-1 gap-2 bg-gradient-hero hover:opacity-90 transition-opacity"
        >
          <Download className="w-4 h-4" />
          匯出 PDF 報告
        </Button>
        <Button variant="outline" onClick={onReset} className="flex-1 gap-2">
          <RotateCcw className="w-4 h-4" />
          重新評估
        </Button>
      </div>
    </div>
  );
}
