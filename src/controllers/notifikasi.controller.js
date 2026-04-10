import prisma from "../config/prisma.js";

export const getNotifikasi = async (req, res) => {
  try {
    const data = await prisma.notifikasi.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const hapusNotifikasi = async (req, res) => {
  try {
    const notif = await prisma.notifikasi.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
    });
    if (!notif) return res.status(404).json({ message: "Notifikasi tidak ditemukan" });

    await prisma.notifikasi.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Notifikasi dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const tandaiSemuaDibaca = async (req, res) => {
  try {
    await prisma.notifikasi.updateMany({
      where: { userId: req.user.id },
      data: { terbaca: true },
    });
    res.json({ message: "Semua notifikasi ditandai dibaca" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
