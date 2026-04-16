              import { useState, useEffect } from "react";
              import { motion } from "framer-motion";
              import { Award, Target, Heart, Quote, UserCircle2, School } from "lucide-react";

              interface Settings {
                founder_name?: string;
                founder_photo?: string;
                founder_bio?: string;
                about_mission?: string;
                about_mission_hindi?: string;
                about_vision?: string;
                about_vision_hindi?: string;
                about_story_image?: string;
                facility_science_lab?: string;
                facility_computer_room?: string;
                facility_library?: string;
                facility_sports_ground?: string;
                facility_auditorium?: string;
                facility_smart_classrooms?: string;
                facility_hostel?: string;
                facility_health_room?: string;
              }

              const ALL_FACILITIES = [
                { key: "facility_science_lab",       label: "Science Lab",      labelHindi: "विज्ञान प्रयोगशाला" },
                { key: "facility_computer_room",     label: "Computer Room",    labelHindi: "कंप्यूटर कक्ष" },
                { key: "facility_library",           label: "Library",          labelHindi: "पुस्तकालय" },
                { key: "facility_sports_ground",     label: "Sports Ground",    labelHindi: "खेल मैदान" },
                { key: "facility_auditorium",        label: "Auditorium",       labelHindi: "सभागार" },
                { key: "facility_smart_classrooms",  label: "Smart Classrooms", labelHindi: "स्मार्ट क्लासरूम" },
                { key: "facility_hostel",            label: "Hostel",           labelHindi: "छात्रावास" },
                { key: "facility_health_room",       label: "Health Room",      labelHindi: "स्वास्थ्य कक्ष" },
              ];

              export default function About() {
                const [settings, setSettings] = useState<Settings>({});

                useEffect(() => {
                  fetch("/api/settings")
                    .then(r => r.json())
                    .then(setSettings)
                    .catch(() => {});
                }, []);

                const founderBioParagraphs = (settings.founder_bio || "").split("\n\n").filter(Boolean);

                const activeFacilities = ALL_FACILITIES.filter(f => settings[f.key as keyof Settings] === "true");

                return (
                  <div>
                    {/* Hero */}
                    <section className="bg-gradient-to-br from-secondary to-secondary/80 text-white py-20">
                      <div className="container mx-auto px-4 text-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">About Us</h1>
                          <p className="text-2xl text-primary/90 font-serif">हमारे बारे में</p>
                          <p className="text-white/70 mt-4 max-w-xl mx-auto">
                            Sambhal's premier institution for higher secondary education
                          </p>
                        </motion.div>
                      </div>
                    </section>

                    <section className="py-16 bg-background">
                      <div className="container mx-auto px-4 max-w-5xl">

                        {/* ── 1. FOUNDER SECTION (TOP) ── */}
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7 }}
                          className="mb-16"
                        >
                          <div className="text-center mb-10">
                            <h2 className="font-serif text-3xl font-bold text-secondary mb-1">About the Founder</h2>
                            <p className="text-muted-foreground">संस्थापक परिचय</p>
                            <div className="w-16 h-1 bg-primary rounded mx-auto mt-4" />
                          </div>

                          <div className="bg-gradient-to-br from-secondary/5 to-primary/5 border border-secondary/15 rounded-2xl p-8 md:p-12">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                              <div className="flex-shrink-0 mx-auto md:mx-0">
                                <div className="w-40 h-48 rounded-2xl overflow-hidden border-4 border-primary/25 shadow-lg bg-muted flex items-center justify-center">
                                  {settings.founder_photo ? (
                                    <img
                                      src={settings.founder_photo}
                                      alt={settings.founder_name || "Founder"}
                                      className="w-full h-full object-cover"
                                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                                    />
                                  ) : (
                                    <UserCircle2 className="w-20 h-20 text-muted-foreground/30" />
                                  )}
                                </div>
                                <div className="text-center mt-3">
                                  <p className="font-serif font-bold text-secondary text-sm">
                                    {settings.founder_name || "Late Mr. Zaheer Ahmad Hashmi"}
                                  </p>
                                  <p className="text-xs text-primary font-medium mt-0.5">Founder / संस्थापक</p>
                                </div>
                              </div>

                              <div className="flex-1">
                                <div className="flex items-start gap-2 mb-4">
                                  <Quote className="w-8 h-8 text-primary/30 flex-shrink-0 mt-1" />
                                  <h3 className="font-serif text-2xl font-bold text-secondary">
                                    {settings.founder_name || "Late Mr. Zaheer Ahmad Hashmi"}
                                  </h3>
                                </div>
                                <div className="space-y-4">
                                  {founderBioParagraphs.length > 0 ? (
                                    founderBioParagraphs.map((para, i) => {
                                      if (para.startsWith('"') || para.startsWith('\u201c')) {
                                        return (
                                          <blockquote key={i} className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
                                            <p className="text-foreground/90 font-medium italic text-sm leading-relaxed">{para}</p>
                                          </blockquote>
                                        );
                                      }
                                      const colonIdx = para.indexOf(":");
                                      if (colonIdx > 0 && colonIdx < 50) {
                                        const heading = para.substring(0, colonIdx);
                                        const rest = para.substring(colonIdx + 1).trim();
                                        return (
                                          <div key={i}>
                                            <h4 className="font-semibold text-secondary mb-1">{heading}:</h4>
                                            <p className="text-foreground/80 text-sm leading-relaxed">{rest}</p>
                                          </div>
                                        );
                                      }
                                      return <p key={i} className="text-foreground/80 text-sm leading-relaxed">{para}</p>;
                                    })
                                  ) : (
                                    <p className="text-muted-foreground text-sm">Founder information will appear here once added by the admin.</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* ── 2. OUR STORY ── */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className="mb-16 grid md:grid-cols-2 gap-12 items-center"
                        >

                          {/* ── M.N.I. ANTHEM VIDEO ── */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="mb-16"
                          >
                            <div className="text-center mb-8">
                              <h2 className="font-serif text-3xl font-bold text-secondary mb-1">
                                M.N.I. Anthem (Tarana)
                              </h2>
                              <p className="text-muted-foreground">एम.एन.आई. विद्यालय का तराना</p>
                              <div className="w-16 h-1 bg-primary rounded mx-auto mt-4" />
                            </div>

                            {/* Responsive + Modern Player */}
                            <div className="relative max-w-4xl mx-auto group">

                              {/* Glow effect */}
                              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary blur opacity-30 rounded-2xl"></div>

                              {/* Video */}
                              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                                <iframe
                                  className="w-full h-full"
                                  src="https://www.youtube.com/embed/gZYp9VOLPG8?autoplay=1&mute=1&rel=0&modestbranding=1"
                                  title="MNI Anthem"
                                  allow="autoplay; encrypted-media"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            </div>
                          </motion.div>
                          <div>
                            <h2 className="font-serif text-3xl font-bold text-secondary mb-1">Our Story</h2>
                            <p className="text-lg font-serif text-muted-foreground mb-2">हमारी कहानी</p>
                            <div className="w-12 h-1 bg-primary rounded mb-6" />
                            <p className="text-foreground/80 leading-relaxed mb-4">
                              MNI Higher Secondary School, Sambhal is a distinguished educational institution in the Sambhal district of Uttar Pradesh,
                              dedicated to providing quality education and holistic development to students from the region.
                            </p>
                            <p className="text-foreground/80 leading-relaxed mb-4">
                              एम.एन.आई. उच्चतर माध्यमिक विद्यालय, संभल — उत्तर प्रदेश के संभल जिले में स्थित एक प्रतिष्ठित शिक्षण संस्थान है।
                              यह विद्यालय दशकों से क्षेत्र के बच्चों को गुणवत्तापूर्ण शिक्षा प्रदान कर रहा है।
                            </p>
                            <p className="text-foreground/80 leading-relaxed">
                              Our goal is to provide every student with academic excellence alongside moral values and social responsibility.
                            </p>
                          </div>
                          <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl overflow-hidden border flex items-center justify-center">
                              {settings.about_story_image ? (
                                <img
                                  src={settings.about_story_image}
                                  alt="Our Story"
                                  className="w-full h-full object-cover"
                                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                                />
                              ) : (
                                <School className="w-24 h-24 text-primary/25" />
                              )}
                            </div>
                            <div className="absolute -bottom-4 -right-4 bg-primary text-white rounded-xl p-4 shadow-lg">
                              <div className="text-2xl font-bold">8+</div>
                              <div className="text-xs">Years of Excellence</div>
                            </div>
                          </div>
                        </motion.div>

                        {/* ── 3. MISSION, VISION, VALUES ── */}
                        <div className="grid md:grid-cols-3 gap-8 mb-16">
                          {[
                            {
                              icon: Target,
                              title: "Our Mission",
                              titleHindi: "हमारा लक्ष्य",
                              content: settings.about_mission || "To provide every student with high-quality education and opportunities for holistic development.",
                              contentHindi: settings.about_mission_hindi || "प्रत्येक छात्र को उच्च गुणवत्ता की शिक्षा और सर्वांगीण विकास का अवसर प्रदान करना।",
                            },
                            {
                              icon: Award,
                              title: "Our Vision",
                              titleHindi: "हमारी दृष्टि",
                              content: settings.about_vision || "To build a society where every child is educated, aware, and empowered.",
                              contentHindi: settings.about_vision_hindi || "एक ऐसे समाज का निर्माण जहाँ हर बच्चा शिक्षित, जागरूक और सशक्त हो।",
                            },
                            {
                              icon: Heart,
                              title: "Our Values",
                              titleHindi: "हमारे मूल्य",
                              content: "Knowledge, truth, discipline, service, and patriotism are the cornerstones of our school.",
                              contentHindi: "ज्ञान, सत्य, अनुशासन, सेवा और राष्ट्रप्रेम हमारे विद्यालय की आधारशिला हैं।",
                            },
                          ].map((item, i) => (
                            <motion.div
                              key={item.title}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.1, duration: 0.5 }}
                              className="bg-card border rounded-xl p-6 shadow-sm"
                            >
                              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <item.icon className="w-6 h-6 text-primary" />
                              </div>
                              <h3 className="font-serif text-xl font-bold text-secondary mb-0.5">{item.title}</h3>
                              <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-4">{item.titleHindi}</p>
                              <p className="text-sm text-foreground/80 leading-relaxed mb-3">{item.content}</p>
                              <p className="text-xs text-muted-foreground leading-relaxed italic">{item.contentHindi}</p>
                            </motion.div>
                          ))}
                        </div>

                        {/* ── 4. FACILITIES (admin-managed) ── */}
                        {activeFacilities.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                          >
                            <h2 className="font-serif text-3xl font-bold text-secondary mb-1 text-center">Our Facilities</h2>
                            <p className="text-center text-muted-foreground mb-10">सुविधाएं</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {activeFacilities.map(facility => (
                                <div key={facility.key} className="bg-accent/40 border border-accent rounded-lg p-4 text-center">
                                  <div className="font-medium text-accent-foreground text-sm">{facility.label}</div>
                                  <div className="text-xs text-muted-foreground mt-1">{facility.labelHindi}</div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                      </div>
                    </section>
                  </div>
                );
              }
