var gulp = require('gulp');
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');
var settings = require('./gulpfile_settings');

var fs = require('fs');
var path = require('path');

var getFolders = function (dir) {
	return fs.readdirSync(dir).filter(function (file) {
		return fs.statSync(path.join(dir, file)).isDirectory();
	});
};

gulp.task('svgfonts', function(){
	var folders = getFolders(settings.watch.font.dir);
	var timestamp = Date.now();

	folders.map(function (folder) {
		gulp.src(settings.watch.font.dir + folder + '/*.svg')
		.pipe(iconfont({
			fontName: folder
		}))
		.on('glyphs', function(glyphs) {
			var options = {
				glyphs: glyphs,
				fontName: folder,
				fontPath: '../font/',
				className: folder
			};
			gulp.src(settings.watch.font.dir + 'templates/css.scss')
			.pipe(consolidate('lodash', options))
			.pipe(rename({basename: '_' + folder}))
			.pipe(gulp.dest(settings.watch.css.dir + '/font/'));
			gulp.src(settings.watch.font.dir + 'templates/fontlist.html')
			.pipe(consolidate('lodash', options))
			.pipe(rename({basename: folder + '_fontlist'}))
			.pipe(gulp.dest(settings.watch.css.dir + '/font/'));
		})
		.pipe(gulp.dest(settings.watch.font.dir))
		.pipe(gulp.dest(settings.dest.font.dir));
	});
});
