module.exports = {
    testEnvironment: "jsdom", // Assurez-vous que l'environnement est défini à jsdom
    transform: {
      "^.+\\.js$": "babel-jest" // Utilise babel-jest pour transformer les fichiers JS
    }
  };
  