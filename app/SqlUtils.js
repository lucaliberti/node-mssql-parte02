

const sql = require('mssql');
const CC = require('./CoordConverter.js');

const coordConverter = new CC();

const DBCONFIG = {
    user: 'PCTO',  //Vostro user name
    password: 'xxx123#', //Vostra password
    server: "213.140.22.237",  //Stringa di connessione
    database: 'Katmai', //(Nome del DB)
}

module.exports = class SqlUtils {

    //dato che il metodo connect richiama il metodo connectCallback deve ottenere il parametro req
    static connect(httpReq, httpRes, dbConnectedCallback) {
        sql.connect(DBCONFIG, (err) => {
            if (err) console.log(err);  // ... error check
            else dbConnectedCallback(httpReq, httpRes); //callback da eseguire in caso di connessione avvenuta 
        });
    }


    static makeSqlRequest(httpReq,httpRes) {
        let sqlRequest = new sql.Request();  //sqlRequest: oggetto che serve a eseguire le query
        let q = 'SELECT DISTINCT TOP (100) [GEOM].STAsText() FROM [Katmai].[dbo].[interventiMilano]';
        //eseguo la query e aspetto il risultato nella callback
        sqlRequest.query(q, (err, sqlResult) => { SqlUtils.sendQueryResults(err, sqlResult, httpRes) });
    }

    static sendQueryResults(err, sqlResult, httpRes) {
        if (err) console.log(err); // ... error checks
        httpRes.send(coordConverter.generateGeoJson(sqlResult.recordset));  //Invio il risultato al Browser
    }


    static ciVettRequest(httpReq, httpRes) {
        let sqlRequest = new sql.Request();  //sqlRequest: oggetto che serve a eseguire le query
        let foglio = httpReq.params.foglio; //ottengo il foglio passato come parametro dall'url
        let q = `SELECT INDIRIZZO, WGS84_X, WGS84_Y, CLASSE_ENE, EP_H_ND, CI_VETTORE, FOGLIO, SEZ
        FROM [Katmai].[dbo].[interventiMilano]
        WHERE FOGLIO = ${foglio}`
        //eseguo la query e aspetto il risultato nella callback
        sqlRequest.query(q, (err, sqlResult) => { SqlUtils.sendCiVettResult(err, sqlResult, httpRes) });
    }


    static sendCiVettResult(err, sqlResult, httpRes) {
        if (err) console.log(err); // ... error checks
        httpRes.send(sqlResult.recordset);  //Invio il risultato al Browser
    }


}

