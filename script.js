const repositories = document.querySelector(".repositories");
const autoComplete = document.querySelector(".auto-complete");
const input = document.querySelector(".search");

repositories.addEventListener("click", (e) => {
  if (e.target.className !== "close__icon") return;
  e.target.closest(".repositories__item").remove();
});

let dataSearch = [];

const debounce = (fn, debounceTime) => {
  let timeout;
  return function () {
    const func = () => fn.apply(this, arguments);
    clearTimeout(timeout);
    timeout = setTimeout(func, debounceTime);
  };
};

async function onChange() {
  autoComplete.innerHTML = "";
  let inputValue = input.value.trim();
  if (inputValue === "") {
    return;
  }
  const response = await fetch(`https://api.github.com/search/repositories?q=${inputValue}`);
  dataSearch = await response.json();
  if (!dataSearch.items || dataSearch.items.length === 0) {
    const inputElement = document.createElement("li");
    inputElement.textContent = "Нет результатов";
    inputElement.classList.add("no-result");
    autoComplete.appendChild(inputElement);
  }

  dataSearch = dataSearch.items.slice(0, 5);

  let count = 0;
  dataSearch.forEach((el) => {
    const inputElement = document.createElement("li");
    inputElement.textContent = el.name;
    inputElement.classList.add("result");
    inputElement.id = count++;
    autoComplete.appendChild(inputElement);
  });
}

onChange = debounce(onChange, 700);

input.addEventListener("input", onChange);

autoComplete.addEventListener("click", (e) => {
  if (e.target.className === "no-result") {
    return;
  }
  const repositoriesItem = document.createElement("li");
  repositoriesItem.classList.add("repositories__item");

  const repositoriesInfo = document.createElement("div");
  repositoriesInfo.classList.add("repositories__info");
  repositoriesInfo.innerHTML = `
  Name: ${dataSearch[e.target.id].name}<br>
  Owner: ${dataSearch[e.target.id].owner.login}<br>
  Stars: ${dataSearch[e.target.id].stargazers_count}
  `;

  repositoriesItem.appendChild(repositoriesInfo);
  const repositoriesClose = document.createElement("div");
  repositoriesClose.classList.add("repositories__close");
  const repositoriesCloseButton = document.createElement("button");
  repositoriesCloseButton.classList.add("close");
  const repositoriesCloseImg = document.createElement("img");
  repositoriesCloseImg.classList.add("close__icon");
  repositoriesCloseImg.src = "delete.svg";
  repositoriesCloseButton.appendChild(repositoriesCloseImg);
  repositoriesClose.appendChild(repositoriesCloseButton);
  repositoriesItem.appendChild(repositoriesClose);
  repositories.appendChild(repositoriesItem);

  autoComplete.innerHTML = "";
  input.value = "";
});
