import gulp from 'gulp';
import gpug from 'gulp-pug';

const route = {
  pug: {
    src: 'src/**/*.pug',
    dest: 'build',
  },
};

export const pug = () =>
  gulp.src(route.pug.src).pipe(gpug()).pipe(gulp.dest(route.pug.dest));

export const dev = gulp.series([pug]);
