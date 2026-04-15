
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const FAQ = () => {
  const faqs = [
    {
      id: "item-1",
      question: "What is MSB?",
      answer: "MSB is a platform that empowers creators and enriches lives through meaningful impact and community support. We connect content creators with supporters who want to make a difference."
    },
    {
      id: "item-2",
      question: "What type of content can I share on MSB?",
      answer: "You can share various types of content including educational material, creative projects, community initiatives, and campaigns that aim to make a positive impact in society."
    },
    {
      id: "item-3",
      question: "How can I support creators on MSB?",
      answer: "You can support creators by making donations to their campaigns, sharing their content, volunteering for their causes, or providing feedback and encouragement."
    },
    {
      id: "item-4",
      question: "Is there a fee to use MSB?",
      answer: "Basic access to MSB is free for both creators and supporters. We may charge a small processing fee on donations to cover transaction costs and platform maintenance."
    },
    {
      id: "item-5",
      question: "How does the donation process work?",
      answer: "Donations are processed securely through our platform. You can choose to donate anonymously or publicly, and all funds go directly to the creator's campaign after processing fees."
    },
    {
      id: "item-6",
      question: "How do I report a problem or get support?",
      answer: "You can contact our support team through the 'Get Help' button below, send us an email at MSB.earth.help@gmail.com, or reach out through our social media channels. We're here to help!"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* FAQ Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                — NEED ANSWERS?
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold text-black">
                FAQs
              </h1>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border border-gray-200 rounded-lg px-6">
                  <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-6 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="pt-4">
              <Button 
                className="bg-primary text-black font-medium hover:bg-primary/90 transition-colors px-8 py-3"
                onClick={() => window.location.href = '/about-contact'}
              >
                Get Help
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="lg:sticky lg:top-24">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-green-100 to-yellow-100"
            </div>
          </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
