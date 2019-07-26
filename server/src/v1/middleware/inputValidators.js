const emailRE = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/;
const priceRE = /^(([$])?((([0-9]{1,3},)+[0-9]{3})|[0-9]+)(\.[0-9]{2})?)$/;

const signUpValidator = (req, res, next) => {
  const {
    firstName, lastName, email, password,
  } = req.body;

  // Check that all input fields have been filled in
  if (!firstName || firstName.trim() === '') {
    return res.status(400).json({
      status: 400,
      msg: 'Please enter your first name.',
    });
  }

  if (!lastName || lastName.trim() === '') {
    return res.status(400).json({
      status: 400,
      msg: 'Please enter your last name.',
    });
  }

  if (!email || email.trim() === '') {
    return res.status(400).json({
      status: 400,
      msg: 'Please enter your email.',
    });
  }

  if (!password || password.trim() === '') {
    return res.status(400).json({
      status: 400,
      msg: 'Please enter your password.',
    });
  }

  // Validate input
  if (!emailRE.test(email)) {
    return res.status(400).json({
      status: 400,
      msg: 'Email invalid!',
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      status: 'error',
      msg: 'Password should be no less than 6 characters long.',
    });
  }
  next();
};

export { signUpValidator };
