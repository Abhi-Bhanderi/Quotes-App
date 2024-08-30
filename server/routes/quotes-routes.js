import { Router } from "express";
import { StrictlyProtected, UnStrictlyProtected } from "../middleware/auth.js";
import {
  addFavorite,
  createMany,
  createSingleQuote,
  getFavorites,
  getQuotes,
  getRandomQuote,
  removeFavorite,
} from "../controllers/quotes-controller.js";

const router = Router();

router.route("/").get(UnStrictlyProtected, getQuotes);
router.route("/random").get(getRandomQuote);
router.route("/").post(StrictlyProtected, createSingleQuote);
router.route("/many").post(StrictlyProtected, createMany);

// Mutate Favorites
router.route("/favorites").get(StrictlyProtected, getFavorites);
router.route("/favorites/:id").post(StrictlyProtected, addFavorite);
router.route("/favorites/:id").delete(StrictlyProtected, removeFavorite);

export default router;
