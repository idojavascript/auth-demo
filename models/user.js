var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
mongoose
  .connect("mongodb://localhost/login_database", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection Established"))
  .catch((err) => console.log(err));
var db = mongoose.connection;
var userSchema = mongoose.Schema({
  name: {
    type: String,
    index: true,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
  },
  profileimage: {
    type: String,
  },
  uname: {
    type: String,
  },
  contact: {
    type: String,
  },
});
var User = (module.exports = mongoose.model("user", userSchema));

module.exports.getMembers = () => User.find();

module.exports.updateUser = async (data, callback) => {
  console.log("update");

  const res = await User.findByIdAndUpdate(data.id, data);

  res.save();

  if (!res) {
    const error = "No data 1";
    callback(error, "");
  }

  if (res) {
    console.log("res", res);
    callback("", res);
  }
};

module.exports.deleteUser =  (data) => User.findByIdAndDelete(data.id);

module.exports.getUserById = function (id, callback) {
    
  User.findById(id)
    .then((user) => {
      if (!user) {
        const error = "No data 2";
        callback(error, "");
      }

      if (user) {
        console.log(user);
        callback("", user);
      }
    })
    .catch((err) => console.log(err));
};

module.exports.getUserByUsername = function (username, callback) {
  var query = { uname: username };
  User.findOne(query)
    .then((user) => {
      if (!user) {
        const error = "No data 3";
        callback(error, "");
      }

      if (user) {
        console.log(user);
        callback("", user);
      }
    })
    .catch((err) => console.log(err));
};
module.exports.comparePassword = function (candidatepassword, hash, callback) {
  bcrypt.compare(candidatepassword, hash, function (err, isMatch) {
    callback(null, isMatch);
  });
};
module.exports.createUser = function (newUser, callback) {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(newUser.password, salt, function (err, hash) {
      newUser.password = hash;
      newUser
        .save()
        .then(function (models) {
          console.log(models);
          callback();
        })
        .catch(function (err) {
          console.log(err);
        });
    });
  });
};
