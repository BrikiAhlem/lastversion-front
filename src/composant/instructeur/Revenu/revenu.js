import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import { Card } from '@mui/material';

const TableauRevenu = () => {
  const [revenuData, setRevenuData] = useState([]);
  const [totalRevenu, setTotalRevenu] = useState(0);
  const [nombreFormations, setNombreFormations] = useState(0);

  useEffect(() => {
    const instructeurData = JSON.parse(localStorage.getItem('instructeurData'));
    if (instructeurData && instructeurData.id) {
      fetchRevenuInstructeur(instructeurData.id);
    } else {
      console.error('Aucun instructeur trouvé dans le localStorage');
    }
  }, []);

  const fetchRevenuInstructeur = async (instructeurId) => {
    try {
      const response = await axios.get(`http://localhost:3000/instructeur/revenu/${instructeurId}`);
      const data = response.data;
      if (data.success) {
        setRevenuData(data.details);
        setTotalRevenu(data.revenu);
        setNombreFormations(data.nombreFormations);
      } else {
        console.error('Erreur lors de la récupération du revenu:', data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du revenu:', error);
    }
  };

  const columns = [
    { field: 'formationId', headerName: 'ID de la Formation', width: 200 },
    { field: 'prix', headerName: 'Prix', width: 200 },
    { field: 'nombreParticipants', headerName: 'Nombre de Participants', width: 200 },
    { field: 'revenu', headerName: 'Revenu', width: 200 },
  ];

  return (
    <div style={{
      backgroundColor: 'hsl(218, 41%, 15%)',
      backgroundImage: 'radial-gradient(650px circle at 0% 0%, hsl(218, 41%, 35%) 15%, hsl(218, 41%, 30%) 35%, hsl(218, 41%, 20%) 75%, hsl(218, 41%, 19%) 80%, transparent 100%), radial-gradient(1250px circle at 100% 100%, hsl(218, 41%, 45%) 15%, hsl(218, 41%, 30%) 35%, hsl(218, 41%, 20%) 75%, hsl(218, 41%, 19%) 80%, transparent 100%)',
      minHeight: '100vh',
      padding: '20px',
      position: 'relative', // Ajout d'une position relative pour positionner la card
    }}>
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: '1', // Assurez-vous que la card est au-dessus du tableau
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Couleur de fond de la card
        padding: '10px',
        borderRadius: '8px',
        animation: 'fade-in 0.5s ease-out', // Ajout d'une animation fade-in
      }}>
        <Card style={{ padding: '10px', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <h2 style={{ color: 'white', margin: '0' }}>Revenu Total: {totalRevenu} TND</h2>
          <h3 style={{ color: 'white', margin: '0' }}>Nombre de Formations: {nombreFormations}</h3>
        </Card>
      </div>
      <div style={{
        backgroundColor: '#eee',
        height: 400,
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '20px',
        marginTop: '120px',
        padding: '20px',
        borderRadius: '8px',
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Revenu de l'Instructeur</h1>
        <div style={{ height: 'calc(100% - 52px)', width: '100%', backgroundColor: '#fff' }}>
          <DataGrid
            rows={revenuData}
            columns={columns}
            components={{
              Toolbar: GridToolbar,
            }}
            getRowId={(row) => row.formationId}
            sx={{
              '& .MuiDataGrid-footerContainer': {
                backgroundColor: '#eee',
              },
              '& .MuiDataGrid-toolbarContainer': {
                backgroundColor: '#eee',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#eee',
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TableauRevenu;
