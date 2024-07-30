const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Admin = require('../models/Admin');
const { registerSchema, loginSchema } = require('../validations/userValidation');
const { sendEmail } = require('../utils/mailer');
const generateOTP = require('../utils/otpGenerator');
const { gfs } = require('../config/gridfs');

let temporaryUsers = {}; // In-memory store for demonstration purposes

exports.sendOtp = async (req, res) => {
    const { error } = registerSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { firstname, middlename, lastname, email, password, phone } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use.' });
        }

        const otp = generateOTP();
        temporaryUsers[email] = {
            firstname,
            middlename,
            lastname,
            email,
            password,
            phone,
            otp,
        };

        // Send OTP email
       // Send OTP email
    const subject = 'Your OTP Code';
    const template = 'verification';
    const context = { firstname, otp };
    await sendEmail(email, subject, template, context);

        res.status(200).json({ message: 'OTP sent to your email. Please verify to complete registration.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.verifyOtpAndRegister = async (req, res) => {
    const { email, otp } = req.body;

    const tempUser = temporaryUsers[email];

    if (!tempUser || tempUser.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP.' });
    }

    try {
        const password_hash = bcrypt.hashSync(tempUser.password, 10);
        const user = await User.create({
            firstname: tempUser.firstname,
            middlename: tempUser.middlename,
            lastname: tempUser.lastname,
            email: tempUser.email,
            password: password_hash,
            phone: tempUser.phone,
        });

        delete temporaryUsers[email];

        res.status(201).json({ message: 'Registration successful.', user });
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
        const user = await User.findOne({ email });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.adminLogin = async (req, res) => {
    const { error } = loginSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    try {
        const user = await Admin.findOne({ email });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
 
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.adminRegistration = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(401).json({ message: 'Fields must be filled' });
    }
    try {
        const password_hash = bcrypt.hashSync(password, 10);
        const admin = await Admin.create({
            username,
            email,
            password: password_hash,
        });

        res.status(201).json({ message: 'Registration successful.', admin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProfilePicture = async (req, res) => {
    const { filename } = req.params;
  
    try {
      const file = await gfs.find({ filename }).toArray();
      if (!file || file.length === 0) {
        return res.status(404).json({ message: 'File not found.' });
      }
  
      gfs.openDownloadStreamByName(filename).pipe(res);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.uploadProfilePicture = async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
  
    const { email } = req.body;
  
    try {
      const user = await User.findOneAndUpdate({ email }, { profilePicture: req.file.filename }, { new: true });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      res.status(200).json({ message: 'Profile picture uploaded successfully.', user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };