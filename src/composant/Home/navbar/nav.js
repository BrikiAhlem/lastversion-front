import React, { useEffect, useState } from 'react'
import '../navbar/nav.css'
import Dropdown from 'react-bootstrap/Dropdown';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Card, Avatar, Typography, Modal, Button } from '@mui/material';

const Navbar = ({ reloadnavbar, isLoggedIn, setLoggedIn, role }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [cartquantity, setcartquantity] = useState(0)
    const [tokenDefined, setTokenDefined] = useState(false); // State to track whether token is defined
    const [instructeurData, setInstructeurData] = useState(null); // State for instructeurData
    const [searchResults, setSearchResults] = useState([]);
    const history = useHistory();
    const instructeurDataa = JSON.parse(localStorage.getItem('instructeurData'));
    const participantData = JSON.parse(localStorage.getItem('participantData'));

    const handleLogout = () => {
        // Supprimer le jeton d'authentification du localStorage ou d'un autre emplacement de stockage
        localStorage.removeItem('authToken');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('role');
        localStorage.removeItem('participantData');
        localStorage.removeItem('instructeurData');
        setLoggedIn(false);

        history.push('/login');
    };

    const getcarttotalitems = () => {
        let cart = JSON.parse(localStorage.getItem('cart'))
        if (cart) {
            let total = 0
            cart.forEach(item => {
                total += item.quantity
            })
            setcartquantity(total)
        }
        else {
            setcartquantity(0)
        }
    }

    useEffect(() => {
        getcarttotalitems()



    }, [reloadnavbar])

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/formationP/searchFormationsByDomaine?titre=${searchTerm}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Erreur lors de la recherche de formations par titre:', error);
        }
    };




    return (
        <nav className='nav'>
            <div className='s1'>
                <img src='/images/logorrr.png' alt='logo' className='logo' />
                <div className='s2'>
                    <Link to='/'>
                        <a>Accueil</a>
                    </Link>
                    {isLoggedIn && role === 'instructeur' && (
                        <Dropdown>
                            <Link to='/PublicationsList'>
                                <a> Publications </a>
                            </Link>
                        </Dropdown>)}
                    {isLoggedIn && role === 'participant' && (
                        <Dropdown>
                            <Dropdown.Toggle variant="" id="dropdown-basic" className='droppppp'>
                            Options d'Apprentissage
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="custom-dropdown-menu">
                                <Dropdown.Item href="/FormationsListPaiement" className="custom-dropdown-item">Notre Formations  </Dropdown.Item>
                                <Dropdown.Item href="/CoursGList" className="custom-dropdown-item">Notre Cours Gratuits </Dropdown.Item>
                                <Dropdown.Item href="/RessourceList" className="custom-dropdown-item"> Notre Resources pédagogiques</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>)}
                    <Link to='/aboutnous'>
                        <a>À propos de nous</a>
                    </Link>
                    <Link to='/contact'>
                        <a>Contacter Nous</a>
                    </Link>
                    <Link to='/login'>
                        {isLoggedIn ? null : <a>Ce connecter</a>}
                    </Link>


                </div>

                {isLoggedIn && (
                    <div className='right'>
                        <Dropdown>
                            <Dropdown.Toggle variant='' id='dropdown-basic round' className='droppbas' style={{ borderRadius: "50%", backgroundColor: "transparent", padding: 0, height: "70px", width: "70px" }}>
                                {role === 'instructeur' && instructeurDataa && instructeurDataa.Avatar ? (
                                    <Avatar src={`http://localhost:3000/uploads/${instructeurDataa.Avatar}`} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', marginLeft: "15px" }} />
                                ) : role === 'participant' && participantData && participantData.Avatar ? (
                                    <Avatar src={`http://localhost:3000/uploads/${participantData.Avatar}`} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', marginLeft: "15px" }} />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" style={{ width: '60px', height: '60px', color: "white" }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" stroke="white" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                )}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {role === 'instructeur' && <Dropdown.Item as={Link} to={{ pathname: `/UserProfile`, state: { instructeurData: JSON.parse(localStorage.getItem('instructeurData')) } }}>
                                    Profil
                                </Dropdown.Item>}
                                {role === 'participant' && <Dropdown.Item as={Link} to={{ pathname: `/UserProfileParticipant`, state: { participantData: JSON.parse(localStorage.getItem('participantData')) } }}>
                                    Profil
                                </Dropdown.Item>}
                                <Dropdown.Item onClick={handleLogout}>Se déconnecter
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar;
