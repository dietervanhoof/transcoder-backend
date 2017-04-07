#!/usr/bin/env bash
nodemon index.js \
	--ESSENCE_FILE_TYPE .mxf,.mkv,.mp4,.mov \
	--TRANSCODED_FOLDER_NAME /Users/dieter/watch_this_folder/transcoded \
	--ORIGINALS_FOLDER_NAME /Users/dieter/watch_this_folder/originals \
	--SOCKET_PORT 8080 \
	--FOLDER_TO_WATCH /Users/dieter/watch_this_folder