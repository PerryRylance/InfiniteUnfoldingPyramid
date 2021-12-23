const gulp			= require('gulp');

const {createGulpEsbuild} = require('gulp-esbuild')
const gulpEsbuild = createGulpEsbuild({
	incremental: true, // enables the esbuild's incremental build
	piping: true,      // enables piping
})

let devBuild		= false;

gulp.task("js", function(done) {
	
	return gulp.src('./src/js/entry.js')
		.pipe(gulpEsbuild({
			outfile: 'bundle.js',
			bundle: true,
			minify: !devBuild,
			sourcemap: true,
			sourceRoot: "../../"/*,
			external: [
				"jquery"
			]*/
		}))
		.pipe(gulp.dest('./dist/js'));

});

gulp.task("js:watch", function(done) {

	gulp.watch(["./src/js/**/*.js"], gulp.series("js"));
	done();

});

gulp.task("default", gulp.series("js", "js:watch"));
gulp.task("dev", gulp.series(done => { 
	devBuild = true;
	done();
}, "js", "js:watch"));
