# Distributed Build Your Block

## Objectif

Les buts de cette étape sont :

* Transformer notre base de données client / serveur en une base distribuées.
* Comprendre les problèmes liés aux systèmes distribués.

## Confiance et défaillance

Dans l'approche par client / serveur, vous devez avoir confiance dans le serveur :

* Il ne va pas altérer les données : les perdre ou les corrompre.
* Il va être disponible pour vous répondre : accepter de vous répondre, être actif et ne pas subir une panne.

Vous devez avoir confiance dans le faite que l'individu ou l'entité qui opère le serveur respecte ces critères. Mais face à des enjeux économiques ou politique important, il se peut qu'on ne puisse pas faire confiance à une seule entité.

Pour résister aux pannes ou à une forte demande vous pouvez aussi avoir envie de mettre plusieurs serveurs, chacun pouvant absorber une partie de la charge.

La solution utilisée par la blockchain est la distribution. Il n'y a pas de serveur central, tout le monde peut se rajouter au réseau et assurer le rôle de serveur. C'est une base de données distribués. Distribuer revient à avoir plusieurs serveurs qui se synchronisent entre eux.

#### Essayer de lancer plusieurs fois le serveur. Que ce passe-t'il ? Pourquoi ?

## Configuration

Mettre plusieurs serveurs sur une même machine n'est pas une idée de génie. En production, l'utilité est assez limité mais en test ou en développement, c'est fort utile à moins de disposer de plusieurs machines.

Il faut pouvoir lancer le serveur plusieurs fois avec des configuration différentes. Essayer de lancer les commandes suivantes : `node configuration.js configuration1.json`, `node configuration.js configuration2.json` et `node configuration.js`.

#### En vous inspirant de `configuration.js` modifiez `db.js` et `db-client.js` pour qu'il prennent un fichier de configuration et que fichier détermine le port utilité.

Vous êtes maintenant en mesure de lancer deux serveurs en parallèle mais ils ne se voient pas et ne se synchronisent pas.

## Appariement et synchronisation

Il faut maintenant faire en sorte que nos serveurs se voient et se parlent. Pour ça, il faut savoir comment les contacter.

#### Ajoutez dans les fichiers de configuration une liste des autres pairs avec le port de connexion.

#### Au lancement du serveur, connectez-vous aux autres pairs.

#### Modifiez la méthode `set` pour qu'elle mette à jour les autres pairs.

Vous avez réussi ? Réfléchissez maintenant à tous les problèmes qui peuvent arriver. Est-ce que cette solution est viable ? Comment ajouter un pair ? Que ce passe-t'il si un pair plante ? Si deux pairs reçoivent en même temps deux valeurs différentes pour la même clé ?

Nous verrons comment résoudre ces difficultés plus tard.

## CLI

Pour continuer, on va avoir besoin de faire des tests et d'envoyer des commandes `set` et `get`. En utilisant ce que vous venez d'apprendre, transformer le client Command Line Interface (CLI) de la forme :

    node cli.js <configFile> <command> <paramètres>...

Par exemple, pour mettre une valeur :

    node cli.js <configFile> set MonChamp 42

Et pour la récupérer :

    node cli.js <configFile> get MonChamp

## Jouer à trois ou plus

Dans bitcoin et dans un système distribué plus généralement, on peut ajouter un noeud à tout moment.

#### Ecrivez un troisième fichier de configuration et lancer le serveur sans modifier les deux autres. Que se passe-t'il ?

#### Modifier le serveur pour qu'au lancement, il fasse une requête `keys` à un des autres serveur et récupère toutes les valeurs qu'il n'a pas.

#### Que se passe-t'il maintenant si vous ajoutez un champs au serveur 1 ? Quel est la réponse des serveur 2 et 3 à votre `get` ?

Quand un nouveau serveur s'ajoute au système, il doit recevoir les mise à jours. Plusieurs solutions :

* Le serveur demande régulièrement la liste de `keys` mais ça peut rapidement devenir long et le taux de rafraichissement est dépendent de la fréquence des demandes.
* Soit il demande à être informer des mises à jours, par exemple avec une commande `addListener` et l'adresse de contact.
* Soit les serveurs informent tout leurs contacts dès qu'il y a un événement.

J'aime bien la dernière, elle est simple. Socket.io dispose de la possibilité de faire un broadcast à toutes les sockets connectés : https://socket.io/docs/#Broadcasting-messages

#### Éditez la commande `set` pour qu'elle broadcast l'événement à toutes les personnes connectées.

#### Est-ce qu'il se passe quelque-chose de bizarre dans vos tests ?

Selon l'implémentation, il peut se former :

* soit une boucle infinie où le message `set` est propagé indéfiniment entre les machines
* soit une machine est informé plusieurs fois de `set` et affiche une erreur mais se qui met fin à la propagation.

Le premier cas est très gênant, le second peut être réglé par un algorithme de consensus.

#### Faite quelques tests et vérifiez que ça fonctionne quelque-soit le serveur qui reçoit les `set` et les `get`.

## Conclusion

Nous avons un système qui marche plus ou moins, dans lequel n'importe quel noeud peut se connecter et reconstruire la base de données. C'est un système distribué minimaliste.

## Suite

Aller à l'étape 3 : `git checkout etape-3`.

Pour continuer à lire le sujet :

* soit vous lisez le fichier `README.md` sur votre machine.
* soit sur GitHub, au-dessus de la liste des fichiers, vous pouvez cliquer sur `Branch: master` et sélectionner `etape-3`.

## Pour aller plus loin

Pour continuer cette étape, vous pouvez identifier les serveurs par leur ip/port et discuter avec vos camarades pour étendre le système entre plusieurs machines.

Vous pouvez mettre en place des backups sur disque de la base de données.

Implémenter une commande `addPeer` qui permet via le CLI d'ajouter l'identifiant d'un serveur à un autre.

Implémentez une commande `getPeers` qui permet d'avoir la liste des pairs d'un serveur et pouvoir se connecter à eux.
