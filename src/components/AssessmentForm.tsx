import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, FileText, CheckCircle2 } from "lucide-react";
import { AssessmentResult } from "./AssessmentResult";
import { useToast } from "@/hooks/use-toast";

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

const initialFormData: FormData = {
  address: "",
  buildingType: "",
  floorLevel: "",
  windowCount: "",
  doorCount: "",
  heaviestCatWeight: "",
  q3Score: -1,
  q5Score: -1,
  q6Score: -1,
  q7Score: -1,
  q8Score: -1,
  q9Score: -1,
};

const scoredQuestions = [
  {
    id: "q3",
    question: "三、家中的貓咪總數？",
    options: [
      { value: 1, label: "1 分：1 隻" },
      { value: 2, label: "2 分：2 隻" },
      { value: 3, label: "3 分：3 - 5 隻" },
      { value: 4, label: "4 分：6 隻或以上" },
    ],
  },
  {
    id: "q5",
    question: "四、貓咪的窗邊行為模式？",
    options: [
      { value: 0, label: "0 分：只會睡在窗邊或遠觀" },
      { value: 1, label: "1 分：偶爾會跳上窗台，但不會推網或抓網" },
      { value: 2, label: "2 分：經常會扒窗、推網或抓咬網邊" },
      { value: 3, label: "3 分：有嘗試過掙脫或打開紗窗、推開舊網的行為" },
    ],
  },
  {
    id: "q6",
    question: "五、窗戶結構與通風習慣？",
    options: [
      { value: 0, label: "0 分：窗戶多為鉸鏈式外開窗或已鎖緊" },
      { value: 1, label: "1 分：窗戶多為推拉式，但有窗鎖或安全扣" },
      { value: 2, label: "2 分：窗戶多為推拉式，且經常需要大力開關或有異音" },
      { value: 3, label: "3 分：窗戶為推拉式，且窗鎖已老化或破損，無法完全緊閉" },
    ],
  },
  {
    id: "q7",
    question: "六、您的貓咪性格屬於？",
    options: [
      { value: 0, label: "0 分：安靜、年老、不愛跳躍" },
      { value: 1, label: "1 分：一般好動，喜歡在貓跳台上休息" },
      { value: 2, label: "2 分：極度活躍，經常玩追逐遊戲或跑酷" },
      { value: 3, label: "3 分：有「暴衝」（Zoomies）或習慣高速衝撞的行為" },
    ],
  },
  {
    id: "q8",
    question: "七、家中是否有其他高危險環境？",
    options: [
      { value: 0, label: "0 分：無" },
      { value: 1, label: "1 分：貓跳台/櫃子緊鄰窗戶，貓咪可直接跳上窗台" },
      { value: 2, label: "2 分：家中經常有幼童或大型寵物，可能誤推防貓網" },
      { value: 3, label: "3 分：家中貓咪有「打架」或「爭奪地盤」，可能導致高速衝撞窗口" },
    ],
  },
  {
    id: "q9",
    question: "八、您對「防貓網」的安裝預期？",
    options: [
      { value: 0, label: "0 分：安全穩固，貓咪生命安全最重要" },
      { value: 1, label: "1 分：安全固然重要，但希望兼顧最大採光和美觀" },
      { value: 2, label: "2 分：希望用最實惠的方案，能擋住貓咪就足夠" },
      { value: 3, label: "3 分：希望做出來「視覺隱形」，並且希望盡量節省預算" },
    ],
  },
];

export function AssessmentForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const updateFormData = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateTotalScore = () => {
    return formData.q3Score + formData.q5Score + formData.q6Score + formData.q7Score + formData.q8Score + formData.q9Score;
  };

  const isStep1Valid = () => {
    return (
      formData.address.trim() !== "" &&
      formData.buildingType.trim() !== "" &&
      formData.floorLevel.trim() !== "" &&
      formData.windowCount.trim() !== "" &&
      formData.heaviestCatWeight.trim() !== ""
    );
  };

  const isStep2Valid = () => {
    return (
      formData.q3Score >= 1 &&
      formData.q5Score >= 0 &&
      formData.q6Score >= 0 &&
      formData.q7Score >= 0 &&
      formData.q8Score >= 0 &&
      formData.q9Score >= 0
    );
  };

  const handleNext = () => {
    if (step === 0 && !isStep1Valid()) {
      toast({
        title: "請填寫所有必填項目",
        description: "所有欄位均為必填",
        variant: "destructive",
      });
      return;
    }
    if (step === 1 && !isStep2Valid()) {
      toast({
        title: "請完成所有評分問題",
        description: "請為每個問題選擇一個選項",
        variant: "destructive",
      });
      return;
    }
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const totalScore = calculateTotalScore();
    const getRiskLevel = (score: number) => {
      if (score <= 6) return "穩定防護級別";
      if (score <= 13) return "高度關注級別";
      return "極高風險/專業顧問級別";
    };

    const payload = {
      timestamp: new Date().toLocaleString("zh-HK"),
      address: formData.address,
      floor: formData.floorLevel,
      buildingType: formData.buildingType,
      windowCount: formData.windowCount,
      doorCount: formData.doorCount || "0",
      heaviestCatWeight: formData.heaviestCatWeight,
      q3Score: formData.q3Score,
      q5Score: formData.q5Score,
      q6Score: formData.q6Score,
      q7Score: formData.q7Score,
      q8Score: formData.q8Score,
      q9Score: formData.q9Score,
      totalScore: totalScore,
      riskLevel: getRiskLevel(totalScore),
    };

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbwM2k5r3IAm6TdpT3wtiLITBCQGpxJ1r1NDsjuPRECRO-LbubCLSRatmx-F9Afas0IsDg/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      toast({
        title: "提交成功！",
        description: "您的評估已成功提交，我們的團隊會盡快與您聯繫。",
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error("Sync error:", error);
      toast({
        title: "提交失敗",
        description: "請稍後再試或聯繫我們",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setStep(0);
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <AssessmentResult
        formData={formData}
        totalScore={calculateTotalScore()}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-muted-foreground">
            步驟 {step + 1} / {totalSteps}
          </span>
          <span className="text-sm font-medium text-primary">
            {Math.round(progress)}% 完成
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-3">
          <span className={`text-xs ${step >= 0 ? "text-primary font-medium" : "text-muted-foreground"}`}>
            基本資料
          </span>
          <span className={`text-xs ${step >= 1 ? "text-primary font-medium" : "text-muted-foreground"}`}>
            風險評估
          </span>
          <span className={`text-xs ${step >= 2 ? "text-primary font-medium" : "text-muted-foreground"}`}>
            確認提交
          </span>
        </div>
      </div>

      {/* Step 1: Basic Information */}
      {step === 0 && (
        <Card className="p-6 md:p-8 animate-fade-in shadow-lg">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">1</span>
            基本資料
          </h2>
          <div className="space-y-5">
            <div>
              <Label htmlFor="address" className="text-sm font-medium">
                預約度尺地址 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="address"
                placeholder="請輸入您的地址"
                value={formData.address}
                onChange={(e) => updateFormData("address", e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">
                一、戶型與居住樓層？ <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-3 mt-1.5">
                <div>
                  <Label htmlFor="buildingType" className="text-xs text-muted-foreground">
                    戶型
                  </Label>
                  <select
                    id="buildingType"
                    value={formData.buildingType}
                    onChange={(e) => updateFormData("buildingType", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">請選擇</option>
                    <option value="大廈">大廈</option>
                    <option value="村屋/別墅">村屋/別墅</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="floorLevel" className="text-xs text-muted-foreground">
                    樓層
                  </Label>
                  <Input
                    id="floorLevel"
                    placeholder="例如：15"
                    value={formData.floorLevel}
                    onChange={(e) => updateFormData("floorLevel", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">
                二、家中門窗戶總數量？ <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-3 mt-1.5">
                <div>
                  <Label htmlFor="windowCount" className="text-xs text-muted-foreground">
                    窗
                  </Label>
                  <Input
                    id="windowCount"
                    placeholder="數量"
                    type="number"
                    min="0"
                    value={formData.windowCount}
                    onChange={(e) => updateFormData("windowCount", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="doorCount" className="text-xs text-muted-foreground">
                    門
                  </Label>
                  <Input
                    id="doorCount"
                    placeholder="數量"
                    type="number"
                    min="0"
                    value={formData.doorCount}
                    onChange={(e) => updateFormData("doorCount", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="heaviestCatWeight" className="text-sm font-medium">
                三、最重貓咪的體重？（單位：Kg） <span className="text-destructive">*</span>
              </Label>
              <Input
                id="heaviestCatWeight"
                placeholder="例如：5.5"
                type="number"
                step="0.1"
                min="0"
                value={formData.heaviestCatWeight}
                onChange={(e) => updateFormData("heaviestCatWeight", e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Step 2: Scored Questions */}
      {step === 1 && (
        <div className="space-y-6 animate-fade-in">
          <Card className="p-6 md:p-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">2</span>
              風險評估問題
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              以下問題將用於評估您家中的防護需求等級
            </p>
            <div className="space-y-8">
              {scoredQuestions.map((q, index) => (
                <div key={q.id} className="pb-6 border-b border-border last:border-0 last:pb-0">
                  <Label className="text-base font-medium block mb-4">
                    {q.question} <span className="text-destructive">*</span>
                  </Label>
                  <RadioGroup
                    value={formData[`${q.id}Score` as keyof FormData]?.toString()}
                    onValueChange={(value) =>
                      updateFormData(`${q.id}Score` as keyof FormData, parseInt(value))
                    }
                    className="space-y-3"
                  >
                    {q.options.map((option) => (
                      <div
                        key={option.value}
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer hover:border-primary/50 hover:bg-primary/5 ${
                          formData[`${q.id}Score` as keyof FormData] === option.value
                            ? "border-primary bg-primary/10"
                            : "border-border"
                        }`}
                        onClick={() =>
                          updateFormData(`${q.id}Score` as keyof FormData, option.value)
                        }
                      >
                        <RadioGroupItem value={option.value.toString()} id={`${q.id}-${option.value}`} />
                        <Label
                          htmlFor={`${q.id}-${option.value}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 2 && (
        <Card className="p-6 md:p-8 animate-fade-in shadow-lg">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">3</span>
            確認提交
          </h2>
          <div className="space-y-6">
            <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground">基本資料</h3>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">地址：</span>
                  <span className="font-medium">{formData.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">戶型：</span>
                  <span className="font-medium">{formData.buildingType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">樓層：</span>
                  <span className="font-medium">{formData.floorLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">窗數量：</span>
                  <span className="font-medium">{formData.windowCount} 個</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">門數量：</span>
                  <span className="font-medium">{formData.doorCount} 個</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">最重貓咪：</span>
                  <span className="font-medium">{formData.heaviestCatWeight} Kg</span>
                </div>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground">風險評估得分</h3>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">貓咪數量：</span>
                  <span className="font-medium">{formData.q3Score} 分</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">窗邊行為：</span>
                  <span className="font-medium">{formData.q5Score} 分</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">窗戶結構：</span>
                  <span className="font-medium">{formData.q6Score} 分</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">貓咪性格：</span>
                  <span className="font-medium">{formData.q7Score} 分</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">高危環境：</span>
                  <span className="font-medium">{formData.q8Score} 分</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">安裝預期：</span>
                  <span className="font-medium">{formData.q9Score} 分</span>
                </div>
              </div>
              <div className="pt-3 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="font-medium">總分：</span>
                  <span className="text-2xl font-bold text-primary">{calculateTotalScore()} 分</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-primary/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                提交後，我們的專業團隊將根據您的評估結果，為您準備度尺方案。您也可以匯出 PDF 報告以供參考。
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 0}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          上一步
        </Button>
        {step < totalSteps - 1 ? (
          <Button onClick={handleNext} className="gap-2">
            下一步
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-2 bg-gradient-hero hover:opacity-90 transition-opacity"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                提交中...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                提交評估
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
