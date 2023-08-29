import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["users"];

  connect() {
    console.log("ON EST DANS MAPBOX_CONTROLLER.JS !");
   
    let centerCoordinates = [2.3522, 48.8566]; // Coordonnées GPS de Paris
    let zoomLevel = 1;
    let currentUser = null;

    if (this.usersTarget) {
      const currentUserData = this.usersTarget.getAttribute('data-currentuser');
      const usersData = this.usersTarget.getAttribute('data-users');
      currentUser = JSON.parse(currentUserData);
      console.log('Current User:', currentUser);

      if (currentUser.longitude && currentUser.latitude) {
        centerCoordinates = [currentUser.longitude, currentUser.latitude];
        zoomLevel = 13;
      }

      console.log('Users Data:', usersData);

      const usersArray = JSON.parse(usersData);

      if (Array.isArray(usersArray)) {
        const mapElement = document.getElementById('map');
        mapboxgl.accessToken = mapElement.dataset.mapboxApiKey;
        const map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v12',
          center: centerCoordinates,
          zoom: zoomLevel,
        });

        const userMarkers = []; // Array to store user markers
        
        // Create and add the marker for the current user first
        const currentUserMarker = new mapboxgl.Marker({ color: 'pink' })
          .setLngLat([currentUser.longitude, currentUser.latitude])
          .addTo(map)
          .setPopup(new mapboxgl.Popup().setHTML(
            '<div class="map-popup"> <a href=/users/'+ currentUser.id + 'profile> <p class="popup-pseudo">' + currentUser.pseudo + '</p> <p class="popup-feeling">' + currentUser.feeling + '</p></a></div>'
          )); // Set popup content to user's pseudo
          currentUserMarker._element.id = "current-user-marker";

        userMarkers.push(currentUserMarker);

        // Create and add markers for other users
        usersArray.forEach(user => {
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
  }
}
