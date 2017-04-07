
function Job (handbrakeProcess, uuid, filename, fullPath) {
    return {
                process: handbrakeProcess,
                uuid: uuid,
                filename: filename,
                fullPath: fullPath
            }
};

module.exports = Job;