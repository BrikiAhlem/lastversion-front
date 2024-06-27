import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBInput, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../css/ParticipantRegister.css';

const ParticipantRegister = () => {
    const history = useHistory();
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [domaine, setDomaine] = useState('');
    const [autreDomaine, setAutreDomaine] = useState('');
    const [categorie, setCategorie] = useState('');
    const [autreCategorie, setAutreCategorie] = useState('');
    const [emailP, setEmail] = useState('');
    const [mots_de_passeP, setPassword] = useState('');
    const [tel, setTel] = useState('');

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
        event.preventDefault(); // Empêcher la soumission par défaut du formulaire

        let valid = true;
        if (!nom || !prenom || !emailP || !domaine || !categorie || !mots_de_passeP || !tel) {
            valid = false;
            toast.error('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        if (!validateEmail(emailP)) {
            valid = false;
            toast.error('Veuillez entrer une adresse e-mail valide.');
            return;
        }

        if (!validatePhoneNumber(tel)) {
            valid = false;
            toast.error('Veuillez entrer un numéro de téléphone valide.');
            return;
        }

        if (!validatePassword(mots_de_passeP)) {
            valid = false;
            toast.error('Le mot de passe doit contenir au moins 8 caractères, un chiffre et un caractère spécial.');
            return;
        }

        if (valid) {
            const response = await fetch('http://localhost:3000/participant/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nom,
                    prenom,
                    emailP,
                    domaine: domaine === 'autre' ? autreDomaine : domaine,
                    categorie: categorie === 'autre' ? autreCategorie : categorie,
                    mots_de_passeP,
                    tel,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Inscription réussie:', result);
                toast.success('Inscription réussie!');
               
                history.push('/login');
            } else {
                if (response.status === 409) { // 409 est le code d'erreur pour email déjà existant
                    toast.error('Cette adresse e-mail est déjà utilisée. Veuillez en choisir une autre.');
                } else {
                    console.error('Échec de l\'inscription:', response.statusText);
                    toast.error('Échec de l\'inscription. Veuillez réessayer.');
                }
            }
        }
    };

    return (
        <MDBContainer fluid className='my-1' style={{ marginTop: "-100px" }}>
            <MDBRow className=''>
                <MDBCol col='6'>
                    <MDBCard className='my-5 cascading-right' style={{ width: "100%", height: "90%", background: 'hsla(0, 0%, 100%, 0.55)', backdropFilter: 'blur(30px)', borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.7)" }}>
                        <MDBCardBody className='p-5'>
                            <h2 className="fw-bold mb-5 text-center">S'inscrire maintenant</h2>
                            <form onSubmit={handleNextStep}>
                                <MDBRow className='mb-2'>
                                    <MDBCol size='6'>
                                        <label htmlFor="Nom" className="form-label">Nom</label>
                                        <MDBInput
                                            name='nom'
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
                                            name='prenom'
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
                                        <label className='form-label'>Domaine</label>
                                        <select
                                            name='domaine'
                                            className='form-select mb-2'
                                            value={domaine}
                                            onChange={(e) => setDomaine(e.target.value)}
                                            required
                                        >
                                            <option value='' disabled>Choisissez votre domaine</option>
                                            <option value='ecommerce'>E-commerce</option>
                                            <option value='Développement web'>Développement web</option>
                                            <option value='autre'>Autre</option>
                                        </select>
                                        {domaine === 'autre' && (
                                            <MDBInput
                                                name='autreDomaine'
                                                size='sm'
                                                type='text'
                                                id='autreDomaine'
                                                value={autreDomaine}
                                                onChange={(e) => setAutreDomaine(e.target.value)}
                                                required
                                                placeholder='Veuillez spécifier votre domaine'
                                            />
                                        )}
                                    </MDBCol>
                                    <MDBCol>
                                        <label className='form-label'>Catégorie</label>
                                        <select
                                            name='categorie'
                                            className='form-select mb-2'
                                            value={categorie}
                                            onChange={(e) => setCategorie(e.target.value)}
                                            required
                                        >
                                            <option value='' disabled>Choisissez votre catégorie</option>
                                            <option value='professionnel'>Professionnel</option>
                                            <option value='étudiant'>Étudiant</option>
                                            <option value='autre'>Autre</option>
                                        </select>
                                        {categorie === 'autre' && (
                                            <MDBInput
                                                name='autreCategorie'
                                                size='sm'
                                                type='text'
                                                id='autreCategorie'
                                                value={autreCategorie}
                                                onChange={(e) => setAutreCategorie(e.target.value)}
                                                required
                                                placeholder='Veuillez spécifier votre catégorie'
                                            />
                                        )}
                                    </MDBCol>
                                </MDBRow>

                                <MDBRow className='mb-2'>
                                    <MDBCol>
                                        <label htmlFor="Email" className="form-label">Email</label>
                                        <MDBInput
                                            name='emailP'
                                            size='sm'
                                            type='email'
                                            id='email'
                                            value={emailP}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </MDBCol>
                                </MDBRow>

                                <MDBRow className='mb-2'>
                                    <MDBCol>
                                        <label htmlFor="téléphone" className="form-label">Téléphone</label>
                                        <MDBInput
                                            name='tel'
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
                                            name='mots_de_passeP'
                                            size='sm'
                                            type='password'
                                            id='mot_de_passe'
                                            value={mots_de_passeP}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        {!validatePassword(mots_de_passeP) && (
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
                            <div className="text-muted mt-2 text-center">
                                <small>Vous avez déjà un compte? <a href="/login">Connectez-vous ici</a></small>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol col='6'>
                    <img src="https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA2L2stczE2LWt1bmctMjM1NzktbHlqMjA1Mi0xNC1yZWdpc3RyYXRpb25mb3JtLmpwZw.jpg" class="w-100 rounded-4 shadow-4" style={{ height: "990px" }} alt="" fluid />
                </MDBCol>
            </MDBRow>
            <ToastContainer />
        </MDBContainer>
    );
};

export default ParticipantRegister;
