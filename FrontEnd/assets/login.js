/* Fonction asynchrone qui vérifie si les valeurs du formulaire correspondent aux valeurs de l'API */
async function logIn() {
    /* Récuperation des valeurs du formulaire */
    const userEmail = document.querySelector('#email').value;
    const userPassword = document.querySelector('#password').value;
    
    const user = {
        email: userEmail,
        password: userPassword
    };
    /* Appel à l'API */
    const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    
    const result = await response.json();

    /* Véfification des valeurs */
    if (!result.token) {
        alert("Erreur dans l’identifiant ou le mot de passe");
        return;
    } else {
        /* Retour vers la page index.html et garde en mémoire le token d'autentification */
        const userLogged = JSON.stringify(result);
        window.localStorage.setItem("loggedUser", userLogged);
        window.location.replace("index.html");
    }
};

/* EventListener à la soumission du formulaire qui déclenche la fonction asynchrone */
const formLogIn = document.querySelector("#login");
formLogIn.addEventListener("submit", function (event) {
    event.preventDefault();
    logIn();
});