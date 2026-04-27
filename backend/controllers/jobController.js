const JobVacancy = require('../models/JobVacancy');

exports.getJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = { status: 'active' };
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { 'title.en': { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter expired
    query.$or = query.$or || [];
    query.deadline = { $gte: new Date() };

    const total = await JobVacancy.countDocuments(query);
    const jobs = await JobVacancy.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: jobs,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    // If the complex query fails, try simpler
    try {
      const jobs = await JobVacancy.find({ status: 'active' }).sort({ createdAt: -1 });
      res.json({ success: true, data: jobs, pagination: { total: jobs.length } });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

exports.getJob = async (req, res) => {
  try {
    const job = await JobVacancy.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    job.views += 1;
    await job.save();

    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createJob = async (req, res) => {
  try {
    const jobData = { ...req.body, addedBy: req.user.id };

    if (req.body.titleEn) {
      jobData.title = { en: req.body.titleEn, fr: req.body.titleFr || '', rw: req.body.titleRw || '' };
    }
    if (req.body.descriptionEn) {
      jobData.description = { en: req.body.descriptionEn, fr: req.body.descriptionFr || '', rw: req.body.descriptionRw || '' };
    }
    if (req.body.requirements && typeof req.body.requirements === 'string') {
      jobData.requirements = req.body.requirements.split(',').map(r => r.trim());
    }

    const job = await JobVacancy.create(jobData);
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await JobVacancy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    await JobVacancy.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};