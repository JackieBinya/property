import pool from '../db/configDB';

class User {
  static async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows;
  }

  static async create({
    firstName, lastName, email, password,
  }) {
    const text = 'INSERT INTO users(first_name, last_name, email, password) VALUES($1, $2, $3, $4) RETURNING *';
    const values = [firstName, lastName, email, password];
    const { rows } = await pool.query(text, values);
    return rows;
  }

}

export default User;
