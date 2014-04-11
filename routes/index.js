/* GET home page. */
exports.index = function(req, res){
  res.render('index', { title: 'CS247 Chatroom' });
};

exports.v1 = function(req,res) {
	res.render('index', { title: 'CS247 Chatroom v1', version: 1 });
};

exports.v2 = function(req,res) {
	res.render('index', { title: 'CS247 Chatroom v2', version: 0 });
};