import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

interface Settings {
  contact_address?: string;
  contact_address_hindi?: string;
  contact_phone?: string;
  contact_phone2?: string;
  contact_email?: string;
  contact_hours?: string;
}

export default function Contact() {
  const [settings, setSettings] = useState<Settings>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(setSettings)
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSending(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get("name") as string,
      phone: fd.get("phone") as string,
      subject: fd.get("subject") as string,
      message: fd.get("message") as string,
    };
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setSent(true);
        formRef.current?.reset();
      } else {
        setError("Failed to send message. Please try again.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-secondary to-secondary/80 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">Contact Us</h1>
            <p className="text-2xl text-primary/90 font-serif">संपर्क करें</p>
            <p className="text-white/70 mt-4">We are always ready to serve you / हम आपकी सेवा में सदैव तत्पर हैं</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-3xl font-bold text-secondary mb-1">Contact Information</h2>
              <p className="text-muted-foreground mb-8">संपर्क जानकारी</p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Address / पता</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {settings.contact_address || "MNI Higher Secondary School, Sambhal, Uttar Pradesh — 244302"}<br />
                      {settings.contact_address_hindi || "एम.एन.आई. उच्चतर माध्यमिक विद्यालय, संभल, उत्तर प्रदेश"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Phone / फोन</h3>
                    <p className="text-muted-foreground text-sm">{settings.contact_phone || "+91 XXXXX XXXXX"}</p>
                    {settings.contact_phone2 && (
                      <p className="text-muted-foreground text-sm">{settings.contact_phone2}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email / ईमेल</h3>
                    <a
                      href={`mailto:${settings.contact_email || "info@mnischool.edu.in"}`}
                      className="text-primary text-sm hover:underline"
                    >
                      {settings.contact_email || "info@mnischool.edu.in"}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Office Hours / कार्यालय समय</h3>
                    <p className="text-muted-foreground text-sm whitespace-pre-line">
                      {settings.contact_hours || "Monday – Saturday: 8:00 AM – 4:00 PM\nSunday: Closed"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-3xl font-bold text-secondary mb-1">Send a Message</h2>
              <p className="text-muted-foreground mb-6">संदेश भेजें</p>

              {sent ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                  <div className="text-4xl mb-3">✅</div>
                  <h3 className="font-serif font-bold text-green-800 text-lg mb-1">Message Sent Successfully!</h3>
                  <p className="text-green-700 text-sm">We will get back to you soon.</p>
                  <p className="text-green-600 text-xs mt-1">हम जल्द ही आपसे संपर्क करेंगे।</p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-4 text-sm text-green-700 underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Name / नाम <span className="text-destructive">*</span>
                    </label>
                    <input name="name" type="text" required className="w-full border rounded-lg px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Phone / फोन
                    </label>
                    <input name="phone" type="tel" className="w-full border rounded-lg px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Subject / विषय
                    </label>
                    <input name="subject" type="text" className="w-full border rounded-lg px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" placeholder="Subject of your message" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Message / संदेश <span className="text-destructive">*</span>
                    </label>
                    <textarea name="message" required rows={5} className="w-full border rounded-lg px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none" placeholder="Your message..." />
                  </div>
                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={sending}
                    className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    {sending ? "Sending..." : "Send Message / संदेश भेजें"}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
