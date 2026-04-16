import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { noticesTable, insertNoticeSchema } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router: IRouter = Router();

router.get("/notices", async (_req, res): Promise<void> => {
  const notices = await db.select().from(noticesTable).orderBy(noticesTable.createdAt);
  res.json(notices.reverse());
});

router.get("/notices/active", async (_req, res): Promise<void> => {
  const notices = await db.select().from(noticesTable).where(eq(noticesTable.isActive, true)).orderBy(noticesTable.createdAt);
  res.json(notices.reverse());
});

router.post("/notices", async (req, res): Promise<void> => {
  const session = (req as any).session;
  if (!session?.isAdmin) { res.status(401).json({ error: "Unauthorized" }); return; }
  const parsed = insertNoticeSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }
  const [notice] = await db.insert(noticesTable).values(parsed.data).returning();
  res.status(201).json(notice);
});

router.put("/notices/:id", async (req, res): Promise<void> => {
  const session = (req as any).session;
  if (!session?.isAdmin) { res.status(401).json({ error: "Unauthorized" }); return; }
  const id = parseInt(req.params.id);
  const parsed = insertNoticeSchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }
  const [notice] = await db.update(noticesTable).set(parsed.data).where(eq(noticesTable.id, id)).returning();
  if (!notice) { res.status(404).json({ error: "Not found" }); return; }
  res.json(notice);
});

router.delete("/notices/:id", async (req, res): Promise<void> => {
  const session = (req as any).session;
  if (!session?.isAdmin) { res.status(401).json({ error: "Unauthorized" }); return; }
  const id = parseInt(req.params.id);
  await db.delete(noticesTable).where(eq(noticesTable.id, id));
  res.json({ success: true });
});

export default router;
