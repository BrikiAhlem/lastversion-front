import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';

const QuizFinalPage = () => {
  const { formation_id } = useParams();
  const [finalQuizId, setFinalQuizId] = useState(null);
  const [quizData, setQuizData] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(null);
  const [formationTitle, setFormationTitle] = useState('');
  const [Formationcerteficat, setFormationcerteficat] = useState('');

  const history = useHistory();

  useEffect(() => {
    async function fetchFinalQuizId() {
      try {
        const response = await axios.get(`http://localhost:3000/quizFinal/quizze/${formation_id}`);
        if (response.data.success && response.data.quiz.length > 0) {
          setFinalQuizId(response.data.quiz[0].id_Q);
        }
      } catch (error) {
        console.error('Error fetching final quiz ID:', error);
      }
    }
    fetchFinalQuizId();
  }, [formation_id]);

  useEffect(() => {
    async function fetchFormationDetails() {
      try {
        const response = await axios.get(`http://localhost:3000/formationP/getFormationById/${formation_id}`);
        const formationData = response.data.formation;
        setFormationTitle(formationData.titre);
        setFormationcerteficat(formationData.certeficat);
      } catch (error) {
        console.error('Error fetching formation details:', error);
      }
    }
    fetchFormationDetails();
  }, [formation_id]);

  useEffect(() => {
    async function fetchQuiz() {
      if (finalQuizId) {
        try {
          const response = await axios.get(`http://localhost:3000/quizFinal/${finalQuizId}`);
          const quizDetail = response.data.questionsWithAnswers.map(qwa => ({
            question: qwa.question.questions,
            options: [
              qwa.reponses[0].Correct,
              qwa.reponses[0].incorect1,
              qwa.reponses[0].incorect2,
              qwa.reponses[0].incorect3,
            ],
            answer: qwa.reponses[0].Correct,
          }));
          setQuizData(quizDetail);
          setSelectedAnswers(new Array(quizDetail.length).fill(null));
        } catch (error) {
          console.error('Error fetching quiz:', error);
        }
      }
    }
    fetchQuiz();
  }, [finalQuizId]);

  const handleAnswerOptionClick = (selectedOption) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = selectedOption;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    for (let i = 0; i < quizData.length; i++) {
      if (quizData[i].answer === selectedAnswers[i]) {
        totalScore++;
      }
    }
    return totalScore;
  };

  const handleSubmitQuiz = async () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    const participantData = JSON.parse(localStorage.getItem('participantData'));
    const participantId = participantData ? participantData.id_p : null;
    const token = localStorage.getItem('token');

    await axios.post('http://localhost:3000/quizFinal/save-score', {
      id_q: finalQuizId,
      participantId: participantId,
      score: finalScore
    }, {
      headers: {
        Authorization: ` ${token}`
      }
    });

    const averageScore = quizData.length / 2;
    if (finalScore >= averageScore) {
   
      setTimeout(() => {

      history.push('/certificate', { participantName: participantData.nom, participantlastname: participantData.prenom, formationTitle, Formationcerteficat, score: finalScore });
    }, 3000);  

    }
  };

  return (
    <section className="background-radial-gradient overflow-hidden">
    <style>{`
      .background-radial-gradient {
        background-color: hsl(218, 41%, 15%);
        background-image: radial-gradient(650px circle at 0% 0%,
          hsl(218, 41%, 35%) 15%,
          hsl(218, 41%, 30%) 35%,
          hsl(218, 41%, 20%) 75%,
          hsl(218, 41%, 19%) 80%,
          transparent 100%),
          radial-gradient(1250px circle at 100% 100%,
          hsl(218, 41%, 45%) 15%,
          hsl(218, 41%, 30%) 35%,
          hsl(218, 41%, 20%) 75%,
          hsl(218, 41%, 19%) 80%,
          transparent 100%);
      }

      #radius-shape-1 {
        height: 220px;
        width: 220px;
        top: -60px;
        left: -130px;
        background: radial-gradient(#44006b, #ad1fff);
        overflow: hidden;
      }

      #radius-shape-2 {
        border-radius: 38% 62% 63% 37% / 70% 33% 67% 30%;
        bottom: -60px;
        right: -110px;
        width: 300px;
        height: 300px;
        background: radial-gradient(#44006b, #ad1fff);
        overflow: hidden;
      }

      .bg-glass {
        background-color: hsla(0, 0%, 100%, 0.9) !important;
        backdrop-filter: saturate(200%) blur(25px);
      }
    `}</style>
    <div style={styles.quizContainer}>
      <h1>{formationTitle}</h1>
      <h2>Quiz Final</h2>
      {quizData.length > 0 && (
        <div style={styles.questionSection}>
          <div style={styles.questionText}>
            {quizData[currentQuestionIndex].question}
          </div>
          <div style={styles.answerSection}>
            {quizData[currentQuestionIndex].options.map((option, optionIndex) => (
              <button
                key={optionIndex}
                onClick={() => handleAnswerOptionClick(option)}
                style={{
                  ...styles.optionButton,
                  backgroundColor:
                    selectedAnswers[currentQuestionIndex] === option ? '#d4edda' : '#007bff',
                }}
              >
                {option}
              </button>
            ))}
          </div>
          <div style={styles.navigationButtons}>
            {currentQuestionIndex > 0 && (
              <button onClick={handlePrevQuestion} style={styles.navButton}>
                Question précédente
              </button>
            )}
            {currentQuestionIndex < quizData.length - 1 && (
              <button onClick={handleNextQuestion} style={styles.navButton}>
                Question suivante
              </button>
            )}
            {currentQuestionIndex === quizData.length - 1 && (
              <button onClick={handleSubmitQuiz} style={styles.submitButton}>
                Soumettre le Quiz
              </button>
            )}
          </div>
        </div>
      )}
      {score !== null && (
        <div style={styles.scoreSection}>
          <p>Votre score est: {score}/{quizData.length}</p>
        </div>
      )}
    </div>
    </section>
  );
};

const styles = {
  quizContainer: {
    textAlign: 'center',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '20px auto',
    fontFamily: 'Arial, sans-serif',
  },
  questionSection: {
    marginBottom: '30px',
  },
  questionText: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
  },
  answerSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  optionButton: {
    color: 'white',
    border: 'none',
    padding: '12px',
    margin: '8px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '18px',
    transition: 'background-color 0.3s',
    minWidth: '250px',
  },
  navigationButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '30px',
  },
  navButton: {
    padding: '12px 24px',
    fontSize: '18px',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
  },
  submitButton: {
    marginTop: '30px',
    padding: '12px 24px',
    fontSize: '18px',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
  },
  scoreSection: {
    fontSize: '24px',
    marginTop: '30px',
    color: '#333',
  },
};

export default QuizFinalPage;
