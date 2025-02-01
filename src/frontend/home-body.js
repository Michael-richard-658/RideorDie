import React,{useEffect,useState} from 'react'
import img1 from './assests/body1.webp'
import img2 from './assests/logo.webp'
import img3 from './assests/community.jpg'
import img4 from './assests/last.webp'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion';
import '../frontend/App.css'
import axios from 'axios'

export default function HomeBody() {

  const [showQuote, setShowQuote] = useState(false);
  const [recentRides, setRecentRides] = useState([]);

  
  useEffect(() => {
    getrecentride()
    const showQuoteInterval = setInterval(() => {
      setShowQuote(true);
      setTimeout(() => {
        setShowQuote(false);
      }, 5000); 
    }, 7000); 

    return () => clearInterval(showQuoteInterval); 
  }, []);

  async function getrecentride() {
    try {
      const response = await axios.get('http://localhost:7000/getrecentsoloride')
      setRecentRides(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div >
     <section className='div1'>
        <img src={img1} alt='img1' className='img1' />
        <div className='sec1'>
        <h2>Why is Riding in a Group Better?</h2>
        <p className='home-p1'>Riding in a group offers numerous benefits that enhance the overall experience for motorcyclists. First and foremost, safety is significantly improved; riders in a group can look out for one another, making it easier to spot potential hazards on the road. When traveling together, group members can share their skills and experiences, providing valuable support to less experienced riders.

Moreover, riding in a group fosters a sense of camaraderie and community. It creates an opportunity to build friendships with fellow enthusiasts, allowing riders to bond over their shared passion for motorcycles. Group rides often include organized events and planned routes, adding excitement and structure to the adventure.
Additionally, group touring can lead to more memorable experiences. Sharing breathtaking views and thrilling rides with others amplifies the enjoyment of the journey. Riders can also take advantage of group discounts on accommodations, meals, and activities, making it a more economical choice.

In summary, riding in a group not only enhances safety but also cultivates friendships and creates unforgettable experiences. Whether you're a seasoned rider or a beginner, joining a group ride can elevate your motorcycling adventures to new heights.</p>
        </div>
      <Link to={'travel'}>
        <button className='h-join'>Join a Ride!</button>
      </Link>
     </section>
     <div className='div2'>
        <img className='logo' src={img2} alt='logo'/>
        <h2>Why ride alone when you can ride with friends?</h2>
        <p>The RideOrDie app is designed for motorcycle enthusiasts looking to connect with others who share the same passion for riding. This platform allows users to find potential riding partners, collaborate on trips, and share their plans with the community.

Users can post their upcoming rides and see if anyone in the area has similar plans, facilitating opportunities for group rides. The app fosters camaraderie among motorcyclists, enhancing the experience through shared adventures. Whether you're looking for safety in numbers or just want to enjoy the company of fellow riders, RideOrDie makes it easy to find and join others on the road.

The app also features sections that highlight the importance of group riding, explaining its benefits such as increased safety and the joy of shared experiences. With engaging visuals and informative content, RideOrDie is not just about planning rides; it’s about building a community of riders who support and inspire each other. Join the adventure and experience the thrill of riding together!</p>
    <Link to='about'>
    <button className='h-about'>Read more &rarr;</button>
    </Link>
     </div>
     <div className='div3'>
    <img src={img3} alt='community'/>
    <h2>Meet The Community!</h2>
    <p>The RideOrDie Community is a passionate and vibrant network of motorcycle enthusiasts who believe in the thrill and camaraderie of shared adventures. Here, riders from all walks of life come together, united by a love for the open road and the desire to explore new places with like-minded people.

Our community values safety, support, and the shared experiences that make each ride memorable. From seasoned riders to beginners, everyone is welcome to join, learn, and grow together. Members often share tips, riding routes, and stories from their journeys, creating a space where riders can inspire and motivate each other.

Whether you're planning a cross-country adventure or a quick weekend ride, the RideOrDie Community is here to connect you with fellow riders, form lasting friendships, and create unforgettable memories on two wheels. Come be a part of our growing family and discover the true joy of riding together!</p>
<Link to={'/travel/communities'}>
<button className='h-community'>Community</button>
</Link>
     </div>
     <div className='last'>
      <img src={img4} alt='last' />
      <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: showQuote ? 1 : 0, y: showQuote ? 0 : 20 }}
      transition={{ duration: 0.3 }}
      style={{ display: showQuote ? 'block' : 'none' ,position:"absolute",right:'27rem',top:'250%',color:'white',fontSize:40,fontWeight:'bolder',left:'2rem'}} 
    >
     A Motorcycle Journey: A Symphony of Freedom, Adventure, and Self-Discovery

To ride a motorcycle is to embark on a journey that transcends mere transportation. It is to embrace the open road, to feel the wind against your skin, and to connect with the world in a way that is both exhilarating and profound. As you traverse winding roads and breathtaking landscapes, you'll discover a sense of freedom that is unparalleled.
    </motion.div>
      <div className='ride-div' >  
      <h1>Upcoming Events:</h1>
     
      {recentRides.length > 0 ? recentRides.map((ride,index)=>{
        return(
          <Link to={`/travel/${ride.id}`} key={index} >
          <div className='ride-map' >
          <h3>Place:{ride.location}</h3>
          <p>Date:{ride.formatted_ride_date}</p>
          <p>Title:{ride.title}</p>
          <p>Tags:{ride.tags}</p>
          </div>
          </Link>
          )
        }): <h2> no rides for now :( <Link>Create One!</Link></h2>}
          </div>
     </div>
    </div>
  )
}
