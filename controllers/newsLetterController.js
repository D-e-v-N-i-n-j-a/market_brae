const NewsLetter = require('../models/NewsLetters');
const { sendEmail } = require('../utils/mailer');

exports.subscribe = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const newNewsLetter = new NewsLetter({ email });
    await newNewsLetter.save();

    // Optionally send a confirmation email to the subscriber
    const subject = 'NewsLetter Confirmation';
    const text = 'Thank you for subscribing to our newsletter!';
    await sendEmail(email, subject, text);

    res.status(201).json({ message: 'Subscribed successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendNewsletter = async (req, res) => {
  const { subject, text } = req.body;

  if (!subject || !text) {
    return res.status(400).json({ message: 'Subject and text are required.' });
  }

  try {
    const subscribers = await NewsLetter.find({});
    const emails = subscribers.map(sub => sub.email);

    for (const email of emails) {
      await sendEmail(email, subject, text);
    }

    res.status(200).json({ message: 'Newsletter sent successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
