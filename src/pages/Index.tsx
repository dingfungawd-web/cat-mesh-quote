import { AssessmentForm } from "@/components/AssessmentForm";
import { Shield } from "lucide-react";
import dfLogo from "@/assets/df-logo.jpg";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white py-4 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex-1" />
            <img 
              src={dfLogo} 
              alt="DF 創意家居" 
              className="h-36 w-auto object-contain"
            />
            <div className="flex-1 flex justify-end">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary to-background py-10 md:py-14 px-4 border-b border-border">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
            <Shield className="w-4 h-4" />
            {t("hero.badge")}
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 tracking-tight text-foreground">
            {t("hero.title")}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            {t("hero.description")}
          </p>
        </div>
      </section>

      {/* Form Section */}
      <main className="py-8 md:py-12 px-4">
        <div className="container max-w-4xl mx-auto">
          <AssessmentForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4 mt-8 bg-secondary/50">
        <div className="container max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <img 
                src={dfLogo} 
                alt="DF 創意家居" 
                className="h-8 w-auto object-contain"
              />
              <span>{t("footer.copyright")}</span>
            </div>
            <p className="text-center md:text-right font-medium text-foreground/80">
              {t("footer.tagline")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
