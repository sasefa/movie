document.addEventListener('DOMContentLoaded', function() {
    var localWatchlist = [];
    var localWatched = [];
    var watchedBtn = document.createElement('button');
    watchedBtn.innerHTML = "Add to Watched";
    watchedBtn.className="listButtons";
    watchedBtn.addEventListener('click', watchedAdd);
    var watchlistRemoveBtn = document.createElement('button');
    watchlistRemoveBtn.innerHTML = "Remove from Watchlist";
    watchlistRemoveBtn.className="listButtons";
    watchlistRemoveBtn.addEventListener('click', watchlistRemove);

    // retrieve the movieInfo data from local storage
    const movieData = JSON.parse(localStorage.getItem('selectedMovie'));
    console.log(movieData)
    const val = movieData.val
  
      // retrieve the movieInfo element
    const movieInfo = document.getElementById('movieInfo');
      // create a string to display ratings
    let ratingsHTML = "";
      // use foreach to create a line per rating
    if (movieData.Ratings && movieData.Ratings.length > 0) {
        movieData.Ratings.forEach(rating => {
            ratingsHTML += `<p>${rating.Source}: ${rating.Value}</p>`;
        });
    }
  
    // Create the HTML content to display the movie information
    let imdbID = movieData.imdbId || movieData.imdbID;
    let moviePosterHTML = '';
    if (imdbID) {
      moviePosterHTML = `
        <a href="#" onclick="fetchAdditionalMovieData('${imdbID}')">
          <img src="${movieData.Poster}" alt="${movieData.Title} Poster" class="poster">
        </a>
      `;
    } else {
      moviePosterHTML = `<img src="${movieData.Poster}" alt="${movieData.Title} Poster" class="poster">`;
    }
    
    moviePoster.innerHTML = moviePosterHTML;
    let htmlContent = `<h2>${movieData.Title}</h2>`;

    if (movieData.Year) {
      htmlContent += `<p>Year: ${movieData.Year}</p>`;
    }
    if (movieData.Rated) {
      htmlContent += `<p>Rating: ${movieData.Rated}</p>`;
    }
    if (movieData.Director) {
      htmlContent += `<p>Director: ${movieData.Director}</p>`;
    }
    if (movieData.Actors) {
      htmlContent += `<p>Starring: ${movieData.Actors}</p>`;
    }
    if (movieData.Plot) {
      htmlContent += `<p>Plot Synopsis: ${movieData.Plot}</p>`;
    }
    htmlContent += ratingsHTML;

    const savedWatchlist = localStorage.getItem("savedWatchlist");
    const savedWatched = localStorage.getItem("savedWatched");
    
    if (savedWatchlist && JSON.parse(savedWatchlist).length !== 0) {
        localWatchlist = JSON.parse(savedWatchlist);
    } else {
        console.log('empty');
    }
    
    if (savedWatched && JSON.parse(savedWatched).length !== 0) {
        localWatched = JSON.parse(savedWatched);
    } else {
        console.log('empty');
    }

    // Set the HTML content to the movieInfo element
    movieInfo.innerHTML = htmlContent;


    for (i=0; i<localWatchlist.length; i++) {
        if (localWatchlist[i].Title == movieData.Title) {
            movieInfo.append(watchlistRemoveBtn);
            let isMovieAlreadyAdded = false;
            for (let i = 0; i < localWatched.length; i++) {
                if (localWatched[i].Title === movieData.Title) {
                isMovieAlreadyAdded = true;
                break;
                }
            };
            if (!isMovieAlreadyAdded){
                movieInfo.append(watchedBtn);
            }
        }
    }

    function watchedAdd() {
        if(JSON.parse(localStorage.getItem("savedWatched")) != null) {
          localWatched = (JSON.parse(localStorage.getItem("savedWatched")));
        };
        let isMovieAlreadyAdded = false;
        for (let i = 0; i < localWatched.length; i++) {
          if (localWatched[i].Title === movieData.Title) {
            isMovieAlreadyAdded = true;
            break;
          }
        };
        if (!isMovieAlreadyAdded){
            localWatched.push(movieData);
            localStorage.setItem("savedWatched", JSON.stringify(localWatched));
            console.log(localWatched);
            console.log(localStorage.savedWatched);
        }
        watchlistRemove();
    }

    function watchlistRemove() {
        if(JSON.parse(localStorage.getItem("savedWatchlist")).length != 0){
            for (i=0; i<localWatchlist.length; i++) {
                if (localWatchlist[i].Title == movieData.Title) {
                    localWatchlist.splice(i, 1);
                    localStorage.setItem("savedWatchlist", JSON.stringify(localWatchlist));
                    console.log(localStorage.getItem("savedWatchlist"));
                    break;
                }
            }
        }
    }
});

function fetchAdditionalMovieData(imdbID) {
    fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=f26b11a3`)
      .then(response => response.json())
      .then(data => {
        // Add the additional movie data to selectedMovie in local storage
        localStorage.setItem('movieInfo', JSON.stringify(data));
        console.log(data)
        // Redirect back to index.html
        window.location.href = 'index.html?movieRedirect=true';      })
      .catch(error => {
        // Handle any errors that occur during the fetch request
        console.error('Error:', error);
      });
  }
