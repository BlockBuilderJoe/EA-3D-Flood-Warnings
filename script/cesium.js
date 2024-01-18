function timeset() {
    var date = new Cesium.JulianDate();
    Cesium.JulianDate.fromIso8601('2022-01-01T12:00:00Z', date);
    viewer.clock.currentTime = date;    
}