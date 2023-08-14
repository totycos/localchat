import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.handlePosition.bind(this));
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
    fetch("/update_coordinates", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": Rails.csrfToken()
      },
      body: JSON.stringify({ latitude, longitude })
    });
  }
}
