
const express = require('express');

const routes = require('./routes')
const userRouter = require('./routes/user')
const connectDB = require('./lib/connect')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['https://oy-vay-pay-naveh1234.netlify.app', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie'],
}));
app.use('/api',routes);

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

