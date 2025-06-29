const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { check, validationResult } = require('express-validator'); // أضف هذه السطر
const User = require('../models/User');
const auth = require('../middleware/auth');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    },
});

router.post(
    '/register',
    [
        check('username', 'Username is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: 'User already exists' });
            }

            user = new User({ username, email, password });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            const verificationToken = user.getVerificationToken();
            await user.save();

            const verificationUrl = `${process.env.BASE_URL}/verify/${verificationToken}`;

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Verify your email for MERN Auth System',
                html: `<p>Please verify your email by clicking on this link: <a href="${verificationUrl}">${verificationUrl}</a></p>`,
            });

            res.status(201).json({ msg: 'User registered. Please check your email for verification.' });
        } catch (err) {
            res.status(500).send('Server error');
        }
    }
);

router.get('/verify/:token', async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired verification token' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.status(200).json({ msg: 'Email verified successfully! You can now log in.' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }

            if (!user.isVerified) {
                return res.status(400).json({ msg: 'Please verify your email first.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }

            const payload = {
                user: {
                    id: user.id,
                    username: user.username,
                },
            };

            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
                if (err) throw err;
                res.json({ token });
            });
        } catch (err) {
            res.status(500).send('Server error');
        }
    }
);
router.get('/test-email', async (req, res) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'recipient_email@example.com', // حط ايميل تاني هنا للاختبار
            subject: 'Test Email from MERN Auth System',
            html: '<p>This is a test email to confirm Nodemailer setup.</p>',
        });
        res.status(200).json({ msg: 'Test email sent successfully!' });
    } catch (error) {
        console.error('Error sending test email:', error);
        res.status(500).json({ msg: 'Failed to send test email', error: error.message });
    }
});

router.post(
    '/forgot-password',
    [check('email', 'Please include a valid email').isEmail()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }

            const resetToken = user.getResetPasswordToken();
            await user.save();

            const resetUrl = `${process.env.BASE_URL}/reset-password/${resetToken}`;

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Password Reset Request for MERN Auth System',
                html: `<p>You requested a password reset. Please click on this link: <a href="${resetUrl}">${resetUrl}</a></p>`,
            });

            res.status(200).json({ msg: 'Password reset link sent to your email.' });
        } catch (err) {
            res.status(500).send('Server error');
        }
    }
);

router.put(
    '/reset-password/:token',
    [
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { password } = req.body;
        try {
            const user = await User.findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpire: { $gt: Date.now() },
            });

            if (!user) {
                return res.status(400).json({ msg: 'Invalid or expired reset token' });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            res.status(200).json({ msg: 'Password reset successfully!' });
        } catch (err) {
            res.status(500).send('Server error');
        }
    }
);

router.get('/dashboard', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;