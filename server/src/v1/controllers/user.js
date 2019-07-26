import bcrypt from 'bcryptjs';
import generateToken from '../utils/authService';
import User from '../models/User';

const createNewUser = async (req, res) => {
  const {
    firstName, lastName, email, password,
  } = req.body;
  // salt and hash
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password.trim(), salt);

  try {
    const rows = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password: hash,
    });
    return res.status(201).json({
      status: 201,
      token: generateToken(rows[0].id),
      msg: 'Sucessfully created an account',
      data: {
        firstName: rows[0].first_name,
        lastName: rows[0].last_name,
        email: rows[0].email,
        id: rows[0].id,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      error: err,
    });
  }
};

export { createNewUser };
