$(document).ready(function() {

    /* Button Categories that will be displayed up top. */
    var emotionalGIFs = ["Happy", "Sad", "Angry", "Excited", "Celebrating", "Sleepy", "Active", "Working", "Confused", "Love"];

    /* Favorites Counter */
    var numFavorites = localStorage.getItem("numFavorites");

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

    /* Display all favorites saved to localStorage */
    var renderFavorites = function(){
        $(".favorites").empty();

        for (var i = 0; i < localStorage.getItem("numFavorites"); i++){
            if (localStorage.getItem("fav-" + i) != null){
                var gifDiv = $("<div class='col-lg-4 col-md-6 col-sm-12'>");
                console.log(localStorage.getItem("fav-category-" + i));
                
                var card = $("<div class='card fav-card'>");
                var cardHeader = $("<div class='card-header'>" + localStorage.getItem("fav-category-" + i) + " <button class='btn btn-danger delete-favorite' value=" + i + "> <img class='btn-icon' src='https://cdn2.iconfinder.com/data/icons/apple-classic/100/Apple_classic_10Icon_5px_grid-02-512.png'> </button> </div>");
                var gifImage = $("<img class='card-img fav-gif'>");
                gifImage.attr("src", localStorage.getItem("fav-" + i));
                $(".button-icon").attr("src", "trashcan.png");

                card.append(cardHeader);
                card.append(gifImage);
                
                gifDiv.append(card);
        
                $(".favorites").append(gifDiv);
            }
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
                var cardHeader = $("<div class='card-header'>" + response.data[i].rating.toUpperCase() + "</div>");
                var gifImage = $("<img class='card-img gif-image' value='still'>");
                gifImage.attr("src", response.data[i].images.fixed_height_still.url);
                var download = $("<a class='btn btn-light download' href=" + response.data[i].images.fixed_height.url + " target='_blank'> <img class='btn-icon' src='https://www.rti.com/hubfs/RTI_Oct2016/Images/icon-downloads-circle.svg?tu003d1522442086611'> </a>");
                var favorite = $("<button class='btn btn-light favorite' value=" + response.data[i].images.fixed_height.url + "> <img class='btn-icon' src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Gold_Star.svg/2000px-Gold_Star.svg.png'> </button>")

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
                    var cardHeader = $("<div class='card-header'>" + response.data[i].rating.toUpperCase() + "</div>");
                    var gifImage = $("<img class='card-img gif-image' value='still'>");
                    gifImage.attr("src", response.data[i].images.fixed_height_still.url);
                    var download = $("<a class='btn btn-success download' href=" + response.data[i].images.fixed_height.url + " target='_blank'> DOWNLOAD </a>");
                    var favorite = $("<button class='btn btn-success favorite' value=" + response.data[i].images.fixed_height.url + "> <img class='btn-icon' src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Gold_Star.svg/2000px-Gold_Star.svg.png'> </button>")

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
        Add the Gif into the Favorites section.
     */
    $(document).on("click", ".favorite", function(){
        var gifDiv = $("<div class='col-lg-4 col-md-6 col-sm-12'>");
        console.log($(this).attr("value"));

        var card = $("<div class='card fav-card'>");
        var cardHeader = $("<div class='card-header'>" + previouslyClicked + " <button class='btn btn-danger delete-favorite' value=" + numFavorites + "> <img class='btn-icon' src='https://cdn2.iconfinder.com/data/icons/apple-classic/100/Apple_classic_10Icon_5px_grid-02-512.png'> </button> </div>");
        var gifImage = $("<img class='card-img fav-gif'>");
        gifImage.attr("src", $(this).attr("value"));
        
        card.append(cardHeader);
        card.append(gifImage);
        
        gifDiv.append(card);

        $(".favorites").append(gifDiv);

        localStorage.setItem("fav-" + numFavorites, $(this).attr("value"));
        localStorage.setItem("fav-category-" + numFavorites, previouslyClicked);

        numFavorites ++;

        localStorage.setItem("numFavorites", numFavorites);
    })

    /* When the Delete Favorite button is clicked,
        Delete the Favorite from the Favorites section.
        Delete the Favorite from the localStorage.
     */
    $(document).on("click", ".delete-favorite", function(){
        localStorage.removeItem("fav-" + $(this).attr("value"));
        localStorage.removeItem("fav-category-" + $(this).attr("value"));

        renderFavorites();
    })

    renderButtons();

    renderFavorites();

});