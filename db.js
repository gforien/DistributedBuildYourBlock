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
console.log("config", config);

/* serveur */
const PORT = config.port;

const Server = require('socket.io');
const Client = require('socket.io-client');
const io = new Server(PORT, {
  path: '/dbyb',
  serveClient: false,
});
console.log(`Serveur lancé sur le port ${PORT}.`);

/* le serveur se synchronise aux autres serveurs */
const srvs = config.autres.map((element, index) => {
    var s = Client(`http://localhost:${element}`, {path: '/dbyb'});
    s.on('connect', () => {
      console.log('Connection établie avec le serveur '+element);
      //console.log(srvs);
    });
    return s;
});

const db = Object.create(null);
io.on('connect', (socket) => {
  console.log('Nouvelle connexion');

  socket.on('get', function(field, callback){
    console.log(`get ${field}: ${db[field]}`);
    callback(db[field]);
  });

  socket.on('set', function(field, value, callback){
    if (field in db) {
      console.log(`set error : Field ${field} exists.`);
      // db[field] = value;
      callback(false);
    } else {
      console.log(`set ${field} : ${value}`);
      db[field] = value;
      callback(true);

      // synchronise
      srvs.forEach((s) => {
        s.emit('setServ', field, value);
      });
    }
  });

  socket.on('setServ', function(field, value){
    console.log(`SETSERV ${field} : ${value}`);
    db[field] = value;
  });
});
