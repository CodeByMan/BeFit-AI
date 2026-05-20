const FoodLog = require('../models/FoodLog');
const { createFoodLogSchema } = require('../validators/foodlogValidator');
const { createFoodLog, updateFoodLog, getDailySummary } = require('../services/foodLogService');
const PDFDocument = require('pdfkit');

// POST /api/foodlog
exports.create = async (req, res) => {
  try {
    const { error, value } = createFoodLogSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const log = await createFoodLog(req.user.id, value);
    res.status(201).json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create food log" });
  }
};

// GET all food logs
exports.list = async (req, res) => {
  try {
    const logs = await FoodLog.find({ user: req.user.id }).sort({ date: -1 });
    res.json({ logs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch food logs" });
  }
};

// GET single food log
exports.get = async (req, res) => {
  try {
    const log = await FoodLog.findOne({ _id: req.params.id, user: req.user.id });
    if (!log) return res.status(404).json({ message: "Food log not found" });
    res.json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch food log" });
  }
};

// PUT update food log
exports.update = async (req, res) => {
  try {
    const { error, value } = createFoodLogSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const log = await updateFoodLog(req.user.id, req.params.id, value);
    res.json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Failed to update food log" });
  }
};

// DELETE food log
exports.remove = async (req, res) => {
  try {
    const deleted = await FoodLog.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deleted) return res.status(404).json({ message: "Food log not found" });
    res.json({ message: "Food log deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete food log" });
  }
};

// GET daily summary
exports.dailySummary = async (req, res) => {
  try {
    const date = req.query.date;
    if (!date) return res.status(400).json({ message: "Date is required" });

    const summary = await getDailySummary(req.user.id, date);
    res.json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get daily summary" });
  }
};

exports.list = async (req, res) => {
  try {
    const { from, to, search } = req.query;

    const query = { user: req.user.id };

    // Date filter
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    // Search filter
    if (search) {
      query.$or = [
        { "meals.name": { $regex: search, $options: "i" } },
        { "meals.items.name": { $regex: search, $options: "i" } }
      ];
    }

    const logs = await FoodLog.find(query).sort({ date: -1 });
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch food logs" });
  }
};


exports.exportPdf = async (req, res) => {
  try {
    const log = await FoodLog.findOne({ _id: req.params.id, user: req.user.id });
    if (!log) return res.status(404).json({ message: "Food log not found" });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="foodlog-${log._id}.pdf"`);

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    doc.pipe(res);

// Title - centered
doc.fontSize(20)
   .text(`${log.title}`, { underline: true, align: 'center' });
doc.moveDown();

// Date - centered
doc.fontSize(14)
   .text(`Date: ${log.date ? log.date.toDateString() : 'N/A'}`, { align: 'center' });
doc.moveDown(2);


    const tableLeft = 50;
    const rowHeight = 25;
    const colWidths = { item: 150, calories: 80, carbs: 80, protein: 80, fats: 80 };

    doc.fontSize(12).font('Helvetica');

    let y = doc.y;

    let grandTotals = { calories: 0, carbs: 0, protein: 0, fats: 0 };

    log.meals.forEach((meal, mealIndex) => {
      // Meal title row
      const mealWidth = Object.values(colWidths).reduce((a, b) => a + b);
      doc.rect(tableLeft, y, mealWidth, rowHeight).stroke();
      doc.font('Helvetica-Bold').text(`${meal.name}`, tableLeft + 5, y + 7);
      y += rowHeight;

      // Table header
      const headers = ['Item', 'Calories', 'Carbs', 'Protein', 'Fats'];
      let x = tableLeft;
      doc.font('Helvetica-Bold');
      headers.forEach((header, i) => {
        const width = Object.values(colWidths)[i];
        doc.rect(x, y, width, rowHeight).stroke();
        if (i === 0) doc.text(header, x + 5, y + 7);
        else doc.text(header, x + width - 5 - doc.widthOfString(header), y + 7);
        x += width;
      });
      y += rowHeight;
      doc.moveTo(tableLeft, y).lineTo(tableLeft + mealWidth, y).stroke();

      // Items
      doc.font('Helvetica');
      let mealTotals = { calories: 0, carbs: 0, protein: 0, fats: 0 };

      meal.items.forEach((item) => {
        x = tableLeft;
        const values = [
          item.name,
          item.calories?.toString() || '0',
          item.carbs?.toString() || '0',
          item.protein?.toString() || '0',
          item.fats?.toString() || '0'
        ];

        mealTotals.calories += Number(item.calories || 0);
        mealTotals.carbs += Number(item.carbs || 0);
        mealTotals.protein += Number(item.protein || 0);
        mealTotals.fats += Number(item.fats || 0);

        values.forEach((val, i) => {
          const width = Object.values(colWidths)[i];
          doc.rect(x, y, width, rowHeight).stroke();
          if (i === 0) doc.text(val, x + 5, y + 7);
          else doc.text(val, x + width - 5 - doc.widthOfString(val), y + 7);
          x += width;
        });

        y += rowHeight;
        if (y > doc.page.height - 50) {
          doc.addPage();
          y = 50;
        }
      });

      // Meal totals row
      x = tableLeft;
      doc.font('Helvetica-Bold');
      const totalLabels = ['Totals', mealTotals.calories, mealTotals.carbs, mealTotals.protein, mealTotals.fats];
      totalLabels.forEach((val, i) => {
        const width = Object.values(colWidths)[i];
        doc.rect(x, y, width, rowHeight).stroke();
        if (i === 0) doc.text(val.toString(), x + 5, y + 7);
        else doc.text(val.toString(), x + width - 5 - doc.widthOfString(val.toString()), y + 7);
        x += width;
      });
      y += rowHeight + 10;

      // Add to grand totals
      grandTotals.calories += mealTotals.calories;
      grandTotals.carbs += mealTotals.carbs;
      grandTotals.protein += mealTotals.protein;
      grandTotals.fats += mealTotals.fats;
    });

    // Grand totals row
    doc.font('Helvetica-Bold');
    const grandTotalText = ['Grand Totals', grandTotals.calories, grandTotals.carbs, grandTotals.protein, grandTotals.fats];
    x = tableLeft;
    grandTotalText.forEach((val, i) => {
      const width = Object.values(colWidths)[i];
      doc.rect(x, y, width, rowHeight).stroke();
      if (i === 0) doc.text(val.toString(), x + 5, y + 7);
      else doc.text(val.toString(), x + width - 5 - doc.widthOfString(val.toString()), y + 7);
      x += width;
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
};

