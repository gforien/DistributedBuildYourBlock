/* chargement de la configuration */
const path = require("path");
const getConfig = function getConfig() {
  if (process.argv.length < 3) {
    console.error("Vous devez indiquer le fichier de configuration");
    console.info(`Usage : node ${process.argv[1]} <fileName>`);
    throw new Error("Need config filename");
  } else {
    return require(path.resolve(process.argv[2]));
  }
}
const config = getConfig();
console.log(process.argv[2]+" chargée");

// on vérifie les arguments
var assert = require('assert');
assert(process.argv.length >= 5);
commande = process.argv[3];
champ = process.argv[4];
assert(commande === "get" || commande === "set");
if (commande === "set") {
  assert(process.argv.length === 6);
  valeur = process.argv[5];
}

/* client */
const PORT = config.port;
const io = require('socket.io-client');

const socket = io(`http://localhost:${PORT}`, {
  path: '/dbyb',
});

socket.on('connect', () => {
  console.log('Connection établie');

  if (commande === "get") {
    socket.emit("get", champ, (res) => {
      console.log(`get ${champ} => ${res}`);
      socket.close();
    });
  }

  if (commande === "set") {
    socket.emit("set", champ, valeur, (bool) => {
      console.log(`set ${champ} to ${valeur} => ${bool}`);
      socket.close();
    });
  }

});