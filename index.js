'use strict';
const path = require('path');
const SVGO = require('svgo');
const Vinyl = require('vinyl');
const through = require('through2');
const jsontoxml = require('jsontoxml');
const svgParser = require('svg-parser');
const PluginError = require('plugin-error')

let mapChild = (child) => {
	let mappedChild = {
		name: child.tagName,
		attrs: child.properties
	};
	if (child.children && child.children.length > 0) {
		mappedChild.children = child.children.map(mapChild);
	}
	return mappedChild;
};

let clone = (obg) => {
	return JSON.parse(JSON.stringify(obg));
}

module.exports = (opt) => {

	let options = {
		name: 'sprite',
		json: false,
		monochrome: false,
		svgo: { plugins: [] }
	};

	options = {...options, ...opt };
	options.svgo.plugins.push({ removeViewBox: false });

	if (options.monochrome) {
		options.svgo.plugins.push({ removeAttrs: { attrs: '(fill|stroke)' }});
	} 

	if (typeof opt === 'string') {
		options.name = opt;
	} 

	let svgo = new SVGO(options.svgo);
	let symbols = [];
	let views = [];
	let uses = [];
	let shift = 0;
	let latestFile;

	return through.obj(
		(file, enc, cb) => {
			
			if (!file.isNull() && !file.stat.isDirectory()) {
				latestFile = file;
				
				let id = path.parse(file.path).name;
				let json;

				svgo.optimize(file.contents).then((result) => {
					try {
						json = svgParser.parse(result.data);
					} catch (err) {
						return cb(new PluginError('gulp-svg-to-symbol', `Skipped file: ${path.parse(file.path).base}, could not parse file`));						
					}

					let viewbox = json.children[0].properties.viewbox || json.children[0].properties.viewBox;
					let viewbox_arr = viewbox.split(' ');
					let height = Number(viewbox_arr[3]) + 10; // высота текущего элемента с отступом

					viewbox_arr[1] = shift; // смещение по y (вниз)

					symbols.push({
						name: 'symbol',
						attrs: {
							id: id,
							viewBox: viewbox
						},
						children: json.children[0].children.map(mapChild)
					});

					let view = {
						name: 'view',
						attrs: {
							id: `${id}-view`,
							viewBox: viewbox_arr.join(' ')
						}
					}

					let use = {
						name: 'use',
						attrs: {
							'xlink:href': `#${id}`,
							x: viewbox_arr[0],
							y: viewbox_arr[1],
							width: viewbox_arr[2],
							height: viewbox_arr[3]
						}
					}

					if (options.monochrome) {
						let ctr = 0;
						for (const color in options.monochrome) {
							let current_shift = shift + height*ctr;
							
							view.attrs.id = `${id}-view-${color}`;
							use.attrs.style = `fill:${options.monochrome[color]}`;

							view.attrs.viewBox = `${viewbox_arr[0]} ${current_shift} ${viewbox_arr[2]} ${viewbox_arr[3]}`;
							use.attrs.y = current_shift;

							uses.push(clone(use));
							views.push(clone(view));

							ctr++;
						}
						shift += height*ctr;
					} else {
						uses.push(use);
						views.push(view);
						shift += height;
					}
					
					cb();
				});
			}
		},
		function (cb) {
			if (!latestFile) return cb();

			let data = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">${jsontoxml(symbols)} ${jsontoxml(views)} ${jsontoxml(uses)}</svg>`;

			if (options.json) {
				this.push(
					new Vinyl({
						cwd: latestFile.cwd,
						base: latestFile.base,
						path: path.join(latestFile.base, `${options.name}.json`),
						contents: Buffer.from(JSON.stringify(symbols))
					})
				);			
			}
			this.push(
				new Vinyl({
					cwd: latestFile.cwd,
					base: latestFile.base,
					path: path.join(latestFile.base, `${options.name}.svg`),
					contents: Buffer.from(data)
				})
			);
			cb();
		}
	);
};

