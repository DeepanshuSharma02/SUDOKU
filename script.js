
const sudokuContainer = document.querySelector(".sudoku-container")
function setUpSudoku() {
    sudokuContainer.innerHTML = ""
    const URL = "https://sugoku.onrender.com/board?difficulty=easy"
    let board = fetch(URL).then(response => response.json()).then(data => {
        let grid = data.board
        console.log(grid);
        let board = grid;
        const encodeBoard = (board) => board.reduce((result, row, i) => result + `%5B${encodeURIComponent(row)}%5D${i === board.length - 1 ? '' : '%2C'}`, '');

        const encodeParams = (params) =>
            Object.keys(params)
                .map(key => key + '=' + `%5B${encodeBoard(params[key])}%5D`)
                .join('&');

        const d = { board: grid };

        async function getSolution() {
            let solution = -1;
            try {
                const response = await fetch('https://sugoku.onrender.com/solve', {
                    method: 'POST',
                    body: encodeParams(d),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
                const data = await response.json();
                solution = data.solution;
                console.log('Solution:', solution); // Now the solution is logged after it has been set
                return solution; // Returning the solution to use it outside
            } catch (error) {
                console.warn(error);
            }
        }

        getSolution().then(solution => {
            // Use the solution variable here
            let errorCnt = 0
            let initialcnt = 0;
            let insertedval = 0;
            let selectedrow = -1;
            let selectedcol = -1;
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    const temp = document.querySelector('#element').content.cloneNode(true)
                    const input = temp.querySelector('input')
                    console.log(solution[i][j])
                    input.classList.add(`r${i}c${j}`)
                    sudokuContainer.appendChild(temp)
                    if (grid[i][j]) {
                        input.classList.add('initial')
                        input.classList.add('valueInserted')
                        initialcnt++;
                        input.addEventListener('input', () => {
                            input.value = grid[i][j]
                        })
                        input.value = `${grid[i][j]}`
                    }
                    else {

                        input.addEventListener('input', e => {

                            if (input.classList.contains("valueInserted")) {

                            } else {
                                let value = input.value

                                if (value[0] > '9' || value[0] < '1') input.value = ""
                                if (value != solution[i][j]) {
                                    input.value = ""
                                    errorCnt++;
                                    errorHit(errorCnt)

                                    if (errorCnt >= 3) {
                                        gameOverByError()
                                    }
                                } else {
                                    insertedval++;
                                    input.classList.add('valueInserted')
                                    input.addEventListener('input', () => {
                                        input.value = solution[i][j];
                                    })
                                    input.value = solution[i][j];

                                }
                                if (insertedval == (81 - initialcnt)) {
                                    gameOverByWin();
                                }

                            }

                        })
                        input.addEventListener('click', () => {
                            if (selectedrow != -1) {
                                let prevcell = document.getElementsByClassName(`r${selectedrow}c${selectedcol}`)[0];
                                prevcell.style.backgroundColor = `#FFF5E0`;
                            }


                            if (selectedrow === i && selectedcol === j) {

                                selectedcol = -1;
                                selectedrow = -1;
                            } else {

                                selectedcol = j;
                                selectedrow = i;
                                let currcell = document.getElementsByClassName(`r${i}c${j}`)[0];
                                currcell.style.backgroundColor = "pink";
                            }

                            console.log(`${selectedrow}`);
                            console.log(`${selectedcol}`);
                        })








                    }
                }

            }


            const temp2 = document.querySelector('.inputbuttons');
            temp2.addEventListener('click', e => {

                let value = e.target.id;

                e.target.classList.add("clicked");
                setTimeout(() => {
                    e.target.classList.remove("clicked");
                }, 300);

                if (selectedcol != -1 && selectedrow != -1) {
                    let cell = document.getElementsByClassName(`r${selectedrow}c${selectedcol}`)[0];

                    console.log(value);
                    if (cell.classList.contains("valueInserted")) {

                    } else {
                        if (value != solution[selectedrow][selectedcol]) {

                            cell.value = ""
                            errorCnt++;
                            errorHit(errorCnt)


                            if (errorCnt >= 3) {
                                gameOverByError()
                            }
                        } else {
                            insertedval++;
                            cell.classList.add('valueInserted')
                            cell.addEventListener('click', () => {
                                cell.value = solution[selectedrow][selectedcol];
                            })
                            cell.value = solution[selectedrow][selectedcol];

                        }
                        if (insertedval === (81 - initialcnt)) {
                            gameOverByWin();
                        }
                    }


                }

            })


            console.log('Stored solution:', solution);
        });



    }
    )
}

const errorsound = new Audio('errorr.mp3');
const winsound = new Audio('win.wav');
const gameoversound = new Audio('gameover.mp3');
setUpSudoku()

let d = document.querySelector("#bhadiyasi");
d.addEventListener('click', () => {
    sudokuContainer.innerHTML = ""
    location.reload()

});

function errorHit(errorCnt) {
    errorsound.pause();
    let Error = document.querySelector('#Error');
    Error.innerText = "ERRORS: " + errorCnt;
    errorsound.play();
    console.error("error")
}

function gameOverByError() {
    console.log("Sorry, You lost the game")
    togglePopup()
    gameoversound.play();
    function togglePopup() {
        var popup = document.getElementById("popup1");
        popup.style.display = (popup.style.display === "block") ? "none" : "block";
    }
    setTimeout(togglePopup, 3000);
    setTimeout(function () {
        location.reload();

    }, 3000);

    let Error = document.querySelector('#Error');
    Error.innerText = "ERRORS: " + 0;
}


function gameOverByWin() {
    winsound.play();
    console.log("YOU WIN");
    togglePopup()
    function togglePopup() {
        var popup = document.getElementById("popup");
        popup.style.display = (popup.style.display === "block") ? "none" : "block";
    }
    setTimeout(togglePopup, 3000);

}



var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var hoursLabel = document.getElementById("hours");
var totalSeconds = 0;
setInterval(setTime, 1000);

function setTime() {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
    hoursLabel.innerHTML = pad(parseInt(totalSeconds / 3600));
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

