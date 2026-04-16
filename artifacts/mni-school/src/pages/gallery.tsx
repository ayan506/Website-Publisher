import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ImageOff, ArrowLeft, Images, Calendar } from "lucide-react";

interface Album {
  id: number;
  name: string;
  nameHindi: string;
  description?: string | null;
  coverImageUrl?: string | null;
  eventDate?: string | null;
  createdAt: string;
}

interface Photo {
  id: number;
  title: string;
  titleHindi: string;
  imageUrl: string;
  category: string;
  albumId?: number | null;
}

const FALLBACK = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80";

export default function Gallery() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAlbum, setOpenAlbum] = useState<Album | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<Photo[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  useEffect(() => {
    fetch("/api/gallery/albums")
      .then(r => r.json())
      .then(setAlbums)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openAlbumView = async (album: Album) => {
    setOpenAlbum(album);
    setPhotosLoading(true);
    try {
      const res = await fetch(`/api/gallery/albums/${album.id}/photos`);
      const data = await res.json();
      setAlbumPhotos(data);
    } catch {
      setAlbumPhotos([]);
    } finally {
      setPhotosLoading(false);
    }
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-secondary to-secondary/80 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">Photo Gallery</h1>
            <p className="text-2xl text-primary/90 font-serif">फोटो गैलरी</p>
            <p className="text-white/70 mt-4">Memories and moments from our school life</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <AnimatePresence mode="wait">
            {!openAlbum ? (
              <motion.div key="albums" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="text-center mb-10">
                  <h2 className="font-serif text-3xl font-bold text-secondary mb-2">कार्यक्रम एल्बम</h2>
                  <p className="text-muted-foreground">Event Albums — Click to explore photos</p>
                </div>

                {loading && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="rounded-2xl bg-muted animate-pulse" style={{ aspectRatio: "4/3" }} />
                    ))}
                  </div>
                )}

                {!loading && albums.length === 0 && (
                  <div className="text-center py-20 text-muted-foreground">
                    <ImageOff className="w-12 h-12 mx-auto mb-4 opacity-40" />
                    <p className="text-lg font-medium">No albums yet.</p>
                    <p className="text-sm mt-1">Albums will appear here once added by the admin.</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {albums.map((album, i) => (
                    <motion.div
                      key={album.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.4 }}
                      className="group cursor-pointer rounded-2xl overflow-hidden border bg-card shadow-sm hover:shadow-xl transition-all duration-300"
                      onClick={() => openAlbumView(album)}
                    >
                      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                        <img
                          src={album.coverImageUrl || FALLBACK}
                          alt={album.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={e => { (e.target as HTMLImageElement).src = FALLBACK; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="flex items-center gap-1 text-white/70 text-xs mb-1">
                            <Images className="w-3 h-3" />
                            <span>Click to view photos</span>
                          </div>
                        </div>
                        <div className="absolute top-3 right-3 bg-primary text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowLeft className="w-3 h-3 rotate-180" />
                        </div>
                      </div>
                      <div className="p-4 bg-card">
                        <h3 className="font-serif font-bold text-secondary text-lg leading-tight mb-1">{album.nameHindi}</h3>
                        <p className="text-sm text-muted-foreground font-medium mb-2">{album.name}</p>
                        {album.eventDate && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>{album.eventDate}</span>
                          </div>
                        )}
                        {album.description && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{album.description}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="album-detail" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <div className="flex items-center gap-4 mb-8">
                  <button
                    onClick={() => { setOpenAlbum(null); setAlbumPhotos([]); }}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-card border rounded-lg px-4 py-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Albums
                  </button>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-secondary">{openAlbum.nameHindi}</h2>
                    <p className="text-sm text-muted-foreground">{openAlbum.name}</p>
                  </div>
                </div>

                {photosLoading && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="aspect-square bg-muted rounded-xl animate-pulse" />
                    ))}
                  </div>
                )}

                {!photosLoading && albumPhotos.length === 0 && (
                  <div className="text-center py-20 text-muted-foreground">
                    <ImageOff className="w-12 h-12 mx-auto mb-4 opacity-40" />
                    <p>No photos in this album yet.</p>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {albumPhotos.map((photo, i) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                      className="group cursor-pointer overflow-hidden rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow"
                      onClick={() => setLightbox(photo)}
                    >
                      <div className="aspect-square relative overflow-hidden">
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={e => { (e.target as HTMLImageElement).src = FALLBACK; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-3 left-3 right-3">
                            <p className="text-white text-xs font-semibold line-clamp-1">{photo.titleHindi}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2 bg-card">
                        <p className="text-xs font-medium text-foreground line-clamp-1">{photo.titleHindi}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 text-white bg-white/20 rounded-full p-2 hover:bg-white/30 transition-colors"
              onClick={() => setLightbox(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="max-w-3xl max-h-[85vh] w-full"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={lightbox.imageUrl}
                alt={lightbox.title}
                className="w-full max-h-[72vh] object-contain rounded-xl"
                onError={e => { (e.target as HTMLImageElement).src = FALLBACK; }}
              />
              <div className="mt-4 text-center text-white">
                <p className="font-bold text-lg">{lightbox.titleHindi}</p>
                <p className="text-white/70 text-sm">{lightbox.title}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
