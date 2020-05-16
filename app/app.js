
const express = require('express');
const app = new express();

//Importo la classe per le chiamate al DB
const sqlUtils = require('./SqlUtils.js');


//passo il foglio come parametro nell’url
// esempio http://localhost:3000/ci_vettore/120
app.get('/ci_vettore/:foglio', function (req, res) {
    console.log(req.params.foglio);
    //richiamo il metodo che ottiene l'elenco dei vettori energetici
    sqlUtils.connect(req, res, sqlUtils.ciVettRequest);
});

// esempio http://localhost:3000/ci_vettore/120
app.get('/', function (req, res) {
    console.log(req.params.foglio);
    //richiamo il metodo che ottiene l'elenco dei vettori energetici
    sqlUtils.connect(req, res, sqlUtils.makeSqlRequest);
});


 
 

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
