import React, { useEffect, useState } from 'react'
import axios from 'axios'
import profile from '../assests/profile.png'
import { Link, useNavigate } from 'react-router-dom'
import edit from '../assests/edit-icon.png'
import { Dialog, DialogActions, DialogContentText, DialogTitle,Tabs, Tab,DialogContent } from '@mui/material'
import ProfileFollowers from '../riders/profileFollowers'
import { getFollowersName,getFollowingName } from '../riders/profile'
import { getCurrentUser, socket } from '../../App'




export default function UserProfile() {
    let data;
    const [info,setInfo] = useState()
    const [count,setCount] = useState(0)
    const [open,setOpen]=useState(false)
    const [disBio,setDisBio]=useState('')
    const [bio,setBio]=useState(disBio)
    const [followers,setFollowers] = useState(0)
    const [following,setFollowing] = useState(0)
    const [activeTab, setActiveTab] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [followersName, setFollowersName] = useState([]);
    const [followingName, setFollowingName] = useState([]);
    const [currUser,setCurrUser] = useState({});
    const nav = useNavigate()
    const isLoggenIn = localStorage.getItem('log')

    

    useEffect(()=>{
      const isLoggedIn = localStorage.getItem('log')
      const fetchData = async () => {
        if (!isLoggedIn) {
            nav('/login?mess="Please Login First To Check Other Riders Profile "');
        } else {
            await getInfo()
            await getFollowers();
            await getFollowings();
           
            await getFollowersName( null,setFollowersName,true);
            await getFollowingName( null,setFollowingName,true);
            await getCurrentUser(setCurrUser)
        }
    };
    
    fetchData();
    },[isLoggenIn])
    
   
    function handleBioChange(e){
      setBio(e.target.value)
    }

    
    async function getInfo() {
        try {
            axios.get('http://localhost:7000/getuser',{
                headers:{Authorization:localStorage.getItem('token')}
            })
            .then(response => { 
              setInfo(response.data)
              setDisBio(response.data.data.bio)
              setBio(response.data.data.bio)
            })
            
        } catch (error) {   
            console.log(error)
        }
    }
    data =  info 
    
    function logout(){
      localStorage.removeItem('log')
      localStorage.removeItem('token')
      setCount(prev => prev + 1)
      socket.emit('logout',{logout:true})
    }
    const handleClickOpen = () => {
      setOpen(true);
    };

    function closebio(){
      setOpen(false)
    }
    async function addbio(){
      const getbio=bio
      const bioState = {
        userbio:getbio
      }
      try {
          const response = await axios.post('http://localhost:7000/userbio',bioState,{
            headers:{"Content-Type":'application/json',Authorization:localStorage.getItem('token')}
          }).then(response => setDisBio(getbio))
      } catch (error) {
        console.log(error)
      }
      setOpen(false)
    }
    async function getFollowers() {
      try {
        const response =await axios.get('http://localhost:7000/riders/profile/getFollowers',{
          headers: {
            Authorization: localStorage.getItem('token'),            
                  }  })
                  setFollowers(response.data.follower)
      } catch (error) {
        console.log(error)
      }
    }
    async function getFollowings() {
      try {
        const response = await axios.get('http://localhost:7000/riders/profile/getFollowing',{
          headers:{
            Authorization:localStorage.getItem('token')
          }
        })
              setFollowing(response.data.following)
      } catch (error) {
        console.log(error)
      }
    }
    const handleTabChange = (event, newValue) => {
      setActiveTab(newValue);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
};
const handleOpenDialog = () => {
  setOpenDialog(true);
};

  return (
    <div className='userprofile-m'>
      <div className='l-userprofile-div'>
        <img src={profile}   alt='profile'/>
        <h1 className='username'>{data&&data.data.username}</h1>
        <h1 className='experience'>Experience:{data&&data.data.experience}</h1>
        <h2 className='ridingpreference'>Riding-Preference:{data&&data.data.ridingpreference}</h2>
        <h3 className='date '>Member-From:{data&&data.data.date}</h3>
       <div className='edit-div'>
        <Link to={'/userprofile/edituser'}>
        <button className='edit'>Edit-Profile</button>
        </Link>
        <button className='logout' onClick={logout}>Logout</button>
        </div> 
        <div className='r-userprofile-div'>
        
          <div className='text-nav'>
            <p className='user-bio'>Bio:</p>
            <button onClick={handleClickOpen}>
              <img src={edit} alt='edit' />
              </button>
          </div>
            <textarea  value={disBio ? disBio : ''} style={{height:'350px',
              width:'19.75rem',
              resize:'none',
              fontWeight:'bolder',
              fontSize:'medium',}} readOnly className='text-area'/>
        </div>
        <Dialog open={open} onClose={handleClickOpen} >
        <DialogTitle sx={{fontWeight:'bolder',border:'none'}}>Enter Bio:</DialogTitle>
        <DialogContentText sx={{fontWeight:'bolder',color:'black',marginLeft:'.5rem'}}>
          Add about yourself the bike You ride and favorite destination and much more so that  others can connect and relate!
        </DialogContentText>
        <textarea style={{marginLeft:'8rem',width:'20rem',height:'100px' ,resize:'none',marginTop:'1rem'}} value={bio} onChange={handleBioChange}/>
        <DialogActions>
          <button onClick={closebio}  style={{background:'white',border:'none',fontSize:'larger',fontWeight:'bolder'}}>Close</button>
          <button onClick={addbio} style={{background:'white',border:'none',fontSize:'larger',fontWeight:'bolder'}}>Add</button>
        </DialogActions>
        </Dialog>
      </div>
      <div className='userprofile-follow-div'>   
        <ProfileFollowers from='user' followers={followers} following={following} open={handleOpenDialog}/>
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
                            <h4>No Followers :(</h4>
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
  )
}
