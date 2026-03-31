const sampleNumbers = [23, 45, 67, 89, 12, 90, 44];

const students = [
  { name: "Alice", age: 22, scores: [78, 85, 92] },
  { name: "Bob", age: 20, scores: [88, 90, 76] },
  { name: "Charlie", age: 21, scores: [95, 80, 85] }
];

const dom = {
  runAllBtn: document.getElementById("runAllBtn"),
  pageStatus: document.getElementById("pageStatus"),
  runTaskOneBtn: document.getElementById("runTaskOneBtn"),
  runTaskTwoBtn: document.getElementById("runTaskTwoBtn"),
  runTaskThreeBtn: document.getElementById("runTaskThreeBtn"),
  taskOneResult: document.getElementById("taskOneResult"),
  taskTwoResult: document.getElementById("taskTwoResult"),
  taskTwoMeta: document.getElementById("taskTwoMeta"),
  taskThreeResult: document.getElementById("taskThreeResult"),
  arrayOneInput: document.getElementById("arrayOneInput"),
  arrayTwoInput: document.getElementById("arrayTwoInput"),
  studentCards: document.getElementById("studentCards"),
  taskOneCard: document.getElementById("taskOneCard"),
  taskTwoCard: document.getElementById("taskTwoCard"),
  taskThreeCard: document.getElementById("taskThreeCard"),
  timerReadout: document.getElementById("timerReadout"),
  timerToggleBtn: document.getElementById("timerToggleBtn"),
  timerResetBtn: document.getElementById("timerResetBtn"),
  timerHint: document.getElementById("timerHint")
};

const timerState = {
  total: 60,
  left: 60,
  ticking: false,
  id: null
};

function stampCard(card) {
  card.classList.remove("active");
  void card.offsetWidth;
  card.classList.add("active");
}

function popOnce(element) {
  element.classList.remove("pop");
  void element.offsetWidth;
  element.classList.add("pop");
}

function findSecondLargest(numbers) {
  let biggest = -Infinity;
  let runnerUp = -Infinity;

  for (const value of numbers) {
    if (value > biggest) {
      runnerUp = biggest;
      biggest = value;
      continue;
    }
    if (value > runnerUp && value !== biggest) {
      runnerUp = value;
    }
  }

  return runnerUp === -Infinity ? null : runnerUp;
}

function runTaskOne() {
  const result = findSecondLargest(sampleNumbers);
  const message = result === null
    ? "No second largest value found."
    : `Second largest number: ${result}`;

  dom.taskOneResult.textContent = message;
  popOnce(dom.taskOneResult);
  stampCard(dom.taskOneCard);

  console.log("runTaskOne ->", result);
  return result;
}

function parseNumberList(rawValue) {
  return rawValue
    .split(",")
    .map(piece => piece.trim())
    .filter(piece => piece.length > 0)
    .map(Number)
    .filter(value => !Number.isNaN(value));
}

function getUniqueFromBoth(left, right) {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  const onlyLeft = [...leftSet].filter(value => !rightSet.has(value));
  const onlyRight = [...rightSet].filter(value => !leftSet.has(value));
  return [...onlyLeft, ...onlyRight];
}

function paintUniqueResult(values) {
  dom.taskTwoResult.innerHTML = "";

  if (!values.length) {
    const empty = document.createElement("span");
    empty.className = "empty-chip pop";
    empty.textContent = "No unique values";
    dom.taskTwoResult.appendChild(empty);
    return;
  }

  values.forEach(value => {
    const chip = document.createElement("span");
    chip.className = "chip pop";
    chip.textContent = value;
    dom.taskTwoResult.appendChild(chip);
  });
}

function runTaskTwo() {
  const first = parseNumberList(dom.arrayOneInput.value);
  const second = parseNumberList(dom.arrayTwoInput.value);
  const uniqueValues = getUniqueFromBoth(first, second);

  paintUniqueResult(uniqueValues);
  dom.taskTwoMeta.textContent = `Array A has ${first.length} values, Array B has ${second.length}, and ${uniqueValues.length} stayed unique.`;

  stampCard(dom.taskTwoCard);
  console.log("runTaskTwo -> unique values:", uniqueValues);
  return uniqueValues;
}

function getAverage(scores) {
  const total = scores.reduce((sum, score) => sum + score, 0);
  return total / scores.length;
}

function analyzeStudents(list) {
  const withAverage = list.map(student => ({
    ...student,
    average: getAverage(student.scores)
  }));

  const topStudent = withAverage.reduce((best, current) => current.average > best.average ? current : best);
  return { withAverage, topStudent };
}

function renderStudents(studentList, topName = "") {
  dom.studentCards.innerHTML = "";

  studentList.forEach(student => {
    const card = document.createElement("article");
    const averageText = typeof student.average === "number" ? student.average.toFixed(2) : "Waiting...";

    card.className = "student-card pop";
    if (topName && topName === student.name) {
      card.classList.add("topper");
    }

    card.innerHTML = `
      <h3 class="student-name">${student.name}</h3>
      <p class="student-meta">Age: ${student.age}</p>
      <p class="student-scores">Scores: ${student.scores.join(", ")}</p>
      <p class="student-average">Average: ${averageText}</p>
    `;

    dom.studentCards.appendChild(card);
  });
}

function runTaskThree() {
  const result = analyzeStudents(students);
  const topName = result.topStudent.name;
  const topAverage = result.topStudent.average.toFixed(2);

  renderStudents(result.withAverage, topName);
  dom.taskThreeResult.textContent = `Top Student: ${topName} with an average score of ${topAverage}.`;

  stampCard(dom.taskThreeCard);
  console.log("runTaskThree -> topper:", topName);
  return result;
}

function formatTime(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}

function paintTimer() {
  dom.timerReadout.textContent = formatTime(timerState.left);
  dom.timerReadout.classList.toggle("over", timerState.left === 0);
}

function stopTimer() {
  clearInterval(timerState.id);
  timerState.id = null;
  timerState.ticking = false;
  dom.timerToggleBtn.textContent = "Start";
}

function startTimer() {
  if (timerState.ticking) {
    stopTimer();
    dom.timerHint.textContent = "Timer paused.";
    return;
  }

  if (timerState.left === 0) {
    timerState.left = timerState.total;
    paintTimer();
  }

  timerState.ticking = true;
  dom.timerToggleBtn.textContent = "Pause";
  dom.timerHint.textContent = "Clock is running.";

  timerState.id = window.setInterval(() => {
    timerState.left -= 1;
    paintTimer();

    if (timerState.left > 0) return;

    stopTimer();
    dom.timerHint.textContent = "Time is up.";
  }, 1000);
}

function resetTimer() {
  stopTimer();
  timerState.left = timerState.total;
  dom.timerHint.textContent = "One quick focus round.";
  paintTimer();
}

function runEverything() {
  const secondLargest = runTaskOne();
  const uniqueValues = runTaskTwo();
  const report = runTaskThree();

  dom.pageStatus.textContent = `Done: second largest ${secondLargest}, unique count ${uniqueValues.length}, topper ${report.topStudent.name}.`;
}

dom.runTaskOneBtn.addEventListener("click", runTaskOne);
dom.runTaskTwoBtn.addEventListener("click", runTaskTwo);
dom.runTaskThreeBtn.addEventListener("click", runTaskThree);
dom.runAllBtn.addEventListener("click", runEverything);
dom.timerToggleBtn.addEventListener("click", startTimer);
dom.timerResetBtn.addEventListener("click", resetTimer);

renderStudents(students);
paintTimer();
