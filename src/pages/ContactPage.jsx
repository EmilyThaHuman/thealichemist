import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr,1.5fr] gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-semibold mb-4">Get in Touch</h1>
              <p className="text-lg text-muted-foreground">
                We'd love to hear from you. Please fill out the form or contact us using
                the information below.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 mt-1 text-muted-foreground" />
                <div>
                  <h3 className="font-medium mb-1">Visit Us</h3>
                  <p className="text-muted-foreground">
                    123 Architecture Lane<br />
                    San Francisco, CA 94105<br />
                    United States
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 mt-1 text-muted-foreground" />
                <div>
                  <h3 className="font-medium mb-1">Email Us</h3>
                  <a 
                    href="mailto:hello@studio.com" 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    hello@studio.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 mt-1 text-muted-foreground" />
                <div>
                  <h3 className="font-medium mb-1">Call Us</h3>
                  <a 
                    href="tel:+1234567890" 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    +1 (234) 567-890
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-muted/50 rounded-lg p-8">
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full px-4 py-2 bg-background border rounded-md"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full px-4 py-2 bg-background border rounded-md"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 bg-background border rounded-md"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="w-full px-4 py-2 bg-background border rounded-md resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 text-sm font-medium text-white bg-black rounded-md hover:bg-black/80 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage; 