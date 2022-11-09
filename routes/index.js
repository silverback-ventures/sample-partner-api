

var axios = require('axios')
var router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Auth0 Webapp sample Nodejs',
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

router.get('/profile', requiresAuth(), function (req, res, next) {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Profile page'
  });
});

router.post('/donate', requiresAuth(), function (req, res, next) {
  axios.post(`${process.env.DAFFY_API_URL}/public/api/v1/donations`, {
    amount: req.body.amount,
    ein:req.body.ein
  }, {
    headers: {
      'Authorization': `${process.env.CLIENT_ID} ${req.oidc.idToken}`,
    }
  })
  .then(function (response) {
    console.log("body", response.data)
    res.json(response.data);
  })
  .catch(function (error) {
    console.log("error", error);
    res.json(error.message);
  });
})

module.exports = router;