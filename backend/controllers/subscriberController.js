const Subscriber = require('../models/Subscriber');

exports.subscribe = async (req, res) => {
  try {
    const { email, name, subscribedTo, preferredLanguage } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    let subscriber = await Subscriber.findOne({ email });
    if (subscriber) {
      subscriber.isActive = true;
      if (subscribedTo) subscriber.subscribedTo = subscribedTo;
      if (preferredLanguage) subscriber.preferredLanguage = preferredLanguage;
      await subscriber.save();
      return res.json({ success: true, message: 'Subscription updated', data: subscriber });
    }

    subscriber = await Subscriber.create({
      email,
      name: name || '',
      subscribedTo: subscribedTo || 'all',
      preferredLanguage: preferredLanguage || 'en'
    });

    res.status(201).json({ success: true, message: 'Subscribed successfully', data: subscriber });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;
    const subscriber = await Subscriber.findOneAndUpdate(
      { email },
      { isActive: false },
      { new: true }
    );
    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'Subscriber not found' });
    }
    res.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json({ success: true, data: subscribers, total: subscribers.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};