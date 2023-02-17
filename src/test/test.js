let calculatorValue = "1 + 2 * 3 - 4 * 2 / 2 + 1"
let strArr = calculatorValue.split(" ").filter((n) => n !== "");
let operatorArr = strArr.filter((n) =>
  ["*", "/", "-", "+", "%"].includes(n)
);
let numberArray = strArr.filter((n) => !operatorArr.includes(n));

// console.log(operatorArr);
// console.log(numberArray);

while (operatorArr.length) {
  let tmp = 0;
  let currentIndex = 0;
  if (operatorArr.includes("*") || operatorArr.includes("/")) {
    currentIndex = operatorArr.indexOf("*") > -1 ? operatorArr.indexOf("*") : operatorArr.indexOf("/");
    tmp = operatorArr.includes("*") ? Number(numberArray[currentIndex]) * Number(numberArray[currentIndex + 1]) : Number(numberArray[currentIndex]) / Number(numberArray[currentIndex + 1]);
  } else {
    if (operatorArr[currentIndex] === '+') {
      tmp = Number(numberArray[0]) + Number(numberArray[1]);
    } else {
      tmp = Number(numberArray[0]) - Number(numberArray[1]);
    }
  }
  numberArray[currentIndex] = tmp;
  numberArray.splice(currentIndex + 1, 1);
  operatorArr.splice(currentIndex, 1);
}

console.log(numberArray[0]);