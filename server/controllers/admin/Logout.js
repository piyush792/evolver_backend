var session = require('express-session');

exports.index = function (req, res) {
    var params = null;
    // console.log("Names1: "+req.session.username);

    req.session.username=null;
    req.session.username='';
    
    res.render('login', { 'title': 'Login', 'params': JSON.stringify(params) });
}
