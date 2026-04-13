import { evaluate } from 'mathjs';

export function handlePress(value, expression, result) {
  if (value === "AC") {
    return { expression: "", result: "0" };
  }
  else if (value === "C") {
    return { expression: expression.slice(0, -1), result };
  }
  else if (value === "=") {
    if (expression === "") {
      return { expression, result: "0" };
    }
    try {
      const answer = evaluate(expression);
      if (Number.isFinite(answer)) {
        const answerStr = String(answer);
        return { expression: answerStr, result: answerStr };
      }
      else {
        return { expression: "", result: "Error" };
      }
    }
    catch {
      return { expression: "", result: "Error" };
    }
  }
  else {
    return { expression: expression + value, result };
  }
}
