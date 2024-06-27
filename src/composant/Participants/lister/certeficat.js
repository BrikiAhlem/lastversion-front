import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { IconButton, Box } from '@mui/material';
import { SaveAlt } from '@mui/icons-material';

const Certificate = ({ location }) => {
    const certificateRef = useRef();
    const { participantName, participantlastname, formationTitle, Formationcerteficat, score, companyName = "EduPionner", issueDate = new Date().toLocaleDateString(), signatureImage } = location.state || {};

    const handleDownloadCertificate = () => {
        html2canvas(certificateRef.current, { scrollY: -window.scrollY }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'px', [canvas.width, canvas.height]);

            const imgWidth = canvas.width; // A4 width in pixels
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save('certificate.pdf');
        });
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
            <div ref={certificateRef} style={styles.certificate}>
                <div style={styles.header}>
                    <h2 style={styles.title}> {Formationcerteficat}</h2>
                </div>
                <div style={styles.body}>
                    <p style={{ ...styles.subtitle, display: 'inline' }}>
                        Ce certificat est décerné à <h1 style={styles.participantName}>{participantName} {participantlastname}</h1>
                    </p>

                    <p style={styles.subtitle}>pour avoir complété avec succès la formation</p>
                    <h2 style={styles.formationTitle}>{formationTitle}</h2>
                </div>
                <div style={styles.footer}>
                    <p style={styles.issueDate}>Date de délivrance : {issueDate}</p>
                    <p style={styles.companyName}>Entreprise : {companyName}</p>
                    <div style={styles.signatureContainer}>
                        <img src="images/signature.avif" alt="Signature" style={styles.signatureImage} />
                    </div>
                </div>
            </div>
            <IconButton onClick={handleDownloadCertificate} style={styles.downloadButton}>
                <SaveAlt />
                Télécharger
            </IconButton>
        </Box>
    );
};

const styles = {
    certificateContainer: {
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '20px',
        width: '100%',
        height: '100%',
        margin: 'auto',
    },
    certificate: {
        textAlign: 'center',
        position: 'relative',
        padding: '40px',
        border: '2px solid #000',
        backgroundColor: '#fff',
        backgroundImage: 'url("images/cert.png")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '961px',
        height: '641px',
        boxSizing: 'border-box',
    },
    header: {
        marginTop: '100px',
        marginBottom: '60px',
    },
    title: {
        fontSize: '35px',
        fontWeight: 'bold',
    },
    body: {
        marginBottom: '20px',
    },
    subtitle: {
        fontSize: '16px',
        marginBottom: '40px',
    },
    participantName: {
        fontSize: '22px',
        fontWeight: 'bold',
    },
    formationTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
    },
    score: {
        fontSize: '16px',
    },
    footer: {
        marginTop: '20px',
    },
    issueDate: {
        fontSize: '16px',
    },
    companyName: {
        fontSize: '16px',
    },
    signatureContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
    },
    signatureImage: {
        width: '100px', // Adjust the width as necessary
        height: 'auto',
    },
    downloadButton: {
        backgroundColor: '#4CAF50', /* Green */
        color: 'white',
        fontSize: '16px',
        borderRadius: '10px',
        marginTop: '20px',
    }
};

export default Certificate;

