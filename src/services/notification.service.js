const app = require('express')();
const express = require('express');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { Map } = require('immutable');
let listeners = [];

const Initialize = (options) => {
    return new Promise((resolve, reject) => {
        http.listen(options.SOCKET_PORT, () => {
            console.log('Listening on port ', options.SOCKET_PORT);
            resolve(this);
        });
    });
};

const ReportProgress = (job, progress) => {
    const jobToSend =  Map(job).set('process', undefined);
    io.emit('progress', {
        job: jobToSend,
        progress: progress
    });
};

const ReportEnd = (job) => {
    const jobToSend =  Map(job).set('end', undefined);
    io.emit('end', {
        job: jobToSend,
    });
};

const ReportCancel = (job) => {
    const jobToSend =  Map(job).set('end', undefined);
    io.emit('end', {
        job: jobToSend,
    });
};

const ReportStart = (job) => {
    const jobToSend =  Map(job).set('start', undefined);
    io.emit('start', {
        job: jobToSend,
    });
};

app.use(express.static('public'));
/*
app.get('/', (req, res) => {
    console.log(__dirname);
    res.sendFile(__dirname + '/html/index.html');
});
*/

io.on('connection', (socket) => {
    console.log('Got a connection');
    addSocketListeners(socket);
});

const addSocketListeners = (socket) => {
    socket.on('cancel', (data) => {
        console.log(listeners);
        listeners.forEach((cb) => {
            console.log(cb);
            cb('cancel', data) });
    });
    socket.on('disconnect', () => {
        listeners.forEach((cb) => { cb('disconnect') });
    });

};

const AddListeners = (cb) => {
    listeners.push(cb);
};

module.exports = {
    Initialize: Initialize,
    ReportProgress: ReportProgress,
    ReportEnd: ReportEnd,
    ReportStart: ReportStart,
    ReportCancel: ReportCancel,
    AddListeners: AddListeners
};