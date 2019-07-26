import pool from './configDB';

const queryText = `
CREATE TABLE IF NOT EXISTS
users(
  id BIGSERIAL NOT NULL,
  first_name VARCHAR(128) NOT NULL,
  last_name VARCHAR(128) NOT NULL,
  email VARCHAR(128) NOT NULL UNIQUE,
  password VARCHAR(128) NOT NULL,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
  );
CREATE TABLE IF NOT EXISTS
properties(
  id SERIAL NOT NULL,
  owner BIGINT,
  status VARCHAR(20) DEFAULT 'available',
  price VARCHAR(15) NOT NULL,
  state VARCHAR(80) NOT NULL,
  city VARCHAR(80) NOT NULL,
  address VARCHAR(50) NOT NULL,
  type VARCHAR(50) NOT NULL,
  description VARCHAR(200) NOT NULl ,
  title VARCHAR(50) NOT NULL ,
  image_url VARCHAR(128) NOT NULL ,
  created_on  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE
  )
  `;


pool.query(queryText)
  .then((res) => {
    console.log(res);
    pool.end();
  })
  .catch((err) => {
    console.log(err);
    pool.end();
  });
