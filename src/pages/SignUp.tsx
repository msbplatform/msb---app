
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign up logic here
    console.log("Sign up attempt:", { name, username, password, agreed });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900">msb</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-gray-900 transition-colors">Home</Link>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">About</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Blog</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Contact us</a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex space-x-4">
              <Link to="/login">
                <Button variant="outline" className="text-gray-700 border-gray-300">
                  Sign in
                </Button>
              </Link>
              <Button className="bg-primary text-black font-medium hover:bg-primary/90">
                Sign up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
            {/* Left Content - Sign Up Form */}
            <div className="space-y-8 max-w-md mx-auto lg:mx-0">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Create your account</h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-700">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="8+ Characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked as boolean)}
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree with MSB's{" "}
                    <a href="#" className="text-gray-900 hover:underline">Ts & Cs</a> and{" "}
                    <a href="#" className="text-gray-900 hover:underline">privacy policy</a>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-black font-medium hover:bg-primary/90 py-3"
                  disabled={!agreed}
                >
                  Sign up
                </Button>

                <p className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link to="/login" className="text-gray-900 font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </form>
            </div>

            {/* Right Content - Image */}
            <div className="relative order-first lg:order-last">
              <div className="bg-primary rounded-3xl overflow-hidden h-[500px] relative">
                <img
                  src="/msb-uploads/6c3a3a02-9dc5-4656-9820-677d44004469.png"
                  alt="Person with dreadlocks in colorful outfit"
                  className="absolute right-8 top-8 w-80 h-80 object-cover rounded-2xl"
                />
                <div className="absolute bottom-8 left-8 w-32 h-32 bg-primary rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Anonymous Donation Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  Donate anonymously at
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    All of this text is editable. Simply click anywhere in the paragraph or heading 
                    text and start typing. You can copy and paste your own content in to see what 
                    it looks like with these font combinations. All of this text is editable. Simply 
                    click anywhere in the paragraph or heading text and start typing. You can copy 
                    and paste your own content in to see what it looks like with these font 
                    combinations.
                  </p>
                  <p>
                    All of this text is editable. Simply click anywhere in the 
                    paragraph or heading text and start typing. You can copy and paste your own 
                    content in to see what it looks like with these font combinations.
                  </p>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop&crop=center"
                  alt="Donation activities"
                  className="w-full h-[400px] object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Get in Touch Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Image */}
              <div className="relative">
                <div className="bg-primary rounded-3xl overflow-hidden h-[400px] relative">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&crop=center"
                    alt="Team meeting"
                    className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] object-cover rounded-2xl filter sepia"
                  />
                </div>
              </div>

              {/* Right Content */}
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  Get in Touch
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    All of this text is editable. Simply click anywhere in the paragraph or heading 
                    text and start typing. You can copy and paste your own content in to see what 
                    it looks like with these font combinations. All of this text is editable. Simply 
                    click anywhere in the paragraph or heading text and start typing.
                  </p>
                </div>
                <Button className="bg-black text-white hover:bg-gray-800 transition-colors">
                  Contact
                </Button>
                
                {/* Social Media Icons */}
                <div className="flex space-x-4 pt-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-black font-bold">T</span>
                  </div>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-black font-bold">F</span>
                  </div>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-black font-bold">L</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SignUp;
