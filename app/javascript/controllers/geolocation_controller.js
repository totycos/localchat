import { Controller } from "@hotwired/stimulus"

const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
export default class GeolocationController extends Controller {

  connect() {

    console.log("Stimulus connecté");
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        this.handlePosition.bind(this),
        this.handleError.bind(this)
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  handlePosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);

    // Envoi des nouvelles coordonnées au serveur via une requête AJAX
    const updateUrl = `/messages/update_user_location`;
    fetch(updateUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken
      },
      body: JSON.stringify({
        location: {
          latitude: latitude,
          longitude: longitude
        }
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log("Coordonnées mises à jour avec succès.", data);
      })
      .catch(error => {
        console.error("Erreur lors de la mise à jour des coordonnées.", error);
      });
  }

  handleError(error) {
    console.error("Erreur de géolocalisation:", error.message);
  }
}
