$(document).ready(function() {

    /* Button Categories that will be displayed up top. */
    var emotionalGIFs = ["Happy", "Sad", "Angry"];

    /* Display all the buttons into the 'button-container' */
    var renderButtons = function(){
        var bcontainer = $(".button-container");
        bcontainer.empty();
        for (var i = 0; i < emotionalGIFs.length; i++){
            var newColumn = $("<div class='col-2'>");
            newColumn.append($("<button class='btn btn-info' value=" + emotionalGIFs[i] + "> " + emotionalGIFs[i] + "</button>"));
            bcontainer.append(newColumn);
        }
    }

    var tenGIFs = [];

    /* When a certain button is clicked, show 10 GIFs on the page with their rating. */
    $(document).on("click", ".btn-info", function(){
        var url = "http://api.giphy.com/v1/gifs/search?q=" + $(this).attr("value") + "&api_key=sOLAAJWsrJmlO0LyZB5BsV70KO2hs13I&limit=10";
        
        $.ajax({
            url: url,
            method: "GET"
        }).then (function(response){
            $("#gifs").empty();
            console.log(response.data);
            for (var i = 0; i < response.data.length; i++){
                var gifDiv = $("<div class='col-12'>");

                var gifRating = $("<p>").text("Rating : " + response.data[i].rating);
                gifDiv.append(gifRating);

                var gifImage = $("<img class='gif-image' value='still'>");
                gifImage.attr("src", response.data[i].images.fixed_height_still.url);
                gifDiv.append(gifImage);

                $("#gifs").prepend(gifDiv);

                tenGIFs.push({still: response.data[i].images.fixed_height_still.url, animated: response.data[i].images.fixed_height.url});
            }
        });
    });

    /* When a certain still GIF is clicked, animate the GIF.
        If the GIF is already playing, pause it.
     */
    $(document).on("click", ".gif-image", function(){
        console.log($(this).attr("src"));
        for (var i = 0; i < 10; i++){
            if ($(this).attr("value") == "still"){
                if ($(this).attr("src") == tenGIFs[i].still){
                    $(this).attr("src", tenGIFs[i].animated);
                    $(this).attr("value", "animated");
                }
            }
            else{
                if ($(this).attr("src") == tenGIFs[i].animated){
                    $(this).attr("src", tenGIFs[i].still);
                    $(this).attr("value", "still");
                }
            }
        }
    });

    /* When the 'Add-Emotion' button is clicked,
        Add whatever the user has inputted as a button to be clicked.
        Refresh the button container.
     */
    $("#add-emotion").on("click", function(event){
        event.preventDefault();
        var emotion = $("#emotion-input").val().trim();
        emotionalGIFs.push(emotion);
        renderButtons();
    });

    renderButtons();

});