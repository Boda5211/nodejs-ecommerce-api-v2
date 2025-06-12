const { sql, config } = require('../config/database');

exports.insertCategory = async (name) => {
    const pool = await sql.connect(config);
    return await pool.request()
        .input('name', sql.NVarChar, name)
        .query('INSERT INTO Product (name) VALUES (@name)');
};
