const User = require('../model/User.model');

// Role-based access control middleware
const checkUserRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Get user from request (set by auth middleware)
      const user = req.user;

      if (!user) {
        return res.status(401).json({ msg: "Chưa xác thực người dùng" });
      }

      // Check if user's role is in the allowed roles array
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ 
          msg: `Bạn không có quyền truy cập. Yêu cầu quyền: ${allowedRoles.join(', ')}` 
        });
      }

      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      return res.status(500).json({ msg: "Lỗi server" });
    }
  };
};

// Specific role checkers
const isAdmin = checkUserRole(['admin']);
const isManager = checkUserRole(['admin', 'manager']);
const isStaff = checkUserRole(['admin', 'manager', 'staff']);
const isCustomer = checkUserRole(['admin', 'manager', 'staff', 'customer']);

// Product-specific role checks
const canManageProducts = checkUserRole(['admin', 'manager']);
const canManageInventory = checkUserRole(['admin', 'manager', 'staff']);
const canReviewProducts = checkUserRole(['admin', 'manager', 'staff', 'customer']);

module.exports = {
  checkUserRole,
  isAdmin,
  isManager,
  isStaff,
  isCustomer,
  canManageProducts,
  canManageInventory,
  canReviewProducts
}; 