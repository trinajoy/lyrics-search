const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
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
      <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">  Get Lyrics </button>
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
async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");

  result.innerHTML = `
  <h2> <strong>  ${artist} </strong>  - ${songTitle} </h2>
  <span> ${lyrics} </span>
  `;

  more.innerHTML = "";
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
    const songTitle = clickedEl.getAttribute("data-songTitle");
    console.log(artist);
    console.log(songTitle);

    getLyrics(artist, songTitle);
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