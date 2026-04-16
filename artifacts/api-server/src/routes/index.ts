import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import blogRouter from "./blog";
import galleryRouter from "./gallery";
import staffRouter from "./staff";
import settingsRouter from "./settings";
import uploadRouter from "./upload";
import noticesRouter from "./notices";
import messagesRouter from "./messages";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(blogRouter);
router.use(galleryRouter);
router.use(staffRouter);
router.use(settingsRouter);
router.use(uploadRouter);
router.use(noticesRouter);
router.use(messagesRouter);

export default router;
