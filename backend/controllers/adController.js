const Advertisement = require('../models/Advertisement');
const { deleteFromCloudinary } = require('../utils/helpers');

exports.getActiveAds = async (req, res) => {
  try {
    const { position } = req.query;
    let query = { isActive: true };
    if (position) query.position = position;

    const now = new Date();
    query.$or = [
      { endDate: { $exists: false } },
      { endDate: null },
      { endDate: { $gte: now } }
    ];

    const ads = await Advertisement.find(query).sort({ createdAt: -1 });
    const adIds = ads.map(ad => ad._id);
    await Advertisement.updateMany(
      { _id: { $in: adIds } },
      { $inc: { impressions: 1 } }
    );

    res.json({ success: true, data: ads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAd = async (req, res) => {
  try {
    const adData = { ...req.body, addedBy: req.user.id };

    // Cloudinary URL
    if (req.file) {
      adData.image = req.file.path;
    }

    const ad = await Advertisement.create(adData);
    res.status(201).json({ success: true, data: ad });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAd = async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ success: false, message: 'Ad not found' });
    }

    if (req.file) {
      // Delete old ad image from Cloudinary
      if (ad.image) {
        await deleteFromCloudinary(ad.image);
      }
      req.body.image = req.file.path;
    }

    const updatedAd = await Advertisement.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    res.json({ success: true, data: updatedAd });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAd = async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ success: false, message: 'Ad not found' });
    }

    // Delete from Cloudinary
    if (ad.image) {
      await deleteFromCloudinary(ad.image);
    }

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