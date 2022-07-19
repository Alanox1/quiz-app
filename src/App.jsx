import './App.css';
import {useState, useEffect} from "react";


function App() {
  
  
  const [avanza, setAvanza] = useState(0)
  const [questions,setQuestions] = useState([])
  const [score,setScore] = useState(0)
  

  const obtenerDatos = async () => {
   let data = await fetch("https://opentdb.com/api.php?amount=10"),
    json = await data.json()
    
    const questions = json.results.map((question) => ({
      ...question,
      answers:[question.correct_answer, ...question.incorrect_answers].sort(() => Math.random() - 0.5)
    }))
    setQuestions(questions)
  
  }



 const handleNextQuestion = (answer,e) => {
  
  e.target.classList.add(questions[avanza].correct_answer === answer ? "green-button" : "red-button")
  
  setTimeout(() => {
    setAvanza(avanza + 1)
    
    e.target.classList.remove("red-button")
    e.target.classList.remove("green-button")
  }, 1500);
 }
const volverAInicio = () => {
  window.location.reload()
}


const manejoDeScore = (answers,answer) => {
  if(answers.type === "multiple"){
   setScore(answer === answers.correct_answer ? score + 10 : score + 0)
  }else if(answers.type === "boolean"){
    setScore(answer === answers.correct_answer ? score + 5 : score + 0) 
  }else{
    setScore(score + 0)
  } 
}


  useEffect(() => {
    obtenerDatos()
  },[]) 
  
  

  return (
    <>
    
     {questions.length > 0 ? 
      <section className='app'>
        {avanza >= questions.length ?<div className='juego-terminado'>
          <p className='tamaño'>Juego terminado! tus puntos son: {score}</p>
          <button onClick={() => volverAInicio()}>Volver a jugar!</button>
       
        </div> 
        :  <>
        <div className='lado-izquierdo'>
        <p className='tamaño'>Pregunta {avanza + 1} de 10</p>
        <p className='tamaño'>{questions[avanza].category}</p>
        <h3 dangerouslySetInnerHTML={{__html:questions[avanza].question}} />
        
        <p className='tamaño'>{questions[avanza].difficulty}</p>
     </div>
     <div className='lado-derecho'>
     {
      questions[avanza].answers.map((answer) => {   
        
          return(
              <button key={answer} onClick={(e) =>{
                handleNextQuestion(answer,e)
                manejoDeScore(questions[avanza],answer)
              }}>{answer}</button>
          )
      })
    }  
  </div>
  
        </> } 
      
   </section>
   
   : <p className='cargando'>"Loading..."</p>}
    </>
      )
}

export default App;
