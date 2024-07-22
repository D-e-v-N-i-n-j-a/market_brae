// controllers/userAuthController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Admin } = require('../models');
const { registerSchema, loginSchema } = require('../validations/userValidation');
const { sendEmail } = require('../utils/mailer');
const generateOTP = require('../utils/otpGenerator');

let temporaryUsers = {}; // In-memory store for demonstration purposes

exports.sendOtp = async (req, res) => {
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

    const otp = generateOTP();
    temporaryUsers[email] = {
      firstname,
      middlename,
      lastname,
      email,
      password,
      phone,
      otp
    };

    // Send OTP email
    const subject = 'Your OTP Code';
    const template = 'verification'; // Name of the EJS template file
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
      password_hash,
      phone: tempUser.phone
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
    const user = await User.findOne({ where: { email },attr:["firstname","lastname","middlename","email","phone"] });

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ "token":token,"user":user });
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
    const user = await Admin.findOne({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ "token":token,"user":user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.adminRegistration = async(req,res)=>{
  const {username,email,password} = req.body;

  if (!username || !email || !password) {
    return res.status(401).json({ message: 'Fields must be filed' });
  }
  try {
    const password_hash = bcrypt.hashSync(password, 10);
    const admin = await Admin.create({
      username:username,
      email:email,
      password_hash:password_hash
    })
  
    res.status(201).json({ message: 'Registration successful.',admin });
  
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}












