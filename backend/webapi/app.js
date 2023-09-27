//app.js
const {MongoClient, ObjectId} = require("mongodb");
async function connect(){
  if(global.db) return global.db;
    const conn = await MongoClient.connect("mongodb+srv://devcloud:DevCloud@cluster0.xgbzj7z.mongodb.net/");
  if(!conn) return new Error("Can't connect");
    global.db = await conn.db("unifor");
  return global.db;
}

const express = require('express');
const app = express();         
const port = 3000; //porta padrão

app.use(require('cors')());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//definindo as rotas
const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));

/* GET aluno */
router.get('/aluno/:id?', async function(req, res, next) {
    try{
      const db = await connect();
      if(req.params.id)
        res.json(await db.collection("aluno").findOne({_id: new ObjectId(req.params.id)}));
      else
        res.json(await db.collection("aluno").find().toArray());
    }
    catch(ex){
      console.log(ex);
      res.status(400).json({erro: `${ex}`});
    }
})

// POST /aluno
router.post('/aluno', async function(req, res, next){
    try{
      const aluno = req.body;
      const db = await connect();
      res.json(await db.collection("aluno").insertOne(aluno));
    }
    catch(ex){
      console.log(ex);
      res.status(400).json({erro: `${ex}`});
    }
})

// POST /login
router.post('/login', async function(req, res, next) {
  //try {
  const { email, senha } = req.body;
  
  // Verificar as credenciais do usuário no banco de dados
  const db = await connect();
  const user = await db.collection("aluno").findOne({ email, senha });
  
  if (!user) {
    return res.status(401).json({ erro: 'Credenciais inválidas' });
  } else {
    res.json({message: 'Usuário logado com sucesso'});
  }
});

// // POST /signup
// router.post('/signup', async function(req, res, next) {
//   try {
//     const { email, password } = req.body;

//     // Verificar se o usuário já está cadastrado no banco de dados
//     const db = await connect();
//     const existingUser = await db.collection("users").findOne({ email });

//     if (existingUser) {
//       return res.status(409).json({ erro: 'Usuário já cadastrado' });
//     }

//     // Cadastrar o novo usuário no banco de dados
//     const newUser = { email, password };
//     const result = await db.collection("users").insertOne(newUser);

//     res.json({ message: 'Usuário cadastrado com sucesso' });
//   } catch (ex) {
//     console.log(ex);
//     res.status(400).json({ erro: `${ex}` });
//   }
// });

// PUT /aluno/{id}
router.put('/aluno/:id', async function(req, res, next){
    try{
      const aluno = req.body;
      const db = await connect();
      res.json(await db.collection("aluno").updateOne({_id: new ObjectId(req.params.id)}, {$set: aluno}));
    }
    catch(ex){
      console.log(ex);
      res.status(400).json({erro: `${ex}`});
    }
})

// DELETE /aluno/{id}
router.delete('/aluno/:id', async function(req, res, next){
    try{
      const db = await connect();
      res.json(await db.collection("aluno").deleteOne({_id: new ObjectId(req.params.id)}));
    }
    catch(ex){
      console.log(ex);
      res.status(400).json({erro: `${ex}`});
    }
})

app.use('/', router);

//inicia o servidor
app.listen(port);
console.log('API funcionando!');