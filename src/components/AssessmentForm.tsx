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

export function AssessmentForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const scoredQuestions = [
    {
      id: "q3",
      question: t("q3.title"),
      options: [
        { value: 1, label: t("q3.opt1") },
        { value: 2, label: t("q3.opt2") },
        { value: 3, label: t("q3.opt3") },
        { value: 4, label: t("q3.opt4") },
      ],
    },
    {
      id: "q5",
      question: t("q5.title"),
      options: [
        { value: 0, label: t("q5.opt1") },
        { value: 1, label: t("q5.opt2") },
        { value: 2, label: t("q5.opt3") },
        { value: 3, label: t("q5.opt4") },
      ],
    },
    {
      id: "q6",
      question: t("q6.title"),
      options: [
        { value: 0, label: t("q6.opt1") },
        { value: 1, label: t("q6.opt2") },
        { value: 2, label: t("q6.opt3") },
        { value: 3, label: t("q6.opt4") },
      ],
    },
    {
      id: "q7",
      question: t("q7.title"),
      options: [
        { value: 0, label: t("q7.opt1") },
        { value: 1, label: t("q7.opt2") },
        { value: 2, label: t("q7.opt3") },
        { value: 3, label: t("q7.opt4") },
      ],
    },
    {
      id: "q8",
      question: t("q8.title"),
      options: [
        { value: 0, label: t("q8.opt1") },
        { value: 1, label: t("q8.opt2") },
        { value: 2, label: t("q8.opt3") },
        { value: 3, label: t("q8.opt4") },
      ],
    },
    {
      id: "q9",
      question: t("q9.title"),
      options: [
        { value: 0, label: t("q9.opt1") },
        { value: 1, label: t("q9.opt2") },
        { value: 2, label: t("q9.opt3") },
        { value: 3, label: t("q9.opt4") },
      ],
    },
  ];

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
        title: t("toast.fillAll"),
        description: t("toast.fillAllDesc"),
        variant: "destructive",
      });
      return;
    }
    if (step === 1 && !isStep2Valid()) {
      toast({
        title: t("toast.completeAll"),
        description: t("toast.completeAllDesc"),
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
      if (score <= 6) return "穩健安全級別";
      if (score <= 13) return "加固防護級別";
      return "極高風險警告";
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
        title: t("toast.success"),
        description: t("toast.successDesc"),
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error("Sync error:", error);
      toast({
        title: t("toast.error"),
        description: t("toast.errorDesc"),
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
            {t("step.of")} {step + 1} / {totalSteps}
          </span>
          <span className="text-sm font-medium text-primary">
            {Math.round(progress)}% {t("step.complete")}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-3">
          <span className={`text-xs ${step >= 0 ? "text-primary font-medium" : "text-muted-foreground"}`}>
            {t("step.basic")}
          </span>
          <span className={`text-xs ${step >= 1 ? "text-primary font-medium" : "text-muted-foreground"}`}>
            {t("step.risk")}
          </span>
          <span className={`text-xs ${step >= 2 ? "text-primary font-medium" : "text-muted-foreground"}`}>
            {t("step.confirm")}
          </span>
        </div>
      </div>

      {/* Step 1: Basic Information */}
      {step === 0 && (
        <Card className="p-6 md:p-8 animate-fade-in shadow-lg">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">1</span>
            {t("step.basic")}
          </h2>
          <div className="space-y-5">
            <div>
              <Label htmlFor="address" className="text-sm font-medium">
                {t("form.whatsapp")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="address"
                placeholder={t("form.whatsapp.placeholder")}
                value={formData.address}
                onChange={(e) => updateFormData("address", e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">
                {t("form.q1")} <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-3 mt-1.5">
                <div>
                  <Label htmlFor="buildingType" className="text-xs text-muted-foreground">
                    {t("form.buildingType")}
                  </Label>
                  <select
                    id="buildingType"
                    value={formData.buildingType}
                    onChange={(e) => updateFormData("buildingType", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">{t("form.buildingType.select")}</option>
                    <option value="大廈">{t("form.buildingType.building")}</option>
                    <option value="村屋/別墅">{t("form.buildingType.house")}</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="floorLevel" className="text-xs text-muted-foreground">
                    {t("form.floor")}
                  </Label>
                  <Input
                    id="floorLevel"
                    placeholder={t("form.floor.placeholder")}
                    value={formData.floorLevel}
                    onChange={(e) => updateFormData("floorLevel", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">
                {t("form.q2")} <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-3 mt-1.5">
                <div>
                  <Label htmlFor="windowCount" className="text-xs text-muted-foreground">
                    {t("form.window")}
                  </Label>
                  <Input
                    id="windowCount"
                    placeholder={t("form.quantity")}
                    type="number"
                    min="0"
                    value={formData.windowCount}
                    onChange={(e) => updateFormData("windowCount", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="doorCount" className="text-xs text-muted-foreground">
                    {t("form.door")}
                  </Label>
                  <Input
                    id="doorCount"
                    placeholder={t("form.quantity")}
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
                {t("form.q3.weight")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="heaviestCatWeight"
                placeholder={t("form.weight.placeholder")}
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
              {t("form.riskTitle")}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {t("form.riskDesc")}
            </p>
            <div className="space-y-8">
              {scoredQuestions.map((q) => (
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
            {t("confirm.title")}
          </h2>
          <div className="space-y-6">
            <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground">{t("confirm.basicInfo")}</h3>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("confirm.address")}</span>
                  <span className="font-medium">{formData.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("confirm.buildingType")}</span>
                  <span className="font-medium">{formData.buildingType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("confirm.floor")}</span>
                  <span className="font-medium">{formData.floorLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("confirm.windowCount")}</span>
                  <span className="font-medium">{formData.windowCount} {t("unit.pieces")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("confirm.doorCount")}</span>
                  <span className="font-medium">{formData.doorCount} {t("unit.pieces")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("confirm.heaviestCat")}</span>
                  <span className="font-medium">{formData.heaviestCatWeight} {t("unit.kg")}</span>
                </div>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground">{t("confirm.riskScore")}</h3>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("confirm.catCount")}</span>
                  <span className="font-medium">{formData.q3Score} {t("unit.points")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("confirm.windowBehavior")}</span>
                  <span className="font-medium">{formData.q5Score} {t("unit.points")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("confirm.windowStructure")}</span>
                  <span className="font-medium">{formData.q6Score} {t("unit.points")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("confirm.catPersonality")}</span>
                  <span className="font-medium">{formData.q7Score} {t("unit.points")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("confirm.highRisk")}</span>
                  <span className="font-medium">{formData.q8Score} {t("unit.points")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("confirm.expectation")}</span>
                  <span className="font-medium">{formData.q9Score} {t("unit.points")}</span>
                </div>
              </div>
              <div className="pt-3 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t("confirm.totalScore")}</span>
                  <span className="text-2xl font-bold text-primary">{calculateTotalScore()}/19</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-primary/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                {t("confirm.submitNote")}
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
          {t("btn.back")}
        </Button>
        {step < totalSteps - 1 ? (
          <Button onClick={handleNext} className="gap-2">
            {t("btn.next")}
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
                {t("btn.submitting")}
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                {t("btn.submit")}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
