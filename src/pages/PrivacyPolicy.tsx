import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-lg">
              Last Updated: 01/08/25
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-lg space-y-8">
            <section>
              <p className="text-foreground/80 leading-relaxed mb-6">
                At MSB ("we," "our," or "us"), we respect your privacy and are committed to protecting your personal information. 
                This Privacy Policy explains how we collect, use, and share information when you use our website and services (the "Platform").
              </p>
            </section>

            <div className="border-t border-border my-8"></div>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>
              <p className="text-foreground/70 mb-3">We may collect the following types of information:</p>
              <ul className="space-y-2 text-foreground/70">
                <li>• <strong>Personal Information:</strong> such as your name, email address, and payment details when you create an account, donate, or contact us.</li>
                <li>• <strong>Content Information:</strong> videos, text, and other content you choose to upload.</li>
                <li>• <strong>Technical Information:</strong> such as your IP address, browser type, device information, and usage data.</li>
                <li>• <strong>Donation Information:</strong> details about donations you make or receive through the Platform.</li>
              </ul>
            </section>

            <div className="border-t border-border my-8"></div>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
              <p className="text-foreground/70 mb-3">We use the information we collect to:</p>
              <ul className="space-y-2 text-foreground/70">
                <li>• Provide and operate the Platform.</li>
                <li>• Process donations and payments.</li>
                <li>• Promote campaigns (including sharing videos and stories on social media and other platforms to increase donation visibility).</li>
                <li>• Communicate with you about your account, support, or updates.</li>
                <li>• Monitor usage and improve our services.</li>
                <li>• Protect against fraud, abuse, or illegal activity.</li>
              </ul>
            </section>

            <div className="border-t border-border my-8"></div>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Sharing Your Information</h2>
              <p className="text-foreground/70 mb-3">We may share your information with:</p>
              <ul className="space-y-2 text-foreground/70">
                <li>• Payment processors to handle transactions securely.</li>
                <li>• Social media platforms and partner sites when promoting user content to increase donation reach.</li>
                <li>• Service providers who help us operate and improve the Platform.</li>
                <li>• Legal authorities if required by law or to protect rights, safety, or security.</li>
              </ul>
              <p className="text-foreground/80 mt-4 font-medium">
                We will never sell your personal information to third parties.
              </p>
            </section>

            <div className="border-t border-border my-8"></div>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Cookies & Tracking</h2>
              <p className="text-foreground/70">
                We may use cookies and similar technologies to improve your browsing experience, analyze site usage, and deliver relevant content. You can manage cookie preferences through your browser settings.
              </p>
            </section>

            <div className="border-t border-border my-8"></div>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Data Retention</h2>
              <p className="text-foreground/70">
                We retain your information only as long as necessary for the purposes outlined in this Policy, unless a longer retention period is required by law.
              </p>
            </section>

            <div className="border-t border-border my-8"></div>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights</h2>
              <p className="text-foreground/70 mb-3">Depending on your location, you may have rights regarding your personal information, including:</p>
              <ul className="space-y-2 text-foreground/70 mb-4">
                <li>• Accessing the data we hold about you.</li>
                <li>• Requesting correction or deletion of your data.</li>
                <li>• Withdrawing consent for certain uses.</li>
                <li>• Objecting to how we use your information.</li>
              </ul>
              <p className="text-foreground/70">
                You can exercise these rights by contacting us at MSB.earth.help@gmail.com.
              </p>
            </section>

            <div className="border-t border-border my-8"></div>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Security</h2>
              <p className="text-foreground/70">
                We take reasonable measures to protect your information. However, no online system is 100% secure, and we cannot guarantee absolute protection.
              </p>
            </section>

            <div className="border-t border-border my-8"></div>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Children's Privacy</h2>
              <p className="text-foreground/70">
                Our Platform is open to all ages. If you are under 18, we encourage you to involve a parent or guardian, especially when submitting donation requests or personal information.
              </p>
            </section>

            <div className="border-t border-border my-8"></div>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to This Policy</h2>
              <p className="text-foreground/70">
                We may update this Privacy Policy from time to time. Updates will be posted on this page with a new "Last Updated" date.
              </p>
            </section>

            <div className="border-t border-border my-8"></div>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
              <p className="text-foreground/70 mb-2">If you have questions about this Privacy Policy, please contact us at:</p>
              <p className="text-foreground font-medium">MSB.earth.help@gmail.com</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;