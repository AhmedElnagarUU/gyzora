import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/marketing/HeroSection'
import { FeaturesSection } from '@/components/marketing/FeaturesSection'
import { TemplatesSection } from '@/components/marketing/TemplatesSection'
import { CTASection } from '@/components/marketing/CTASection'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TemplatesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
