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
  catCount: string;
  heaviestCatWeight: string;
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
    if (totalScore <= 4) {
      return {
        level: "low",
        label: "低風險用戶",
        color: "bg-risk-low",
        textColor: "text-risk-low",
        borderColor: "border-risk-low",
        icon: Shield,
        description:
          "您的貓咪生活環境相對安全。我們的標準防貓網方案已能提供頂級防護，度尺時我們將提供最佳美觀建議。",
      };
    } else if (totalScore <= 10) {
      return {
        level: "medium",
        label: "中度關注用戶",
        color: "bg-risk-medium",
        textColor: "text-risk-medium",
        borderColor: "border-risk-medium",
        icon: AlertTriangle,
        description:
          "您的貓咪有部分活躍行為，或者窗戶結構有輕微老化。我們建議選用加固版防貓網或專用網身，度尺時師傅將重點檢查結構並給予加固方案。",
      };
    } else {
      return {
        level: "high",
        label: "高風險用戶",
        color: "bg-risk-high",
        textColor: "text-risk-high",
        borderColor: "border-risk-high",
        icon: AlertCircle,
        description:
          "您的貓咪或家居環境存在多重高風險因素（如暴衝行為、窗鎖老化、期望用廉價方案）。我們將派出資深貓網安全顧問上門，我們強烈建議您選用最高安全規格的「DF Pro 級別」方案。",
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
            <div className={`w-14 h-14 rounded-full ${risk.color} flex items-center justify-center flex-shrink-0`}>
              <RiskIcon className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${risk.color} text-white`}>
                  {risk.label}
                </span>
                <span className="text-2xl md:text-3xl font-bold">{totalScore} 分</span>
                <span className="text-sm text-muted-foreground">/ 21 分</span>
              </div>
              <p className="text-sm md:text-base text-foreground leading-relaxed">{risk.description}</p>
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
                  <span className="text-muted-foreground">地址</span>
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
                  <span className="text-muted-foreground">貓咪數量</span>
                  <span className="font-medium">{formData.catCount} 隻</span>
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
