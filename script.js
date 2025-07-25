const ERROR_MESSAGE = "Error";
const TOO_LONG = "Too Long";
const MAX_LENGTH = 7;
const calculator = document.querySelector(".calculator");
const displayText = document.querySelector(".display .text");
const displayOperator = document.querySelector(".display .operator");
const display = document.querySelector(".display");

displayText.textContent = "0";
const numbers = "0 1 2 3 4 5 6 7 8 9".split(" ");
const operators = "+ - x ÷ xy y√x".split(" ");
let operatorReady = false;
let operatorJustReady = false;
let memory = 0;
let leftOperand;
let operator;

calculator.addEventListener("click", evt => {
  if (evt.target.tagName === "BUTTON") {
    if (evt.target.textContent === "AC" || displayText.textContent === ERROR_MESSAGE || displayText.textContent === TOO_LONG) {
      leftOperand = "";
      operator = "";
      operatorReady = false;
      operatorJustReady = false;
      displayText.textContent = "0";
      displayOperator.textContent = "";
      if (evt.target.textContent === "AC") return;
    };

    if (evt.target.textContent === "CE" || evt.target.textContent === "DEL") {
      if (operatorJustReady && operator !== "=") { // don't clear screen, only remove operator
        operatorReady = false;
        operator = "";
        operatorJustReady = false;
        displayOperator.textContent = "";
        return;
      }
      if (evt.target.textContent === "DEL") {
        let newText = displayText.textContent.slice(0, -1);
        if (newText === "" || newText === "-") newText = "0";
        if (operatorReady && newText === "0") {
          newText = leftOperand;
          operatorReady = false;
          displayOperator.textContent = "";
        }
        if (operator === "=") displayOperator.textContent = "";
        displayText.textContent = newText;
      } else {
        displayText.textContent = "0";
        displayOperator.textContent = "";
      };

    } else if (evt.target.textContent === "M") {
      memory = +displayText.textContent;
    } else if (evt.target.textContent === "MR") {
      displayText.textContent = memory;
      if (operatorJustReady) operatorJustReady = false;
      if (operator === "=") displayOperator.textContent = "";
    } else {
      if (numbers.includes(evt.target.textContent)) {
        if (displayText.textContent === "0") displayText.textContent = "";
        if (operatorJustReady) {
          displayText.textContent = "";
          operatorJustReady = false;
        }
        if (String(displayText.textContent).length < MAX_LENGTH) displayText.textContent += evt.target.textContent; 
        else if (String(displayText.textContent).includes("-")) {
          if (String(displayText.textContent).split("-")[1].length < MAX_LENGTH) displayText.textContent += evt.target.textContent; 
        };
          
        if (operator === "=") displayOperator.textContent = "";
      };
      
      if (evt.target.textContent === "." && !displayText.textContent.includes(".")){
        if (operator === "=") {
          displayOperator.textContent = "";
          displayText.textContent = "0";
        };
        if (operatorJustReady === true) displayText.textContent = "0";
        if (operatorJustReady) operatorJustReady = false;
        displayText.textContent += evt.target.textContent;
      };
      
      if (evt.target.textContent === "+/-") {
        if (operator === "=") displayOperator.textContent = "";
        let newText;
        if (+displayText.textContent < 0) {
          newText = displayText.textContent.slice(1);
        } else {
          newText = "-" + displayText.textContent;
        };
        displayText.textContent = newText;
      };

      if (operators.includes(evt.target.textContent) && !operatorReady) {
        leftOperand = +displayText.textContent;
        operator = evt.target.textContent;
        operatorReady = true;
        operatorJustReady = true;
        if (evt.target.classList.contains("power")) displayOperator.textContent = "^";
        else if (evt.target.classList.contains("root")) displayOperator.textContent = "√";
        else displayOperator.textContent = evt.target.textContent;

      } else if ((evt.target.textContent === "=" || operators.includes(evt.target.textContent)) && operatorReady && !operatorJustReady && displayText.textContent !== "") {
        if ((+displayText.textContent === 0 && operator === "÷") || (leftOperand < 0 && operator === "y√x" && +displayText.textContent > 1) || (leftOperand < 0 && operator === "xy" && +displayText.textContent < 1 && +displayText.textContent > 0)) {
          displayText.textContent = ERROR_MESSAGE;
        } else {
          leftOperand = operate(leftOperand, operator, +displayText.textContent);
          if (leftOperand === NaN) { 
            displayText.textContent = ERROR_MESSAGE;
            return;
            }
          let negative = false;
          if (leftOperand < 0) {
            leftOperand *= -1;
            negative = true;
          };
          
          const exponentialLeftOperand = leftOperand.toExponential();
          const eNumber = String(exponentialLeftOperand).includes("e+") ? String(exponentialLeftOperand).split("e+")[0] : String(exponentialLeftOperand).split("e-")[0];
          const ePower = String(exponentialLeftOperand).split("e+")[1] ?? String(exponentialLeftOperand).split("e-")[1];

          if ((exponentialLeftOperand.includes("e+") && ePower > (MAX_LENGTH - 1)) || (exponentialLeftOperand.includes("e-") && ePower > (MAX_LENGTH - 2))) {
            leftOperand = Math.round(eNumber * (10 ** (MAX_LENGTH - ePower.length - 2 - 2))) / (10 ** (MAX_LENGTH - ePower.length - 2 - 2)); // 2 for the e+/e-, and 2 for the decimal point and before decimal point
            leftOperand += (exponentialLeftOperand.includes("e+") ? "e+" : "e-") + ePower;
          } else if (String(leftOperand).split(".")[0].length > MAX_LENGTH || leftOperand === -Infinity || leftOperand === Infinity) leftOperand = TOO_LONG;
          else {
            if (String(leftOperand)[MAX_LENGTH] === ".") {
              leftOperand = Math.round(leftOperand);
            } else if (String(leftOperand).slice(0, MAX_LENGTH).includes(".")) {
              const right = String(leftOperand).slice(0, MAX_LENGTH).split(".")[1].length;
              leftOperand = Math.round(leftOperand * (10 ** (right))) / (10 ** (right));
            };
          };
          if (leftOperand === 10 ** MAX_LENGTH || leftOperand === -(10 ** MAX_LENGTH)) leftOperand = leftOperand.toExponential();

          displayText.textContent = ((negative && leftOperand !== TOO_LONG) ? "-" : "") + leftOperand;

          if (evt.target.textContent === "=") {
            operatorReady = false;
            operator = "="; // for CE
          } else operator = evt.target.textContent; // for chained operations
          operatorJustReady = true; 
        };
        if (evt.target.classList.contains("power")) displayOperator.textContent = "^";
        else if (evt.target.classList.contains("root")) displayOperator.textContent = "√";
        else displayOperator.textContent = evt.target.textContent;
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
  "^": ".power",
  "=": ".equals",
  "Enter": ".equals",
  "Backspace": ".delete",
  ".": ".decimal-point",
}

window.addEventListener("keydown", evt => {
  if (!evt.ctrlKey && !evt.altKey && !evt.metaKey) { // not shift because it is needed to press + and *
    evt.preventDefault();
    const keyClass = numberToClass[evt.key];
    if (keyClass !== undefined) document.querySelector(keyClass).dispatchEvent(new Event("click", {bubbles: true}));
  };
});

function add(num1, num2) {return num1 + num2};
function subtract(num1, num2) {return num1 - num2};
function multiply(num1, num2) {return num1 * num2};
function divide(num1, num2) {return num1 / num2};
function power(num1, num2) {return num1 ** num2};
function root(num1, num2) {return num1 ** (1/num2)};

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

    case "xy":
      return power(leftOperand, rightOperand);
      break;

    case "y√x":
      return root(leftOperand, rightOperand);
      break;
  };
};

