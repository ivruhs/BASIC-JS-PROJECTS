// // main script

// DOM Elements
let dealerCardDetails = document.querySelector(".dealer-card-details");
let dealerSum = document.querySelector(".dealer-sum");
let playerCardDetails = document.querySelector(".player-card-details");
let playerSum = document.querySelector(".player-sum");
let newGameButton = document.querySelector(".new-game");
let draw = document.querySelector(".draw-card");
let stand = document.querySelector(".stand-card");
let bet_amountvalue = document.querySelector(".bet-amount");
let placebet = document.querySelector(".submit");
let currentbalance = document.querySelector(".current-balance");
let endGameBtn = document.querySelector(".endGame-button");

// Game State Variables
let newGameStarted = false;
let betPlaced = false;
let bettingAmount = 0;
let betAmount = 0;

let dealerCardsArray = [];
let playerCardsArray = [];
let dealerCardSum = 0;
let playerCardSum = 0;

let playerDetails = {
  name: "Shubham",
  curr_balance: 200,
  initial_balance: 200,
};

let cardsArray = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];

// Returns a random index between 0 and 12 (inclusive)
function generateRandomCards() {
  return Math.floor(Math.random() * 13);
}

// Calculates the sum of cards based on the index values in the cardsArray
function calculateCardSum(cards) {
  let sum = 0;
  for (let i = 0; i < cards.length; i++) {
    let card = cardsArray[cards[i]];
    if (card === "A") {
      sum += 1;
    } else if (card === "J" || card === "Q" || card === "K") {
      sum += 10;
    } else {
      sum += card;
    }
  }
  return sum;
}

// Generates dealer cards until the sum is at least 17
function generateDealerCards() {
  while (calculateCardSum(dealerCardsArray) < 17) {
    let newCard = generateRandomCards();
    dealerCardsArray.push(newCard);
  }
}

// Starts a new game round
function newGame() {
  if (!betPlaced) {
    alert("You must place a bet first!");
    return;
  }

  if (newGameStarted) return; // Prevent multiple starts

  newGameStarted = true;
  newGameButton.disabled = true; // Disable new game button until round ends

  // Reset game state
  playerCardsArray = [];
  dealerCardsArray = [];
  playerCardSum = 0;
  dealerCardSum = 0;
  playerCardDetails.textContent = "";
  dealerCardDetails.textContent = "";

  // Deal two cards to player
  let playerCard1 = generateRandomCards();
  let playerCard2 = generateRandomCards();
  playerCardsArray.push(playerCard1, playerCard2);
  playerCardSum = calculateCardSum(playerCardsArray);
  playerCardDetails.textContent = `${cardsArray[playerCard1]} ${cardsArray[playerCard2]}`;
  playerSum.textContent = playerCardSum;

  // Dealer gets one card face-up, second card hidden initially
  let dealerCard1 = generateRandomCards();
  dealerCardsArray.push(dealerCard1);
  generateDealerCards(); // Generate additional dealer card(s) until sum is at least 17
  dealerCardSum = calculateCardSum(dealerCardsArray);
  // Show only the first dealer card; the rest remain hidden (represented by a question mark)
  dealerCardDetails.textContent = `${cardsArray[dealerCardsArray[0]]} ❓`;
  dealerSum.textContent = "❓";
}

// Handles drawing a card for the player
function drawCard() {
  if (!newGameStarted) return;

  if (playerCardSum < 22) {
    let newCard = generateRandomCards();
    playerCardsArray.push(newCard);
    playerCardSum = calculateCardSum(playerCardsArray);
    playerCardDetails.textContent += ` ${cardsArray[newCard]}`;
    playerSum.textContent = playerCardSum;

    setTimeout(() => {
      if (playerCardSum > 21) {
        playerDetails.curr_balance -= betAmount;
        currentbalance.textContent = `Current Balance: 💰${playerDetails.curr_balance}`;
        alert("You lose this round ☹️");
        resetRound();
      } else if (playerCardSum === 21) {
        playerDetails.curr_balance += 1.5 * betAmount;
        currentbalance.textContent = `Current Balance: 💰${playerDetails.curr_balance}`;
        alert("Congratulations! 🎉 You hit BLACKJACK 🥳");
        resetRound();
      }
    }, 300);
  }
}

// Handles the "stand" action for the player
function standCard() {
  if (!newGameStarted) return;

  // Reveal dealer's first two cards
  dealerCardDetails.textContent = `${cardsArray[dealerCardsArray[0]]} ${
    cardsArray[dealerCardsArray[1]]
  }`;
  dealerSum.textContent = dealerCardSum;

  setTimeout(() => {
    if (dealerCardSum > 21 || dealerCardSum < playerCardSum) {
      // Player wins: receives double payout
      playerDetails.curr_balance += 2 * betAmount;
      alert("Congratulations! 🎉 You win! 🏆");
    } else if (dealerCardSum > playerCardSum) {
      // Dealer wins: player loses the bet
      playerDetails.curr_balance -= betAmount;
      alert("Dealer wins! ☹️ Better luck next time.");
    } else {
      // Tie (push): refund the bet
      playerDetails.curr_balance += betAmount;
      alert("It's a Tie! Your bet is returned.");
    }
    currentbalance.textContent = `Current Balance: 💰${playerDetails.curr_balance}`;
    resetRound();
  }, 300);
}

// Ends the game and displays profit/loss information
function endGame() {
  let message = "";
  if (playerDetails.curr_balance >= 200) {
    message = `
      <h2 style="color: #00ffcc; text-align:center;">Your Profit 📈 = 💰${
        playerDetails.curr_balance - 200
      }</h2>
      <h2 style="color: #00ffcc; text-align:center;">Congratulations!!! 🎉</h2> 
    `;
  } else {
    message = `
      <h2 style="color: red; text-align:center;">Your Loss 📉 = 💰${
        200 - playerDetails.curr_balance
      }</h2>
      <h2 style="color: #197ca2; text-align:center;">Alas, Better Luck Next Time! ✨</h2> 
    `;
  }
  document.querySelector(".game-arena").innerHTML =
    message +
    `
    <div style="text-align: center;">
      <button class="button-18" onclick="location.reload()">Play Again 🔄</button>
    </div>
  `;
}

// Resets the round and enables starting a new game
function resetRound() {
  newGameStarted = false;
  betPlaced = false;
  newGameButton.disabled = false;
  if (playerDetails.curr_balance < 20) {
    document.querySelector(".game-arena").innerHTML = `
      <h2 style="color: red; text-align:center;">Current Balance = 💰${playerDetails.curr_balance}</h2>
      <h2 style="color: red; text-align:center;">You lose the game! 😢 You're BANKRUPT! 😭</h2> 
      <br>
      <div style="text-align: center;">
      <button class="button-18" onclick="location.reload()">Play Again 🔄</button>
    </div>
    `;
  }
}

// Reloads the page to restart the game completely
function restartGame() {
  location.reload();
}

// Handles placing the bet
function placingBet() {
  betAmount = Number(bet_amountvalue.value.trim());
  if (
    !betAmount ||
    betAmount < 10 ||
    betAmount > playerDetails.curr_balance / 2
  ) {
    alert("Please enter a valid bet amount (≥10 and ≤ half of balance)");
    return;
  }

  if (!betPlaced) {
    let userResponse = confirm("Are you sure you want to proceed?");
    if (userResponse) {
      bettingAmount = betAmount;
      playerDetails.curr_balance -= betAmount;
      currentbalance.textContent = `Current Balance: 💰${playerDetails.curr_balance}`;
      betPlaced = true;
      newGame();
    }
  }
}

// Event Listeners
placebet.addEventListener("click", placingBet);
newGameButton.addEventListener("click", newGame);
draw.addEventListener("click", drawCard);
stand.addEventListener("click", standCard);
endGameBtn.addEventListener("click", endGame);
