const express = require("express")
const router = express.Router() 
const {connection,token_key} = require('../app')
const jwt  = require('jsonwebtoken')

router.get('/getFollowers',(req,res)=>{
    const id = req.headers.id
    if (id) {
        
    
    try {
    const query =   ` SELECT  count(u.user_id) as followers FROM followers f JOIN users u ON u.user_id = f.follower_id WHERE f.following_id = "${id}"`
    connection.query(query,function(error,result){
        if(error) throw error
        res.status(200).json({followers:result[0].followers})
    })
    } catch (error) {
        console.log(error)
    }
} else{
    const token  = req.headers.authorization
    const user = jwt.verify(token,token_key)
    try {
        const query =   ` SELECT  count(u.user_id) as followers FROM followers f JOIN users u ON u.user_id = f.follower_id WHERE f.following_id = "${user.id}"`
        connection.query(query,function(error,result){
            if(error) throw error
            res.status(200).json({follower:result[0].followers})
        })
    } catch (error) {
        console.log(error)
    }
}
})

router.get('/getFollowing',(req,res)=>{
    const id = req.headers.id
    if (id) {
        
    
    try {
    const query =   ` SELECT  count(u.user_id) as following FROM followers f JOIN users u ON u.user_id = f.following_id WHERE f.follower_id = "${id}"`
    connection.query(query,function(error,result){
        if(error) throw error
        res.status(200).json({following:result[0].following})
    })
    } catch (error) {
        console.log(error)
    }
} else{
    const token  = req.headers.authorization
    const user = jwt.verify(token,token_key)
    try {
        const query =   ` SELECT  count(u.user_id) as following FROM followers f JOIN users u ON u.user_id = f.following_id WHERE f.follower_id= "${user.id}"`
        connection.query(query,function(error,result){
            if(error) throw error
            res.status(200).json({following:result[0].following})
        })
    } catch (error) {
        console.log(error)
    }
}


})

router.post('/addfollower', (req, res) => {
    const target = req.body;
    const token = req.headers.authorization;

    try {
        
        const user = jwt.verify(token, token_key);

       
        const query = `INSERT INTO followers(follower_id, following_id) VALUES (?, ?)`;

        connection.query(query, [user.id, target.id], function (error, result) {
            if (error) {
                
                if (error.errno === 1062) {
                    return res.status(200).json({ isFollowing: true });
                } else {
                    console.error('Database error:', error);
                    return res.status(500).json({ error: 'Database error occurred' });
                }
            }

            
            return res.status(200).json({ isFollowing: false });
        });
    } catch (error) {
        
        console.error('JWT verification failed:', error);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
});


router.get('/followersname', (req, res) => {
    const target_id = req.headers.id;
    const token = req.headers.authorization
    if (!token){
    try {
        const query = "SELECT u.username FROM followers f JOIN users u ON u.user_id = f.follower_id WHERE f.following_id = ?";
        
        connection.query(query, [target_id], function (error, result) {
            if (error) throw error;
            res.status(200).json(result);
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred" });
    }
}
else {
    const user = jwt.verify(token,token_key)
    
    try {
        const query = "SELECT u.username FROM followers f JOIN users u ON u.user_id = f.follower_id WHERE f.following_id = ?";
        
        connection.query(query, [user.id], function (error, result) {
            if (error) throw error;
            console.log(result)
                res.status(200).json(result);
            });
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "An error occurred" });
    }
}});

router.get('/followingname',(req,res)=>{
    const target_id = req.headers.id;
    const token = req.headers.authorization
    if (!token){
    try {
        const query = "SELECT u.username FROM followers f JOIN users u ON u.user_id = f.following_id WHERE f.follower_id = ? "
        
        connection.query(query, [target_id], function (error, result) {
            if (error) throw error;
            res.status(200).json(result);
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred" });
    }
}
else {
    
    const user = jwt.verify(token,token_key)
    
    try {
        const query = "SELECT u.username FROM followers f JOIN users u ON u.user_id = f.following_id WHERE f.follower_id = ? "
        
        connection.query(query, [user.id], function (error, result) {
            if (error) throw error;
            
                res.status(200).json(result);
            });
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "An error occurred" });
    }
}
})





module.exports=router