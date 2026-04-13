
import LoginHeader from "@/components/LoginHeader";
import LoginForm from "@/components/LoginForm";
import LoginHeroImage from "@/components/LoginHeroImage";
import AnonymousDonationSection from "@/components/AnonymousDonationSection";
import GetInTouchSection from "@/components/GetInTouchSection";
import Footer from "@/components/Footer";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <LoginHeader />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
            {/* Left Content - Login Form */}
            <LoginForm />

            {/* Right Content - Image */}
            <LoginHeroImage />
          </div>
        </div>

        {/* Anonymous Donation Section */}
        <AnonymousDonationSection />

        {/* Get in Touch Section */}
        <GetInTouchSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Login;
