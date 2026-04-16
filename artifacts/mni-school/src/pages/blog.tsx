import { useListBlogPosts } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Calendar, User, ChevronRight, BookOpen } from "lucide-react";

export default function Blog() {
  const { data: posts, isLoading } = useListBlogPosts();

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-secondary to-secondary/80 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">Blog</h1>
            <p className="text-2xl text-primary/90 font-serif">ब्लॉग</p>
            <p className="text-white/70 mt-4">News, announcements and stories from our school</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          {isLoading && (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-card border rounded-xl p-6 animate-pulse">
                  <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && (!posts || posts.length === 0) && (
            <div className="text-center py-20 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium">No blog posts yet.</p>
              <p className="text-sm">अभी कोई ब्लॉग पोस्ट नहीं है।</p>
            </div>
          )}

          <div className="space-y-8">
            {posts?.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link href={`/blog/${post.id}`}>
                  <div className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer flex flex-col md:flex-row">
                    <div className="md:w-64 flex-shrink-0">
                      {post.imageUrl ? (
                        <img src={post.imageUrl} alt={post.title} className="w-full h-48 md:h-full object-cover" />
                      ) : (
                        <div className="w-full h-48 md:h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center min-h-[120px]">
                          <BookOpen className="w-12 h-12 text-primary/30" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {post.author}
                        </span>
                      </div>
                      <h2 className="font-serif text-xl font-bold text-foreground mb-1">{post.title}</h2>
                      <p className="text-primary font-medium text-sm mb-3">{post.titleHindi}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-2">
                        {post.contentHindi.substring(0, 200)}...
                      </p>
                      <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                        {post.content.substring(0, 150)}...
                      </p>
                      <div className="mt-4 text-primary text-sm font-semibold flex items-center gap-1">
                        पूरा पढ़ें / Read More <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
