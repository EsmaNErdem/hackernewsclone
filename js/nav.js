"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $navLogin.hide();
  $navStory.show()
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/* Show user info on click on username in navbar*/
function userProfileInfo(evt){
  console.debug("userProfileInfo", evt);
  hidePageComponents();
  $userProfile.show();
}

$navUserProfile.on("click", userProfileInfo)

/* Show new story submit form on click on "submit"*/

function navSubmitClick(evt){
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $storyForm.show();
}

$navStorySubmit.on("click", navSubmitClick);


/*Show Favorites when on click favorites in navbar */

function navFavorites(evt){
  console.debug("navFavorites", evt);
  hidePageComponents();
  putFavStoriesOnPage();
  $favStoriesList.show();
}

$navFav.on("click", navFavorites);


/*Shows user made stories on click mystories in navbar */

function navUserStories(evt){
  console.debug("navUserStories", evt);
  hidePageComponents();
  putUserStoriesOnPage();
  $userStoriesList.show();
}

$navMyStories.on("click", navUserStories);

