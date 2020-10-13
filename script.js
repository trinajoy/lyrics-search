const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const preview = document.getElementById("preview");
const more = document.getElementById("more");

const apiURL = "https://api.lyrics.ovh";

// Search by song or artist
async function searchSongs(term) {
  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();
  console.log(data);

  showData(data);
}

// show song and artist in DOM - join
function showData(data) {
  result.innerHTML = `

  <ul class="songs">
  ${data.data
    .map(
      (song) =>
        `
      <li>
      <span> <strong>  ${song.artist.name} </strong>  - ${song.title} </span>
      <button class="btn" 
        data-artist="${song.artist.name}" 
        data-song-title="${song.title}" 
        data-album-title="${song.album.title}" 
        data-album-img="${song.album.cover_medium}" 
        data-artist-img="${song.artist.picture_medium}"  
        data-song-audio="${song.preview}">  
      Lyrics </button>
      </li>
      `
    )
    .join("")}
  </ul>
  `;

  if (data.prev || data.next) {
    more.innerHTML = `
    
    ${
      data.prev
        ? `<button class="btn" onclick="getMoreSongs('${data.prev}')"> prev </button>`
        : ""
    }
    ${
      data.next
        ? `<button class="btn" onclick="getMoreSongs('${data.next}')"> next </button>`
        : ""
    }
    `;
  } else {
    more.innerHTML = "";
  }
}

// get prev and next songs
async function getMoreSongs(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();

  showData(data);
}

// get lyrics button click
async function getLyrics(
  artist,
  songTitle,
  albumTitle,
  albumImg,
  artistImg,
  audio
) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);

  console.log(res, "url....");
  const data = await res.json();
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");

  result.classList.add("lyrics");

  result.innerHTML = `
  <div class="preview-container">

    <div class="song-wrapper">

      <div class="preview-header">
        <img class="artist" src="${artistImg}" alt="artist">  
          <div class="copy">
            <h2> <strong>  '${songTitle}' </strong>  </h2>
            <p>  <em> ${artist} </em> </p>
          </div> 
      </div>

      <div class="preview-music">
        <audio controls>
          <source src="${audio}" type="audio/mpeg">
              Your browser does not support the audio element.
        </audio>
      </div>
     
      <div class="preview-lyrics" id="preview-lyrics">
        <span> ${lyrics} </span>
      </div>
    </div>

    <div class="preview-album">
      <img class="album" src="${albumImg}" alt="album">  
      <p> Album - ${albumTitle}   </p>
    </div>

  </div>

  `;

  more.innerHTML = "";

  const temp = document.getElementById("preview-lyrics");

  if (!lyrics) {
    temp.innerHTML = `
    <p>    <i class="fas fa-exclamation-circle"> </i> lyrics not available  </p>
    `;
  }
}

// Event listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value.trim();

  if (!searchTerm) {
    alert("no search term entered");
  } else {
    searchSongs(searchTerm);
  }
});

result.addEventListener("click", (e) => {
  const clickedEl = e.target;

  if (clickedEl.tagName === "BUTTON") {
    const artist = clickedEl.getAttribute("data-artist");
    const songTitle = clickedEl.getAttribute("data-song-title");
    const albumTitle = clickedEl.getAttribute("data-album-title");
    const albumImg = clickedEl.getAttribute("data-album-img");
    const artistImg = clickedEl.getAttribute("data-artist-img");
    const songAudio = clickedEl.getAttribute("data-song-audio");
    console.log(artist);
    console.log(songTitle);

    getLyrics(artist, songTitle, albumTitle, albumImg, artistImg, songAudio);
  }
});

/*  PROJECT NOTES

searchSongs() option 2 - chain with promises

  function searchSongs(term) {
    fetch(`${apiURL}/suggest/${term}`).then((res) =>
      res.json().then((data) => console.log(data))
    );
  }

//////////


showData() option 2  - process data in forEach, then add to innerHTML

function showData(data) {
  let output = "";

  data.data.forEach((song) => {
    output += `
    
    <li>
    <span> <strong>  ${song.artist.name} </strong>  - ${song.title} </span>
    <button class="btn" data-artist="${song.artist.name}}" data-songtitle="${song.title}">  Get Lyrics </button>
    </li>
    `;
  });

  result.innerHTML = `
  <ul class="songs"> 
  ${output}
  </ul>
  
  `;
}

//////


 showData() - ternary operator - short hand (if else) statement  

- if 'prev' or 'next' property exists in data
  
      if = ?
      else = : 

      if( data.next) {
      display 'pagination button'

      } else {
        display 'nothing'
      }

*/
