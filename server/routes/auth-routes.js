import { Router } from "express";
import {
  refreshToken,
  signInWithGoogle,
} from "../controllers/auth-controller.js";

const router = Router();

router.route("/google").post(signInWithGoogle);
router.route("/refresh").post(refreshToken);

export default router;
