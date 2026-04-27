const adminAuth = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
};

const publisherAuth = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'publisher')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Publisher or Admin access required'
    });
  }
};

module.exports = { adminAuth, publisherAuth };