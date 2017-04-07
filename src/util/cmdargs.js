const util = require("util");
const required_arguments = [
    "ESSENCE_FILE_TYPE",
    "TRANSCODED_FOLDER_NAME",
    "ORIGINALS_FOLDER_NAME",
    "FOLDER_TO_WATCH",
    "SOCKET_PORT"
];

const parseArguments = () => {
    const argv = require('minimist')(process.argv.slice(2));
    required_arguments.forEach((argument) => {
        if (!argv[argument]) throw ('Argument ' + argument + ' was missing but is required.');
    });

    // Derived arguments
    argv.folder = argv.FOLDER_TO_WATCH;
    argv.ESSENCE_FILE_TYPE = argv.ESSENCE_FILE_TYPE.split(',');
    if (!argv.RETRY_PACKAGE_INTERVAL) {
        argv.RETRY_PACKAGE_INTERVAL = 15000
    }
    return argv;
};

module.exports = {
    parseArguments: parseArguments
};