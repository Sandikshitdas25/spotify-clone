console.log('play my fav songs');

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


let currSong = new Audio();
let songs;
let currFolder;
async function getSongs(folder) {
    currFolder = folder;
    let a = fetch(`/songs/${currFolder}/`)
    let response = await (await a).text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            let x = element.href.split(`/${currFolder}/`)[1]
            let y = x.split(".mp3")[0]
            songs.push(y)
        }

    }

    //Puttling all the songs in a list
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (let index = 0; index < songs.length; index++) {
        const element = songs[index];
        songUL.innerHTML = songUL.innerHTML + `<li>
                            
                            <div class="info">
                                <img class="invert" width="34" src="img/music.svg" alt="">
                                <div class="song"> ${element.replaceAll("%20", " ")}</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div> </li>`;

    }

    //When the song will be clicked it will start playing
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".song").innerHTML.trim())
            document.querySelector(".left").style.left = "-130%";
        })
    })

    return songs
}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track + ".mp3")
    document.querySelector(".playbar").style.opacity = 1;
    currSong.src = `/songs/${currFolder}/` + track + ".mp3"
    if (!pause) {
        currSong.play()
        play.src = "img/pause.svg"
    }

    document.querySelector(".songname").innerHTML = decodeURI(track)
    document.querySelector(".time").innerHTML = "00.00/00.00"
}

async function displayalbums() {
    let a = fetch(`/songs/`)
    let response = await (await a).text()
    let div = document.createElement("div")
    div.innerHTML = response
    let anchor = div.getElementsByTagName("a")
    for (let index = 0; index < anchor.length; index++) {
        const element = anchor[index];
        if (element.href.includes("/songs/") && !element.href.includes(".htaccess")) {
            let folder = element.href.split("/songs/")[1].split("/")[0]
            let a = fetch(`/songs/${folder}/info.json`)
            let response = await (await a).json()
            let cardcontainer = document.querySelector(".cardcontainer") 
            cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}" class="card border"> 
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="black">
                                <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img src="songs/${folder}/cover.jpg">
                        <h2>${response.title}</h2>
                    </div>`

        }

    }


    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            await getSongs(item.currentTarget.dataset.folder)
            document.querySelector(".left").style.left = "0%";
        })
    })

}
async function main() {
    await getSongs('')

    displayalbums()


    // playMusic(songs[0], true)



    //when the song is paused it will be played or paused when playing
    play.addEventListener("click", () => {
        if (currSong.paused) {
            currSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currSong.pause()
            play.src = "img/play.svg"
        }
    })

    //the duration and time 
    currSong.addEventListener("timeupdate", () => {
        document.querySelector(".time").innerHTML = `${secondsToMinutesSeconds(currSong.currentTime)}/${secondsToMinutesSeconds(currSong.duration)}`
        document.querySelector(".circle").style.left = (currSong.currentTime / currSong.duration) * 100 + "%"
    })


    //adding an event listener to seekbar (to go to the back and forth of the song)
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width)
        document.querySelector(".circle").style.left = (percent) * 100 + "%"
        currSong.currentTime = (currSong.duration * percent)
    })

    //adding an eventlistener to hamburgericon
    document.querySelector(".hamburgericon").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0%";
    })

    //adding an eventlistener to close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-130%";
    })

    //adding an eventlistener to previous
    previous.addEventListener("click", () => {
        // let index = songs.indexof(currSong.src.split("songs/")[1])
        let index = songs.indexOf(currSong.src.split(`/${currFolder}/`)[1].split(".mp3").slice(0, 1)[0])
        if (index >= 0) {
            playMusic(songs[index - 1])
        }
        else {
            playMusic(songs[0])
        }
    })

    //adding an eventlistener to next
    next.addEventListener("click", () => {
        // let index = songs.indexof(currSong.src.split("songs/")[1])
        let index = songs.indexOf(currSong.src.split(`/${currFolder}/`)[1].split(".mp3").slice(0, 1)[0])

        if (index < songs.length) {
            playMusic(songs[index + 1])
        }
        else {
            playMusic(songs[0])
        }
    })

    //adding an eventlistener to volume
    document.querySelector(".timevol").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currSong.volume = e.target.value / 100
    })

    //adding an eventlistener to show album songs
    
}
main()