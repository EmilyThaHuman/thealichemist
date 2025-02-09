import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      console.log('Sending request to:', import.meta.env.VITE_API_URL);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Message sent successfully!' });
        setFormData({ firstName: '', lastName: '', email: '', message: '' });
      } else {
        throw new Error(data.error || 'Server error: ' + response.statusText);
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus({ 
        type: 'error', 
        message: error.message || 'Failed to connect to server. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                We&apos;d love to hear from you. Please fill out the form or contact us using
                the information below.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 mt-1 text-muted-foreground" />
                <div>
                  <h3 className="font-medium mb-1">Visit Us</h3>
                  <p className="text-muted-foreground">
                    147 Twisp-Winthrop Eastside Road<br />
                    Twisp, WA 98856<br />
                    United States
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 mt-1 text-muted-foreground" />
                <div>
                  <h3 className="font-medium mb-1">Email Us</h3>
                  <a 
                    href="mailto:alimorrisvogt@gmail.com" 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    alimorrisvogt@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 mt-1 text-muted-foreground" />
                <div>
                  <h3 className="font-medium mb-1">Call Us</h3>
                  <a 
                    href="tel:+12067186850" 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    +1 (206) 718-6850
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-muted/50 rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-background border rounded-md"
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-background border rounded-md"
                    placeholder="Doe"
                    required
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
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border rounded-md"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-2 bg-background border rounded-md resize-none"
                  placeholder="Tell us about your project..."
                  required
                />
              </div>

              {status.message && (
                <div className={`p-4 rounded-md ${
                  status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 text-sm font-medium text-white bg-black rounded-md hover:bg-black/80 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage; 