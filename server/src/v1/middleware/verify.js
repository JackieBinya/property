import jwt from 'jsonwebtoken';
import User from '../models/User';

const verifyNewUser = async (req, res, next) => {
  const { email } = req.body;

  const rows = await User.findByEmail(email);
  if (rows.length) {
    return res.status(400).json({
      status: 400,
      msg: 'Your email is already registered in the app, you are only allowed to have one account.',
    });
  }

  next();
};

const verifyExistingUser = async (req, res, next) => {
  const rows = await User.findByEmail(req.body.email.trim());
  if (rows.length === 0) {
    return res.status(400).json({
      status: 400,
      error: 'Please sign up to continue, if already signed up email you provided is incorrect. Please try again.',
    });
  }
  next();
};

const verifyAuthUser = (req, res, next) => {
  // Note how you grab token from req.header();
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({
      status: 401,
      error: 'No token access denied',
    });
  }

  jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, decoded) => {
    if (err) {
      return res.status(400).json({
        status: 400,
        error: 'No authorisation, token invalid!',
      });
    }
    req.decoded = decoded;
    next();
  });
};

const verifyExistingProperty = async (req, res, next) => {
  try {
    const { rows } = await Property.findOne(req.params.propertyId);
    if (rows.length === 0) {
      return res.status(400).json({
        status: 400,
        error: 'Property does not exist!',
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: 500,
      error: err.message,
    });
  }
  next();
};

const verifyPropertyBelongsToUser = async (req, res, next) => {
  const id = req.decoded.payload;
  const { propertyId } = req.params;
  try {
    const { rows } = await Property.findOne(propertyId);
    if (rows[0].owner !== id) {
      return res.status(400).json({
        status: 400,
        error: 'Access denied! ',
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: 500,
      error: err,
    });
  }
  next();
};

export {
  verifyNewUser,
  verifyExistingUser,
  verifyAuthUser,
  verifyExistingProperty,
  verifyPropertyBelongsToUser,
};


