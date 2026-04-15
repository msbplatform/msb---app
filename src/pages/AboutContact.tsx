import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MessageSquare, Heart, Zap, Shield } from "lucide-react";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const AboutContact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({
      name: "",
      email: "",
      message: ""
    });
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  return <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                About MSB App
                <br />
                <span className="text-primary">A Fresh Start</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're building the platform that content creators deserve — one that values authentic connection, 
                meaningful impact, and financial freedom for those who uplift minds, bodies, and spirits.
              </p>
            </div>
            
            <div className="flex justify-center">
              <div className="bg-primary rounded-3xl p-8 text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <p className="text-black font-semibold text-lg">
                  A palette cleanser for the digital world
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We believe content creators who inspire positive change deserve financial freedom. 
                MSB App is the direct monetization platform that cuts out the noise and connects creators 
                with their true supporters.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="text-center p-6 border-none shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Direct Impact</h3>
                  <p className="text-gray-600">
                    No algorithms deciding your worth. Connect directly with supporters who value your authentic message.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 border-none shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Clean Platform</h3>
                  <p className="text-gray-600">
                    A breath of fresh air from toxic social media. Focused on genuine connection and positive impact.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 border-none shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Creator First</h3>
                  <p className="text-gray-600">
                    Built by creators, for creators. We understand the struggle and we're here to change the game.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Founder Story */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg">
              <div className="max-w-4xl mx-auto text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  Why This Matters
                </h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  We've watched too many incredible creators struggle on platforms that don't value their contribution. 
                  Wellness coaches, mindfulness teachers, fitness instructors, spiritual guides — all working tirelessly 
                  to make the world better, yet fighting for scraps from advertising revenue.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  MSB App changes this narrative. We're not another social media platform competing for attention. 
                  We're a direct bridge between creators who elevate consciousness and supporters who want to invest 
                  in meaningful content. It's time for a platform that serves the mission, not the algorithm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Get in Touch
              </h2>
              <p className="text-xl text-gray-600">
                Ready to be part of the movement? We'd love to hear from you.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              {/* Contact Information */}
              <div className="space-y-8">
                <div className="bg-gray-50 rounded-2xl p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email Us</h3>
                      <p className="text-gray-600">MSB.earth.help@gmail.com</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    We usually reply within 1 business day
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Partnerships</h3>
                      <p className="text-gray-600">Let's collaborate</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Interested in partnerships or integration opportunities? We're always open to meaningful collaborations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default AboutContact;
