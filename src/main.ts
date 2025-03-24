import "./styles/web/web.scss";

// Mark as dynamic
document.documentElement.classList.add("js");

// Navigation
{
  let attached = false;
  const shouldBeAttached = () => window.scrollY >= 200;
  const attach = () => {
    if (attached) {
      return;
    }
    document.body.classList.add("document--scrolled");
    attached = true;
  };
  const detach = () => {
    if (!attached) {
      return;
    }
    document.body.classList.remove("document--scrolled");
    attached = false;
  };
  const refresh = () => {
    if (shouldBeAttached()) {
      attach();
    } else {
      detach();
    }
  };
  refresh();
  window.addEventListener("scroll", refresh);
}

// Technologies
{
  const $el = document.querySelector(".technologies")!;
  const $buttons = Array.from<HTMLButtonElement>(
    $el.querySelectorAll(".technologies-navbar button"),
  );
  const allTypes = $buttons
    .flatMap(($btn) => [$btn.dataset.type, $btn.dataset.secondaryType])
    .filter(Boolean)
    .filter((x, i, a) => a.indexOf(x) === i) as string[];
  const clearHover = (types: string[]) =>
    $el.classList.remove(
      ...types.map((x) => `${x}--hover`),
      ...types.map((x) => `${x}--secondary-hover`),
    );
  const setHover = (types: string[]) =>
    $el.classList.add(...types.map((x) => `${x}--hover`));
  const unselect = (types: string[]) =>
    $el.classList.remove(...types, ...types.map((x) => `${x}--secondary`));
  const select = (types: string[]) => $el.classList.add(...types);
  for (const $btn of $buttons) {
    const classNames = [
      $btn.dataset.type!,
      ...($btn.dataset.secondaryType
        ? [`${$btn.dataset.secondaryType}--secondary`]
        : []),
    ];
    $btn.addEventListener("mouseover", () => {
      clearHover(allTypes);
      setHover(classNames);
    });
    $btn.addEventListener("mouseleave", () => {
      clearHover(allTypes);
    });
    $btn.addEventListener("click", (e) => {
      e.preventDefault();
      clearHover(allTypes);
      unselect(allTypes);
      select(classNames);
    });
  }
}
