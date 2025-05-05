const Size = require('../model/color.model');

exports.createSize = async (req, res) => {
  try {
    const { name, description } = req.body;

    
    const existing = await Size.findOne({ name });
    if (existing) {
      return res.status(400).json({ error: 'Size đã tồn tại' });
    }

    const size = await Size.create({ name, description });
    res.status(201).json(size);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getAllSizes = async (req, res) => {
  try {
    const sizes = await Size.find().sort({ name: 1 });
    res.json(sizes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateSize = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existing = await Size.findOne({
      _id: { $ne: req.params.id },
      name
    });
    if (existing) {
      return res.status(400).json({ error: 'Size đã tồn tại cho ID khác' });
    }

    const updated = await Size.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: 'Không tìm thấy size' });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.deleteSize = async (req, res) => {
  try {
    const deleted = await Size.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Không tìm thấy size' });

    res.json({ message: 'Xoá size thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
