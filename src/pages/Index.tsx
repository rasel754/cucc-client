import { Layout } from "@/components/layout/Layout";
import PageTitle from "@/components/common/PageTitle";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { WingsSection } from "@/components/home/WingsSection";
import { EventsSection } from "@/components/home/EventsSection";
import { NoticesSection } from "@/components/home/NoticesSection";
import { AchievementsSection } from "@/components/home/AchievementsSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <PageTitle title="Home" />
      <HeroSection />
      <AboutSection />
      <WingsSection />
      <EventsSection />
      <NoticesSection />
      <AchievementsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
