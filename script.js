class HanoiGame {
  constructor() {
    this.pegs = [];
    this.disksCount = 5;
    this.moves = 0;
    this.selectedPeg = null;
    this.isAutoSolving = false;

    this.init();
    this.bindEvents();
  }

  init(count = this.disksCount) {
    this.disksCount = count;
    this.pegs = [
      Array.from({ length: count }, (_, i) => count - i),
      [],
      []
    ];
    this.moves = 0;
    this.selectedPeg = null;
    this.render();
  }

  render() {
    document.getElementById("moves").innerText = this.moves;

    const pegsDom = document.querySelectorAll(".peg");
    pegsDom.forEach(peg => peg.innerHTML = "");

    this.pegs.forEach((peg, pegIndex) => {
      peg.forEach((size, i) => {
        const disk = document.createElement("div");
        disk.className = "disk";
        disk.style.width = (50 + size * 15) + "px";
        disk.style.bottom = (i * 22) + "px";
        disk.style.background = `hsl(${size * 40}, 70%, 60%)`;
        pegsDom[pegIndex].appendChild(disk);
      });
    });
  }

  handlePegClick(index) {
    if (this.isAutoSolving) return;

    if (this.selectedPeg === null) {
      if (this.pegs[index].length === 0) return;
      this.selectedPeg = index;
    } else {
      this.move(this.selectedPeg, index);
      this.selectedPeg = null;
    }
  }

  move(from, to) {
    const fromPeg = this.pegs[from];
    const toPeg = this.pegs[to];

    if (fromPeg.length === 0) return;

    const disk = fromPeg[fromPeg.length - 1];

    if (
      toPeg.length === 0 ||
      toPeg[toPeg.length - 1] > disk
    ) {
      fromPeg.pop();
      toPeg.push(disk);
      this.moves++;
      this.render();
      this.checkWin();
    } else {
      this.showWarning("不能把大盘放小盘上！");
    }
  }

  checkWin() {
    if (this.pegs[2].length === this.disksCount) {
      document.getElementById("message").innerText = "🎉 胜利！";
    }
  }

  showWarning(msg) {
    const el = document.getElementById("message");
    el.innerText = msg;
    el.classList.add("warning");

    setTimeout(() => {
      el.classList.remove("warning");
      el.innerText = "";
    }, 800);
  }

  autoSolve() {
    this.isAutoSolving = true;
    const steps = [];

    const hanoi = (n, from, to, aux) => {
      if (n === 1) {
        steps.push([from, to]);
        return;
      }
      hanoi(n - 1, from, aux, to);
      steps.push([from, to]);
      hanoi(n - 1, aux, to, from);
    };

    hanoi(this.disksCount, 0, 2, 1);

    const play = () => {
      if (steps.length === 0) {
        this.isAutoSolving = false;
        return;
      }

      const [from, to] = steps.shift();
      this.move(from, to);

      setTimeout(play, 400);
    };

    play();
  }

  bindEvents() {
    document.querySelectorAll(".peg").forEach(peg => {
      peg.addEventListener("click", (e) => {
        const index = Number(peg.dataset.index);
        this.handlePegClick(index);
      });
    });

    document.getElementById("resetBtn").onclick = () => {
      this.init(this.disksCount);
    };

    document.getElementById("autoBtn").onclick = () => {
      this.autoSolve();
    };

    const range = document.getElementById("diskRange");
    range.oninput = () => {
      const val = Number(range.value);
      document.getElementById("diskCount").innerText = val;
      this.init(val);
    };
  }
}

new HanoiGame();