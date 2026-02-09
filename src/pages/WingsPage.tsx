import { Layout } from "@/components/layout/Layout";
import PageTitle from "@/components/common/PageTitle";
import { WingsSection } from "@/components/home/WingsSection";

export default function WingsPage() {
  return (
    <Layout>
      <PageTitle title="Our Wings" />
      <div className="pt-8">
        <WingsSection />
      </div>
    </Layout>
  );
}
