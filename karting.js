#!/usr/bin/env node
//https://nodejs.org/en/
//https://github.com/websockets/ws
//https://github.com/mscdex/node-mariasql

"use strict";

var WebSocket = require("ws");
var Client = require("mariasql");

var server_url = 'ws://livetiming.sms-timing.com:10001/';
var webside_id = '';

if (webside_id == ''){
    console.log("Error: set id")
    return 0 ;
}

var ws = new WebSocket( server_url, {
                       protocolVersion: 13
                       });

var Client = require('mariasql');
var c = new Client({
                   host: '127.0.0.1',
                   user: 'kartuser',
                   password: '160815',
                   db: 'Kartarena'
});



ws.onopen = function( evt ) {
    if (typeof evt !== 'undefined') {
        try {
            ws.send("START Karting@" + webside_id);
        } catch (e) {
            console.error(e);
        }
    }
};

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}

var old_time = [];

ws.on('message', function(data, flags) {
      
      
      if (data !== '{}') {
      var heat = new Heat(JSON.parse(data));
      
      
      var i = 0;
      
      if (heat._counterStarted == '1'){
      for (i = 0; i < heat._driversArray.length; i++) {
      if (old_time[i] !== heat._drivers[i]._lastLapTime){
      
      c.query("SHOW TABLE STATUS LIKE `:newtable`", { newtable: heat._drivers[i]._name }, function(err, rows){
              });
      var err;
      c.query("SHOW CREATE TABLE `:newtable`", { newtable: heat._drivers[i]._name }, function(err, rows) {
              
              
              });
      
      console.log(" pos: " + heat._drivers[i]._position + " best: " + heat._drivers[i]._bestLapTime + " kartNR.: " + heat._drivers[i]._kartNumber + " last: " + heat._drivers[i]._lastLapTime + " @ " + heat._drivers[i]._name );
      
      c.query("CREATE TABLE `:newtable` (`_heatName` text, `_heatState` int(11) DEFAULT NULL, `_endCondition` int(11) DEFAULT NULL,  `_raceMode` int(11) DEFAULT NULL,  `_identifire` int(11) DEFAULT NULL,  `_webMemberID` int(11) DEFAULT NULL,  `_name` text,  `_kartNumber` int(11) DEFAULT NULL,  `_position` int(11) DEFAULT NULL,  `_laps` int(11) DEFAULT NULL,  `_lastLapTime` int(11) DEFAULT NULL,  `_averageLapTime` int(11) DEFAULT NULL,  `_bestLapTime` int(11) DEFAULT NULL,  `_gapTime` int(11) DEFAULT NULL,  `_isLastParsing` int(11) DEFAULT NULL,  `_lastRecord` int(11) DEFAULT NULL,  `_timeLeft` int(11) DEFAULT NULL,  `_counterStarted` int(11) DEFAULT NULL,  `_remainingLaps` int(11) DEFAULT NULL,  `_actualHeatStart` text) ENGINE=InnoDB DEFAULT CHARSET=utf8;", { newtable: heat._drivers[i]._name}, function(err, rows) {
              if (err)
              console.log(err);
              });
      
      c.query("INSERT INTO `:newtable`(`_heatName`,`_heatState`, `_endCondition`,`_raceMode`, `_identifire`, `_webMemberID`, `_name`, `_kartNumber`, `_position`, `_laps`, `_lastLapTime`, `_averageLapTime`, `_bestLapTime`, `_gapTime`, `_isLastParsing`, `_lastRecord`, `_timeLeft`, `_counterStarted`, `_remainingLaps`, `_actualHeatStart`)VALUES ( :heatName, :heatState, :endCondition, :raceMode, :identifire, :webMemberID, :name, :kartNumber, :position, :laps, :lastLapTime, :averageLapTime, :bestLapTime, :gapTime, :isLastParsing, :lastRecord, :timeLeft, :counterStarted, :remainingLaps, :actualHeartStart);", { newtable: heat._drivers[i]._name, heatName: heat._heatName, heatState: heat._heatState, endCondition: heat._endCondition, raceMode: heat._raceMode, identifire: heat._drivers[i]._identifier, webMemberID: heat._drivers[i]._webMemberID, name: heat._drivers[i]._name, kartNumber: heat._drivers[i]._kartNumber, position: heat._drivers[i]._position, laps: heat._drivers[i]._laps, lastLapTime: heat._drivers[i]._lastLapTime, averageLapTime: heat._drivers[i]._averageLapTime, bestLapTime: heat._drivers[i]._bestLapTime, gapTime: heat._drivers[i]._gapTime, isLastParsing: heat._drivers[i]._isLastPassing, lastRecord: heat._drivers[i]._lastRecord, timeLeft: heat._timeLeft, counterStarted: heat._counterStarted, remainingLaps: heat._remainingLaps, actualHeartStart: timeConverter(heat._actualHeatStart) }, function(err, rows) {
              if (err)
              console.log(err);
              });
      
      
      }
      }
      }
      for (var j = 0; j < heat._driversArray.length; j++){
      old_time[j] = heat._drivers[j]._lastLapTime;
      
      }
      }
      });

c.end();

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
