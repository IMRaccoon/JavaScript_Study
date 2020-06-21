import gulp from 'gulp';
import gpug from 'gulp-pug';
import del from 'del';

const route = {
  pug: {
    src: 'src/*.pug',
    dest: 'build',
  },
};

const pug = () =>
  gulp.src(route.pug.src).pipe(gpug()).pipe(gulp.dest(route.pug.dest));

const clean = () => del(['build']);

const prepare = gulp.series([clean]);

const assets = gulp.series([pug]);

export const dev = gulp.series([prepare, assets]);
