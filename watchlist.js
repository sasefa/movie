var watchlistEl = document.getElementById("watchlist");
var card = document.createElement('div');
var localWatchlist = [];
var localWatched = [];
var selectedMovie;
var selectedMovieData;
card.className = "card";

document.addEventListener('DOMContentLoaded', function() {
    console.log(JSON.parse(localStorage.getItem("savedWatchlist")).length);
    if (JSON.parse(localStorage.getItem("savedWatchlist")).length != 0) {
        localWatchlist = JSON.parse(localStorage.getItem("savedWatchlist")).filter(item => item !== null);
        console.log(localWatchlist);
        for (var i = 0; i < localWatchlist.length; i++) {
            card.innerHTML = `
            <div class="card-content spaced">
                <div class="poster-container">
                    <input type="image" src=${localWatchlist[i].Poster} class="listPoster" id="${localWatchlist[i].Title}" value="${[i]}">
                    <div class="button-container">
                        <button class="watchedButton" value="${[i]}">Watched</button>
                        <button class="removeButton" value="${[i]}">Remove</button>
                    </div>
                </div>
            </div>
            `;
            watchlistEl.appendChild(card);
            card = document.createElement('div');
            card.className = "card";
        }
    } else {
        watchlistEl.innerHTML = `
        <h2>Nothing to See</h2>
        <h4>You haven't added anything to your watchlist yet, search some movies you want to watch and save them here</h4>
        `;
    }

    $(".listPoster").click(function(event) {
        event.preventDefault();
        console.log(localWatchlist);
        selectedMovie = $(this).val();
        console.log(selectedMovie);
        selectedMovieData = {
            Title: localWatchlist[selectedMovie].Title,
            Poster: localWatchlist[selectedMovie].Poster,
            Rated: localWatchlist[selectedMovie].Rated,
            Actors: localWatchlist[selectedMovie].Actors,
            Ratings: localWatchlist[selectedMovie].Ratings,
            Plot: localWatchlist[selectedMovie].Plot,
            imdbID: localWatchlist[selectedMovie].imdbID,
            imdbId: localWatchlist[selectedMovie].imdbId,
            Year: localWatchlist[selectedMovie].Year,
            val: selectedMovie
        };
        console.log(selectedMovieData);
        localStorage.setItem("selectedMovie", JSON.stringify(selectedMovieData));
        document.location.href = "movie.html";
    });

    $(".watchedButton").click(function(event) {
        event.preventDefault();
        var index = $(this).val();
        var watchedMovie = localWatchlist[index];
        localWatchlist.splice(index, 1); // Remove from watchlist
        localWatched.push(watchedMovie); // Add to watched

        // Save the updated watchlist and watched list to localStorage
        localStorage.setItem("savedWatchlist", JSON.stringify(localWatchlist));
        localStorage.setItem("savedWatched", JSON.stringify(localWatched));

        // Refresh the page
        location.reload();
    });

    $(".removeButton").click(function(event) {
        event.preventDefault();
        var index = $(this).val();
        localWatchlist.splice(index, 1); // Remove from watchlist

        // Save the updated watchlist to localStorage
        localStorage.setItem("savedWatchlist", JSON.stringify(localWatchlist));

        // Refresh the page
        location.reload();
    });

});