var express = require('express');
var path = require('path');
var router = express.Router();

router.use("/signup", express.static("user_flow_prototype"));

var createSubscription = function (request) {
  var subscriptions = request.session.data.subscriptions || [];

  var params = request.query;
  var nextId = subscriptions.length + 1;

  if (subscriptionExistsWithTitle(subscriptions, params.title)) {
    return;
  }

  var subscription = {
    id: nextId,
    title: params.title,
    url: params.url,
  };

  subscriptions.push(subscription);

  request.session.data.subscriptions = subscriptions;
  request.session.data[nextId + "-frequency"] = params.frequency;
};

var deleteSubscription = function (request) {
  var id = parseInt(request.query.id, 10);

  if (typeof(request.session.data.subscriptions) === undefined) {
    return;
  }

  for (var i = 0; i < request.session.data.subscriptions.length; i += 1) {
    if (request.session.data.subscriptions[i].id === id) {
      request.session.data.subscriptions.splice(i, 1);
      return;
    }
  }
};

var findSubscription = function (request) {
  var subscriptions = request.session.data.subscriptions || [];
  var id = parseInt(request.query.id, 10);

  var subscription;
  for (var i = 0; i < subscriptions.length; i += 1) {
    if (subscriptions[i].id === id) {
      subscription = subscriptions[i];
    }
  }

  return JSON.parse(JSON.stringify(subscription));
};

var subscriptionExistsWithTitle = function (subscriptions, title) {
  for (var i = 0; i < subscriptions.length; i += 1) {
    if (subscriptions[i].title === title) {
      return true;
    }
  }

  return false;
};

var setEmailAddress = function (request) {
  var address = request.query.address;
  request.session.data.address = address;
};

// Route index page
router.get('/', function (req, res) {
  res.render('index');
});

router.get('/manage', function (req, res) {
  res.render('manage');
});

router.get('/manage-2', function (req, res) {
  res.render('manage-2');
});

router.get('/email-change-2', function (req, res) {
  setEmailAddress(req);
  res.redirect('/manage');
});

router.get('/confirm-unsubscribe', function (req, res) {
  var subscription = findSubscription(req);
  res.render('confirm-unsubscribe', subscription);
});

router.get('/edit', function (req, res) {
  var subscription = findSubscription(req);
  res.render('edit', subscription);
});

router.get('/create', function (req, res) {
  createSubscription(req);
  setEmailAddress(req);

  res.redirect('/manage');
});

router.get('/unsubscribe', function (req, res) {
  deleteSubscription(req);
  res.redirect('/unsubscribed');
});

module.exports = router;
