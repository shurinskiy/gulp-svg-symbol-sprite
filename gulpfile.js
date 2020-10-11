'use strict';
'use strict';
var gulp = require('gulp');
var sprite = require('./');

gulp.task('default', function () {
	return gulp.src(['./fixture/*.svg'])
	.pipe(sprite({
		name: 'sprite.svg',
		monochrome: {
			darkcyan: '#008b8b',
			burlywood: '#deb887',
			dimgrey: '#696969'
		}
	}))
	.pipe(gulp.dest('./dest'));
});
