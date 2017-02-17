/**
 * Created by ha on 16/02/2017.
 */

var markers = [];
var map;

function initAutocomplete() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 21.0, lng: 105.850},
        // center: {lat: 21.0787739 , lng: 105.8187461},
        zoom: 10,
        mapTypeId: 'roadmap'
    });

//     create search box and link it to the UI element
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var infowindow = new google.maps.InfoWindow();

//    Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        //    clear out the old markers
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        //    for each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {

            google.maps.event.addListener(place, 'click', function () {
                infowindow.setContent('aaaaa');
                infowindow.open(map, this);
            });

            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                address: place.formatted_address,
                position: place.geometry.location,
                place_id: place.place_id
            }));


            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);

        $('#btnSaveResult').removeAttr('class');
        $('#btnSaveResult').attr('class','btn btn-primary');
        $('#place_name_result').text(markers[0].title);
        $('#place_address_result').text(markers[0].address);

        console.log(markers[0]);
        console.log(markers[0].position);
    });
}

$('#btnSaveResult').click(function () {
    alert('aa');
});

$('#1').click(function () {

    // var map = new google.maps.Map(document.getElementById('map'), {
    //     center: {lat: 21.0, lng: 105.850},
    //     zoom: 10
    // });

    var infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

    service.getDetails({
        placeId: 'ChIJF7u7xvKqNTERZlxP8z7n0gs'
    }, function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            });
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                    'Place ID: ' + place.place_id + '<br>' +
                    place.formatted_address + '</div>');
                infowindow.open(map, this);
            });

            $('#btnSaveResult').attr('class','hidden');
            $('#place_name_result').text(place.name);
            $('#place_address_result').text(place.formatted_address);
        }
    });
});