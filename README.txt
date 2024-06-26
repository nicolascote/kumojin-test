Pour commencer:

1. Démarrer mysql en local.
2. Exécuter le fichier create_db.sql dans un client mysql comme MySQLWorkbench pour créer la base de données.
3. Ouvrir un terminal au niveau du répertoire kumojin-test.
4. Installer les librairies dépendantes (node_modules) au niveau serveur en exécutant: npm install
5. Démarrer le serveur en exécutant: npm start
6. Ouvrir un autre terminal au niveau du répertoire client.
7. Installer les librairies dépendantes (node_modules) au niveau client en exécutant: npm install
8. Démarrer le client react en exécutant: npm start
9. Ouvrir une page dans le navigateur avec localhost:3000
10. Commencer à ajouter des événements avec la page web.


Défis:

Monter un base de données a été un défi pour moi, je devait installer un environnement mysql. 
J'ai dû surmonter l'erreur '-bash command not found' lorsque j'utilise la commande mysql dans le terminal.
Pour ça, j'ai dû faire la commande export PATH=$PATH:/usr/local/mysql/bin/.

Lorsque j'ai démarrer mon serveur, un erreur sur la connection à la base de données apparaissait: 
"ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication
protocol requested by server. Consider upgrading mysql client."
J'ai dû corriger cette erreur avec les commandes:
mysql -u root
mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'myrootuser';
mysql> FLUSH PRIVILEGES;

J'ai aussi surmonter d'autres problèmes comme le fait que ma variable newEvent restait vide lorsque j'envoie un post d'un event au serveur. 
En fait, il fallait que je mettes la variable newEvent en dépendance de useCallback.


Ce qu'il me reste à faire:

Bien sûr, je n'ai pas réussi à compléter le projet. Il me reste quelques étapes à réaliser:

M'assurer que la date de début et la date de fin soit un à la suite de l'autre.
Gérer les messages d'erreurs du serveur lorsqu'une erreur se produit dans le côté client.
Mieux formatter les dates dans la liste des événements pour qu'ils soient plus lisible.
Mieux afficher le modal d'un nouvelle événement: rajouter des labels, espacer les champs d'inputs et mettre un peu de css pour rendre l'affichage plus agréable.
Afficher le détails d'un événement sélectionné. J'ai commencé à l'implémenter, mais je n'arrive pas à sélectionner une row dans la table-ka.
Faire des tests du côté serveur et client.


Nombre d'heures: 9h