var express = require('express');
var router = express.Router();
var mongo = require('mongodb');

/* GET users listing. */
router.post("/signin",function(req,res){
  var db = require("../db");
  var e=req.body.email;
  var tok=req.body.token;
  var Users = db.Mongoose.model('users', db.UsersSchema, 'users');
  Users.findOneAndUpdate({email:e},{token:tok},function(e){
     if (e) {
          console.log("Error! " + err.message);
          return err;
      }
      else {
          console.log("Post saved");
        res.send("[{\"ok\":\"saved\"}]");
      }
  });
});

router.get('/plano', function(req, res, next) {
  var db = require("../db");
  var e=req.query.email;
  
  var Users = db.Mongoose.model('users', db.UsersSchema, 'users');
  var Planos = db.Mongoose.model('planos', db.PlanoSchema, 'planos');
  Users.findOne({email:e}).lean().exec(
    function (a,b){
      
      if(b.idPlano!=null && b.idPlano!=undefined && b.idPlano!="" ){
        Planos.find({_id:b.idPlano}).lean().exec((c,plano)=>{
          if(plano[0]._id!=undefined){
          var p={
            id:b.idPlano,
            codigo:plano[0].codigo,
            num_empresas:plano[0].num_empresas,
            validade:b.validade
          };
          res.send([p]);
         
        }else
        res.send([]);
        });
        
    }else{
      res.send([]);
    }
    
}
  );
  
});

module.exports = router;
