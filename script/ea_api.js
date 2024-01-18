function get_polygon(id, severityLevel){        
    fetch(`https://environment.data.gov.uk/flood-monitoring/id/floodAreas/${id}/polygon`)
    .then(response => response.json())
    .then(data => {
        // Get the coordinates of the polygon.
        var coordinates = data.features[0].geometry.coordinates[0][0];
        // Convert the coordinates to Cesium.Cartesian3 instances.
        var cesiumCoordinates = coordinates.map(coord => Cesium.Cartesian3.fromDegrees(coord[0], coord[1]));
        // Create a Cesium.PolygonGeometry instance.
        var polygonGeometry = new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(cesiumCoordinates)
        });
        var color;
        if (severityLevel === 3) {
            color = Cesium.Color.fromCssColorString('#f18702').withAlpha(0.3);
        } else if (severityLevel === 2) {
            color = Cesium.Color.RED.withAlpha(0.3);
        } else if (severityLevel === 1) {
            color = Cesium.Color.RED.withAlpha(0.85); // adjust the alpha value as needed
        } else {
            color = Cesium.Color.GREEN.withAlpha(0.3);
        }
        var geometryInstance = new Cesium.GeometryInstance({
            geometry: polygonGeometry,
            id: id,
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(color),
            }
        });
        // Add the geometry instance to the viewer's primitives
        viewer.scene.primitives.add(new Cesium.GroundPrimitive({
            geometryInstances: geometryInstance,
            appearance: new Cesium.PerInstanceColorAppearance(),
        }));
    });
}
function getFloodWarning(){
    fetch('https://environment.data.gov.uk/flood-monitoring/id/floods')
            .then(response => response.json())
            .then(data => {
                // Get the floodAreaID from the data
                data.items.forEach(function(item) { // Loop through the JSON data
                    let id = item.floodAreaID; // Populate the map with all the flood risks.
                    let severityLevel = item.severityLevel;            
                    get_polygon(id, severityLevel); 
                });
            });
}