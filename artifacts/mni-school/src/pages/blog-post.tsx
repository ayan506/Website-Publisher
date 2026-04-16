import { useGetBlogPost } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft, BookOpen } from "lucide-react";

interface Props {
  id: string;
}

export default function BlogPost({ id }: Props) {
  const postId = parseInt(id, 10);
  const { data: post, isLoading, error } = useGetBlogPost(postId, { query: { enabled: !!postId && !isNaN(postId) } });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-3xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-5 bg-muted rounded w-1/2" />
          <div className="h-64 bg-muted rounded" />
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-xl">
        <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Post not found</h2>
        <p className="text-muted-foreground mb-6">The blog post you are looking for does not exist.</p>
        <Link href="/blog">
          <button className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
            Back to Blog
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary to-secondary/80 text-white py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link href="/blog">
            <button className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Blog / ब्लॉग पर वापस
            </button>
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">{post.title}</h1>
            <p className="text-xl text-primary/90 font-serif mb-4">{post.titleHindi}</p>
            <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {post.author}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          {post.imageUrl && (
            <motion.img
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-72 object-cover rounded-2xl mb-10 shadow-md"
            />
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* Hindi content */}
            <div className="mb-8">
              <h2 className="font-serif text-xl font-bold text-secondary mb-4 pb-2 border-b">हिंदी में</h2>
              <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed">
                {post.contentHindi.split("\n").map((para, i) => (
                  <p key={i} className="mb-4">{para}</p>
                ))}
              </div>
            </div>

            {/* English content */}
            <div>
              <h2 className="font-serif text-xl font-bold text-secondary mb-4 pb-2 border-b">In English</h2>
              <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed">
                {post.content.split("\n").map((para, i) => (
                  <p key={i} className="mb-4">{para}</p>
                ))}
              </div>
            </div>

            <div className="mt-10 pt-6 border-t flex items-center justify-between">
              <Link href="/blog">
                <button className="flex items-center gap-2 text-primary hover:underline text-sm font-semibold">
                  <ArrowLeft className="w-4 h-4" /> All Posts
                </button>
              </Link>
              <span className="text-xs text-muted-foreground">
                Updated: {new Date(post.updatedAt).toLocaleDateString("en-IN")}
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
