
let authenticate = (req, resp, next) => {

  console.log('Authenticate Middleware');
  let token = req.cookies['_token_id'] + '';

  //todo: replace with a validate call
  console.log(`Token: ${token}`);
  //For now, we're just looking to see if there is an actual token_id
  if ((token !== 'undefined') && (token !== '')) {
    next();
  }
  else
  {
    resp.status(403).send();
  };

};


module.exports = { authenticate };
