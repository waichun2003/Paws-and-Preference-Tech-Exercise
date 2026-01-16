const max_cats = 10;
const cats = [];
const likedCats = [];
const dislikedCats = [];
let currentIndex = 0;

const container = document.getElementById("card-container");
const summary = document.getElementById("summary");

const SWIPE_TRIGGER = 60;
const FLY_OUT_DISTANCE = 1000;

//loading cats pic up to the max_cats
for (let i = 0; i < max_cats; i++) {
  cats.push(`https://cataas.com/cat?width=300&height=400&v=${Date.now() + i}`);
}


function createCard(url) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `<img src="${url}" />`;
  

  let startX = 0;
  let deltaX = 0;
  let isDragging = false;

  function onStart(e) {
    isDragging = true;
    startX = getX(e);
    card.style.transition = "none";
  }

  function onMove(e) {
    if (!isDragging) return;

    deltaX = getX(e) - startX;
    const rotate = Math.max(Math.min(deltaX / 10, 15), -15);

    card.style.transform = `translateX(${deltaX}px) rotate(${rotate}deg)`;
  }

  function onEnd() {
    if (!isDragging) return;
    isDragging = false;

    if (deltaX > SWIPE_TRIGGER) {
      swipe(card, "right");
    } else if (deltaX < -SWIPE_TRIGGER) {
      swipe(card, "left");
    } else {
      resetCard(card);
    }

    deltaX = 0;
  }

  // Mouse
  card.addEventListener("mousedown", onStart);
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onEnd);

  // Touch
  card.addEventListener("touchstart", onStart);
  card.addEventListener("touchmove", onMove);
  card.addEventListener("touchend", onEnd);

  return card;
}

//swipe animation and logics to put inside the array
function swipe(card, direction) {
  const isRight = direction === "right";
  const currentCat = cats[currentIndex];

  if (isRight) {
    likedCats.push(currentCat);
  } else {
    dislikedCats.push(currentCat);
  }

  card.style.transition = "transform 0.45s ease-out";
  card.style.transform = `translateX(${isRight ? FLY_OUT_DISTANCE : -FLY_OUT_DISTANCE}px)
                          rotate(${isRight ? 30 : -30}deg)`;

  setTimeout(() => {
    card.remove();
    nextCard();
  }, 450);
}

function resetCard(card) {
  card.style.transition = "transform 0.3s ease";
  card.style.transform = "translateX(0) rotate(0)";
}


function nextCard() {
  currentIndex++;

  if (currentIndex >= max_cats) {
    showSummary();
  } else {
    renderCard(true);
  }
}

//rendering cards
function renderCard(animate = false) {
  container.innerHTML = "";

  const card = createCard(cats[currentIndex]);

  if (animate) {
    card.style.transform = "scale(0.95)";
    card.style.opacity = "0";

    requestAnimationFrame(() => {
      card.style.transition = "transform 0.35s ease, opacity 0.35s ease";
      card.style.transform = "scale(1)";
      card.style.opacity = "1";
    });
  }

  container.appendChild(card);
}

//summary section
function showSummary() {
  container.style.display = "none";
  summary.classList.remove("hidden");

  document.getElementById("welcome-text").classList.add("hidden");

  //like and dislike count
  document.getElementById("like-count").textContent = likedCats.length;
  document.getElementById("dislike-count").textContent = dislikedCats.length;

  //this is to get images based on the like and dislike
  const likedContainer = document.getElementById("liked-cats");
  const dislikedContainer = document.getElementById("disliked-cats");

  
  likedContainer.innerHTML = "";
  dislikedContainer.innerHTML = "";

  likedCats.forEach(url => {
    const img = document.createElement("img");
    img.src = url;
    img.className = "summary-img";
    likedContainer.appendChild(img);
  });

  dislikedCats.forEach(url => {
    const img = document.createElement("img");
    img.src = url;
    img.className = "summary-img";
    dislikedContainer.appendChild(img);
  });
}

function getX(e) {
  return e.touches ? e.touches[0].clientX : e.clientX;
}

renderCard();


document.getElementById("reset-btn").addEventListener("click", resetApp);

function resetApp() {
  // reset data
  currentIndex = 0;
  likedCats.length = 0;
  dislikedCats.length = 0;

  // regenerate cats
  cats.length = 0;
  for (let i = 0; i < max_cats; i++) {
    cats.push(`https://cataas.com/cat?width=300&height=400&v=${Date.now() + i}`);
  }

  // reset UI
  summary.classList.add("hidden");
  container.style.display = "block";
  document.getElementById("welcome-text").classList.remove("hidden");

  document.getElementById("liked-cats").innerHTML = "";
  document.getElementById("disliked-cats").innerHTML = "";

  renderCard();
}
