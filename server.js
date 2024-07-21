const express = require('express')
const app = express()
const PORT = process.env.PORT || 4000;
const db = require('./models');
const bodyParser = require('body-parser');
const userAuthRoutes = require('./routes/userAuthRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const groupChatRoutes = require('./routes/groupChatRoutes');
const wss = require('./websocket');




const cors = require('cors')
// MIDDLEWARES
app.use(cors())
app.use(bodyParser())

app.use('/api/v1/auth', userAuthRoutes);
app.use('/api/v1/subscription', subscriptionRoutes);
app.use('/api/group-chat', groupChatRoutes);




// SEQUALIZE DB
db.sequelize.sync({ force: true })              
  .then(() => { 
    console.log('Database synchronized');
  }) 
  .catch(err => {   
    console.error('Error synchronizing the database:', err);
  }); 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });