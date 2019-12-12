const getNumOrString = (value) => {
  if(parseFloat(value) == value){
    return parseFloat(value);
  }
  return value;
};

// 操作方法
const operatorObj = {
  '+': (leftValue, rightValue) => {
    return getNumOrString(rightValue) + getNumOrString(leftValue);
  },
  '-': (leftValue, rightValue) => {
    return getNumOrString(rightValue) - getNumOrString(leftValue);
  },
  '*': (leftValue, rightValue) => {
    return getNumOrString(rightValue) * getNumOrString(leftValue);
  },
  '/': (leftValue, rightValue) => {
    return getNumOrString(rightValue) / getNumOrString(leftValue);
  },
  '%': (leftValue, rightValue) => {
    return getNumOrString(rightValue) % getNumOrString(leftValue);
  },
  '==': (leftValue, rightValue) => {
    return rightValue == leftValue;
  },
  '!=': (leftValue, rightValue) => {
    return rightValue != leftValue;
  },
  '>': (leftValue, rightValue) => {
    return getNumOrString(rightValue) > getNumOrString(leftValue);
  },
  '<': (leftValue, rightValue) => {
    return getNumOrString(rightValue) < getNumOrString(leftValue);
  },
  '>=': (leftValue, rightValue) => {
    return getNumOrString(rightValue) >= getNumOrString(leftValue);
  },
  '<=': (leftValue, rightValue) => {
    return getNumOrString(rightValue) <= getNumOrString(leftValue);
  },
  '&&': (leftValue, rightValue) => {
    return getNumOrString(rightValue) && getNumOrString(leftValue);
  },
  '||': (leftValue, rightValue) => {
    return getNumOrString(rightValue) || getNumOrString(leftValue);
  },
};

// 判断是否是操作符
function isOperator(string) {
  const operatorList = [
    '&&', '||',
    '>', '<', '>=', '<=', '==', '!=',
    '+', '-',
    '*', '/', '%',
    ')',
    // 未使用的操作符
    '='
  ];

  return operatorList.indexOf(string) > -1;
}

// 获取运算符优先级
function getOperatorLevel(operator) {
  const operatorList = [
    ['&&', '||'], // 等级0
    ['>', '<', '>=', '<=', '==', '!='],// 等级1
    ['+', '-'],// 等级2
    ['*', '/', '%'],// 等级3
  ];
  let level = 0;

  for(let i = 0; i < operatorList.length; i++){
    const item = operatorList[i];
    if(item.indexOf(operator) > -1){
      level = i;
      break;
    }
  }

  return level;
}

// 使用操作符，入数据栈
function operatorToData(operatorStack, dataStack) {
  const operatorValue = operatorStack.pop();
  const rightValue = dataStack.pop();
  const leftValue = dataStack.pop();

  dataStack.push([operatorValue, leftValue, rightValue])
}

// 递归计算
function loopGetResult(dataStack = []) {
  const operatorValue = dataStack[0];
  if(!operatorObj[operatorValue]){
    return {
      type: 'error',
      msg: '表达式格式错误',
    };
  }
  let leftValue = dataStack[1];
  let rightValue = dataStack[2];

  // 如果是数组，继续递归
  if(Object.prototype.toString.call(leftValue) === '[object Array]'){
    leftValue = loopGetResult(leftValue);
  }

  // 如果是数组，继续递归
  if(Object.prototype.toString.call(rightValue) === '[object Array]'){
    rightValue = loopGetResult(rightValue);
  }

  let result = 'false';

  try {
    result = operatorObj[operatorValue](leftValue, rightValue)
  } catch (e) {
    alert('表达式格式错误');
    console.error(e);
  }

  return result;
}

// 主方法，计算表单式
const interpreter = (string = '', data = {}) => {
  const dataStack = []; // 数据栈
  const operatorStack = []; // 操作栈

  if(!string){return false;}

  const tokens = string.split(' ');

  // 出栈的结束符
  tokens.push(')');
  // 匹配出栈的结束符
  tokens.unshift('(');

  for(let i = tokens.length - 1; i >= 0; --i){
    const item = tokens[i];

    if(item === '('){
      // 如果是左括号，在遇到右括号之前，一直进行操作符出栈
      while (operatorStack[operatorStack.length - 1] !== ')'){
        operatorToData(operatorStack, dataStack);
      }
      // 抵消一个左括号
      operatorStack.pop();
    }else if(isOperator(item)){
      // 如果是操作符，进行操作符入栈
      if(item === '='){
        return {
          type: 'error',
          msg: '表达式格式错误',
        };
      }
      if(item !== ')'){
        // 判断运算符优先级
        const level1 = getOperatorLevel(item);
        const level2 = getOperatorLevel(operatorStack[operatorStack.length - 1]);

        // 如果有限级小于栈顶的操作符优先级，则先进行计算
        if(level1 < level2){
          operatorToData(operatorStack, dataStack);
        }
      }

      operatorStack.push(item);
    }else{
      // 如果是数据符，进行数据符入栈
      // 如果有此变量，就用变量，没有变量就使用字符串
      if(item in data){
        dataStack.push(data[item]);
      }else{
        dataStack.push(item);
      }
    }
  }

  return loopGetResult(dataStack[0]);
};

console.log(interpreter('1 > 2')); // false
console.log(interpreter('a >= 10', {a: 11})); // true
console.log(interpreter('a >= 10 && b <= 12', {a: 11, b: 12})); // true
