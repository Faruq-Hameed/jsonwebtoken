const jwt = require('jsonwebtoken')
const jwtSecret = process.env.SECRET_KEY

// Admin Authentication
exports.adminAuth = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
        console.log({decodedToken}, 'admin')
      if (err) {
        return res.status(401).json({ message: "Not authorized" })
      } else {
        if (decodedToken.role !== "admin") {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          next()
        }
      }
    })
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, token not available" })
  }
}

//  Authenticate other users(non admin):
exports.userAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
      jwt.verify(token, jwtSecret, (err, decodedToken) => {
        console.log({decodedToken}, decodedToken.role, 'user')

        if (err) {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          if (decodedToken.role !== "beginner" || 'intermediate' || 'final') {
            return res.status(401).json({ message: "Not authorized" })
          } else {
            next() 
          }
        }
      })
    } else {
      return res
        .status(401)
        .json({ message: "Not authorized, token not available" })
    }
  }

  // Middleware for verifying token and refreshing it if necessary
  const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).send('Unauthorized: No token provided');
    }
    try {
      // Verify the token and extract the payload
      const payload = jwt.verify(token, secretKey);
      // Check if the token is about to expire (within the next 5 minutes)
      const now = Date.now().valueOf() / 1000;
      if (payload.exp - now < 300) { // if the token expires in less than 5 minutes
        // Refresh the token and send it to the client
        const newToken = jwt.sign({ username: 'my_username' }, secretKey, { expiresIn: '15m' });
        res.cookie('token', newToken, { httpOnly: true, maxAge: 900000 }); // maxAge is set to 15 minutes in milliseconds
      }
      // Pass the payload to the next middleware or route handler
      req.payload = payload;
      next();
    } catch (err) {
      return res.status(401).send('Unauthorized: Invalid token');
    }
  };
  
/**  usage example */
  // Protected route that requires authentication
//   app.get('/protected', verifyToken, (req, res) => {
//     // Use the payload to retrieve user data and send a response
//     const username = req.payload.username;
//     res.send(`Welcome, ${username}!`);
//   });


