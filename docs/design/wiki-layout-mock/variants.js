
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
        // a heading hides when everything under it, down to the next
        // heading of its level or above, hid — deepest level first, so a
        // surface heading (h2) sees its tool headings (h3) already decided
        var scopes = [wrap].concat(Array.prototype.slice.call(wrap.querySelectorAll("details.lrs-surface")));
        scopes.forEach(function (scope) {
          var kids = Array.prototype.slice.call(scope.children);
          [6, 5, 4, 3, 2].forEach(function (level) {
            kids.forEach(function (el, i) {
              if (el.tagName !== "H" + level) return;
              var any = false;
              for (var j = i + 1; j < kids.length; j++) {
                var m = /^H([1-6])$/.exec(kids[j].tagName);
                if (m && +m[1] <= level) break;
                if (!kids[j].hidden) { any = true; break; }
              }
              el.hidden = terms.length > 0 && !any;
            });
          });
        });
        // a surface group hides when every plan in it hid
        scopes.slice(1).forEach(function (sf) {
          var any = Array.prototype.some.call(sf.querySelectorAll("details.lrs-plan"), function (d) { return !d.hidden; });
          sf.hidden = terms.length > 0 && !any;
        });
        return n;
      }), wrap.firstChild);
    });
  }
  if (typeof document$ !== "undefined") document$.subscribe(scan); else document.addEventListener("DOMContentLoaded", scan);
})();
