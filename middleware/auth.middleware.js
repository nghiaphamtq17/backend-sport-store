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

    console.log("kiem tra thanh cong!", user);

    next();
  } catch (error) {
    return res.status(401).json({
      msg: "Không có quyền truy cập",
    });
  }
};

module.exports = { authMiddleware };
