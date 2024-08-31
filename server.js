// server.js

require('dotenv').config(); // Load environment variables from .env file

const app = require('./src/app'); 
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
