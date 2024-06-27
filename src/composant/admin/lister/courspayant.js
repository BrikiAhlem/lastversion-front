import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBRipple
} from 'mdb-react-ui-kit';

const ListecourPayantAdmin = () => {
  const [cours, setCours] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedFile, setEditedFile] = useState(null);
  const cardsPerPage = 3;

  useEffect(() => {
    const fetchCours = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/coursPayant/getAllcourssAdminConsulter`);
        setCours(response.data.liste);
      } catch (error) {
        console.error('Error fetching cours:', error);
      }
    };

    fetchCours();
  }, []);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCours = cours.slice(indexOfFirstCard, indexOfLastCard);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = (id) => {
    setShowDeleteModal(true);
    setCourseToDelete(id);
  };

  const handleEdit = (id) => {
    setShowEditModal(true);
    const course = cours.find(c => c.id_cp === id);
    setCourseToEdit(course);
    setEditedTitle(course.titre);
    setEditedDescription(course.description);
  };

  const handleFileChange = (e) => {
    setEditedFile(e.target.files[0]);
  };

  const handleSaveEdit = async () => {
    try {
      const formData = new FormData();
      formData.append('titre', editedTitle);
      formData.append('description', editedDescription);
      if (editedFile) {
        formData.append('file', editedFile);
      }

      await axios.put(`http://localhost:3000/coursPayant/modifier/${courseToEdit.id_cp}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedCours = cours.map(c => (c.id_cp === courseToEdit.id_cp ? { ...c, titre: editedTitle, description: editedDescription } : c));
      setCours(updatedCours);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/coursPayant/supprimer/${courseToDelete}`);
      setCours(cours.filter((c) => c.id_cp !== courseToDelete));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="d-flex flex-wrap justify-content-center">
        {currentCours && currentCours.length > 0 ? (
          currentCours.map((c) => (
            <div key={c.id_cp} className="mx-2 my-3">
              <MDBCard style={{ maxWidth: '22rem' }}>
                <MDBRipple rippleColor='light' rippleTag='div' className='bg-image hover-overlay'>
                  <MDBCardImage src='https://images.pexels.com/photos/7657407/pexels-photo-7657407.jpeg?auto=compress&cs=tinysrgb&w=600' fluid alt='...' />
                  <a href={`#/coursPayant/getCoursGById/${c.id_cp}`}>
                    <div className='mask' style={{ backgroundColor: 'rgba(251, 251, 251, 0.15)' }}></div>
                  </a>
                </MDBRipple>
                <MDBCardBody>
                  <MDBCardTitle>{c.titre}</MDBCardTitle>
                  <MDBCardText>{c.description}</MDBCardText>
                  <button className="btn btn-success" onClick={() => handleEdit(c.id_cp)}>
                    Modifier
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(c.id_cp)}>
                    Supprimer
                  </button>
                </MDBCardBody>
              </MDBCard>
            </div>
          ))
        ) : (
          <div>Aucun cours trouvé.</div>
        )}
      </div>
      <nav aria-label="Page navigation example" className="mt-3">
        <ul className="pagination">
          {Array.from({ length: Math.ceil(cours.length / cardsPerPage) }, (_, i) => (
            <li key={i+1} className={`page-item ${currentPage === i+1 ? 'active' : ''}`}>
              <button onClick={() => paginate(i+1)} className="page-link">{i+1}</button>
            </li>
          ))}
        </ul>
      </nav>

      {showDeleteModal && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmer la suppression</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShowDeleteModal(false)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Êtes-vous sûr de vouloir supprimer ce cours ?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Annuler</button>
                <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>Supprimer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modifier le cours</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShowEditModal(false)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="editTitle">Titre</label>
                  <input type="text" className="form-control" id="editTitle" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="editDescription">Description</label>
                  <textarea className="form-control" id="editDescription" rows="3" value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)}></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="editFile">Contenu du cours</label>
                  <input type="file" className="form-control" id="editFile" onChange={handleFileChange} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Fermer</button>
                <button type="button" className="btn btn-primary" onClick={handleSaveEdit}>Enregistrer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListecourPayantAdmin;
