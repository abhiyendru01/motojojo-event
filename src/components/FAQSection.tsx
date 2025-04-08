
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I book an event?",
    answer: "You can book an event by browsing our events section, selecting the event you're interested in, and clicking on the 'Book Now' button. Follow the steps to complete your booking."
  },
  {
    question: "Can I cancel my booking?",
    answer: "Yes, you can cancel your booking up to 24 hours before the event. Please note that cancellation policies may vary for different events."
  },
  {
    question: "How do I become a premium member?",
    answer: "You can become a premium member by clicking on the 'Explore Premium' button in the navigation bar and following the subscription process."
  },
  {
    question: "Do you offer refunds?",
    answer: "Refunds are processed as per the event's policy. Generally, full refunds are available if the event is cancelled by the organizer."
  },
  {
    question: "How can I list my event on Motojojo?",
    answer: "If you're an event organizer, you can contact us through the 'Partner With Us' section in the footer to get your events listed on our platform."
  }
];

const FAQSection = () => {
  return (
    <div className="w-full py-8">
      <div className="container">
        <h2 className="section-title mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border border-black">
              <AccordionTrigger className="px-4 py-2">{faq.question}</AccordionTrigger>
              <AccordionContent className="px-4 py-2">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQSection;
