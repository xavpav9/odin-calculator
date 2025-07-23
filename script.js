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
