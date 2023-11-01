// Selecionando elementos HTML usando seletores de atributos CSS
const buttonElements = document.querySelectorAll('[data-num]');
const operationButtons = document.querySelectorAll('[data-operation]');
const currentVal = document.getElementById('current');
const previousVal = document.getElementById('previous');
const clearButton = document.querySelector('.clear');
const deleteButton = document.querySelector('.delete');
const equalButtons = document.querySelector('.equal')

// Inicializa variáveis para armazenar o estado da calculadora
let currentValueElements = '';       // Armazena o valor atual sendo inserido
let previousValueWlements = '';     // Armazena o valor anterior e a operação
let operation = undefined;           // Armazena a operação matemática atual
let equalButton_ = false;           // Indica se o botão de igual foi pressionado

// Event listener para os botões numéricos
buttonElements.forEach((button) => {
  button.addEventListener('click', () => {
    if (equalButton_ === true) {
      currentValueElements = '';       // Reinicia o valor atual após um cálculo
      equalButton_ = false;
      appendNumber(button.textContent); 
    } else {
      appendNumber(button.textContent); // Anexa o número clicado ao valor atual
    }
    display();                          // Atualiza a exibição
  })
})

// Event listener para os botões de operação (+, -, *, /, etc.)
operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    operations(button.textContent)    // Lida com operações matemáticas
    display();                        // Atualiza a exibição
  })
})

// Event listener para o botão "C" (limpar)
clearButton.addEventListener('click', () => {
  clear();                            // Limpa o estado da calculadora
  display();                          // Atualiza a exibição
});

// Event listener para o botão "DEL" (apagar)
deleteButton.addEventListener("click", () => {
  deleteNum();                        // Lida com a funcionalidade de apagar
})

// Event listener para o botão "=" (igual)
equalButtons.addEventListener('click', () => {
  if (operation && currentValueElements) {
    const expression = `${previousValueWlements}${currentValueElements}`;
    const result = compute(expression);  // Calcula o resultado da expressão
    currentValueElements = result.toString();
    previousValueWlements = '';
    operation = undefined;
    display();                          // Atualiza a exibição com o resultado
    equalButton_ = true;
  }
});

// Função para anexar um número ao valor atual
function appendNumber(num) {
  if (num === '.' && currentValueElements.includes('.')) return; // Evita múltiplos pontos decimais
  currentValueElements += num.toString();
}

// Função para atualizar a exibição com os valores atuais
function display() {
  currentVal.innerText = currentValueElements;
  operation !== undefined
    ? previousVal.innerText = `${previousValueWlements}`
    : previousVal.innerText = ''
}

// Função para limpar o estado da calculadora
function clear() {
  currentValueElements = '';
  previousValueWlements = '';
  operation = undefined;
}

// Função para lidar com operações matemáticas
function operations(oper) {
  if (currentValueElements === '') return;
  operation = oper;
  previousValueWlements += `${currentValueElements} ${oper} `;
  currentValueElements = '';
}

// Função para apagar o último caractere do valor atual
function deleteNum() {
  currentValueElements = currentVal.textContent.slice(0, -1);
  currentVal.innerText = currentValueElements;
}

// Função para calcular o resultado de uma expressão matemática
function compute(expression) {
  // Inicializa pilhas para lidar com operadores e operandos
  const operators = [];
  const operands = [];

  // Define a precedência dos operadores
  const precedence = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2
  };

  // Função para aplicar um operador a dois operandos
  function applyOperator() {
    const operator = operators.pop();
    const rightOperand = operands.pop();
    const leftOperand = operands.pop();

    let result;
    switch (operator) {
      case '+':
        result = leftOperand + rightOperand;
        break;
      case '-':
        result = leftOperand - rightOperand;
        break;
      case 'x':
        result = leftOperand * rightOperand;
        break;
      case '÷':
        result = leftOperand / rightOperand;
        break;
      case '%':
        result = leftOperand % rightOperand;
    }

    operands.push(result);
  }

  let i = 0;
  while (i < expression.length) {
    if (expression[i] === ' ') {
      i++;
      continue;
    }

    if (expression[i] >= '0' && expression[i] <= '9') {
      let num = 0;
      while (i < expression.length && expression[i] >= '0' && expression[i] <= '9') {
        num = num * 10 + (expression[i] - '0');
        i++;
      }
      operands.push(num);
    } else {
      while (
        operators.length > 0 &&
        precedence[operators[operators.length - 1]] >= precedence[expression[i]]
      ) {
        applyOperator();
      }
      operators.push(expression[i]);
      i++;
    }
  }

  while (operators.length > 0) {
    applyOperator();
  }

  return operands[0];
}
