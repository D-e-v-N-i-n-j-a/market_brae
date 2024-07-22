// controllers/faqController.js
const { FAQ, Admin } = require('../models');
const Joi = require('joi');

// Validation schema
const createFAQSchema = Joi.object({
  question: Joi.string().required(),
  answer: Joi.string().required(),
  adminId: Joi.number().required()
});

exports.createFAQ = async (req, res) => {
  const { error } = createFAQSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { question, answer, adminId } = req.body;

  try {
    const admin = await Admin.findByPk(adminId);

    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' });
    }

    const faq = await FAQ.create({ question, answer, adminId });
    res.status(201).json(faq);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.findAll();
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await FAQ.findByPk(id);

    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    await faq.destroy();
    res.status(200).json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
