const express = require("express");
const bodyParser = require("body-parser");

let app = express();
const port = process.env.TKNEXCHG_PORT || 3000;


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public_html'));

//Create a console logger
app.use((req, res, next) => {
  let now = new Date().toString();
  console.log(`${now}: ${req.method} ${req.url}`);
  next();
});


app.get('/', (req,resp) => {
  resp.send("index.html")

});

app.post('/auth', (req, resp) => {
  try {
    console.log("Auth end-point called");
    console.log(`Username ${req.body.username}`);
    console.log(`Password ${req.body.password}`);
  }
  catch
  {
    console.log("Error Occured");
  }
  resp.send("<html><body>completed</body></html>")
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
