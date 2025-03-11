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

const PassBtn = ({ passes }) => {
  return (
    <button type="button" className="button is-warning" disabled={!passes}>
      {passes} Passes Remaining
    </button>
  )
};


const ScrabbleForm = ({ handleFormChange, onWordGuess, formValue, gameOver }) => {

  return (
    <form onSubmit={onWordGuess} className="field is-grouped">
      <div className="control is-expanded">
        <input type="text" className="input" onChange={handleFormChange} value={formValue} disabled={gameOver} />
      </div>
      <div>
        <button type="submit" className="button is-primary" disabled={gameOver}>Submit Guess</button>
      </div>
    </form>
  )
};

const ScrabbleWord = ({ word }) => {
  return (<h2 className="title is-2 has-text-centered">{word}</h2>)
};

const ScrabbleScore = ({ type, typeAccumulated }) => {
  return (
    <>
      <div>
        <h3>{typeAccumulated}</h3>
        <p>{type}</p>
      </div>
    </>
  )
};

const ScrabbleScoreboard = ({ points, strikes }) => {

  return (
    <div className="is-flex is-justify-content-space-between">
      <ScrabbleScore type="Points" typeAccumulated={points} />
      <ScrabbleScore type="Strikes" typeAccumulated={strikes} />
    </div>
  )
};

const App = () => {
  const [playerData, setPlayerData] = React.useState(() => {
    const savedValues = localStorage.getItem(JSON.parse(playerData));
    if (savedValues) {
      return savedValues;
    }
    else {
      return {
        words: shuffle(initialWords),
        numPasses: 3,
        strikes: 0,
        points: 0,
        gameOver: false,
        guessType: null
      };
    }
  })

  const maxStrikes = 3;

  React.useEffect(() => {
    localStorage.setItem(JSON.stringify(playerData))
  }, [playerData])

  const handleWordGuess = (e) => {
    e.preventDefault();

    if (gameOver) return;

    if (e.target.value.toLowerCase() === words[0].toLowerCase()) {
      setPlayerData(prevData => ({
        ...prevData,
        words: prevData.words.slice(1),
        points: points + 1,
        guessType: 0
      }));
    }
    else {
      setPlayerData(prevData => ({
        ...prevData,
        strikes: strikes + 1,
        guessType: -1
      }));
    }

    if (strikes >= maxStrikes || words.length <= 0) {
      setPlayerData(prevData => ({
        ...prevData,
        gameOver: true
      }))
    }
  }

  const handlePlayAgain = () => {
    setPlayerData(prevData => ({
      words: shuffle(initialWords),
      numPasses: 3,
      strikes: 0,
      points: 0,
      guessType: null,
      gameOver: false
    }));
  }

  return (
    <>
      <section className="container is-max-desktop">
        <h1 className="title is-1 has-text-white has-text-centered">Welcome To Scrabble</h1>
        <ScrabbleScoreboard points={playerData.points} strikes={playerData.strikes} />
        <ScrabbleWord word={shuffle(playerData.words[0])} />
        <ScrabbleForm onWordGuess={handleWordGuess} gameOver={playerData.gameOver} />
        <div className="is-flex is-flex-direction-column is-justify-content-center">
          <PassBtn passes={playerData.numPasses} />
          {playerData.gameOver && <button className="button is-info" onClick={handlePlayAgain}>Play Again</button>}
        </div>
      </section>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />)