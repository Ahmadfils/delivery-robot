// Représentation des routes sous forme de graphe
const roads = [
    "Alice's House-Bob's House", "Alice's House-Cabin",
    "Alice's House-Post Office", "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall",
    "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop", "Marketplace-Farm",
    "Marketplace-Post Office", "Marketplace-Shop",
    "Marketplace-Town Hall", "Shop-Town Hall"
];

function buildGraph(edges) {
    let graph = Object.create(null);
    function addEdge(from, to) {
        if (!graph[from]) {
            graph[from] = [];
        }
        graph[from].push(to);
    }
    for (let [from, to] of edges.map(r => r.split("-"))) {
        addEdge(from, to);
        addEdge(to, from);
    }
    return graph;
}

const roadGraph = buildGraph(roads);

// Définition de l'état du village
class VillageState {
    constructor(place, parcels) {
        this.place = place;
        this.parcels = parcels;
    }

    move(destination) {
        if (!roadGraph[this.place].includes(destination)) {
            return this;
        }
        let parcels = this.parcels.map(p => {
            if (p.place !== this.place) return p;
            return { place: destination, address: p.address };
        }).filter(p => p.place !== p.address);
        return new VillageState(destination, parcels);
    }
}

// Rendre les objets immuables avec Object.freeze
Object.freeze(VillageState.prototype);

// Fonction pour exécuter le robot
function runRobot(state, robot, memory) {
    for (let turn = 0;; turn++) {
        if (state.parcels.length === 0) {
            console.log(`Livraison terminée en ${turn} déplacements.`);
            break;
        }
        let action = robot(state, memory);
        state = state.move(action.direction);
        memory = action.memory;
        console.log(`Se déplace vers ${action.direction}`);
    }
}

// Stratégie de déplacement aléatoire
function randomPick(array) {
    let choice = Math.floor(Math.random() * array.length);
    return array[choice];
}

function randomRobot(state) {
    return { direction: randomPick(roadGraph[state.place]) };
}

// Initialisation de l'état du village avec des colis
VillageState.random = function(parcelCount = 5) {
    let parcels = [];
    for (let i = 0; i < parcelCount; i++) {
        let address = randomPick(Object.keys(roadGraph));
        let place;
        do {
            place = randomPick(Object.keys(roadGraph));
        } while (place === address);
        parcels.push({ place, address });
    }
    return new VillageState("Post Office", parcels);
};

// Lancement du robot
runRobot(VillageState.random(), randomRobot);
