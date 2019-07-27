/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs';
import pool from '../db/configDB';
import app from '../app';
import User from '../models/User';

chai.use(chaiHttp);
const { expect, request } = chai;

describe('POST /api/v1/auth/signup', () => {
  beforeEach(async () => {
    await pool.query('DELETE FROM users');
  });

  const user = {};

  const exec = () => request(app)
    .post('/api/v1/auth/signup')
    .send(user);


  it('should authenticate a user when provided with the required details', async () => {
    user.firstName = 'foo';
    user.lastName = 'bar';
    user.email = 'foo@bar.com';
    user.password = '123456';

    const res = await exec();

    expect(res).to.have.status(201);
    expect(res.body.status).to.be.equal(201);
    expect(res.body).to.have.property('token');
    expect(res.body.token).to.be.a('string');
    expect(res.body.data).to.be.a('object');
    expect(res.body.data.firstName).to.be.equal('foo');
    expect(res.body.data.lastName).to.be.equal('bar');
    expect(res.body.data.email).to.be.equal('foo@bar.com');
    expect(res.body.data.id).to.be.a('string');
  });

  it('should not sign up a user if firstname field is not filled', async () => {
    user.firstName = '';

    const res = await exec();

    expect(res).to.have.status(400);
    expect(res.body.status).to.be.equal(400);
    expect(res.body.error).to.be.equal('Please enter your first name.');
  });

  it('should not sign up a user if lastname field is not filled', async () => {
    user.firstName = 'foo';
    user.lastName = '';
    user.email = 'foo@bar.com';
    user.password = '123456';

    const res = await exec();

    expect(res).to.have.status(400);
    expect(res.body.status).to.be.equal(400);
    expect(res.body.error).to.equal('Please enter your last name.');
  });

  it('should not sign up a user if email field is not filled', async () => {
    user.firstName = 'foo';
    user.lastName = 'bar';
    user.email = '';
    user.password = '123456';

    const res = await exec();

    expect(res).to.have.status(400);
    expect(res.body.status).to.be.equal(400);
    expect(res.body.error).to.equal('Please enter your email.');
  });

  it('should not sign up a user if password field is not filled', async () => {
    user.firstName = 'foo';
    user.lastName = 'bar';
    user.email = 'foo@bar.com';
    user.password = '';

    const res = await exec();

    expect(res).to.have.status(400);
    expect(res.body.status).to.be.equal(400);
    expect(res.body.error).to.equal('Please enter your password.');
  });

  it('should not sign up a user if password is less than 6 characters long', async () => {
    user.firstName = 'foo';
    user.lastName = 'bar';
    user.email = 'foo@bar.com';
    user.password = '1234';

    const res = await exec();

    expect(res).to.have.status(400);
    expect(res.body.status).to.be.equal(400);
    expect(res.body.error).to.equal('Password should be no less than 6 characters long.');
  });

  it('should not register a user with an account already', async () => {
    await User.create({
      firstName: 'foo',
      lastName: 'bar',
      email: 'foo@bar.com',
      password: '123456',
    });

    user.firstName = 'foo';
    user.lastName = 'bar';
    user.email = 'foo@bar.com';
    user.password = '123456';

    const res = await exec();

    expect(res).to.have.status(400);
    expect(res.body.status).to.be.equal(400);
    expect(res.body.error).to.equal('Your email is already registered in the app, you are only allowed to have one account.');
  });

  it('should not register a user who provides an invalid email', async () => {
    user.firstName = 'foo';
    user.lastName = 'bar';
    user.email = 'foobar.com';
    user.password = '123456';

    const res = await exec();

    expect(res).to.have.status(400);
    expect(res.body.status).to.be.equal(400);
    expect(res.body.error).to.equal('Email invalid!');
  });
});

describe('POST /api/v1/auth/signin', () => {
  beforeEach(async () => {
    await pool.query('DELETE FROM users');
  });

  const user = {};

  const exec = () => request(app)
    .post('/api/v1/auth/signin')
    .send(user);

  it('should authenticate user if provided the required details', async () => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('123456', salt);
    await User.create({
      firstName: 'foo',
      lastName: 'bar',
      email: 'foo@bar.com',
      password: hash,
    });

    user.email = 'foo@bar.com';
    user.password = '123456';

    const res = await exec();
  
    expect(res).to.have.status(200);
  });

  it('should not authenticate if user does not provide email', async () => {
    user.email = '';
    user.password = '123456';

    const res = await exec();

    expect(res).to.have.status(400);
    expect(res.body.status).to.be.equal(400);
    expect(res.body.error).to.be.equal('Please enter your email, to continue.');
  });

  it('should not authenticate if user does not provide password', async () => {
    user.email = 'foo@bar';
    user.password = '';

    const res = await exec();

    expect(res).to.have.status(400);
    expect(res.body.status).to.be.equal(400);
    expect(res.body.error).to.be.equal('Please enter your password, to continue.');
  });

  it('should not authenticate user if passwords do not match', async () => {
    await User.create({
      firstName: 'foo',
      lastName: 'bar',
      email: 'fooz@bar.com',
      password: 'abcdef',
    });

    user.email = 'fooz@bar.com';
    user.password = 'abc4';

    const res = await exec();

    expect(res).to.have.status(400);
    expect(res.body.status).to.be.equal(400);
    expect(res.body.error).to.be.equal('Authentification failed incorrect password!');
  });
});
