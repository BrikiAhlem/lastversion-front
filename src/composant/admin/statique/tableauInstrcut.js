import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { colors } from '@mui/material';

const Tableau = () => {
  const [mergedData, setMergedData] = useState([]);

  useEffect(() => {
    fetchInstructeurs();
  }, []);

  const fetchInstructeurs = async () => {
    try {
      const response = await fetch('http://localhost:3000/instructeur/lister');
      if (response.ok) {
        const data = await response.json();
        const dataWithIds = data.liste.map((item, index) => ({
          ...item,
          id: index + 1
        }));
        setMergedData(dataWithIds);
      } else {
        console.error('Erreur lors de la récupération des instructeurs:', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des instructeurs:', error);
    }
  };
  
  const exportToExcel = async () => {
    try {
      const response = await fetch('http://localhost:3000/export/excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: mergedData }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'data.xlsx');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } else {
        console.error('Erreur lors de l\'exportation en Excel:', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de l\'exportation en Excel:', error);
    }
  };

  const columns = [
    {
      field: 'nomInstructeur',
      headerName: 'Instructeur',
      width: 250,
      valueGetter: (params) => `${params.row.nomInstructeur} ${params.row.prenomInstructeur}`,
      cellClassName: 'white-text',
    },
    { field: 'titreCours', headerName: 'Titre du Cours', width: 200 , cellClassName: 'white-text'},
    { field: 'titreFormation', headerName: 'Titre de la Formation', width: 200 , cellClassName: 'white-text'},
    { field: 'titreRessource', headerName: 'Titre de la Ressource', width: 200 , cellClassName: 'white-text'},
  ];

  return (
    <div style={{
      backgroundColor: 'hsl(218, 41%, 15%)',
      backgroundImage: 'radial-gradient(650px circle at 0% 0%, hsl(218, 41%, 35%) 15%, hsl(218, 41%, 30%) 35%, hsl(218, 41%, 20%) 75%, hsl(218, 41%, 19%) 80%, transparent 100%), radial-gradient(1250px circle at 100% 100%, hsl(218, 41%, 45%) 15%, hsl(218, 41%, 30%) 35%, hsl(218, 41%, 20%) 75%, hsl(218, 41%, 19%) 80%, transparent 100%)',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#eee',
        height: 550,
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '20px',
        marginTop: '120px',
        padding: '20px',
        borderRadius: '8px',
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Le Travaill des Instructeurs</h1>
        <div style={{ height: 'calc(100% - 52px)', width: '100%', backgroundColor: '#fff' }}>
          <DataGrid
            rows={mergedData}
            columns={columns}
            components={{
              Toolbar: GridToolbar,
            }}
            getRowClassName={(params) =>
              params.row.color === 'black' ? 'black-text' : 'black-text'
            }
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

const styles = {
  whiteText: {
    color: 'white',
  },
  blackText: {
    color: 'black',
  },
  blackext: {
    color: 'black',
  },
};

export default Tableau;
