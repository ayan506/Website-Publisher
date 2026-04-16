import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { messagesTable, insertMessageSchema } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.post("/messages", async (req, res): Promise<void> => {
  const parsed = insertMessageSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }
  const [msg] = await db.insert(messagesTable).values(parsed.data).returning();
  res.status(201).json(msg);
});

router.get("/messages", async (req, res): Promise<void> => {
  const session = (req as any).session;
  if (!session?.isAdmin) { res.status(401).json({ error: "Unauthorized" }); return; }
  const msgs = await db.select().from(messagesTable).orderBy(messagesTable.createdAt);
  res.json(msgs.reverse());
});

router.put("/messages/:id/read", async (req, res): Promise<void> => {
  const session = (req as any).session;
  if (!session?.isAdmin) { res.status(401).json({ error: "Unauthorized" }); return; }
  const id = parseInt(req.params.id);
  const [msg] = await db.update(messagesTable).set({ isRead: true }).where(eq(messagesTable.id, id)).returning();
  if (!msg) { res.status(404).json({ error: "Not found" }); return; }
  res.json(msg);
});

router.delete("/messages/:id", async (req, res): Promise<void> => {
  const session = (req as any).session;
  if (!session?.isAdmin) { res.status(401).json({ error: "Unauthorized" }); return; }
  const id = parseInt(req.params.id);
  await db.delete(messagesTable).where(eq(messagesTable.id, id));
  res.json({ success: true });
});

export default router;
