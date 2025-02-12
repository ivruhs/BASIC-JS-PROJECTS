// DOM elements
const category = document.getElementById("category"); // Dropdown for category selection
const inputUnit = document.getElementById("inputUnit"); // Dropdown for input unit
const outputUnit = document.getElementById("outputUnit"); // Dropdown for output unit
const inputValue = document.getElementById("inputValue"); // User input field
const outputValue = document.getElementById("outputValue"); // Result output field

const convertButton = document.getElementById("convertButton"); // Convert button
const swapButton = document.getElementById("swapButton"); // Swap button
const addFavorite = document.getElementById("addFavorite"); // AddToFav button

const clearHistory = document.getElementById("clrHistory"); // Clear History button
const clearFav = document.getElementById("clrFav"); // Clear Fav button

const darkModeToggle = document.getElementById("darkModeToggle"); // Dark Mode button

// Initially disable the input field & convert button
inputValue.disabled = true;
convertButton.disabled = true;

// Define conversion factors for different categories

// ****[conversion table (object)]****

const conversionFactors = {
  length: {
    meters: 1, // Base unit
    feet: 3.281, // 1 meter = 3.281 feet
  },
  volume: {
    liters: 1, // Base unit
    gallons: 0.264, // 1 liter = 0.264 gallons
  },
  mass: {
    kilograms: 1, // Base unit
    pounds: 2.205, // 1 kg = 2.205 pounds
  },
  speed: {
    kmph: 1, // Base unit
    mph: 0.621, // 1 km/h = 0.621 mph
  },
  area: {
    squaremeters: 1, // Base unit
    squarefeet: 10.764, // 1 sq meter = 10.764 sq feet
    acres: 0.000247, // 1 sq meter = 0.000247 acres
  },
  temperature: {
    // the logic is to first convert any given input value and input unit to celsius and then to the desired output unit
    celsius: function (value) {
      return value; // Base unit (no change)
    },
    fahrenheit: function (value) {
      return (value * 9) / 5 + 32; // Celsius → Fahrenheit
    },
    kelvin: function (value) {
      return value + 273.15; // Celsius → Kelvin
    },
  },
};

// Update unit dropdowns when category is selected
category.addEventListener("change", function (event) {
  const selectedCategory = event.target.value; // Get selected category
  const units = Object.keys(conversionFactors[selectedCategory] || []); // Get units for category

  // Disable input if no category is selected
  if (units.length === 0) {
    inputValue.value = "";
    inputValue.disabled = true;
    convertButton.disabled = true;
  } else {
    inputValue.disabled = false;
  }

  // Create dropdown options dynamically
  const optionsHTML = units
    .map(
      (unit) =>
        `<option value="${unit}">${
          unit.charAt(0).toUpperCase() + unit.slice(1)
        }</option>`
    )
    .join("");

  inputUnit.innerHTML = `<option value="">Select Unit</option>` + optionsHTML;
  outputUnit.innerHTML = `<option value="">Select Unit</option>` + optionsHTML;
});

// Enable Convert button only if valid units are selected
[inputUnit, outputUnit, inputValue].forEach((element) => {
  element.addEventListener("change", () => {
    if (
      inputUnit.value !== "" &&
      outputUnit.value !== "" &&
      inputValue.value !== ""
    ) {
      convertButton.disabled = false;
    } else {
      convertButton.disabled = true;
    }
  });
});

// Convert the value when the Convert button is clicked
convertButton.addEventListener("click", function () {
  let inputValueNumber = parseFloat(inputValue.value); // Convert input to a number
  const selectedCategory = category.value;
  const fromUnit = inputUnit.value;
  const toUnit = outputUnit.value;

  if (isNaN(inputValueNumber)) {
    alert("Please enter a valid number!");
    return;
  }

  let outputResult;

  // Special case for temperature (formula-based conversion)
  if (selectedCategory === "temperature") {
    if (fromUnit === toUnit) {
      outputResult = inputValueNumber; // No conversion needed
    } else if (fromUnit === "celsius") {
      outputResult = conversionFactors.temperature[toUnit](inputValueNumber);
    } else if (fromUnit === "fahrenheit") {
      // Convert Fahrenheit to Celsius first, then to target unit
      let celsius = ((inputValueNumber - 32) * 5) / 9;
      outputResult = conversionFactors.temperature[toUnit](celsius);
    } else if (fromUnit === "kelvin") {
      // Convert Kelvin to Celsius first, then to target unit
      let celsius = inputValueNumber - 273.15;
      outputResult = conversionFactors.temperature[toUnit](celsius);
    }
  } else {
    // General conversion formula
    const baseValue =
      inputValueNumber / conversionFactors[selectedCategory][fromUnit];
    outputResult = baseValue * conversionFactors[selectedCategory][toUnit];
  }

  // Display the result
  outputValue.value = outputResult.toFixed(4); // Limit to 4 decimal places
  modifyHistory();
});

// Swap units when Swap button is clicked
swapButton.addEventListener("click", function () {
  let tempUnit = inputUnit.value;
  inputUnit.value = outputUnit.value;
  outputUnit.value = tempUnit;

  // Recalculate the conversion if a valid value exists
  if (
    inputValue.value !== "" &&
    inputUnit.value !== "" &&
    outputUnit.value !== ""
  ) {
    convertButton.click();
  }
});

function modifyHistory() {
  let ul = document.getElementById("historyList");
  let inputValueNumber = parseFloat(inputValue.value); // Convert input to a number

  // Check if input is a valid number
  if (isNaN(inputValueNumber)) {
    alert("Please enter a valid number!");
    return;
  }

  // const selectedCategory = category.value;
  const fromUnit = inputUnit.value;
  const toUnit = outputUnit.value;
  let output = outputValue.value;

  // Check if units are selected
  if (fromUnit === "" || toUnit === "") {
    alert("Please select both units!");
    return;
  }

  let li = document.createElement("li");
  li.textContent = `${inputValueNumber} ${fromUnit} = ${output} ${toUnit}`;
  ul.appendChild(li);
}

clearHistory.addEventListener("click", function () {
  let ul = document.getElementById("historyList");
  ul.innerHTML = "";
});

function addToFav() {
  let ul = document.getElementById("favoritesList");
  let inputValueNumber = parseFloat(inputValue.value); // Convert input to a number
  // Check if input is a valid number
  if (isNaN(inputValueNumber)) {
    alert("Please enter a valid number!");
    return;
  }

  // const selectedCategory = category.value;
  const fromUnit = inputUnit.value;
  const toUnit = outputUnit.value;
  let output = outputValue.value;

  // Check if units are selected
  if (fromUnit === "" || toUnit === "") {
    alert("Please select both units!");
    return;
  }

  let li = document.createElement("li");
  li.textContent = `${inputValueNumber} ${fromUnit} = ${output} ${toUnit}`;
  ul.appendChild(li);
}

addFavorite.addEventListener("click", function () {
  addToFav();
});

clearFav.addEventListener("click", function () {
  let ul = document.getElementById("favoritesList");
  ul.innerHTML = "";
});

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}
darkModeToggle.addEventListener("change", toggleDarkMode);
