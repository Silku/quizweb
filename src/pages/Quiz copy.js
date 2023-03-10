import { collection, getDocs} from 'firebase/firestore'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {create} from 'zustand'

import { authService, dbService } from '../firebaseConfig'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faSpinner} from '@fortawesome/free-solid-svg-icons';


import styles from "../css/Quiz.module.css";
import Timer from '../components/Timer';



import useBearStore, { useBooleanStore } from '../store/useQuizStore';

const correctSound = new Audio(`${process.env.PUBLIC_URL}/sounds/correct.mp3`);
const wrongSound = new Audio(`${process.env.PUBLIC_URL}/sounds/wrong.mp3`);

const QuizTest = () => {
	// const {initQuiz, quiz, userAnswer, result, score, isPlaying, endTime} = useQuizStore();

	// const { bears, increasePopulation, removeAllBears } = useBearStore();

	const bears = useBearStore((state) => state.bears)

	const increasePopulation = useBearStore((state) => state.increasePopulation)
	const removeAllBears = useBearStore((state) => state.removeAllBears)

	const useQuizStore = create((set) =>({
		isPlaying : false,
		setIsPlaying: (value) => set({isPlaying : value})
	}))


	const [initQuiz, setInitQuiz] = useState([]); //퀴즈 데이터 불러오기
	const [quiz, setQuiz] = useState("");  //퀴즈
	const [userAnswer, setUserAnswer] = useState(""); 
	const [result, setResult] = useState(null);
	const [score, setScore] = useState(null);
	const [endTime, setEndTime] = useState(0);

	// const {isPlaying, setIsPlaying} = useQuizStore();
	const [isPlaying, setIsPlaying] = useState(false);


	const stores = create((set) => ({
    bears: 0,
    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    removeAllBears: () => set({ bears: 0 }),
}))



	// const useQuizStore = create((set) => ({
	// 	isPlaying: false,
	// 	gameStart: () => set((state) => ({ isPlaying: true })),
	// }))
	// const [isPlaying, setIsPlaying] = useState(false);


	const getAllQuiz = async () =>{
		try {
			const initQuiz = await getDocs(collection(dbService, 'picturedb'));
			const quizArray = initQuiz.docs.map((doc) => doc.data())
			setInitQuiz(quizArray)
			// console.log("퀴즈 불러오기 완료")
		}catch (error) {
			console.log('에러', error);
		}
	};
		
	const randomValue = (array) =>{
		const random = Math.floor(Math.random() * array.length)
		return array[random]
	}
	// 다음 퀴즈 필터링
	const checkAnswer = () => {
		const filtering = initQuiz.filter(data => data.answer !== quiz.answer)
		setInitQuiz(filtering)
	}

	const nextQuiz = useCallback(() => {
		if (initQuiz.length > 0) {
			// console.log("퀴즈 준비")
			// console.log("생성된것: ", initQuiz)
			setQuiz(randomValue(initQuiz))
		}
	}, [initQuiz]);

	const handleAnswerChange = useCallback((e) => {
		const {target : {value}} = e
        setUserAnswer(value)
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (quiz.answer === userAnswer) {
			// 정답
			setResult(`정답입니다!`);
			setScore(score + 1);
			checkAnswer()
			nextQuiz();
			correctSound.play()
		} else {
			// 오답
			setResult(`땡! 정답은 "${quiz.answer}" 입니다.`);
			checkAnswer()
			nextQuiz();
			wrongSound.play();
		}
		setUserAnswer("");
	};

	const StartGame = () =>{
		setIsPlaying(true)
		setScore(0)
		setResult("")
		if (!initQuiz.length) {
			getAllQuiz();
		}
	}

	const onTimeStop = (time) =>{
		setEndTime(time)
	}

	useEffect(() => {
		if (initQuiz.length) {
			nextQuiz();
		}else {
			setIsPlaying(false)
			setResult("게임 시작을 눌러주세요!");
		}
	}, [initQuiz, nextQuiz]);

	useEffect(()=>{
		// setIsPlaying(true)
	})


	// /테스트


		const { booleanState, setBooleanState } = useBooleanStore();
		
		// useEffect(() => {
		// 	setBooleanState(true);
		// }, []);

		function handleClick() {
			setBooleanState(prev=>!prev);
		}

		const [count, setCount] = useState(0);

		useEffect(() => {
		  if (count > 5) {
			console.log("count is greater than 5");
		  }
	  
		  return () => {
			console.log("effect cleanup");
		  };
		}, [count]);
	  

	return (
		<>
		<div className={styles.container}>
			{isPlaying ? 
				(
				<div className={styles.flexCenter}>
					<Card key={quiz?.id} style={{ width: '24rem' }} >
						{/* <Card.Title>{quiz.answer}</Card.Title> */}
						<div className={styles.pictureWrapper}>
							<Card.Img variant="top" src={quiz.picture} className={styles.picture}></Card.Img>
						</div>
						<Card.Body>
							<Form onSubmit={handleSubmit} >
								<Form.Control 
									size="lg" 
									type="text"
									value={userAnswer} 
									onChange={handleAnswerChange}
									/>
							</Form>
						</Card.Body>
					</Card>
					<p> 남은문제 : {initQuiz.length} 개</p>
				</div>
				)
				:
				(
				<>
					{/* <FontAwesomeIcon icon={faSpinner} spin={true} /> */}
					<Button 
						type='button'  
						variant="outline-light"
						className={styles.startButton}
						onClick={StartGame}>
							게임 시작
					</Button>
				</>
				)
			}
			<p style={{marginTop : '30px'}}>{result}</p>
			{score === null ? "" : (<p>맞춘문제 총 : {score} 개</p>)}
			{/* <Timer isPlaying={isPlaying} onTimeStop={onTimeStop}/> */}
			{/* <p>소요시간 :  {endTime}</p> */}
		</div>
		<>


			<div>ㅎㅎ</div>
			<h1>{isPlaying ? '트루' : 'false'}</h1>
			{/* <h1>{bears} around here ...</h1>
			<button onClick={increasePopulation}>one up</button>
			<button onClick={removeAllBears}>remove</button> */}
			<button onClick={()=>{setIsPlaying(true)}}>remove</button>
			<div>
			<p>Boolean state value: {booleanState.toString()}</p>
			<button onClick={handleClick}>Set to {booleanState ? "true" : "falses"}</button>
			<button onClick={() => setCount(count + 1)}>Increment Count</button>
			</div>
		</>
	</>
	)
}

export default QuizTest;