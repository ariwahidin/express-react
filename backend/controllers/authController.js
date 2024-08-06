const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { poolPromise } = require('../config/dbConfig');
require('dotenv').config();

// Register User
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const pool = await poolPromise;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO Users (email, password) VALUES ('${email}', '${hashedPassword}')`;
    pool.query(query, (err, result) => {
      if (err) {
        console.error('Error registering user: ', err);
        res.status(500).send('Error registering user');
      } else {
        res.status(201).send('User registered successfully');
      }
    });
  } catch (err) {
    console.error('Error registering user: ', err);
    res.status(500).send('Error registering user');
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const pool = await poolPromise;

    const query = `SELECT * FROM Users WHERE email = ?`;
    pool.query(query, [email], async (err, result) => {

      // console.log(result)
      if (err) {
        console.error('Error logging in user: ', err);
        res.status(500).send('Error logging in user');
      } else {
        const user = result[0];
        if (user && await bcrypt.compare(password, user.password)) {
          const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
          const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '7d' });


          const sqlInsertToken = `INSERT INTO RefreshToken (user_id, token, expired_date) VALUES (?,?,?)`;
          const expired_date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

          pool.query(sqlInsertToken, [user.id, refreshToken, expired_date], async (er, resl) => {
            if (er) {
              console.error('Error logging in user: ', er);
              res.status(500).send('Error logging in user refresh Token');
            } else {
              res.json({ user: { id: user.id, email: user.email, name: user.name }, token, refreshToken });
            }
          });

        } else {
          res.status(400).send('Invalid email or password');
        }
      }
    });
  } catch (err) {
    console.error('Error logging in user: ', err);
    res.status(500).send('Error logging in user');
  }
};

// Refresh Token
const token = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.sendStatus(401);
  }

  const pool = await poolPromise;
  try {
    const sqlToken = `SELECT * FROM RefreshToken WHERE token = ?`;
    pool.query(sqlToken, [token], async (err, result) => {
      if (err) {
        console.error('Error validate token in user: ', err);
        res.status(500).send('Error validate token');
      }

      if (result.length > 0) {

        const users = result[0];

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY, (err, user) => {
          if (err) {
            return res.sendStatus(403);
          }

          try {

            pool.query(`SELECT id, email FROM Users WHERE id = ?`, [users.user_id], async (err, ress) => {

              if (ress.length > 0) {
                const userLoggged = ress[0];
                const accessToken = jwt.sign({ userId: userLoggged.id }, process.env.SECRET_KEY, { expiresIn: '1h' })
                res.json({ user: { id: userLoggged.id, email: userLoggged.email, name: userLoggged.name }, token: accessToken });

              } else {
                console.log('User not found');
              }
            })

          } catch (error) {
            console.log(error);
          }
        });

      } else {
        console.error('Token not found: ', err);
        res.status(500).send('Token not found');
      }

    });
  } catch (error) {
    console.log(error);
  }



  // if (!refreshTokens.includes(token)) {
  //   return res.sendStatus(403);
  // }

  // jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY, (err, user) => {
  //   if (err) {
  //     return res.sendStatus(403);
  //   }

  //   const accessToken = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });

  //   res.json({
  //     accessToken
  //   });
  // });

}

module.exports = {
  registerUser,
  loginUser,
  token
};
