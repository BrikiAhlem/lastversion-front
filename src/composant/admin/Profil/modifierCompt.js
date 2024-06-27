import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBInput } from 'mdb-react-ui-kit';

const ModifierAdmin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [id_A, setId_A] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const id_A = localStorage.getItem('id_A');
        setToken(token);
        setId_A(id_A);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            console.log('Données envoyées:', { email, password, id_A, token });

            const response = await axios.put(`http://localhost:3000/Admin/${id_A}`, {
                email: email,
                mots_de_passe: password,
            }, {
                headers: {
                    'Authorization': ` ${token}`
                }
            });

            console.log('Réponse du serveur:', response.data);
            alert('Modification réussie !');
        } catch (error) {
            console.error('Erreur lors de la mise à jour :', error);
            alert('Erreur lors de la mise à jour. Veuillez réessayer.');
        }
    };

    return (
       <div className="modifier-admin-background">   
        <>
            <style>{`
                .modifier-admin-background {
                    background: radial-gradient(circle at 50% 50%, #295bac, #3b82f6, #3b82f6, #3b82f6, #abc9fb);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 15px;
                }
                .custom-placeholder::placeholder {
                    color: white;
                }
            `}</style>
            <MDBContainer className="my-5 ">
                <MDBRow>
                    <MDBCol md="6" className="mb-5">
                        <div className="p-4 rounded-3" style={{ background: 'rgba(0, 0, 0, 0.5)', marginTop: '200px' }}>
                            <h4 className="text-white mb-4">Données personnelles</h4>
                            <label className="text-white">Nouvel email</label>
                            <MDBInput className="text-white custom-placeholder" placeholder='Nouvel email' id='email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <label className="text-white">Nouveau mot de passe</label>
                            <MDBInput className="text-white custom-placeholder" placeholder='Nouveau mot de passe' id='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <div className="text-center pt-3">
                                <MDBBtn className="me-3 w-50 gradient-custom-2" type="submit" onClick={handleSubmit}>Modifier</MDBBtn>
                            </div>
                        </div>
                    </MDBCol>
                    <MDBCol md="6" className="mb-5">
                        <div className="d-flex flex-column justify-content-center h-100 p-4 rounded-3 gradient-custom-2">
                            <h4 className="text-white mb-4">Lorem ipsum</h4>
                            <p className="text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
                        </div>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </> </div> 
    );
};

export default ModifierAdmin;
