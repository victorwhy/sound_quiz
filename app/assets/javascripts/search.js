// https://itunes.apple.com/search?attribute=allArtistTerm&term=massive+attack
var songSearchUrl = 'https://itunes.apple.com/search?attribute=allArtistTerm&entity=song&term='
var artistSearchUrl= 'https://itunes.apple.com/search?entity=musicArtist&term='
var testResponse;
var artistName;
var artistId;
var songList = [];
var numOfQuestions = 5;
var gameover = false;
var currentQuestion = 0;
var test;
var time = new Date();
var timeArray = [];

$(document).ready(function(){
  $('form').on('submit', function(event){
    event.preventDefault();
    searchTerm = $('#searchterm').val();

    $.ajax({
      url: artistSearchUrl+searchTerm,
      type: 'GET',
      dataType: 'jsonp',
      success: function(response){
        appendArtists(response);
      },
      failure: function(response){
        console.log('Fail');
      }
    })
  })

  $('#artistlist').on('click', 'a', function(event){
    
    event.preventDefault();
    artistId = $(this).data('artistid');
    artistName = $(this).text();
    
    $.ajax({
      url: songSearchUrl + artistName,
      type: 'GET',
      dataType: 'jsonp',
      success: function(response){
        songList = createSongList(response);

        $('#artistsection').hide()
        $('#songsection').show()

        appendSongs(songList);

      },
       failure: function(response){
        console.log('Fail');
      }
    });
  });


  //start and play the game
  $('button#start').on('click', function(event){

    timeArray.push((new Date()).getTime());

    $('audio#player'+currentQuestion)[0].play()

    $('#songlist').on('click','.answer',function(event){
      timeArray.push((new Date()).getTime());
      $('audio#player'+currentQuestion)[0].pause()
      currentQuestion++
      if(currentQuestion >= numOfQuestions){
        alert('GameOver')
      }
      $('audio#player'+currentQuestion)[0].play()
    })
  })

});


function appendArtists(artistObject){
  for(var i=0; i<artistObject['results'].length; i++){
    $('#artistlist ul').append('<li><a href="'+ artistObject['results'][i].artistLinkUrl +'" data-artistid="'+artistObject['results'][i].artistId+'">'+artistObject['results'][i].artistName + '</a></li>');
  }
}

function createSongList(artistObject){
  songArray = []
  for(var i =0; i< artistObject['results'].length; i++){
    if (artistId === artistObject['results'][i].artistId) {
      songArray.push(artistObject['results'][i]);
    }
  }
  return songArray;
}

function appendSongs(songArray){
  for(var i = 0; i < numOfQuestions; i++){
    $('#songlist').append('<li id="question'+i+'">' + songArray[i].trackName + songPlayer(songArray[i].previewUrl, i)+' </li>')
  }
}

function songPlayer(songUrl, questionNum){
  embedString = '<audio controls preload="auto" id="player'+questionNum+'" style="display:none;"><source src="'+songUrl+'" type="audio/mp4"></audio><button name="button'+questionNum+'" class="answer">Answer</button>'
  return embedString;
}