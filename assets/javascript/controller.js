const tileDisplay = document.querySelector('.tile-container')
const keyboard = document.querySelector('.key-container')
const messageDisplay = document.querySelector('.message-container')

const getWordle = () => {

    let loadedWords = document.querySelector('script[data-template="words"]').textContent.split(' ');
    let map = {}
    let count = 0;

    loadedWords.forEach((value, index) => {
        var word = value.trim().toUpperCase();

        if (word.length == 5) {
            map[word] = count;
            count += 1;
        }

    });

    let selection = Math.floor(Math.random() * count);
    let words = Object.keys(map);

    return {
        words: words,
        map: map,
        wordle: words[selection]
    }

}

const keys = {
    Q: {
        type: "key",
        letter: "Q"
    },
    W: {
        type: "key",
        letter: "W"
    },
    E: {
        type: "key",
        letter: "E"
    },
    R: {
        type: "key",
        letter: "R"
    },
    T: {
        type: "key",
        letter: "T"
    },
    Y: {
        type: "key",
        letter: "Y"
    },
    U: {
        type: "key",
        letter: "U"
    },
    I: {
        type: "key",
        letter: "I"
    },
    O: {
        type: "key",
        letter: "O"
    },
    P: {
        type: "key",
        letter: "P"
    },
    A: {
        type: "key",
        letter: "A"
    },
    S: {
        type: "key",
        letter: "S"
    },
    D: {
        type: "key",
        letter: "D"
    },
    F: {
        type: "key",
        letter: "F"
    },
    G: {
        type: "key",
        letter: "G"
    },
    H: {
        type: "key",
        letter: "H"
    },
    J: {
        type: "key",
        letter: "J"
    },
    K: {
        type: "key",
        letter: "K"
    },
    L: {
        type: "key",
        letter: "L"
    },
    ENTER: {
        type: "key",
        letter: "ENTER"
    },
    Z: {
        type: "key",
        letter: "Z"
    },
    X: {
        type: "key",
        letter: "X"
    },
    C: {
        type: "key",
        letter: "C"
    },
    V: {
        type: "key",
        letter: "V"
    },
    B: {
        type: "key",
        letter: "B"
    },
    N: {
        type: "key",
        letter: "N"
    },
    M: {
        type: "key",
        letter: "M"
    },
    BACKSPACE: {
        type: "key",
        letter: "<i class=\"fas fa-2x fa-backspace\"></i>"
    }
}

let guessRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]
let currentRow = 0;
let currentTile = 0;
let isGameOver = false

let game = getWordle();
let wordle = game.wordle;
let map = game.map;
let words = game.words;

console.log(wordle);

guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement('div')
    rowElement.setAttribute('id', 'guessRow-' + guessRowIndex)
    guessRow.forEach((_guess, guessIndex) => {
        const tileElement = document.createElement('div')
        tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex)
        tileElement.classList.add('tile')
        rowElement.append(tileElement)
    });

    tileDisplay.append(rowElement)

})

Object.keys(keys).forEach(key => {
    const buttonElement = document.createElement('button')
    buttonElement.innerHTML = keys[key]['letter'];
    buttonElement.setAttribute('id', key)
    buttonElement.addEventListener('click', () => handleClick(key))
    keyboard.append(buttonElement)
})

const handleClick = (letter) => {
    if (!isGameOver) {
        if (letter === 'BACKSPACE') {
            deleteLetter()
            return
        }
        if (letter === 'ENTER') {
            checkRow()
            return
        }
        addLetter(letter)
    }
}

const addLetter = (letter) => {

    if (currentTile < 5 && currentRow < 6) {
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);

        tile.textContent = letter;
        guessRows[currentRow][currentTile] = letter;
        tile.setAttribute('data', letter);
        currentTile++;

    }

}

const deleteLetter = () => {
    if (currentTile > 0) {
        currentTile--;
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
        tile.textContent = '';
        guessRows[currentRow][currentTile] = '';
        tile.setAttribute('data', '');
    }
}

const checkWordle = (guess, wordle, map) => {

    if (!(guess.toUpperCase() in map)) {
        return 0;
    } else if (guess.toUpperCase() == wordle) {
        return 1;
    }

    return 2;

}

const resetGame = () => {

    for (var row = 0; row < 5; row++) {
        for (var column = 0; column < 5; column++) {
            const tile = document.getElementById('guessRow-' + row + '-tile-' + column);
            tile.textContent = '';
            guessRows[currentRow][currentTile] = '';
            tile.setAttribute('data', '');

            console.log(JSON.stringify(tile.classList));

            tile.classList.remove('green-overlay');
            tile.classList.remove('yellow-overlay');
            tile.classList.remove('grey-overlay');
            tile.classList.remove('flip');

        }

    }

    Object.keys(keys).forEach(keyLetter => {
        const key = document.getElementById(keyLetter)

        key.classList.remove('grey-overlay');
        key.classList.remove('green-overlay');
        key.classList.remove('yellow-overlay');

    });

    let game = getWordle();

    wordle = game.wordle;
    map = game.map;
    words = game.words;

    currentTile = 0;
    isGameOver = false;

    console.log(wordle);

}

const checkRow = () => {
    const guess = guessRows[currentRow].join('')

    if (currentTile > 4) {

        switch (checkWordle(guess, wordle, map)) {

            case 0:
                showMessage('word not in list')
                return;

            case 1:
                flipTile();
                setTimeout(() => {

                    var confetti = new Confetti('pane', 'confetti')

                    confetti.render();

                    showMessage('Magnificent!');

                    setTimeout(() => {
                        resetGame();
                    }, 2000);

                }, 3000);
                isGameOver = true
                return;

            case 2:
                flipTile();

                if (currentRow >= 5) {
                    setTimeout(() => {
                        showMessage('Game Over');
                        setTimeout(() => {
                            resetGame();
                        }, 2000);

                    }, 2000);

                    isGameOver = true

                    return;

                } else {
                    currentRow++
                    currentTile = 0
                }

                return;

        }

    }

}

const showMessage = (message) => {
    const messageElement = document.createElement('p')
    messageElement.textContent = message
    messageDisplay.append(messageElement)

    setTimeout(
        () => messageDisplay.removeChild(messageElement), 2000)

}

const addColorToKey = (keyLetter, color) => {
    const key = document.getElementById(keyLetter)
    key.classList.add(color)
}

const flipTile = () => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes
    let checkWordle = wordle
    const guess = []

    rowTiles.forEach(tile => {
        guess.push({ letter: tile.getAttribute('data'), color: 'grey-overlay' })
    })

    guess.forEach((guess, index) => {
        if (guess.letter == wordle[index]) {
            guess.color = 'green-overlay'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    })

    guess.forEach(guess => {
        if (checkWordle.includes(guess.letter)) {
            guess.color = 'yellow-overlay'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    })

    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip')
            tile.classList.add(guess[index].color)
            addColorToKey(guess[index].letter, guess[index].color)
        }, 500 * index)
    })

}