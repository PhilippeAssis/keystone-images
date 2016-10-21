var exists = require('file-exists')
var path = require('path')
var Jimp = require('jimp')
var merge = require('merge')
var mkdirp = require('mkdirp');


module.exports = function(req, res, options) {
	var imagePathDefault = path.resolve('storage', 'uploads', 'posts', req.params.image);

	if (!options.custom.size[1]) {
		options.custom.size[1] = Jimp.AUTO
	}

	var size = {
		w: (parseInt(options.custom.size[0]) <= options.default.maxSize[0]) ? parseInt(options.custom.size[0]) : options.default.maxSize[0],
		h: (parseInt(options.custom.size[1]) <= options.default.maxSize[1]) ? parseInt(options.custom.size[1]) : options.default.maxSize[1]
	}

	var imagePathSize = path.resolve('storage', 'uploads', 'posts', options.custom.quality.toString(), size.w.toString(), req.params.image)

	if (exists(imagePathSize)) {
		return Jimp.read(imagePathSize).then((image) => {
			image.getBuffer(Jimp.AUTO, (err, file) => {
				res.writeHead(200, { 'Content-Type': image._originalMime });
				res.end(file, 'binary');
			})
		}).catch(function(err) {
			console.error(err);
		})
	}

	Jimp.read(imagePathDefault).then((image) => {
		if (image.bitmap.width > size.w) {
			image = image.resize(size.w, Jimp.AUTO);
		}

		if (image.bitmap.height > size.h) {
			image = image.resize(Jimp.AUTO, size.h);
		}

		image.quality(parseInt(options.custom.quality))
			.getBuffer(Jimp.AUTO, (err, file) => {
				res.writeHead(200, { 'Content-Type': image._originalMime });
				res.end(file, 'binary');
			});

		mkdirp(path.parse(imagePathSize).dir, function(err) {
			if (err) return console.error(err)
			image.write(imagePathSize, (err) => {
				if (err) return console.error(err)
				console.log('write')
			})
		});

	}).catch(function(err) {
		console.error(err);
	});

};
