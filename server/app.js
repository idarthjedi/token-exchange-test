const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
let {authenticate} = require('../middleware/auth-validate');

let app = express();

const port = process.env.TKNEXCHG_PORT || 3000;
const pingfed = "localhost:9031";
const as_endpoint = "as/token.oauth2"

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(express.static(__dirname + '/../public_html'));

//Create a console logger
app.use((req, res, next) => {
  let now = new Date().toString();
  console.log(`${now}: ${req.method} ${req.url}`);
  next();
});


app.get('/', (req,resp) => {

  console.log('Requested index.html');
  resp.sendFile("index.html")

});

//Use the authenticate middleware to ensure if the user is navigating
//directly to this URL, that we make sure they have a valid token
app.get('/home.html', authenticate, (req, resp) => {
  console.log('Requested home.html');
  resp.sendFile('protected_html/home.html', {root: __dirname + '/../'});
});

app.post('/auth', (req, resp) => {


  try {
    console.log("Auth end-point called");

    const querystring = require("querystring");

    const https = require("https");
    const request = require("axios").create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    });

    let form_data = {'grant_type':'password',
                      'username': `${req.body.username}`,
                      'password': `${req.body.password}`,
                      'client_id': 'ro_client'};

    request.post(`https://${pingfed}/${as_endpoint}`,
      querystring.stringify(form_data),
      {headers: {'content-type': 'application/x-www-form-urlencoded'}})
    .then((response) => {
      //set the token_id cookie equal to the access_token from the oAuth2 server
      resp.cookie('_token_id', response.data.access_token, {maxAge: 360000});
      //todo: redirect to an authorized webpage
      //resp.redirect('../protected/home.html', {root: __dirname});
      console.log(__dirname);
      //resp.redirect('protected_html/home.html', {root: __dirname + '/../'});
      resp.redirect('/home.html');

    })
      .catch((error) => {
      console.log(error);
    });




  }
  catch(error)
  {
    console.log(`Error Occured: ${error}`);
  }

});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
