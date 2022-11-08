document.getElementById('artist-name').addEventListener('click', getArtistId);
document.getElementById('trackAlbum').addEventListener('click', getTrackId);
document.getElementById('playlist').addEventListener('click', createPlaylist);
document.getElementById('deletePlaylist').addEventListener('click', deletePlaylist);
document.getElementById('add').addEventListener('click', addTracks);

getGenres()
displayPlaylists()
showPlaylistTracks()

function removeChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function getGenres(){
    let path = "/genre"

    fetch(path)
    .then(res => {
        res.json()
        .then(data => {
            const l = document.getElementById('genres');
            data.forEach(e => {
                const genreName = document.createElement('li')
                genreName.appendChild(document.createTextNode(e.title))
                l.appendChild(genreName)
            })
        })
    })
}

function getArtistId() {
    removeChildren(document.getElementById("artist-list"));
    let path = "/api/artistID/";
    path += document.getElementById("artistSearch").value;

    fetch(path)
        .then(res => {
            if (res.ok) {
                document.getElementById('artist-status').innerText = ""
                res.json()
                    .then(data => {
                        data.forEach(e => {
                            getArtistName(e.artistId);
                        });
                    })
            }
            else {
                document.getElementById('artist-status').innerText = "Artist name not found! Please try again."
            }
        })

}

function getArtistName(artistId) {
    let path = "/api/artists/";
    path += artistId;

    fetch(path)
        .then(res => {
            res.json()
                .then(data => {
                    const l = document.getElementById('artist-list');
                    const name = document.createElement('li');
                    name.appendChild(document.createTextNode(`${data.name}`))
                    l.appendChild(name);
                })
        })
}

function getTrackId() {
    removeChildren(document.getElementById("track-list"));
    let path = "/api/trackTitle/";
    path += document.getElementById("trackSearch").value;

    fetch(path)
        .then(res => {
            if (res.ok) {
                document.getElementById('track-status').innerText = ""
                res.json()
                    .then(data => {
                        data.forEach(e => {
                            getTrackInfo(e.trackId);
                        });
                    })
            }
            else {
                document.getElementById('track-status').innerText = "Track name or album name not found! Please try again."
            }
        })

}

function getTrackInfo(trackId) {
    let path = "/api/tracks/";
    path += trackId;

    fetch(path)
        .then(res => {
            res.json()
                .then(data => {
                    const l = document.getElementById('track-list');
                    const list1 = document.createElement('li');
                    const list2 = document.createElement('li');
                    const list3 = document.createElement('li');
                    const list4 = document.createElement('li');
                    list1.appendChild(document.createTextNode(`${data.artistName}`))
                    list2.appendChild(document.createTextNode(`${data.trackTitle}`))
                    list3.appendChild(document.createTextNode(`${data.title}`))
                    list4.appendChild(document.createTextNode(`${data.trackDuration}`))
                    l.appendChild(list1);
                    l.appendChild(list2);
                    l.appendChild(list3);
                    l.appendChild(list4);
                })
        })

}

function createPlaylist() {

    let path = "/api/newList/";
    path += document.getElementById("createPlaylist").value;

    fetch(path, {
        method: "PUT"
    })
        .then(res => {
            if (res.ok) {
                res.json()
                    .then(() => {
                        document.getElementById('playlist-status').innerText = "";
                        displayPlaylists();
                        showPlaylistTracks()
                    })
            }
            else {
                document.getElementById('playlist-status').innerText = "The playlist list either already exists or is an invalid name! Please try again.";
            }

        })
}

function displayPlaylists() {
    removeChildren(document.getElementById("playlist-list"));
    let path = "/api/getPlaylist";
    fetch(path)
        .then(res => {
            res.json()
                .then(data => {
                    data.forEach(e => {
                        const l = document.getElementById('playlist-list');
                        const list = document.createElement('li');
                        list.appendChild(document.createTextNode(`${e.playlistName}`))
                        l.appendChild(list);
                    })
                })
        })
}

function deletePlaylist() {
    let path = '/api/deleteList/';
    path += document.getElementById("delete").value;

    fetch(path, {
        method: "DELETE"
    })

        .then(res => {
            if (res.ok) {
                displayPlaylists();
                showPlaylistTracks()
            }
            else {
                document.getElementById('delete-status').innerText = "The playlist does not exist. It cannot be deleted";
            }

        })
}

function addTracks() {
    let path = '/api/list/';
    path += document.getElementById("choosePlaylist").value;

    fetch(path, {
        method: "PUT",
        headers: { 'Content-type': "application/json" },
        body: JSON.stringify({
            tracks: document.getElementById("addTrack").value
        })
    })
        .then(res => {
            if (res.ok) {
                showPlaylistTracks();
                document.getElementById('addtrack-status').innerText = "The valid tracks have been added to your playlist!"
            }
            else {
                document.getElementById('addtrack-status').innerText = "This playlist does not exist!"
            }

        })
}

function showPlaylistTracks() {
    removeChildren(document.getElementById("trackList"));
    let path = "/api/getPlaylist";
    fetch(path)
        .then(res => {
            res.json()
                .then(data => {
                    data.forEach(e => {
                        const l = document.getElementById('trackList');
                        const list = document.createElement('li');
                        list.id = e.playlistName;
                        list.className = 'bold';
                        list.appendChild(document.createTextNode(`${e.playlistName}`))
                        l.appendChild(list);
                        showPlaylists(e.playlistName, e.playlistName);
                    })
                })
        })
}

function showPlaylists(playlistName, parent) {
    let path = "/api/list/";
    path += playlistName;

    fetch(path)
        .then(res => {
            res.json()
                .then(data => {
                    data.forEach(e => {
                       showPlaylistHelper(e, parent);
                    });
                })
        }
        )
}

function showPlaylistHelper(trackId, parent){
    let path = "/api/tracks/";
    path += trackId;

    fetch(path)
        .then(res => {
            res.json()
                .then(data => {
                        const l = document.getElementById(parent);
                        const list = document.createElement('li');
                        list.id = 'unbold'
                        list.appendChild(document.createTextNode(`${data.artistName}..............${data.trackTitle}..............${data.title}..............${data.trackDuration}`))
                        l.appendChild(list);
                })
        })
}