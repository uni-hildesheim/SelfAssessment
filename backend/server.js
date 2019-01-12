// load dependencies
const express = require('express');

// static configuration
const PORT = 8000;

// create the app
const app = express();

app.listen(PORT, () => {
  console.log('Server running on port: ' + PORT);
});
