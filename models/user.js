var mongoose = require("mongoose");
var crypto = require("crypto");
var uuidv1 = require('uuid/v1');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    lastname: {
        type: String,
        maxlength: 32,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true        
    },
    userinfo: {
        type: String,
        trim: true
    },
    encriptPassword: {
        type: String,
        required: true
    },
    salt: String,

    role: {
        type: Number,
        default: 0
    },
    purchases: {
        type: Array,
        default: []
    }
},
{timestamps: true}
);

// setting virtual property
userSchema.virtual('password')
.set(function(password){
    this._password = password;
    this.salt = uuidv1();
    this.encriptPassword = this.securePassword(password);
})
.get(function(){
    return this._password;
});

//defining methods to our schema
userSchema.methods = {

    authenticate: function(plainpassword){
        return this.securePassword(plainpassword) === this.encriptPassword; 
    },
    
    securePassword: function(plainpassword){
        if(!plainpassword) return "";
        try {
            return crypto.createHmac('sha256', this.salt)
                   .update(plainpassword)
                   .digest('hex');
        } catch (err) {
            return "";
        }
    }
}



//NOTE: to export a schema in mongoose
// mongoose.model is used to compile our model, this create a class
module.exports = mongoose.model("User", userSchema); 

//  const User = mongoose.model("User", userSchema);
// var user = new User({
//     name: "neha",
//     lastname: "motwani",
//     email: "sjd@gmail.com",
//     password: "2345"
// });
// console.log(user);
// console.log(user.encriptPassword, user._password);