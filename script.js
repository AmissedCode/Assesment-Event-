// ==========================================
// 1. GAME DATABASE (For Tags and Linking)
// ==========================================
const gamesDB = [
    { id: "modal-ark", page: "xbox.html", title: "ARK: Survival Evolved", tags: ["Survival", "Open World", "Sandbox", "Multiplayer", "RPG", "Fantasy"] },
    { id: "modal-rdr2", page: "xbox.html", title: "Red Dead Redemption II", tags: ["Open World", "Story Rich", "Action", "Adventure", "Western", "Multiplayer"] },
    { id: "modal-halo", page: "xbox.html", title: "HALO: The Masterchief Collection", tags: ["FPS", "Multiplayer", "Sci-fi", "Action", "Classic", "Co-op"] },
    { id: "modal-minecraft", page: "pc.html", title: "Minecraft", tags: ["Sandbox", "Survival", "Open World", "Multiplayer", "Crafting", "Building"] },
    { id: "modal-zomboid", page: "pc.html", title: "Project Zomboid", tags: ["Survival", "Zombies", "Sandbox", "RPG", "Multiplayer", "Simulation"] },
    { id: "modal-dr", page: "pc.html", title: "Deltarune", tags: ["RPG", "Story Rich", "Indie", "Fantasy", "Comedy", "Singleplayer"] },
    { id: "modal-jwe2", page: "xbox.html", title: "Jurassic World Evolution 2", tags: ["Simulation", "Strategy", "Management", "Dinosaurs", "Building", "Singleplayer"] },
    { id: "modal-stew", page: "xbox.html", title: "Stardew Valley", tags: ["Farming Sim", "RPG", "Simulation", "Multiplayer", "Relaxing", "Pixel Art"] },
    // ADD NEW GAMES HERE AS YOU BUILD THEM!
];

// ==========================================
// 2. MODAL LOGIC (Info & Trailer)
// ==========================================
let currentActiveModal = null; // Remembers which info modal was open

// Open the Info Modal
function openModal(id) {
    const modal = document.getElementById(id);
    if(modal) {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modal.children[0].classList.remove('scale-95');
        }, 10);
        
        // Track history for the tag algorithm
        trackHistory(id);
    }
}

// Close the Info Modal
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

// Open Trailer Modal (Hides Info Modal)
function openTrailer(infoModalId, videoId) {
    currentActiveModal = infoModalId;
    
    // Hide info modal instantly (no animation so it feels fast)
    document.getElementById(infoModalId).classList.add('hidden');
    document.getElementById(infoModalId).classList.add('opacity-0');

    // Show trailer modal
    const trailerModal = document.getElementById('trailer-modal');
    trailerModal.classList.remove('hidden');
    
    // Switch video source
    const videoElement = document.getElementById('trailer-video');
    videoElement.src = `videos/${videoId}.mp4`; // Assumes videos are in a 'videos' folder
    
    setTimeout(() => {
        trailerModal.classList.remove('opacity-0');
        trailerModal.children[0].classList.remove('scale-95');
        videoElement.play();
    }, 10);
}

// Close Trailer Modal (Brings back Info Modal)
function closeTrailer() {
    const trailerModal = document.getElementById('trailer-modal');
    const videoElement = document.getElementById('trailer-video');
    
    // Pause video
    videoElement.pause();
    videoElement.src = ""; // Clear source to stop downloading

    trailerModal.classList.add('opacity-0');
    trailerModal.children[0].classList.add('scale-95');
    
    setTimeout(() => {
        trailerModal.classList.add('hidden');
        
        // Bring back the info modal we left from
        if (currentActiveModal) {
            const infoModal = document.getElementById(currentActiveModal);
            infoModal.classList.remove('hidden');
            setTimeout(() => {
                infoModal.classList.remove('opacity-0');
            }, 10);
        }
    }, 300);
}

// ==========================================
// 3. NAVIGATION MENU LOGIC
// ==========================================
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

// ==========================================
// 4. CROSS-PAGE URL CHECKER
// ==========================================
// This runs when any page loads. If the URL has ?game=modal-ark, it opens that modal!
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameToOpen = urlParams.get('game');
    
    if (gameToOpen) {
        openModal(gameToOpen);
    }
});

// ==========================================
// 5. TAG ALGORITHM & HISTORY SYSTEM
// ==========================================

// Save visited games to localStorage
function trackHistory(gameId) {
    let visited = JSON.parse(localStorage.getItem('visitedGames')) || [];
    if (!visited.includes(gameId)) {
        visited.push(gameId);
        localStorage.setItem('visitedGames', JSON.stringify(visited));
    }
}

// The Tag Click Event
function searchByTag(clickedTag) {
    let visitedGames = JSON.parse(localStorage.getItem('visitedGames')) || [];
    let gameScores = [];

    // Loop through all games in DB
    gamesDB.forEach(game => {
        // Find if the game has the clicked tag
        const tagIndex = game.tags.findIndex(t => t.toLowerCase() === clickedTag.toLowerCase());
        
        if (tagIndex !== -1) {
            // Point System: Higher score the further left the tag is (index 0 is highest)
            // If there are 6 tags, index 0 gets 6 pts, index 1 gets 5 pts, etc.
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
        // Pick a random game from the weighted array
        const randomGame = gameScores[Math.floor(Math.random() * gameScores.length)];
        
        // Redirect to that game's page and trigger the modal via URL
        window.location.href = `${randomGame.page}?game=${randomGame.id}`;
    } else {
        alert("No other games found with the tag: " + clickedTag);
    }
}