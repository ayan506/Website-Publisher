import { Router, type IRouter } from "express";
import { eq, desc, asc } from "drizzle-orm";
import { db, galleryAlbumsTable, galleryPhotosTable } from "@workspace/db";
import { z } from "zod";

const router: IRouter = Router();

const AlbumBody = z.object({
  name: z.string().min(1),
  nameHindi: z.string().min(1),
  description: z.string().optional().nullable(),
  coverImageUrl: z.string().optional().nullable(),
  eventDate: z.string().optional().nullable(),
});

const PhotoBody = z.object({
  title: z.string().min(1),
  titleHindi: z.string().min(1),
  imageUrl: z.string().min(1),
  category: z.string().min(1),
  albumId: z.number().int().nullable().optional(),
});

const IdParam = z.object({ id: z.coerce.number().int().positive() });

router.get("/gallery/albums", async (_req, res): Promise<void> => {
  const albums = await db.select().from(galleryAlbumsTable).orderBy(desc(galleryAlbumsTable.createdAt));
  res.json(albums);
});

router.get("/gallery/albums/:id/photos", async (req, res): Promise<void> => {
  const p = IdParam.safeParse(req.params);
  if (!p.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const photos = await db.select().from(galleryPhotosTable)
    .where(eq(galleryPhotosTable.albumId, p.data.id))
    .orderBy(asc(galleryPhotosTable.createdAt));
  res.json(photos);
});

router.post("/gallery/albums", async (req, res): Promise<void> => {
  const parsed = AlbumBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [album] = await db.insert(galleryAlbumsTable).values(parsed.data).returning();
  res.status(201).json(album);
});

router.put("/gallery/albums/:id", async (req, res): Promise<void> => {
  const p = IdParam.safeParse(req.params);
  if (!p.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = AlbumBody.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [album] = await db.update(galleryAlbumsTable).set(parsed.data).where(eq(galleryAlbumsTable.id, p.data.id)).returning();
  if (!album) { res.status(404).json({ error: "Album not found" }); return; }
  res.json(album);
});

router.delete("/gallery/albums/:id", async (req, res): Promise<void> => {
  const p = IdParam.safeParse(req.params);
  if (!p.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(galleryPhotosTable).where(eq(galleryPhotosTable.albumId, p.data.id));
  const [album] = await db.delete(galleryAlbumsTable).where(eq(galleryAlbumsTable.id, p.data.id)).returning();
  if (!album) { res.status(404).json({ error: "Album not found" }); return; }
  res.sendStatus(204);
});

router.get("/gallery", async (_req, res): Promise<void> => {
  const photos = await db.select().from(galleryPhotosTable).orderBy(desc(galleryPhotosTable.createdAt));
  res.json(photos);
});

router.post("/gallery", async (req, res): Promise<void> => {
  const parsed = PhotoBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [photo] = await db.insert(galleryPhotosTable).values(parsed.data).returning();
  res.status(201).json(photo);
});

router.put("/gallery/:id", async (req, res): Promise<void> => {
  const p = IdParam.safeParse(req.params);
  if (!p.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = PhotoBody.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [photo] = await db.update(galleryPhotosTable).set(parsed.data).where(eq(galleryPhotosTable.id, p.data.id)).returning();
  if (!photo) { res.status(404).json({ error: "Photo not found" }); return; }
  res.json(photo);
});

router.delete("/gallery/:id", async (req, res): Promise<void> => {
  const p = IdParam.safeParse(req.params);
  if (!p.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const [photo] = await db.delete(galleryPhotosTable).where(eq(galleryPhotosTable.id, p.data.id)).returning();
  if (!photo) { res.status(404).json({ error: "Photo not found" }); return; }
  res.sendStatus(204);
});

export default router;
