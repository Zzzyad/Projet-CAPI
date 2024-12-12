// testunitaire.test.js

function testUnanimite(votes) {
    const uniqueVotes = new Set(votes);
    if (uniqueVotes.size === 1) {
        return `Unanimité validée avec la carte : ${votes[0]}`;
    } else {
        return `Unanimité non validée, votes différents : ${votes}`;
    }
}

function testMoyenne(votes) {
    const validVotes = votes.filter(vote => typeof vote === 'number');
    if (validVotes.length > 0) {
        const average = validVotes.reduce((sum, vote) => sum + vote, 0) / validVotes.length;
        return `Moyenne calculée : ${average}`;
    } else {
        return "Aucun vote valide pour calculer la moyenne.";
    }
}


function testMediane(votes) {
    const validVotes = votes.filter(vote => typeof vote === 'number');
    if (validVotes.length > 0) {
        validVotes.sort((a, b) => a - b);
        const middle = Math.floor(validVotes.length / 2);
        const median = validVotes.length % 2 === 0
            ? (validVotes[middle - 1] + validVotes[middle]) / 2
            : validVotes[middle];
        return `Médiane calculée : ${median}`;
    } else {
        return "Aucun vote valide pour calculer la médiane.";
    }
}

function testMajoriteAbsolue(votes, playerCount) {
    const voteCounts = votes.reduce((counts, vote) => {
        counts[vote] = (counts[vote] || 0) + 1;
        return counts;
    }, {});
    const majorityVote = Object.entries(voteCounts).find(([vote, count]) => count > playerCount / 2);
    if (majorityVote) {
        return `Majorité absolue validée avec la carte : ${majorityVote[0]}`;
    } else {
        return "Majorité absolue non validée, pas de carte majoritaire.";
    }
}


// Tests avec des assertions pour Jest
describe('Test des fonctions de votes', () => {
    test('Unanimité validée pour [10, 10, 10]', () => {
        const votes = [10, 10, 10];
        expect(testUnanimite(votes)).toBe("Unanimité validée avec la carte : 10");
    });

    test('Unanimité non validée pour [10, 20, 10]', () => {
        const votes = [10, 20, 10];
        expect(testUnanimite(votes)).toBe("Unanimité non validée, votes différents : 10,20,10");
    });

    test('Moyenne calculée pour [10, 20, 30]', () => {
        const votes = [10, 20, 30];
        expect(testMoyenne(votes)).toBe("Moyenne calculée : 20");
    });

    test('Moyenne calculée avec des valeurs non numériques pour [10, "cafe", 30]', () => {
        const votes = [10, "cafe", 30];
        expect(testMoyenne(votes)).toBe("Moyenne calculée : 20");
    });

    test('Médiane calculée pour [10, 20, 30]', () => {
        const votes = [10, 20, 30];
        expect(testMediane(votes)).toBe("Médiane calculée : 20");
    });

    test('Majorité absolue validée pour [10, 20, 20] avec 3 joueurs', () => {
        const votes = [10, 20, 20];
        const playerCount = 3;
        expect(testMajoriteAbsolue(votes, playerCount)).toBe("Majorité absolue validée avec la carte : 20");
    });

    test('Majorité absolue non validée pour [10, 20, 30] avec 3 joueurs', () => {
        const votes = [10, 20, 30];
        const playerCount = 3;
        expect(testMajoriteAbsolue(votes, playerCount)).toBe("Majorité absolue non validée, pas de carte majoritaire.");
    });

    test('Moyenne calculée pour des nombres impairs [1, 3, 5]', () => {
        const votes = [1, 3, 5];
        expect(testMoyenne(votes)).toBe("Moyenne calculée : 3");
    });

    test('Médiane calculée pour des nombres impairs [1, 3, 5]', () => {
        const votes = [1, 3, 5];
        expect(testMediane(votes)).toBe("Médiane calculée : 3");
    });

    test('Majorité absolue non validée avec votes impairs [1, 3, 5] et 3 joueurs', () => {
        const votes = [1, 3, 5];
        const playerCount = 3;
        expect(testMajoriteAbsolue(votes, playerCount)).toBe("Majorité absolue non validée, pas de carte majoritaire.");
    });

    test('Moyenne avec des nombres à virgule [1.5, 2.5, 3.5]', () => {
        const votes = [1.5, 2.5, 3.5];
        expect(testMoyenne(votes)).toBe("Moyenne calculée : 2.5");
    });

    test('Moyenne avec une combinaison de positifs et négatifs [-10, 20, 30]', () => {
        const votes = [-10, 20, 30];
        expect(testMoyenne(votes)).toBe("Moyenne calculée : 13.333333333333334");
    });
    
    
    
    
});