import del from 'del';
import gulp from 'gulp';
import gpug from 'gulp-pug';
import ws from 'gulp-webserver';
import image from 'gulp-image';

const route = {
  pug: {
    src: 'src/*.pug',
    dest: 'build',
    watch: 'src/**/*.pug',
  },
  images: {
    src: 'src/img/*',
    dest: 'build/img',
  },
};

const pug = () =>
  gulp.src(route.pug.src).pipe(gpug()).pipe(gulp.dest(route.pug.dest));

const clean = () => del(['build']);

const webserver = () =>
  gulp.src('build').pipe(ws({ livereload: true, open: true }));

const watch = () => {
  gulp.watch(route.pug.watch, pug);
  gulp.watch(route.images.src, img);
};

const img = () =>
  gulp.src(route.images.src).pipe(image()).pipe(gulp.dest(route.images.dest));

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug]);

const postDev = gulp.parallel([webserver, watch]);

export const dev = gulp.series([prepare, assets, postDev]);
