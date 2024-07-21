// controllers/subscriptionController.js

const axios = require('axios');
const { Subscription } = require('../models');
const { User } = require('../models');

exports.initiateSubscription = async (req, res) => {
  const { userId, amount } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const response = await axios.post('https://api.paystack.co/transaction/initialize', {
      email: user.email,
      amount: amount * 100 // Paystack amount is in kobo
    }, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    });

    const { authorization_url, reference } = response.data.data;

    await Subscription.create({
      userId: user.id,
      status: 'pending',
      reference,
      amount
    });

    res.status(200).json({ authorization_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifySubscription = async (req, res) => {
  const { reference } = req.query;

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    });

    const { status } = response.data.data;

    const subscription = await Subscription.findOne({ where: { reference } });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found.' });
    }

    subscription.status = status === 'success' ? 'active' : 'failed';
    await subscription.save();

    res.status(200).json({ message: 'Subscription status updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 
