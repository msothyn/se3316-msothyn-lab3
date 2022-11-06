const express = require('express');
const app = express();
const port = 3000;

// Import fs and csv-parse 
const fs = require("fs");
const { parse } = require("csv-parse");

// Create 
const albumArr = [];
const genreArr = [];
const artistsArr = [];
const tracksArr = [];
const listArr = [];


// Parse albums
fs.createReadStream("./lab3-data/raw_albums.csv")
    .pipe(
        parse({
            delimiter: ",",
            columns: true,
            ltrim: true,
        })
    )
    .on("data", function (row) {
        // push the object row into the array
        albumArr.push(row);
    })
    .on("error", function (error) {
        console.log(error.message);
    });


// Parse artists
fs.createReadStream("./lab3-data/raw_artists.csv")
    .pipe(
        parse({
            delimiter: ",",
            columns: true,
            ltrim: true,
        })
    )
    .on("data", function (row) {
        // push the object row into the array
        artistsArr.push(row);
    })
    .on("error", function (error) {
        console.log(error.message);
    });


// Parse tracks
fs.createReadStream("./lab3-data/raw_tracks.csv")
    .pipe(
        parse({
            delimiter: ",",
            columns: true,
            ltrim: true,
        })
    )
    .on("data", function (row) {
        // push the object row into the array
        tracksArr.push(row);
    })
    .on("error", function (error) {
        console.log(error.message);
    });



// Parse genres
fs.createReadStream("./lab3-data/genres.csv")
    .pipe(
        parse({
            delimiter: ",",
            columns: true,
            ltrim: true,
        })
    )
    .on("data", function (row) {
        // push the object row into the array
        genreArr.push(row);
    })
    .on("error", function (error) {
        console.log(error.message);
    });



// Setup serving front end code 
app.use('/', express.static('static'));
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`)
    next()
})

//Parse data & body as json 
app.use(express.json());

// Given artist ID return 6 key attributes 
app.get('/api/artists/:artist_id', (req, res) => {
    const id = req.params.artist_id;
    const artist = artistsArr.find(p => parseInt(p.artist_id) === parseInt(id));

    if (artist) {
        res.send({ name: artist.artist_name, year: artist.artist_active_year_begin, date: artist.artist_date_created, favourites: artist.artist_favorites, tags: artist.tags, handle: artist.artist_handle });
    }
    else {
        res.status(404).send(`Artist ${id} was not found!`)

    }

});

//album_id, album_title, artist_id, artist_name, tags, track_date_created, track_date_recorded, track_duration, track_genres, track_number, track_title 
app.get('/api/tracks/:track_id', (req, res) => {
    const id = req.params.track_id;
    const track = tracksArr.find(p => parseInt(p.track_id) === parseInt(id));

    if (track) {
        res.send({ albumId: track.album_id, title: track.album_title, artistId: track.artist_id, artistName: track.artist_name, tags: track.tags, trackDateCreated: track.track_date_created, trackDuration: track.track_duration, trackGenre: track.track_genres, trackNumber: track.track_number, trackTitle: track.track_title });
    }
    else {
        res.status(404).send(`Track ${id} was not found!`)

    }

});

//Get the first n number of matching track IDs for a given search pattern matching the track title or album. 
//If the number of matches is less than n, then return all matches. 
app.get('/api/trackTitle/:track_name', (req, res) => {
    const title = req.params.track_name;
    let n = 0;
    let matchedArr = [];

    for (let i = 0; i < tracksArr.length; i++) {
        const trackName = tracksArr[i].track_title.toLowerCase();
        const albumName = tracksArr[i].album_title.toLowerCase();

        if (trackName.match(title.toLowerCase()) || albumName.match(title.toLowerCase())) {
            matchedArr.push({ trackId: tracksArr[i].track_id })
            n++;
        }

        if (n == 5) {
            break;
        }
    }
    if (matchedArr.length >= 1) {
        res.send(matchedArr);
    }
    else {
        res.status(404).send(`Track Id ${title} was not found!`);
    }

});

//Get all available genre names, IDs and parent IDs. 
app.get('/genre', (req, res) => {
    let matchedGenreArr = [];

   
    for (let i = 0; i < genreArr.length; i++) {
        matchedGenreArr.push({ genreID: genreArr[i].genre_id, parent: genreArr[i].parent, title: genreArr[i].title });
    }
    res.send(matchedGenreArr);

});

// Get all the matching artist IDs for a given search pattern matching the artist's name.
app.get('/api/artistID/:test', (req, res) => {
    const artistName = req.params.test;
    let matchedArtistArr = [];
 
    for (let i = 0; i < artistsArr.length; i++) {
        let artist = artistsArr[i].artist_name.toLowerCase();
        if (artist.match(artistName.toLowerCase())) {
            matchedArtistArr.push({ artistId: artistsArr[i].artist_id })
        }
    }
    if (matchedArtistArr.length >= 1) {
        res.send(matchedArtistArr);
    }
    else {
        res.status(404).send(`Artist ID for artist name ${artistName} was not found!`);
    }

});

// Create a new list to save a list of tracks with a given list name. Return an error if name exists. 
app.put('/api/newList/:lName', (req, res) => {
    const newList = req.params.lName;
    const list = listArr.findIndex(p => p.newList === newList)

    if (list < 0) {
        listArr.push({ newList: newList });
        res.send(listArr);
    }
    else {
        res.status(404).send(`The list ${newList} already exists!`);
    }
});

// step 7
app.put('/api/list/:listName', (req, res) => {
    const playlistName = req.params.listName;
    const addTrack = req.body;
    let addTrack2 = addTrack.tracks.split(",");

    
    for (let n = 0; n < addTrack2.length; n++) {
        if (tracksArr.findIndex(p => p.track_id === addTrack2[n]) == -1) {
            addTrack2.splice(n, 1);
        }
    }

    if (listArr.findIndex(p => p.newList.toLowerCase() == playlistName.toLowerCase()) >= 0) {
        const playlist = listArr.findIndex(p => p.newList.toLowerCase() == playlistName.toLowerCase());
        listArr[playlist].tracks = addTrack2;
        res.send(listArr[playlist]);
    }
    else {
        res.status(404).send(`The playlist ${playlistName} does not exist!`);
    }
});

// step 8
app.get('/api/list/:playlistName', (req, res) => {
    const name = req.params.playlistName;
    const tracklist = [];
    if (listArr.findIndex(p => p.newList.toLowerCase() == name.toLowerCase()) >= 0) {
        const playlist = listArr.findIndex(p => p.newList.toLowerCase() == name.toLowerCase());
        tracklist.push(listArr[playlist]);
        res.send(tracklist)
    }
    else {
        res.status(404).send(`The playlist ${name} does not exist!`);
    }

})

// Delete a list of tracks with a given name. Return an error if the given list doesn’t exist. [5 points] → delete
app.delete('/api/deleteList/:playlistName', (req, res) => {
    const name = req.params.playlistName;

    if (listArr.findIndex(p => p.newList.toLowerCase() == name.toLowerCase()) >= 0) {
        const playlist = listArr.findIndex(p => p.newList.toLowerCase() == name.toLowerCase());
        listArr.splice(playlist, 1);
        res.send(`The playlist ${name} has been deleted!`);
    }

    else {
        res.status(404).send(`The playlist ${name} does not exist!`);
    }

})

//Get a list of list names, number of tracks that are saved in each list and the total play time of each list
app.get('/api/getPlaylist', (req, res) => {
    let allPlaylistArr = [];
    const tracklist = [];
    let duration = 0;
    let finalDur = 0;
    let minutes = 0;
    let seconds = 0;
    let dur = 0;
    let numOfTracks = 0;


    for (let i = 0; i < listArr.length; i++) {
        tracklist.push(listArr[i]);

        if (listArr[i].tracks != undefined) {
            for (let n = 0; n < listArr[i].tracks.length; n++) {
                let track = tracksArr.find(p => p.track_id == listArr[i].tracks[n]);
                numOfTracks = listArr[i].tracks.length;
                if (track) {
                    console.log(track.track_duration)
                    duration = track.track_duration;
                    let splitDur = duration.split(":");
                    let durSec = (+splitDur[0]) * 60 + (+splitDur[1]);
                    dur += durSec;
                    minutes = Math.floor(dur / 60);
                    seconds = dur - minutes * 60;
                    finalDur = minutes + ":" + seconds;

                }
            }
        }
        else {
            numOfTracks = 0;
            finalDur = "00:00";
        }
        allPlaylistArr.push({ playlistName: listArr[i].newList, numberOfTracks: numOfTracks, duration: finalDur });

    }
    res.send(allPlaylistArr);
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


