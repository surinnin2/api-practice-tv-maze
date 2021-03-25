/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const response = await axios.get('http://api.tvmaze.com/search/shows', { params : { q : query }})
  const responseArray = []
  for (index in response.data) {
    let showdata = response.data[index]
     responseArray.push({
       "id" : showdata.show.id,
       "name" : showdata.show.name,
       "summary" : showdata.show.summary,
       "image" : showdata.show.image ? showdata.show.image.medium : "https://tinyurl.com/tv-missing"
     })
  }
  return responseArray
}


/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
            <img class="card-img-top" src="${show.image}">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-primary btn-block" id="get-episodes">Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  const episodeResponse = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
  return episodeResponse.data
}

//changes the DOM to clear and show the episodes-area and append an li of each episode in the array recieved to the episode-list ul
function populateEpisodes(arr) {
  const $epList = $('#episodes-list')
  const $epArea = $('#episodes-area')
  $epList.empty()
  
  for (index in arr) {
    let $ep = $('<li>')
    
    $ep.text(`${arr[index].name} (season ${arr[index].season}, number ${arr[index].number})`)
    $epList.append($ep)
  }

  $epArea.show()

}

//wait for click on buttons with id="get-episode" and populateEpisodes based on the button's parent element show id 
$("#shows-list").on("click", "#get-episodes", async function (evt) {
  let showId = $(evt.target).parents(".Show").data("show-id");
  let episodesArr = await getEpisodes(showId);
  populateEpisodes(episodesArr);
})