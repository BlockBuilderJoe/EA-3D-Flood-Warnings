//google api script
// This controls the google search bar and then zooms to the location based on input or autocomplete.
let manualsearchOccured = false;
async function initAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(
        document.getElementById("pacViewPlace"),
        {
            fields: [
            "geometry",
            "name",
            
            ],
            componentRestrictions: { country: "uk" } 
        }
    );
    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
            var searchBarText = document.getElementById('pacViewPlace').value;
            console.log(searchBarText);
            manualGoogleSearch(searchBarText);
        }
        else {
            zoomToViewport(place.geometry.viewport);
        }
        // Temporarily disable the Autocomplete to close the dropdown
        document.getElementById('pacViewPlace').setAttribute('autocomplete', 'off');
        setTimeout(() => {
            document.getElementById('pacViewPlace').setAttribute('autocomplete', 'on');
        }, 1);
    });
}
function manualGoogleSearch(place_string) {
    // Add fetch request here
    fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': 'AIzaSyCMJmYqeQ78nkknErT_v7H_Zt1w1NhGKxM',
            'X-Goog-FieldMask': 'places.viewport'
        },
        body: JSON.stringify({
            textQuery: place_string,
            languageCode: 'en',
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.places && data.places.length > 0 && data.places[0].viewport) {
            var viewport = data.places[0].viewport;
            var bounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(viewport.low.latitude, viewport.low.longitude), // southwest corner
                new google.maps.LatLng(viewport.high.latitude, viewport.high.longitude) // northeast corner
            );
            zoomToViewport(bounds);
        } else {
            console.error('Error: No viewport data received from Places API');
        }
    })
    .catch(error => console.error('Error:', error));
}


