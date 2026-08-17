(() => {
  const animatedImages = Array.from(
    document.querySelectorAll("img.gif[data-animated-src]"),
  );

  const startAnimation = (image) => {
    if (image.dataset.animationStarted === "true") return;
    image.dataset.animationStarted = "true";
    image.src = image.dataset.animatedSrc;
  };

  if ("IntersectionObserver" in window) {
    const animationObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          startAnimation(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "260px 0px", threshold: 0.01 },
    );
    animatedImages.forEach((image) => animationObserver.observe(image));
  } else {
    animatedImages.forEach(startAnimation);
  }

  const endpoint =
    "https://script.google.com/macros/s/AKfycbwvamnywdnl3Q4N_OL5RPp6iYN8QujIl2kWGISLOMKth9_mKupltNyxaffvDkhEzqw/exec";
  const form = document.querySelector(".therapy-form");
  if (!form) return;

  document.querySelectorAll(".messenger-choice").forEach((group) => {
    group.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      group
        .querySelectorAll("button")
        .forEach((item) => item.classList.toggle("selected", item === button));
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = form.querySelector('[type="submit"]');
    const status = form.querySelector(".form-status");
    const data = new FormData(form);
    data.set(
      "meetingFormat",
      form.querySelector(".format-choice .selected")?.textContent.trim() ||
        "Онлайн",
    );
    data.set(
      "messenger",
      form
        .querySelector(".messenger-choice:not(.format-choice) .selected")
        ?.textContent.trim() || "Telegram",
    );
    data.set("consent", "yes");
    data.set("source", location.href);
    submit.disabled = true;
    status.className = "form-status";
    status.textContent = "Отправляю…";
    try {
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: new URLSearchParams(data).toString(),
      });
      form.reset();
      status.className = "form-status form-success";
      status.textContent = "Готово! Я получила заявку и скоро свяжусь с вами.";
    } catch (_) {
      status.className = "form-status form-error";
      status.innerHTML =
        'Не получилось отправить. Напишите мне <a href="https://t.me/lizasever">в Telegram</a>.';
    } finally {
      submit.disabled = false;
    }
  });
})();
