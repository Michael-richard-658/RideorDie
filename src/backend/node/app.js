const express = require("express")
const app = express()
const cors = require("cors")
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken")
const mysql= require('mysql');
const http = require("http");
const { Server } = require("socket.io");


const server = http.createServer(app);

const io = new Server(server,{
  cors:{
      origin:'http://localhost:3000'
  }
});

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Richard658958!',
  database : 'rideordie'
});

connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL database');
  });

  app.use(cors({
    origin: ['http://localhost:3000', 'http://192.168.1.8:3000'], 
    methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const jwt_key = '250Adv'
module.exports = {connection:connection,token_key:jwt_key,io};




app.post('/createacc', (req, res) => {
    const body = req.body;
    const user = { user_id: uuidv4(), ...body };

    const { user_id, username, password, email } = user;
    const jwt_payload = { id: user_id, name: username, pass: password, email: email };

    try {
     
        const token = jwt.sign(jwt_payload, jwt_key, { expiresIn: '30d' });
        if (!token) {
            return res.status(400).json({ message: 'Failed to generate token. Try again later.' });
        }

       
        const query = 'INSERT INTO users SET ?';

      
        connection.query(query, user, (error, results) => {
            if (error) {
                console.error('Database error: ', error);
                return res.status(500).json({ message: 'Database insertion failed. Please try again later.' });
            }

        
            res.status(200).json({
                token: token,
                message: 'Successfully created account',
            });
        });
    } catch (err) {
        console.error('Token generation error: ', err);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});


app.get('/getuser',(req,res)=>{
    const Token = req.headers.authorization
    const info = jwt.verify(Token,jwt_key)
    const {email} = info
    const query = `select username,email,experience,ridingpreference,DATE_FORMAT(joined_at, '%d-%m-%Y') as date,bio from users where email="${email}"`;

  
    connection.query(query, (error, results) => {
      if (error) {
          console.error('Database error: ', error);
          return res.status(500).json({ message: 'Database insertion failed. Please try again later.' });
      }
      const data = results[0]
      res.status(200).json({data:data,message:"successfully retrived data!"})
  });

})
app.post('/login',(req,res)=>{
  
  const {email,password} = req.body
  
  const query = "SELECT user_id, username FROM users WHERE email = ? AND password = ?";
connection.query(query, [email, password], function(error, result){
    if(error) {
      res.status(400).json({message:"Something Went Wrong Please Try Again!"})
    }

      if (result.length===0) {
        return res.status(401).send('Invalid Username or Password!')
      }

      const id = result.length>0&&result[0].user_id
      const username = result.length>0&&result[0].username
      const jwt_payload={id:id,name: username, email: email}
      const token = jwt.sign(jwt_payload,jwt_key,{expiresIn:'30d'})
      res.status(200).json({token:token,id:id,name:username,message:"Succesfully Logged in!"})
    }
  
  )

})
app.post('/userbio', (req, res) => {
  const { userbio } = req.body;
  const token = req.headers.authorization;

  try {
    const user = jwt.verify(token, jwt_key);
    const query = `UPDATE users SET bio = ? WHERE email = ?`;
    connection.query(query, [userbio, user.email], function (error, result) {
      if (error) throw error;
      res.status(200).send("Bio updated successfully");
    });
  } catch (err) {
    res.status(401).send("Invalid token");
  }
});

app.get('/getriders', (req, res) => {
  const token = req.headers.authorization
  const user  = jwt.verify(token,jwt_key)
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 40; 
  const offset = (page - 1) * limit; 

  try {
    const query = 'SELECT username,user_id FROM users LIMIT ?, ?';
    connection.query(query, [offset, limit], (error, results) => {
      if (error) {
        console.error('Database error: ', error);
        return res.status(500).send('Failed to fetch riders');
      }

      const countQuery = 'SELECT COUNT(*) as total FROM users';
      connection.query(countQuery, (countError, countResults) => {
        if (countError) {
          console.error('Count query error: ', countError);
          return res.status(500).send('Failed to fetch riders');
        }

        const totalRecords = countResults[0].total;
        const totalPages = Math.ceil(totalRecords / limit);
       
        const updatedResults = results.filter(result => result.user_id !== user.id);

        res.status(200).json({
          riders: updatedResults,
          totalPages,
          currentPage: page,
          message: 'success',
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An unexpected error occurred');
  }
});

  app.get('/getprofile',(req,res)=>{
    const {id}  = req.query
    try {
      const query = `select username,experience,ridingpreference,DATE_FORMAT(joined_at, '%d-%m-%Y') as date,bio from users where user_id= "${id}"`
      connection.query(query,function(error,result){
        if(error) throw error
       res.status(200).json({info:result[0]})
      })
    } catch (error) {
      console.log(error)
    }
  })


app.post('/solorides',(req,res)=>{
  const token = req.headers.authorization
  const {id,name} = jwt.verify(token,jwt_key)
  const {tagsArr} = req.body 
  delete req.body.tagsArr;
  const tagsArray = tagsArr
  const tags = tagsArr.length>0&&tagsArray.join(', ');
  const user_id=id
  const rider_name = name
  const ride = {user_id,rider_name,tags,...req.body}
  try {
    const query = 'INSERT INTO solo_ride SET ?';
    connection.query(query,ride,function(error,result){
      if(error) throw error
      if (result) {
         res.status(200).send("Added Ride Successfully!")
      }
    })
  } catch (error) {
    console.log(error)
  }
})

app.get('/getsolorides',(req,res)=>{
  try {
    const query = 'select id,rider_name,title,location, DATE_FORMAT(ride_date, "%d-%b-%Y") AS formatted_ride_date ,time,distance,duration,experience_level as "exp-required" ,tags, note from solo_ride'
    connection.query(query,function(error,result){
      if(error) {
        res.status(500).send("DB Down at server level!")
        throw error
      }
      res.status(200).json(result)
    })
    
  } catch (error) {
    console.log(error)
  }
})
app.get('/getrecentsoloride',(req,res)=>{
  try {
    const query = 'SELECT id, title, location, time, distance, duration, rider_name, experience_level, tags, DATE_FORMAT(ride_date, "%d-%b-%Y") AS formatted_ride_date  FROM solo_ride ORDER BY created_at DESC LIMIT 4';
    connection.query(query,function(error,result){
      if(error) throw error
     res.status(200).json(result)
    })
  } catch (error) {
    console.log(error)
  }
})
app.get('/getspecificsoloride',(req,res)=>{
  const id = req.headers.id
  try {
    const query = `select * from solo_ride where id=${id}`
    connection.query(query,function(error,result){
      if(error) throw error
      res.status(200).json(result[0])
    })
  } catch (error) {
    console.log(error)
  }
})

app.post('/sendfeedback',(req,res)=>{
  const token = req.headers.authorization
  const user = jwt.verify(token,jwt_key)
  const feedback = {user_id:user.id,...req.body}
  try {
    const query = `insert into feedback set ? `
    connection.query(query,feedback,function(error,result){
      if(error) throw error
      console.log(result)
      res.status(200).send('Success')
    })
  } catch (error) {
    console.log(error)
  }
})
  /* Seprate File Routing*/
  const edituser = require('./routes/edituser')
  app.use('/edituserinfo',edituser)
  const followers = require('./routes/followers');
  app.use('/riders/profile',followers)
  const messages = require('./routes/messages');
  app.use('/',messages)

process.on('SIGINT', () => {
    console.log('Server is shutting down...');
    connection.end((err) => {
          if (err) {
            console.error('Error closing MySQL connection:', err);
          } else {
            console.log('MySQL connection closed.');
          }
    process.exit(err ? 1 : 0);
    });
});


const PORT = 7000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


