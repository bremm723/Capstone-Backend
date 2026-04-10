import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, name: true, email: true, birthday: true,
        gender: true, height: true, weight: true,
        waterIntake: true, targetHarian: true, targetMingguan: true,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTarget = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { targetHarian: true, targetMingguan: true },
    });
    res.json({
      targetHarian: user.targetHarian || null,
      targetMingguan: user.targetMingguan || Array(7).fill(null),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTarget = async (req, res) => {
  try {
    const { targetHarian, targetMingguan } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { targetHarian, targetMingguan },
      select: { targetHarian: true, targetMingguan: true },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProfil = async (req, res) => {
  try {
    const { nama, email, birthday, gender, height, weight } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: nama,
        email,
        birthday: birthday || null,
        gender: gender || null,
        height: height ? parseFloat(height) : null,
        weight: weight ? parseFloat(weight) : null,
      },
      select: {
        id: true, name: true, email: true, birthday: true,
        gender: true, height: true, weight: true,
      },
    });
    res.json({ message: "Profil berhasil diperbarui", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { passLama, passBaru } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user.password) {
      return res.status(400).json({ message: "Akun ini tidak menggunakan password (login via Google)" });
    }
    const valid = await bcrypt.compare(passLama, user.password);
    if (!valid) return res.status(401).json({ message: "Password lama salah" });
    const hash = await bcrypt.hash(passBaru, 10);
    await prisma.user.update({ where: { id: req.user.id }, data: { password: hash } });
    res.json({ message: "Password berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
