import { Layout } from "@/components/layout/Layout";
import { WingsSection } from "@/components/home/WingsSection";

export default function WingsPage() {
  return (
    <Layout>
      <div className="pt-8">
        <WingsSection />
      </div>
    </Layout>
  );
}
