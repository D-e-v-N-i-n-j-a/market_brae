require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express')
const app = express()
const PORT = process.env.PORT || 4000; 
const db = require('./models');
const bodyParser = require('body-parser');
const userAuthRoutes = require('./routes/userAuthRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const groupChatRoutes = require('./routes/groupChatRoutes');
const wss = require('./service/websocket');
const course = require('./routes/courseRoutes')
const blogRoutes = require('./routes/blogRoutes')
const faqRoutes = require('./routes/faqRoutes');




const cors = require('cors')
// MIDDLEWARES
app.use(cors())
app.use(bodyParser())



app.use('/api/v1/auth', userAuthRoutes);
app.use('/api/v1/subscription', subscriptionRoutes);
app.use('/api/v1/group-chat', groupChatRoutes);
app.use('/api/v1/admin/course',course);
app.use('/api/v1/blog',blogRoutes)
app.use('/api/v1/faqs', faqRoutes);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

  
// SEQUALIZE DB
db.sequelize.sync({ alter: false })               
  .then(() => { 
    console.log('Database synchronized');
  }) 
  .catch(err => {   
    console.error('Error synchronizing the database:', err);
  });  

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });