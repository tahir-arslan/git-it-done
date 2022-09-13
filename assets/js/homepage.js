var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var getUserRepos = function(user) {
    // format github api url to be dynamic
    var apiURL = "https://api.github.com/users/" + user + "/repos";
    // make request to url
    fetch(apiURL)
        .then(function(response) {
            // if in our case will check to see if user exists. HTTP request will still be made regardless
            // request was successful
            if (response.ok) {
                // GitHub's API will tell us if (user||!user). We can check if successful by using .ok (bundled in response object from fetch() )
                // when status code in 200s, ok = true. if !ok, then we have the else statement to inform user search was unsuccessful
                response.json()
                    .then(function(data) {
                        // once response data is converted to JSON, will be sent from
                        // getUserRepos() to displayRepos()
                        displayRepos(data, user);
                    });
            } else {
                alert("Error: GitHub User Not Found.");
            }
        })
        // .catch() getting chained to the end of the .then() method for fetch()
        // catch error to inform user if any connectivity issue
        .catch(function(error) {
            alert("Unable to connect to GitHub.");
        })
};

var formSubmitHandler = function(event) {
    // don't forget, .preventDefault is important for stopping the browser from doing
    // it's native behaviour, in this case is refreshing the page once form is submitted
    event.preventDefault();
    // get value from input element
    // .trim() is useful to remove any unnecessary spaces at the beginning/end of search
    var username = nameInputEl.value.trim();
    // validate input
    if (username) {
        getUserRepos(username);
        // set search to empty string to remove search input
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username.");
    }
    console.log(event);
};

var displayRepos = function(repos, searchTerm) {
    // check if API returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
    // clear any old content first, even if nothing is loaded to be safe
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;
    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        // capture and format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;
        // create link for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        // links to single-repo.html via query. in single.js, repo is already defined. this way, repoName 
        // (defined above, passes it's information to the `repo` variable defined in single.js)
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
        // create span element to hold repo name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;
        // append to container
        repoEl.appendChild(titleEl);
        // create status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";
        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }
        // append to container
        repoEl.appendChild(statusEl);
        // append container to DOM
        repoContainerEl.appendChild(repoEl);
    }

    console.log(repos);
    console.log(searchTerm);
}

userFormEl.addEventListener("submit", formSubmitHandler);