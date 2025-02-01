import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import profile from '../assests/profile.png';
import messageIcon from '../assests/message.png';
import ProfileFollowers from './profileFollowers';
import { Dialog, DialogContent,  Tabs, Tab } from '@mui/material';


export const CountContext = createContext({});



export async function getFollowersName(id, setFollowersName,flag) {
    try {
        const response = await axios.get('http://localhost:7000/riders/profile/followersname', {
            headers: { id: !flag ?  id : null , Authorization: flag ? localStorage.getItem('token') : null}
        });
        setFollowersName(response.data);
    } catch (error) {
        console.log(error);
    }
}

export async function getFollowingName(id, setFollowingName,flag) {
    try {
        const response = await axios.get('http://localhost:7000/riders/profile/followingname', {
            headers: { id: !flag ?  id : null ,Authorization: flag ? localStorage.getItem('token') : null }
        });
        setFollowingName(response.data);
    } catch (error) {
        console.log(error);
    }
}



export const isLoggedIn = localStorage.getItem('log');
export default function Profile() {
    const nav = useNavigate();    
    const { id } = useParams();
    const [currProfile, setCurrProfile] = useState(undefined);
    const [followers, setFollowers] = useState(0);    
    const [following, setFollowing] = useState(0);    
    const [pcount, setPcount] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [followersName, setFollowersName] = useState([]);
    const [followingName, setFollowingName] = useState([]);
    

    useEffect(() => {
        
        const fetchData = async () => {
            if (!isLoggedIn) {
                nav('/login?mess="Please Login First To Check Other Riders Profile "');
            } else {
                await getProfile();
                await getFollowers();
                await getFollowings();
                await getFollowersName(id, setFollowersName,false);
                await getFollowingName(id, setFollowingName,false);
                
            }
        };
        fetchData();
       
        
    }, [pcount,id]); 

    

    async function getProfile() {
        try {
            const response = await axios.get(`http://localhost:7000/getprofile?id=${id}`);
            setCurrProfile(response.data.info);
        } catch (error) {
            console.log(error);
        }
    }

    async function getFollowers() {
        try {
            const response = await axios.get('http://localhost:7000/riders/profile/getFollowers', {
                headers: {
                    Authorization: localStorage.getItem('token'),
                    id: id || null,
                },
            });
            setFollowers(response.data.followers);
        } catch (error) {
            console.log(error);
        }
    }

    async function getFollowings() {
        try {
            const response = await axios.get('http://localhost:7000/riders/profile/getFollowing', {
                headers: {
                    Authorization: localStorage.getItem('token'),
                    id: id || null,
                },
            });
            setFollowing(response.data.following);
        } catch (error) {
            console.log(error);
        }
    }

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const user = currProfile;
    const exp = user && user.experience;
    const pre = user && user.ridingpreference;


   function mess(id){
        nav(`/${id}`)
   }

    return (
        <div className='profile-m'>
            <Link to={'/riders'}>
                <p className='home-arr'>&larr;</p>
            </Link>
            <div className='top-half'>
                <img src={profile} alt='profile-pic' />
                <h1>User-Name: {user && user.username}</h1>
                
                <button className='mess-p' onClick={()=>mess(id)} >
                    <img src={messageIcon} alt='message-icon' />Message
                </button>
                <div className='followers-bar'>
                    <CountContext.Provider value={{ pcount, setPcount }}>
                        <ProfileFollowers id={id} followers={followers} following={following} open={handleOpenDialog}/>     
                    </CountContext.Provider>
                   
                </div>
                <hr />
            </div>
            <div className='bottom-half'>
                <div className='bio-div'> 
                    <h4>Bio:</h4>
                    <p className='bio-p'>{user && user.bio ? user.bio : "Nothing to Look at :("}</p>
                </div>
            </div>

          
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogContent>
                    <Tabs value={activeTab} onChange={handleTabChange} aria-label="Followers and Following Tabs">
                        <Tab label="Followers" />
                        <Tab label="Following" />
                    </Tabs>

                    {activeTab === 0 ? (
                        followersName.length > 0 ? (
                            followersName.map((name, index) => (
                                <div  key={index}>
                                <h4>{name.username}</h4>
                                <hr/>
                                </div>
                            ))
                        ) : (
                            <h4>:(</h4>
                        )
                    ) : null}

                    {activeTab === 1 ? (
                        followingName.length > 0 ? (
                            followingName.map((name, index) => (
                                <div  key={index}>
                                <h4>{name.username}</h4>
                                <hr/>
                                </div>
                            ))
                        ) : (
                            <h5>:(</h5>
                        )
                    ) : null}

                </DialogContent>
            </Dialog>
        </div>
    );
}
