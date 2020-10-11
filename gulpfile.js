'use strict';
var gulp = require('gulp');
var svgSprite = require('./');

function sprite() {
	return gulp.src(['./fixture/*.svg'])
	.pipe(svgSprite({
		name: 'sprite',
		json: true,
		monochrome: {
			darkcyan: '#008b8b',
			burlywood: '#deb887',
			dimgrey: '#696969'
		}
	}))
	.pipe(gulp.dest('./dest'));
};

exports.sprite = sprite;
