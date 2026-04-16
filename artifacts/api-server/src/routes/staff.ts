import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, staffTable } from "@workspace/db";
import { z } from "zod";

const router: IRouter = Router();

const StaffBody = z.object({
  name: z.string().min(1),
  nameHindi: z.string().min(1),
  role: z.string().min(1),
  roleHindi: z.string().min(1),
  photoUrl: z.string().optional().nullable(),
  order: z.number().int().default(0),
  bio: z.string().optional().nullable(),
  bioHindi: z.string().optional().nullable(),
  bioEnabled: z.boolean().default(false),
});

const IdParam = z.object({ id: z.coerce.number().int().positive() });

router.get("/staff", async (_req, res): Promise<void> => {
  const staff = await db.select().from(staffTable).orderBy(asc(staffTable.order));
  res.json(staff);
});

router.post("/staff", async (req, res): Promise<void> => {
  const parsed = StaffBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [member] = await db.insert(staffTable).values(parsed.data).returning();
  res.status(201).json(member);
});

router.put("/staff/:id", async (req, res): Promise<void> => {
  const p = IdParam.safeParse(req.params);
  if (!p.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = StaffBody.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [member] = await db.update(staffTable).set(parsed.data).where(eq(staffTable.id, p.data.id)).returning();
  if (!member) { res.status(404).json({ error: "Staff member not found" }); return; }
  res.json(member);
});

router.delete("/staff/:id", async (req, res): Promise<void> => {
  const p = IdParam.safeParse(req.params);
  if (!p.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const [member] = await db.delete(staffTable).where(eq(staffTable.id, p.data.id)).returning();
  if (!member) { res.status(404).json({ error: "Staff member not found" }); return; }
  res.sendStatus(204);
});

export default router;
