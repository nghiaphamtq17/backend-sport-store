const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User.model");

const loginUser = async (req, res) => {
  try {
    //Detructor code
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: "Tài khoản không tồn tại",
      });
    }

    const checkPassword = await bcryptjs.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        msg: "Mật khẩu không chính xác!",
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1y",
      }
    );

    const { password: PU, ...result } = user?._doc;

    return res.status(200).json({
      msg: "Đăng nhập thành công!",
      token,
      user: result,
    });
  } catch (error) {
    //bất kể lỗi gì bên trên sẽ bị thông báo lỗi do phía backend
    console.log("error", error);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const registerUser = async (req, res) => {
  try {
    //detructer thông tin từ trong body gửi lên
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    if (!firstName || !lastName || !email || !phoneNumber || !password) {
      return res.status(400).json({
        msg: "Chưa đúng định dạng!",
      });
    }

    // kiểm tra sự tồn tại của phoneNumber và email trong bảng User
    const checkExisUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    //Nếu phoneNumber hoặc email đã tồn tại sẽ không tạo tài khoản mà
    // trả về mã lỗi cho frontend
    if (checkExisUser) {
      return res.status(400).json({
        msg: "SDT hoặc email đã được đăng kí",
      });
    }

    //Mã hoá mật khẩu
    const hashedPassword = await bcryptjs.hash(password, 10);

    console.log("hashedPassword", hashedPassword);

    //Tạo dữ liệu cho User mới
    const newUser = new User({
      firstName, //firstName: firstName
      lastName,
      email: email,
      phoneNumber,
      password: hashedPassword,
    });

    // lưu user mới vào bảng
    await newUser.save();

    // trả về thông báo tạo user thành công
    return res.status(201).json({
      msg: " Đăng kí thành công!",
    });
  } catch (error) {
    //bất kể lỗi gì bên trên sẽ bị thông báo lỗi do phía backend
    console.log("error", error);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id || null;
    
    const { firstName, lastName } = req.body;

    if (req.user._id.toString() !== id) {
      return res.status(403).json({
        msg: "Không có quyền chỉnh sửa thông tin người này!",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        msg: "Ng dùng k tồn tại",
      });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    await user.save();

    return res.json({ msg: "Update thanh cong!" });
  } catch (error) {
    return res.status(500).json({
      msg: "Internel server error",
    });
  }
};

const deleteUser = async (req,res) => {
    try {
        const {id} = req.params;



        // kiểm tra xem id người này truyền lên có giống id của token không
        if (req.user._id.toString() !== id) {
            return res.status(403).json({
              msg: "Không có quyền chỉnh sửa thông tin người này!",
            });
          }

            //kiểm tra sự tồn tại của ng dùng
          const user = await User.findById(id);

          if (!user) {
            return res.status(400).json({
              msg: "Ng dùng k tồn tại",
            });
          }

          // Tìm kiểm người dùng và xoá 
          await User.findByIdAndDelete(id);

          return res.json({ msg: "Đã xoá thanh cong!" });

    } catch (error) {
        return res.status(500).json({
            msg: "Internel server error",
          });
    }
}

module.exports = { loginUser, registerUser, updateUser, deleteUser };
