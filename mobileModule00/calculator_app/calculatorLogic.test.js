import { handlePress } from './calculatorLogic';

test('AC clears everything', () => {
  const result = handlePress("AC", "2+3", "5");
  expect(result).toEqual({ expression: "", result: "0" });
});

test('C removes last character', () => {
  const result = handlePress("C", "12+3", "0");
  expect(result).toEqual({ expression: "12+", result: "0" });
});

test('= evaluates expression', () => {
  const result = handlePress("=", "2+3", "0");
  expect(result).toEqual({ expression: "5", result: "5" });
});

test('= on empty expression shows 0', () => {
  const result = handlePress("=", "", "0");
  expect(result).toEqual({ expression: "", result: "0" });
});

test('= on division by zero shows Error', () => {
  const result = handlePress("=", "5/0", "0");
  expect(result).toEqual({ expression: "", result: "Error" });
});

test('= on invalid expression shows Error', () => {
  const result = handlePress("=", "3..2", "0");
  expect(result).toEqual({ expression: "", result: "Error" });
});

test('can continue calculation after equals', () => {
  const step1 = handlePress("=", "2+3", "0");
  const step2 = handlePress("+", step1.expression, step1.result);
  const step3 = handlePress("4", step2.expression, step2.result);
  const step4 = handlePress("=", step3.expression, step3.result);

  expect(step4).toEqual({ expression: "9", result: "9" });
});