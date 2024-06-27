import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Avatar, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const PublicationsList = () => {
  const [publications, setPublications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPublication, setSelectedPublication] = useState(null);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await axios.get('http://localhost:3000/publication/lister');
        setPublications(response.data.liste);
      } catch (error) {
        console.error('Erreur lors de la récupération des publications :', error);
      }
    };

    fetchPublications();
  }, []);

  const handleClick = (event, publication) => {
    setAnchorEl(event.currentTarget);
    setSelectedPublication(publication);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleShare = (method) => {
    handleClose();
    switch (method) {
      case 'Email':
        handleEmailShare();
        break;
      case 'Facebook':
        handleFacebookShare();
        break;
      case 'Google':
        handleGoogleShare();
        break;
      default:
        console.error('Méthode de partage non prise en charge :', method);
    }
  };

  const handleEmailShare = () => {
    // Vous pouvez utiliser une librairie comme 'emailjs-com' pour envoyer un email
    // par exemple :
    window.emailjs.send("service_...", "template_...", {
      // détails de l'email à envoyer
    })
    .then(response => {
      console.log("Email envoyé avec succès :", response);
    })
    .catch(error => {
      console.error("Erreur lors de l'envoi de l'email :", error);
    });
  };

  const handleFacebookShare = () => {
    // Ouvrez une fenêtre pop-up pour le partage sur Facebook
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, 'facebook-share-dialog', 'width=626,height=436');
  };

  const handleGoogleShare = () => {
    // Ouvrez une fenêtre pop-up pour le partage sur Google
    window.open(`https://plus.google.com/share?url=${encodeURIComponent(window.location.href)}`, 'google-share-dialog', 'width=626,height=436');
  };

  return (
    <div className="flex flex-wrap justify-center gap-6 p-4">
      {publications.map((publication) => (
        <div key={publication.id_public} className="relative overflow-hidden text-white shadow-lg rounded-xl bg-gray-900" style={{ width: 'calc(40% - 2rem)' }}>
          <img src='https://media.istockphoto.com/id/1312139041/photo/learning-on-the-job.jpg?s=2048x2048&w=is&k=20&c=mQ-y57Zcx84nzmc17a_sedKHW4Pn57732LTd2fmzgUA=' alt={publication.titre} style={{ width: '100%', height: 'auto' }} />
          <div className="absolute inset-0 w-full h-full bg-black opacity-40"></div>
          <div className="absolute top-4 right-4">

              <MoreVertIcon />
           
     
          </div>

          <div  className="p-4" style={{padding:'20px'}}>
          <p className="block font-sans text-sm font-light leading-relaxed text-white">
  Il y 'a  : {publication.temps_ecoule}
</p>
            <h3 className="block font-sans text-lg font-medium leading-snug text-white">
              {publication.titre}
            </h3>
         
            <p className="block font-sans text-sm font-light leading-relaxed text-white">
              {publication.description}
            </p>
            <p className="block font-sans text-sm font-light leading-relaxed text-white">
              {publication.contenu}
            </p>
            <div className="flex items-center gap-3 mt-4 group">
            <Avatar 
  src={publication.participant ? `http://localhost:3000/uploads/${publication.participant.avatar}` : 
       `http://localhost:3000/uploads/${publication.instructeur_Avatar}`} 
  alt="Avatar" 
  style={{ width: '30px', height: '30px', borderRadius: '50%' }} 
/>
{publication.participant ? (
                <span className="text-white">
                  {publication.participant.nom} {publication.participant.prenom} (Participant)
                </span>
              ) : (
                <span className="text-white">
                  {publication.instructeur_nom} {publication.instructeur_prenom} (Instructeur)
                </span>
              )}

            </div>
          
          </div>
        </div>
      ))}
    </div>
  );
};

export default PublicationsList;
