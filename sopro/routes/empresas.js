var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

/* GET Userlist page. 
   GET BY ID,
   GET PAGINADA
   GET BY LIKE NOME
*/ 
router.get('/', function(req, res) {
   var db = require("../db");
   var lastid=req.query.id;
   var pag=req.query.page;    
   var name=req.query.nome;  
   var Empresas = db.Mongoose.model('empresas', db.EmpresasSchema, 'empresas');
   let limit=10;
   var skip=limit *(pag-1);
   var query={};
   if((lastid==undefined || lastid=="") && name!="" && name!=undefined)
      query={normalized:new RegExp(name.toLowerCase())};
   else if(lastid!=undefined && lastid!="")
      query={_id:new mongo.ObjectID(lastid)};
   Empresas.find(query).skip(skip).lean().exec(
      function (e, docs) {
         var ff="";
         var lista=[];
         docs.forEach((f)=>{
                f.tickers.forEach((g)=>{
                    ff+=g.codigo+",";
                });
                f.tickers=ff.substr(0,ff.length-1);
                f.id=f._id;
                f.num_recomendacao=f.recomendacoes.length.toString();
               delete(f.recomendacoes);
               delete(f._id);               
               lista.push(f); 
            });
         res.status(200).send(lista);
               
        });
});
router.get('/cotacoes', function(req, res) {
   var db = require("../db");
   var lastid=req.query.id;  
   var ticker=req.query.ticker;  
   var Empresas = db.Mongoose.model('empresas', db.EmpresasSchema, 'empresas');
   Empresas.find({_id:new mongo.ObjectID(lastid)}).lean().exec(
      function (e, docs) {   
         var lista=[];
         docs[0].tickers.forEach(t=>{
            if(t.codigo==ticker)
               t.cotacoes.forEach(cotacao=>{
               lista.push({data: getDataFormatada(cotacao.data), values:cotacao.fechamento});   
            });
         });
         res.status(200).send(lista);               
        });
});
router.get('/recomendacoes', function(req, res) {
   var db = require("../db");
   var lastid=req.query.id; 
   var Empresas = db.Mongoose.model('empresas', db.EmpresasSchema, 'empresas');
   Empresas.find({_id:new mongo.ObjectID(lastid)}).lean().exec(
      function (e, docs) {   
         var lista=[];
         docs[0].recomendacoes.forEach(rec=>{
            lista.push({data: getDataFormatada(rec.data), id:rec._id});   
            
         });
         res.status(200).send(lista);               
        });
});
function getCurrencyMode(valor){
   var moeda=valor.toString().split('.');
   if(moeda.length==2)
       if(moeda[1].length==1)
           return "R$ "+moeda[0]+","+moeda[1]+"0"
       else
       return "R$ "+moeda[0]+","+moeda[1]
   else
       return "R$ "+moeda[0]+",00";
}
function getDataFormatada(valor){   
   var data=valor.toISOString().substr(0,10);
  return data.substr(8,2)+"/"+data.substr(5,2)+"/"+data.substr(0,4)
}
module.exports = router;

