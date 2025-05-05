const Color = require('../model/color.model');

// Thêm màu mới
const createColor = async (req, res) => {
  try {
    const { name, code } = req.body;

    // Kiểm tra trùng lặp
    const existingColor = await Color.findOne({ $or: [{ name }, { code }] });
    if (existingColor) {
      return res.status(400).json({ error: 'Tên hoặc mã màu đã tồn tại.' });
    }

    const color = await Color.create({ name, code });
    res.status(201).json(color);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Lấy tất cả màu
const getAllColors = async (req, res) => {
  try {
    const colors = await Color.find().sort({ name: 1 });
    res.json(colors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xoá màu theo ID
const deleteColor = async (req, res) => {
  try {
    const color = await Color.findByIdAndDelete(req.params.id);
    if (!color) {
      return res.status(404).json({ error: 'Không tìm thấy màu' });
    }
    res.json({ message: 'Đã xoá màu thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật màu theo ID
const updateColor = async (req, res) => {

  console.log('req.params', req.params);
  
  try {
    const { name, code } = req.body;

    // Kiểm tra nếu trùng name hoặc code với màu khác
    const existingColor = await Color.findOne({
      _id: { $ne: req.params.id },
      $or: [{ name }, { code }]
    });
    if (existingColor) {
      return res.status(400).json({ error: 'Tên hoặc mã màu đã được dùng cho màu khác.' });
    }

    const color = await Color.findByIdAndUpdate(
      req.params.id,
      { name, code },
      { new: true, runValidators: true }
    );

    if (!color) {
      return res.status(404).json({ error: 'Không tìm thấy màu để cập nhật' });
    }

    res.json(color);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getAllColors, createColor,deleteColor, updateColor }