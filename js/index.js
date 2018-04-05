"use strict";

var streams = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "giantbomb", "day9tv", "saltybet"];

// go through each stream and get the data
function divideStreams(streams) {
    streams.forEach(function(streamName) {
        pullData(streamName);
    });
}

function pullData(streamName) {
    var url = 'https://wind-bow.gomix.me/twitch-api/streams/' + streamName;
    $.ajax({
            url: url,
            type: 'get',
            async: false,
            cache: false,
            dataType: 'jsonp',
            data: { param1: 'value1' },
        })
        .done(function(data) {
            applyData(data, streamName);
        })
        .fail(function() {
            console.log("error");
            $("#streams").append('<div class="row align-items-center offline"><div class="col col-12"><b>---FAILED TO GET STREAM DATA FOR: ' + streamName + '---</b></div>')
        })
        .always(function() {
            console.log("complete");
        });
}


function applyData(data, streamName) {
    if (data.stream == null) { // if offline
        $("#streams").prepend('<div class="row align-items-center offline"><div class="icon col col-2 col-md-1"><a href="https://go.twitch.tv/' + streamName + '" target="blank"><i class="fa fa-ban fa-3x" aria-hidden="true"></i></a></div><div class="col col-10 col-md-11"><div class="row align-items-center"><div class="name col col-12 col-md-3"><p><a href="https://go.twitch.tv/' + streamName + '" target="blank">' + streamName + '</a>&emsp;&emsp;</p></div><div class="title col col-12 col-md-9"><p><b>--OFFLINE--</b>&emsp;&emsp;</p></div></div></div>'); // the tab characters (&emsp;) are a quick rough fix to even out the online channels because of the offset caused by the preview pics
        return;
    }
    var title = data.stream.channel.status;
    var img = data.stream.channel.logo;
    var preview = data.stream.preview.small;
    $("#streams").prepend('<div class="row align-items-center online"><div class="icon col col-2 col-md-1"><a href="https://go.twitch.tv/' + streamName + '" target="blank"><img class="banner" src="' + img + '" alt="' + streamName + '"></a></div><div class="col col-10 col-md-11"><div class="row align-items-center"><div class="name col col-12 col-md-3"><p><a href="https://go.twitch.tv/' + streamName + '" target="blank">' + streamName + '</a><span class="live">•</span><span class="preview"><img class="banner" src="' + preview + '" alt="preview"></span></p></div><div class="title col col-12 col-md-9"><p>' + title + '&emsp;&emsp;</p></div></div></div>');
}


function listeners() {
    // clicking all
    $("#all").on("click", function() {
        $(".online").slideDown(500);
        $(".offline").slideDown(500);
        $("#all").addClass("active");
        $("#online").removeClass("active");
        $("#offline").removeClass("active");
    });
    // clicking offline
    $("#offline").on("click", function() {
        // video players are just hidden and not removed when offline is pressed
        $(".online").slideUp(500);
        // in case you want to also remove the players when offline is pressed
        // $(".online").slideUp(500, function() {
        //     $(".player").remove();
        // });
        $(".offline").slideDown(500);
        $("#offline").addClass("active");
        $("#all").removeClass("active");
        $("#online").removeClass("active");
    });
    // clicking online
    $("#online").on("click", function() {
        $(".offline").slideUp(500);
        $(".online").slideDown(500);
        $("#online").addClass("active");
        $("#offline").removeClass("active");
        $("#all").removeClass("active");
    });
    //create new item from text box
    $("input[type='text']").change(function() {
        var inputText = $(this).val();
        // don't add the same channel twice
        if (noRepeatCheck(inputText)) {
            pullData(inputText);
        };
        // clearing input
        $(this).val("");
    });
    // listeners to open the video player when the div is clicked
    // these items were dynamically created, so we need to target the document, then the subsequent classes
    $(document).on("click", ".online", function() {
        var streamName = $('.name', this).text().slice(0, -1); //cutting off the red circle
        if ($('.player', this).length > 0) { // check if exists
            $('.player', this).slideUp(500, function() {
                $(this).remove();
            });
        } else { // create the video box
            $(this).append('<div class="col col-12 player embedVideo hidden"><iframe src="https://player.twitch.tv/?channel=' + streamName + '" frameborder="0" allowfullscreen="true" autoplay="false" muted="false" scrolling="no" height="189" width="310"></iframe></div>');
            $('.player', this).toggleClass("hidden");
        }
    });
}

// checks is a channel is already in the list
function noRepeatCheck(streamName) {
    // changing the stream array to lowercase for tests
    var streamCheck = streams.map(function(value) {
        return value.toLowerCase();
    });
    // checking for only valid names and lengths
    var find = /[a-zA-Z0-9_]/g; //valid characters
    if (streamName.length !== streamName.match(find).length || streamName.length > 15 || streamName[0] === '_') {
        alert(streamName + " is not a valid channel name");
        return false;
    }
    if (streamCheck.indexOf(streamName.toLowerCase()) !== -1) {
        alert("The " + streamName + " channel is already in the list.")
        return false;
    }
    streams.push(streamName);
    return true;
}

$(document).ready(function() {
    listeners();
    divideStreams(streams);
});