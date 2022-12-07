"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");
const $episodeList = $('#episodes-list');
const imageList = {};

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  let results = await axios.get(`http://api.tvmaze.com/search/shows?q=${term}`);
  console.log(results)
  const shows = []
  for( let i = 0; i < results.data.length; i++){ shows.push({
    id: results.data[i].show.id,
    name:results.data[i].show.name,
    summary:results.data[i].show.summary
  }); 
  imageList[`${results.data[i].show.id}`] = results.data[i].show.image.original
}
return shows

}
  // ADD: Remove placeholder & make request to TVMaze search shows API.

  



/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    let image = imageList[`${show.id}`]
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${image}" 
              alt="https://tinyurl.com/tv-missing" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button onclick='getEpisodesOfShow(${show.id})' class="btn  btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);
  
  $episodeList.empty();
  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});



/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }*/
 


async function getEpisodesOfShow(id) { 
 let results = await axios.get 
  (`http://api.tvmaze.com/shows/${id}/episodes`);
  

  const episodes = []
  for( let i = 0; i < results.data.length; i++){ episodes.push({
    id: results.data[i].id,
    name:results.data[i].name,
    season:results.data[i].season,
    number: results.data[i].number
  }); 
  
}
populateEpisodes(episodes) 

 
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  for (let episode of episodes){
  const $episode = $(
    `<li> S:${episode.season} E:${episode.number} Title: ${episode.name}</li>`
  )
  $episodeList.append($episode)}
  $episodesArea.show()
 }
