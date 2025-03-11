
const express = require('express');

const routes = require('./routes')
const userRouter = require('./routes/user')
const connectDB = require('./lib/connect')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const cors = require('cors');
const path = require('path');
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'https://full-stack-6sdv.onrender.com'],
  credentials: true,
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api',routes);
app.get('*', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index.html')); });

app.listen(3000, () => {
  connectDB();
  console.log('the server is running');
});


// const existingUser = users.find(user => user.name === name);
//   if (existingUser) {
//     return res.status(400).json({ error: 'name already exists' });
//   }
//   if (users.find(user => user.name === name)) {
//     return res.status(400).json({ error: 'name already exists' });
//   }




// // add delete 

// app.post('/add-user', (req,res) =>{
//   const {name} = req.body;
//   if(!name){
//     return res.status(400).json({error: 'name is required'});
//   }
//   const exist = users.find(user => user.name.includes(name));
//   if(exist){
//     return res.status(400).json({error: 'name already exist'});
//   }

//   const newUser = {
//     id: users.length+1,
//     name
//   };

//   users.push(newUser);
//   return(res.status(201).json(users));

// });

