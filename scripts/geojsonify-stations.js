'use strict';

//File to convert trains.json -> cleanTrains.geojson
var _ = require('underscore');
var jsonfile = require('jsonfile');
var trainStationsFile = '../data/stations.geojson';
var trainStations = jsonfile.readFileSync(trainStationsFile);
var stationsAndGeometry = {};

trainStations.features.forEach(function (station) {
    if (_.keys(stationsAndGeometry).indexOf(station.properties.ref) === -1) {
        //Eliminate duplicates like 'RGS:1;2' and 'RGS:3;4' for now.
        if (station.properties.ref.indexOf(':') === -1) {
            stationsAndGeometry[station.properties.ref] = station.geometry;
        } else {
            stationsAndGeometry[station.properties.ref.split(':')[0]] = station.geometry;
        }
    }
});

var fc = {'type': 'FeatureCollection',
          'features': []};

_.keys(stationsAndGeometry).forEach(function (station) {
    var feature = {
        'type': 'Feature',
        'properties': {}
    };

    feature.properties.id = station;
    feature.properties.geometry = stationsAndGeometry[station];
    fc.features.push(feature);
});

console.log(JSON.stringify(fc, null, 2));
