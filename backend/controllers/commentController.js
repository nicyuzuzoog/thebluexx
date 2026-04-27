const Comment = require('../models/Comment');

// @desc    Create comment
// @route   POST /api/comments
exports.createComment = async (req, res) => {
  try {
    const { content, email, name, newsId, movieId, parentComment } = req.body;

    if (!email || !name || !content) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and content are required'
      });
    }

    if (!newsId && !movieId) {
      return res.status(400).json({
        success: false,
        message: 'Must specify either newsId or movieId'
      });
    }

    const commentData = {
      content,
      email,
      name,
      newsId: newsId || undefined,
      movieId: movieId || undefined,
      parentComment: parentComment || undefined,
      user: req.user ? req.user.id : undefined
    };

    const comment = await Comment.create(commentData);

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get comments for news/movie
// @route   GET /api/comments
exports.getComments = async (req, res) => {
  try {
    const { newsId, movieId, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = { isApproved: true, parentComment: null };
    if (newsId) query.newsId = newsId;
    if (movieId) query.movieId = movieId;

    const total = await Comment.countDocuments(query);
    const comments = await Comment.find(query)
      .populate({
        path: 'replies',
        match: { isApproved: true },
        options: { sort: { createdAt: 1 } }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: comments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Like comment
// @route   POST /api/comments/:id/like
exports.likeComment = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email required' });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const existing = comment.likes.find(l => l.email === email);
    if (existing) {
      comment.likes = comment.likes.filter(l => l.email !== email);
      comment.likesCount = Math.max(0, comment.likesCount - 1);
    } else {
      comment.likes.push({ email });
      comment.likesCount += 1;
    }

    await comment.save();
    res.json({ success: true, liked: !existing, likesCount: comment.likesCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete comment (admin)
// @route   DELETE /api/comments/:id
exports.deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    // Delete replies too
    await Comment.deleteMany({ parentComment: req.params.id });
    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};