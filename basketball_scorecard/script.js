// My CODE :
// let scrABtnOne = document.querySelector(".aone");
// let scrABtnTwo = document.querySelector(".atwo");
// let scrABtnThree = document.querySelector(".athree");

// let scrBBtnOne = document.querySelector(".bone");
// let scrBBtnTwo = document.querySelector(".btwo");
// let scrBBtnThree = document.querySelector(".bthree");

// let scoreA = document.querySelector(".scoreA");
// let scoreB = document.querySelector(".scoreB");

// let scrCntA = 0;
// let scrCntB = 0;

// scrABtnOne.addEventListener("click", function () {
//   scrCntA += 1;
//   scoreA.textContent = scrCntA;
// });

// scrABtnTwo.addEventListener("click", function () {
//   scrCntA += 2;
//   scoreA.textContent = scrCntA;
// });

// scrABtnThree.addEventListener("click", function () {
//   scrCntA += 3;
//   scoreA.textContent = scrCntA;
// });

// scrBBtnOne.addEventListener("click", function () {
//   scrCntB += 1;
//   scoreB.textContent = scrCntB;
// });

// scrBBtnTwo.addEventListener("click", function () {
//   scrCntB += 2;
//   scoreB.textContent = scrCntB;
// });

// scrBBtnThree.addEventListener("click", function () {
//   scrCntB += 3;
//   scoreB.textContent = scrCntB;
// });

// let resetBtn = document.querySelector(".reset-button");

// resetBtn.addEventListener("click", function () {
//   //   console.log("reset-btn clicked");
//   scrCntA = 0;
//   scrCntB = 0;
//   scoreA.textContent = scrCntA;
//   scoreB.textContent = scrCntB;
// });

/*---------------------------------------------------------------------*/

// CHATGPT CODE:

// Select score display elements
let scoreA = document.querySelector(".scoreA");
let scoreB = document.querySelector(".scoreB");

// Initialize scores
let scrCntA = 0;
let scrCntB = 0;

// Function to update the score
function updateScore(team, points) {
  if (team === "A") {
    scrCntA += points;
    scoreA.textContent = scrCntA;
  } else if (team === "B") {
    scrCntB += points;
    scoreB.textContent = scrCntB;
  }
}

// Attach event listeners dynamically for both teams
document.querySelectorAll(".scrbtn").forEach((button) => {
  button.addEventListener("click", function () {
    let team =
      button.classList.contains("aone") ||
      button.classList.contains("atwo") ||
      button.classList.contains("athree")
        ? "A"
        : "B";
    let points =
      button.classList.contains("aone") || button.classList.contains("bone")
        ? 1
        : button.classList.contains("atwo") || button.classList.contains("btwo")
        ? 2
        : 3;
    updateScore(team, points);
  });
});

let para = document.querySelector(".winner_name");

// console.log(para);

// Reset button functionality
document.querySelector(".reset-button").addEventListener("click", function () {
  if (scrCntA > scrCntB) {
    para.innerHTML += "A - winner 🎉<br>";
  } else if (scrCntB > scrCntA) {
    para.innerHTML += "B - winner 🎉<br>";
  } else {
    para.innerHTML += "Tie 😐<br>";
  }

  scrCntA = 0;
  scrCntB = 0;
  scoreA.textContent = scrCntA;
  scoreB.textContent = scrCntB;
});

document.querySelector(".clear-button").addEventListener("click", function () {
  para.innerHTML = "";
  scrCntA = 0;
  scrCntB = 0;
  scoreA.textContent = scrCntA;
  scoreB.textContent = scrCntB;
});
