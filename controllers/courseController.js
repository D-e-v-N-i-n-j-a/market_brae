const Course = require('../models/Course');
const { upload } = require('../config/gridfs');

exports.createCourse = async (req, res) => {
  const { title, description } = req.body;

  try {
    const newCourse = new Course({ title, description });
    await newCourse.save();
    res.status(201).json({ message: 'Course created successfully', course: newCourse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadVideo = async (req, res) => {
  const { courseId, title, description } = req.body;
  if (!req.file) {
    return res.status(400).json({ message: 'No video file uploaded' });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const video = {
      title,
      description,
      videoUrl: req.file.filename
    };

    course.videos.push(video);
    await course.save();

    res.status(200).json({ message: 'Video uploaded successfully', course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadMaterial = async (req, res) => {
  const { courseId, videoId } = req.body;
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const video = course.videos.id(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const material = {
      materialUrl: req.file.filename,
      materialType: req.file.mimetype.split('/')[1]
    };

    video.materials.push(material);
    await course.save();

    res.status(200).json({ message: 'Material uploaded successfully', course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
