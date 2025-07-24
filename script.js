const ZERO_MESSAGE = "Error";
const TOO_LONG = "Too Long";
const MAX_LENGTH = 8;
const calculator = document.querySelector(".calculator");
const displayText = document.querySelector(".display .text");
const displayOperator = document.querySelector(".display .operator");
const display = document.querySelector(".display");

displayText.textContent = "0";
const numbers = "0 1 2 3 4 5 6 7 8 9".split(" ");
const operators = "+ - x ÷".split(" ");
let operatorReady = false;
let operatorJustReady = false;
let decimalUsed = false;
let leftOperand;
let operator;

calculator.addEventListener("click", evt => {
  if (evt.target.tagName === "BUTTON") {
    if (evt.target.textContent === "AC" || displayText.textContent === ZERO_MESSAGE || displayText.textContent === TOO_LONG) {
      leftOperand = "";
      operator = "";
      operatorReady = false;
      operatorJustReady = false;
      decimalUsed = false;
      displayText.textContent = "0";
      displayOperator.textContent = "";
      if (evt.target.textContent === "AC") return;
    };

    if (evt.target.textContent === "CE" || evt.target.textContent === "DEL") {
      if (operatorJustReady && operator !== "=") { // don't clear screen, only remove operator
        operatorReady = false;
        operator = "";
        operatorJustReady = false;
        return;
      }
      if (evt.target.textContent === "DEL") {
        let newText = displayText.textContent.slice(0, -1);
        if (!newText.includes(".")) decimalUsed = false;
        if (newText === "") {
          newText += "0";
          displayOperator.textContent = "";
        };
        if (operator === "=") displayOperator.textContent = "";
        displayText.textContent = newText;
      } else {
        decimalUsed = false;
        displayText.textContent = "0";
        displayOperator.textContent = "";
      };

      if (operatorReady) operatorJustReady = true; // for preventing early equals pressing

    } else {
      if (numbers.includes(evt.target.textContent)) {
        if (displayText.textContent === "0") displayText.textContent = "";
        if (operatorJustReady) {
          displayText.textContent = "";
          operatorJustReady = false;
        }
        if (!(String(displayText.textContent).length >= 8)) displayText.textContent += evt.target.textContent; 
        if (operator === "=") displayOperator.textContent = "";
      };
      
      if (evt.target.textContent === "." && !decimalUsed) {
        if (operator === "=") {
          displayOperator.textContent = "";
          displayText.textContent = "0";
        };
        if (operatorJustReady) operatorJustReady = false;
        displayText.textContent += evt.target.textContent;
        decimalUsed = true;
      };

      if (operators.includes(evt.target.textContent) && !operatorReady) {
        leftOperand = +displayText.textContent;
        operator = evt.target.textContent;
        operatorReady = true;
        operatorJustReady = true;
        displayOperator.textContent = evt.target.textContent;

      } else if ((evt.target.textContent === "=" || operators.includes(evt.target.textContent)) && operatorReady && !operatorJustReady && displayText.textContent !== "") {
        if (+displayText.textContent === 0 && operator === "÷") {
          displayText.textContent = ZERO_MESSAGE;
        } else {
          leftOperand = operate(leftOperand, operator, +displayText.textContent);

          if (String(leftOperand).split(".")[0].length > MAX_LENGTH) leftOperand = TOO_LONG;
          else {
            if (String(leftOperand)[8] === ".") {
              leftOperand = Math.round(leftOperand);
            } else if (String(leftOperand).slice(0, 8).includes(".")) {
              const right = String(leftOperand).slice(0, 8).split(".")[1].length;
              leftOperand = Math.round(leftOperand * (10 ** (right))) / (10 ** (right));
            };
          };

          displayText.textContent = leftOperand;

          if (evt.target.textContent === "=") {
            operatorReady = false;
            operator = "="; // for CE
          } else operator = evt.target.textContent; // for chained operations
          operatorJustReady = true; 
          if (!displayText.textContent.includes(".")) {
            decimalUsed = false;
          };
        };
        displayOperator.textContent = evt.target.textContent;
      };
    };
  };
});

const numberToClass = {
  "0": ".zero",
  "1": ".one",
  "2": ".two",
  "3": ".three",
  "4": ".four",
  "5": ".five",
  "6": ".six",
  "7": ".seven",
  "8": ".eight",
  "9": ".nine",
  "+": ".plus",
  "-": ".subtract",
  "÷": ".divide",
  "/": ".divide",
  "x": ".times",
  "*": ".times",
  "=": ".equals",
  "Enter": ".equals",
  "Backspace": ".delete",
  ".": ".decimal-point",
}

window.addEventListener("keydown", evt => {
  const keyClass = numberToClass[evt.key];
  if (keyClass !== undefined) document.querySelector(keyClass).dispatchEvent(new Event("click", {bubbles: true}));
});

function add(num1, num2) {return num1 + num2};
function subtract(num1, num2) {return num1 - num2};
function multiply(num1, num2) {return num1 * num2};
function divide(num1, num2) {return num1 / num2};

function operate(leftOperand, operator, rightOperand) {
  switch (operator) {
    case "+":
      return add(leftOperand, rightOperand);
      break;

    case "-":
      return subtract(leftOperand, rightOperand);
      break;

    case "x":
      return multiply(leftOperand, rightOperand);
      break;

    case "÷":
      return divide(leftOperand, rightOperand);
      break;
  };
};

