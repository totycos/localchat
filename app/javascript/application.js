// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"
import * as bootstrap from "bootstrap"

document.addEventListener("DOMContentLoaded", function() {
  const arrow = document.querySelector(".extend-messages-container-arrow");
  const messagesContainer = document.querySelector(".messages-container");
  let isExtended = false;

  arrow.addEventListener("click", function() {
    if (isExtended) {
      // Rétablir la hauteur par défaut avec une légère pause pour la transition
      messagesContainer.style.transition = "height 0.3s ease";
      messagesContainer.style.height = "calc(20vh)";
      arrow.classList.remove("rotated");
      setTimeout(() => {
        messagesContainer.style.transition = "";
      }, 300); // Attendez la fin de la transition pour supprimer la transition
    } else {
      // Étendre la hauteur à 100vh
      messagesContainer.style.transition = "height 0.3s ease";
      messagesContainer.style.height = "calc(100vh - 53px)";
      arrow.classList.add("rotated");
    }

    // Inverser l'état
    isExtended = !isExtended;
  });
});