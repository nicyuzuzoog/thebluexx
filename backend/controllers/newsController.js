const News = require('../models/News');
const { getPagination, deleteFromCloudinary, getYouTubeThumbnail } = require('../utils/helpers');

exports.getNews = async (req, res) => {
  try {
    const { page, limit, category, search, sort, featured, breaking } = req.query;
    const { pageNum, limitNum, skip } = getPagination(page, limit);

    let query = { status: 'published' };
    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (breaking === 'true') query.isBreaking = true;
    if (search) query.$text = { $search: search };

    let sortOption = { createdAt: -1 };
    if (sort === 'views') sortOption = { views: -1 };
    if (sort === 'likes') sortOption = { likesCount: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };

    const total = await News.countDocuments(query);
    const news = await News.find(query)
      .populate('author', 'name avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true, data: news,
      pagination: {
        page: pageNum, limit: limitNum,
        total, pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getNewsBySlug = async (req, res) => {
  try {
    const news = await News.findOne({ slug: req.params.slug, status: 'published' })
      .populate('author', 'name avatar bio')
      .populate({
        path: 'comments',
        match: { isApproved: true, parentComment: null },
        options: { sort: { createdAt: -1 }, limit: 20 },
        populate: {
          path: 'replies',
          match: { isApproved: true },
          options: { sort: { createdAt: 1 } }
        }
      });

    if (!news) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }

    news.views += 1;
    await news.save();

    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createNews = async (req, res) => {
  try {
    const newsData = {
      ...req.body,
      author: req.user.id,
      status: req.user.role === 'admin' ? 'published' : 'pending'
    };

    if (req.body.tags && typeof req.body.tags === 'string') {
      newsData.tags = req.body.tags.split(',').map(t => t.trim());
    }

    // Cloudinary URL is in req.file.path
    if (req.file) {
      newsData.featuredImage = req.file.path;
    }

    if (req.body.titleEn) {
      newsData.title = {
        en: req.body.titleEn,
        fr: req.body.titleFr || '',
        rw: req.body.titleRw || ''
      };
    }
    if (req.body.contentEn) {
      newsData.content = {
        en: req.body.contentEn,
        fr: req.body.contentFr || '',
        rw: req.body.contentRw || ''
      };
    }
    if (req.body.summaryEn) {
      newsData.summary = {
        en: req.body.summaryEn,
        fr: req.body.summaryFr || '',
        rw: req.body.summaryRw || ''
      };
    }

    const news = await News.create(newsData);
    await news.populate('author', 'name avatar');

    res.status(201).json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateNews = async (req, res) => {
  try {
    let news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }

    if (news.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (req.file) {
      // Delete old image from Cloudinary
      if (news.featuredImage) {
        await deleteFromCloudinary(news.featuredImage);
      }
      req.body.featuredImage = req.file.path;
    }

    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map(t => t.trim());
    }

    if (req.body.titleEn) {
      req.body.title = {
        en: req.body.titleEn,
        fr: req.body.titleFr || news.title.fr,
        rw: req.body.titleRw || news.title.rw
      };
    }
    if (req.body.contentEn) {
      req.body.content = {
        en: req.body.contentEn,
        fr: req.body.contentFr || news.content.fr,
        rw: req.body.contentRw || news.content.rw
      };
    }
    if (req.body.summaryEn) {
      req.body.summary = {
        en: req.body.summaryEn,
        fr: req.body.summaryFr || news.summary.fr,
        rw: req.body.summaryRw || news.summary.rw
      };
    }

    news = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    }).populate('author', 'name avatar');

    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }

    if (news.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Delete image from Cloudinary
    if (news.featuredImage) {
      await deleteFromCloudinary(news.featuredImage);
    }

    await News.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'News deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.likeNews = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required to like' });
    }

    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }

    const existingLike = news.likes.find(l => l.email === email);
    if (existingLike) {
      news.likes = news.likes.filter(l => l.email !== email);
      news.likesCount = Math.max(0, news.likesCount - 1);
    } else {
      news.likes.push({ email, user: req.user ? req.user.id : undefined });
      news.likesCount += 1;
    }

    await news.save();
    res.json({
      success: true,
      liked: !existingLike,
      likesCount: news.likesCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.shareNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { shares: 1 } },
      { new: true }
    );
    if (!news) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }
    res.json({ success: true, shares: news.shares });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMostViewed = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const news = await News.find({ status: 'published' })
      .populate('author', 'name avatar')
      .sort({ views: -1 })
      .limit(limit);
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBreakingNews = async (req, res) => {
  try {
    const news = await News.find({ status: 'published', isBreaking: true })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(5);
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};