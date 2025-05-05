const Category = require('../model/category.model');

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, description, image, parent, order } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        msg: "Thiếu thông tin bắt buộc"
      });
    }

    // Check if category name already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        msg: "Tên danh mục đã tồn tại"
      });
    }

    // Calculate level and path if parent is provided
    let level = 1;
    let path = '';
    
    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return res.status(404).json({
          msg: "Danh mục cha không tồn tại"
        });
      }
      level = parentCategory.level + 1;
      path = parentCategory.path ? `${parentCategory.path}/${parent}` : parent;
    }

    const newCategory = new Category({
      name,
      description,
      image,
      parent,
      level,
      path,
      order: order || 0
    });

    await newCategory.save();

    return res.status(201).json({
      msg: "Tạo danh mục thành công",
      category: newCategory
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({
      msg: "Lỗi server"
    });
  }
};

// Get all categories with filtering and pagination
const getCategories = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      parent,
      isActive,
      search,
      sortBy = 'order',
      sortOrder = 'asc'
    } = req.query;

    const query = {};

    if (parent !== undefined) query.parent = parent || null;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$text = { $search: search };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const categories = await Category.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('parent');

    const total = await Category.countDocuments(query);

    return res.status(200).json({
      categories,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error("Error getting categories:", error);
    return res.status(500).json({
      msg: "Lỗi server"
    });
  }
};

// Get a single category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id)
      .populate('parent');

    if (!category) {
      return res.status(404).json({
        msg: "Không tìm thấy danh mục"
      });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error("Error getting category:", error);
    return res.status(500).json({
      msg: "Lỗi server"
    });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        msg: "Không tìm thấy danh mục"
      });
    }

    // If name is being updated, check for duplicates
    if (updateData.name && updateData.name !== category.name) {
      const existingCategory = await Category.findOne({ name: updateData.name });
      if (existingCategory) {
        return res.status(400).json({
          msg: "Tên danh mục đã tồn tại"
        });
      }
    }

    // If parent is being updated, recalculate level and path
    if (updateData.parent !== undefined) {
      let level = 1;
      let path = '';
      
      if (updateData.parent) {
        const parentCategory = await Category.findById(updateData.parent);
        if (!parentCategory) {
          return res.status(404).json({
            msg: "Danh mục cha không tồn tại"
          });
        }
        level = parentCategory.level + 1;
        path = parentCategory.path ? `${parentCategory.path}/${updateData.parent}` : updateData.parent;
      }

      updateData.level = level;
      updateData.path = path;
    }

    // Update category fields
    Object.keys(updateData).forEach(key => {
      if (key !== '_id' && key !== 'createdAt' && key !== 'updatedAt') {
        category[key] = updateData[key];
      }
    });

    await category.save();

    return res.status(200).json({
      msg: "Cập nhật danh mục thành công",
      category
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({
      msg: "Lỗi server"
    });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        msg: "Không tìm thấy danh mục"
      });
    }

    // Check if category has children
    const hasChildren = await Category.exists({ parent: id });
    if (hasChildren) {
      return res.status(400).json({
        msg: "Không thể xóa danh mục có danh mục con"
      });
    }

    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      msg: "Xóa danh mục thành công"
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({
      msg: "Lỗi server"
    });
  }
};

// Get category tree
const getCategoryTree = async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({ order: 1, name: 1 });

    const buildTree = (items, parentId = null) => {
      const result = [];
      items
        .filter(item => item.parent?.toString() === parentId?.toString())
        .forEach(item => {
          const children = buildTree(items, item._id);
          if (children.length) {
            item.children = children;
          }
          result.push(item);
        });
      return result;
    };

    const tree = buildTree(categories);

    return res.status(200).json(tree);
  } catch (error) {
    console.error("Error getting category tree:", error);
    return res.status(500).json({
      msg: "Lỗi server"
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryTree
}; 