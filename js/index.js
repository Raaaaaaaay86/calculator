const calculator = document.getElementById('calculator');
const formula = document.getElementById('formula');
const result = document.getElementById('result');

const formulaStack = [];
let calculatedResult = 0;

const updateFormulaText = () => {
  formula.innerText = formulaStack.join('');
}

const updateResultText = () => {
  result.innerText = calculatedResult;
}

const reset = () => {
  formulaStack.length = 0;
  calculatedResult = 0;

  updateFormulaText()
  updateResultText()
};

const backspace = () => {
  // 當有計算結過果，且算式區(formula)為空時。 保留計算結果留在 fomulaStack[0]，避免被刪除。
  if (formulaStack.length !== 0 && formula.innerText.length === 0) return;
  formulaStack.pop();
  updateFormulaText();
};

const operatorFilter = (unfiltered) => {
  switch (unfiltered) {
    case '÷':
      return '/';
    case '×':
      return '*';
    case '＋':
      return '+';
    case '－':
      return '-';
    case '=':
      return '';
    default:
      return unfiltered;
  }
}

const calculate = () => {
  let convertedFormula = ''
  
  formulaStack.forEach((item) => {
    convertedFormula += operatorFilter(item)
  })

  console.log('reee', convertedFormula);
  calculatedResult = eval(convertedFormula);

  formulaStack.length = 0;
  formula.innerText = '';
  formulaStack[1] = calculatedResult;
  result.innerText = calculatedResult;
}

calculator.addEventListener('click', (event) => {
  const btnValue = event.target.dataset.value;

  if (btnValue && btnValue !== 'clear' && btnValue !== 'backspace') {
    const inputIsNaN = isNaN(parseInt(btnValue, 10));
    const formulaLastItem = parseInt(formulaStack[formulaStack.length - 1], 10);
    const formulaLastItemIsNaN = isNaN(parseInt(formulaStack[formulaStack.length - 1], 10));

    if (formulaStack.length === 0 && btnValue === '0' ) {
      return;
    }

    if (formulaStack.length !== 0 && ['0', '00'].includes(btnValue) && formulaLastItemIsNaN) {
      return;
    }

    if (formulaStack.length === 0 && parseInt(formulaLastItem, 10) === 0 ) {
      return;
    }

    if (formulaStack.length !== 0 && formulaLastItemIsNaN && inputIsNaN) {
      backspace();
    }

    formulaStack.push(btnValue);
    updateFormulaText();
  }
  
  if (btnValue === 'clear') {
    reset();
  }
  
  if (btnValue === 'backspace') {
    backspace();
  }

  if (btnValue === '=') {
    calculate()
  }
});

// 給顯示區的 drag scroll
let positions = {
  ResultTop: 0,
  left: 0,
  userX: 0,
  userY: 0,
};

const mouseMoveHandler = function(e) {
  const dx = e.clientX - positions.userX;

  if (e.target === result) {
    result.scrollLeft = positions.left - dx;
  } else if (e.target === formula) {
    formula.scrollLeft = positions.left - dx;
  }
};

const mouseUpHandler = function() {
  document.removeEventListener('mousemove', mouseMoveHandler);
  document.removeEventListener('mouseup', mouseUpHandler);
};

result.addEventListener('mousedown', (event) => {
  positions = {
    left: result.scrollLeft,
    userX: event.clientX,
    userY: event.clientY,
  }


  document.addEventListener('mousemove', mouseMoveHandler);
  document.addEventListener('mouseup', mouseUpHandler);
})

formula.addEventListener('mousedown', (event) => {
  positions = {
    left: result.scrollLeft,
    userX: event.clientX,
    userY: event.clientY,
  }

  document.addEventListener('mousemove', mouseMoveHandler);
  document.addEventListener('mouseup', mouseUpHandler);
})