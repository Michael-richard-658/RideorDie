import React, { useEffect, useState } from 'react';
import './riders.css';
import axios from 'axios';
import profile from '../assests/profile.png';
import { Link, useNavigate } from 'react-router-dom';

export default function Riders() {
    const [ridersArr, setRidersArr] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); 
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [isServerError, setIsServerError] = useState(false);

    const isLoggenIn = localStorage.getItem('log');
    const nav = useNavigate();

    useEffect(() => {
        if (isLoggenIn === false || isLoggenIn === undefined || isLoggenIn === null) {
            nav('/login?mess="Please Login First To Check Other Riders "');
        } else {
            getRiders(currentPage);
        }
    }, [currentPage]);

    async function getRiders(page) {
        try {
            const res = await axios.get(`http://localhost:7000/getriders?page=${page}&limit=40`, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            setRidersArr(res.data.riders);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.log('Error fetching riders:', error);
            setIsServerError(true);
        }
    }

    const filteredRiders = ridersArr.filter((rider) =>
        rider.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <div className='riders-m'>
            <input
                placeholder='Search Profile'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className='riders'>
                {isServerError ? (
    <h2>No Response From Server :(</h2>
) : 
    filteredRiders.length > 0 ? (
        filteredRiders.map((rider, index) => {
             return (
                            <Link to={rider.user_id} key={index}>
                                <div className='rider-card'>
                                    <img src={profile} alt='profile' className='profile-r' />
                                    <p className='rider-name'>{rider.username}</p>
                                </div>
                            </Link>
             )
        })
    ) : (
        <h2>Check The Username!</h2>
    )
}

            </div>
            <div className='pagination-controls'>
                <button onClick={prevPage} disabled={currentPage === 1} className='prev'>
                    Previous
                </button>
                <button onClick={nextPage} disabled={currentPage === totalPages} className='next'>
                    Next
                </button>
            </div>
        </div>
    );
}
