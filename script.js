const calculator = document.querySelector(".calculator");
const displayText = document.querySelector(".display .text");

const numbers = "0 1 2 3 4 5 6 7 8 9".split(" ");
const operators = "+ - x ÷".split(" ");
let operatorReady = false;
let operatorJustReady = false;
let leftOperand;
let operator;

calculator.addEventListener("click", evt => {
  if (evt.target.tagName === "BUTTON") {
    if (numbers.includes(evt.target.textContent)) {
      if (operatorJustReady) {
        displayText.textContent = "";
        operatorJustReady = false;
      }
      displayText.textContent += evt.target.textContent; 
    };

    if (operators.includes(evt.target.textContent) && !operatorReady) {
      leftOperand = +displayText.textContent;
      operator = evt.target.textContent;
      operatorReady = true;
      operatorJustReady = true;
    } else if ((evt.target.textContent === "=" || operators.includes(evt.target.textContent)) && operatorReady && !operatorJustReady && displayText.textContent !== "") {
      leftOperand = Math.round(operate(leftOperand, operator, +displayText.textContent) * 100) / 100;
      displayText.textContent = leftOperand;
      if (evt.target.textContent === "=") operatorReady = false;
      else operator = evt.target.textContent;
      operatorJustReady = true; 
    }
  }
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

