var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

/* GET Userlist page. */
router.get('/', function(req, res) {
   var db = require("../db");
   var lastid=req.query.id;
    var t='petr4';
   var Empresas = db.Mongoose.model('empresas', db.EmpresasSchema, 'empresas');
   Empresas.find({}).lean().exec(
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
               if(lastid==undefined || f.id==lastid)
               lista.push(f);               
            });
         res.status(200).send(lista);
                //  res.render('index', { "userlist": docs });
        });
})

module.exports = router;
