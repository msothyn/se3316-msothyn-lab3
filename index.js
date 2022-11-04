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
        res.status(404).send(`Artist ${id} was not found!`)

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
    if(matchedArr.length >= 1){
         res.send(matchedArr);
    }
    else{
        res.status(404).send(`Track Id ${title} was not found!`);
    }

});

//Get all available genre names, IDs and parent IDs. 
app.get('/genre',(req,res)=>{
    let matchedGenreArr = [];

    for (let i = 0; i < genreArr.length; i++){
        matchedGenreArr.push({genreID: genreArr[i].genre_id, parent: genreArr[i].parent, title: genreArr[i].title});  
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
            matchedArtistArr.push({ artistId: artistsArr[i].artist_id})
        }
    }
    if(matchedArtistArr.length >= 1){
         res.send(matchedArtistArr);
    }
    else{
        res.status(404).send(`Artist ID for artist name ${artistName} was not found!`);
    }

});







app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


