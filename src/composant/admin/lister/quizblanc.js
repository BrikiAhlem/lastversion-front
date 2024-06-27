import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import axios from 'axios';
import { FaLink } from 'react-icons/fa'; // Importer une icône de react-icons
import { Link } from 'react-router-dom'; // Importer Link de react-router-dom

const QuizBlanDetailleTableau = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/quiz/getQuizListAdmin');
        setQuizzes(response.data.quizList);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorFn: row => `${row.instructeur_nom} ${row.instructeur_prenom}`,
        header: 'Instructeur',
        size: 200,
      },
      {
        accessorKey: 'quiz_titre',
        header: 'Titre du Quiz',
        Cell: ({ cell }) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaLink style={{ marginRight: '8px' }} />
            <Link to={`/UserQuizReview/${cell.row.original.id_q}`} style={{ color: '#007bff', textDecoration: 'none', borderBottom: '2px solid #007bff', transition: 'border-color 0.3s ease' }}>
              {cell.getValue()}
            </Link>
          </div>
        ),
        size: 200,
      },
      {
        accessorFn: row => `${row.participant_nom} ${row.participant_prenom}`,
        header: 'Participant',
        size: 200,
      },
      {
        accessorKey: 'cours_titre',
        header: 'Cours',
        size: 200,
      },
    ],
    [],
  );

  return (
    <div style={{ backgroundColor: 'hsl(218, 41%, 15%)', backgroundImage: 'radial-gradient(650px circle at 0% 0%, hsl(218, 41%, 35%) 15%, hsl(218, 41%, 30%) 35%, hsl(218, 41%, 20%) 75%, hsl(218, 41%, 19%) 80%, transparent 100%), radial-gradient(1250px circle at 100% 100%, hsl(218, 41%, 45%) 15%, hsl(218, 41%, 30%) 35%, hsl(218, 41%, 20%) 75%, hsl(218, 41%, 19%) 80%, transparent 100%)', minHeight: '100vh', padding: '20px' }}>
      <div style={{ backgroundColor: '#eee', padding: '20px', textAlign: 'center' }}>
        <h1> Consulter les QuizBlans</h1>
        <MaterialReactTable columns={columns} data={quizzes} />
      </div>
    </div>
  );
};

export default QuizBlanDetailleTableau;
