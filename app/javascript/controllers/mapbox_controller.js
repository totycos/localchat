import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["users"];

  connect() {
    console.log("ON EST DANS MAPBOX_CONTROLLER.JS !");
    const currentUser = JSON.parse(this.usersTarget.getAttribute('data-currentuser'));
    const usersData = JSON.parse(this.usersTarget.getAttribute('data-users'));

    console.log('Current User:', currentUser);
    console.log('Users Data:', usersData);

    const mapElement = document.getElementById('map');
    mapboxgl.accessToken = mapElement.dataset.mapboxApiKey;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [currentUser.longitude, currentUser.latitude],
      zoom: 20,
    });

    const userMarkers = []; // Array to store user markers
    
    // Create and add the marker for the current user first
    const currentUserMarker = new mapboxgl.Marker({ color: 'pink' })
      .setLngLat([currentUser.longitude, currentUser.latitude])
      .addTo(map)
      .setPopup(new mapboxgl.Popup().setHTML(
        '<div class="map-popup"> <a href=/users/'+ currentUser.id + '> <p class="popup-pseudo">' + currentUser.pseudo + '</p> <p class="popup-feeling">' + currentUser.feeling + '</p></a></div>'
      )); // Set popup content to user's pseudo

    userMarkers.push(currentUserMarker);

    // Create and add markers for other users
    usersData.forEach(user => {
      if (user.id !== currentUser.id) {
        const marker = new mapboxgl.Marker({ color: 'green' })
          .setLngLat([user.longitude, user.latitude])
          .addTo(map)
          .setPopup(new mapboxgl.Popup().setHTML(
            '<div class="map-popup>" <a href=/users/'+ user.id + '> <p class="popup-pseudo">' + user.pseudo + '</p> <p class="popup-feeling">' + user.feeling + '</p></a></div>'
          )); // Set popup content

        userMarkers.push(marker);
      }
    });
  }
}
