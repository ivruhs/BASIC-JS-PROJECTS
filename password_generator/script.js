//updating the slider and psw length value

function updateSlider() {
  const slider = document.getElementById("rangeSlider");
  const value = slider.value;
  const min = slider.min;
  const max = slider.max;
  const percent = ((value - min) / (max - min)) * 100;

  slider.style.background = `linear-gradient(to right, #0056B3 0%, #0056B3 ${percent}%, #E2E8F0 ${percent}%, #E2E8F0 100%)`;
  document.getElementById(
    "sliderValue"
  ).textContent = `Password Length: ${value}`;
}

// Initialising the slider
updateSlider();

document.getElementById("rangeSlider").addEventListener("input", updateSlider);

//generating the psw

function generatePassword() {
  const value = document.getElementById("rangeSlider").value; //length of psw
  const length = parseInt(value);
  const includeSymbols = document.getElementById("symbolsCheckbox").checked;
  const includeNumbers = document.getElementById("numbersCheckbox").checked;
  const includeUppercase = document.getElementById("uppercaseCheckbox").checked;
  const includeLowercase = document.getElementById("lowercaseCheckbox").checked;

  const symbols = "!@#$%^&*()_+-=[]{}|;:'\",.<>?/";
  const numbers = "0123456789";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";

  let allowedChars = ""; //string for allowed characters
  let passwordArray = []; //generated psw will be stored here based on the checkboxes ticked

  // Ensuring at least one character from each selected category is pushed into the array
  if (includeSymbols) {
    allowedChars += symbols;
    passwordArray.push(symbols[Math.floor(Math.random() * symbols.length)]);
  }
  if (includeNumbers) {
    allowedChars += numbers;
    passwordArray.push(numbers[Math.floor(Math.random() * numbers.length)]);
  }
  if (includeUppercase) {
    allowedChars += uppercase;
    passwordArray.push(uppercase[Math.floor(Math.random() * uppercase.length)]);
  }
  if (includeLowercase) {
    allowedChars += lowercase;
    passwordArray.push(lowercase[Math.floor(Math.random() * lowercase.length)]);
  }

  if (allowedChars === "") {
    alert("⚠️ Select at least one option!"); // if no checkbox is checked, alert this msg
    return;
  }

  // Filling the remaining password length with random characters
  for (let i = passwordArray.length; i < length; i++) {
    passwordArray.push(
      allowedChars[Math.floor(Math.random() * allowedChars.length)] // multiplying with allowedChars.length() makes sure math.random and math.floor returns
      // a value that is valid index for allowedChars string
    );
  }

  // Shufflling the password to avoid predictable patterns (IMP)
  passwordArray = passwordArray.sort(() => Math.random() - 0.5);

  // Converting the array to string and display the password
  document.getElementById("generatedPassword").value = passwordArray.join("");
}

//copying the value

function copyValue() {
  let text = document.getElementById("generatedPassword").value;
  navigator.clipboard
    .writeText(text)
    .then(() => alert("Copied to clipboard!"))
    .catch((err) => console.error("Copy failed:", err));
}

// resetting the psw display and checkboxes

function reset() {
  document.getElementById("generatedPassword").value = "";

  document.getElementById("symbolsCheckbox").checked = false;
  document.getElementById("numbersCheckbox").checked = false;
  document.getElementById("uppercaseCheckbox").checked = false;
  document.getElementById("lowercaseCheckbox").checked = false;
}
