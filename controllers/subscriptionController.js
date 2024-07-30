const Subscription = require('../models/Subscription');
const User = require('../models/User');
const paystack = require('../config/paystack');
const { sendEmail } = require('../utils/mailer');

exports.initiateSubscription = async (req, res) => {
  const { userId, plan, amount, email } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const response = await paystack.transaction.initialize({
      email: email,
      amount: amount * 100, // Paystack amount is in kobo
      callback_url: `${process.env.BASE_URL}/api/subscriptions/verify`
    });

    res.status(200).json({ authorization_url: response.data.authorization_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifySubscription = async (req, res) => {
  const { reference } = req.query;

  try {
    const response = await paystack.transaction.verify(reference);
    if (response.data.status !== 'success') {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const { email, plan, expiryDate, userId } = response.data.metadata;

    const newSubscription = new Subscription({
      user: userId,
      plan,
      expiryDate
    });

    await newSubscription.save();

    // Send confirmation email
    const subject = 'Subscription Confirmation';
    const template = 'subscription-confirmation';
    const context = { user: response.data.customer };
    await sendEmail(email, subject, template, context);

    res.status(201).json({ message: 'Subscribed successfully', subscription: newSubscription });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin CRUD operations

exports.createSubscription = async (req, res) => {
  const { userId, plan, expiryDate } = req.body;

  try {
    const newSubscription = new Subscription({
      user: userId,
      plan,
      expiryDate
    });

    await newSubscription.save();
    res.status(201).json({ message: 'Subscription created successfully', subscription: newSubscription });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find().populate('user');
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSubscription = async (req, res) => {
  const { subscriptionId, plan, expiryDate } = req.body;

  try {
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      subscriptionId,
      { plan, expiryDate },
      { new: true }
    );

    if (!updatedSubscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    res.status(200).json({ message: 'Subscription updated successfully', subscription: updatedSubscription });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSubscription = async (req, res) => {
  const { subscriptionId } = req.params;

  try {
    const deletedSubscription = await Subscription.findByIdAndDelete(subscriptionId);

    if (!deletedSubscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    res.status(200).json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
