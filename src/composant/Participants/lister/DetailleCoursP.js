import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import '../../../css/singleCoursStyle.css';
import { Link } from 'react-router-dom';
import { MDBBtn } from 'mdb-react-ui-kit';
import { FaEye } from 'react-icons/fa';

const SingleCoursP = () => {
  const { id, formation_id } = useParams();
  const [cours, setCours] = useState(null);
  const [quiz, setQuiz] = useState([]);

  useEffect(() => {
    const fetchCours = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/coursPayant/getcoursById/${id}`);
        setCours(response.data.cours[0]);
        fetchQuiz(response.data.cours[0].id_cp);
      } catch (error) {
        console.error('Erreur lors de la récupération du cours :', error);
      }
    };

    const fetchQuiz = async (courseId) => {
      try {
        const response = await axios.get(`http://localhost:3000/quiz/getQuizByCourseId/${courseId}`);
        setQuiz(response.data.Quiz);
      } catch (error) {
        console.error('Erreur lors de la récupération des quiz du cours :', error);
      }
    };

    fetchCours();
  }, [id]);

  if (!cours) {
    return <div>Loading...</div>;
  }

  const fileSource = cours.contenu ? `http://localhost:3000/uploads/${cours.contenu}` : '';

  return (
    <div className="background-container">
      <div className="background-image">
        <div className="single-cours-container">
          <h1 className="centered-title">Cours de : {cours.titre}</h1>
          <div className="cours-info">
            <p>Description : {cours.description}</p>
          </div>
          <div className="cours-content">
            {cours.contenu && (
              <div className="formation-content">
                <h3>Contenu du cours :</h3>
                <div className="file-preview">
                  <iframe title="plan de la formation" src={fileSource}></iframe>
                </div>
                <a href={fileSource} download={cours.contenu.split('.').pop()} target="_blank" rel="noopener noreferrer">
                  <button className="download-button">
                    Télécharger le fichier <FontAwesomeIcon icon={faDownload} />
                  </button>
                </a>
              </div>
            )}
          
            <div>
              <h3> Passe le Quiz associés a cet cours pour passe a la deusieme cours  :</h3>
              <ul>
                {quiz.length === 0 ? (
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <p>Il n'y a pas de quiz pour ce cours.</p>
                  </li>
                ) : (
                  quiz.map(q => (
                    <li key={q.id_q} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <FaEye style={{ marginRight: '5px' }} />
                      <Link to={`/getQuizById/${q.id_q}/${formation_id}`} className="details-button">
                        {q.titre}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCoursP;
