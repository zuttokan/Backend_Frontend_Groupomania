const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  try {
    //--Récupération du token dans le header de la requête
    const token = req.headers.authorization.split(' ')[1]; //--Split permet de générer un tableau avec deux éléments dont le 1er est le mot bearer (ce mot se place automatiquement devant le token) et le deuxième le token
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET); //--'RANDOM_TOKEN_SECRET' est la clé secrète
    //--Une fois le token décodé, il devient un objet javaScript classqiue
    //--On récupère l'userId qui est dedans
    const userId = decodedToken.userId;
    //--On vérifie que l'userId de la requête correspond à celui du token
    if (req.body.userId && req.body.userId !== userId) {
      //--S'ils sont différents
      throw 'Invalid user ID'; //--ID utilisateur non valable !'
    } else {
      next();
    }
  } catch {
    console.log('catch');
    res.status(401).json({
      error: new Error('Invalid request!'),
    });
  }
};
