import express from "express";
import {
  getNotifikasi,
  hapusNotifikasi,
  tandaiSemuaDibaca,
} from "../controllers/notifikasi.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getNotifikasi);
router.delete("/:id", verifyToken, hapusNotifikasi);
router.put("/tandai-semua", verifyToken, tandaiSemuaDibaca);

export default router;
