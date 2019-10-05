#!/usr/bin/env node

"use strict";

var server_url = 'ws://livetiming.sms-timing.com:10001/';

var WebSocket = require('ws');
var ws = new WebSocket( server_url, {
    protocolVersion: 13
});

var id_pulkovo = '586';

ws.onopen = function( evt ) {
    if (typeof evt !== 'undefined') {
        try {
            ws.send("START Karting@" + id_pulkovo);
        } catch (e) {
            console.error(e);
        }
    }
};

ws.on('message', function(data, flags) {
    if (data !== '{}') {
        var heat = new Heat(JSON.parse(data));
        console.log(heat);
    }
});

ws.on('error', function(e) {
    console.error(e);
});



function Heat(jsonData) {
    // "N" = HeatName
    var _heatName;
    this._heatName = jsonData["N"];
    Heat.prototype.setHeatName = function (val) { this._heatName = val; }
    Heat.prototype.getHeatName = function () { return this._heatName; }

    // "S" = State
    //      0 = not started
    //      1 = running
    //      2 = pauzed
    //      3 = stopped
    //      4 = finished
    //      5 = next heat
    var _heatState;
    this._heatState = jsonData["S"];
    Heat.prototype.setHeatState = function (val) { this._heatState = val; }
    Heat.prototype.getHeatState = function () { return this._heatState; }

    // "E" = EndCondition
    //      0 = the heat needs to be finished manual
    //      1 = the heat finishes after X time
    //      2 = the heat finishes after X laps
    //      3 = the heat finished after X time or X laps. Depends on wich one is first
    var _endCondition;
    this._endCondition = jsonData["E"];
    Heat.prototype.setEndCondition = function (val) { this._endCondition = val; }
    Heat.prototype.getEndCondition = function () { return this._endCondition; }

    // "R" = RaceMode
    //      0 = most laps wins
    //      1 = the best laptime is the winner
    //      2 = the best average time is the winner
    var _raceMode;
    this._raceMode = jsonData["R"];
    Heat.prototype.setRaceMode = function (val) { this._raceMode = val; }
    Heat.prototype.getRaceMode = function () { return this._raceMode; }

    // "D" = Drivers [array]
    var _driversArray;
    this._driversArray = jsonData["D"];
    var _drivers;
    this._drivers = [];
    for (var i = 0; i < this._driversArray.length; i++) {
        this._drivers[i] = new Driver(this._driversArray[i]);
    }
    Heat.prototype.setDrivers = function (val) { this._driversArray = val; }
    Heat.prototype.getDrivers = function () { return this._driversArray; }
    Heat.prototype.getDriverAtIndex = function (index) { return this._drivers[index]; }

    // "C" = Counter (in milliseconds)
    var _timeLeft;
    this._timeLeft = jsonData["C"];
    Heat.prototype.setTimeLeft = function (val) { this._timeLeft = val; }
    Heat.prototype.getTimeLeft = function () { return this._timeLeft; }

    // "CS" = ClockStarted
    //      0 = not started
    //      1 = started
    var _counterStarted;
    this._counterStarted = jsonData["CS"];
    Heat.prototype.setCounterStarted = function (val) { this._counterStarted = val; }
    Heat.prototype.getCounterStarted = function () { return this._counterStarted; }

    // "L" = RemainingLaps
    var _remainingLaps;
    this._remainingLaps = jsonData["L"];
    Heat.prototype.setRemainingLaps = function (val) { this._remainingLaps = val; }
    Heat.prototype.getRemainingLaps = function () { return this._remainingLaps; }

    // "T" = ActualHeatStart
    var _actualHeatStart;
    this._actualHeatStart = jsonData["T"];
    Heat.prototype.setActualHeatStart = function (val) { this._actualHeatStart = val; }
    Heat.prototype.getActualHeatStart = function () { return this._actualHeatStart; }
}

function Driver(jsonDriver) {
    // "D" = DriverID
    var _identifier;
    this._identifier = jsonDriver["D"];
    Driver.prototype.setIdentifier = function (val) { this._identifier = val; }
    Driver.prototype.getIdentifier = function () { return this._identifier; }

    // "M" = WebMemberID
    var _webMemberID;
    this._webMemberID = jsonDriver["M"];
    Driver.prototype.setWebMemberID = function (val) { this._webMemberID = val; }
    Driver.prototype.getWebMemberID = function () { return this._webMemberID; }

    // "N" = DriverName
    var _name;
    this._name = jsonDriver["N"];
    Driver.prototype.setDriverName = function (val) { this._name = val; }
    Driver.prototype.getDriverName = function () { return this._name; }

    // "K" = KartNumber
    var _kartNumber;
    this._kartNumber = jsonDriver["K"];
    Driver.prototype.setKartNumber = function (val) { this._kartNumber = val; }
    Driver.prototype.getKartNumber = function () { return this._kartNumber; }

    // "P" = Position
    var _position;
    this._position = jsonDriver["P"];
    Driver.prototype.setPosition = function (val) { this._position = val; }
    Driver.prototype.getPosition = function () { return this._position; }

    // "L" = Laps
    var _laps;
    this._laps = jsonDriver["L"];
    Driver.prototype.setLap = function (val) { this._laps = val; }
    Driver.prototype.getLaps = function () { return this._laps; }

    // "T" = LastLapTimeMS
    var _lastLapTime;
    this._lastLapTime = jsonDriver["T"];
    Driver.prototype.setLapTime = function (val) { this._lastLapTime = val; }
    Driver.prototype.getLapTime = function () { return this._lastLapTime; }

    // "A" = AvarageLapTimeMS
    var _averageLapTime;
    this._averageLapTime = jsonDriver["A"];
    Driver.prototype.setAvarageLapTime = function (val) { this._averageLapTime = val; }
    Driver.prototype.getAvarageLapTime = function () { return this._averageLapTime; }

    // "B" = BestLapTimeMS
    var _bestLapTime;
    this._bestLapTime = jsonDriver["B"];
    Driver.prototype.setBestLapTime = function (val) { this._bestLapTime = val; }
    Driver.prototype.getBestLapTime = function () { return this._bestLapTime; }

    // "G" = gap
    var _gapTime;
    this._gapTime = jsonDriver["G"];
    Driver.prototype.setGapTime = function (val) { this._gapTime = val; }
    Driver.prototype.getGapTime = function () { return this._gapTime; }

    // "LP" = LastPassing
    //      0 = not the last passing
    //      1 = last passing
    var _isLastPassing;
    this._isLastPassing = jsonDriver["LP"];
    Driver.prototype.setLastPassing = function (val) { this._isLastPassing = val; }
    Driver.prototype.getLastPassing = function () { return this._isLastPassing; }

    // "R" = LastRecord
    var _lastRecord;
    this._lastRecord = jsonDriver["R"];
    Driver.prototype.setLastRecord = function (val) { this._lastRecord = val; }
    Driver.prototype.getLastRecord = function () { return this._lastRecord; }
}
