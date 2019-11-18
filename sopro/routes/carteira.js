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
   var e=req.query.email;
    var t='petr4';
   var Users = db.Mongoose.model('users', db.UsersSchema, 'users');
   var Empresas = db.Mongoose.model('empresas', db.EmpresasSchema, 'empresas');
   Users.find({email:e}).lean().exec(
      function (e, docs) {        
         var lista=[];
         docs.forEach((f)=>{
                f.carteira.forEach((g)=>{
                    var idd=new mongo.ObjectID(g.id_empresa);
                    var em=Empresas.find({_id:g.id_empresa}).lean().exec(
                        function (s, em) {
                            var emp={
                                id:f._id, 
                                nome: em[0].nome,
                                logo:em[0].logo,
                                cotacao_atual:getUltimaCotacao(em[0]),
                                ultimo_recomendacao:getUltimaRecomendacao(em[0]).recomendacao,
                                ultimo_alvo:getUltimoAlvo(getUltimaRecomendacao(em[0])),
                                atualizacao:getUltimaRecomendacao(em[0]).data
                            }
                            lista.push(emp);
                            res.status(200).send(lista);
                        }
                    );
                     
                });
            });
         
                //  res.render('index', { "userlist": docs });
        });
})
function getUltimaCotacao(em){
    var cotacao=em.tickers[0].cotacoes.sort((a,b)=>{
        if(a.data>b.data)
        return 1;
    })[0];
    return cotacao.fechamento;
}
function getUltimaRecomendacao(em){
    return em.recomendacoes.sort((a,b)=>{
        if(a.data>b.data)
        return 1;
    })[0];
}
function getUltimoAlvo(rec){
    var alvo="";
    rec.dados_recomendacao.forEach((r)=>{
        if(r.label=="alvo")
        alvo=r.value;

    });
    return alvo;
    
}
module.exports = router;
