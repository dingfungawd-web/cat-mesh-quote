import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, RotateCcw, Shield, AlertTriangle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import dfLogo from "@/assets/df-logo.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();

  const getRiskLevel = () => {
    if (totalScore <= 6) {
      return {
        level: "low",
        label: t("result.riskLow"),
        color: "bg-risk-low",
        textColor: "text-risk-low",
        borderColor: "border-risk-low",
        icon: Shield,
        assessment: t("risk.low.assessment"),
        recommendation: t("risk.low.recommendation"),
        advice: t("risk.low.advice"),
      };
    } else if (totalScore <= 13) {
      return {
        level: "medium",
        label: t("result.riskMedium"),
        color: "bg-risk-medium",
        textColor: "text-risk-medium",
        borderColor: "border-risk-medium",
        icon: AlertTriangle,
        assessment: t("risk.medium.assessment"),
        recommendation: t("risk.medium.recommendation"),
        advice: t("risk.medium.advice"),
      };
    } else {
      return {
        level: "high",
        label: t("result.riskHigh"),
        color: "bg-risk-high",
        textColor: "text-risk-high",
        borderColor: "border-risk-high",
        icon: AlertCircle,
        assessment: t("risk.high.assessment"),
        recommendation: t("risk.high.recommendation"),
        advice: t("risk.high.advice"),
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
      title: t("toast.generating"),
      description: t("toast.generatingDesc"),
    });

    try {
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const pages = [page1Ref.current, page2Ref.current, page3Ref.current, page4Ref.current];
      for (let i = 0; i < pages.length; i++) {
        if (i > 0) pdf.addPage();
        const canvas = await html2canvas(pages[i], { scale: 2, useCORS: true, logging: false, backgroundColor: "#ffffff" });
        const imgData = canvas.toDataURL("image/png");
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, Math.min(imgHeight, pdfHeight));
      }

      pdf.save(`DF_Cat_Safety_Assessment_${formData.address}_${new Date().toLocaleDateString("zh-HK")}.pdf`);
      toast({ title: t("toast.downloaded"), description: t("toast.downloadedDesc") });
    } catch (error) {
      toast({ title: t("toast.exportError"), description: t("toast.exportErrorDesc"), variant: "destructive" });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg animate-pulse">
        <p className="text-center text-sm font-medium text-primary">{t("result.scrollHint")}</p>
      </div>

      {/* PAGE 1 */}
      <div ref={page1Ref} className="space-y-4 bg-background p-4">
        <Card className="p-6 shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-center gap-4">
            <img src={dfLogo} alt="DF" className="h-12 w-auto object-contain" />
            <div>
              <h1 className="text-xl font-bold">{t("result.title")}</h1>
              <p className="text-sm text-muted-foreground">{t("result.date")}{new Date().toLocaleDateString("zh-HK")}</p>
            </div>
          </div>
        </Card>

        <Card className={`p-5 shadow-lg border-2 ${risk.borderColor}`}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full ${risk.color} flex items-center justify-center flex-shrink-0 ${risk.level === 'high' ? 'animate-warning-flash' : ''}`}>
              <RiskIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${risk.color} text-white`}>{risk.label}</span>
                <span className="text-2xl font-bold">{totalScore}/19</span>
              </div>
              <div className="space-y-3">
                <div><h4 className="font-semibold text-sm mb-1">{t("result.assessment")}</h4><p className="text-sm leading-relaxed">{risk.assessment}</p></div>
                <div><h4 className="font-semibold text-sm mb-1">{t("result.recommendation")}</h4><p className="text-sm leading-relaxed">{risk.recommendation}</p></div>
                <div className="bg-secondary/50 rounded-lg p-2"><h4 className="font-semibold text-sm mb-1">{t("result.advice")}</h4><p className="text-xs text-muted-foreground italic">{risk.advice}</p></div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5 shadow-lg">
          <h2 className="text-base font-semibold mb-3">{t("result.details")}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground border-b pb-1">{t("result.basicInfo")}</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">{t("result.whatsapp")}</span><span className="font-medium text-right max-w-[60%]">{formData.address}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{t("result.buildingType")}</span><span className="font-medium">{formData.buildingType}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{t("result.floor")}</span><span className="font-medium">{formData.floorLevel}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{t("result.windowCount")}</span><span className="font-medium">{formData.windowCount} {t("unit.pieces")}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{t("result.doorCount")}</span><span className="font-medium">{formData.doorCount} {t("unit.pieces")}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{t("result.heaviestCat")}</span><span className="font-medium">{formData.heaviestCatWeight} {t("unit.kg")}</span></div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground border-b pb-1">{t("result.scoreBreakdown")}</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between items-center"><span className="text-muted-foreground">{t("result.catCount")}</span><span className={`font-medium px-2 py-0.5 rounded ${formData.q3Score >= 3 ? 'bg-risk-high/10 text-risk-high' : 'bg-secondary'}`}>{formData.q3Score} {t("unit.points")}</span></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">{t("result.windowBehavior")}</span><span className={`font-medium px-2 py-0.5 rounded ${formData.q5Score >= 2 ? 'bg-risk-high/10 text-risk-high' : 'bg-secondary'}`}>{formData.q5Score} {t("unit.points")}</span></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">{t("result.windowStructure")}</span><span className={`font-medium px-2 py-0.5 rounded ${formData.q6Score >= 2 ? 'bg-risk-high/10 text-risk-high' : 'bg-secondary'}`}>{formData.q6Score} {t("unit.points")}</span></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">{t("result.catPersonality")}</span><span className={`font-medium px-2 py-0.5 rounded ${formData.q7Score >= 2 ? 'bg-risk-high/10 text-risk-high' : 'bg-secondary'}`}>{formData.q7Score} {t("unit.points")}</span></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">{t("result.highRisk")}</span><span className={`font-medium px-2 py-0.5 rounded ${formData.q8Score >= 2 ? 'bg-risk-high/10 text-risk-high' : 'bg-secondary'}`}>{formData.q8Score} {t("unit.points")}</span></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">{t("result.expectation")}</span><span className={`font-medium px-2 py-0.5 rounded ${formData.q9Score >= 2 ? 'bg-risk-high/10 text-risk-high' : 'bg-secondary'}`}>{formData.q9Score} {t("unit.points")}</span></div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-lg bg-gradient-card">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-base">{t("result.thanks")}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-lg mx-auto">{t("result.thanksDesc")}<strong className="text-foreground">{t("result.thanksHighlight")}</strong></p>
            <p className="text-xs text-muted-foreground">{t("result.thanksNote")}</p>
          </div>
        </Card>
      </div>

      <div className="my-8 text-center"><div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full"><span className="text-sm font-medium text-primary">{t("result.reference")}</span></div></div>

      {/* PAGE 2: Reference Material 1 - Cat Breed Analysis */}
      <div ref={page2Ref} className="space-y-4 bg-background p-4">
        <Card className="p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <img src={dfLogo} alt="DF" className="h-8 w-auto" />
            <div>
              <h2 className="text-base font-bold">{t("ref1.title")}</h2>
              <p className="text-xs text-muted-foreground">{t("ref1.desc")}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 shadow-lg">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-risk-high mb-2">{t("ref1.high")}</h3>
              <p className="text-xs text-muted-foreground">孟加拉貓（Bengal）、阿比西尼亞貓（Abyssinian）、暹羅貓（Siamese）、緬甸貓（Burmese）、東方短毛貓（Oriental Shorthair）、索馬利貓（Somali）、德文捲毛貓（Devon Rex）、柯尼斯捲毛貓（Cornish Rex）、新加坡貓（Singapura）、日本短尾貓（Japanese Bobtail）</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-risk-medium mb-2">{t("ref1.medium")}</h3>
              <p className="text-xs text-muted-foreground">美國短毛貓（American Shorthair）、英國短毛貓（British Shorthair）、蘇格蘭摺耳貓（Scottish Fold）、俄羅斯藍貓（Russian Blue）、挪威森林貓（Norwegian Forest Cat）、緬因貓（Maine Coon）、土耳其安哥拉貓（Turkish Angora）、曼切堪貓（Munchkin）、埃及貓（Egyptian Mau）、巴釐貓（Balinese）</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-risk-low mb-2">{t("ref1.low")}</h3>
              <p className="text-xs text-muted-foreground">波斯貓（Persian）、布偶貓（Ragdoll）、異國短毛貓（Exotic Shorthair）、喜馬拉雅貓（Himalayan）、伯曼貓（Birman）、塞爾凱克捲毛貓（Selkirk Rex）、巴曼貓（Burmilla）、沙特爾貓（Chartreux）、英國長毛貓（British Longhair）、拿破崙貓（Napoleon）</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">{t("ref1.mixed")}</h3>
              <p className="text-xs text-muted-foreground">唐貓（Domestic Cat）：作為香港最常見的家貓品種，唐貓的性格差異極大，需要個別評估。部分唐貓具有強大的狩獵本能及高敏捷性，屬於高風險類別；但也有相當一部分性格溫順，接近低風險類別。</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 mt-4">
              <p className="text-xs text-muted-foreground italic">{t("ref1.note")}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* PAGE 3: Reference Material 2 - Multi-Cat Behavior Analysis */}
      <div ref={page3Ref} className="space-y-4 bg-background p-4 mt-6">
        <Card className="p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <img src={dfLogo} alt="DF" className="h-8 w-auto" />
            <div>
              <h2 className="text-base font-bold">{t("ref2.title")}</h2>
              <p className="text-xs text-muted-foreground">{t("ref2.desc")}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 shadow-lg">
          <div className="space-y-4">
            <div className="border-b pb-3">
              <h3 className="text-sm font-semibold mb-2">{t("ref2.single")}</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• 行為風險相對可控，主要風險來自貓咪自身的「探索本能」及「狩獵反應」</li>
                <li>• 突發風險：見到雀鳥、昆蟲時的瞬間撲擊</li>
                <li>• 建議：防貓網需承受單貓體重的 8-12 倍衝擊力</li>
              </ul>
            </div>
            <div className="border-b pb-3">
              <h3 className="text-sm font-semibold mb-2">{t("ref2.double")}</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• 社交追逐是最常見行為，一方逃跑另一方追趕，易形成高速衝撞</li>
                <li>• 遊戲中可能同時撞擊同一位置，衝擊力疊加</li>
                <li>• 領地爭奪時可能於窗邊發生「摔角」或「追打」</li>
                <li>• 建議：防貓網需承受兩隻貓體重總和的 10-15 倍衝擊力</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">{t("ref2.multiple")}</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• 「群體暴衝」：一隻貓驚嚇後，可能引發連鎖反應，多隻貓同時奔跑</li>
                <li>• 社交等級競爭更頻繁，打架可能更激烈</li>
                <li>• 同一窗口可能長期有多隻貓躺臥，增加靜態負荷</li>
                <li>• 建議：防貓網需達到商業級別強度，並於高頻使用位置加固</li>
              </ul>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 mt-4">
              <p className="text-xs text-muted-foreground italic">{t("ref2.note")}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* PAGE 4: Reference Material 3 - Physical Impact Analysis */}
      <div ref={page4Ref} className="space-y-4 bg-background p-4 mt-6">
        <Card className="p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <img src={dfLogo} alt="DF" className="h-8 w-auto" />
            <div>
              <h2 className="text-base font-bold">{t("ref3.title")}</h2>
              <p className="text-xs text-muted-foreground">{t("ref3.desc")}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 shadow-lg">
          <div className="space-y-3">
            <div className="bg-secondary/50 rounded-lg p-2 mb-3">
              <p className="text-xs font-medium text-center">{t("ref3.basis")}：4.5kg</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-semibold">{t("ref3.behavior")}</th>
                    <th className="text-center py-2 font-semibold">{t("ref3.multiplier")}</th>
                    <th className="text-center py-2 font-semibold">{t("ref3.impact")}</th>
                    <th className="text-left py-2 font-semibold">{t("ref3.description")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">{t("ref3.static")}</td>
                    <td className="text-center py-2">1x</td>
                    <td className="text-center py-2">~4.5 kg</td>
                    <td className="py-2 text-muted-foreground">{t("ref3.staticDesc")}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">{t("ref3.climb")}</td>
                    <td className="text-center py-2">3-5x</td>
                    <td className="text-center py-2">~13-23 kg</td>
                    <td className="py-2 text-muted-foreground">{t("ref3.climbDesc")}</td>
                  </tr>
                  <tr className="border-b bg-risk-medium/10">
                    <td className="py-2 font-medium">{t("ref3.rush")}</td>
                    <td className="text-center py-2 font-medium">8-12x</td>
                    <td className="text-center py-2 font-medium">~36-54 kg</td>
                    <td className="py-2 text-muted-foreground">{t("ref3.rushDesc")}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">{t("ref3.scratch")}</td>
                    <td className="text-center py-2">集中力</td>
                    <td className="text-center py-2">~2-3 kg/cm²</td>
                    <td className="py-2 text-muted-foreground">{t("ref3.scratchDesc")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="space-y-2 mt-4">
              <div className="bg-risk-high/10 rounded-lg p-2">
                <p className="text-xs"><span className="font-semibold text-risk-high">{t("ref3.extreme")}：</span>{t("ref3.extremeDesc")}</p>
              </div>
              <div className="bg-risk-medium/10 rounded-lg p-2">
                <p className="text-xs"><span className="font-semibold text-risk-medium">{t("ref3.wear")}：</span>{t("ref3.wearDesc")}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground italic mt-3">{t("ref3.disclaimer")}</p>
          </div>
        </Card>
        <Card className="p-4 shadow-lg bg-gradient-card">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">{t("ref3.footer")}</p>
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Button onClick={handleExportPDF} className="flex-1 gap-2 bg-gradient-hero hover:opacity-90"><Download className="w-4 h-4" />{t("btn.export")}</Button>
        <Button variant="outline" onClick={onReset} className="flex-1 gap-2"><RotateCcw className="w-4 h-4" />{t("btn.reset")}</Button>
      </div>
    </div>
  );
}
