const calculator = document.querySelector(".calculator");
const displayText = document.querySelector(".display .text");

const numbers = "0 1 2 3 4 5 6 7 8 9".split(" ");
calculator.addEventListener("click", evt => {
  if (evt.target.tagName === "BUTTON") {
    if (numbers.includes(evt.target.textContent)) {
      displayText.textContent += evt.target.textContent; 
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

    case "*":
      return multiply(leftOperand, rightOperand);
      break;

    case "/":
      return divide(leftOperand, rightOperand);
      break;
  };
};

