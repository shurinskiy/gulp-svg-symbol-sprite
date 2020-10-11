# gulp-svg-symbol-view
Generate sprites symbols from svgs by cleaning them up with svgo and concatenating them. 
Outputs JSON (for react inlines) and svg. 

## Usage:

```js
var sprite = require('gulp-svg-symbol-view');

function sprite() {
	return gulp.src('./src/images/**/*.svg')
	.pipe(svgSprite({
		name: 'sprite',
		json: true,
		monochrome: {
			darkcyan: '#008b8b',
			white: '#ffffff'
		},
		svgo: {plugins: [
			{ removeRasterImages: true },
			{ removeStyleElement: true }
		]}
	}))
	.pipe(gulp.dest('./public'));
};

exports.sprite = sprite;
```

