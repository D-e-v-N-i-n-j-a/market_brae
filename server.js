require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express')
const app = express()
const PORT = process.env.PORT || 4000; 
const bodyParser = require('body-parser');




const cors = require('cors')
// MIDDLEWARES
app.use(cors())
app.use(bodyParser())



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

  

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });