// Variables globales
let players = [];
let backlog = [];
let currentFeatureIndex = 0;
let votes = [];
let currentPlayerIndex = 0;
let timerInterval;

// Initialisation
document.getElementById("addPlayers").addEventListener("click", addPlayers);
document.getElementById("startGame").addEventListener("click", startGame);
document.getElementById("importBacklog").addEventListener("change", loadBacklog);
document.getElementById("importSave").addEventListener("change", loadSave);
document.getElementById("resetGame").addEventListener("click", resetGame);

/**
 * Ajouter des joueurs au jeu en fonction du nombre saisi.
 */
function addPlayers() {
    const playerCount = document.getElementById("playerCount").value;
    const playersDiv = document.getElementById("players");
    playersDiv.innerHTML = "";
    for (let i = 0; i < playerCount; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = `Pseudo joueur ${i + 1}`;
        input.id = `player${i}`;
        playersDiv.appendChild(input);
    }
}

/**
 * Charger un fichier JSON contenant un backlog.
 * @param {Event} event - L'événement déclenché par le chargement du fichier.
 */
function loadBacklog(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        backlog = JSON.parse(reader.result);
        alert("Backlog chargé avec succès !");
    };
    reader.readAsText(file);
}

/**
 * Charger un fichier JSON contenant une sauvegarde.
 * @param {Event} event - L'événement déclenché par le chargement du fichier.
 */
function loadSave(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        const progress = JSON.parse(reader.result);
        if (progress.backlog && progress.players && progress.currentFeatureIndex !== undefined) {
            backlog = progress.backlog;
            players = progress.players;
            currentFeatureIndex = progress.currentFeatureIndex;
            votes = progress.votes || Array(players.length).fill(null);
            currentPlayerIndex = 0;
            document.getElementById("rules").value = progress.rule || "strict"; // Restaurer la règle
            alert("Sauvegarde chargée avec succès !");
            document.getElementById("menu").style.display = "none";
            document.getElementById("game").style.display = "block";
            startTimer();
            addPreviousButton();
            showFeature();
        } else {
            alert("Fichier de sauvegarde invalide !");
        }
    };
    reader.readAsText(file);
}


/**
 * Démarrer la partie en initialisant les joueurs et en affichant le jeu.
 */
function startGame() {
    const playerInputs = document.querySelectorAll("#players input");
    players = Array.from(playerInputs).map(input => input.value || `Joueur${Math.random() * 1000}`);
    document.getElementById("menu").style.display = "none";
    document.getElementById("game").style.display = "block";
    startTimer();
    addPreviousButton();
    showFeature();
}

/**
 * Afficher les cartes pour le joueur actuel et permettre le vote.
 */
function showCardsForPlayer() {
    const votesDiv = document.getElementById("votes");
    votesDiv.innerHTML = "";
    const player = players[currentPlayerIndex];
    const currentFeature = backlog[currentFeatureIndex];
    document.getElementById("featureTitle").innerText = `Fonctionnalité : ${currentFeature.name} - Au tour de ${player} de voter`;
    const cards = [0, 1, 2, 3, 5, 8, 13, 20, 40, 100, "cafe", "interro"];
    cards.forEach(card => {
        const cardImg = document.createElement("img");
        cardImg.src = `assets/cartes_${card}.svg`;
        cardImg.alt = `Carte ${card}`;
        cardImg.addEventListener("click", () => {
            voteForCurrentPlayer(card);
        });
        votesDiv.appendChild(cardImg);
    });
}

/**
 * Enregistrer le vote pour le joueur actuel et passer au joueur suivant.
 * @param {number|string} card - La carte choisie par le joueur.
 */
function voteForCurrentPlayer(card) {
    votes[currentPlayerIndex] = card;
    currentPlayerIndex++;
    if (currentPlayerIndex >= players.length) {
        currentPlayerIndex = 0;
        validateVote();
    } else {
        showCardsForPlayer();
    }
}

/**
 * Afficher la fonctionnalité actuelle pour le vote.
 */
function showFeature() {
    if (currentFeatureIndex >= backlog.length) {
        alert("Backlog terminé !");
        clearInterval(timerInterval);
        showReturnToMenuButton();
        disableCards();
        const previousButton = document.getElementById("previousButton");
        if (previousButton) previousButton.remove();
        saveResults();
        return;
    }
    votes = Array(players.length).fill(null);
    currentPlayerIndex = 0;
    document.getElementById("featureTitle").innerText = `Fonctionnalité : ${backlog[currentFeatureIndex].name}`;
    showCardsForPlayer();
}

/**
 * Afficher la fonctionnalité précédente.
 */
function showPreviousFeature() {
    if (currentFeatureIndex > 0) {
        currentFeatureIndex--;
        votes = Array(players.length).fill(null);
        currentPlayerIndex = 0;
        showFeature();
    } else {
        alert("Vous êtes déjà à la première fonctionnalité !");
    }
}

/**
 * Ajouter un bouton pour revenir à la fonctionnalité précédente.
 */
function addPreviousButton() {
    const previousButton = document.createElement("button");
    previousButton.innerText = "Fonctionnalité précédente";
    previousButton.id = "previousButton";
    previousButton.addEventListener("click", showPreviousFeature);
    const gameContainer = document.getElementById("game");
    gameContainer.appendChild(previousButton);
}

/**
 * Désactiver les cartes après la fin du jeu.
 */
function disableCards() {
    const cardsDiv = document.getElementById("votes");
    const cards = cardsDiv.querySelectorAll("img");
    cards.forEach(card => {
        card.style.pointerEvents = "none";
        card.style.opacity = 0.5;
    });
}

/**
 * Démarrer un chronomètre pour le jeu.
 */
function startTimer() {
    let seconds = 0;
    timerInterval = setInterval(() => {
        seconds++;
        document.getElementById("time").innerText = new Date(seconds * 1000).toISOString().substr(14, 5);
    }, 1000);
}

/**
 * Valider le vote en fonction des règles sélectionnées (unanimité, moyenne, médiane, majorité absolue).
 */
function validateVote() {
    const rule = document.getElementById("rules").value;
    
    
    if (votes.every(vote => vote === "cafe")) {
        saveProgress();
        alert("Tous les joueurs ont utilisé la carte Café. Partie sauvegardée !");
        votes = Array(players.length).fill(null);
        currentPlayerIndex = 0;
        showCardsForPlayer();
        return;
    }
  
    // Règle stricte : Unanimité (tous les votes doivent être identiques)
    if (rule === "strict" && new Set(votes).size === 1) {
        backlog[currentFeatureIndex].estimate = votes[0];
        currentFeatureIndex++;
        alert("Fonctionnalité validée !");
        showFeature();
        return;
    }
    
    // Règle moyenne : Calcul de la moyenne des votes
    if (rule === "average") {
        const validVotes = votes.filter(vote => typeof vote === 'number'); // Ignorer les cartes non numériques
        if (validVotes.length > 0) {
            const average = validVotes.reduce((sum, vote) => sum + vote, 0) / validVotes.length;
            backlog[currentFeatureIndex].estimate = Math.round(average); // Estimation arrondie
            currentFeatureIndex++;
            alert("Fonctionnalité validée avec la moyenne !");
            showFeature();
        } else {
            alert("Vote non validé, recommencez !");
            resetVotesAndPlayers();
        }
        return;
    }
    
    // Règle médiane : Calcul de la médiane des votes
    if (rule === "median") {
        const validVotes = votes.filter(vote => typeof vote === 'number'); // Ignorer les cartes non numériques
        if (validVotes.length > 0) {
            validVotes.sort((a, b) => a - b);
            const middle = Math.floor(validVotes.length / 2);
            const median = validVotes.length % 2 === 0 ? 
                (validVotes[middle - 1] + validVotes[middle]) / 2 : 
                validVotes[middle];
            backlog[currentFeatureIndex].estimate = Math.round(median); // Estimation arrondie
            currentFeatureIndex++;
            alert("Fonctionnalité validée avec la médiane !");
            showFeature();
        } else {
            alert("Vote non validé, recommencez !");
            resetVotesAndPlayers();
        }
        return;
    }
    
    // Règle de la majorité absolue : Si une carte apparaît plus de la moitié du nombre de joueurs
    if (rule === "absolute-majority") {
        const voteCounts = votes.reduce((counts, vote) => {
            counts[vote] = (counts[vote] || 0) + 1;
            return counts;
        }, {});
        const majorityVote = Object.entries(voteCounts).find(([vote, count]) => count > players.length / 2);
        if (majorityVote) {
            backlog[currentFeatureIndex].estimate = majorityVote[0];
            currentFeatureIndex++;
            alert("Fonctionnalité validée avec la majorité absolue !");
            showFeature();
        } else {
            alert("Vote non validé, recommencez !");
            resetVotesAndPlayers();
        }
        return;
    }
    
  
    // Si aucune règle n'a été validée, on recommence le vote
    alert("Vote non validé, recommencez !");
    votes = Array(players.length).fill(null);
    currentPlayerIndex = 0;
    showCardsForPlayer();
  }
  

/**
 * Réinitialiser les votes et les joueurs pour une nouvelle fonctionnalité.
 */
function resetVotesAndPlayers() {
    votes = Array(players.length).fill(null);
    currentPlayerIndex = 0;
    showCardsForPlayer();
}

/**
 * Sauvegarder les résultats finaux dans un fichier JSON.
 */
function saveResults() {
    const blob = new Blob([JSON.stringify(backlog)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "results.json";
    a.click();
}

/**
 * Sauvegarder la progression du jeu dans un fichier JSON.
 */
function saveProgress() {
    const progress = {
        backlog: backlog,
        currentFeatureIndex,
        players,
        votes: Array(players.length).fill(null),
        rule: document.getElementById("rules").value // Ajouter la règle choisie
    };
    const blob = new Blob([JSON.stringify(progress)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "save.json";
    a.click();
}


/**
 * Afficher un bouton pour retourner au menu principal.
 */
function showReturnToMenuButton() {
    const returnButton = document.createElement("button");
    returnButton.innerText = "Retour au menu principal";
    returnButton.id = "returnButton";
    returnButton.addEventListener("click", resetGame);
    const gameContainer = document.getElementById("game");
    gameContainer.appendChild(returnButton);
}

/**
 * Réinitialiser le jeu et revenir au menu principal.
 */
function resetGame() {
    players = [];
    backlog = [];
    currentFeatureIndex = 0;
    votes = [];
    currentPlayerIndex = 0;
    clearInterval(timerInterval);
    document.getElementById("time").innerText = "00:00";
    document.getElementById("menu").style.display = "block";
    document.getElementById("game").style.display = "none";
    document.getElementById("featureTitle").innerText = "";
    document.getElementById("players").innerHTML = "";
    document.getElementById("votes").innerHTML = "";
    const previousButton = document.getElementById("previousButton");
    if (previousButton) previousButton.remove();
    const returnButton = document.getElementById("returnButton");
    if (returnButton) returnButton.remove();
    document.getElementById("importSave").value = "";
}