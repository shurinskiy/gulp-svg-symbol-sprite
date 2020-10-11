# gulp-svg-symbol-view
Generate sprites symbols from svgs by cleaning them up with svgo and concatenating them. Outputs svg and JSON (for react inlines). 

This piece was inspired by a rather old [article by David Bushels](https://dbushell.com/2015/01/30/use-svg-part-2). There he describes one cool way to use a symbol sprite to set backgrounds in css. The point is that it is impossible to link from css to symbol groups inside a sprite without additional constructions.

I took as a basis the Stefan Müller sprite generator [gulp-svg-symbol-sprite](https://github.com/mllrsohn/gulp-svg-symbol-sprite) and added logic to it using the "use" tag to create areas corresponding to the images contained in the symbol groups, which can then be referenced using the "view" tags using the postfix "- view "after the source file name. Well, okay, I myself would not understand such an explanation :) Just look inside the created sprite, having previously formatted it in the editor, and everything will become clear to you.

The process of creating view areas has two modes. The first is just a link to the original image, no changes. The second is when colors are removed from the original images and the generated view areas are styled using the colors passed to the parameters.

## Usage:

gulpfile.js (simple):
```js
var svgSprite = require('gulp-svg-symbol-view');

function sprite() {
	return gulp.src('./src/images/**/*.svg')
	.pipe(svgSprite('spritename'))
	.pipe(gulp.dest('./public'));
};

exports.sprite = sprite;
```

gulpfile.js (with json create):
```js
function sprite() {
	return gulp.src('./src/images/**/*.svg')
	.pipe(svgSprite({
		name: 'spritename',
		json: true,
		svgo: { plugins: [ // you can control svgo if you want
			{ removeRasterImages: true },
			{ removeStyleElement: true }
		]}
	}))
	.pipe(gulp.dest('./public'));
};
```

gulpfile.js (use monochromatic mode):
```js
function sprite() {
	return gulp.src('./src/images/**/*.svg')
	.pipe(svgSprite({
		name: 'spritename',
		monochrome: {
			darkcyan: '#008b8b',
			white: '#ffffff'
		}
	}))
	.pipe(gulp.dest('./public'));
};
```

html:
```html
<svg class="icon">
	<use xlink:href="images/sprite.svg#iconname"></use>
</svg>
```

css:
```css
.icon {
	background: url('images/sprite.svg#iconname-view') center / 30px 30px no-repeat transparent;
}
```

css (monochrome mode):
```css
.icon {
	background: url('images/sprite.svg#iconname-view-darkcyan') center / 30px 30px no-repeat transparent;
}

.icon:hover {
	background-image: url('images/sprite.svg#iconname-view-white');
}
```

