var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

var getRepoName = function() {
    // remember, we can find more information available for .location through console.log/dir
    var queryString = document.location.search;
    // after .split(), return the second string that is returned via [1]
    var repoName = queryString.split("=")[1];
    console.log("this is the repoName: " + repoName)
    if (repoName) {
        getRepoIssues(repoName);
        repoNameEl.textContent = repoName;
    } else {
        // https://developer.mozilla.org/en-US/docs/Web/API/Location
        // this doc on Location Web API shows available properties/methods for Location Web API
        // from here we can see that we are able to use .replace() to redirect user back to index.html
        // if repoName is empty. To check to see if this worked, simply load single-repo.html. 
        // since it opens with no repoName stored, it automatically redirects user back to index.html. 
        // Also note the relative path to redirect back to index.html
        document.location.replace("./index.html");
    }
}

var getRepoIssues = function(repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    fetch(apiUrl)
        .then(function(response) {
            // request was successful
            if (response.ok) {
                response.json()
                    .then(function(data) {
                        displayIssues(data);
                        // check if api has paginated issues (in the case of GitHub Api, if it has more than 30 results, which is an GitHub internal limitation.)
                        if (response.headers.get("Link")) {
                            displayWarning(repo);
                        }
                        // GitHub api also provides a seperate link if user wants to view moer than 30 results
                    });
            } else {
                // if fetch call is not successful, redirect to homepage
                document.location.replace("./index.html");
            }
        });
    console.log("this is from fetch: " + repo);
};

var displayIssues = function(issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }
    for (i = 0; i < issues.length; i++) {
        // capture and create <a> to hold link
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");
        // capture and create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;
        // append
        issueEl.appendChild(titleEl);
        // create type element
        var typeEl = document.createElement("span");
        // check if issue is actual issue or pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)";
        }
        // append to container
        issueEl.appendChild(typeEl);
        issueContainerEl.appendChild(issueEl);
    }
};

var displayWarning = function(repo) {
    // create <a> element pointing to https://github.com/<repo>/issues
    var linkEl = document.createElement("a");
    linkEl.textContent = "See more issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");
    // append to warning container
    limitWarningEl.appendChild(linkEl);
    // // add text to warning container
    // displayWarning.textContent = "To see more than 30 issues, visit ";
};

// getRepoName() is used to extract query value sent from homepage.js
getRepoName();