const User = require('../models/User');
const News = require('../models/News');
const Movie = require('../models/Movie');
const Comment = require('../models/Comment');
const Subscriber = require('../models/Subscriber');
const JobVacancy = require('../models/JobVacancy');
const Story = require('../models/Story');
const Advertisement = require('../models/Advertisement');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalPublishers,
      totalNews,
      pendingNews,
      totalMovies,
      pendingMovies,
      totalComments,
      totalSubscribers,
      totalJobs,
      totalStories,
      recentNews,
      recentMovies,
      topNews,
      topMovies
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'publisher' }),
      News.countDocuments({ status: 'published' }),
      News.countDocuments({ status: 'pending' }),
      Movie.countDocuments({ status: 'published' }),
      Movie.countDocuments({ status: 'pending' }),
      Comment.countDocuments(),
      Subscriber.countDocuments({ isActive: true }),
      JobVacancy.countDocuments({ status: 'active' }),
      Story.countDocuments({ status: 'published' }),
      News.find({ status: 'published' }).populate('author', 'name').sort({ createdAt: -1 }).limit(5),
      Movie.find({ status: 'published' }).populate('addedBy', 'name').sort({ createdAt: -1 }).limit(5),
      News.find({ status: 'published' }).sort({ views: -1 }).limit(5).select('title views likesCount'),
      Movie.find({ status: 'published' }).sort({ views: -1 }).limit(5).select('title views likesCount')
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalPublishers,
          totalNews,
          pendingNews,
          totalMovies,
          pendingMovies,
          totalComments,
          totalSubscribers,
          totalJobs,
          totalStories
        },
        recentNews,
        recentMovies,
        topNews,
        topMovies
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: users,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create publisher
// @route   POST /api/admin/publishers
exports.createPublisher = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const publisher = await User.create({
      name,
      email,
      password,
      role: 'publisher'
    });

    res.status(201).json({
      success: true,
      data: {
        id: publisher._id,
        name: publisher.name,
        email: publisher.email,
        role: publisher.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get pending content
// @route   GET /api/admin/pending
exports.getPendingContent = async (req, res) => {
  try {
    const [pendingNews, pendingMovies, pendingStories] = await Promise.all([
      News.find({ status: 'pending' }).populate('author', 'name email').sort({ createdAt: -1 }),
      Movie.find({ status: 'pending' }).populate('addedBy', 'name email').sort({ createdAt: -1 }),
      Story.find({ status: 'pending' }).populate('author', 'name email').sort({ createdAt: -1 })
    ]);

    res.json({
      success: true,
      data: { pendingNews, pendingMovies, pendingStories }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve/Reject content
// @route   PUT /api/admin/content/:type/:id/status
exports.updateContentStatus = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { status, rejectionReason } = req.body;

    let Model;
    if (type === 'news') Model = News;
    else if (type === 'movie') Model = Movie;
    else if (type === 'story') Model = Story;
    else return res.status(400).json({ success: false, message: 'Invalid type' });

    const updateData = { status };
    if (status === 'published') updateData.publishedAt = new Date();
    if (status === 'rejected' && rejectionReason) updateData.rejectionReason = rejectionReason;

    const content = await Model.findByIdAndUpdate(id, updateData, { new: true });
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all news (admin - including drafts/pending)
// @route   GET /api/admin/news
exports.getAllNews = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, category } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};
    if (status) query.status = status;
    if (category) query.category = category;

    const total = await News.countDocuments(query);
    const news = await News.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: news,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all movies (admin)
// @route   GET /api/admin/movies
exports.getAllMovies = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, genre } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};
    if (status) query.status = status;
    if (genre) query.genre = genre;

    const total = await Movie.countDocuments(query);
    const movies = await Movie.find(query)
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: movies,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};