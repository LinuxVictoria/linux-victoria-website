// Spacedash touches on Decap's screens. Decap's GitHub backend labels its button
// "Login with GitHub", but sign-in here is Authentik (see server.js), so relabel it
// and add sign-up and password reset links underneath.
(function () {
  var AUTH = "https://auth.talkingsites.org/if/flow/";
  var LINKS = [
    { text: "Create account", href: AUTH + "ew-self-enrol/" },
    { text: "Forgot password", href: AUTH + "default-recovery-flow/" },
  ];

  function extras() {
    var box = document.createElement("div");
    box.style.cssText = "display:flex;justify-content:center;gap:18px;margin:10px 0 0;font-size:14px";
    LINKS.forEach(function (l) {
      var a = document.createElement("a");
      a.href = l.href;
      a.target = "_blank";
      a.rel = "noreferrer";
      a.textContent = l.text;
      a.style.cssText = "color:#3a69c7;font-weight:500";
      box.appendChild(a);
    });
    return box;
  }

  // Decap's own "Go back to site" link sits well below; pull it up next to ours
  // Decap's "Go back to site" (an arrow icon plus text) has margin-top 50px and 10px
  // padding; pull it up so it sits just under our links
  function tightenBackLink() {
    document.querySelectorAll("a").forEach(function (a) {
      if (a.dataset.spacedash || a.textContent.trim() !== "Go back to site") return;
      a.dataset.spacedash = "1";
      a.style.marginTop = "4px";
      a.style.paddingTop = "4px";
    });
  }

  function relabel() {
    tightenBackLink();
    document.querySelectorAll("button").forEach(function (button) {
      if (button.dataset.spacedash || button.textContent.trim() !== "Login with GitHub") return;
      button.dataset.spacedash = "1";
      button.querySelectorAll("svg").forEach(function (icon) { icon.remove(); });
      button.textContent = "Log In";
      // bigger than Decap's default, but keeps Decap's own colours
      button.style.fontSize = "18px";
      button.style.padding = "8px 42px";
      button.style.height = "auto";
      button.insertAdjacentElement("afterend", extras());
    });
  }
  new MutationObserver(relabel).observe(document.documentElement, { childList: true, subtree: true });
  relabel();
})();
