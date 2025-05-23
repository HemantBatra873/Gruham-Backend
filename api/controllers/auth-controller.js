import User from "../models/user-model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(
      errorHandler(400, "Username, email, and password are required")
    );
  }

  try {
    const hashedPassword = await bcryptjs.hash(password, 12);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if ( !email || !password) {
    return next(
      errorHandler(400, "email, and password are required")
    );
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return next(errorHandler(401, "Invalid credentials"));
    }
    const token = jwt.sign({id:user._id} , process.env.JWT_SECRET);
    const {password : pass , ...rest} = user._doc;
    res.cookie('access_token' , token , {httpOnly: true,  secure: true, sameSite: 'None'}).status(200).json(rest);
  } catch (err) {
    next(err);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;

      res
        .cookie('access_token', token, {httpOnly: true,  secure: true, sameSite: 'None'})
        .status(200)
        .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = await bcryptjs.hash(generatedPassword, 12);

      const newUser = new User({
        username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;

      res
        .cookie('access_token', token, {httpOnly: true,  secure: true, sameSite: 'None'})
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res,next) => {
  try {
    res.clearCookie('access_token', { path: '/' }).status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
}