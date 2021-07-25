var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json([
    { id: 1, username: "Will" },
    { id: 2, username: "Nick" },
  ]);
});

module.exports = router;
