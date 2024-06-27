import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import axios from 'axios';

const PaiementTabl = () => {
  const [formations, setFormations] = useState([]);
  const [verificationResult, setVerificationResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/formationP/getFormationsPayees');
        setFormations(response.data.formations);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id_fp',
        header: 'id de la formation',
        size: 50,
      },
      {
        accessorKey: 'instructeur_nom',
        header: 'Nom de l\'instructeur',
        size: 150,
      },
      {
        accessorKey: 'instructeur_prenom',
        header: 'Prénom de l\'instructeur',
        size: 150,
      },
      {
        accessorKey: 'titre',
        header: 'Formation',
        size: 200,
      },
      {
        accessorKey: 'participant_nom',
        header: 'Participant qui a payé (Nom)',
        size: 150,
      },
      {
        accessorKey: 'participant_prenom',
        header: 'Participant qui a payé (Prénom)',
        size: 150,
      },
      {
        accessorKey: 'prix',
        header: 'Prix de la formation',
        size: 100,
      },
      {
        accessorKey: 'verifier',
        header: 'Vérifier',
        size: 100,
        Cell: ({ row }) => (
          <button onClick={() => handleVerification(row.original)}>Vérifier</button>
        ),
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: formations,
  });

  const handleVerification = async (formation) => {
    if (formation && formation.id_fp) {
      try {
        const response = await axios.get(`http://localhost:3000/Pa/getPaymentId/${formation.id_fp}`);
        const paymentId = response.data.paymentId;
        const verificationResponse = await axios.post(`http://localhost:3000/Pa/Verify/${paymentId}`);
        setVerificationResult(verificationResponse.data.result);
        console.log('Vérification réussie:', verificationResponse.data);
        setShowModal(true);
      } catch (error) {
        console.error('Erreur lors de la vérification du paiement:', error);
      }
    } else {
      console.error('ID de formation non défini.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setVerificationResult(null);
  };

  return (
    <div style={{
      backgroundColor: 'hsl(218, 41%, 15%)',
      backgroundImage: 'radial-gradient(650px circle at 0% 0%, hsl(218, 41%, 35%) 15%, hsl(218, 41%, 30%) 35%, hsl(218, 41%, 20%) 75%, hsl(218, 41%, 19%) 80%, transparent 100%), radial-gradient(1250px circle at 100% 100%, hsl(218, 41%, 45%) 15%, hsl(218, 41%, 30%) 35%, hsl(218, 41%, 20%) 75%, hsl(218, 41%, 19%) 80%, transparent 100%)',
      height: '130vh',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#eee',
        
        marginTop:'20px',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
        width: '97%',
        margin: '120px auto 20px auto',
        height: '80vh',
        overflowY: 'auto',
      }}>
        <h1>Les Transactions de Paiements</h1>
        <MaterialReactTable table={table} className="custom-table" />
      </div>

      {showModal && (
        <div className="paiement-modal">
          <div className="paiement-modal-content">
            <span className="paiement-close" onClick={closeModal}>&times;</span>
            <h2>Résultat de la vérification</h2>
            {verificationResult ? (
              <div>
                <p><strong>Status:</strong> {verificationResult.status}</p>
                <p><strong>Type:</strong> {verificationResult.type}</p>
                <p><strong>Order Number:</strong> {verificationResult.details?.order_number}</p>
                <p><strong>Name:</strong> {verificationResult.details?.name}</p>
                <p><strong>Phone Number:</strong> {verificationResult.details?.phone_number}</p>
                <p><strong>Email:</strong> {verificationResult.details?.email}</p>
              </div>
            ) : (
              <p>Erreur: Résultat de la vérification non disponible.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaiementTabl;

// CSS for the modal
const modalStyles = `
  .paiement-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.6);
  }

  .paiement-modal-content {
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
    width: 90%;
    max-width: 600px;
    text-align: left;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    position: relative;
    animation: paiement-slideIn 0.3s ease-out;
  }

  .paiement-close {
    color: #aaa;
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
  }

  .paiement-close:hover,
  .paiement-close:focus {
    color: #000;
  }

  h2 {
    margin-top: 0;
    color: #333;
  }

  p {
    color: #555;
    line-height: 1.6;
  }

  @keyframes paiement-slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

// Inject styles into the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = modalStyles;
document.head.appendChild(styleSheet);
