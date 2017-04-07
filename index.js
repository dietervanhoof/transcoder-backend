require('app-module-path').addPath(__dirname);
const chokidar = require("chokidar");
const Promise = require("bluebird");
const log = require("./src/services/logger.service.js");
const transcodeService = require('./src/services/transcode.service.js');
const fileUtils = require('./src/util/fileUtils');
const options = require("./src/util/cmdargs").parseArguments();
const fs = require("fs");

const JobService = require('./src/services/job.service.js');
const NotificationService = require('./src/services/notification.service.js');

var gulp = require("gulp");
var babel = require("gulp-babel");

gulp.task("default", function () {
    return gulp.src("src/app.js")
        .pipe(babel())
        .pipe(gulp.dest("dist"));
});

const startWatching = () => {
    return new Promise((resolve, reject) => {
        log.success('Watching folder: ' + options.folder);
        chokidar.watch(options.folder,
            {
                ignored: (path) => {
                    // Ignore sub-folders
                    return RegExp(options.folder + '.+/').test(path)
                },
                awaitWriteFinish: {
                    stabilityThreshold: 2000,
                    pollInterval: 100
                },
                usePolling: true
            })
            .on('add', (path) => {
                transcodeService.transcodeFile(options, path, fileUtils.createFullPath(options.TRANSCODED_FOLDER_NAME, fileUtils.getFileName(path)))
                    .then((processToAdd) => { JobService.addProcess(processToAdd) })
                    .then(() => { console.log(Object.keys(JobService.getProcesses()).length + ' job(s) in queue right now') })
                    //.then(() => { fileUtils.moveFile(path, fileUtils.createFullPath(options.ORIGINALS_FOLDER_NAME, fileUtils.getFileName(path)))})
                    .catch((err) => {
                        log.warn(err);
                    });

            });
            resolve();
    });
};

NotificationService.Initialize(options)
    .then(() => { return NotificationService })
    .then((notificationService) => JobService.Initialize(options, notificationService))
    .then(startWatching)
    .catch( (err) => {
        log.error(err);
        process.exit(1);
    });
