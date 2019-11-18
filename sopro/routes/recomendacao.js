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
   var id=req.query.id;   
   var idEmpresa=req.query.empresa;
   var inicioAcomp=req.query.inicioAcomp;
   var Users = db.Mongoose.model('users', db.UsersSchema, 'users');
   var Empresas = db.Mongoose.model('empresas', db.EmpresasSchema, 'empresas');
   Empresas.find({_id: new mongo.ObjectID(idEmpresa)}).lean().exec(
       function (i,emps){
        var lista=[];
           emps[0].recomendacoes.forEach(rec => {
                reco={
                   id:rec._id,
                   logo: emps[0].logo,
                   recomendacao:rec.recomendacao,
                   url_podcast:rec.url_podcast,
                   dados_recomendacao:[],
                   empresa:emps[0].nome,                   
                   texto:rec.texto,
                   dados_indicadores:rec.dados_indicadores,
                   data: getDataFormatada(rec.data),
                   disclaimer: rec.autor,
                   inicio_acomp: inicioAcomp.substr(8,2)+"/"+inicioAcomp.substr(5,2)+"/"+inicioAcomp.substr(0,4)
               };
               rec.dados_recomendacao.forEach((a)=>{
                    reco.dados_recomendacao.push({label:a.label,values:a.value});
               });
               lista.push(reco);
               if(id!=undefined && reco.id.toString()==id){
                    res.status(200).send(reco);
                    return;
               }               
           });
           if(id==undefined || id==""){
                var l=[];
               lista.forEach(item=>{
                    l.push({
                        id:item.id,
                        nome:item.empresa,
                        ultimo_alvo:getCurrencyMode( item.dados_recomendacao[0].values),
                        ultimo_recomendacao: item.recomendacao,
                        atualizacao:item.data

                    })
               });
                res.status(200).send(l);
           }
            
       }
   );
})
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

