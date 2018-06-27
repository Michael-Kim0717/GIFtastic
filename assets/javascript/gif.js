$(document).ready(function() {

    /* Button Categories that will be displayed up top. */
    var emotionalGIFs = ["Happy", "Sad", "Angry", "Excited", "Celebrating", "Sleepy", "Active", "Working", "Confused", "Love"];

    /* When 'MORE GIFS' is pressed, give more GIFs from that category. */
    var previouslyClicked = "";
    var gifAmount = 10;

    /* Display all the buttons into the 'button-container' */
    var renderButtons = function(){
        var bcontainer = $(".button-container");
        bcontainer.empty();
        for (var i = 0; i < emotionalGIFs.length; i++){
            var newColumn = $("<div class='col-lg-2 col-md-4 col-sm-6'>");
            newColumn.append($("<button class='btn btn-info' value=" + emotionalGIFs[i] + "> " + emotionalGIFs[i] + "</button>"));
            bcontainer.append(newColumn);
        }
    }

    var tenGIFs = [];

    /* When a certain button is clicked, show 10 GIFs on the page with their rating. */
    $(document).on("click", ".btn-info", function(){
        var url = "http://api.giphy.com/v1/gifs/search?q=" + $(this).attr("value") + "&api_key=sOLAAJWsrJmlO0LyZB5BsV70KO2hs13I&limit=10";
        previouslyClicked = $(this).attr("value");
        gifAmount += 10;

        $.ajax({
            url: url,
            method: "GET"
        }).then (function(response){
            $("#gifs").empty();
            console.log(response.data);
            for (var i = 0; i < response.data.length; i++){
                var gifDiv = $("<div class='col-lg-4 col-md-6 col-sm-12'>");

                var card = $("<div class='card'>");
                var cardHeader = $("<div class='card-header'>" + response.data[i].rating + "</div>");
                var gifImage = $("<img class='card-img gif-image' value='still'>");
                gifImage.attr("src", response.data[i].images.fixed_height_still.url);
                var download = $("<a class='btn btn-success download' href=" + response.data[i].images.fixed_height.url + " target='_blank'> DOWNLOAD </a>");
                var favorite = $("<button class='btn btn-success favorite' value=" + response.data[i].images.fixed_height.url + "> FAVORITE </button>")

                card.append(cardHeader);
                card.append(gifImage);
                card.append(download);
                card.append(favorite);

                gifDiv.append(card);

                $("#gifs").prepend(gifDiv);

                tenGIFs.push({still: response.data[i].images.fixed_height_still.url, animated: response.data[i].images.fixed_height.url});
            }
        });
    });

    /* When the 'MORE GIFs' button is pressed, check if 'previouslyClicked' has been entered.
        If so, provide more GIFs
        Else, show an alert saying to click a category first
     */
    $("#more-gifs").on("click", function(){
        if (previouslyClicked == ""){
            alert("Click a GIF category first.");
        }
        else {
            var url = "http://api.giphy.com/v1/gifs/search?q=" + previouslyClicked + "&api_key=sOLAAJWsrJmlO0LyZB5BsV70KO2hs13I&limit=" + gifAmount;
            
            $.ajax({
                url: url,
                method: "GET"
            }).then (function(response){
                $("#gifs").empty();
                for (var i = 0; i < response.data.length; i++){
                    var gifDiv = $("<div class='col-lg-4 col-md-6 col-sm-12'>");

                    var card = $("<div class='card'>");
                    var cardHeader = $("<div class='card-header'>" + response.data[i].rating + "</div>");
                    var gifImage = $("<img class='card-img gif-image' value='still'>");
                    gifImage.attr("src", response.data[i].images.fixed_height_still.url);
                    var download = $("<a class='btn btn-success' href=" + response.data[i].images.fixed_height.url + " id='download' download> DOWNLOAD </a>");
                    var favorite = $("<button class='btn btn-success' id='favorite'> FAVORITE </button>")

                    card.append(cardHeader);
                    card.append(gifImage);
                    card.append(download);
                    card.append(favorite);

                    gifDiv.append(card);

                    $("#gifs").prepend(gifDiv);

                    tenGIFs.push({still: response.data[i].images.fixed_height_still.url, animated: response.data[i].images.fixed_height.url});
                }
            });

            gifAmount += 10;
        }
    });

    /* When a certain still GIF is clicked, animate the GIF.
        If the GIF is already playing, pause it.
     */
    $(document).on("click", ".gif-image", function(){
        console.log($(this).attr("src"));
        for (var i = 0; i < tenGIFs.length; i++){
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

    /* When the Favorite button is clicked,
        Add the GIF into local storage.
     */
    $(document).on("click", ".favorite", function(){
        var gifDiv = $("<div class='col-lg-4 col-md-6 col-sm-12'>");
        console.log($(this).attr("value"));

        var card = $("<div class='card'>");
        var cardHeader = $("<div class='card-header'>" + previouslyClicked + "</div>");
        var gifImage = $("<img class='card-img gif-image'>");
        gifImage.attr("src", $(this).attr("value"));
        
        card.append(cardHeader);
        card.append(gifImage);
        
        gifDiv.append(card);

        $(".favorites").append(gifDiv);
    })

    renderButtons();

});