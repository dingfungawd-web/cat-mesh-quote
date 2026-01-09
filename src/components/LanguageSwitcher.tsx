import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-secondary rounded-full p-1">
      <Button
        variant={language === "zh" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("zh")}
        className="rounded-full px-3 h-8 text-sm font-medium"
      >
        中文
      </Button>
      <Button
        variant={language === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("en")}
        className="rounded-full px-3 h-8 text-sm font-medium"
      >
        EN
      </Button>
    </div>
  );
}
