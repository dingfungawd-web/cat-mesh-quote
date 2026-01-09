import { AssessmentForm } from "@/components/AssessmentForm";
import { Shield } from "lucide-react";
import dfLogo from "@/assets/df-logo.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white py-4 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center justify-center">
            <img 
              src={dfLogo} 
              alt="DF 創意家居" 
              className="h-36 w-auto object-contain"
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary to-background py-10 md:py-14 px-4 border-b border-border">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
            <Shield className="w-4 h-4" />
            度尺前預先評估
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 tracking-tight text-foreground">
            《DF 貓咪居家安全顧問問卷》
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            透過此問卷，我們將預先了解您家中的環境與貓咪習性，以便度尺時為您提供最適合的防護方案。
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
              <span>© 2017 DF 創意家居 · 全港領先防貓網工程公司</span>
            </div>
            <p className="text-center md:text-right font-medium text-foreground/80">
              成為您貓咪一生的守護顧問
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
