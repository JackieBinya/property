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

export { verifyNewUser };

