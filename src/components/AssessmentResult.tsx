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
  const resultRef = useRef<HTMLDivElement>(null);
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
        recommendation: "選用 DF 標準系列防貓網已足以應付日常需要。雖然風險較低，但我們絕不掉以輕心。度尺師傅上門時，仍會重點檢查您的鋁窗螺絲及膠條是否有老化跡象，確保安裝基底穩固。",
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
        assessment: "注意！您的評估顯示家居存在「中度風險」。這通常與多貓家庭、貓咪性格較活潑（如喜愛抓網或跳躍）有關。一般的防蚊網結構在面對連續衝擊時，穩定性可能不足。",
        recommendation: "我們強烈建議選用 DF 專業系列防貓網。此方案會針對網面扣件及滑軌進行補強，並加裝專用的「防開安全鎖」，防止聰明的貓咪自行撥開網窗。",
        advice: "「多貓環境下，網面的磨損與受壓是呈倍數增長的。度尺師傅會現場評估您的鋁窗軌道深度，為您制定一套具備『抗抓撓』及『高承重』的加固方案。」",
      };
    } else {
      return {
        level: "high",
        label: "【極高風險警告】",
        color: "bg-risk-high",
        textColor: "text-risk-high",
        borderColor: "border-risk-high",
        icon: AlertCircle,
        assessment: "緊急預警！您的評估分數極高，屬於「極高風險類別」。這代表您的貓咪具備極強的破壞力或衝刺力（如暴衝習慣），或者您的窗戶結構已面臨老化風險。在這種情況下，傳統防蚊網絕對無法保障貓咪安全。",
        recommendation: "必須選用最高規格的 DF Pro 守護系列。此系列採用高強度不鏽鋼網身及強化鋁合金框架，專為高空、多貓及極度活躍的貓咪設計。",
        advice: "「作為專業的防貓網公司，我們必須坦誠告誡：您的情況若選用不當材料，極易發生意外。度尺師傅將派出高級顧問，現場進行壓力測試。如最終方案未能達到我們的安全標準，我們寧願拒絕施工，亦絕不拿貓咪生命冒險。」",
      };
    }
  };

  const risk = getRiskLevel();
  const RiskIcon = risk.icon;

  const handleExportPDF = async () => {
    if (!resultRef.current) return;

    toast({
      title: "正在生成 PDF...",
      description: "請稍候",
    });

    try {
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`DF貓咪居家安全評估_${formData.address}_${new Date().toLocaleDateString("zh-HK")}.pdf`);

      toast({
        title: "PDF 已下載",
        description: "您的評估報告已成功匯出",
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
      <div ref={resultRef} className="space-y-6 bg-background p-1">
        {/* Header */}
        <Card className="p-6 md:p-8 shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src={dfLogo} 
                alt="DF 創意家居" 
                className="h-14 w-auto object-contain"
              />
              <div>
                <h1 className="text-xl md:text-2xl font-bold">貓咪居家安全評估報告</h1>
                <p className="text-sm text-muted-foreground">
                  評估日期：{new Date().toLocaleDateString("zh-HK")}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Risk Level Card */}
        <Card className={`p-6 md:p-8 shadow-lg border-2 ${risk.borderColor}`}>
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-full ${risk.color} flex items-center justify-center flex-shrink-0 ${risk.level === 'high' ? 'animate-warning-flash' : ''}`}>
              <RiskIcon className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${risk.color} text-white`}>
                  {risk.label}
                </span>
                <span className="text-2xl md:text-3xl font-bold">{totalScore}/19</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-1">評估結果：</h4>
                  <p className="text-sm text-foreground leading-relaxed">{risk.assessment}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm mb-1">DF 專業建議：</h4>
                  <p className="text-sm text-foreground leading-relaxed">{risk.recommendation}</p>
                </div>
                
                <div className="bg-secondary/50 rounded-lg p-3">
                  <h4 className="font-semibold text-sm mb-1">安全顧問叮囑：</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">{risk.advice}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Details Card */}
        <Card className="p-6 md:p-8 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">評估詳情</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground border-b border-border pb-2">基本資料</h3>
              <div className="space-y-2 text-sm">
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
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground border-b border-border pb-2">評分明細</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">貓咪數量</span>
                  <span className={`font-medium px-2 py-0.5 rounded ${formData.q3Score >= 3 ? 'bg-risk-high/10 text-risk-high' : 'bg-secondary'}`}>
                    {formData.q3Score} 分
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">窗邊行為模式</span>
                  <span className={`font-medium px-2 py-0.5 rounded ${formData.q5Score >= 2 ? 'bg-risk-high/10 text-risk-high' : 'bg-secondary'}`}>
                    {formData.q5Score} 分
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">窗戶結構習慣</span>
                  <span className={`font-medium px-2 py-0.5 rounded ${formData.q6Score >= 2 ? 'bg-risk-high/10 text-risk-high' : 'bg-secondary'}`}>
                    {formData.q6Score} 分
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">貓咪性格</span>
                  <span className={`font-medium px-2 py-0.5 rounded ${formData.q7Score >= 2 ? 'bg-risk-high/10 text-risk-high' : 'bg-secondary'}`}>
                    {formData.q7Score} 分
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">高危環境</span>
                  <span className={`font-medium px-2 py-0.5 rounded ${formData.q8Score >= 2 ? 'bg-risk-high/10 text-risk-high' : 'bg-secondary'}`}>
                    {formData.q8Score} 分
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">安裝預期</span>
                  <span className={`font-medium px-2 py-0.5 rounded ${formData.q9Score >= 2 ? 'bg-risk-high/10 text-risk-high' : 'bg-secondary'}`}>
                    {formData.q9Score} 分
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Cat Breed Analysis */}
        <Card className="p-6 md:p-8 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">🐱 貓種特徵分析</h2>
          <p className="text-sm text-muted-foreground mb-4">
            了解不同貓種的特性，有助於選擇最適合的防護方案。以下是香港常見的貓咪品種：
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            {/* Active/High Energy Breeds */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-risk-high border-b border-border pb-2">🔴 高活力品種（需加強防護）</h3>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-risk-high/5 rounded-lg border border-risk-high/20">
                  <p className="font-medium">孟加拉貓 Bengal</p>
                  <p className="text-muted-foreground text-xs">極度活躍、好奇心強、喜愛跳躍攀爬，衝擊力大</p>
                </div>
                <div className="p-3 bg-risk-high/5 rounded-lg border border-risk-high/20">
                  <p className="font-medium">阿比西尼亞貓 Abyssinian</p>
                  <p className="text-muted-foreground text-xs">活潑好動、喜歡探索高處、對窗外事物敏感</p>
                </div>
                <div className="p-3 bg-risk-high/5 rounded-lg border border-risk-high/20">
                  <p className="font-medium">暹羅貓 Siamese</p>
                  <p className="text-muted-foreground text-xs">聰明機靈、會嘗試開窗、情緒波動較大</p>
                </div>
                <div className="p-3 bg-risk-high/5 rounded-lg border border-risk-high/20">
                  <p className="font-medium">緬因貓 Maine Coon</p>
                  <p className="text-muted-foreground text-xs">體型龐大（可達10kg+）、力量強、撞擊力高</p>
                </div>
              </div>
            </div>

            {/* Medium Energy Breeds */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-risk-medium border-b border-border pb-2">🟠 中等活力品種（建議加固）</h3>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-risk-medium/5 rounded-lg border border-risk-medium/20">
                  <p className="font-medium">英國短毛貓 British Shorthair</p>
                  <p className="text-muted-foreground text-xs">體型壯實、平時溫和但會突然暴衝</p>
                </div>
                <div className="p-3 bg-risk-medium/5 rounded-lg border border-risk-medium/20">
                  <p className="font-medium">美國短毛貓 American Shorthair</p>
                  <p className="text-muted-foreground text-xs">性格活潑、好奇心強、喜歡追逐</p>
                </div>
                <div className="p-3 bg-risk-medium/5 rounded-lg border border-risk-medium/20">
                  <p className="font-medium">蘇格蘭摺耳貓 Scottish Fold</p>
                  <p className="text-muted-foreground text-xs">喜歡觀望窗外、偶爾會撲向窗戶</p>
                </div>
                <div className="p-3 bg-risk-medium/5 rounded-lg border border-risk-medium/20">
                  <p className="font-medium">俄羅斯藍貓 Russian Blue</p>
                  <p className="text-muted-foreground text-xs">敏感警覺、受驚時可能衝撞</p>
                </div>
              </div>
            </div>

            {/* Calm Breeds */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-risk-low border-b border-border pb-2">🟢 溫和品種（基本防護即可）</h3>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-risk-low/5 rounded-lg border border-risk-low/20">
                  <p className="font-medium">波斯貓 Persian</p>
                  <p className="text-muted-foreground text-xs">性格慵懶、活動量低、少攀爬</p>
                </div>
                <div className="p-3 bg-risk-low/5 rounded-lg border border-risk-low/20">
                  <p className="font-medium">布偶貓 Ragdoll</p>
                  <p className="text-muted-foreground text-xs">性格溫馴、放鬆、較少跳躍衝撞</p>
                </div>
                <div className="p-3 bg-risk-low/5 rounded-lg border border-risk-low/20">
                  <p className="font-medium">異國短毛貓 Exotic Shorthair</p>
                  <p className="text-muted-foreground text-xs">溫和安靜、活動量較低</p>
                </div>
              </div>
            </div>

            {/* Mixed Breeds */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground border-b border-border pb-2">🐈 唐貓 / 混種貓</h3>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-secondary/50 rounded-lg border border-border">
                  <p className="font-medium">唐貓 Domestic Cat</p>
                  <p className="text-muted-foreground text-xs">性格多變、視乎個體差異，建議依實際行為評估</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg border border-border">
                  <p className="font-medium">領養貓 Rescue Cat</p>
                  <p className="text-muted-foreground text-xs">可能有創傷經歷、受驚時反應較大，建議加強防護</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">⚠️ 重要提示：</strong>
              以上僅供參考，每隻貓咪都有獨特性格。無論品種如何，我們的度尺師傅會根據您家中貓咪的實際行為表現，制定最合適的防護方案。
            </p>
          </div>
        </Card>

        {/* Footer Message */}
        <Card className="p-6 md:p-8 shadow-lg bg-gradient-card">
          <div className="text-center space-y-3">
            <h3 className="font-semibold text-lg">感謝您完成《DF 貓咪居家安全顧問問卷》</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
              我們相信，作為全港領先的防貓網工程公司，我們的職責不僅是安裝一張網，更是
              <strong className="text-foreground">成為您貓咪一生的守護顧問。</strong>
            </p>
            <p className="text-sm text-muted-foreground">
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
