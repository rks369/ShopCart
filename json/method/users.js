const fs = require("fs");
const sendMail = require("../../utils/send_mail");

usersMethods = {
  setUserList: function (userList, callback) {
    fs.writeFile(
      "./data/users.json",
      JSON.stringify(userList),
      function (err, data) {
        callback();
      }
    );
  },

  getUser: function (email, callback) {
    this.getUserList(function (userList) {
      let index = -1;
      for (var i = 0; i < userList.length; i++) {
        if (userList[i].email == email) {
          index = i;
          break;
        }
      }
      if (index == -1) {
        callback(null);
      } else {
        callback(userList[index]);
      }
    });
  },

  addUser: function (user, callback) {
    this.getUser(user.email, function (isUser) {
      if (isUser == null) {
        usersMethods.getUserList(function (userList) {
          userList.push({
            email: user.email,
            name: user.name,
            password: user.password,
            emailVerified: false,
            token: Date.now(),
          });
          usersMethods.setUserList(userList, () => {
            sendMail(
              user.name,
              user.email,
              "Verify Your Email",
              "Click The Link Below To Verify Your Mail",
              `<h1>Verify</h1><a href="www.google.com">Verify Email</a>`,
              (err, data) => {
                console.log(err, data);
                if (err) callback("something Went Wrong");
                else callback("success");
              }
            );
          });
        });
      } else {
        callback("userexist");
      }
    });
  },

  login: function (user, callback) {
    this.getUser(user.email, function (isUser) {
      if (isUser == null) {
        callback({
          err: "Invalid Credentials !!!",
        });
      } else {
        if (isUser.password == user.password) {
          callback({
            name: isUser.name,
            email: isUser.email,
          });
        } else {
          callback({
            err: "Invalid Credentials !!!",
          });
        }
      }
    });
  },

  getUserList: function (callback) {
    fs.readFile("./data/users.json", "utf-8", function (err, data) {
      let userList;
      if (data.length == 0) {
        userList = [];
      } else {
        userList = JSON.parse(data);
      }
      callback(userList);
    });
  },
  changePassword: function (email, password, callback) {
    usersMethods.getUserList((userList) => {
      let index = -1;
      for (let i = 0; i < userList.length; i++) {
        if (userList[i].email == email) {
          index = i;
          break;
        }
      }
      if (index == -1) {
        callback({ msg: 'error' })
      } else {
        userList[index].password = password;

        usersMethods.setUserList(userList, () => {
          usersMethods.setUserList(userList, () => {
            sendMail(
              userList[index].name,
              userList[index].email,
              "Password Chnaged Successfully!!!",
              "Your Password Has been Chnaged SucessFilly",
              `<h1>Password For Account Id : ${userList[index].email} has been Changed</h1>`,
              (err, data) => {
                if (err) callback({ msg: 'error' });
                else callback({ msg: 'done' });
              }
            );
          });

        })
      }
    })
  },

  forgotPassword: function (emial, callback) {
    usersMethods.getUser(emial, (user) => {
      if (user == null) {
        callback({ msg: 'No User Exists' });
      } else {
        if (user.emailVerified) {

          sendMail(user.name, user.email, 'Reset Your Password', 'Click The Link Below To Reset Your Password', `<h1>Reset Password</h1><a href="https://e-commerce-2-3p34g81k5uyldydalgg.codequotient.in/verifyforgotPassword?token=${user.token}">Reset</a>`, (err, data) => {
            if (err)
              callback({ msg: 'error' })
            else
              callback({ msg: 'done' })
          })
        } else {
          callback({ msg: 'Verfiy Your Emial First !!!' })

        }
      }

    })
  }
};

module.exports = usersMethods;
