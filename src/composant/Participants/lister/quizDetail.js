import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FaQuestionCircle } from 'react-icons/fa';
import { width } from '@fortawesome/free-solid-svg-icons/faAward';

function QuizDetail() {
  const { id_q, formation_id } = useParams();
  const history = useHistory();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [currentCourseNumber, setCurrentCourseNumber] = useState(null);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const response = await axios.get(`http://localhost:3000/quiz/getQuizById/${id_q}`);
        setQuiz(response.data.Quiz);
        setCurrentCourseId(response.data.Quiz.id_CourspayentQ);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    }
    fetchQuiz();
  }, [id_q]);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await axios.get(`http://localhost:3000/question/gestionQuiz/${id_q}`);
        setQuestions(response.data.questions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    }
    fetchQuestions();
  }, [id_q]);

  const handleAnswerClick = (selectedAnswer) => {
    const correctAnswer = questions[currentQuestionIndex].reponse_correct;
    if (selectedAnswer === correctAnswer) {
      setScore(prevScore => prevScore + 2);
    }

    setAnswers({ ...answers, [currentQuestionIndex]: selectedAnswer });
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  useEffect(() => {
    if (showResult) {
      console.log('dernier enregistré avec succès:', score);
      sendQuizScore(score);
    }
  }, [showResult]);

  const sendQuizScore = async (score) => {
    try {
      const response = await axios.post(`http://localhost:3000/quiz/saveQuizScore/${id_q}`, { score });
      console.log('Score enregistré avec succès:', response.data, score);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du score du quiz:', error);
    }
  };

  useEffect(() => {
    if (showResult && score >= 3 && currentCourseId) {
      redirectToNextCourse();
    }
  }, [showResult, score, currentCourseId]);

  const redirectToNextCourse = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/coursPayant/formation/${formation_id}/paidCoursesWithNumberAndStatus`);
      const courses = response.data.courses;

      const currentCourse = courses.find(course => course.id_cp === currentCourseId);

      if (currentCourse) {
        setCurrentCourseNumber(currentCourse.number);
        console.log(currentCourseNumber)
        courses.sort((a, b) => a.number - b.number);
        const currentCourseIndex = courses.findIndex(course => course.id_cp === currentCourseId);

        if (currentCourseIndex !== -1 && currentCourseIndex < courses.length - 1 ) {
          const nextCourse = courses[currentCourseIndex + 1];
          setTimeout(() => {
          history.push(`/coursPayant/getcoursById/${nextCourse.id_cp}/${formation_id}`);
          }, 3000);  
        } else {
          setTimeout(() => {

          history.push(`/quiz/${formation_id}`);
        }, 3000);  

        }
      } else {
        console.log("Cours actuel non trouvé.");
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des cours:', error);
    }
  };

  return (
    <div>
      <div style={styles.background}>
        <div style={styles.quizContainer}>
          <div style={styles.quiz}>
            {quiz && (
              <div style={styles.quizHeader}>
                <h1>La Quiz : {currentCourseNumber} {quiz.titre} </h1>
              </div>
            )}
            {currentQuestionIndex < questions.length && (
              <div style={styles.questionSection}>
                <button
                  style={{ ...styles.questionButton, ...(isHovered ? styles.questionButtonHover : {}) }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <p style={styles.questionText}>
                    {questions[currentQuestionIndex].question}
                    <FontAwesomeIcon icon={faQuestion} style={styles.icon} />
                  </p>
                </button>
                <div style={styles.answerSection}>
                  <button
                    style={{
                      ...styles.optionButton,
                      backgroundColor: answers[currentQuestionIndex] === questions[currentQuestionIndex].reponse_correct ? '#d4edda' : '#183462'
                    }}
                    onClick={() => handleAnswerClick(questions[currentQuestionIndex].reponse_correct)}
                  >
                    {questions[currentQuestionIndex].reponse_correct}
                  </button>
                  <button
                    style={{
                      ...styles.optionButton,
                      backgroundColor: answers[currentQuestionIndex] === questions[currentQuestionIndex].reponse_incorect ? '#d4edda' : '#183462'
                    }}
                    onClick={() => handleAnswerClick(questions[currentQuestionIndex].reponse_incorect)}
                  >
                    {questions[currentQuestionIndex].reponse_incorect}
                  </button>
                </div>
              </div>
            )}
            {showResult && (
              <div style={styles.scoreSection}>
                <p>Vous avez obtenu un score de {score} sur {questions.length * 2}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  background: {
    backgroundImage: 'url(https://as1.ftcdn.net/v2/jpg/05/03/33/68/1000_F_503336831_pMGlodDnQk0C0KyeLlf0PFNiw61Nx9t9.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    height: '700px',
    position: 'relative',
  },
  quizContainer: {
    position: 'relative',
    top: '150px', 
    marginLeft: '160px'
  },
  quiz: {
    textAlign: 'center',
    backgroundColor: '#f4f4f4',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    maxWidth: '600px',
    margin: 'auto',
  },
  quizHeader: {
    marginBottom: '20px',
  },
  questionSection: {
    marginBottom: '20px',
   
  },
  questionButton: {
    background: 'linear-gradient(135deg, #7b1fa2, #4a148c)',
    borderRadius: '10px',
    width: '410px',
    height: '80px',
    marginBottom: '20px',
    border: '2px solid #ff4081',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  questionButtonHover: {
    transform: 'scale(1.05)',
  },
  questionText: {
    fontSize: '20px',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginLeft: '10px',
  },
  answerSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  optionButton: {
    color: 'white',
    border: 'none',
    padding: '10px',
    margin: '5px 0',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  scoreSection: {
    fontSize: '24px',
    marginTop: '20px',
  },
};

export default QuizDetail;