const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

UserSchema.methods.getVerificationToken = function() {
    const token = crypto.randomBytes(20).toString('hex');
    this.verificationToken = token;
    return token;
};

UserSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = resetToken;
    this.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    return resetToken;
};

module.exports = mongoose.model('User', UserSchema);