var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');
var settings = require('./gulpfile_settings');

var fs = require('fs');
var path = require('path');

var getFolders = function (dir) {
	return fs.readdirSync(dir).filter(function (file) {
		return fs.statSync(path.join(dir, file)).isDirectory();
	});
};

gulp.task('sprites', function () {
	// set target folders
	var folders = getFolders(settings.watch.img.dir + 'sprite');
	var timestamp = Date.now();

	// generate image & css files
	folders.map(function (folder) {
		var spriteData = gulp.src('sprite/' + folder + '/*.png', {cwd: settings.watch.img.dir})
			.pipe(spritesmith({
				imgName: 'sprite-' + folder + '.png',
				imgPath: '../img/' + 'sprite/sprite-' + folder + '.png?' + timestamp,
				cssName: '_'+ folder + '.scss',
				algorithm: 'binary-tree',
				padding: 4,
				cssFormat: 'scss'
			}));

		spriteData.img.pipe(gulp.dest(settings.watch.img.dir + 'sprite'));
		spriteData.css.pipe(gulp.dest(settings.watch.css.dir + 'sprite/'));
		spriteData.img.pipe(gulp.dest(settings.dest.img.dir + 'sprite'));
	});
});
