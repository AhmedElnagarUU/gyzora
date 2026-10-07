import { Header, Footer } from '@/shared/ui'
import { HeroSection } from '@/app/(marketing)/components/HeroSection'
import { FeaturesSection } from '@/app/(marketing)/components/FeaturesSection'
import { TemplatesSection } from '@/app/(marketing)/components/TemplatesSection'
import { CTASection } from '@/app/(marketing)/components/CTASection'

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
