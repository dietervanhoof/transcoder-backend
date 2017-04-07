const log = require("../services/logger.service");
const fileUtils = require('../util/fileUtils');
const Job = require('./../model/Job');
const uuidV4 = require('uuid/v4');


const Initialize = (options, notificationService) => {
    this.options = options;
    this.notificationService = notificationService;
    this.notificationService.AddListeners(processIncomingEvent);
    this.jobs = {};
};

const processIncomingEvent = (event, data) => {
    if (event === 'cancel') {
        console.log('Requested cancel for uid: ' + data);
        this.jobs[data].process.cancel();
    }
};

const addProcess = (processToAdd) => {
    const uuid = uuidV4();
    addEventHandlers(uuid, processToAdd);
    this.jobs[uuid] = new Job(processToAdd, uuid, fileUtils.getFileName(processToAdd.options.input), processToAdd.options.input);
};

const addEventHandlers = (uuid, runningProcess) => {
    runningProcess
        .on("error", (err) => handleError(uuid, runningProcess))
        .on("progress", (progress) => handleProgress(uuid, progress))
        .on("end", () => handleEnd(uuid, runningProcess))
        .on("cancelled", () => handleCancel(uuid));
};

const handleEnd = (uuid, processToAdd) => {
    log.success(fileUtils.getFileName(processToAdd.options.input) + ' successfully transcoded');
    this.notificationService.ReportEnd(this.jobs[uuid]);
    fileUtils.moveFile(processToAdd.options.input, fileUtils.createFullPath(this.options.ORIGINALS_FOLDER_NAME, fileUtils.getFileName(processToAdd.options.input)))
    //this.jobs.splice(this.jobs.indexOf(process), 1);
};

const handleCancel = (uuid) => {
    this.notificationService.ReportCancel(this.jobs[uuid]);
};

const handleProgress = (uuid, progress) => {
    this.notificationService.ReportProgress(this.jobs[uuid], progress);
};

const handleError = (uuid, process) => {
    this.notificationService.ReportEnd(this.jobs[uuid]);
    log.error(err);
    this.jobs.splice(this.jobs.indexOf(process), 1);
};

const getJobs = () => {
    return this.jobs;
};

const getJob = (uuid) => {
    return this.jobs[uuid];
};

module.exports = {
    addProcess: addProcess,
    Initialize: Initialize,
    getProcesses: getJobs,
    getJob: getJob,
    processIncomingEvent: processIncomingEvent
};