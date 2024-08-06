const sql = require('mssql');
const userSchema = new sql.Table('Users')
    .column('id', sql.Int, { nullable: false, primary: true, identity: true })
    .column('email', sql.NVarChar(255), { nullable: false })
    .column('password', sql.NVarChar(255), { nullable: false });

module.exports = userSchema;
