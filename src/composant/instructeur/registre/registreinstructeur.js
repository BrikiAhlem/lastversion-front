import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBInput, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../css/ParticipantRegister.css';

const Register = () => {
    const history = useHistory();
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [specialite, setSpecialite] = useState('');
    const [autreSpecialite, setAutreSpecialite] = useState('');
    const [email, setEmail] = useState('');
    const [tel, setTel] = useState('');
    const [mots_de_passe, setPassword] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^[0-9]{8}$/;
        return phoneRegex.test(phone);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleNextStep = async (event) => {
        event.preventDefault(); // Prevent form submission by default

        let valid = true;
        if (!nom || !prenom || !email || !specialite || !tel || !mots_de_passe) {
            valid = false;
            toast.error('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        if (!validateEmail(email)) {
            valid = false;
            toast.error('Veuillez entrer une adresse e-mail valide.');
            return;
        }

        if (!validatePhoneNumber(tel)) {
            valid = false;
            toast.error('Veuillez entrer un numéro de téléphone valide.');
            return;
        }

        if (!validatePassword(mots_de_passe)) {
            valid = false;
            toast.error('Le mot de passe doit contenir au moins 8 caractères, un chiffre et un caractère spécial.');
            return;
        }

        if (valid) {
            const response = await fetch('http://localhost:3000/instructeur/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nom,
                    prenom,
                    email,
                    specialite: specialite === 'autre' ? autreSpecialite : specialite,
                    mots_de_passe,
                    tel,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Inscription réussie:', result);
                toast.success('Inscription réussie!');
                history.push('/login');
            } else {
                const errorData = await response.json();
                if (response.status === 409) {
                    toast.error(`Cette adresse e-mail est déjà utilisée. Veuillez en choisir une autre.`);
                } else {
                    console.error('Échec de l\'inscription:', response.statusText);
                    toast.error('Échec de l\'inscription. Veuillez réessayer.');
                }
            }
        }
    };

    return (
        <MDBContainer fluid className='my-1' style={{ marginTop: "-100px" }}>
            <MDBRow className='g-0 align-items-center'>
                <MDBCol col='6'>
                    <MDBCard className='my-5 cascading-right' style={{ width: "100%", height: "80%", background: 'hsla(0, 0%, 100%, 0.55)', backdropFilter: 'blur(30px)', borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.7)" }}>
                        <MDBCardBody className='p-5 '>
                            <h2 className="fw-bold mb-2 text-center">Inscrivez-vous maintenant</h2>
                            <form onSubmit={handleNextStep}>
                                <MDBRow className='mb-2'>
                                    <MDBCol size='6'>
                                        <label htmlFor="Nom" className="form-label">Nom</label>
                                        <MDBInput
                                            size='sm'
                                            type='text'
                                            id='nom'
                                            value={nom}
                                            onChange={(e) => setNom(e.target.value)}
                                            required
                                        />
                                    </MDBCol>
                                    <MDBCol size='6'>
                                        <label htmlFor="Prénom" className="form-label">Prénom</label>
                                        <MDBInput
                                            size='sm'
                                            type='text'
                                            id='prenom'
                                            value={prenom}
                                            onChange={(e) => setPrenom(e.target.value)}
                                            required
                                        />
                                    </MDBCol>
                                </MDBRow>

                                <MDBRow className='mb-2'>
                                    <MDBCol>
                                        <label className='form-label'>Spécialité</label>
                                        <select
                                            className='form-select mb-2'
                                            value={specialite}
                                            onChange={(e) => setSpecialite(e.target.value)}
                                            required
                                        >
                                            <option value='' disabled>Choisissez votre spécialité</option>
                                            <option value='ecommerce'>E-commerce</option>
                                            <option value='développeur'>Développeur</option>
                                            <option value='autre'>Autre</option>
                                        </select>
                                        {specialite === 'autre' && (
                                            <MDBInput
                                                size='sm'
                                                type='text'
                                                id='autre_specialite'
                                                value={autreSpecialite}
                                                onChange={(e) => setAutreSpecialite(e.target.value)}
                                                required
                                                placeholder='Veuillez spécifier votre spécialité'
                                            />
                                        )}
                                    </MDBCol>
                                </MDBRow>

                                <MDBRow className='mb-2'>
                                    <MDBCol>
                                        <label htmlFor="Email" className="form-label">Email</label>
                                        <MDBInput
                                            size='sm'
                                            type='email'
                                            id='email'
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </MDBCol>
                                </MDBRow>

                                <MDBRow className='mb-2'>
                                    <MDBCol>
                                        <label htmlFor="Téléphone" className="form-label">Téléphone</label>
                                        <MDBInput
                                            size='sm'
                                            type='text'
                                            id='tel'
                                            value={tel}
                                            onChange={(e) => setTel(e.target.value)}
                                            required
                                        />
                                    </MDBCol>
                                </MDBRow>

                                <MDBRow className='mb-2'>
                                    <MDBCol>
                                        <label htmlFor="Mot_de_passe" className="form-label">Mot de passe</label>
                                        <MDBInput
                                            size='sm'
                                            type='password'
                                            id='mot_de_passe'
                                            value={mots_de_passe}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        {!validatePassword(mots_de_passe) && (
                                            <div className="text-danger">
                                                Le mot de passe doit contenir au moins 8 caractères, un chiffre et un caractère spécial.
                                            </div>
                                        )}
                                    </MDBCol>
                                </MDBRow>

                                <MDBBtn color='primary' type='submit' className='d-flex justify-content-center align-items-center' style={{ marginLeft: "220px", width: "200px" }}>
                                    s'inscrire
                                </MDBBtn>
                            </form>
                            <div className="text-muted mt-3 text-center">
                                <small>Vous avez déjà un compte? <a href="/login">Connectez-vous ici</a></small>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol col='6'>
                    <img src="https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvay1zMTYta3VuZy0xOTUzMC1seWoyMDUyLTEzLXJlZ2lzdGVybm93LTIuanBn.jpg" className="w-100 rounded-4 shadow-4" style={{ height: "990px" }} alt="" fluid />
                </MDBCol>
            </MDBRow>
            <ToastContainer />
        </MDBContainer>
    );
};

export default Register;
