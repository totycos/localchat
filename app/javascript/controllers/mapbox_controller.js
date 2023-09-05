import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["users"];

  connect() {
    console.log("ON EST DANS MAPBOX_CONTROLLER.JS !");
   
    /* ################################################################ */
    /* #### SET VARIABLES POUR LA CARTE QUAND PAS DE USER CONNECTÉ #### */
    /* ################################################################ */
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
        /* ################################################################ */
        /* ########################### SET MAP ############################ */
        /* ################################################################ */
        const mapElement = document.getElementById('map');
        mapboxgl.accessToken = mapElement.dataset.mapboxApiKey;
        const map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/alex56545/clm53xnus00un01quf5sa2g3y',
          center: centerCoordinates,
          zoom: zoomLevel,
        });

       // map.addControl(new mapboxgl.NavigationControl());

        /* ################################################################ */
        /* ######################### SET MARKERS ########################## */
        /* ################################################################ */

        // Création d'un nouveau type de Marker permettant l'event onClick
        class ClickableMarker extends mapboxgl.Marker {
          // new method onClick, sets _handleClick to a function you pass in
          onClick(handleClick) {
            this._handleClick = handleClick;
            return this;
          }

          // the existing _onMapClick was there to trigger a popup
          // but we are hijacking it to run a function we define
          _onMapClick(e) {
            const targetElement = e.originalEvent.target;
            const element = this._element;

            if (this._handleClick && (targetElement === element || element.contains((targetElement)))) {
              this._handleClick();
            }
          }
        };
        
        // Check if a current-user-marker already exist and remove it
        const currentUserMarkerPresent = document.getElementById("current-user-marker"); 
        console.log(`currentUserMarkerPresent = ${currentUserMarkerPresent}`);
        if (currentUserMarkerPresent) {
          currentUserMarkerPresent.remove(); 
         }

        // Create and add the marker for the current user first with our custom Marker
        const currentUserMarker = new ClickableMarker()
            .setLngLat([currentUser.longitude, currentUser.latitude])
            .addTo(map)
            
        currentUserMarker._element.id = "current-user-marker"; // id defini pour changer couleur du current user marker

        //userMarkers.push(currentUserMarker);

        // Check if a user-marker already exist and remove it
        const userMarkerPresent = document.querySelectorAll(".user-marker");
        if (userMarkerPresent.length > 0) {
          userMarkerPresent.forEach((marker) => {
            marker.remove();
          });
        }

        // Create and add markers for other users
        let userMarkers = {}; // Array to store user markers
        usersArray.forEach(user => {
          if (user.id !== currentUser.id) {
            // const marker = new mapboxgl.Marker({ color: 'green' }) // classic marker
            const userMarker = new ClickableMarker()
              .setLngLat([user.longitude, user.latitude])
              .addTo(map)
            
            userMarker._element.classList.add("user-marker"); // id defini pour changer couleur des user marker

            userMarkers[user.id] = userMarker;
          }
        });
       
        

        /* ################################################################ */
        /* ################## SET SURVOL POPUPS (PSEUDO) ################## */
        /* ################################################################ */

        /* ############ CURRENT USER ############# */

        // Créez le contenu du popup pour le survol
        const currentUserHoverPopupContent = '<div class="current-user-popup-content">' +
        '<a href=/users/' + currentUser.id + 'profile>' +
        '<p class="popup-pseudo">' + currentUser.pseudo + '</p>' +
        '<p class="popup-feeling">' + currentUser.feeling + '</p>' +
        '</a>' +
        '</div>';

        // Création du popup
        const currentUserHoverPopup = new mapboxgl.Popup()
          .setLngLat([currentUser.longitude, currentUser.latitude])
          .setHTML(currentUserHoverPopupContent)

        // Affichage du popup au survol
        currentUserMarker._element.addEventListener('mouseenter', () => {
          currentUserHoverPopup.addTo(map);
          currentUserHoverPopup.getElement().id = 'current-user-popup';

          let currentUserPopup = document.querySelector('#current-user-popup');
          let currentUserPopupTip = document.querySelector('#current-user-popup > .mapboxgl-popup-tip');
          let currentUserPopupClose = document.querySelector('#current-user-popup > div.mapboxgl-popup-content > button');
          
          currentUserPopup.style.marginTop = '-35px';
          currentUserPopupTip.style.visibility = 'hidden';
          currentUserPopupTip.style.display = 'none';
          currentUserPopupClose.style.visibility = 'hidden';
          currentUserPopupClose.style.display = 'none';
        });
        
        // Suppression du popup a la sortie du survol
        currentUserMarker._element.addEventListener('mouseleave', () => {
          currentUserHoverPopup.remove();
          });

        /* ################# USER ################# */

        usersArray.forEach(user => {
          if (user.id !== currentUser.id) {
            const userMarker = userMarkers[user.id];

             // Créez le contenu du popup pour le survol
            const userHoverPopupContent = '<div class="user-popup-content">' +
            '<a href=/users/' + user.id + 'profile>' +
            '<p class="popup-pseudo">' + user.pseudo + '</p>' +
            '<p class="popup-feeling">' + user.feeling + '</p>' +
            '</a>' +
            '</div>';

            // Création du popup
            const userHoverPopup = new mapboxgl.Popup()
              .setLngLat([user.longitude, user.latitude])
              .setHTML(userHoverPopupContent)

            // Affichage du popup au survol
            userMarker._element.addEventListener('mouseenter', () => {
              userHoverPopup.addTo(map);
              userHoverPopup.getElement().id = 'user-popup';

              let userPopup = document.querySelector('#user-popup');
              let userPopupTip = document.querySelector('#user-popup > .mapboxgl-popup-tip');
              let userPopupClose = document.querySelector('#user-popup > div.mapboxgl-popup-content > button');
              
              userPopup.style.marginTop = '-35px';
              userPopupTip.style.visibility = 'hidden';
              userPopupTip.style.display = 'none';
              userPopupClose.style.visibility = 'hidden';
              userPopupClose.style.display = 'none';
            });

            // Suppression du popup lorsque la souris quitte le marqueur correspondant
            userMarker._element.addEventListener('mouseleave', () => {
              userHoverPopup.remove();
            });

          }
        });

        /* ################################################################ */
        /* ################## SET CLICK POPUPS (MESSAGE) ################## */
        /* ################################################################ */

        /* ############ CURRENT USER ############# */

        // Fonction pour surveiller l'ajout de nouveaux messages
        function surveillerNouveauxMessages() {

          // Créez un observateur de mutations pour surveiller les ajouts d'éléments
          const messagesFrame = document.getElementById('messages');

          // Créez un observateur de mutations pour surveiller les ajouts d'éléments
          const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
              if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                  if (node instanceof Element && node.getAttribute('data-category') === 'general' ) {

                    // Récupérer la location de l'expediteur
                    const messageLatitude = node.getAttribute('data-latitude');
                    const messageLongitude = node.getAttribute('data-longitude');

                    // Récupérez le contenu du message depuis l'élément
                    const messageContent = node.querySelector('.message p').textContent;
                    // Utilisez une expression régulière pour supprimer le nom d'utilisateur et les deux points
                    const messageContentCleaned = messageContent.replace(/^[^:]+:\s*/, '');

                    // Créez le contenu du popup pour le clic
                    const currentUserClicPopupContent = `<div class="message-user-popup">${messageContentCleaned}</div>`;

                    // Création du popup
                    const currentUserClicPopup = new mapboxgl.Popup()
                      .setLngLat([messageLongitude, messageLatitude])
                      .setHTML(currentUserClicPopupContent)

                    // Affichage du popup a l'envoi d'un message
                    currentUserClicPopup.addTo(map);
                    currentUserClicPopup.getElement().id = 'message-user-popup';

                    let messageCurrentUserPopup = document.querySelector('#message-user-popup');
                    let messageCurrentUserPopupTip = document.querySelector('#message-user-popup > .mapboxgl-popup-tip');
                    let messageCurrentUserPopupClose = document.querySelector('#message-user-popup > div.mapboxgl-popup-content > button');

                    messageCurrentUserPopup.style.marginTop = '-35px';
                    messageCurrentUserPopupClose.style.visibility = 'hidden';
                    messageCurrentUserPopupClose.style.display = 'none';

                     // Calculez la durée de lecture estimée en fonction du contenu du popup
                    const mots = messageContentCleaned.split(' ').length; // Nombre de mots dans le contenu
                    const vitesseLectureMoyenne = 125; // Vitesse de lecture moyenne en mots par minute
                    const tempsLectureEstime = (mots / vitesseLectureMoyenne) * 60 * 1000; // Temps en millisecondes

                    // Fermez automatiquement le popup après la durée de lecture estimée
                    setTimeout(function() {
                      currentUserClicPopup.remove(); // Supprimez le popup après la durée estimée
                    }, tempsLectureEstime);
                  }
                }
              }
            }
          });
        
          // Configurez l'observateur pour surveiller les ajouts d'enfants dans le TurboFrame
          observer.observe(messagesFrame, { childList: true });
        }

        surveillerNouveauxMessages();

        /* ############### USER ################ */
        /*
        usersArray.forEach(user => {
          if (user.id !== currentUser.id) {
            const userMarker = userMarkers[user.id];
            
            // Créez le contenu du popup pour le clic
            const userClicPopupContent = '<div class="message-current-user-popup">Popup affiché au clic. Futur popup affiché à l\'envoi de message</div>';

            // Création du popup
            const userClicPopup = new mapboxgl.Popup()
              .setLngLat([user.longitude, user.latitude])
              .setHTML(userClicPopupContent)

            // Affichage du popup au clic
            userMarker.onClick(() => {
              userClicPopup.addTo(map);
              userClicPopup.getElement().id = 'message-user-popup';

              let messageUserPopup = document.querySelector('#message-user-popup');
              let messageUserPopupTip = document.querySelector('#message-user-popup > .mapboxgl-popup-tip');
              let messageUserPopupClose = document.querySelector('#message-user-popup > div.mapboxgl-popup-content > button');

              messageUserPopup.style.marginTop = '-35px';
              messageUserPopupTip.style.visibility = 'hidden';
              messageUserPopupTip.style.display = 'none';
              messageUserPopupClose.style.visibility = 'hidden';
              messageUserPopupClose.style.display = 'none';
           });
          }
        });
        */
      }
    }
  }
}
