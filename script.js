
const sudokuContainer = document.querySelector(".sudoku-container")

function setUpSudoku() {
    sudokuContainer.innerHTML = ""
    const URL = "https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:1){grids{value,solution}}}"
    let board = fetch(URL).then(response => response.json()).then(data => {
        let grid = data.newboard.grids[0].value
        let solution = data.newboard.grids[0].solution
        let errorCnt = 0
        let initialcnt=0;
        let insertedval=0;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const temp = document.querySelector('#element').content.cloneNode(true)
                const input = temp.querySelector('input')
                console.log(solution[i][j])
                input.classList.add(`r${i}c${j}`)
                sudokuContainer.appendChild(temp)
                if (grid[i][j]) {
                    input.classList.add('initial')
                    initialcnt++;
                    input.addEventListener('input', () => {
                        input.value = grid[i][j]
                    })
                    input.value = `${grid[i][j]}`
                }
                else {
                    input.addEventListener('input', e => {
                        if (input.classList.contains("valueInserted")) {

                        }else{
                            let value = input.value
                            insertedval++;
                            if (value[0] > '9' || value[0] < '1') input.value = ""
                            if (value != solution[i][j]) {
                                input.value = ""
                                errorCnt++;
                                errorHit(errorCnt)

                                if (errorCnt >= 3) {
                                    gameOverByError()
                                }
                            } else {
                                input.classList.add('valueInserted')
                                input.addEventListener('input', () => {
                                    input.value = solution[i][j];
                                })
                                input.value = solution[i][j];

                            }
                            if(insertedval==(81-initialcnt)){
                                gameOverByWin();
                            }

                        }

                    })
                }
            }

        }
    }
    )
}

const errorsound = new Audio('errorr.mp3');
const winsound = new Audio('win.wav');
const gameoversound = new Audio('gameover.mp3');
setUpSudoku()

let d=document.querySelector("#bhadiyasi");
d.addEventListener('click',()=>{
    sudokuContainer.innerHTML = ""
    location.reload()
    
});

function errorHit(errorCnt) {
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
    setTimeout(togglePopup,3000);
    setTimeout(setUpSudoku,3000);
    
    let Error = document.querySelector('#Error');
    Error.innerText = "ERRORS: " + 0;
}

function gameOverByWin(){
    winsound.play();
    console.log("YOU WIN");
    togglePopup()
    function togglePopup() {
        var popup = document.getElementById("popup");
        popup.style.display = (popup.style.display === "block") ? "none" : "block";
      }
    setTimeout(togglePopup,3000);
    

    

}

