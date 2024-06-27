import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, Button, Typography } from '@mui/material';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';
import ModalArchiver from '../../admin/ProfilParticipant/ModalArchiver';
import ModalDesarchiver from '../../admin/ProfilParticipant/modalDesarchiver';
import ModalModifier from '../ProfilParticipant/ModalModifier';

const ProfilParticipant = () => {
  const [participants, setParticipants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModalArchiver, setShowModalArchiver] = useState(false);
  const [showModalDesarchiver, setShowModalDesarchiver] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [showModalModifier, setShowModalModifier] = useState(false);
  const [editedParticipant, setEditedParticipant] = useState(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get('http://localhost:3000/participant/');
        const data = response.data;
        if (data.success) {
          const updatedParticipants = data.participants.map(participant => {
            participant.status = participant.status === 'archived' ? 0 : 1;
            return participant;
          });
          setParticipants(updatedParticipants);
        } else {
          console.error('Response data is not as expected:', data);
        }
      } catch (error) {
        console.error('Error fetching participant data:', error);
      }
    };

    fetchParticipants();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(participants.length / 2)) {
      setCurrentPage(newPage);
    }
  };

  const handleModifierClick = (participant) => {
    setSelectedParticipant(participant);
    setEditedParticipant(participant);
    if (participant.id_p) {
      setShowModalModifier(true);
    } else {
      console.error('ID du participant non défini');
    }
  };

  const handleArchiverClick = (participant) => {
    setSelectedParticipant(participant);
    setShowModalArchiver(true);
  };

  const handleDesarchiverClick = (participant) => {
    setSelectedParticipant(participant);
    setShowModalDesarchiver(true);
  };

  const indexOfLastCard = currentPage * 2;
  const indexOfFirstCard = indexOfLastCard - 2;
  const currentParticipants = participants.slice(indexOfFirstCard, indexOfLastCard);

  const updateParticipantData = (updatedUserData) => {
    setParticipants(prevState => {
      const updatedParticipants = prevState.map(participant => {
        if (participant.id_p === updatedUserData.id_p) {
          return { ...participant, ...updatedUserData };
        }
        return participant;
      });
      return updatedParticipants;
    });
  };

  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: '#818ea1' }}>
    <h3 className="text-center mt-3">Gestions des Participants</h3>
      <MDBContainer>
        <MDBRow>
          {currentParticipants.map((participant) => (
            <MDBCol md="6" key={participant.id_p}>
              <MDBCard style={{ borderRadius: '15px', marginTop: '40px', backgroundColor: '#fff' }}>
                <MDBCardBody className="text-center" style={{ height: '350px' }}>
                  <Avatar src={`http://localhost:3000/uploads/${participant.Avatar}`} alt="Avatar" style={{ width: '120px', height: '150px', borderRadius: '20%', marginBottom: '20px' }} />
                 <div style={{marginTop:'-60px'}}>  <MDBTypography tag="h4">{participant.prenom} {participant.nom}</MDBTypography>
                  <MDBTypography tag="p" className="text-muted mb-4">
                    {participant.email} <span className="mx-2">|</span> <a href="#!">{participant.domaine}</a>
                  </MDBTypography>
                  {participant.status === 0 ? (
                    <MDBBtn rounded size="lg" onClick={() => handleDesarchiverClick(participant)}>
                      Désarchiver
                    </MDBBtn>
                  ) : (
                    <>
                      <MDBBtn rounded size="lg" onClick={() => handleModifierClick(participant)}>
                        Modifier
                      </MDBBtn>
                      <MDBBtn rounded size="lg" onClick={() => handleArchiverClick(participant)}>
                        Archiver
                      </MDBBtn>
                    </> 
                  )} </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          ))}
        </MDBRow>
        <MDBRow>
          <MDBCol className="d-flex justify-content-center" style={{ marginTop: '15px' }}>
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button onClick={() => handlePageChange(currentPage - 1)} className="page-link">Précédent</button>
                </li>
                <li className={`page-item ${currentPage === Math.ceil(participants.length / 2) ? 'disabled' : ''}`}>
                  <button onClick={() => handlePageChange(currentPage + 1)} className="page-link">Suivant</button>
                </li>
              </ul>
            </nav>
          </MDBCol>
        </MDBRow>

        <ModalModifier
          isOpen={showModalModifier}
          onClose={() => setShowModalModifier(false)}
          userData={editedParticipant}
          userId={editedParticipant ? editedParticipant.id_p : null}
          updateParticipantData={updateParticipantData}
          handleToastMessage={(message) => { /* Ajoutez une fonction de gestion de messages toast si nécessaire */ }}
        />

        <ModalArchiver
          isOpen={showModalArchiver}
          onClose={() => setShowModalArchiver(false)}
          participant={selectedParticipant}
          handleToastMessage={(message) => { /* Ajoutez une fonction de gestion de messages toast si nécessaire */ }}
          updateParticipantData={updateParticipantData}
        />

        <ModalDesarchiver
          isOpen={showModalDesarchiver}
          onClose={() => setShowModalDesarchiver(false)}
          participant={selectedParticipant}
          handleToastMessage={(message) => { /* Ajoutez une fonction de gestion de messages toast si nécessaire */ }}
          updateParticipantData={updateParticipantData}
        />
      </MDBContainer>
    </div>
  );
};

export default ProfilParticipant;
