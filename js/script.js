// overview is where profile info will appear 
const overview = document.querySelector(".overview");
const username = "alissa-17";
const repoList = document.querySelector(".repo-list");
const allRepoInfo = document.querySelector(".repos");
const repoDataSection = document.querySelector(".repo-data");
const viewReposButton = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos");



const gitHubInfo = async function () {
  const userInfo = await fetch(`https://api.github.com/users/${username}`);
  const data = await userInfo.json();
  displayUserInfo(data);
};

gitHubInfo();

const displayUserInfo = function (data) {
  const div = document.createElement("div");
  div.classList.add("user-info");
  div.innerHTML = `
    <figure>
      <img alt="user avatar" src=${data.avatar_url} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Bio:</strong> ${data.bio}</p>
      <p><strong>Location:</strong> ${data.location}</p>
      <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div>
    `;
  overview.append(div);
  gitRepos();
};

const gitRepos = async function (username) {
  const repoFetch = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
  const repoData = await repoFetch.json();
  displayRepos(repoData);
}

const displayRepos = function (repos) {
  filterInput.classList.remove("hide");
  for (const repo of repos) {
    const repoItem = document.createElement("li");
    repoItem.classList.add("repo");
    repoItem.innerHTML = `<h3>${repo.name}</h3>`;
    repoList.append(repoItem);
  }
}

repoList.addEventListener("click", function (e) {
  if (e.target.matches("h3")) {
    const repoName = e.target.innerText;
    specialRepoInfo(repoName);
  };
});

const specialRepoInfo = async function (repoName) {
  const request = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
  const repoInfo = await request.json();
  console.log(repoInfo);

  const fetchLanguages = await fetch(repoInfo.languages_url);
  const languageData = await fetchLanguages.json();
  //console.log(languageData);

  const languages = [];
  for (const language in languageData) {
    languages.push(language);
  }

  displayRepoInfo(repoInfo, languages);

};

const displayRepoInfo = function (repoInfo, languages) {
  repoDataSection.innerHTML = "";

  repoDataSection.classList.remove("hide");
  allRepoInfo.classList.add("hide");

  const div = document.createElement("div");
  div.innerHTML = `<h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`;

  repoDataSection.append(div);

  viewReposButton.classList.remove("hide");

};

viewReposButton.addEventListener("click", function () {
  allRepoInfo.classList.remove("hide");
  repoDataSection.classList.add("hide");
  viewReposButton.classList.add("hide");
});

filterInput.addEventListener("input", function (e) {
  const searchText = e.target.value;
  const repos = document.querySelectorAll(".repo");
  const lowerSearchText = searchText.toLowerCase();

  for (const repo of repos) {
    const lowerRepoValue = repo.innerText.toLowerCase();
    if (lowerRepoValue.includes(lowerSearchText)) {
      repo.classList.remove("hide");
    } else {
      repo.classList.add("hide");
    }
  }
})