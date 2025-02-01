const express = require("express")
const router = express.Router() 
const {connection,io,token_key} = require('../app')
const jwt  = require('jsonwebtoken')


router.get('/currUser',(req,res)=>{
    const token = req.headers.authorization
    const user = jwt.verify(token,token_key)
    res.status(200).send(user)
})

// add socket emitter in the login to add the socket id

router.get('/messageTo',function(req,res){
    try {
        const query = 'select * from users where user_id=?';
        connection.query(query,[req.headers.id],function(err,results){
            if (err) console.log(err)
                const {username,user_id,experience,ridingpreference}=results[0]
                res.status(200).send({ username, user_id, experience, ridingpreference })
        })
    } catch (error) {
        res.send('error')
    }
})
router.get('/messageFrom',function (req,res){
    const token = req.headers.authorization
    const {name,id} = jwt.verify(token,token_key)
    res.status(200).send({id,name})
})
io.on('connection', (socket) => {

    console.log(`User connected with ID: ${socket.id}`);

    // Handle the logout event
    socket.on('logout', (data) => {
        if (data.logout) {
            connection.query('DELETE FROM connected WHERE socket_id = ?', [socket.id], (err) => {
                if (err) {
                    console.error('Error removing stale socket_id:', err);
                } else {
                    console.log(`Disconnected socket ID cleaned up: ${socket.id}`);
                }
            });
        }
    });

    // Handle user registration
    socket.on('m-register', (user) => {
        if (!user || !user.id) {
            console.error('Invalid user object received:', user);
            return;
        }
    
        connection.query('SELECT count(*) AS count FROM connected WHERE user_id = ?', [user.id], (err, results) => {
            if (err) {
                console.error('Error checking user existence:', err);
                return;
            }
    
            if (results[0].count > 0) {
                // User exists: Update the socket_id
                connection.query(
                    'UPDATE connected SET socket_id = ? WHERE user_id = ?',
                    [socket.id, user.id],
                    (updateErr) => {
                        if (updateErr) {
                            console.error('Error updating socket_id:', updateErr);
                        } else {
                            console.log('Socket ID updated for user:', user.id);
                        }
                    }
                );
            } else {
                // User does not exist: Insert a new record
                connection.query(
                    'INSERT INTO connected (user_id, socket_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE socket_id = VALUES(socket_id)',
                    [user.id, socket.id],
                    (insertErr) => {
                        if (insertErr) {
                            console.error('Error inserting new user:', insertErr);
                        } else {
                            console.log('New user added to connected:', user.id);
                        }
                    }
                );
            }
        });
    });
    
    // Handle socket disconnect to clean up stale socket_id entries
    socket.on('disconnect', () => {
        connection.query('DELETE FROM connected WHERE socket_id = ?', [socket.id], (err, result) => {
            if (err) {
                console.error('Error removing stale socket_id:', err);
            } else if (result.affectedRows > 0) {
                console.log(`Disconnected socket ID cleaned up: ${socket.id}`);
            } else {
                console.log(`No matching socket_id found for cleanup: ${socket.id}`);
            }
        });
    });
    
    

    // Handle private messaging
    socket.on('p-message', (data) => {
        const { from, to, text, senderName } = data;

        try {
            // Insert the message into the database
            connection.query('INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?)', [from, to, text], (err) => {
                if (err) {
                    console.error('Error inserting message:', err);
                    return;
                }

                // Check if the receiver is online
                connection.query('SELECT socket_id FROM connected WHERE user_id = ?', [to], (err, results) => {
                    if (err) {
                        console.error('Error fetching receiver socket_id:', err);
                        return;
                    }

                    if (results.length > 0) {
                        const q = 'SELECT message FROM messages WHERE (sender=? AND receiver=?) OR (sender=? AND receiver=?)';
                        connection.query(q, [from, to, to, from], (err, result) => {
                            if (err) {
                                console.error('Error fetching messages:', err);
                                return;
                            }
                            io.to(results[0].socket_id).emit('p-message', { from, senderName, result });
                        });
                        console.log('Message sent');
                    } else {
                        // Receiver is offline, store the message in the disconnected table
                        const q = 'INSERT INTO disconnected (from_id, to_id, message) VALUES (?, ?, ?)';
                        connection.query(q, [from, to, text], (err) => {
                            if (err) {
                                console.error('Error inserting message into disconnected table:', err);
                            }
                        });
                        console.log('Receiver not connected');
                    }
                });
            });
        } catch (error) {
            console.error('Error in p-message event:', error);
        }
    });

    // Handle user-online event
    socket.on('user-online', (data) => {
        if (data.online && data.fromId && data.id) {
            // Check if the user has any disconnected messages
            const q = 'SELECT count(message) AS counter FROM disconnected WHERE to_id = ?';
            connection.query(q, [data.fromId], (err, results) => {
                if (err) {
                    console.error('Error fetching disconnected messages count:', err);
                    return;
                }

                if (results[0].counter > 0) {
                    // If there are messages for the user, fetch and process them
                    const q2 = 'SELECT * FROM disconnected WHERE to_id = ?';
                    connection.query(q2, [data.fromId], (err, results) => {
                        if (err) {
                            console.error('Error fetching disconnected messages:', err);
                            return;
                        }

                        console.log('Disconnected messages:', results);
                        // You could insert the messages into the messages table or notify the user here.
                    });
                }
            });
        }
    });

});


module.exports=router