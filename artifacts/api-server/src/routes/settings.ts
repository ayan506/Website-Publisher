import { Router, type IRouter } from "express";
import { db, siteSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

const DEFAULT_SETTINGS: Record<string, string> = {
  home_title: "MNI Higher Secondary School",
  home_title_hindi: "एम.एन.आई. उच्चतर माध्यमिक विद्यालय",
  home_tagline: "ज्ञान, संस्कार और उत्कृष्टता की ओर – एक सशक्त भविष्य की नींव",
  home_tagline_english: "Nurturing minds, building character, and shaping futures for generations.",
  home_stats_students: "1200+",
  home_stats_teachers: "60+",
  home_stats_years: "25+",
  contact_address: "MNI Higher Secondary School, Sambhal, Uttar Pradesh – 244302",
  contact_address_hindi: "एम.एन.आई. उच्चतर माध्यमिक विद्यालय, संभल, उत्तर प्रदेश – 244302",
  contact_phone: "+91 98765 43210",
  contact_phone2: "+91 87654 32109",
  contact_email: "info@mnischool.edu.in",
  contact_hours: "Monday – Saturday: 8:00 AM – 4:00 PM",
  founder_name: "Late Mr. Zaheer Ahmad Hashmi",
  founder_photo: "",
  founder_bio: `The foundation of MNI Higher Secondary School, Sambhal, is built upon the noble vision and selfless dedication of our esteemed founder, Late Mr. Zaheer Ahmad Hashmi. A visionary with a profound commitment to social upliftment, Mr. Hashmi believed that education is the most powerful tool for individual growth and community progress.

A Vision of Inclusivity: Mr. Zaheer Ahmad Hashmi's mission was rooted in the principle of universal education. He firmly held the conviction that learning should transcend all boundaries. Under his guidance, the school was established as a sanctuary of knowledge where every child is welcome, regardless of their religious background, socio-economic status, or social standing.

Quality Education for All: Mr. Hashmi's primary objective was to provide high-quality education at the lowest possible cost. He envisioned a world where no child is left behind due to a lack of resources.

"Education is the birthright of every child, and cost should never be the cage that keeps a bird from flying." — The Philosophy of Late Mr. Zaheer Ahmad Hashmi`,
  about_mission: "To provide quality education that nurtures intellectual growth, moral character, and social responsibility in every student.",
  about_mission_hindi: "प्रत्येक छात्र में बौद्धिक विकास, नैतिक चरित्र और सामाजिक उत्तरदायित्व का पोषण करने वाली गुणवत्तापूर्ण शिक्षा प्रदान करना।",
  about_vision: "To be the leading institution of academic excellence and character building in Sambhal and beyond.",
  about_vision_hindi: "संभल और उससे परे शैक्षणिक उत्कृष्टता और चरित्र निर्माण की अग्रणी संस्था बनना।",
};

router.get("/settings", async (_req, res): Promise<void> => {
  const rows = await db.select().from(siteSettingsTable);
  const result: Record<string, string> = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    result[row.key] = row.value;
  }
  res.json(result);
});

router.put("/settings", async (req, res): Promise<void> => {
  const updates = req.body as Record<string, string>;
  if (!updates || typeof updates !== "object") {
    res.status(400).json({ error: "Invalid body" });
    return;
  }

  for (const [key, value] of Object.entries(updates)) {
    await db
      .insert(siteSettingsTable)
      .values({ key, value: String(value) })
      .onConflictDoUpdate({ target: siteSettingsTable.key, set: { value: String(value) } });
  }

  const rows = await db.select().from(siteSettingsTable);
  const result: Record<string, string> = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    result[row.key] = row.value;
  }
  res.json(result);
});

export default router;
