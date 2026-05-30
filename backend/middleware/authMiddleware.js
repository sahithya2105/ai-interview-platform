// Placeholder middleware — integrate Firebase Admin SDK here
function authMiddleware(req, res, next) {
  // const token = req.headers.authorization?.split('Bearer ')[1];
  // verify with firebase-admin and attach req.user
  next();
}

module.exports = authMiddleware;