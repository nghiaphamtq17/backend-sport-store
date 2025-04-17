const jwt = require("jsonwebtoken");
const User = require("../model/User.model");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ msg: "Không có quyền truy cập!" });
    }

    // Xác thực token
    const decode = jwt.verify(token, process.env.SECRET_KEY);

    //Tìm user , nếu có thì gắn thêm vào request
    const user = await User.findById(decode.userId);

    if (!user) {
      res.status(401).json({ msg: "Token không hợp lệ!" });
    }

    req.user = user;
    req.token = token;
    req.role = user.role;
    console.log("kiem tra thanh cong!", user);

    next();
  } catch (error) {
    return res.status(403).json({
      msg: "Không có quyền truy cập",
    });
  }
};

const managerWebsiteMiddleware = (req, res, next) => {
  const userRoles = req.user.role; // Assuming user roles are stored in req.user.roles

  if (req.user.role === "user") {
    return res.status(403).json({ msg: "User không có quyền truy cập!" });
  }

  next();
};

const adminRoleMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Chỉ admin có quyền truy cập!" });
  }

  next();
};


module.exports = { authMiddleware, managerWebsiteMiddleware, adminRoleMiddleware };
