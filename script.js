const gamesDB = [
    { id: "modal-ark", page: "xbox.html", title: "ARK: Survival Evolved"},
    { id: "modal-rdr2", page: "xbox.html", title: "Red Dead Redemption II"},
    { id: "modal-halo", page: "xbox.html", title: "HALO: The Masterchief Collection"},
    { id: "modal-jwe2", page: "playstation.html", title: "Jurassic World Evolution 2"},
    { id: "modal-untl", page: "playstation.html", title: "Undetale"},
    { id: "modal-gowr", page: "playstation.html", title: "God of War: Ragnarok"},
    { id: "modal-ugg", page: "pc.html", title: "Untitled Goose Game",},   
    { id: "modal-minecraft", page: "pc.html", title: "Minecraft",},
    { id: "modal-zomboid", page: "pc.html", title: "Project Zomboid"},
    { id: "modal-pksc", page: "nintendo.html", title: "Pokemon Scarlet"},
    { id: "modal-dr", page: "nintendo.html", title: "Deltarune"},
    { id: "modal-stew", page: "nintendo.html", title: "Stardew Valley"},
];

let currentActiveModal = null; // Remembers which info modal was open

function openModal(id) {
    const modal = document.getElementById(id);
    if(modal) {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modal.children[0].classList.remove('scale-95');
        }, 10);
        trackHistory(id);
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if(modal) {
        modal.classList.add('opacity-0');
        modal.children[0].classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }
}

function openTrailer(infoModalId, videoId) {
    currentActiveModal = infoModalId;

    document.getElementById(infoModalId).classList.add('hidden');
    document.getElementById(infoModalId).classList.add('opacity-0');

    const trailerModal = document.getElementById('trailer-modal');
    trailerModal.classList.remove('hidden');
    
    const videoElement = document.getElementById('trailer-video');
    videoElement.src = `videos/${videoId}.mp4`; // Assumes videos are in a 'videos' folder
    
    setTimeout(() => {
        trailerModal.classList.remove('opacity-0');
        trailerModal.children[0].classList.remove('scale-95');
        videoElement.play();
    }, 10);
}

function closeTrailer() {
    const trailerModal = document.getElementById('trailer-modal');
    const videoElement = document.getElementById('trailer-video');

    videoElement.pause();
    videoElement.src = ""; // Clear source to stop downloading

    trailerModal.classList.add('opacity-0');
    trailerModal.children[0].classList.add('scale-95');
    
    setTimeout(() => {
        trailerModal.classList.add('hidden');

        if (currentActiveModal) {
            const infoModal = document.getElementById(currentActiveModal);
            infoModal.classList.remove('hidden');
            setTimeout(() => {
                infoModal.classList.remove('opacity-0');
            }, 10);
        }
    }, 300);
}

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameToOpen = urlParams.get('game');
    
    if (gameToOpen) {
        openModal(gameToOpen);
    }
});

function trackHistory(gameId) {
    let visited = JSON.parse(localStorage.getItem('visitedGames')) || [];
    if (!visited.includes(gameId)) {
        visited.push(gameId);
        localStorage.setItem('visitedGames', JSON.stringify(visited));
    }
}

function searchByTag(clickedTag) {
    let visitedGames = JSON.parse(localStorage.getItem('visitedGames')) || [];
    let gameScores = [];

    gamesDB.forEach(game => {
        // Find if the game has the clicked tag
        const tagIndex = game.tags.findIndex(t => t.toLowerCase() === clickedTag.toLowerCase());
        
        if (tagIndex !== -1) {
            let baseScore = game.tags.length - tagIndex; 

            // Boost unvisited games massively to prioritize them
            if (!visitedGames.includes(game.id)) {
                baseScore += 50; 
            }

            // Create entries multiple times based on score (Weighted Probability)
            for (let i = 0; i < baseScore; i++) {
                gameScores.push(game);
            }
        }
    });

    if (gameScores.length > 0) {
        const randomGame = gameScores[Math.floor(Math.random() * gameScores.length)];

        window.location.href = `${randomGame.page}?game=${randomGame.id}`;
    } else {
        alert("No other games found with the tag: " + clickedTag);
    }
}