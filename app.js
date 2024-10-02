document.addEventListener("DOMContentLoaded", () => {
  const movieListElement = document.getElementById("movie-list");
  const filterInput = document.getElementById("filter-input");
  const favoritesListElement = document.getElementById("favorites-list");
  const loadingElement = document.getElementById("loading");
  
  const popularBtn = document.getElementById("popular-btn");
  const novidadesBtn = document.getElementById("novidades-btn");
  const topRatedBtn = document.getElementById("top-rated-btn");

  let movies = [];
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  let page = 1;
  let isLoading = false;

  const API_KEY = 'eb1e3135766801ae5047924e5990c5cc';
  const BASE_API_URL = 'https://api.themoviedb.org/3/movie/';
  const POPULAR_URL = `${BASE_API_URL}popular?api_key=${API_KEY}&page=`;
  const NOVELTIES_URL = `${BASE_API_URL}now_playing?api_key=${API_KEY}&page=`;
  const TOP_RATED_URL = `${BASE_API_URL}top_rated?api_key=${API_KEY}&page=`;

  // Função para obter dados da API
  async function fetchMovies(url, page = 1) {
    try {
      isLoading = true;
      loadingElement.classList.remove("hidden");

      const response = await fetch(`${url}${page}`);
      if (!response.ok) throw new Error("Erro ao buscar dados da API");

      const data = await response.json();
      movies = [...data.results];
      displayMovies(movies);

      isLoading = false;
      loadingElement.classList.add("hidden");
    } catch (error) {
      console.error("Error fetching movies:", error);
      isLoading = false;
      loadingElement.classList.add("hidden");
    }
  }

  // Função para exibir filmes
  function displayMovies(movieData) {
    movieListElement.innerHTML = "";
    movieData.forEach(movie => {
      const movieItem = document.createElement("div");
      movieItem.classList.add("movie-item");
      movieItem.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
        <h2>${movie.title}</h2>
        <button class="favorite-btn">Adicionar aos Favoritos</button>
      `;
      
      movieItem.querySelector(".favorite-btn").addEventListener("click", () => toggleFavorite(movie));
      movieItem.addEventListener("click", () => showMovieDetails(movie));
      movieListElement.appendChild(movieItem);
    });
  }

  // Função de filtragem com base no título usando filter e map
  filterInput.addEventListener("input", (e) => {
    const filteredMovies = movies.filter(movie => 
      movie.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    displayMovies(filteredMovies);
  });

  // Exibir detalhes do filme
  function showMovieDetails(movie) {
    alert(`Title: ${movie.title}\nOverview: ${movie.overview}`);
  }

  // Carregar favoritos do localStorage
  function loadFavorites() {
    favoritesListElement.innerHTML = "";
    favorites.forEach(favorite => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${favorite.title}
        <button class="remove-btn">Remover</button>
      `;
      li.querySelector(".remove-btn").addEventListener("click", () => removeFavorite(favorite));
      favoritesListElement.appendChild(li);
    });
  }

  // Adicionar ou remover filme dos favoritos
  function toggleFavorite(movie) {
    if (favorites.some(fav => fav.id === movie.id)) {
      removeFavorite(movie);
    } else {
      favorites.push(movie);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      loadFavorites();
    }
  }

  // Remover filme dos favoritos
  function removeFavorite(movie) {
    favorites = favorites.filter(fav => fav.id !== movie.id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadFavorites();
  }

  // Scroll infinito
  window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && !isLoading) {
      page++;
      fetchMovies(POPULAR_URL, page);
    }
  });

  // Funções de troca de categorias
  popularBtn.addEventListener("click", () => fetchMovies(POPULAR_URL));
  novidadesBtn.addEventListener("click", () => fetchMovies(NOVELTIES_URL));
  topRatedBtn.addEventListener("click", () => fetchMovies(TOP_RATED_URL));

  // Inicialização
  fetchMovies(POPULAR_URL);
  loadFavorites();
});

