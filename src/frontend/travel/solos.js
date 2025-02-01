import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  OutlinedInput
} from '@mui/material';
import axios from 'axios';
import Soloridesmap from './soloridesmap';

export default function Solos() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [loc, setLoc] = useState('');
  const [locURL, setLocURL] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState(1);
  const [experience, setExperience] = useState('Beginner');
  const [tags, setTags] = useState([]);
  const [notes, setNotes] = useState('');
  const [count, setCount] = useState(0);
  const [riderArr,setRideArr]=useState([])
  const [search,setSearch]=useState('')

  useEffect(()=>{
    getSoloRides()
  },[count])


  const handleChangeTags = (event) => {
    const {
      target: { value },
    } = event;
    setTags(typeof value === 'string' ? value.split(',') : value);
  };

  async function addRide() {
    if (title && loc && date && time && distance && duration && experience && (tags.length || notes)) {
      const ride = {
        title: title,
        location: loc,
        ride_url:locURL,
        ride_date: date,
        time: time,
        distance: distance,
        duration: duration,
        experience_level: experience,
        note: notes,
        tagsArr: tags,
      };

      setTitle('');
      setLoc('');
      setDate('');
      setTime('');
      setDistance('');
      setDuration(1);
      setExperience('Beginner');
      setTags([]);
      setNotes('');
     
      const response = await axios.post('http://localhost:7000/solorides',ride,{
        headers: { 'Content-Type': 'application/json' ,Authorization:localStorage.getItem('token')}
      })
      console.log(response.data)
      setCount(prev => prev+1)
      setOpen(false);
    }
  }

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  async  function getSoloRides(){
    try {
      const res = await axios.get('http://localhost:7000/getsolorides')
      setRideArr(res.data)
    } catch (error) {
      console.log(error)
    }
  }
  function handleSearch(e){
    setSearch(e.target.value)
  }
  return (
    <div>
      <input className="ride-search" type="text" placeholder="Search Ride"  value={search} onChange={handleSearch}/>
      <button className="add-ride" onClick={handleClickOpen}>
        Add Ride
      </button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Ride</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            value={loc}
            onChange={(e) => setLoc(e.target.value)}
            margin="dense"
            label="Location"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            value={locURL}
            onChange={(e) => setLocURL(e.target.value)}
            margin="dense"
            label="Location-URL"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            value={date}
            onChange={(e) => setDate(e.target.value)}
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: getTodayDate() }}
          />
          <TextField
            value={time}
            onChange={(e) => setTime(e.target.value)}
            margin="dense"
            label="Time"
            type="time"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            value={distance}
            onChange={(e) => {
              const value = e.target.value;
              if (value >= 1) {
                setDistance(value);
              }
            }}
            margin="dense"
            label="Distance in KM (Both ways)"
            type="number"
            fullWidth
            variant="outlined"
          />
          <TextField
            value={duration}
            onChange={(e) => {
              const value = e.target.value;
              if (value >= 1) {
                setDuration(value);
              }
            }}
            margin="dense"
            label="Duration in Hours"
            type="number"
            fullWidth
            variant="outlined"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Experience Level</InputLabel>
            <Select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              label="Experience Level"
            >
              <MenuItem value="Beginner">Beginner</MenuItem>
              <MenuItem value="Moderate">Moderate</MenuItem>
              <MenuItem value="Advanced">Advanced</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Primary-Goal</InputLabel>
            <Select
              multiple
              value={tags}
              onChange={handleChangeTags}
              input={<OutlinedInput label="Primary-Goal" />}
              renderValue={(selected) => (
                <div>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </div>
              )}
            >
              <MenuItem value="Breeze">Breeze</MenuItem>
              <MenuItem value="Off-Road">Off-Road</MenuItem>
              <MenuItem value="Scenic">Scenic</MenuItem>
              <MenuItem value="Ghats">Ghats</MenuItem>
            </Select>
          </FormControl>
          <TextField
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            margin="dense"
            label="Notes..."
            type="text"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={addRide}>Submit</Button>
        </DialogActions>
      </Dialog>
      <Soloridesmap  ridesArr={riderArr} search={search}/>
    </div>
  );
}
