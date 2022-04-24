import { useEffect } from 'react';

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') {
    return;
  }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".noteMain{background-color:#ffdead;font-size:20px;text-align:center}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxVQUNFLHdCQUE2QixDQUM3QixjQUFlLENBQ2YsaUJBQ0YiLCJmaWxlIjoiaW5kZXguY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLm5vdGVNYWluIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiBuYXZham93aGl0ZTtcclxuICBmb250LXNpemU6IDIwcHg7XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG59Il19 */";
styleInject(css_248z);

function Note() {
  // TODO
  useEffect(function () {
    console.log('Note');
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "noteMain"
  }, "Note");
}

module.exports = Note;
