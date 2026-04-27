const Story = require('../models/Story');

exports.getStories = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = { status: 'published' };
    if (category) query.category = category;

    const total = await Story.countDocuments(query);
    const stories = await Story.find(query)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: stories,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).populate('author', 'name avatar bio');
    if (!story) return res.status(404).json({ success: false, message: 'Story not found' });
    story.views += 1;
    await story.save();
    res.json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createStory = async (req, res) => {
  try {
    const storyData = {
      ...req.body,
      author: req.user.id,
      authorName: req.user.name,
      status: req.user.role === 'admin' ? 'published' : 'pending'
    };

    if (req.body.titleEn) {
      storyData.title = { en: req.body.titleEn, fr: req.body.titleFr || '', rw: req.body.titleRw || '' };
    }
    if (req.body.contentEn) {
      storyData.content = { en: req.body.contentEn, fr: req.body.contentFr || '', rw: req.body.contentRw || '' };
    }
    if (req.file) {
      storyData.image = `/uploads/stories/${req.file.filename}`;
    }

    const story = await Story.create(storyData);
    res.status(201).json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteStory = async (req, res) => {
  try {
    await Story.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Story deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};