const { isSet } = require("util/types");
const User = require("../models/userModels");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if username exists
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res.status(400).json({ msg: "Username already exists", status: false });
    }

    // Check if email exists
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.status(400).json({ msg: "Email already exists", status: false });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    // Convert to object and remove password
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(201).json({
      status: true,
      user: userObj,
    });

  } catch (ex) {
    console.error(ex);
    next(ex);
  }
};


module.exports.login = async (req, res, next) => {
    try {
      const { username, password } = req.body;
  
      // Check if the user exists
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ msg: "Invalid username", status: false });
      }
  
      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ msg: "Incorrect password", status: false });
      }
  
      // Convert user to object and remove password
      const userObj = user.toObject();
      delete userObj.password;
  
      return res.status(200).json({
        status: true,
        user: userObj,
      });
  
    } catch (ex) {
      console.error(ex);
      next(ex);
    }
  };
  
  module.exports.setAvatar = async(req,res,next) =>{
    try{
       const userId = req.params.id;
       const avatarImage = req.body.image;
       const userData = await User.findByIdAndUpdate(userId,{
        isAvatarImageSet:true,
        avatarImage,
       });
       return res.json({
        isSet:userData.isAvatarImageSet,
        image:userData.avatarImage,
       });
    }
    catch(ex){
       next(ex);
    }
  };


  module.exports.getAllUsers = async (req, res, next) => {
    try {
      const users = await User.find({ _id: { $ne: req.params.id } }).select([
        "email",
        "username",
        "avatarImage",
        "_id",
      ]);
  
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ message: "Internal Server Error" });
      // Or if using Express error middleware:
      // next(error);
    }
  };
  