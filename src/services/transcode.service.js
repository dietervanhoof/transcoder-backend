const log = require("../services/logger.service");
const fileUtils = require('../util/fileUtils');
const fileRecognizer = require('../util/fileRecognizer');
const Promise = require("bluebird");
const handbrake = require('handbrake-js');

const transcodeFile = function(config, sourcePath, destinationPath) {
    return new Promise((resolve, reject) => {
        if (fileRecognizer.is_essence(config, fileUtils.getFileName(sourcePath))) {
            log.info('Transcoding ' + sourcePath + ' to ' + destinationPath);
            resolve(handbrake.spawn(
                {
                    input: sourcePath,
                    output: destinationPath
                }));
        } else {
            reject('Refused file: ' + sourcePath);
        }
    });
};

module.exports = {
    transcodeFile: transcodeFile
};