/**
 * CirculAI φ — snippet A/B client (localStorage + dataLayer / ga legacy).
 * Expérience : circulai_phi_v1. Variantes : control | phi.
 * QA : ?ab=control | ?ab=phi
 * window.__circulai_phi = { variant } pour le CTA et les hooks GTM.
 */
(function () {
  "use strict";

  var EXPERIMENT_ID = "circulai_phi_v1";
  var STORAGE_KEY = "circulai_phi_variant";

  function pickFromQuery() {
    var m = /[?&]ab=(control|phi)(?:&|$)/i.exec(window.location.search);
    return m ? m[1].toLowerCase() : null;
  }

  function pickRandom() {
    return Math.random() < 0.5 ? "control" : "phi";
  }

  function readStored() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function writeStored(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
      return true;
    } catch (e) {
      return false;
    }
  }

  function resolveVariant() {
    var prev = readStored();
    var hadValid = prev === "control" || prev === "phi";

    var q = pickFromQuery();
    if (q) {
      var wroteQ = writeStored(q);
      return {
        variant: q,
        isNewAssignment: wroteQ && !hadValid,
        assignment_source: "query",
      };
    }

    if (hadValid) {
      return {
        variant: prev,
        isNewAssignment: false,
        assignment_source: "storage",
      };
    }

    var v = pickRandom();
    var wroteR = writeStored(v);
    return {
      variant: v,
      isNewAssignment: wroteR,
      assignment_source: "random",
    };
  }

  function pushExperimentAssign(payload) {
    if (typeof window.dataLayer !== "undefined" && window.dataLayer && window.dataLayer.push) {
      window.dataLayer.push(payload);
    }
    if (typeof window.ga === "function") {
      try {
        window.ga("send", "event", EXPERIMENT_ID, "experiment_assign", String(payload.variant || ""));
      } catch (e) {}
    }
  }

  function pushDataLayer(obj) {
    if (typeof window.dataLayer !== "undefined" && window.dataLayer && window.dataLayer.push) {
      window.dataLayer.push(Object.assign({ event: "circulai_ab" }, obj));
    }
  }

  function emit(name, detail) {
    try {
      window.dispatchEvent(new CustomEvent(name, { detail: detail }));
    } catch (e) {}
  }

  var meta = resolveVariant();
  var variant = meta.variant;

  window.__circulai_phi = { variant: variant };

  document.documentElement.setAttribute("data-ab-variant", variant);
  document.documentElement.setAttribute("data-experiment-phi", variant);

  function applyBodyVariantClasses() {
    var b = document.body;
    if (!b) return;
    b.classList.remove("phi-variant", "control-variant");
    b.classList.add(variant === "phi" ? "phi-variant" : "control-variant");
  }

  if (document.body) {
    applyBodyVariantClasses();
  } else {
    document.addEventListener("DOMContentLoaded", applyBodyVariantClasses, { once: true });
  }

  if (meta.isNewAssignment) {
    pushExperimentAssign({
      event: "experiment_assign",
      experiment: EXPERIMENT_ID,
      variant: variant,
      assignment_source: meta.assignment_source,
      storage_key: STORAGE_KEY,
    });
    emit("circulai_ab", {
      variant: variant,
      action: "experiment_assign",
      experiment: EXPERIMENT_ID,
      assignment_source: meta.assignment_source,
    });
  }

  var EXP_KEY = "circulai_phi_exposed";

  function expose(extra) {
    try {
      if (window.sessionStorage.getItem(EXP_KEY)) return;
      window.sessionStorage.setItem(EXP_KEY, "1");
    } catch (e) {}
    var payload = Object.assign({ variant: variant, action: "expose" }, extra || {});
    pushDataLayer(payload);
    emit("circulai_ab", payload);
  }

  function track(action, extra) {
    var payload = Object.assign({ variant: variant, action: action }, extra || {});
    pushDataLayer(payload);
    emit("circulai_ab", payload);
  }

  function conversion(extra) {
    track("conversion", extra);
  }

  window.circulaiAB = {
    getVariant: function () {
      return variant;
    },
    expose: expose,
    track: track,
    conversion: conversion,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      expose();
    });
  } else {
    expose();
  }
})();
