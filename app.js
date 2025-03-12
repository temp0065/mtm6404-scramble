/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle(src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const initialWords = [
  "PAPER",
  "BUFFOON",
  "DRAGON",
  "MALICE",
  "BOY",
  "WEISENHEIMER",
  "NOSEBAGGER",
  "MOOT",
  "GOOFBALL",
  "THEOCRACY"
];

const ProgressBar = ({ progress }) => {
  return (
    <progress className="progress is-info" value={!progress ? 100 : Math.abs(((progress - 10) * 10))} max="100"></progress>
  )
}

const GuessAlert = ({ children, correct }) => {

  if (correct !== null) return (
    <div className={correct ? "message is-success" : "message is-danger"}>
      <div className="message-header" style={{borderRadius: "0.375rem"}}>
        {children}
      </div>
    </div>
  )

  /*
  // Ensure the value is not null

  if (correct !== null) return (
    <div className={correct ? "message is-success" : "message is-danger"}>
      <div className="message-header">
        <p>You guessed {correct ? "Correct :)" : "Wrong ):"}</p>
      </div>
    </div>
  )
  */
}

const PassBtn = ({ passes, onPass, gameOver }) => {
  return (
    <button type="button" className="button is-warning is-align-self-center" disabled={!passes || gameOver} onClick={onPass}>
      {passes} Passes Remaining
    </button>
  )
};


const ScrambleForm = ({ onWordGuess, gameOver }) => {
  const [guess, setGuess] = React.useState("");

  const handleFormChange = (e) => {
    setGuess(e.target.value);
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();

    onWordGuess(guess);
    // Clears the guess state
    setGuess("");
  }

  return (
    <form onSubmit={handleFormSubmit} className="field is-grouped">
      <div className="control is-expanded">
        <label htmlFor="guess" hidden>Guess The Word</label>
        <input type="text" className="input" value={guess} onChange={handleFormChange} disabled={gameOver} name="guess" id="guess" />
      </div>
      <div>
        <button type="submit" className="button is-primary" disabled={gameOver}>Submit Guess</button>
      </div>
    </form>
  )
};

const ScrambleWord = ({ word }) => {
  return <h2 className="title is-2 has-text-centered">{word}</h2>
};

const ScrambleScore = ({ type, typeAccumulated }) => {
  return (
    <div className="level-item has-text-centered">
      <div>
        <h3 className="heading">{typeAccumulated}</h3>
        <p className="title">{type}</p>
      </div>
    </div>
  )
};

const ScrambleScoreboard = ({ points, strikes }) => {

  return (
    <div className="level">
      <ScrambleScore type="Points" typeAccumulated={points} />
      <ScrambleScore type="Strikes" typeAccumulated={strikes} />
    </div>
  )
};

const App = () => {
  const [playerData, setPlayerData] = React.useState(() => {
    // Get saved values
    const savedValues = JSON.parse(localStorage.getItem("playerData"));
    // If there are saved values on ls make them the states
    if (savedValues) {
      return savedValues;
    }
    // If not create the states
    else {
      const newWordList = shuffle(initialWords);

      return {
        words: newWordList,
        word: shuffle(newWordList[0]),
        numPasses: 3,
        strikes: 0,
        points: 0,
        gameOver: false,
        guessCorrect: null
      };
    }
  })

  const maxStrikes = 3;

  // Updates local storage when playerData is modified
  React.useEffect(() => {
    localStorage.setItem("playerData", JSON.stringify(playerData))
  }, [playerData])

  const handleWordGuess = (guess) => {

    // If the game is over than do not allow it to progress
    if (playerData.gameOver) return;

    if (guess.toLowerCase() === playerData.words[0].toLowerCase()) {

      setPlayerData(prevData => {
        const newWordList = prevData.words.slice(1);
        const newWordListLength = newWordList.length;
        return {
          ...prevData,
          words: newWordList,
          word: newWordListLength ? shuffle(newWordList[0]) : "",
          points: prevData.points + 1,
          guessCorrect: 1,
          gameOver: newWordListLength ? false : true
        }
      });
    }
    else {
      setPlayerData(prevData => ({
        ...prevData,
        strikes: prevData.strikes + 1,
        guessCorrect: 0
      }));
    }

    if (playerData.strikes >= maxStrikes || playerData.words.length <= 0) {
      setPlayerData(prevData => ({
        ...prevData,
        gameOver: true
      }))
    }
  }

  const handlePlayAgain = () => {
    const newWordList = shuffle(initialWords);

    setPlayerData(() => ({
      words: newWordList,
      word: shuffle(newWordList[0]),
      numPasses: 3,
      strikes: 0,
      points: 0,
      gameOver: false,
      guessCorrect: null
    }));
  }

  const handlePass = () => {
    // Do not allow pass if no more passes
    if (!playerData.numPasses) return;

    // Lower the number of passes by 1 and shuffle the word again
    setPlayerData(prevData => {

      const newWordList = shuffle(prevData.words);

      return {
        ...prevData,
        words: newWordList,
        word: newWordList[0],
        numPasses: prevData.numPasses - 1,
        guessCorrect: null
      }
    });
  }

  return (
    <main className="container is-max-desktop is-flex is-flex-direction-column is-justify-content-center p-5" style={{ height: "100vh" }}>
      <h1 className="title is-1 has-text-white has-text-centered has-text-primary">Welcome To Scramble</h1>
      <p className="subtitle is-4 has-text-centered">Guess All The Scrambled Words To Win</p>
      <ProgressBar progress={playerData.words.length} />
      <ScrambleScoreboard points={playerData.points} strikes={playerData.strikes} />
      {
        !playerData.gameOver ? 
          (playerData.guessCorrect !== null && <GuessAlert correct={playerData.guessCorrect}>{playerData.guessCorrect ? <p>Correct</p> : <p>Wrong</p>}</GuessAlert>)
        :
          (<GuessAlert correct={playerData.guessCorrect}>{playerData.gameOver && playerData.strikes < maxStrikes && playerData.words.length <= 0 ? <h3>Congratulations, You Win!</h3> : <h3>You Lose</h3>}</GuessAlert>)
      }
      <ScrambleWord word={playerData.word} />
      <ScrambleForm onWordGuess={handleWordGuess} gameOver={playerData.gameOver} />
      <div className="is-flex is-flex-direction-column is-justify-content-center">
        <PassBtn passes={playerData.numPasses} onPass={handlePass} gameOver={playerData.gameOver} />
        {playerData.gameOver && <button className="button is-info is-align-self-center mt-3" onClick={handlePlayAgain}>Play Again</button>}
      </div>
    </main>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />)