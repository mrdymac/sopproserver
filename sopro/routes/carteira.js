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
   var pag=req.query.page; 
   var name=req.query.nome; 
   var Users = db.Mongoose.model('users', db.UsersSchema, 'users');
   var Empresas = db.Mongoose.model('empresas', db.EmpresasSchema, 'empresas');
    if(e==undefined ||e==""){
        res.status(200).send([]);
        return;
    }   
    let limit=10;
    var skip=limit *(pag-1);
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
                                cotacao_atual:getCurrencyMode(getUltimaCotacao(em[0])),
                                ultimo_recomendacao:getUltimaRecomendacao(em[0]).recomendacao,
                                ultimo_alvo:getCurrencyMode(getUltimoAlvo(getUltimaRecomendacao(em[0]))),
                                atualizacao:getUltimaRecomendacao(em[0]).data, 
                                normalized: em[0].normalized
                            };
                            if(s+1>skip && (name==undefined || emp.normalized.includes(name.toLowerCase())  || name==""))
                                lista.push(emp);
                            if(f.carteira.length==s+1)                            
                                res.status(200).send(lista);                            
                        }
                    );                     
                });
            }
        );
        if(docs.length==0){
            res.status(200).send([]);
            return;
        } //  res.render('index', { "userlist": docs });
    });
})
function getUltimaCotacao(em){
    var cotacao=em.tickers[0].cotacoes.sort()[em.tickers[0].cotacoes.length-1];
    return cotacao.fechamento;
}
function getUltimaRecomendacao(em){
    return em.recomendacoes.sort()[em.recomendacoes.length-1];
}
function getUltimoAlvo(rec){
    var alvo="";
    rec.dados_recomendacao.forEach((r)=>{
        if(r.label=="alvo")
        alvo=r.value;
    });
    return alvo;    
}
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
module.exports = router;
