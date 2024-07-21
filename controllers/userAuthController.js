// controllers/userAuthController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Admin } = require('../models');
const { registerSchema, loginSchema } = require('../validations/userValidation');
const { sendEmail } = require('../utils/mailer');
const generateOTP = require('../utils/otpGenerator');



exports.register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  } 

  const { firstname, middlename, lastname, email, password, phone } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use.' });
    }

    const password_hash = bcrypt.hashSync(password, 10);
    const otp = generateOTP();
    const user = await User.create({ firstname, middlename, lastname, email, password_hash, phone, otp });

    // Send OTP email
    const subject = 'Your OTP Code';
    const template = 'verification'; // Name of the EJS template file
    const context = { firstname, otp };
    await sendEmail(email, subject, template, context);

    res.status(201).json({ message: 'Registration successful. Please check your email for the OTP code.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ where: { email, otp } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    user.otp = null;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};