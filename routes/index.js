/* GET home page. */
exports.index = function(req, res){
  res.render('index', { title: 'CS247 Chatroom' });
};

exports.v1 = function(req,res) {
	console.log('v1');
	console.log(req.params);
	res.render('index', { title: 'CS247 Chatroom v1', version: 1 });
};

// exports.v1withparams = function(req,res) {
// 	console.log('v1withparams');
// 	console.log(req.params);
// 	res.render('index', { title: 'CS247 Chatroom v1', version: 1, room_id: req.params.room_id });
// 	console.log('render successful')
// };

exports.v2 = function(req,res) {
	res.render('index', { title: 'CS247 Chatroom v2', version: 0 });
};
