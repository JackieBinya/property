import pool from '../db/configDB';

class Property {
  static async create({
    imageUrl,
    title,
    address,
    state,
    city,
    type,
    price,
    description,
    owner,
  }) {
    const text = 'INSERT INTO properties(title, address, state, city, type, price, description, owner, image_url) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';
    const values = [title, address, state, city, type, price, description, owner, imageUrl];
    const { rows } = await pool.query(text, values);
    return rows;
  }

  //  Fetch all properties
  static async findAll() {
    const text = `SELECT props.id, status, type, state, city, props.address, price, created_on,
      image_url,u.email as email
      FROM properties props
      LEFT JOIN users u
      ON props.owner = u.id`;

    const { rows } = await pool.query(text);

    return rows;
  }

  static async findAdsOfSpecificType(type) {
    const { rows } = await pool.query('SELECT * FROM properties WHERE type=$1', [type]);
    return rows;
  }

  // Create and save a property


  // Get a property by id
  static async findOne(id) {
    const rows = await pool.query('SELECT * FROM properties WHERE id=$1', [id]);
    return rows;
  }

  // Delete a property
  static async delete(id) {
    const text = 'DELETE FROM properties WHERE id =$1';
    const values = [id];
    const { rows } = await pool.query(text, values);
    return rows;
  }

  // Update a propertyn
  static async update(id, price) {
    const text = 'UPDATE properties SET price = $1 WHERE id = $2 RETURNING *';
    const values = [price, id];
    const { rows } = await pool.query(text, values);

    return rows;
  }

  static async markPropertySold(id) {
    const text = 'UPDATE properties SET status = $1 WHERE id = $2 RETURNING *';
    const values = ['sold', id];
    const { rows } = await pool.query(text, values);
    return rows;
  }
}

export default Property;
