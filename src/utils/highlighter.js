const ID_PICKER = "__konnector-playground__picker";
const sty = `
#${ID_PICKER} {
  position: fixed;
  height: 100vh;
  width: 100%;
  background: transparent;
  top: 0;
  left: 0;
  z-index: 500;
}

#${ID_PICKER} svg {
  width: 100%;
  height: 100%;
}

#${ID_PICKER} .path {
  font-family: monospace;
  position: absolute;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  color: white;
}

path:first-child {
  fill: rgba(0, 0, 255, 0.1);
  stroke: transparent;
}

path {
  fill: rgba(0,0,0,0.25);
  stroke: red;
}
`;

var targetElements = [];
var pickerRoot, styleNode;

var elementFromPoint = (function() {
  var lastX, lastY;

  return function(x, y) {
    if (x !== undefined) {
      lastX = x;
      lastY = y;
    } else if (lastX !== undefined) {
      x = lastX;
      y = lastY;
    } else {
      return null;
    }
    if (!pickerRoot) {
      return null;
    }
    pickerRoot.style.pointerEvents = "none";
    var elem = document.elementFromPoint(x, y);
    if (elem === document.body || elem === document.documentElement) {
      elem = null;
    }
    pickerRoot.style.pointerEvents = "";
    return elem;
  };
})();

var getElementBoundingClientRect = function(elem) {
  var rect =
    typeof elem.getBoundingClientRect === "function"
      ? elem.getBoundingClientRect()
      : { height: 0, left: 0, top: 0, width: 0 };

  // https://github.com/gorhill/uBlock/issues/1024
  // Try not returning an empty bounding rect.
  if (rect.width !== 0 && rect.height !== 0) {
    return rect;
  }

  var left = rect.left,
    right = rect.right,
    top = rect.top,
    bottom = rect.bottom;

  var children = elem.children,
    i = children.length;

  while (i--) {
    rect = getElementBoundingClientRect(children[i]);
    if (rect.width === 0 || rect.height === 0) {
      continue;
    }
    if (rect.left < left) {
      left = rect.left;
    }
    if (rect.right > right) {
      right = rect.right;
    }
    if (rect.top < top) {
      top = rect.top;
    }
    if (rect.bottom > bottom) {
      bottom = rect.bottom;
    }
  }

  return {
    height: bottom - top,
    left: left,
    top: top,
    width: right - left
  };
};

var svgRoot;
var svgOcean;
var svgIslands;

const highlightElements = function(elems, force) {
  // To make mouse move handler more efficient
  if (!force && elems.length === targetElements.length) {
    if (elems.length === 0 || elems[0] === targetElements[0]) {
      return;
    }
  }
  targetElements = elems;

  var ow = window.innerWidth;
  var oh = window.innerHeight;
  var ocean = ["M0 0", "h", ow, "v", oh, "h-", ow, "z"];
  var islands = [];

  var elem, rect, poly;
  for (var i = 0; i < elems.length; i++) {
    elem = elems[i];
    if (elem === pickerRoot) {
      continue;
    }
    rect = getElementBoundingClientRect(elem);

    // Ignore if it's not on the screen
    if (
      rect.left > ow ||
      rect.top > oh ||
      rect.left + rect.width < 0 ||
      rect.top + rect.height < 0
    ) {
      continue;
    }

    poly =
      "M" +
      rect.left +
      " " +
      rect.top +
      "h" +
      rect.width +
      "v" +
      rect.height +
      "h-" +
      rect.width +
      "z";
    ocean.push(poly);
    islands.push(poly);
  }
  svgOcean.setAttribute("d", ocean.join(""));
  svgIslands.setAttribute("d", islands.join("") || "M0 0");
};

const spaces = /\s+/;
const squashSpaces = str => str && str.replace(spaces, " ");

const getElementSlug = e => {
  return (
    e.tagName.toLowerCase() +
    (e.id
      ? "#" +
        squashSpaces(e.id)
          .split(" ")
          .join("#")
      : "") +
    (e.classList.length !== 0
      ? "." +
        squashSpaces(e.className)
          .split(" ")
          .join(".")
      : "")
  );
};

const getElementPath = e => {
  const ancestors = [];
  let cur = e;
  while (cur.parentNode) {
    ancestors.push(cur);
    cur = cur.parentNode;
  }
  ancestors.reverse();
  return ancestors.map(getElementSlug).join(" > ");
};

const updatePath = e => {
  const pathNode = pickerRoot.querySelector(".path");
  pathNode.innerText = getElementPath(e);
};

const updateHighlight = ev => {
  const e = elementFromPoint(ev.clientX, ev.clientY);
  if (!e || e.tagName === 'SVG') { return }
  if (!e.classList || e.classList.length == 0) { return }
  const cls = '.' + Array.from(e.classList).join('.')
  highlightElements(document.querySelectorAll(cls), true);
  updatePath(e);
};

const onClick = ev => {
  console.log('onClick')
  const e = elementFromPoint(ev.clientX, ev.clientY);
  const cls = '.' + Array.from(e.classList).join('.')
  console.log(cls)
  stopPicker()
}

const startPicker = () => {
  if (pickerRoot) {
    console.log('START PICKER CANCELLED')
    return;
  }
  console.log('START PICKER')
  pickerRoot = document.createElement("div");
  pickerRoot.innerHTML = `
    <svg><path></path><path></path></svg>
    <div class='path'></div>
  `;
  pickerRoot.id = ID_PICKER;
  styleNode = document.createElement("style");
  styleNode.innerText = sty;
  document.head.appendChild(styleNode);
  document.body.appendChild(pickerRoot);
  document.body.addEventListener("mousemove", updateHighlight);
  document.body.addEventListener('click', onClick)
  window.addEventListener("scroll", updateHighlight);
  svgRoot = document.querySelector(`#${ID_PICKER} svg`);
  pickerRoot.addEventListener("onClick", onClick)
  svgOcean = svgRoot.firstChild;
  svgIslands = svgRoot.lastChild;
};

const stopPicker = () => {
  document.body.removeEventListener("mousemove", updateHighlight);
  window.removeEventListener("mousemove", updateHighlight);
  document.body.removeChild(pickerRoot)
  document.head.removeChild(styleNode);
  pickerRoot = svgRoot = svgOcean = svgIslands = null;
};

module.exports = {
  startPicker: startPicker,
  stopPicker,
  highlightElements
}
