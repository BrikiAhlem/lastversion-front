import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBRipple } from 'mdb-react-ui-kit';
import '../../../css/ListecourAdmin.css'; // Importez votre fichier CSS

const ListecourAdmin = () => {
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
        const response = await axios.get('http://localhost:3000/coursgratuis/lister');
        setCours(response.data.liste);
      } catch (error) {
        console.error('Error fetching cours:', error);
      }
    };
    fetchCours();
  }, []);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCours = cours.slice(indexOfFirstCard, indexOfFirstCard + cardsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = (id) => {
    setShowDeleteModal(true);
    setCourseToDelete(id);
  };

  const handleEdit = (id) => {
    setShowEditModal(true);
    const course = cours.find((c) => c.id_cg === id);
    setCourseToEdit(course);
    setEditedTitle(course.titre);
    setEditedDescription(course.description);
    setEditedFile(null); // Reset the file input
  };

  const handleSaveEdit = async () => {
    const formData = new FormData();
    formData.append('titre', editedTitle);
    formData.append('description', editedDescription);
    formData.append('status', 2); // Set status to 2 when editing
    if (editedFile) {
      formData.append('content', editedFile); // Append the file to the form data
    }
    try {
      await axios.put(`http://localhost:3000/coursgratuis/modifier/${courseToEdit.id_cg}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const updatedCours = cours.map((c) =>
        c.id_cg === courseToEdit.id_cg ? { ...c, titre: editedTitle, description: editedDescription, status: 2 } : c
      );
      setCours(updatedCours);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/coursgratuis/supprimer/${courseToDelete}`);
      setCours(cours.filter((c) => c.id_cg !== courseToDelete));
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
            <MDBCard key={c.id_cg} className="card-custom" style={{border:"1px solid black", marginTop:'20px'}}>
              <MDBRipple rippleColor="light" rippleTag="div" style={{height:"300px"}}>
                <MDBCardImage 

                  className="card-image"
                  src="https://images.pexels.com/photos/7657407/pexels-photo-7657407.jpeg?auto=compress&cs=tinysrgb&w=600"
                  fluid
                  alt="..."
                />
              </MDBRipple>
              <MDBCardBody className="card-body">
                <MDBCardTitle>{c.titre}</MDBCardTitle>
                <MDBCardText>{c.description}</MDBCardText>
                <button className="btn btn-success btn-custom" onClick={() => handleEdit(c.id_cg)}>
                  Modifier
                </button>
                <button className="btn btn-danger btn-custom" onClick={() => handleDelete(c.id_cg)}>
                  Supprimer
                </button>
              </MDBCardBody>
            </MDBCard>
          ))
        ) : (
          <div>Aucun cours trouvé.</div>
        )}
      </div>
      <nav aria-label="Page navigation example" className="mt-3">
        <ul className="pagination">
          {Array.from({ length: Math.ceil(cours.length / cardsPerPage) }, (_, i) => (
            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <button onClick={() => paginate(i + 1)} className="page-link">
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {/* Modal de suppression */}
      {showDeleteModal && (
        <div className="modal modal-custom" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-custom" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmer la suppression</h5>
                <button type="button" style={{width:"50px",color:'white'}} className="close" aria-label="Close" onClick={() => setShowDeleteModal(false)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">Êtes-vous sûr de vouloir supprimer ce cours ?</div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Annuler
                </button>
                <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal de modification */}
      {showEditModal && (
        <div className="modal modal-custom" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-custom" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modifier le cours</h5>
                <button style={{width:"50px",color:'red'}} type="button" className="close" aria-label="Close" onClick={() => setShowEditModal(false)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="editTitle">Titre</label>
                  <input
                    type="text"
                    className="form-control"
                    id="editTitle"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="editDescription">Description</label>
                  <textarea
                    className="form-control"
                    id="editDescription"
                    rows="3"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="editFile">Contenu</label>
                  <input
                    type="file"
                    className="form-control"
                    id="editFile"
                    onChange={(e) => setEditedFile(e.target.files[0])}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Fermer
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSaveEdit}>
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListecourAdmin;