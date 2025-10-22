import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Register a new user
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({success: false, message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    // Create token
    const token = user.generateAccessToken();

    if(!token){
        return res.status(500).json({sucess:false , message: 'Token generation failed' });
    }

     const options={
        httpOnly:true,
        secure:true,
        sameSite: 'None'
    }

    return res.status(201)
      .cookie("accessToken", token, options)
      .json({
        success: true,
        message: 'User created successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          settings: user.settings
        }
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create token
    const token = user.generateAccessToken();

    if (!token) {
      return res.status(500).json({
        success: false,
        message: 'Token generation failed'
      });
    }

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    }

    return res.status(200)
      .cookie("accessToken", token, options)
      .json({
        success: true,
        message: 'Login successful',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          settings: user.settings
        }
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
};

// Update user settings
export const updateSettings = async (req, res) => {
  try {
    const { theme, autoSave } = req.body;
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        'settings.theme': theme,
        'settings.autoSave': autoSave 
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      settings: user.settings
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password');
    console.log(user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile fetched successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        settings: user.settings
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
};

export const logout = async (req, res) => {
  try {
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    };

    return res.status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        success: true,
        message: "Logged out successfully"
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
};