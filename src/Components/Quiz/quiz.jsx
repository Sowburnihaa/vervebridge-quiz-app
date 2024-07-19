import React, { useState, useRef, useEffect } from 'react';
import './quiz.css';
import { data } from '../../assets/data';

const Quiz = () => {
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(data[index]);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [storedCredentials, setStoredCredentials] = useState(null);


  const Option1 = useRef(null);
  const Option2 = useRef(null);
  const Option3 = useRef(null);
  const Option4 = useRef(null);

  const option_array = [Option1, Option2, Option3, Option4];

  useEffect(() => {
    let timer;
    if (isAuthenticated && !result) {
      timer = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds === 59) {
            setMinutes(prevMinutes => prevMinutes + 1);
            return 0;
          }
          return prevSeconds + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isAuthenticated, result]);

  const checkAns = (e, ans) => {
    if (!lock) {
      if (question.ans === ans) {
        e.target.classList.add('correct');
        setScore(prev => prev + 1);
      } else {
        e.target.classList.add('wrong');
        option_array[question.ans - 1].current.classList.add('correct');
      }
      setLock(true);
    }
  };

  const nextQuestion = () => {
    if (index < data.length - 1) {
      const newIndex = index + 1;
      setIndex(newIndex);
      setQuestion(data[newIndex]);
      setLock(false);
      setSeconds(0);
      setMinutes(0);
      option_array.forEach(option => option.current.classList.remove('correct', 'wrong'));
    } else {
      setResult(true);
    }
  };

  const reset = () => {
    setIndex(0);
    setQuestion(data[0]);
    setScore(0);
    setLock(false);
    setResult(false);
    setSeconds(0);
    setMinutes(0);
    option_array.forEach(option => option.current.classList.remove('correct', 'wrong'));
  };

  const handleAuth = () => {
    if (email && password) {
      if (isLogin) {
        if (storedCredentials && email === storedCredentials.email && password === storedCredentials.password) {
          setIsAuthenticated(true);
          setSeconds(0);
          setMinutes(0);
          setError('');
        } else {
          setError('Invalid credentials');
        }
      } else {
        setStoredCredentials({ email, password });
        setIsAuthenticated(true);
        setSeconds(0);
        setMinutes(0);
        setError('');
      }
    } else {
      setError('Please enter email and password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className='auth-container'>
        <h1>{isLogin ? 'Login' : 'Signup'}</h1>
        {error && <p className='error'>{error}</p>}
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleAuth}>{isLogin ? 'Login' : 'Signup'}</button>
        <p onClick={() => { setIsLogin(!isLogin); setError(''); }}>
          {isLogin ? "Don't have an account? Signup" : 'Already have an account? Login'}
        </p>
      </div>
    );
  }


  return (
    <div className='container'>
      <div className='header'>
        <h1>Quiz App</h1>
        {!result && <h1>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h1>}
      </div>
      <hr />
      {result ? (
        <>
          <h2>You Scored {score} out of {data.length}</h2>
          <button onClick={reset}>Reset</button>
        </>
      ) : (
        <>
          <h2>{index + 1}. {question.question}</h2>
          <ul>
            <li ref={Option1} onClick={(e) => checkAns(e, 1)}>{question.option1}</li>
            <li ref={Option2} onClick={(e) => checkAns(e, 2)}>{question.option2}</li>
            <li ref={Option3} onClick={(e) => checkAns(e, 3)}>{question.option3}</li>
            <li ref={Option4} onClick={(e) => checkAns(e, 4)}>{question.option4}</li>
          </ul>
          <button onClick={nextQuestion}>Next</button>
          <div className='index'>{index + 1} of {data.length} questions</div>
        </>
      )}
    </div>
  );
};

export default Quiz;
