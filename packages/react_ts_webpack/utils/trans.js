function tokenizeCode(code) {
  const tokens = [];    // 结果数组
  for (let i = 0; i < code.length; i++) {
    // 从0开始，一个字符一个字符地读取
    let currentChar = code.charAt(i);

    if (currentChar === ';') {
      // 对于这种只有一个字符的语法单元，直接加到结果当中
      tokens.push({
        type: 'sep',
        value: ';',
      });
      // 该字符已经得到解析，不需要做后续判断，直接开始下一个
      continue;
    }

    if (currentChar === '(' || currentChar === ')') {
      // 与 ; 类似只是语法单元类型不同
      tokens.push({
        type: 'parens',
        value: currentChar,
      });
      continue;
    }

    if (currentChar === '}' || currentChar === '{') {
      // 与 ; 类似只是语法单元类型不同
      tokens.push({
        type: 'brace',
        value: currentChar,
      });
      continue;
    }

    if (currentChar === '>' || currentChar === '<') {
      // 与 ; 类似只是语法单元类型不同
      tokens.push({
        type: 'operator',
        value: currentChar,
      });
      continue;
    }

    if (currentChar === '"' || currentChar === '\'') {
      // 引号表示一个字符传的开始
      const token = {
        type: 'string',
        value: currentChar,       // 记录这个语法单元目前的内容
      };
      tokens.push(token);

      const closer = currentChar;
      let escaped = false;        // 表示下一个字符是不是被转译的

      // 进行嵌套循环遍历，寻找字符串结尾
      for (i++; i < code.length; i++) {
        currentChar = code.charAt(i);
        // 先将当前遍历到的字符无条件加到字符串的内容当中
        token.value += currentChar;
        if (escaped) {
          // 如果当前转译状态是true，就将改为false，然后就不特殊处理这个字符
          escaped = false;
        } else if (currentChar === '\\') {
          // 如果当前字符是 \ ，将转译状态设为true，下一个字符不会被特殊处理
          escaped = true;
        } else if (currentChar === closer) {
          break;
        }
      }
      continue;
    }

    if (/[0-9]/.test(currentChar)) {
      // 数字是以0到9的字符开始的
      const token = {
        type: 'number',
        value: currentChar,
      };
      tokens.push(token);

      for (i++; i < code.length; i++) {
        currentChar = code.charAt(i);
        if (/[0-9\.]/.test(currentChar)) {
          // 如果遍历到的字符还是数字的一部分（0到9或小数点）
          // 这里暂不考虑会出现多个小数点以及其他进制的情况
          token.value += currentChar;
        } else {
          // 遇到不是数字的字符就退出，需要把 i 往回调，
          // 因为当前的字符并不属于数字的一部分，需要做后续解析
          i--;
          break;
        }
      }
      continue;
    }

    if (/[a-zA-Z\$\_]/.test(currentChar)) {
      // 标识符是以字母、$、_开始的
      const token = {
        type: 'identifier',
        value: currentChar,
      };
      tokens.push(token);

      // 与数字同理
      for (i++; i < code.length; i++) {
        currentChar = code.charAt(i);
        if (/[a-zA-Z0-9\$\_]/.test(currentChar)) {
          token.value += currentChar;
        } else {
          i--;
          break;
        }
      }
      continue;
    }

    if (/\s/.test(currentChar)) {
      // 连续的空白字符组合到一起
      const token = {
        type: 'whitespace',
        value: currentChar,
      };
      tokens.push(token);

      // 与数字同理
      for (i++; i < code.length; i++) {
        currentChar = code.charAt(i);
        if (/\s]/.test(currentChar)) {
          token.value += currentChar;
        } else {
          i--;
          break;
        }
      }
      continue;
    }

    // 还可以有更多的判断来解析其他类型的语法单元

    // 遇到其他情况就抛出异常表示无法理解遇到的字符
    throw new Error('Unexpected ' + currentChar);
  }
  return tokens;
}

const tokens = tokenizeCode(`
if (1 > 0) {
  alert("if 1 > 0");
}
`);

console.log('tokens', tokens)

function parse(tokens) {
  let i = -1;     // 用于标识当前遍历位置
  let curToken;   // 用于记录当前符号

  // 读取下一个语句
  function nextStatement() {
    // 暂存当前的i，如果无法找到符合条件的情况会需要回到这里
    stash();

    // 读取下一个符号
    nextToken();

    if (curToken.type === 'identifier' && curToken.value === 'if') {
      // 解析 if 语句
      const statement = {
        type: 'IfStatement',
      };
      // if 后面必须紧跟着 (
      nextToken();
      if (curToken.type !== 'parens' || curToken.value !== '(') {
        throw new Error('Expected ( after if');
      }

      // 后续的一个表达式是 if 的判断条件
      statement.test = nextExpression();

      // 判断条件之后必须是 )
      nextToken();
      if (curToken.type !== 'parens' || curToken.value !== ')') {
        throw new Error('Expected ) after if test expression');
      }

      // 下一个语句是 if 成立时执行的语句
      statement.consequent = nextStatement();

      // 如果下一个符号是 else 就说明还存在 if 不成立时的逻辑
      if (curToken === 'identifier' && curToken.value === 'else') {
        statement.alternative = nextStatement();
      } else {
        statement.alternative = null;
      }
      commit();
      return statement;
    }

    if (curToken.type === 'brace' && curToken.value === '{') {
      // 以 { 开头表示是个代码块，我们暂不考虑JSON语法的存在
      const statement = {
        type: 'BlockStatement',
        body: [],
      };
      while (i < tokens.length) {
        // 检查下一个符号是不是 }
        stash();
        nextToken();
        if (curToken.type === 'brace' && curToken.value === '}') {
          // } 表示代码块的结尾
          commit();
          break;
        }
        // 还原到原来的位置，并将解析的下一个语句加到body
        rewind();
        statement.body.push(nextStatement());
      }
      // 代码块语句解析完毕，返回结果
      commit();
      return statement;
    }

    // 没有找到特别的语句标志，回到语句开头
    rewind();

    // 尝试解析单表达式语句
    const statement = {
      type: 'ExpressionStatement',
      expression: nextExpression(),
    };
    if (statement.expression) {
      nextToken();
      if (curToken.type !== 'EOF' && curToken.type !== 'sep') {
        throw new Error('Missing ; at end of expression');
      }
      return statement;
    }
  }

  // 读取下一个表达式
  function nextExpression() {
    nextToken();

    if (curToken.type === 'identifier') {
      const identifier = {
        type: 'Identifier',
        name: curToken.value,
      };
      stash();
      nextToken();
      if (curToken.type === 'parens' && curToken.value === '(') {
        // 如果一个标识符后面紧跟着 ( ，说明是个函数调用表达式
        const expr = {
          type: 'CallExpression',
          caller: identifier,
          arguments: [],
        };

        stash();
        nextToken();
        if (curToken.type === 'parens' && curToken.value === ')') {
          // 如果下一个符合直接就是 ) ，说明没有参数
          commit();
        } else {
          // 读取函数调用参数
          rewind();
          while (i < tokens.length) {
            // 将下一个表达式加到arguments当中
            expr.arguments.push(nextExpression());
            nextToken();
            // 遇到 ) 结束
            if (curToken.type === 'parens' && curToken.value === ')') {
              break;
            }
            // 参数间必须以 , 相间隔
            if (curToken.type !== 'comma' && curToken.value !== ',') {
              throw new Error('Expected , between arguments');
            }
          }
        }
        commit();
        return expr;
      }
      rewind();
      return identifier;
    }

    if (curToken.type === 'number' || curToken.type === 'string') {
      // 数字或字符串，说明此处是个常量表达式
      const literal = {
        type: 'Literal',
        value: eval(curToken.value),
      };
      // 但如果下一个符号是运算符，那么这就是个双元运算表达式
      // 此处暂不考虑多个运算衔接，或者有变量存在
      stash();
      nextToken();
      if (curToken.type === 'operator') {
        commit();
        return {
          type: 'BinaryExpression',
          left: literal,
          right: nextExpression(),
        };
      }
      rewind();
      return literal;
    }

    if (curToken.type !== 'EOF') {
      throw new Error('Unexpected token ' + curToken.value);
    }
  }

  // 往后移动读取指针，自动跳过空白
  function nextToken() {
    do {
      i++;
      curToken = tokens[i] || { type: 'EOF' };
    } while (curToken.type === 'whitespace');
  }

  // 位置暂存栈，用于支持很多时候需要返回到某个之前的位置
  const stashStack = [];

  function stash(cb) {
    // 暂存当前位置
    stashStack.push(i);
  }

  function rewind() {
    // 解析失败，回到上一个暂存的位置
    i = stashStack.pop();
    curToken = tokens[i];
  }

  function commit() {
    // 解析成功，不需要再返回
    stashStack.pop();
  }

  const ast = {
    type: 'Program',
    body: [],
  };

  // 逐条解析顶层语句
  while (i < tokens.length) {
    const statement = nextStatement();
    if (!statement) {
      break;
    }
    ast.body.push(statement);
  }
  return ast;
}

const ast = parse([
  { type: "whitespace", value: "\n" },
  { type: "identifier", value: "if" },
  { type: "whitespace", value: " " },
  { type: "parens", value: "(" },
  { type: "number", value: "1" },
  { type: "whitespace", value: " " },
  { type: "operator", value: ">" },
  { type: "whitespace", value: " " },
  { type: "number", value: "0" },
  { type: "parens", value: ")" },
  { type: "whitespace", value: " " },
  { type: "brace", value: "{" },
  { type: "whitespace", value: "\n " },
  { type: "identifier", value: "alert" },
  { type: "parens", value: "(" },
  { type: "string", value: "\"if 1 > 0\"" },
  { type: "parens", value: ")" },
  { type: "sep", value: ";" },
  { type: "whitespace", value: "\n" },
  { type: "brace", value: "}" },
  { type: "whitespace", value: "\n" },
]);