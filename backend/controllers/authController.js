const User = require('../models/User');
const { deleteFromCloudinary } = require('../utils/helpers');

exports.register = async (req, res) => {
  try {
    const { name, email, password, preferredLanguage } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const user = await User.create({
      name, email, password,
      preferredLanguage: preferredLanguage || 'en'
    });
    const token = user.getSignedJwtToken();
    res.status(201).json({
      success: true, token,
      user: {
        id: user._id, name: user.name,
        email: user.email, role: user.role,
        avatar: user.avatar,
        preferredLanguage: user.preferredLanguage
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account has been deactivated' });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = user.getSignedJwtToken();
    res.json({
      success: true, token,
      user: {
        id: user._id, name: user.name,
        email: user.email, role: user.role,
        avatar: user.avatar,
        preferredLanguage: user.preferredLanguage
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, preferredLanguage } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (preferredLanguage) updateData.preferredLanguage = preferredLanguage;

    // Cloudinary: file comes as req.file.path (secure_url)
    if (req.file) {
      // Delete old avatar from Cloudinary
      const oldUser = await User.findById(req.user.id);
      if (oldUser.avatar) {
        await deleteFromCloudinary(oldUser.avatar);
      }
      // Cloudinary URL is in req.file.path
      updateData.avatar = req.file.path;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true, runValidators: true
    });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    const token = user.getSignedJwtToken();
    res.json({ success: true, token, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};