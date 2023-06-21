// EventListener adds when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // adds event listener to searchButton
    const searchButton = document.getElementById('searchButton');
    // when searchButton is clicked execute function searchMovie
    searchButton.addEventListener('click', searchMovie);

    const movieRedirect = new URLSearchParams(window.location.search);
if (movieRedirect.get('movieRedirect') === 'true') {
  const infoRedirect = (JSON.parse(localStorage.getItem("movieInfo")));
  const titleRedirect = infoRedirect.Title
  const imdbRedirect = infoRedirect.imdbId || infoRedirect.imdbID
  console.log(infoRedirect)
  getTrailer(titleRedirect)
  getRecommendations(titleRedirect);
  // getSources(imdbRedirect);
}
});

var imdbId;
var movieObject;

var showmoreButton = document.createElement('button');
var watchlistButton = document.createElement('button');
var watchedButton = document.createElement('button');
showmoreButton.addEventListener('click', showmore);
watchlistButton.addEventListener('click', watchlistAdd);
watchedButton.addEventListener('click', watchedAdd);

watchlistButton.innerHTML = "Add to Watchlist";
watchedButton.innerHTML = "Add to Watched";
watchlistButton.className="listButtons";
watchedButton.className="listButtons";

var localWatched = [];
var watched = [];
var localWatchlist = [];
var watchlist = [];

function watchedAdd() {
  if(JSON.parse(localStorage.getItem("savedWatched")) != null) {
    localWatched = (JSON.parse(localStorage.getItem("savedWatched")));
  };
  let isMovieAlreadyAdded = false;
  for (let i = 0; i < localWatched.length; i++) {
    if (localWatched[i].title === movieObject.title) {
      isMovieAlreadyAdded = true;
      break;
    }
  }
  if (!isMovieAlreadyAdded){
  watched = localWatched;
  watched.push(movieObject);
  localStorage.setItem("savedWatched", JSON.stringify(watched));
  console.log(watched);
  console.log(localStorage.savedWatched);
}
}


function watchlistAdd() {
  if(JSON.parse(localStorage.getItem("savedWatchlist")) != null) {
    localWatchlist = (JSON.parse(localStorage.getItem("savedWatchlist")));
  }; 
  let isMovieAlreadyAdded = false;
  for (let i = 0; i < localWatchlist.length; i++) {
    if (localWatchlist[i].Title === movieObject.Title) {
      isMovieAlreadyAdded = true;
      break;
    }
  }
  if (!isMovieAlreadyAdded){
  watchlist = localWatchlist;
  watchlist.push(movieObject);
  localStorage.setItem("savedWatchlist", JSON.stringify(watchlist));
  console.log(watchlist);
  console.log(localStorage.savedWatchlist);
}
}

  // searchMovie function to fetch movie info
  function searchMovie(event) {
    // prevent form submission
    event.preventDefault();
    // grabs the text field with id searchInput from html and sets it as variable called input
    const input = document.getElementById('searchInput');
    // grabs the entered text value from the input and sets it as query
    const query = input.value;
   
    fetchSearch(query)
  }
  
    function fetchSearch(search) {
    // fetch through omdb api
    fetch(`https://www.omdbapi.com/?apikey=f26b11a3&t=${search}`)
    // take the response and parse w JSON
      .then(response => response.json())
      // take the parsed response and runs as "data"
      .then(data => {
        // omdb api's parsed JSON object has a "Response" property that will return as "True" when a valid title is searched.
        // we can check the data.Response property to see if a valid movie was found 
        if (data.Response === "True") {
       // saves JSON response to local storage
        localStorage.setItem('movieInfo', JSON.stringify(data));
          // Retrieve the IMDB ID. This will be used for the Watchmode api's fetch
          const imdbId = data.imdbID;
  
          // DISABLED TO SAVE API USES
          // Call the getSources function with the IMDB ID
          getSources(imdbId);

                    // Call the getRecommendations function with the movie title
                    getRecommendations(data.Title);
                                        // Call the getTrailer function with the movie title
                    getTrailer(data.Title);
  
     const movieObject = {
          Title: data.Title,
          Poster: data.Poster,
          Rated: data.Rated,
          Actors: data.Actors,
          Ratings: data.Ratings,
          Plot: data.Plot,
          imdbId: data.imdbID,
          Year: data.Year
        };


        displayMovieInfo(movieObject)
      } else { 
        // grabs movieInfo div from html
        const movieInfo = document.getElementById('movieInfo');
        // sets content of movieInfo to Movie not found message
        movieInfo.innerHTML = `<p>Movie not found!</p>`;
      }
    })

    // if an error is caught during the fetch then log it to the console
    .catch(error => {
      console.log(error);
    });
  };
  
  // Function to fetch sources using Watchmode API
  function getSources(titleId) {
    // puts the imdb titleID into a fetch request
    fetch(`https://api.watchmode.com/v1/title/${titleId}/details/?apiKey=WPmG7Zz5vHjq40wGf0WSfvoq2z6F38BSqO3r9xPe&append_to_response=sources`)
    // parses resopnse as JSON object
      .then(response => response.json())
      // runs that JSON response object as data
      .then(data => {
      // saves JSON response to local storage
      localStorage.setItem('sources', JSON.stringify(data));
        console.log(data); // Logs the response data to the console
  
        let link = data.trailer
          // Regular expression to match different YouTube URL formats
          var regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([^\s&?\/]+)/;
          
          var match = link.match(regex);
          if (match && match[1]) {
            var videoId = match[1];
            var embeddedLink = 'https://www.youtube.com/embed/' + videoId;
          
          
        trailerContainer.innerHTML = `
        <iframe width="560" height="315" src="${embeddedLink}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      `;
    } else {
      const trailerContainer = document.getElementById('trailerContainer');
      trailerContainer.innerHTML = `<p>No trailer found for this title.</p>`;
    }
      // if conditional to check that there are more than zero sources fetched
      if (data.sources && data.sources.length > 0) {
        // assigns array of streaming sources from data to variable "sources"
        const sources = data.sources;
        console.log(sources); // Log the sources to the console
  
        // Remove duplicates from the sources array based on name
        // extracts all source names into an array with sources.map(source => source.name)
        // that array passes through "new Set()" to remove duplicate names
        // then uses Array.from() to create another array and puts the non duplicated names into it
        const uniqueSources = Array.from(new Set(sources.map(source => source.name)))
         
        // uses sources.find() to invoke a callback function on each element in the sources array
        // each "name" property of the element "source" is compared to the current name being mapped and returns the element if a match is found
        .map(name => sources.find(source => source.name === name));
  
        // grabs the sourcesList div and makes into variable
        const sourcesList = document.getElementById('sourcesList');
          // maps an array of each source.name property with list item tags then joins them together into a single string
        const sourcesHTML = uniqueSources.map(source => `<li>${source.name}</li>`).join('');
          // takes the list items from sourcesHTML and puts them into a unordered list at the sourcesList <div>
          sourcesList.innerHTML = `<ul>${sourcesHTML}</ul>`;
        } else {
          // if there number of sources is 0, displays "No sources found" message
          const sourcesList = document.getElementById('sourcesList');
          sourcesList.innerHTML = `<p>No sources found for this title ID.</p>`;
        }
      })
      // if an error is caught log it to the console and displays error on page
      .catch(error => {
        console.log(error);
        const sourcesList = document.getElementById('sourcesList');
        sourcesList.innerHTML = `<p>Error: ${error.message}</p>`;
      });
  }


  // Function to fetch recommendations
  function getRecommendations(title) {
    fetch(`https://www.omdbapi.com/?apikey=f26b11a3&s=${encodeURIComponent(title)}`)
      .then(response => response.json())
      .then(data => {
        if (data.Response === "True" && data.Search) {
          const recommendationsContainer = document.getElementById('recommendations');
          recommendationsContainer.innerHTML = '';
  
          data.Search.forEach(result => {
            if (result.Title !== title){
            const recommendation = document.createElement('div');
            recommendation.classList.add('recommendation');
            recommendation.addEventListener('click', () => {
              showMovieDetails(result.imdbID);
            });
  
            const poster = document.createElement('img');
            poster.src = result.Poster;
            poster.alt = result.Title;
            poster.classList.add('poster');
  
            const title = document.createElement('p');
            title.textContent = result.Title + ` (` + result.Year + `)`;
  
            const actions = document.createElement('div');
            actions.classList.add('actions');
  
            const watchlistBtn = document.createElement('button');
            watchlistBtn.textContent = 'Add to Watchlist';
            watchlistBtn.addEventListener('click', (event) => {
              event.stopPropagation();
              addToWatchlist(result);
            });

            const showmoreBtn = document.createElement('button');
            showmoreBtn.textContent = ('Show More');
            showmoreBtn.addEventListener('click', (event) => {
              event.stopPropagation();
              showmore(result);
            });
            
  
            const watchedBtn = document.createElement('button');
            watchedBtn.textContent = 'Add to Watched';
            watchedBtn.addEventListener('click', (event) => {
              event.stopPropagation();
              addToWatched(result);
            });
  
            actions.appendChild(watchlistBtn);
            actions.appendChild(watchedBtn);
            actions.appendChild(showmoreBtn);
  
            recommendation.appendChild(poster);
            recommendation.appendChild(title);
            recommendation.appendChild(actions);
  
            recommendationsContainer.appendChild(recommendation);
          }

            console.log(result)
      });
        } else {
          const recommendationsContainer = document.getElementById('recommendations');
          recommendationsContainer.innerHTML = `<p>No recommendations found.</p>`;
        }
      })
      .catch(error => {
        console.log(error);
        const recommendationsContainer = document.getElementById('recommendations');
        recommendationsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
      });
  }
  
  function showMovieDetails(imdbID) {
    // Implement logic to show movie details using the IMDb ID
    console.log('Showing details for movie with IMDb ID:', imdbID);
  }
  
  function addToWatchlist(movie) {
    if(JSON.parse(localStorage.getItem("savedWatchlist")) != null) {
      localWatchlist = (JSON.parse(localStorage.getItem("savedWatchlist")));
    };
    watchlist = localWatchlist;
    watchlist.push(movie);
    localStorage.setItem("savedWatchlist", JSON.stringify(watchlist));
    console.log(watchlist);
    console.log(localStorage.savedWatchlist);
  } 
  
  function addToWatched(movie) {
    if(JSON.parse(localStorage.getItem("savedWatched")) != null) {
      localWatched = (JSON.parse(localStorage.getItem("savedWatched")));
    };
    watched = localWatched;
    watched.push(movie);
    localStorage.setItem("savedWatched", JSON.stringify(watched));
    console.log(watched);
    console.log(localStorage.savedWatched);
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    // retrieve the movieInfo data from local storage
    const movieData = JSON.parse(localStorage.getItem('movieInfo'));
  
    // check if previous movieData exists in local storage
    if (movieData) {
      displayMovieInfo(movieData);

  }})
  
//function to show more about recommended movie

function showmore(event) {
  console.log(event)
  // prevent form submission
  // event.preventDefault();
  // grabs the title from movie and sets it as variable called input
  const query = event.Title
  // grabs the entered text value from the input and sets it as query
  fetchSearch(query)
}

    // Function to display movie information
function displayMovieInfo(movie) {
  const movieInfo = document.getElementById('movieInfo');
  let ratingsHTML = "";

  movieObject = movie;
  console.log(movie)
  if (movie.Ratings && movie.Ratings.length > 0) {
    movie.Ratings.forEach(rating => {
      ratingsHTML += `<p>${rating.Source}: ${rating.Value}</p>`;
    });
  }

  moviePoster.innerHTML = `<img src="${movie.Poster}" alt="${movie.Title} Poster">`;

  movieInfo.innerHTML = `
    <h2>${movie.Title}</h2>
    <p>Year: ${movie.Year}</p>
    <p>Rating: ${movie.Rated}</p>
    <p>Director: ${movie.Director}</p>
    <p>Starring: ${movie.Actors}</p>
    <p id="plot">${movie.Plot}</p>
    ${ratingsHTML}
  `;

  movieInfo.append(watchlistButton);
  movieInfo.append(watchedButton);
  }
