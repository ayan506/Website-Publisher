import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircle2, X, BookOpen } from "lucide-react";

interface StaffMember {
  id: number;
  name: string;
  nameHindi: string;
  role: string;
  roleHindi: string;
  photoUrl?: string | null;
  order: number;
  bio?: string | null;
  bioHindi?: string | null;
  bioEnabled: boolean;
}

export default function Administrative() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [bioModal, setBioModal] = useState<StaffMember | null>(null);

  useEffect(() => {
    fetch("/api/staff")
      .then(r => r.json())
      .then(setStaff)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const principal = staff.filter(s => s.role.toLowerCase().includes("principal") && !s.role.toLowerCase().includes("vice"));
  const others = staff.filter(s => !(s.role.toLowerCase().includes("principal") && !s.role.toLowerCase().includes("vice")));

  return (
    <div>
      <section className="bg-gradient-to-br from-secondary to-secondary/80 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">Administration</h1>
            <p className="text-2xl text-primary/90 font-serif">प्रशासन</p>
            <p className="text-white/70 mt-4">Meet the team leading our institution</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-secondary mb-2">हमारी प्रशासनिक टीम</h2>
            <p className="text-muted-foreground">Our Administrative Team</p>
          </div>

          {loading && (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-card border rounded-xl p-6 animate-pulse text-center">
                  <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mx-auto mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          )}

          {!loading && staff.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <UserCircle2 className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p>No staff members added yet.</p>
            </div>
          )}

          {!loading && staff.length > 0 && (
            <>
              {/* Principal — centred prominently */}
              {principal.length > 0 && (
                <div className="flex justify-center mb-12">
                  <div className="flex flex-wrap justify-center gap-8">
                    {principal.map((member, i) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className="w-full max-w-xs"
                      >
                        <StaffCard member={member} featured onBio={() => setBioModal(member)} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Other staff — centred grid */}
              {others.length > 0 && (
                <div className="flex justify-center">
                  <div className={`grid gap-6 w-full ${
                    others.length === 1 ? "grid-cols-1 max-w-xs" :
                    others.length === 2 ? "grid-cols-2 max-w-lg" :
                    others.length === 3 ? "grid-cols-3 max-w-2xl" :
                    "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  }`}>
                    {others.map((member, i) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                      >
                        <StaffCard member={member} onBio={() => setBioModal(member)} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <AnimatePresence>
        {bioModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setBioModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="bg-card rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between p-6 border-b">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-muted border-2 border-primary/20 flex items-center justify-center flex-shrink-0">
                    {bioModal.photoUrl ? (
                      <img src={bioModal.photoUrl} alt={bioModal.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle2 className="w-10 h-10 text-muted-foreground/40" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-foreground">{bioModal.name}</h3>
                    <p className="text-sm text-muted-foreground">{bioModal.nameHindi}</p>
                    <span className="inline-block bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5 mt-1">
                      {bioModal.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setBioModal(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                {bioModal.bioHindi && (
                  <p className="text-foreground/80 leading-relaxed mb-4 text-sm">{bioModal.bioHindi}</p>
                )}
                {bioModal.bio && (
                  <p className="text-muted-foreground leading-relaxed text-sm italic">{bioModal.bio}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StaffCard({ member, featured = false, onBio }: { member: StaffMember; featured?: boolean; onBio: () => void }) {
  return (
    <div className={`bg-card border rounded-xl shadow-sm hover:shadow-md transition-shadow text-center ${featured ? "p-10 border-primary/30 border-2" : "p-6"}`}>
      <div className={`rounded-full overflow-hidden mx-auto mb-4 border-4 ${featured ? "w-32 h-32 border-primary/30" : "w-20 h-20 border-border"} flex items-center justify-center bg-muted`}>
        {member.photoUrl ? (
          <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
        ) : (
          <UserCircle2 className={`text-muted-foreground/40 ${featured ? "w-20 h-20" : "w-12 h-12"}`} />
        )}
      </div>
      {featured && (
        <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Principal / प्राचार्य</div>
      )}
      <h3 className={`font-serif font-bold text-foreground ${featured ? "text-xl mb-1" : "text-base mb-1"}`}>{member.name}</h3>
      <p className="text-muted-foreground text-sm mb-2">{member.nameHindi}</p>
      <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold">
        {member.role}
      </span>
      <p className="text-muted-foreground text-xs mt-1">{member.roleHindi}</p>
      {member.bioEnabled && (
        <button
          onClick={onBio}
          className="mt-4 flex items-center gap-1.5 mx-auto text-xs bg-secondary/10 text-secondary border border-secondary/20 rounded-lg px-3 py-1.5 hover:bg-secondary/20 transition-colors font-medium"
        >
          <BookOpen className="w-3 h-3" />
          About / परिचय
        </button>
      )}
    </div>
  );
}
