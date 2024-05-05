const progress = $(".progress-input");
const playlist = $(".play-list");
const heading = $(".song-name");
const cdThumb = $(".cd-thumb__img");
const cd = $(".cd");
const playBtn = $(".play-btn");
const audio = $(".audio");
const nextBtn = $(".next-btn");
const prBtn = $(".previous-btn");
const repeatBtn = $(".repeat-btn");
const shuffleBtn = $(".shuffle-btn");

const app = {
    isPlaying: false,
    isRepeating: false,
    isShuffling: false,
    shuffledList: [],
    playlist: [],
    currentIndex: 0,
    songs: [
        {
            name: "Cho tôi lang thang",
            singer: "Đen Vâu",
            path: "./assets/music/chotoilangthang.mp3",
            image: "/assets/img/chotoilangthang.jpg",
        },
        {
            name: "She neva know",
            singer: "JusterTee",
            path: "./assets/music/shenevaknow.mp3",
            image: "./assets/img/shenevaknow.jpg",
        },
        {
            name: "2AM",
            singer: "JusterTee",
            path: "./assets/music/2am.mp3",
            image: "./assets/img/2am.jpg",
        },
        {
            name: "Xin anh đừng",
            singer: "JusterTee",
            path: "./assets/music/xinanhdung.mp3",
            image: "./assets/img/xinanhdung.jpg",
        },
        {
            name: "Phía sau em",
            singer: "Kay Trần ft. Binz",
            path: "./assets/music/phiasauem.mp3",
            image: "./assets/img/phiasauem.jpg",
        },
        {
            name: "Loving You Sunny",
            singer: "Kimmese ft. Đen ",
            path: "./assets/music/loving.mp3",
            image: "./assets/img/loving.jpg",
        },
        {
            name: "CHO MÌNH EM",
            singer: "BINZ x ĐEN",
            path: "./assets/music/chominhem.mp3",
            image: "./assets/img/chominhem.jpg",
        },
    ],
    player(isPlaying) {
        if (isPlaying) {
            audio.play();
            playBtn.classList.add("playing");
        } else {
            audio.pause();
            playBtn.classList.remove("playing");
        }
    },
    setPlaylist(songs) {
        this.playlist = songs;
    },
    getCurrentSong() {
        return this.playlist[this.currentIndex];
    },
    defineProperties() {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.playlist[this.currentIndex];
            },
        });
    },
    loadCurrentSong() {
        const currentSong = this.getCurrentSong();

        heading.innerText = currentSong.name;
        cdThumb.attributes.src.value = currentSong.image;
        audio.attributes.src.value = currentSong.path;
    },
    render() {
        const htmls = this.playlist.map((song, index) => {
            return `
            <div class="song" onclick="songClickHandle(${index})"  >
                <div class="song-thumb">
                    <img
                        src="${song.image}"
                        alt=""
                        class="song-thumb__img"
                    />
                </div>
                <div class="song-body">
                    <h3 class="song__title">${song.name}</h3>
                    <p class="song__author">${song.singer}</p>
                </div>
                <div class="song-option">
                    <img
                        src="./assets/icon/3dots.svg"
                        alt=""
                        class="song-option__icon"
                    />
                </div>
            </div>  
            
            `;
        });

        playlist.innerHTML = htmls.join("");
    },
    handleEvents() {
        const cdWidth = cd.offsetWidth;
        function progressChangeHandle(progress) {
            const value = progress.value;
            const max = progress.max;
            const percent = (value / max) * 100;
            progress.style.setProperty("--progress", percent + "%");
        }

        progress.addEventListener("input", (e) => {
            progressChangeHandle(e.target);
            const value = progress.value;
            const max = progress.max;
            const percent = value / max;

            audio.currentTime = percent * audio.duration;
        });

        document.addEventListener("scroll", () => {
            const scrollTop = window.scrollY;
            const newCdWidth = cdWidth - scrollTop;

            if (newCdWidth <= 0) {
                cd.style.width = "0px";
            } else {
                cd.style.width = newCdWidth + "px";
            }

            cd.style.opacity = newCdWidth / cdWidth;
        });

        playBtn.addEventListener("click", () => {
            if (this.isPlaying) {
                this.player(false);
                this.isPlaying = false;
            } else {
                this.player(true);
                this.isPlaying = true;
            }
        });

        audio.addEventListener("timeupdate", function (e) {
            if (audio.currentTime !== 0) {
                progress.value =
                    (audio.currentTime / audio.duration) * progress.max;

                progressChangeHandle(progress);
            }
        });

        audio.addEventListener("ended", (e) => {
            if (!this.isRepeating) {
                nextBtn.dispatchEvent(new Event("click"));
            } else {
                audio.currentTime = 0;
                audio.play();
            }
        });

        nextBtn.addEventListener("click", () => {
            if (this.currentIndex == this.songs.length - 1) {
                this.currentIndex = 0;
                this.loadCurrentSong();
                this.player(this.isPlaying);
            } else {
                this.currentIndex += 1;
                this.loadCurrentSong();
                this.player(this.isPlaying);
            }
        });

        prBtn.addEventListener("click", () => {
            if (this.currentIndex == 0) {
                this.loadCurrentSong();
                this.player(this.isPlaying);
            } else {
                this.currentIndex -= 1;
                this.loadCurrentSong();
                this.player(this.isPlaying);
            }
        });

        repeatBtn.addEventListener("click", () => {
            if (this.isRepeating) {
                this.isRepeating = false;
                repeatBtn.classList.remove("repeating");
            } else {
                this.isRepeating = true;
                repeatBtn.classList.add("repeating");
            }
        });

        shuffleBtn.addEventListener("click", () => {
            if (this.isShuffling) {
                let currentSong = this.getCurrentSong();
                let index = this.songs.indexOf(currentSong);
                this.currentIndex = index;

                this.isShuffling = false;
                shuffleBtn.classList.remove("shuffling");
                this.setPlaylist(this.songs);

                this.player(this.isPlaying);
                this.render();
            } else {
                this.isShuffling = true;
                this.currentIndex = 0;
                shuffleBtn.classList.add("shuffling");
                this.shuffledList = shuffle(this.songs);
                this.setPlaylist(this.shuffledList);
                this.loadCurrentSong();
                this.player(this.isPlaying);
                this.render();
            }
        });
    },
    start() {
        this.setPlaylist(this.songs);
        this.render();
        this.handleEvents();
        this.defineProperties();
        this.loadCurrentSong();
    },
};

app.start();

function shuffle(arr) {
    const arrLength = arr.length;
    let tempArr = arr;
    let result = [];

    for (let i = arrLength - 1; i >= 0; i--) {
        let randomIndex = Math.floor(Math.random() * i);
        result.push(tempArr[randomIndex]);
        tempArr = tempArr.filter((e, index) => {
            return index !== randomIndex;
        });
    }

    return result;
}

function songClickHandle(index) {
    app.isPlaying = true;
    app.currentIndex = index;
    app.loadCurrentSong();
    app.player(app.isPlaying);
}