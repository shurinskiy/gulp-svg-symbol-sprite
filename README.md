# gulp-svg-symbol-sprite
Generate sprites symbols from svgs by cleaning them up with svgo and concatenating them. 
Outputs JSON (for react inlines) and svg. 

## Usage:

```js
var sprite = require('gulp-svg-symbol-sprite');

gulp.task('svg', function () {
    return gulp.src(['fixture/*.svg'])
	.pipe(sprite({
		name: 'sprite.svg',
		monochrome: {
			darkcyan: '#008b8b',
			burlywood: '#deb887',
			dimgrey: '#696969'
		}
	}))
    .pipe(gulp.dest('dest'));
});
```

