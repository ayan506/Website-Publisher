import { useState, useEffect } from "react";
import { useListBlogPosts, useListStaff } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, Users, Award, GraduationCap, ChevronRight, Calendar, Bell } from "lucide-react";

interface Notice {
  id: number;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
}

type SiteSettings = Record<string, string>;

const defaultSettings: SiteSettings = {
  home_title: "MNI Higher Secondary School",
  home_title_hindi: "एम.एन.आई. उच्चतर माध्यमिक विद्यालय",
  home_tagline: "ज्ञान, संस्कार और उत्कृष्टता की ओर — एक सशक्त भविष्य की नींव",
  home_tagline_english: "Nurturing minds, building character, and shaping futures for generations.",
  home_stats_students: "1200+",
  home_stats_teachers: "60+",
  home_stats_years: "17+",
  home_stats_classes: "15+",
};

export default function Home() {
  const { data: posts } = useListBlogPosts();
  const { data: staff } = useListStaff();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    fetch("/api/notices/active")
      .then(r => r.json())
      .then(setNotices)
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(data => setSettings({ ...defaultSettings, ...data }))
      .catch(() => {});
  }, []);

  const principal = staff?.find(s => s.role.toLowerCase().includes("principal") && !s.role.toLowerCase().includes("vice"));
  const stats = [
    { icon: GraduationCap, label: "Students", labelHindi: "छात्र", value: settings.home_stats_students || defaultSettings.home_stats_students },
    { icon: Users, label: "Teachers", labelHindi: "शिक्षक", value: settings.home_stats_teachers || defaultSettings.home_stats_teachers },
    { icon: Award, label: "Years of Excellence", labelHindi: "वर्षों की उत्कृष्टता", value: settings.home_stats_years || defaultSettings.home_stats_years },
    { icon: BookOpen, label: "Classes", labelHindi: "कक्षाएं", value: settings.home_stats_classes || defaultSettings.home_stats_classes },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary via-secondary/95 to-secondary/80 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600')] bg-cover bg-center" />
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="inline-block bg-primary/90 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              Sambhal, Uttar Pradesh
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight mb-4">
              {settings.home_title || defaultSettings.home_title}
            </h1>
            <p className="text-2xl md:text-3xl font-serif text-primary/90 mb-6">
              {settings.home_title_hindi || defaultSettings.home_title_hindi}
            </p>
            <p className="text-base text-white/70 mb-4">
              {settings.home_tagline_english || defaultSettings.home_tagline_english}
            </p>
            <p className="text-lg text-white/60 mb-10">
              {settings.home_tagline || defaultSettings.home_tagline}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/about">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-primary text-white px-8 py-3 rounded-lg font-semibold text-sm flex items-center gap-2 shadow-lg hover:bg-primary/90 transition-colors"
                >
                  Learn About Us <ChevronRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  className="border border-white/50 text-white px-8 py-3 rounded-lg font-semibold text-sm hover:bg-white/10 transition-colors"
                >
                  Contact Us
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="py-14 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-card border rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-secondary mb-1">{stat.value}</div>
                <div className="text-sm text-foreground font-medium">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.labelHindi}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Notices Section */}
      {notices.length > 0 && (
        <section className="py-12 bg-primary/5 border-y border-primary/10">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-secondary">Notices & Announcements</h2>
                <p className="text-sm text-muted-foreground">सूचनाएं एवं घोषणाएं</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notices.map((notice, i) => (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="bg-card border border-primary/15 rounded-xl p-5 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1 text-sm">{notice.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{notice.content}</p>
                      <p className="text-xs text-primary/60 mt-2">
                        {new Date(notice.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Principal's Message */}
      {principal && (
        <section className="py-16 bg-accent/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-card border rounded-2xl p-8 md:p-12 shadow-sm flex flex-col md:flex-row gap-8 items-start"
              >
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-secondary/20 flex items-center justify-center overflow-hidden border-4 border-primary/30">
                    {principal.photoUrl ? (
                      <img src={principal.photoUrl} alt={principal.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-12 h-12 text-secondary/50" />
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">Principal's Message / प्राचार्य संदेश</div>
                  <p className="text-lg text-foreground/80 italic leading-relaxed mb-4">
                    "Our school is not merely a place of learning; it is a family where every child's dreams take flight.
                    We strive not only to give students academic knowledge, but also to shape them into responsible citizens."
                  </p>
                  <p className="text-sm text-muted-foreground mb-1 italic">
                    "हमारा विद्यालय केवल शिक्षा का स्थान नहीं है, यह एक ऐसा परिवार है जहाँ हर बच्चे के सपनों को पंख मिलते हैं।"
                  </p>
                  <div className="mt-4">
                    <div className="font-bold text-foreground">{principal.name}</div>
                    <div className="text-sm text-muted-foreground">{principal.nameHindi}</div>
                    <div className="text-sm text-primary">{principal.role} — {principal.roleHindi}</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Latest Blog Posts */}
      {posts && posts.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-serif text-3xl font-bold text-secondary">Latest News</h2>
                <p className="text-muted-foreground mt-1">ताज़ा समाचार और घोषणाएं</p>
              </div>
              <Link href="/blog">
                <button className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {posts.slice(0, 3).map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <Link href={`/blog/${post.id}`}>
                    <div className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer h-full flex flex-col">
                      {post.imageUrl ? (
                        <img src={post.imageUrl} alt={post.title} className="w-full h-40 object-cover" />
                      ) : (
                        <div className="w-full h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-primary/40" />
                        </div>
                      )}
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        </div>
                        <h3 className="font-bold text-foreground mb-1 line-clamp-2">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mb-1 line-clamp-1">{post.titleHindi}</p>
                        <p className="text-sm text-muted-foreground line-clamp-3 mt-2 flex-1">
                          {post.content.substring(0, 120)}...
                        </p>
                        <div className="mt-4 text-xs text-primary font-semibold flex items-center gap-1">
                          Read More / पूरा पढ़ें <ChevronRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Values Section */}
      <section className="py-16 bg-secondary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold mb-1">Our Core Values</h2>
            <p className="text-white/70">हमारे मूल्य</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Knowledge", titleHindi: "ज्ञान", desc: "Quality education rooted in India's rich academic tradition and modern scientific thinking." },
              { title: "Character", titleHindi: "संस्कार", desc: "Building moral values, discipline, and respect — shaping responsible citizens of tomorrow." },
              { title: "Excellence", titleHindi: "उत्कृष्टता", desc: "Striving for the highest standards in academics, sports, arts, and every sphere of school life." },
            ].map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full border-2 border-primary/60 flex items-center justify-center mx-auto mb-4 text-2xl font-serif font-bold text-primary">
                  {i + 1}
                </div>
                <h3 className="font-serif text-xl font-bold mb-1">{val.title}</h3>
                <p className="text-primary/80 text-sm mb-3">{val.titleHindi}</p>
                <p className="text-white/70 text-sm leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
