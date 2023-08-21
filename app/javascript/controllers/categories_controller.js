import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="categories"
export default class extends Controller {
  static targets = ["message"];

  connect() {
    this.updateMessages();
  }

  toggleCategory(event) {
    this.updateMessages();
  }

  updateMessages() {
    console.log("updateMessages is working");
    const categoryCheckboxes = document.querySelectorAll('[data-action="categories#toggleCategory"]');
    console.log(categoryCheckboxes)
    const selectedCategories = Array.from(categoryCheckboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value);
      console.log(selectedCategories);
      console.log(this.messageTargets);
    this.messageTargets.forEach(message => {
      console.log("on est dans la boucle");
      const messageCategory = message.dataset.category;
      console.log(messageCategory);
      if (selectedCategories.length === 0 || selectedCategories.includes(messageCategory)) {
        message.classList.remove("hidden");
      } else {
        message.classList.add("hidden");
      }
    });
  }
}
