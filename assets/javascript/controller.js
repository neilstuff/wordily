const tileDisplay = document.querySelector('.tile-container')
const keyboard = document.querySelector('.key-container')
const messageDisplay = document.querySelector('.message-container')

const getWordle = () => {

    let loadedWords = document.querySelector('script[data-template="words"]').textContent.split(' ');
    let map = {}
    let count = 0;

    loadedWords.forEach((value, index) => {
        var word = value.trim();

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
        wordle: words[selection].toUpperCase()
    }

}

const keys = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'ENTER',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    '«',
]
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

wordle = getWordle().wordle;

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

keys.forEach(key => {
    const buttonElement = document.createElement('button')
    buttonElement.textContent = key
    buttonElement.setAttribute('id', key)
    buttonElement.addEventListener('click', () => handleClick(key))
    keyboard.append(buttonElement)
})

const handleClick = (letter) => {
    if (!isGameOver) {
        if (letter === '«') {
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
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
        tile.textContent = letter
        guessRows[currentRow][currentTile] = letter;
        tile.setAttribute('data', letter)
        currentTile++
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

const checkWordle = (guess, wordle) => {

    if (guess.toUpperCase() == wordle) {

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

    wordle = getWordle().wordle;
    currentRow = 0;
    currentTile = 0;
    isGameOver = false;

    console.log(wordle);
}

const checkRow = () => {
    const guess = guessRows[currentRow].join('')

    if (currentTile > 4) {

        switch (checkWordle(guess, wordle)) {

            case 0:
                showMessage('word not in list')
                return;

            case 1:
                flipTile();
                setTimeout(() => {
                    showMessage('Magnificent!');
                    resetGame();
                }, 2500);
                isGameOver = true
                return;

            case 2:
                flipTile();

                if (currentRow >= 5) {
                    isGameOver = true
                    showMessage('Game Over')
                    return
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