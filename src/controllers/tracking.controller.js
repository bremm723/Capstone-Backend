import prisma from "../config/prisma.js";

export const addTracking = async (req, res) => {
  try {
    const { nama, porsi, waktu, kalori, karbo, protein, lemak, quantity } = req.body;

    let food = await prisma.food.findFirst({ where: { name: nama } });

    if (!food) {
      food = await prisma.food.create({
        data: {
          name: nama,
          calories: kalori,
          carbs: karbo || 0,
          protein: protein || 0,
          fat: lemak || 0,
          portion: porsi || "1 porsi",
        },
      });
    }

    const tracking = await prisma.tracking.create({
      data: {
        userId: req.user.id,
        foodId: food.id,
        quantity: quantity || 1,
        mealTime: waktu || "Sarapan",
      },
      include: { food: true },
    });

    res.json(tracking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTracking = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const data = await prisma.tracking.findMany({
      where: {
        userId: req.user.id,
        createdAt: { gte: today, lt: tomorrow },
      },
      include: { food: true },
      orderBy: { createdAt: "asc" },
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTracking = async (req, res) => {
  try {
    const { id } = req.params;
    // Verify ownership before deleting
    const tracking = await prisma.tracking.findFirst({
      where: { id: parseInt(id), userId: req.user.id },
    });
    if (!tracking) return res.status(404).json({ message: "Tracking tidak ditemukan" });

    await prisma.tracking.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Tracking berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTracking = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, porsi, waktu, kalori, karbo, protein, lemak } = req.body;

    // Verify ownership
    const existing = await prisma.tracking.findFirst({
      where: { id: parseInt(id), userId: req.user.id },
    });
    if (!existing) return res.status(404).json({ message: "Tracking tidak ditemukan" });

    let food = await prisma.food.findFirst({ where: { name: nama } });
    if (!food) {
      food = await prisma.food.create({
        data: {
          name: nama,
          calories: kalori,
          carbs: karbo || 0,
          protein: protein || 0,
          fat: lemak || 0,
          portion: porsi || "1 porsi",
        },
      });
    }

    const tracking = await prisma.tracking.update({
      where: { id: parseInt(id) },
      data: { foodId: food.id, mealTime: waktu || "Sarapan" },
      include: { food: true },
    });

    res.json(tracking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAir = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { waterIntake: true },
    });
    res.json({ jumlah: user.waterIntake || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAir = async (req, res) => {
  try {
    const { jumlah } = req.body;
    await prisma.user.update({
      where: { id: req.user.id },
      data: { waterIntake: jumlah },
    });
    res.json({ jumlah });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
