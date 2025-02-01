import React, { useState } from 'react';
import './rides.css';
import ghats from '../assests/ghats.jpg';
import scenic from '../assests/scenic.jpg';
import breeze from '../assests/breeze.jpg';
import offroad from '../assests/offroading.jpg';
import { Link } from 'react-router-dom';

export default function Soloridesmap({ ridesArr, search }) {
    const [currentPage, setCurrentPage] = useState(1);
    const ridesPerPage = 12;

    const filteredRides = ridesArr.filter(ride => 
        ride.location.toLowerCase().includes(search.toLowerCase()) ||
        (ride.tags && ride.tags.toLowerCase().includes(search.toLowerCase())) ||
        ride.rider_name.toLowerCase().includes(search.toLowerCase())
    );

    const indexOfLastRide = currentPage * ridesPerPage;
    const indexOfFirstRide = indexOfLastRide - ridesPerPage;
    const currentRides = filteredRides.slice(indexOfFirstRide, indexOfLastRide);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    function selectImg(tag) {
        if (tag === 'Off-Road') return offroad;
        else if (tag === 'Breeze') return breeze;
        else if (tag === 'Scenic') return scenic;
        else if (tag === 'Ghats') return ghats;
    }

    return (
        <div className='solo-rides-m'>
            {filteredRides.length > 0 ? (
                <>
                    {currentRides.map((ride, index) => {
                        const eachTag = ride.tags && ride.tags.split(',');
                        return (
                            <Link to={`/travel/${ride.id}`} key={index}>
                                <div className='soloride-card'>
                                    <img src={selectImg(eachTag[0])} alt='card-img' />
                                    <div className='ride-dis'>
                                        <p>Location: {ride.location}</p>
                                        <p>Date: {ride.formatted_ride_date}</p>
                                        <p>Tags: {ride.tags}</p>
                                        <p>Rider: {ride.rider_name}</p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}

                    <div className='pagination-container'>
                        <div className='pagination'>
                            {[...Array(Math.ceil(filteredRides.length / ridesPerPage)).keys()].map(page => (
                                <button
                                    key={page + 1}
                                    onClick={() => handlePageChange(page + 1)}
                                    className={currentPage === page + 1 ? 'active' : ''}
                                >
                                    {page + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <h2>No rides found</h2>
            )}
        </div>
    );
}
