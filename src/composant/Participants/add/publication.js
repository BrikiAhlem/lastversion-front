import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput
} from 'mdb-react-ui-kit';

function PublicationParticipant() {
  const history = useHistory();
  const [value, setValue] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const participantData = JSON.parse(localStorage.getItem('participantData'));
    const participantId = participantData ? participantData.id_p : null;
    const token = localStorage.getItem('token');

    const formData = {
      titre: e.target.title.value,
      description: e.target.description.value,
      contenu: e.target.content.value,
      id_participant: participantId
    };

    try {
      const response = await axios.post(
        'http://localhost:3000/publication/ajouterParticipant',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      );

      if (response.status === 201) {
        alert('Publication créée avec succès.');
        history.push('/');
      }
    } catch (error) {
      console.error('Erreur lors de la publication :', error);
      alert('Erreur lors de la publication. Veuillez réessayer.');
    }
  };

  return (
    <div style={{ backgroundColor: '#8A2BE2', minHeight: '100vh' }}>
      <style>
        {`
          .custom-label {
            transform: translateY(-10px);
            marginButton:20px
          }
        `}
      </style>
      <MDBContainer className="my-59 d-flex justify-content-center">
        <MDBCard style={{ maxWidth: '800px', marginTop:'50px' , height:'600px' }}>
          <MDBRow className='g-0'>
            <MDBCol md='6'>
              <MDBCardImage src='https://img.freepik.com/vecteurs-premium/vecteur-modifiable-illustration-plate-marketing-mobile_203633-3457.jpg?w=740' alt="login form" className='rounded-start w-100'/>
            </MDBCol>
            <MDBCol md='6'>
              <MDBCardBody className='d-flex flex-column'>
                <div className='d-flex flex-column align-items-center mt-2'>
                  <MDBIcon fas icon="cubes fa-3x mb-3" style={{ color: '#ff6219' }}/>
                  <span className="h1 fw-bold mb-0 text-center">Publications</span>
                </div>
                <h5 className="fw-normal my-4 pb-3 text-center" style={{letterSpacing: '1px'}}>Ajouter une publication</h5>
                <form onSubmit={handleSubmit}>
                    <label>Titre </label>
                  <MDBInput wrapperClass='mb-4' placeholder='Titre' id='title' type='text' size="lg" labelClass='custom-label' />
                  <label>Description </label>
                  <MDBInput wrapperClass='mb-4' placeholder='Description' id='description' type='text' size="lg" labelClass='custom-label' />
                  <label>Content </label>
                  <MDBInput wrapperClass='mb-4' placeholder='Content' id='content' type='text' size="lg" labelClass='custom-label' />
                  <div className="d-flex justify-content-center">
                    <MDBBtn type="submit" className="mb-4 px-5" color='dark' size='lg'>Publier</MDBBtn>
                  </div>
                </form>
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </MDBContainer>
    </div>
  );
}

export default PublicationParticipant;
