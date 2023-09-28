//app.js
const {MongoClient, ObjectId} = require("mongodb");
async function connect(){
  if(global.db) return global.db;
    const conn = await MongoClient.connect("mongodb+srv://vercel-admin-user:TV28kKtg9HBfhDPn@cluster0.xgbzj7z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
  if(!conn) return new Error("Can't connect");
    global.db = await conn.db("devcloud");
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


/* GET funcionário */
router.get('/funcionario/:id?', async function(req, res, next) {
  try {
    const db = await connect();
    if (req.params.id)
      res.json(await db.collection("funcionario").findOne({_id: new ObjectId(req.params.id)}));
    else
      res.json(await db.collection("funcionario").find().toArray());
  } catch(ex) {
    console.log(ex);
    res.status(400).json({erro: `${ex}`});
  }
});

// POST /funcionario
router.post('/funcionario', async function(req, res, next){
  try {
    const funcionario = req.body;
    const db = await connect();
    res.json(await db.collection("funcionario").insertOne(funcionario));
  } catch(ex) {
    console.log(ex);
    res.status(400).json({erro: `${ex}`});
  }
});

// PUT /funcionario/{id}
router.put('/funcionario/:id', async function(req, res, next){
  try {
    const funcionario = req.body;
    const db = await connect();
    res.json(await db.collection("funcionario").updateOne({_id: new ObjectId(req.params.id)}, {$set: funcionario}));
  } catch(ex) {
    console.log(ex);
    res.status(400).json({erro: `${ex}`});
  }
});

// DELETE /funcionario/{id}
router.delete('/funcionario/:id', async function(req, res, next){
  try {
    const db = await connect();
    res.json(await db.collection("funcionario").deleteOne({_id: new ObjectId(req.params.id)}));
  } catch(ex) {
    console.log(ex);
    res.status(400).json({erro: `${ex}`});
  }
});

app.use('/', router);

//inicia o servidor
app.listen(port);
console.log('API funcionando!');










