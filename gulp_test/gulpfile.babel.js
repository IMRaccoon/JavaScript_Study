import gulp from 'gulp';
import gpug from 'gulp-pug';
import del from 'del';
import ws from 'gulp-webserver';

const route = {
  pug: {
    src: 'src/*.pug',
    dest: 'build',
    watch: 'src/**/*.pug',
  },
};

const pug = () =>
  gulp.src(route.pug.src).pipe(gpug()).pipe(gulp.dest(route.pug.dest));

const clean = () => del(['build']);

const webserver = () =>
  gulp.src('build').pipe(ws({ livereload: true, open: true }));

const watch = () => {
  gulp.watch(route.pug.watch, pug);
};

const prepare = gulp.series([clean]);

const assets = gulp.series([pug]);

const postDev = gulp.parallel([webserver, watch]);

export const dev = gulp.series([prepare, assets, postDev]);
