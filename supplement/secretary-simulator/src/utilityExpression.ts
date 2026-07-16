import { type Expression, Parser } from "expr-eval-fork";

const parser = new Parser({
  allowMemberAccess: false,
  operators: {
    add: true,
    comparison: false,
    concatenate: false,
    conditional: false,
    divide: true,
    factorial: false,
    logical: false,
    multiply: true,
    power: false,
    remainder: false,
    subtract: true,
    sin: false,
    cos: false,
    tan: false,
    asin: false,
    acos: false,
    atan: false,
    sinh: false,
    cosh: false,
    tanh: false,
    asinh: false,
    acosh: false,
    atanh: false,
    sqrt: false,
    log: true,
    ln: false,
    lg: false,
    log10: false,
    abs: false,
    ceil: false,
    floor: false,
    round: false,
    trunc: false,
    exp: true,
    length: false,
    in: false,
    random: false,
    min: false,
    max: false,
    assignment: false,
    fndef: false,
    cbrt: false,
    expm1: false,
    log1p: false,
    sign: false,
    log2: false,
  },
});

export const compileUtilityExpression = (source: string): ((x: number) => number) => {
  if (!source.trim()) throw new Error("効用関数を入力してください。");
  if (source.length > 200) throw new Error("効用関数は200文字以内で入力してください。");

  let expression: Expression;
  try {
    expression = parser.parse(source);
  } catch {
    throw new Error("数式の形式または使用できる演算子を確認してください。");
  }

  const unknownSymbols = expression
    .symbols()
    .filter((symbol) => !["x", "exp", "log"].includes(symbol));
  if (unknownSymbols.length > 0) throw new Error(`使用できない名前です: ${unknownSymbols[0]}`);

  return (x) => {
    const value = expression.evaluate({ x });
    if (!Number.isFinite(value)) throw new Error(`u(${x}) が有限の数になりません。`);
    return value;
  };
};
