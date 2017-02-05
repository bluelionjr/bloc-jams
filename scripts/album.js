var createSongRow = function(songNumber, songName, songLength) {
    var template = 
          '<tr class="album-view-song-item">'
        + ' <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
        + ' <td class="song-item-title">' + songName + '</td>'
        + ' <td class="song-item-duration">' + songLength + '</td>'
        + '</tr>'
        ;
    
    var $row = $(template);
    
    var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));

            if (currentlyPlayingSongNumber !== null) {
                //Revert to song number for currently playing song because user started playing new song.
                var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
                currentlyPlayingCell.html(currentlyPlayingSongNumber);
            }
            if (currentlyPlayingSongNumber !== songNumber) {
                // Switch from Play -> Pause button to indicate new song is playing.
                $(this).html(pauseButtonTemplate);
                setSong(songNumber);
                updatePlayerBarSong();
            } else if (currentlyPlayingSongNumber === songNumber) {
                // Switch from Pause -> Play button to pause currently playing song.
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentlyPlayingSongNumber = null;
                currentSongFromAlbum = null;
            }
        };

        var onHover = function(event) {
            var songNumberCell = $(this).find('.song-item-number');
            var songNumber = parseInt(songNumberCell.attr('data-song-number'));

            if (songNumber !== currentlyPlayingSongNumber) {
                songNumberCell.html(playButtonTemplate);
            }
        };

        var offHover = function(event) {
            var songNumberCell = $(this).find('.song-item-number');
            var songNumber = parseInt(songNumberCell.attr('data-song-number'));

            if (songNumber !== currentlyPlayingSongNumber) {
                songNumberCell.html(songNumber);
            }
            //console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
        };

        $row.find('.song-item-number').click(clickHandler);
        $row.hover(onHover, offHover);
        return $row;
};

var setSong = function(songNumber) {
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];  
};

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};


var setCurrentAlbum = function(album) {
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
    
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    
    
    $albumSongList.empty();
    
    
    for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }   
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};


//take out for extra credit
//var nextSong = function() {
//    
//    var getLastSongNumber = function(index) {
//        return index == 0 ? currentAlbum.songs.length : index;
//    };
//    
//    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
//    currentSongIndex++;
//    
//    if (currentSongIndex >= currentAlbum.songs.length) {
//        currentSongIndex = 0;
//    }
//    
//    // New current song
//    setSong(currentSongIndex + 1);
//    
//    // Update the player bar -- couldn't I have just called updatePlayerBarSong()?
//    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
//    $('.currently-playing .artist-name').text(currentAlbum.artist);
//    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
//    $('main-controls .play-pause').html(playerBarPauseButton);
//    
//    
//    var lastSongNumber = getLastSongNumber(currentSongIndex);
//    // I don't understand this part - if it's next why is it getting the current number and displaying the pause like it's current?
//    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
//    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
//    
//    $nextSongNumberCell.html(pauseButtonTemplate);
//    $lastSongNumberCell.html(lastSongNumber);
//    
//};

var prevNextSong = function(direction) {
  
    if (direction == "back") {
        
        var getLastSongNumber = function(index) {
            return index ==(currentAlbum.songs.length - 1) ? 1 : index + 2;
        };

        var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
        currentSongIndex--;

        if (currentSongIndex < 0) {
            currentSongIndex = currentAlbum.songs.length - 1;
        }
    }
    
    if (direction == "forward") {
        var getLastSongNumber = function(index) {
            return index == 0 ? currentAlbum.songs.length : index;
        };
    
        var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
        currentSongIndex++;

        if (currentSongIndex >= currentAlbum.songs.length) {
            currentSongIndex = 0;
        }
    }
    
    setSong(currentSongIndex + 1);
    // Update player bar
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    
    if (direction === "back") {
        $previousSongNumberCell.html(pauseButtonTemplate);
        $lastSongNumberCell.html(lastSongNumber);
    }
    if (direction === "forward") {
        $nextSongNumberCell.html(pauseButtonTemplate);
        $lastSongNumberCell.html(lastSongNumber);
    }
};


var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('main-controls .play-pause').html(playerBarPauseButton);
}

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class ="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';


// Store state of playing songs
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(prevNextSong("back"));
    $nextButton.click(prevNextSong("forward"));
});

//Extra credit function works when called manually, the buttons won't seem to call it, not sure why



         








                            
                            
                            
                            
                            
                            
                            