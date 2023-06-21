document.addEventListener('DOMContentLoaded', function() {
    var watchedEl = document.getElementById("watched");
    var localWatched = JSON.parse(localStorage.getItem("savedWatched"));
  
    console.log("localWatched:", localWatched);
  
    if (localWatched && localWatched.length !== 0) {
      for (var i = 0; i < localWatched.length; i++) {
        var card = document.createElement('div');
        card.className = "card";
        card.innerHTML = `
          <input type="image" src=${localWatched[i]?.Poster} class="listPoster" id="${localWatched[i]?.Title}" value=${i}>
          <button class="watchAgainBtn">Watch Again</button>
        `;
        watchedEl.appendChild(card);
      }
    } else {
      watchedEl.innerHTML = `
        <h2>Nothing to See</h2>
        <h4>You haven't added anything to your watched yet. Search some movies you've watched and save them here.</h4>
      `;
    }
  
    $(".listPoster").click(function(event) {
      event.preventDefault();
      console.log(localWatched);
      var selectedMovie = $(this).val();
      console.log(selectedMovie);
      var selectedMovieData = {
        Title: localWatched[selectedMovie]?.Title,
        Poster: localWatched[selectedMovie]?.Poster,
        Rated: localWatched[selectedMovie]?.Rated,
        Actors: localWatched[selectedMovie]?.Actors,
        Ratings: localWatched[selectedMovie]?.Ratings,
        Plot: localWatched[selectedMovie]?.Plot,
        imdbID: localWatched[selectedMovie]?.imdbID,
        imdbId: localWatched[selectedMovie]?.imdbId,
        Year: localWatched[selectedMovie]?.Year,
        val: selectedMovie
      };
      console.log(selectedMovieData);
      localStorage.setItem("selectedMovie", JSON.stringify(selectedMovieData));
      document.location.href = "movie.html";
    });
  
    $(document).on("click", ".watchAgainBtn", function(event) {
      event.preventDefault();
      var selectedIndex = $(this).prev('.listPoster').attr('value');
      var selectedMovie = localWatched[selectedIndex];
  
      // Remove from watched list
      localWatched.splice(selectedIndex, 1);
      localStorage.setItem("savedWatched", JSON.stringify(localWatched));
  
      // Add to watchlist
      var savedWatchlist = JSON.parse(localStorage.getItem("savedWatchlist")) || [];
      savedWatchlist.push(selectedMovie);
      localStorage.setItem("savedWatchlist", JSON.stringify(savedWatchlist));
  
      // Refresh the page
      location.reload();
    });
  
    $(".addWatchedBtn").click(function(event) {
      event.preventDefault();
  
      // Get the new movie details
      var newMovie = {
        Title: "New Movie Title",
        Poster: "path/to/poster.jpg",
        Rated: "PG",
        Actors: ["Actor 1", "Actor 2"],
        Ratings: [{ Source: "Source 1", Value: "Value 1" }],
        Plot: "Plot description",
        imdbID: "tt1234567",
        imdbId: "tt1234567",
        Year: "2023",
        val: localWatched.length
      };
  
      // Add to localWatched array
      localWatched.push(newMovie);
      localStorage.setItem("savedWatched", JSON.stringify(localWatched));
  
      // Create a new card for the new movie
      var card = document.createElement('div');
      card.className = "card";
      card.innerHTML = `
        <input type="image" src=${newMovie?.Poster} class="listPoster" id="${newMovie?.Title}" value=${localWatched.length - 1}>
        <button class="watchAgainBtn">Watch Again</button>
      `;
  
      // Append the card to the watched tab
      watchedEl.appendChild(card);
    });
  });
  
  
