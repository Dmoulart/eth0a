const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get("/", (req, res) => {
  res.status(200).sendFile(__dirname + "/views/index.html");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
