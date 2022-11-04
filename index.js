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

// Given artist ID return 6 key attributes 
app.get('/api/artists/:artist_id' , (req, res) => {
    const id = req.params.artist_id;
    console.log(`GET request for ${req.url}`);
    const artist = artistsArr.find(p => parseInt(p.artist_id) === parseInt(id));

    if(artist){
        res.send({name: artist.artist_name, year: artist.artist_active_year_begin,date: artist.artist_date_created, favourites: artist.artist_favorites, tags: artist.tags,handle: artist.artist_handle});
    }
    else{
        res.status(404).send(`Artist ${id} was not found!`)
       
    }
    
});



app.get('/genre',(req,res) => {
    res.send(genreArr);
}); 

app.listen(port,() => {
    console.log(`Listening on port ${port}`);   
});


