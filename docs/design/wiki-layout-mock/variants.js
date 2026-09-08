
/* ---- layout variations (mockup): the filter box also drives a list
   of details cards (.lrs-plans), and the page-wide filter folds a
   release heading whose cards all hid ---- */
(function () {
  var MIN = 6;
  function cards(wrap) { return Array.prototype.slice.call(wrap.querySelectorAll("details.lrs-plan")); }
  function apply(list, terms) {
    var shown = 0;
    list.forEach(function (d) {
      var hit = terms.every(function (t) { return (d.textContent || "").toLowerCase().indexOf(t) >= 0; });
      d.hidden = !hit;
      if (hit) shown++;
    });
    return shown;
  }
  function box(total, fn) {
    var b = document.createElement("div"); b.className = "lrs-filter";
    var i = document.createElement("input"); i.type = "search"; i.placeholder = "Filter " + total + " plans…"; i.autocomplete = "off"; i.spellcheck = false;
    var c = document.createElement("span"); c.className = "lrs-filter__count";
    i.addEventListener("input", function () {
      var terms = i.value.toLowerCase().split(/\s+/).filter(Boolean);
      var n = fn(terms); c.textContent = terms.length ? n + " of " + total : "";
    });
    b.appendChild(i); b.appendChild(c); return b;
  }
  function scan() {
    document.querySelectorAll(".lrs-plans").forEach(function (wrap) {
      if (wrap.dataset.lrsFilter) return;
      var list = cards(wrap); if (list.length < MIN) return;
      wrap.dataset.lrsFilter = "1";
      wrap.insertBefore(box(list.length, function (terms) {
        var n = apply(list, terms);
        var head = null, group = [];
        function flush() { if (!head) return; var any = group.some(function (el) { return !el.hidden; }); head.hidden = terms.length > 0 && !any; }
        Array.prototype.forEach.call(wrap.children, function (el) {
          if (/^H[1-6]$/.test(el.tagName)) { flush(); head = el; group = []; } else if (head && el.tagName === "DETAILS") group.push(el);
        });
        flush(); return n;
      }), wrap.firstChild);
    });
  }
  if (typeof document$ !== "undefined") document$.subscribe(scan); else document.addEventListener("DOMContentLoaded", scan);
})();
