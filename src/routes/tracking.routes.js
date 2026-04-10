import express from "express";
import {
  addTracking,
  getTracking,
  deleteTracking,
  updateTracking,
  getAir,
  updateAir,
} from "../controllers/tracking.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getTracking);
router.post("/", verifyToken, addTracking);

// Water intake routes — must be before /:id to avoid conflict
router.get("/air", verifyToken, getAir);
router.put("/air", verifyToken, updateAir);

router.put("/:id", verifyToken, updateTracking);
router.delete("/:id", verifyToken, deleteTracking);

export default router;
