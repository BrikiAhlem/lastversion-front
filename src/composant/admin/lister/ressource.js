import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import { Button, Modal, TextField, Box, Typography } from '@mui/material';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
} from 'mdb-react-ui-kit';

const defaultImageSrc = 'https://images.pexels.com/photos/8250994/pexels-photo-8250994.jpeg?auto=compress&cs=tinysrgb&w=600';

const ListeRessourceAdmin = () => {
  const [token, setToken] = useState('');
  const [Ressource, setRessource] = useState([]);
  const [selectedRessource, setSelectedRessource] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [RessourceToDelete, setRessourceToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRessource, setFilteredRessource] = useState([]);

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token');
    if (tokenFromStorage) {
      setToken(tokenFromStorage);
    }
  }, []);

  useEffect(() => {
    const fetchRessource = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/Ressource/liste`);
        setRessource(response.data.liste);
        setFilteredRessource(response.data.liste);
      } catch (error) {
        console.error('Error fetching Ressource:', error);
      }
    };

    fetchRessource();
  }, []);

  useEffect(() => {
    const fetchSearchRessource = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/Ressource/searchRessourcesByTitreAdmin`, { params: { titre: searchTerm } });
        setFilteredRessource(response.data.Ressources);
      } catch (error) {
        console.error('Error searching Ressource:', error); 
      }  
    };

    if (searchTerm) {
      fetchSearchRessource();
    } else {
      setFilteredRessource(Ressource);
    }
  }, [searchTerm, Ressource]);

  const handleSupprimer = async (id_r) => {
    try {
      await axios.delete(`http://localhost:3000/Ressource/supprimer/${id_r}`, {
        headers: {
          authorization: ` ${token}`,
        },
      });
      toast.success('Ressource supprimée avec succès.');
      const updatedRessource = Ressource.filter(form => form.id_r !== id_r);
      setRessource(updatedRessource);
      setFilteredRessource(updatedRessource);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting Ressource:', error);
      toast.error('Erreur lors de la suppression de la Ressource.');
    }
  };

  const handleModifier = (Ressource) => {
    setSelectedRessource(Ressource);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedRessource(null);
  };

  const handleConfirmDelete = (Ressource) => {
    setShowDeleteModal(true);
    setRessourceToDelete(Ressource);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setRessourceToDelete(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedRessource((prevRessource) => ({
      ...prevRessource,
      contenu: file,
    }));
  };

  const handleSubmitModifier = async (modifiedRessource) => {
    try {
      const formData = new FormData();
      formData.append('titre', modifiedRessource.titre); 
      formData.append('description', modifiedRessource.description); 
      formData.append('contenu', modifiedRessource.contenu); 
   
      const response = await axios.put(`http://localhost:3000/Ressource/modifier/${modifiedRessource.id_r}`, formData, {
        headers: {
          authorization: ` ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Ressource modifiée avec succès.');
      const updatedRessource = Ressource.map(form => (form.id_r === modifiedRessource.id_r ? modifiedRessource : form));
      setRessource(updatedRessource);
      setFilteredRessource(updatedRessource);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating Ressource:', error);
      toast.error('Erreur lors de la modification de la Ressource.');
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const highlightSearchTerm = (text) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} style={{ color: 'red' }}>{part}</span>
      ) : (
        part
      )
    );
  };

  const itemsPerPage = 2;
  const numPages = Math.ceil(filteredRessource.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedRessource = filteredRessource.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container">
      <div className="row">
        {paginatedRessource.map(Ressource => (
          <div className="col-md-6" key={Ressource.id_r}>
            <div className="mx-2 my-3">
              <MDBCard style={{ maxWidth: '22rem', backgroundColor: '#eee', marginLeft: '150px' }}>
                <MDBCardBody>
                  <MDBCardImage src={Ressource.image || defaultImageSrc} alt="Card image cap" top />
                  <MDBCardTitle>{Ressource.titre}</MDBCardTitle>
                  <MDBCardText>{Ressource.description}</MDBCardText>
                  <Link to={`/RessourceP/getRessourceById/${Ressource.id_r}`} className="details-button">Voir les détails</Link>
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                    <Button onClick={() => handleModifier(Ressource)} variant="contained" color="primary" sx={{ borderRadius: '20px' }}>Modifier</Button>
                    <Button onClick={() => handleConfirmDelete(Ressource)} variant="contained" color="secondary" sx={{ borderRadius: '20px' }}>Supprimer</Button>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </div>
          </div>
        ))}
      </div>

      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <Pagination count={numPages} page={page} onChange={(event, value) => setPage(value)} />
      </Box>

      <Modal
        open={showEditModal}
        onClose={handleCloseEditModal}
        aria-labelledby="modal-edit-title"
        aria-describedby="modal-edit-description"
      >
        <Box sx={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <Typography id="modal-edit-title" variant="h6" component="h2">
            Modifier la Ressource
          </Typography>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmitModifier(selectedRessource);
          }}>
            <TextField 
              label="Titre" 
              value={selectedRessource?.titre} 
              onChange={(e) => setSelectedRessource(prevState => ({ ...prevState, titre: e.target.value }))} 
              fullWidth 
              margin="normal"
            />
            <TextField 
              label="Description" 
              value={selectedRessource?.description} 
              onChange={(e) => setSelectedRessource(prevState => ({ ...prevState, description: e.target.value }))} 
              fullWidth 
              margin="normal"
            />
            <input 
              type="file" 
              onChange={handleFileChange} 
              style={{ marginTop: '1rem' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <Button type="submit" variant="contained" color="primary">Enregistrer</Button>
              <Button variant="contained" color="secondary" onClick={handleCloseEditModal}>Annuler</Button>
            </Box>
          </form>
        </Box>
      </Modal>

      <Modal
        open={showDeleteModal}
        onClose={handleCancelDelete}
        aria-labelledby="modal-delete-title"
        aria-describedby="modal-delete-description"
      >
        <Box sx={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <Typography id="modal-delete-title" variant="h6" component="h2">
            Confirmer la suppression
          </Typography>
          <Typography id="modal-delete-description" sx={{ mt: 2 }}>
            Êtes-vous sûr de vouloir supprimer cette ressource ?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <Button variant="contained" color="secondary" onClick={() => handleSupprimer(RessourceToDelete.id_r)}>Supprimer</Button>
            <Button variant="contained" onClick={handleCancelDelete}>Annuler</Button>
          </Box>
        </Box>
      </Modal>

      <ToastContainer />
    </div>
  );
}

export default ListeRessourceAdmin;
