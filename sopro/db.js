var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/soprodb');
const Schema = mongoose.Schema;

var adminSchema = new mongoose.Schema({
    login: String,
    senha: String,
    token: String
}, { collection: 'admin' }
);

var empresasSchema = new mongoose.Schema({
    tickers: Array,
    nome: String,
    _id: Schema.Types.ObjectId,
    logo: String,  
    recomendacoes:Array,
    normalized:String,
    setor_id:String
}, { collection: 'empresas' }
);

var usersSchema = new mongoose.Schema({
   _id:Schema.Types.ObjectId,
   idNotification: String,
   email:String,
   token: String,
   senha: String,
   carteira: Array ,
   idPlano: String,
   validade: Date,
   normalized: String
}, { collection: 'users' }
);
var planoSchema=new mongoose.Schema({
    _id:Schema.Types.ObjectId,
    num_empresas: String,
    codigo: String
});
module.exports = { Mongoose: mongoose, EmpresasSchema: empresasSchema, UsersSchema:usersSchema, PlanoSchema: planoSchema }