import { links, films, awards, music, gallery } from "./content.js";

const el = (tag, attrs = {}, children = []) => {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else node.setAttribute(key, value);
  });
  children.forEach(child => node.append(child));
  return node;
};

const linkHeading = (text, href) => el("a", { href, class: "link-heading" }, [document.createTextNode(text)]);

function renderFilms() {
  const root = document.querySelector("#film-list");
  films.forEach(film => {
    const facts = el("ul", { class: "list meta" }, film.facts.map(fact => el("li", { text: fact })));
    root.append(el("article", { class: "card film-card" }, [
      el("img", { src: film.image, alt: `${film.title}, ${film.year}` }),
      el("div", { class: "prose" }, [el("h3", {}, [linkHeading(`«${film.title}» (${film.year})`, film.href)]), el("p", { text: film.description }), facts])
    ]));
  });
}

function renderAwards() {
  const root = document.querySelector("#award-list");
  awards.forEach(item => root.append(el("li", { text: item })));
}

function renderMusic() {
  document.querySelector("#album-list").replaceChildren(...music.albums.map(item => el("li", { text: item })));
  document.querySelector("#collection-list").replaceChildren(...music.collection.map(item => el("li", { text: item })));
  const fillNames = (selector, value) => {
    const node = document.querySelector(selector);
    if (node) node.textContent = value + ".";
  };
  fillNames("#composer-list", music.composers);
  fillNames("#poet-list", music.poets);
  document.querySelector("#song-list")?.replaceChildren(...music.songs.map(item => el("li", { text: item })));
  document.querySelector("#project-song-list")?.replaceChildren(...music.projects.map(item => el("li", { text: item })));
}

function renderGallery() {
  const root = document.querySelector("#gallery-list");
  gallery.forEach(([src, title, caption, fullImage]) => root.append(el("figure", { class: fullImage ? "gallery__figure--full" : "" }, [el("img", { src, alt: title, class: fullImage ? "gallery__image--full" : "" }), el("figcaption", {}, [el("strong", { text: title }), el("br"), document.createTextNode(caption)])])));
}

function setupReveal() {
  const tagline = document.querySelector(".tagline p");
  if (!tagline || !("IntersectionObserver" in window)) return tagline?.classList.add("is-visible");
  new IntersectionObserver(([entry], observer) => {
    if (entry.isIntersecting) { tagline.classList.add("is-visible"); observer.disconnect(); }
  }, { threshold: .5 }).observe(tagline);
}

function setupReveals() {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const items = [...document.querySelectorAll(".section h2, .card, .gallery figure, .tagline p")];
  if (!items.length) return;
  document.documentElement.classList.add("reveal-ready");
  items.forEach(item => item.classList.add("reveal"));
  const observer = new IntersectionObserver((entries, obs) => {
    entries.filter(entry => entry.isIntersecting).forEach(entry => {
      const node = entry.target;
      const siblings = node.parentElement
        ? [...node.parentElement.children].filter(child => child.classList.contains("reveal"))
        : [];
      const order = Math.max(0, siblings.indexOf(node));
      node.style.setProperty("--reveal-delay", Math.min(order * 70, 280) + "ms");
      node.classList.add("is-visible");
      node.addEventListener("transitionend", () => node.style.setProperty("--reveal-delay", "0ms"), { once: true });
      obs.unobserve(node);
    });
  }, { threshold: .12, rootMargin: "0px 0px -8% 0px" });
  items.forEach(item => observer.observe(item));
}

renderFilms(); renderAwards(); renderMusic(); renderGallery(); setupReveal(); setupReveals();

