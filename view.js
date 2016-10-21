var exists = require('file-exists')
var merge = require('merge')
var path = require('path')

var optionsModel = {
	size: new Array(),
}

const defaultOptions = {
	size: [800, -1],
	quality: 60,
	maxSize: [1200, 1200],
	sizes: {
		thumb: [80, 80],
		small: [250, 250],
		medium: [600, 600],
		normal: [800, 800],
		big: [1200, 1200]
	}
}

function queryValueToArray(query) {
	for (let key in query) {
		if (optionsModel[key] instanceof Array) {
			query[key] = query[key].split(',')
		}
	}

	return query;
}


function Image(req, res){
  var imagePathDefault = path.resolve('storage', 'uploads', 'posts', req.params.image);

	if (req.params.image.indexOf('/') > -1 || !exists(imagePathDefault)) {
		return res.status(404).send('Not found');
	}

	var options;

	if (req && req.query) {
		req.query = queryValueToArray(req.query);
		options = merge(true, defaultOptions, req.query)
	} else {
		options = defaultOptions;
	}

	this.size = (size) => {
		if (size) {
			options.size = options.sizes[size]
		}

		return require('./lib/size')(req, res, { custom: options, default: defaultOptions });
	}

	return this;
}


module.exports = function(req, res) {
	try{
    return new Image(req, res)
  }
  catch(err){
    console.error(err);
    return res.status(404).send('Not found');
  }
}
