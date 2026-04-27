const Advertisement = require('../models/Advertisement');

exports.getActiveAds = async (req, res) => {
  try {
    const { position } = req.query;
    let query = { isActive: true };
    if (position) query.position = position;

    // Check date validity
    const now = new Date();
    query.$or = [
      { endDate: { $exists: false } },
      { endDate: null },
      { endDate: { $gte: now } }
    ];

    const ads = await Advertisement.find(query).sort({ createdAt: -1 });

    // Increment impressions
    const adIds = ads.map(ad => ad._id);
    await Advertisement.updateMany({ _id: { $in: adIds } }, { $inc: { impressions: 1 } });

    res.json({ success: true, data: ads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAd = async (req, res) => {
  try {
    const adData = { ...req.body, addedBy: req.user.id };
    if (req.file) {
      adData.image = `/uploads/ads/${req.file.filename}`;
    }
    const ad = await Advertisement.create(adData);
    res.status(201).json({ success: true, data: ad });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAd = async (req, res) => {
  try {
    if (req.file) {
      req.body.image = `/uploads/ads/${req.file.filename}`;
    }
    const ad = await Advertisement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ad) return res.status(404).json({ success: false, message: 'Ad not found' });
    res.json({ success: true, data: ad });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAd = async (req, res) => {
  try {
    await Advertisement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Ad deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.clickAd = async (req, res) => {
  try {
    const ad = await Advertisement.findByIdAndUpdate(
      req.params.id,
      { $inc: { clicks: 1 } },
      { new: true }
    );
    res.json({ success: true, link: ad.link });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllAds = async (req, res) => {
  try {
    const ads = await Advertisement.find().sort({ createdAt: -1 });
    res.json({ success: true, data: ads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};