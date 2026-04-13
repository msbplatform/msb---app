import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground text-lg">
              Last Updated: 01/08/25
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-lg space-y-8">
            <section>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Welcome to MSB. These Terms of Service govern your use of our website and services. 
                By accessing or using our platform you agree to be bound by these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">User Access</h2>
              <ul className="space-y-2 text-foreground/70">
                <li>• Our Platform is open to users of all ages.</li>
                <li>• If you are under 18, we encourage you to involve a parent or guardian, especially if you are submitting donation requests.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">User Accounts</h2>
              <ul className="space-y-2 text-foreground/70">
                <li>• To access certain features, you may need to create an account.</li>
                <li>• You are responsible for keeping your login details secure.</li>
                <li>• You agree to provide accurate and up-to-date information.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Content You Submit</h2>
              <ul className="space-y-2 text-foreground/70">
                <li>• Users may upload videos, text, or other content ("User Content").</li>
                <li>• By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to:</li>
                <li className="ml-4">• Display and distribute your content on the Platform.</li>
                <li className="ml-4">• Share, promote, and republish your content on other platforms (e.g., social media, partner sites) for the purpose of increasing visibility and donation support.</li>
                <li>• You must not upload content that is illegal, harmful, misleading, or infringes on others' rights.</li>
                <li>• We reserve the right to remove content that violates these Terms.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Donations & Payments</h2>
              <ul className="space-y-2 text-foreground/70">
                <li>• Donations made through the Platform are held until goals are met or distributed as outlined on the site.</li>
                <li>• We may promote donation campaigns externally (e.g., social media) to help you reach your goal.</li>
                <li>• We do not guarantee any outcome for donations.</li>
                <li>• Refunds are handled in accordance with our [Refund Policy/Donor Policy].</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Prohibited Uses</h2>
              <p className="text-foreground/70 mb-3">You agree not to use the Platform to:</p>
              <ul className="space-y-2 text-foreground/70">
                <li>• Break any laws or regulations.</li>
                <li>• Post harmful, abusive, or fraudulent content.</li>
                <li>• Impersonate another person or misrepresent your identity.</li>
                <li>• Attempt to hack, disrupt, or exploit the Platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Termination</h2>
              <ul className="space-y-2 text-foreground/70">
                <li>• We may suspend or terminate your access at any time if you violate these Terms.</li>
                <li>• You may stop using the Platform at any time.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Disclaimer & Limitation of Liability</h2>
              <ul className="space-y-2 text-foreground/70">
                <li>• The Platform is provided "as is" without warranties of any kind.</li>
                <li>• We do not guarantee that donations or content will achieve any specific result.</li>
                <li>• To the fullest extent permitted by law, we are not liable for damages arising from use of the Platform.</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;