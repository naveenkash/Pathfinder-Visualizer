let length = 40,
  start_btn = document.querySelector(".start_btn"),
  clear_path = document.querySelector(".clear"),
  clear_board = document.querySelector(".clear_board"),
  wrapper = document.querySelector(".box_wrapper"),
  delay = 0.01,
  algoSelect = document.querySelector(".algo-info"),
  dropDownUl = document.querySelector(".dropdown ul"),
  dropDown = document.querySelector(".dropdown"),
  algoLabel = document.querySelector(".algo-info label"),
  dropDownItems = document.querySelectorAll(".dropdown ul li"),
  draggedStart = null,
  currentStart = null,
  draggedEnd = null,
  currentEnd = null,
  whichNodeToMove = null,
  algorithms = {
    bfs: function () {
      const breadth = new BreadthFirstSearch();
      breadth.start(start);
      currentAlgo["algo"] = breadth;
    },
    djs: function () {
      const dijk = new Dijkstra();
      dijk.start(start);
      currentAlgo["algo"] = dijk;
    },
    dfs: function () {
      const depth = new DepthFirstSearch();
      depth.start(start);
      currentAlgo["algo"] = depth;
    },
    astar: function () {
      const as = new AStar();
      as.start(start);
      currentAlgo["algo"] = as;
    },
  },
  selected = false,
  grid = [],
  whichAlgo = "",
  currentAlgo = {},
  path = [],
  started = false;
function createBoxes() {
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      let box = document.createElement("div"),
        atr = document.createAttribute("class");
      atr.value = "box";
      box.setAttributeNode(atr);
      wrapper.appendChild(box);
      grid.push({ row: i + 1, col: j + 1 });
    }
  }
}
createBoxes();

let boxes = document.querySelectorAll(".box"),
  start = null,
  end = null,
  endIdx = 0,
  startIdx = 0,
  mouseDown = false;

for (let i = 0; i < boxes.length; i++) {
  let box = boxes[i];
  box.setAttribute("data-idx", i);
  if (i == 285) {
    startIdx = i;
    box.classList.add("start");
    start = box;
  }
  if (i == 1310) {
    endIdx = i;
    box.classList.add("end");
    end = box;
  }
}

function getIndex(node) {
  return parseInt(node.getAttribute("data-idx"));
}

let openDropDown = false;
document.addEventListener("click", function (event) {
  if (!dropDown.contains(event.target) && openDropDown) {
    openDropDown = !openDropDown;
    dropDownUl.style.display = "none";
    document.querySelector(".algo-info span").innerHTML =
      '<i class="fas fa-chevron-down"></i>';
  }
});

algoSelect.addEventListener("click", function (e) {
  e.stopPropagation();
  openDropDown = !openDropDown;
  if (openDropDown) {
    dropDownUl.style.display = "block";
    document.querySelector(".algo-info span").innerHTML =
      '<i class="fas fa-chevron-up"></i>';
  } else {
    dropDownUl.style.display = "none";
    document.querySelector(".algo-info span").innerHTML =
      '<i class="fas fa-chevron-down"></i>';
  }
});

for (let j = 0; j < dropDownItems.length; j++) {
  const dropDownItem = dropDownItems[j];
  dropDownItem.addEventListener("click", function () {
    algoLabel.innerText = dropDownItem.innerText;
    selected = true;
    whichAlgo = dropDownItem.id;
  });
}

wrapper.addEventListener("mousedown", function (event) {
  event.preventDefault();
  event.stopPropagation();
  if (!started) {
    dragNodes();
  }
});

document.addEventListener("mousemove", function (event) {
  if (!started) {
    setCurrentBoxIfMouseOutOfContainer();
  }
});

wrapper.addEventListener("mouseover", function (event) {
  event.preventDefault();
  if (!started) {
    moveNodesOnDrag();
  }
});

wrapper.addEventListener("mouseup", function (event) {
  event.preventDefault();
  event.stopPropagation();
  if (!started) {
    setNodeWhenMouseLifted();
  }
});

function setCurrentBoxIfMouseOutOfContainer() {
  if (mouseDown && event.target.contains(wrapper)) {
    mouseDown = false;
    // set current node to start if mouse move of wrapper while being pressed
    if (whichNodeToMove == "start") {
      let startNode = document.querySelector(".start");
      draggedStart = startNode;
      start = startNode;
      let idx = parseInt(startNode.getAttribute("data-idx"));
      startIdx = idx;
    } else if (whichNodeToMove == "end") {
      let endNode = document.querySelector(".end");
      draggedEnd = endNode;
      end = endNode;
      let idx2 = parseInt(endNode.getAttribute("data-idx"));
      endIdx = idx2;
    }
    whichNodeToMove = "";
  }
}

function dragNodes() {
  mouseDown = true;
  if (event.target.classList.contains("start")) {
    draggedStart = event.target;
    whichNodeToMove = "start";
  }
  if (event.target.classList.contains("end")) {
    draggedEnd = event.target;
    whichNodeToMove = "end";
  }
}

function setNodeWhenMouseLifted() {
  if (mouseDown) {
    let node = event.target;
    if (whichNodeToMove == "start") {
      if (!event.target.classList.contains("end")) {
        node.classList.add("start");
      }
      draggedStart = node;
      start = node;
      let idx = parseInt(start.getAttribute("data-idx"));
      startIdx = idx;
    }

    if (whichNodeToMove == "end") {
      if (!event.target.classList.contains("start")) {
        node.classList.add("end");
      }
      draggedEnd = node;
      end = node;
      let idx = parseInt(end.getAttribute("data-idx"));
      endIdx = idx;
    }
  }
  whichNodeToMove = "";
  mouseDown = false;
}

function moveNodesOnDrag() {
  if (mouseDown) {
    if (whichNodeToMove == "start") {
      if (
        !event.target.classList.contains("end") &&
        !event.target.classList.contains("start") &&
        !event.target.classList.contains("wall") &&
        event.target != currentStart &&
        event.target != wrapper
      ) {
        if (currentStart) {
          currentStart.classList.remove("start");
        }
        event.target.classList.add("start");
        currentStart = event.target; // the current element we are on
        draggedStart.classList.remove("start");
      }
    } else if (whichNodeToMove == "end") {
      if (
        !event.target.classList.contains("start") &&
        !event.target.classList.contains("end") &&
        !event.target.classList.contains("wall") &&
        event.target != currentEnd &&
        event.target != wrapper
      ) {
        if (currentEnd) {
          currentEnd.classList.remove("end");
        }
        event.target.classList.add("end");
        currentEnd = event.target; // the current element we are on
        draggedEnd.classList.remove("end");
      }
    } else {
      if (
        !event.target.classList.contains("start") &&
        !event.target.classList.contains("end") &&
        !event.target.classList.contains("wall") &&
        !event.target.contains(wrapper)
      ) {
        event.target.classList.add("wall");
      } else if (event.target.classList.contains("wall")) {
        event.target.classList.remove("wall");
      }
    }
  }
}

start_btn.addEventListener("click", () => {
  if (!selected) {
    algoLabel.innerText = "Pick An Algorithm";
    return;
  }
  if (started) return;
  if (currentAlgo.algo) reset();
  algorithms[whichAlgo](start);
  started = true;
});

clear_path.addEventListener("click", () => {
  if (!started) {
    if (currentAlgo.algo) reset();
  }
});
clear_board.addEventListener("click", () => {
  if (!started) {
    if (currentAlgo.algo) reset();
    let walls = document.querySelectorAll(".box_wrapper .wall");
    for (let i = 0; i < walls.length; i++) {
      const wall = walls[i];
      wall.classList.remove("wall");
    }
  }
});
function reset() {
  let visited_nodes = document.querySelectorAll(".box_wrapper .visited");
  let shortest_path = document.querySelectorAll(".box_wrapper .shortest_path");
  for (let i = 0; i < visited_nodes.length; i++) {
    let box = visited_nodes[i];
    removeStyle(box);
  }
  for (let i = 0; i < shortest_path.length; i++) {
    const box = shortest_path[i];
    box.innerHTML = "";
  }
  currentAlgo.algo.default();
  start.innerHTML = "";
  end.innerHTML = "";
  path = [];
  started = false;
}

function removeStyle(box) {
  box.classList.remove("visited");
  box.classList.remove("shortest_path");
  box.classList.remove("animate");
}

function drawShortestPath(prev) {
  // print path when node found
  for (let i = endIdx; i < prev.length; i = prev[i]) {
    if (i == startIdx) {
      path.push(i);
      break;
    }
    path.push(i); // path we took get to end node and reverse it to print
  }
  path.reverse();
  // to set arrow for start node
  // right node
  if (startIdx == path[1] - 1) {
    start.innerHTML = '<i class="fas fa-chevron-right"></i>';
  }
  // left node
  if (startIdx == path[1] + 1) {
    start.innerHTML = '<i class="fas fa-chevron-left"></i>';
  }
  // top node
  if (startIdx - length == path[1]) {
    start.innerHTML = '<i class="fas fa-chevron-up"></i>';
  }
  // bottom node
  if (startIdx + length == path[1]) {
    start.innerHTML = '<i class="fas fa-chevron-down"></i>';
  }
  loopPath();
  started = false;
}

function loopPath() {
  if (path.length > 0) {
    setTimeout(() => {
      const idx = path[0];

      // right node
      if (idx == path[1] - 1 && idx != startIdx) {
        boxes[idx].innerHTML = '<i class="fas fa-chevron-right"></i>';
        boxes[idx].classList.add("shortest_path");
      }

      // left node
      if (idx == path[1] + 1 && idx != startIdx) {
        boxes[idx].innerHTML = '<i class="fas fa-chevron-left"></i>';
        boxes[idx].classList.add("shortest_path");
      }

      // top node
      if (idx - length == path[1] && idx != startIdx) {
        boxes[idx].innerHTML = '<i class="fas fa-chevron-up"></i>';
        boxes[idx].classList.add("shortest_path");
      }

      // bottom node
      if (idx + length == path[1] && idx != startIdx) {
        boxes[idx].innerHTML = '<i class="fas fa-chevron-down"></i>';
        boxes[idx].classList.add("shortest_path");
      }
      //set end node inner html to last node inner html
      if (path.length == 2) {
        boxes[path[1]].innerHTML = boxes[path[0]].innerHTML;
        path.shift();
      }
      path.shift();
      loopPath();
    }, 50);
  }
}
