(() => {
  const figure = document.querySelector("[data-cloud-reveal]");
  const button = document.querySelector(".replay-reveal");
  const navigation = document.querySelector("[data-home-navigation]");
  const desktopNavigation = navigation?.querySelector(".site-nav--desktop");
  const banks = figure ? [...figure.querySelectorAll(".cloud-bank")] : [];
  const navigationRevealDelay = 1_300;
  let navigationTimer;
  let fallbackTimer;

  const revealNavigation = () => {
    window.clearTimeout(navigationTimer);
    navigationTimer = undefined;
    navigation?.classList.add("is-visible");
    if (desktopNavigation) desktopNavigation.inert = false;
  };

  const armNavigationReveal = () => {
    window.clearTimeout(navigationTimer);
    navigationTimer = window.setTimeout(revealNavigation, navigationRevealDelay);
  };

  if (!figure || !button || banks.length !== 2) {
    revealNavigation();
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const completedBanks = new Set();

  const hideButton = () => {
    button.classList.remove("is-visible");
    button.disabled = true;
    button.hidden = true;
  };

  const showButton = () => {
    window.clearTimeout(fallbackTimer);
    figure.dataset.cloudReveal = "revealed";
    revealNavigation();
    button.hidden = false;
    button.disabled = false;
    window.requestAnimationFrame(() => button.classList.add("is-visible"));
  };

  const armFallback = () => {
    window.clearTimeout(fallbackTimer);
    fallbackTimer = window.setTimeout(showButton, 5_600);
  };

  if (reducedMotion.matches) {
    figure.dataset.cloudReveal = "reduced";
    revealNavigation();
    hideButton();
    return;
  }

  banks.forEach((bank) => {
    bank.addEventListener("animationend", (event) => {
      if (!event.animationName.startsWith("cloud-drift-")) return;
      completedBanks.add(bank);
      if (completedBanks.size === banks.length) showButton();
    });
  });

  button.addEventListener("click", () => {
    hideButton();
    completedBanks.clear();
    window.clearTimeout(fallbackTimer);
    figure.dataset.cloudReveal = "reset";

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        figure.dataset.cloudReveal = "replaying";
        armFallback();
      });
    });
  });

  armNavigationReveal();
  armFallback();
})();
