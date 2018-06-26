var gulp = require("gulp");
var flatten = require("gulp-flatten");
var concat = require("gulp-concat");
var del = require("del");
var distFolder = "dist";

gulp.task("clean", function() {
    return del(distFolder);
});

gulp.task("prepare", ["clean"], function() {
    gulp.src([
        "./dropdown/constants/dropdown-mode.js",
        "./dropdown/shared/child-element.js",
        "./dropdown/input/input.js",
        "./dropdown/dropdown.js",
        "./index.js"
    ])
        .pipe(concat("dropdown.js"))
        .pipe(flatten())
        .pipe(gulp.dest(distFolder));

    gulp.src(["./demo/favicon.ico", "./demo/index.css", "./demo/index.html"])
        .pipe(flatten())
        .pipe(gulp.dest(distFolder));

    gulp.src(["./dropdown/dropdown.css", "./dropdown/input/input.css"])
        .pipe(concat("dropdown.css"))
        .pipe(gulp.dest(distFolder));

    gulp.src(["./dropdown/input/down-arrow.svg"]).pipe(gulp.dest(distFolder));
});

gulp.task("prepare:watch", function() {
    return gulp.watch(["./demo/**/*.html", "./dropdown/**/*.js", "/dropdown/**/*.css"], ["prepare"]);
});

gulp.task("development", ["prepare"]);
