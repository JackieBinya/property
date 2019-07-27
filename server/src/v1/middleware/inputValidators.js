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
      error: 'Please enter your first name.',
    });
  }

  if (!lastName || lastName.trim() === '') {
    return res.status(400).json({
      status: 400,
      error: 'Please enter your last name.',
    });
  }

  if (!email || email.trim() === '') {
    return res.status(400).json({
      status: 400,
      error: 'Please enter your email.',
    });
  }

  if (!password || password.trim() === '') {
    return res.status(400).json({
      status: 400,
      error: 'Please enter your password.',
    });
  }

  // Validate input
  if (!emailRE.test(email)) {
    return res.status(400).json({
      status: 400,
      error: 'Email invalid!',
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      status: 400,
      error: 'Password should be no less than 6 characters long.',
    });
  }
  next();
};

const loginValidator = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || email.trim() === '') {
    return res.status(400).json({
      status: 400,
      error: 'Please enter your email, to continue.',
    });
  }

  if (!password || password.trim() === '') {
    return res.status(400).json({
      status: 400,
      error: 'Please enter your password, to continue.',
    });
  }
  next();
};

const postPropertyAdValiadator = (req, res, next) => {
  const {
    title, address, state, city, type, price, description,
  } = req.body;


  if (!title || title.trim() === '') {
    return res.status(400).json({
      status: 400,
      error: 'Please provide a title for your property ad.',
    });
  }

  if (!address || address.trim() === '') {
    return res.status(400).json({
      status: 400,
      error: 'Please provide the address of your property.',
    });
  }

  if (!state || state.trim() === '') {
    return res.status(400).json({
      status: 400,
      error: 'Please provide the state in which your property is located.',
    });
  }

  if (!city || city.trim() === '') {
    return res.status(400).json({
      status: 400,
      error: 'Please provide the city where your property is located.',
    });
  }

  if (!description || description.trim() === '') {
    return res.status(400).json({
      status: 400,
      error: 'Please provide a description of your property.',
    });
  }


  if (!priceRE.test(price)) {
    return res.status(400).json({
      status: 400,
      error: 'Please provide a valid price of your property.',
    });
  }

  if (!type || type.trim() === '') {
    return res.status(400).json({
      status: 400,
      error: 'Please select a type that matches your property.',
    });
  }

  if (title.length > 40) {
    return res.status(400).json({
      status: 400,
      error: 'The title is too long, make sure its no more than 45 characters long!',
    });
  }

  if (description.length > 200) {
    return res.status(400).json({
      status: 400,
      error: 'The description is too long, make sure its no more than 150 characters long!',
    });
  }
  next();
};

const editAdValidator = (req, res, next) => {
  const { price } = req.body;
  if (!priceRE.test(price)) {
    return res.status(400).json({
      status: 400,
      error: 'Please provide a valid price of your property.',
    });
  }
  next();
};

export {
  signUpValidator,
  loginValidator,
  postPropertyAdValiadator,
  editAdValidator,
};

