"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, deleteButton = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const showStar = Boolean(currentUser);
  return $(`
      <li id="${story.storyId}">
        ${deleteButton ? putTrashCan(): ""}
        ${showStar ? whatKindOfStar(story,currentUser): ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}
/*Remebers if the story in the favorite list or not */
function whatKindOfStar(story, user){
  if(user.favorites.length === 0) {
    return '<i class="far fa-star" id="fav-star"></i>'
  } else if(user.favorites.some(s => s.storyId === story.storyId)){
    return '<i class="fas fa-star" id="fav-star"></i>'
  } else {
    return '<i class="far fa-star" id="fav-star"></i>'
  }
}
/*Puts a trash can icon when mystories listed */
function putTrashCan(){
  return '<i class="fas fa-trash-alt" id="trash-can"></i>'
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/*adding/removing fav to star and posting/deleting API */

async function toggleFav(evt){
  const star = $(evt.target)
  const $tgt = $(evt.target).parent();
  let $storyId = $tgt.attr('id');
  const $story =  storyList.stories.find(s => s.storyId === $storyId);
  if(star.hasClass("far")){
    star.removeClass("far");
    star.addClass("fas");
    await  currentUser.addToFavorites($story, $storyId);
  } else {
    star.removeClass("fas");
    star.addClass("far");
    await currentUser.removeFromFavorites($storyId)
  }
}

$allStoriesList.on("click", "#fav-star", toggleFav);
$favStoriesList.on("click", "#fav-star", toggleFav);

/*making favorvite stories list when click on favorites on navbar*/

function putFavStoriesOnPage(){
  $favStoriesList.empty();
  if(currentUser.favorites.length === 0){
    $favStoriesList.append("<h4>No Saved Favorite Stories</h4>");
  } else {
    for(let favStories of currentUser.favorites){
      $favStoriesList.append(generateStoryMarkup(favStories));
    }
  }  
}

/*user creating their own story with the form I created and adding them to the storyList to apper on the page */

async function submitStory(evt) {
  console.debug("submitStory", evt);
  evt.preventDefault();
  const title = $("#title").val();
  const url = $("#url").val();
  const author = $("#author").val();
  const newStory = await storyList.addStory(currentUser, {title, url, author});
  $storyForm.hide("slow");
  $allStoriesList.show();
  const $story = generateStoryMarkup(newStory);
  $allStoriesList.append($story);
  $storyForm.trigger("reset");
}

$storyForm.on("submit", submitStory);

/*making user stories when click on my stories in navbar */
function putUserStoriesOnPage(){
  $userStoriesList.empty();
  if(currentUser.ownStories.length === 0){
    $userStoriesList.append("<h4>No User Made Stories</h4>");
  } else {
    for(let userStories of currentUser.ownStories){
      $userStoriesList.append(generateStoryMarkup(userStories, true));
      }
  }
}

/*handling tarshcan click and deleting stories both from API also currentUser data*/

async function deleteStory(evt) {
  console.debug("deleteStory", evt);
  const $story = $(evt.target).parent();
  const $storyId = $story.attr('id');
  console.log($storyId);
  await storyList.removeUserStories(currentUser, $storyId);
  putUserStoriesOnPage();
}

$userStoriesList.on("click", "#trash-can", deleteStory)