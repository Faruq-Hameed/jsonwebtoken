const User = require("../model/User")
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.SECRET_KEY

exports.register = async (req, res, next) => {
    const { username, password } = req.body
    if (password.length < 6) {
        return res.status(400).json({ message: "Password less than 6 characters" })
    }
    try {
        await User.create({
            username,
            password,
        }).then(user => {
            //the maxAge of the token
            const maxAge = 3 * 60 * 60;
            const token = jwt.sign({ id: user._id, username, role: user.role },jwtSecret,{ expiresIn: maxAge})
            res.cookie('jwt', token,{
                httpOnly: true,
                maxAge: maxAge * 1000, // 3hrs in ms
            })
            res.status(200).json({message: "User successfully created",user})
        })
    }
     catch (err) {
        res.status(401).json({
            message: "User not successful created",
            error: err.message,
        })
    }
}


//login

  exports.login = async (req, res, next) => {
    const { username, password } = req.body
    // Check if username and password is provided
    if (!username || !password) {
      return res.status(400).json({
        message: "Username or Password not present",
      })
    }
      try {
          const user = await User.findOne({ username, password })
          if (!user) {
              res.status(401).json({
                  message: "Login not successful",
                  error: "User not found",
              })
              return;
          } 
            const maxAge = 20
            const token = jwt.sign(
                { id: user._id, username, role: user.role },
                jwtSecret,
                {
                    expiresIn: maxAge, // 3hrs in sec
                }
            );
            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: maxAge * 1000, // 3hrs in ms
            })
            
        res.status(200).json({
          message: "Login successful",
          user,
        })
    } catch (error) {
      res.status(400).json({
        message: "An error occurred",
        error: error.message,
      })
    }
  }

// update user role
  exports.update = async (req, res, next) => {
    try{
           const { role, id } = req.body
    // Verifying if role and id is present
      if (role && id) {
        if (role === 'admin') 
          // Verifying if the value of role is admin
          await User.findById(id)
              .then((user) => {
                  if (!user) return res.status(404).json({ message: 'user not found' });
                  if (user.role !== "admin") {
                      user.role = role;
                      user.save()
                      res.status("201").json({ message: "Update successful", user });
                    return
                  }

                  else {
                      res.status(400).json({ message: "User is already an Admin" })
                  }
              })
                  .catch((error) => {
                      res
                          .status(400)
                          .json({ message: "An error occurred", error: error.message });
                  });

          }
          else {
              res.status(400).json({ message: "Role or Id not present" })
          }
      }
      catch (error) {
          res
              .status(400)
              .json({ message: "An error occurred", error: error.message });
      }

  }

  exports.deleteUser = async (req, res, next) => {
    const { id } = req.body
    await User.findByIdAndDelete(id)
      .then(user =>
        res.status(201).json({ message: "User successfully deleted", user })
      )
      .catch(error =>
        res
          .status(400)
          .json({ message: "An error occurred", error: error.message })
      )
  }

 