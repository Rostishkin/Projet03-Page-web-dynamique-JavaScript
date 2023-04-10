/* Declaration chemins d'API */
const PATH_API = 'http://localhost:5678/api/';
const PATH_WORKS = 'works';
const PATH_CATEGORIES = 'categories';

/* Recuperation des donnes via l'API*/

//Recuperation travaux
const getWorks = () => {
    return fetch( PATH_API + PATH_WORKS , { method: 'GET' })
        .then((response) => response.json())
        .then((datas) => { return datas; })
        .catch((error) => { console.log( error ) });
};

// Recuperation filtres
const getCategories = () => {
    return fetch( PATH_API + PATH_CATEGORIES , { method: 'GET' })
        .then((response) => response.json())
        .then((datas) => { return datas; })
        .catch((error) => { console.log( error ) });
};




/* Authentification User Verification */ 
let userLogInToken = window.sessionStorage.getItem("loggedUser");

if (userLogInToken !== null ) {
    userLogInToken = JSON.parse(userLogInToken);
    
    const logInLogOut = document.getElementById("login-logout");
    logInLogOut.innerText = "logout";

    // Afficher le bouton "Modifier"
    document.getElementById('change-works-button').style.display = null;

    logInLogOut.addEventListener("click", function (event) {
        event.preventDefault();
        window.sessionStorage.removeItem("loggedUser");
        window.location.reload();
    });
};




/* Generation des travaux */ 
function generateWorks(allWorks) {
    for (let i = 0; i < allWorks.length; i++) {
        const works = allWorks[i];

        /* Division dans laquelle les travaux seront generes */
        const portfolioWorks = document.querySelector(".gallery");

        /* Creation figure */
        let workElement = document.createElement("figure");
            workElement.dataset.id = works.id;

        /* Creation d'image */
        const imageElement = document.createElement("img");
            imageElement.src = works.imageUrl;

        /* Creation de legende */
        const titleElement = document.createElement("figcaption");
            titleElement.innerText = works.title;

        /* Attachement des elements */
        portfolioWorks.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(titleElement);
    }
};

/* Affichage des travaux */
getWorks().then(allWorks => generateWorks(allWorks));




/*Creation de la division dans laquelle les filtres seront generes */
const portfolioWorkss = document.querySelector(".gallery");
const filtersSection = document.createElement("div");
filtersSection.classList.add("filters-container");
portfolioWorkss.before(filtersSection);

/* Création du bouton TOUS */
const buttonAllWorks = document.createElement("button");
    buttonAllWorks.innerText = "Tous";
    buttonAllWorks.classList.add("filters");
    buttonAllWorks.classList.add("active");

filtersSection.appendChild(buttonAllWorks);

buttonAllWorks.addEventListener("click", function(){
    document.querySelector(".gallery").innerHTML = "";
    getWorks().then(allWorks => generateWorks(allWorks));
});

/* Fonction pour générer les boutons de filtres */
function generateButtons(allButtons) {
    for (let i = 0; i < allButtons.length; i++) {
        const buttons = allButtons[i];

        let buttonElement = document.createElement("button");
        buttonElement.dataset.id = buttons.id;
        buttonElement.innerText = buttons.name;
        buttonElement.classList.add('filters');
        
        filtersSection.appendChild(buttonElement);

        buttonElement.addEventListener("click", function() {
            document.querySelector(".gallery").innerHTML = "";
            getWorks().then(allWorks => {
                const worksForCategory = allWorks.filter(work => work.category.id == buttonElement.dataset.id);
                generateWorks(worksForCategory);
            });
        });
    };
};

/* Affichage des filtres et travaux filtrés */
getCategories().then(allButtons => generateButtons(allButtons));

/* Afficher le bouton filtre "ACTIVE" */
filtersSection.addEventListener("click", function(button) {
    if (button.target.classList.contains("active")) {
        return;
    }
    if (document.querySelector(".filters-container button.active") !== null) {
        document.querySelector(".filters-container button.active").classList.remove("active");
    }
    button.target.classList.add("active")
});




/* Creation de fenetre Modale */
let modal = null;
const focusableSelector = 'button, a, input, textarea';
let focusables = [];

const openModal = function (e) {
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute('href'));
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    modal.style.display = null;
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
};

const closeModal = function (e) {
    if (modal === null) return;
    e.preventDefault();
    window.setTimeout(function () {
        modal.style.display = "none";
        modal = null;
    }, 500);
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
};

const stopPropagation = function (e) {
    e.stopPropagation();
};

const focusInModal = function (e) {
    e.preventDefault();
    let index = focusables.findIndex(f => f === modal.querySelector(':focus'));
    if (e.shiftKey === true) {
        index--;
    } else {
        index++;
    };
    if (index >= focusables.length) {
        index = 0;
    };
    if (index < 0) {
        index = focusables.length - 1;
    };
    focusables[index].focus();
};

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
});

window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    };
    if (e.key === 'Tab' && modal !== null) {
        focusInModal(e);
    };
});


/* Fonction ajout de Travaux via modale */
function generateWorksModal(allWorks) {
    for (let i = 0; i < allWorks.length; i++) {
        const works = allWorks[i];

        /* Sélectionner la div gallerie qui accueillera les travaux */
        const portfolioWorks = document.querySelector("#modal-gallery");

        /* Créer l'élément figure pour les travaux */
        let workElement = document.createElement("div");
            workElement.dataset.id = works.id;
            workElement.classList.add("miniature-works");

        /* Créeer l'image  */
        const imageElement = document.createElement("img");
            imageElement.src = works.imageUrl;

        /* Créer l'icone poubelle */
        const trashcanElement = document.createElement("img");
            trashcanElement.src = "/FrontEnd/assets/icons/trash-can-solid.svg";
            trashcanElement.classList.add("trashcan");

        /* Créer le légende */
        const titleElement = document.createElement("p");
            titleElement.innerText = "éditer";

        /* Rattachement des balises */
        portfolioWorks.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(trashcanElement);
        workElement.appendChild(titleElement);
    }
};
getWorks().then(allWorks => generateWorksModal(allWorks));
