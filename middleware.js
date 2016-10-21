var express = require('express');
var app = express();
var router = express.Router();
var view = require('./view');

module.exports = (req, res, next) => {
  if(!res){
    res = {}
  }
  if(!res.locals){
		res.locals = {}
	}

	res.locals.getImage = (name, type = 'normal') => {
		return req.protocol + '://' + req.get('host') + '/files/image/' + type + '/' + name
	}

	router.get('/files/image/thumb/:image', (req, res) => {
		view(req, res).size('thumb')
	});

	router.get('/files/image/small/:image', (req, res) => {
		view(req, res).size('small')
	});

	router.get('/files/image/medium/:image', (req, res) => {
		view(req, res).size('medium')
	});

	router.get('/files/image/normal/:image', (req, res) => {
		view(req, res).size('normal')
	});

	router.get('/files/image/big/:image', (req, res) => {
		view(req, res).size('big')
	});

	return router;
}
