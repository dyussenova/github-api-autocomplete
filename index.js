const mainEl = document.querySelector(".main");

const inputEl = document.createElement("input");
inputEl.classList.add("search-input");
inputEl.type = "text";

const dropdown = document.createElement("div");
dropdown.classList.add("dropdown");

const dropdownList = document.createElement("ul");
dropdownList.classList.add("dropdown-list");

const cardCont = document.createElement("div");
cardCont.classList.add("card-cont");

dropdown.appendChild(dropdownList);

const fragment = document.createDocumentFragment();
fragment.appendChild(inputEl);
fragment.appendChild(dropdown);
fragment.appendChild(cardCont);
mainEl.appendChild(fragment);

inputEl.addEventListener(
  "input",
  debounce(async (e) => {
    const valueEvent = e.target.value.trim();
    if (valueEvent) {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${valueEvent}&per_page=5`
      );
      if (response.ok) {
        const data = await response.json();

        data.items.forEach((repo) => createRepos(repo));
      } else {
        alert("Репозиторий не найден");
      }
    } else {
      clearList();
    }
  }, 600)
);

function createRepos(repoData) {
  const dropEl = document.createElement("li");
  dropEl.classList.add("drop-elem");
  dropEl.innerText = `${repoData.name}`;
  dropEl.addEventListener("click", () => {
    clearList();
    let name = repoData.name;
    let owner = repoData.owner.login;
    let stars = repoData.stargazers_count;
    const newRepos = document.createElement("div");
    newRepos.classList.add("repos-card");
    newRepos.innerHTML = `Name: ${name}<br>Owner: ${owner}<br>Stars: ${stars}`;

    const btn = document.createElement("button");

    btn.classList.add("btn-dlt");
    btn.addEventListener("click", () => {
      clearCard();
    });
    newRepos.appendChild(btn);

    cardCont.appendChild(newRepos);
    clearInput();
  });
  dropdownList.appendChild(dropEl);
}

function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function clearInput() {
  inputEl.value = " ";
}

function clearCard() {
  cardCont.innerHTML = " ";
}

function clearList() {
  dropdownList.innerHTML = " ";
}
