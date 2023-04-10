/* Fonction async + verification valeurs API */
async function logIn() {
    
    /* Verif valeurs formilaire */
    const userEmail = document.querySelector('#email').value;
    const userPassword = document.querySelector('#password').value;
    
    const user = {
        email: userEmail,
        password: userPassword
    };

    /* API  */
    const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    
    const result = await response.json();

    /* Véfification des valeurs + message Erreur */
    if (!result.token) {
        alert("Erreur d’identification: verifiez votre identifiant ou le mot de passe");
        return;
    } else {
        /* Redirection vers la page d'accueil + loggedUser */
        const userLogged = JSON.stringify(result);
        window.sessionStorage.setItem("loggedUser", userLogged);
        window.location.replace("index.html");
    }
};

/* EventListener à la soumission du formulaire qui déclenche la fonction asynchrone */
const formLogIn = document.querySelector("#login");
formLogIn.addEventListener("submit", function (event) {
    event.preventDefault();
    logIn();
});
