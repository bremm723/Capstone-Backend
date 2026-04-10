import prisma from "../config/prisma.js";

export const getFoods = async (req, res) => {
  try {
    const foods = await prisma.food.findMany();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addFood = async (req, res) => {
  try {
    const { name, calories } = req.body;
    const food = await prisma.food.create({
      data: { name, calories },
    });
    res.json(food);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
