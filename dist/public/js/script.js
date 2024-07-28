// APlayer
const aplayer = document.querySelector("#aplayer");
if (aplayer) {
  let dataSong = aplayer.getAttribute("data-song");
  dataSong = JSON.parse(dataSong);
  console.log(dataSong);
  let dataSinger = aplayer.getAttribute("data-singer");
  dataSinger = JSON.parse(dataSinger);

  const ap = new APlayer({
    container: aplayer,
    lrcType: 1,
    audio: [
      {
        name: dataSong.title,
        artist: dataSinger.fullName,
        url: dataSong.audio,
        cover: dataSong.avatar,
        lrc: `${dataSong.lyrics}`,
      },
    ],
    autoplay: true,
  });

  const avatar = document.querySelector(".singer-detail .inner-avatar");
  // lắng nghe sự kiện play

  ap.on("play", function () {
    avatar.style.animationPlayState = "running";
  });
  // lắng nghe sự kiện dừng
  ap.on("pause", function () {
    avatar.style.animationPlayState = "paused";
  });
  ap.on("ended", function () {
    fetch(`/songs/listen/${dataSong._id}`, {
      method: "PATCH",
    })
      .then((res) => res.json())
      .then((data) => {
        const elementListenSpan = document.querySelector(
          ".singer-detail .inner-actions span"
        );
        elementListenSpan.innerHTML = `${data.listen}`;
      });
  });
}
// End APlayer

// Button Like
const buttonLike = document.querySelector("[button-like]");
if (buttonLike) {
  buttonLike.addEventListener("click", () => {
    const idSong = buttonLike.getAttribute("button-like");
    const isActive = buttonLike.classList.contains("active");
    const typeLike = isActive ? "dislike" : "like";
    const link = `/songs/like/${typeLike}/${idSong}`;

    const option = {
      method: "PATCH",
    };
    fetch(link, option)
      .then((res) => res.json())
      .then((data) => {
        if (data.code == 200) {
          const span = buttonLike.querySelector(".inner-number");
          span.innerHTML = `${data.like}`;
          buttonLike.classList.toggle("active");
        }
      });
  });
}
// END Button Like

// Button Favorite
const listbuttonFavorite = document.querySelectorAll("[button-favorite]");
if (listbuttonFavorite.length > 0) {
  listbuttonFavorite.forEach((buttonFavorite) => {
    buttonFavorite.addEventListener("click", () => {
      const idSong = buttonFavorite.getAttribute("button-favorite");
      const isActive = buttonFavorite.classList.contains("active");

      const typeFavorite = isActive ? "unfavorite" : "favorite";

      const link = `/songs/favorite/${typeFavorite}/${idSong}`;

      const option = {
        method: "PATCH",
      };
      fetch(link, option)
        .then((res) => res.json())
        .then((data) => {
          if (data.code == 200) {
            buttonFavorite.classList.toggle("active");
          }
        });
    });
  });
}
// END Button Favorite

// Search Suggest
const boxSearch = document.querySelector(".box-search");
if (boxSearch) {
  const input = boxSearch.querySelector("input[name='keyword']");
  const boxSuggest = boxSearch.querySelector(".inner-suggest");
  const boxList = boxSearch.querySelector(".inner-list");
  input.addEventListener("keyup", () => {
    const keyword = input.value;
    console.log(keyword);
    const link = `/search/suggest?keyword=${keyword}`;

    fetch(link)
      .then((res) => res.json())
      .then((data) => {
        const songs = data.songs;
        if (songs.length > 0) {
          const htmlsArray = songs.map(
            (item) => `
            <a class="inner-item" href="/songs/detail/${item.slug}">
              <div class="inner-image">
                <img src="${item.avatar}">
              </div>
              <div class="inner-info">
                <div class="inner-title">${item.title}</div>
                <div class="inner-singer">
                  <i class="fa-solid fa-microphone-lines"></i> ${item.singer.fullName}
                </div>
              </div>
            </a>
          `
          );
          boxList.innerHTML = htmlsArray.join("");
          boxSuggest.classList.add("show");
        } else {
          boxList.innerHTML = "";
          boxSuggest.classList.remove("show");
        }
      });
  });
}
// END Search Suggest
