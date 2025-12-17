import { AssessmentForm } from "@/components/AssessmentForm";
import { Cat, Shield, Phone } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground py-6 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center backdrop-blur-sm">
                <Cat className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">DF 創意家居</h1>
                <p className="text-sm opacity-90">防貓網工程專家</p>
              </div>
            </div>
            <a 
              href="tel:+85212345678" 
              className="flex items-center gap-2 bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">聯絡我們</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-8 md:py-12 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            度尺前預先評估
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 tracking-tight">
            《DF 貓咪居家安全顧問問卷》
          </h2>
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
      <footer className="border-t border-border py-6 px-4 mt-8">
        <div className="container max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Cat className="w-4 h-4 text-primary" />
              <span>© 2024 DF 創意家居 · 全港領先防貓網工程公司</span>
            </div>
            <p className="text-center md:text-right">
              成為您貓咪一生的守護顧問
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
