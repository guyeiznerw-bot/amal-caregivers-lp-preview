// Mock behaviour: every field is required. Only a fully valid form moves on to the thank-you page.
// Nothing is sent anywhere. In the real build the same rules must also be enforced by the form handler on the server.
document.querySelectorAll('form.lead').forEach(function (f) {
  f.querySelectorAll('.err').forEach(function (e) { e.setAttribute('role', 'alert'); });
  var rules = {
    name: function (v) { return v.trim().split(/\s+/).length >= 2 && v.trim().length >= 5; },
    tel: function (v) { return /^(\+972[- ]?|0)([23489]|5\d|7\d)[- ]?\d{3}[- ]?\d{4}$/.test(v.trim()); },
    city: function (v) { return v.trim().length >= 2; }
  };
  function check(el) {
    var ok = el.type === 'checkbox' ? el.checked : rules[el.name](el.value);
    var box = el.closest('.field, .check-wrap');
    box.classList.toggle('invalid', !ok);
    el.setAttribute('aria-invalid', String(!ok));
    return ok;
  }
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = [].filter.call(f.querySelectorAll('input'), function (el) { return !check(el); });
    if (bad.length) { bad[0].focus(); return; }
    window.location.href = 'thanks.html?v=' + encodeURIComponent(f.dataset.v || '');
  });
  f.querySelectorAll('input').forEach(function (el) {
    el.addEventListener(el.type === 'checkbox' ? 'change' : 'blur', function () {
      if (el.closest('.invalid') || el.value) check(el);
    });
  });
});
(function () {
  var bar = document.querySelector('.stick'); if (!bar || !('IntersectionObserver' in window)) return;
  var hero = document.querySelector('[data-hero]'), forms = document.querySelectorAll('form.lead');
  var heroIn = true, formIn = false;
  function upd() { bar.classList.toggle('on', !heroIn && !formIn); }
  new IntersectionObserver(function (es) { heroIn = es[0].isIntersecting; upd(); }).observe(hero);
  var fo = new IntersectionObserver(function (es) {
    es.forEach(function (e) { e.target._in = e.isIntersecting; });
    formIn = [].some.call(forms, function (x) { return x._in; }); upd();
  }, { threshold: .15 });
  forms.forEach(function (x) { fo.observe(x); });
})();
