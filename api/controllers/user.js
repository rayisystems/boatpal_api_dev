const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const randomString = require("randomstring");
const nodemailer = require('nodemailer');

const User = require("../models/user");

exports.user_signup = (req, res, next) => {
  User.find({
      'local.email': req.body.email
    })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists",
          status: "false"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              'local.email': req.body.email,
              'local.password': hash,
              created_at: new Date()
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
};

exports.user_login = (req, res, next) => {
  User.find({
      'local.email': req.body.email
    })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].local.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign({
              email: user[0].local.email,
              userId: user[0]._id
            },
            process.env.JWT_KEY, {
              expiresIn: "1h"
            }
          );
          return res.status(200).json({
            user,
            message: "Auth successful",
            token
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.user_gpLogin = (req, res, next) => {
  User.find({
      'google.email': req.body.email
    })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        const token = jwt.sign({
          email: user[0].google.email,
          id: user[0]._id
        }, process.env.JWT_KEY, {
          expiresIn: "1hr"
        })
        return res.json({
          message: 'auth success, mail exists',
          token,
        })
      } else {
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          'google.email': req.body.email,
          'google.userId': req.body.userId,
          'google.displayName': req.body.displayName,
          created_at: new Date(),
        })

        user.save()
          .then(result => {
            if (result) {
              const token = jwt.sign({
                email: result.google.email,
                id: result._id
              }, process.env.JWT_KEY, {
                expiresIn: "1hr"
              });
              console.log(result);
              return res.json({
                message: "Google signin success, user created",
                token
              });
            }
          })
          .catch(err => {
            console.log(err)
            res.json({
              err
            })
          })
      }
    })
    .catch(err => {
      res.json({
        err
      })
    })
}

exports.user_fbLogin = (req, res, next) => {
  User.find({
      'facebook.userId': req.body.userId
    })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        const token = jwt.sign({
          userId: user[0].facebook.userId,
          id: user[0].facebook._id
        }, process.env.JWT_KEY, {
          expiresIn: "1hr"
        })
        return res.json({
          message: 'auth success, userid exists',
          token
        })
      } else {
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          'facebook.accessToken': req.body.accessToken,
          'facebook.userId': req.body.userId,
          'facebook.expiresIn': req.body.expiresIn,
          created_at: new Date()
        })
        user.save()
          .then(result => {
            if (result) {
              const token = jwt.sign({
                userId: result.facebook.userId,
                id: result.facebook._id
              }, process.env.JWT_KEY, {
                expiresIn: "1hr"
              });
              console.log(result);
              return res.status(201).json({
                message: "Facebook signin success, user created",
                token
              });
            }
          })
          .catch(err => {
            console.log(err)
            res.json({
              err
            })
          })
      }
    })
}

exports.user_reset_password_init = (req, res, next) => {
  const random = randomString.generate(8);
  console.log(random); // testing
  User.find({
      'local.email': req.body.email
    })
    .exec()
    .then(users => {

      if (users.length == 0) {
        console.log(users.length < 1);
        return res.json({
          status: 404,
          message: 'User Not Found !'
        });
      } else {
        console.log('else working'); // testing 
        let user = users[0];

        user.resetToken = random;
        console.log(user.resetToken); // testing
        user.resetToken_created_at = new Date();

        return user.save();
      }
    })
    .then(user => {
      // Generate SMTP service account from ethereal.email
      nodemailer.createTestAccount((err, account) => {
        if (err) {
          console.error('Failed to create a testing account');
          console.error(err);
          return process.exit(1);
        }

        console.log('Credentials obtained, sending message...');

        // Create a SMTP transporter object
        let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: "rayi.systems@gmail.com",
            pass: "R@y!$yst3mS"
          },
          logger: false,
          debug: false // include SMTP traffic in the logs
        }, {
          // default message fields

          // sender info
          from: 'Rayi Systems Private Ltd <rayi.systems@gmail.com>',
          // headers: {
          //     'X-Laziness-level': 1000 // just an example header, no need to use this
          // }
        });

        // Message object
        let message = {
          from: 'Rayi Systems Pvt Ltd <rayi.systems@gmail.com>',
          to: user.local.email,
          subject: 'Password Reset',
          html: `<html>
                  <head></head>
                  <body style="font-family: Arial; font-size: 12px;">
                    <div>
                      <p>You have requested a password reset, please use the below code <b> ${random} <b> to reset your password.</p>
                      <p>Please ignore this email if you did not request a password change.</p>
                    </div>
                  </body>
                </html>`
        };

        transporter.sendMail(message, (error, info) => {
          if (error) {
            console.log('Error occurred');
            console.log(error.message);
            return process.exit(1);
          }

          console.log('Message sent successfully!');
          console.log(nodemailer.getTestMessageUrl(info));

          // only needed when using pooled connections
          transporter.close();
        });
      });
      res.status(200).json({
        message: "reset code has been sent to your mail",
        status: "success",
        user
      })
    })
    .catch(err => {
      res.json({
        err
      })
    })
}

exports.user_reset_password_finish = (req, res, next) => {
  User.findOne({
      'local.email': req.body.email,
      //resetToken: req.body.resetToken
    })
    .select('resetToken')
    .exec()
    .then(user => {
      res.json({
        user
      })
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt)

      user.password = hash;
      console.log(user.password);

      user.resetToken = undefined;
      console.log(user.resetToken);

      user.resetToken_created_at = undefined;
      console.log(user.resetToken);

      user.save()
        .then(result => {
          res.json({
            message: `password updated successfully`
          })
        })
    })
};

exports.user_delete = (req, res, next) => {
  User.remove({
      _id: req.params.userId
    })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};