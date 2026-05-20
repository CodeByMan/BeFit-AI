const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { query, weight, unit } = req.body;
    if (!query || !weight) return res.status(400).json({ error: "Missing query or weight" });

    let grams = weight;
    if (unit === "oz") grams = weight * 28.3495231;

    const searchRes = await axios.get(
      "https://api.nal.usda.gov/fdc/v1/foods/search",
      {
        params: {
          api_key: process.env.USDA_API_KEY,
          query,
          pageSize: 1
        }
      }
    );

    if (!searchRes.data.foods || searchRes.data.foods.length === 0)
      return res.status(404).json({ error: "Food not found" });

    const food = searchRes.data.foods[0];

    if (!food.foodNutrients || food.foodNutrients.length === 0)
      return res.status(404).json({ error: "No nutrient data found for this food" });

    const nutrients = {};
    food.foodNutrients.forEach((n) => {
      switch (n.nutrientName) {
        case "Energy": nutrients.calories = (n.value * grams) / 100; break;
        case "Protein": nutrients.protein = (n.value * grams) / 100; break;
        case "Total lipid (fat)": nutrients.fat = (n.value * grams) / 100; break;
        case "Carbohydrate, by difference": nutrients.carbs = (n.value * grams) / 100; break;
        case "Fiber, total dietary": nutrients.fiber = (n.value * grams) / 100; break;
        case "Sugars, total including NLEA": nutrients.sugar = (n.value * grams) / 100; break;
      }
    });

    res.json({
      ingredient: food.description,
      weightInGrams: grams,
      ...nutrients,
      raw: food
    });

  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch nutrition",
      details: err.response?.data || err.message
    });
  }
});

module.exports = router;
