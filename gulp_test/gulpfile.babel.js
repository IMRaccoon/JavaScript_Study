import del from 'del';
import gulp from 'gulp';
import gpug from 'gulp-pug';
import ws from 'gulp-webserver';
import image from 'gulp-image';
import sass from 'gulp-sass';

sass.compiler = require('node-sass');

const route = {
  pug: {
    watch: 'src/**/*.pug',
    src: 'src/*.pug',
    dest: 'build',
  },
  img: {
    src: 'src/img/*',
    dest: 'build/img',
  },
  scss: {
    watch: 'src/scss/**/*.scss',
    src: 'src/scss/style.scss',
    dest: 'build/css',
  },
};

const pug = () =>
  gulp.src(route.pug.src).pipe(gpug()).pipe(gulp.dest(route.pug.dest));

const clean = () => del(['build']);

const webserver = () => gulp.src('build').pipe(ws({ livereload: true }));

const img = () =>
  gulp.src(route.img.src).pipe(image()).pipe(gulp.dest(route.img.dest));

const styles = () =>
  gulp
    .src(route.scss.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(route.scss.dest));

const watch = () => {
  gulp.watch(route.pug.watch, pug);
  gulp.watch(route.img.src, img);
  gulp.watch(route.scss.watch, styles);
};

const prepare = gulp.series([clean, img]);

const assets = gulp.parallel([styles, pug]);

const postDev = gulp.parallel([webserver, watch]);

export const dev = gulp.series([prepare, assets, postDev]);
