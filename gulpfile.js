var gulp = require('gulp');
var plumber = require('gulp-plumber');

var autoprefixer = require('autoprefixer');

var postcss = require('gulp-postcss');
var precss = require('precss');
var localBydefault = require('postcss-modules-local-by-default');

var webpack = require('gulp-webpack');
var named = require('vinyl-named');

var usemin = require('gulp-usemin');
var minifyJs = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');

var watch = require('gulp-watch');
var connect = require('gulp-connect');

var minimist = require('minimist');
var gulpif = require('gulp-if');

var rename = require("gulp-rename");

var args = minimist(process.argv.slice(2));

var settings = require('./gulpfile_settings');
var isSscs = settings.watch.css.files.indexOf('scss') >= 0;

var requireDir = require('require-dir');

gulp.task('postcss', function () {
	if(isSscs) return;
	gulp.src([settings.watch.css.files])
	.pipe(plumber())
	.pipe(postcss([
		precss
	]))
	.pipe(autoprefixer({
		browsers: ["> 0%"],
		cascade: false
	}))
	.pipe(gulp.dest(settings.dest.css.dir));
});


gulp.task('webpack', function(){
	gulp.src(settings.watch.es6.files)
	.pipe(plumber())
	.pipe(named(function(file) {
		return file.relative.replace(/\.[^\.]+$/, '');
	}))
	.pipe(webpack({
		resolve: {
			modulesDirectories: ['node_modules', 'bower_components'],
			extensions: ['', '.js', '.jsx']
		},
		module: {
			loaders: [
				{
					test: /\.js||.jsx$/,
					loader: 'babel-loader'
				},
				{
				  test: /\.css$/,
				  loader: 'style-loader!css-loader?localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
				},
			]
		},
	  postcss: function() {
	    return [autoprefixer, precss];
	  },
		plugins: [
			new webpack.webpack.ResolverPlugin([
				new webpack.webpack.ResolverPlugin.DirectoryDescriptionFilePlugin( "bower.json", ["main", ["main", "1"]] )
			])
		]
	}))
	.pipe(gulpif(args.minify === 'true', minifyJs()))
	.pipe(gulp.dest(settings.dest.js.dir));
});

gulp.task('jsCopy', function(){
	gulp.src(settings.watch.js.files)
	.pipe(gulpif(args.minify === 'true', minifyJs()))
	.pipe(gulp.dest(settings.dest.js.dir));
});

gulp.task('imgCopy', function(){
	gulp.src(settings.watch.img.files)
	.pipe(gulp.dest(settings.dest.img.dir));
});

gulp.task('fontCopy', function(){
	gulp.src(settings.watch.font.files)
	.pipe(gulp.dest(settings.dest.font.dir));
});

gulp.task('usemin', function() {
	gulp.src(settings.watch.html.files)
	.pipe(usemin({
		js: [gulpif(args.minify === 'true', minifyJs()), 'concat'],
		css: [gulpif(args.minify === 'true', minifyJs()), 'concat']
	}))
	.pipe(gulp.dest(settings.dest.html.dir));
});


gulp.task('watch', ['webpack', 'postcss',  'jsCopy', 'imgCopy', 'fontCopy', 'usemin'], function(){
	gulp.watch(settings.watch.css.files, ['webpack']);
	gulp.watch(settings.watch.es6.files, ['webpack']);
	gulp.watch(settings.watch.img.files, ['imgCopy']);
	gulp.watch(settings.watch.font.files, ['fontCopy']);
});

gulp.task('webserver', function() {
	connect.server({
		root: settings.dest.name,
		livereload: true,
		port: 8888
	});
});

gulp.task('livereload', function() {
	gulp.src(settings.dest.name + '/**/*.*')
	.pipe(watch(settings.dest.name + '/**/*.*'))
	.pipe(connect.reload());
});

gulp.task('default', ['watch', 'webserver', 'livereload']);
gulp.task('build', ['webpack', 'postcss', 'jsCopy', 'imgCopy', 'fontCopy', 'usemin']);
