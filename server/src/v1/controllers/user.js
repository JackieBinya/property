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

const authUser = async (req, res) => {
  try {
    const rows = await User.findByEmail(req.body.email.trim());
  
    bcrypt.compare(req.body.password, rows[0].password, (err, isMatch) => {
      // res === true
      if (err) throw err;
      if (isMatch) {
        return res.status(200).json({
          status: 200,
          token: generateToken(rows[0].id),
          msg: 'Successfully logged in',
          data: {
            firstName: rows[0].first_name,
            lastName: rows[0].last_name,
            email: rows[0].email,
          },
        });
      }

      if (!isMatch) {
        return res.status(400).json({
          status: 400,
          error: 'Authentification failed incorrect password!',
        });
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: err,
    });
  }
};


export { createNewUser, authUser };

