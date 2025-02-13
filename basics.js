function sleep(time) {
   return new Promise((resolve) => setTimeout(resolve, time));
}

function randint(minimum, maximum) {
   return Math.floor(Math.random() * (maximum - minimum)) + minimum;
}

function vec_add(a, b) {
   return [a[0] + b[0], a[1] + b[1]];
}

function vec_sub(a, b) {
   return [a[0] - b[0], a[1] - b[1]];
}

function vec_dot(a, b) {
   return [a[0] * b[0] + a[1] * b[1]];
}

function vec_mul(v, s) {
   return [v[0] * s, v[1] * s];
}

function vec_div(v, s) {
   return [v[0] / s, v[1] / s];
}

function vec_size(v) {
   return Math.sqrt(vec_size_squared(v));
}

function vec_size_squared(v) {
   return v[0] ** 2 + v[1] ** 2;
}

function isPointLeftOrRight(px, py, x1, y1, x2, y2) {
   const cross = (x2 - x1) * (py - y1) - (y2 - y1) * (px - x1);
   if (cross > 0) {
      return 1;
   } else if (cross < 0) {
      return -1;
   } else {
      return 0;
   }
}

let mousex, mousey;

function handleMouseMove(event) {
   var eventDoc, doc, body;
   if (event.pageX == null && event.clientX != null) {
      eventDoc = (event.target && event.target.ownerDocument) || document;
      doc = eventDoc.documentElement;
      body = eventDoc.body;
      event.pageX =
         event.clientX +
         ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
         ((doc && doc.clientLeft) || (body && body.clientLeft) || 0);
      event.pageY =
         event.clientY +
         ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
         ((doc && doc.clientTop) || (body && body.clientTop) || 0);
   }
   mousex = event.pageX;
   mousey = event.pageY;
}

document.onmousemove = handleMouseMove;

function arraysEqual(a, b) {
   if (a === b) return true;
   if (a == null || b == null) return false;
   if (a.length !== b.length) return false;
   for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
   }
   return true;
}
