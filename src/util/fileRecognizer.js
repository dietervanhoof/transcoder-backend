const path = require("path");

const is_essence = function(config, file_name) {
    return match_types(path.extname(file_name), config['ESSENCE_FILE_TYPE'])
};

const match_types = function(extension, file_types) {
    return file_types.some((filetype) => {
        if (filetype.toLowerCase() == extension.toLowerCase()) {
            return true;
        } else {
            return false;
        }
    });
};

module.exports = {
    is_essence: is_essence
};
