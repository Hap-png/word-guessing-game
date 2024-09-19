import React, { useState, useEffect, useRef } from 'react';
import { wordClueDict } from './wordClueDictionary';

const WordGuessingGame = () => {
  const [targetWord, setTargetWord] = useState('');
  const [clueWord, setClueWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameStarted, setGameStarted] = useState(false);
  const [revealedLetters, setRevealedLetters] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      revealNextLetter();
    }
  }, [timeLeft, gameStarted]);

  useEffect(() => {
    if (gameStarted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameStarted]);

  const revealNextLetter = () => {
    if (revealedLetters < targetWord.length) {
      setUserInput(prevInput => {
        const newInput = targetWord.slice(0, revealedLetters + 1).padEnd(targetWord.length, '_');
        return newInput;
      });
      setRevealedLetters(prevRevealed => prevRevealed + 1);
      setTimeLeft(15);
    } else {
      endRound();
    }
  };

  const startGame = () => {
    setGameStarted(true);
    newRound();
  };

  const newRound = () => {
    const randomPair = wordClueDict[Math.floor(Math.random() * wordClueDict.length)];
    setTargetWord(randomPair.target);
    setClueWord(randomPair.clue);
    setUserInput('_'.repeat(randomPair.target.length));
    setRevealedLetters(0);
    setTimeLeft(15);
  };

  const endRound = () => {
    setGameStarted(false);
    setTotalScore(totalScore + score);
    setScore(0);
  };

  const handleInputChange = (e) => {
    const input = e.target.value.toUpperCase();
    const newInput = input.split('').filter(char => char !== '_').join('');
    
    if (newInput === targetWord) {
      setScore(score + timeLeft);
      newRound();
    } else if (newInput.length === targetWord.length) {
      // Wrong guess: reset to revealed letters only
      setUserInput(prevInput => {
        return targetWord.slice(0, revealedLetters).padEnd(targetWord.length, '_');
      });
    } else {
      // Partial input: allow typing
      setUserInput(prevInput => {
        let result = newInput.padEnd(targetWord.length, '_');
        // Preserve revealed letters
        for (let i = 0; i < revealedLetters; i++) {
          result = result.slice(0, i) + targetWord[i] + result.slice(i + 1);
        }
        return result;
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-4xl font-bold mb-8 text-lime-400">What's The Word</h1>
      <p className="mb-4 text-cyan-300 text-2xl">Clue: {clueWord}</p>
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        disabled={!gameStarted}
        className="mb-4 p-2 text-black w-64 text-center text-2xl tracking-widest"
        style={{fontFamily: 'monospace'}}
      />
      <button
        onClick={gameStarted ? endRound : startGame}
        className="mb-4 px-4 py-2 bg-white text-black"
      >
        {gameStarted ? 'End' : 'Start'}
      </button>
      <p className="mb-2">Time: {timeLeft}</p>
      <p className="mb-2 text-lime-400">Score: {score.toString().padStart(2, '0')}</p>
      <p className="text-blue-400">Total: {totalScore.toString().padStart(2, '0')}</p>
    </div>
  );
};

export default WordGuessingGame;