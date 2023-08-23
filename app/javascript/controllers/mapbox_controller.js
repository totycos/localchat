import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="mapbox"
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
      container: 'map', // Container ID
      style: 'mapbox://styles/mapbox/streets-v12', // Map style to use
      center: [currentUser.longitude, currentUser.latitude], // Starting position [lng, lat]
      zoom: 13, // Starting zoom level
    });

    const userMarkers = []; // Array to store user markers
    
    // Create and add the marker for the current user first
    const currentUserMarker = new mapboxgl.Marker({ color: 'pink' })
      .setLngLat([currentUser.longitude, currentUser.latitude])
      .addTo(map);

    userMarkers.push(currentUserMarker);

    // Create and add markers for other users
    usersData.forEach(user => {
      if (user.id !== currentUser.id) {
        const marker = new mapboxgl.Marker({ color: 'green' })
          .setLngLat([user.longitude, user.latitude])
          .addTo(map);

        userMarkers.push(marker);
      }
    });
  }
}

