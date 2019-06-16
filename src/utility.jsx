function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function ValidLocation(item) {

    var location = ""
    /*if ('_embedded' in props.event && 'venues' in props.event._embedded) {
        if ('city' in props.event._embedded.venues[0]) {
            location += props.event._embedded.venues[0].city.name + ", "
        }
        if ('state' in props.event._embedded.venues[0]) {
            location += props.event._embedded.venues[0].state.stateCode
        }
    } else if ('place' in props.event) {
        if ('city' in props.event.place) {
            location += props.event.place.city.name + ", "
        }
        if ('state' in props.event.place) {
            location += props.event.place.state.stateCode
        }
    }*/

    location = [item.parameters.venue, item.parameters.city, item.parameters.province].filter(x => x != "" && x != "N/A").join(", ")

    return location
}


function ValidDate(props) {

    var date = ""

    if ('start' in props.dates && 'localDate' in props.dates.start) {
        date += props.dates.start.localDate
    }
    if ('end' in props.dates && 'localDate' in props.dates.end) {
        date += "~" + props.dates.end.localDate
    }

    return date;
}

function MinPrice(props) {

    var min = 100000

    for (var i in props.priceRanges) {
        min = Math.min(props.priceRanges[i].min, min);
    }

    if (min == 100000) {
        return 'N/A'
    } else {
        return min;
    }
}

/**
 * Repackage Items
 */
function RepackageItems(items) {
    var newItems = []
    for(var i in items) {
        var item = items[i]

        // Multi property gets that need to be deconstructed
        var links = GetArtist(item)

        var location = GetLocation(item)
        var address = [location.line1, location.line2].filter(x => x != "N/A").join(' ')
        var date = GetDate(item)
        var time = [date.startTime, date.endTime].filter(x => x != "N/A").join('-')
        var validDate = [date.start, date.end].filter(x => x != "N/A").join('-')

        var newItem = {_id:item.id, 
            parameters: {
            title: GetName(item),
            purchaseURL: GetLink(item),
            priceRange: GetPriceRange(item),
            date: validDate,
            time: time,
            venue:location.name,
            address: address,
            city:location.city,
            province:location.state,
            country:location.country,
            postalCode:location.postalCode
        },
        optional: {
            imageURL: ClosestImageToWidth(item.images, 1000),
            additionalInfo: GetInfo(item),
            seatMap: GetSeatMap(item),
            tags: GetTags(item),
            facebook: links.facebook,
            twitter: links.twitter,
            instagram: links.instagram,
            youtube: links.youtube,
            itunes: links.itunes,
            lastfm: links.lastfm,
            homepage: links.homepage
        }}
        newItem.optional.imageURL = ClosestImageToWidth(item.images, 1000)
        newItems.push(newItem)
    }

    // Add to the cache
    if(newItems.length > 0) {
        var data = {items:newItems}
        fetch('http://localhost:3000/cache', 
            {
                method: 'post', 
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if(response.ok)
                    return response.json()
                else 
                    throw "No Data"
            }).then(json => {
                // Not really expecting data
                console.log("Events cached")
                console.log(json)
            }).catch(error => console.log(error))
    }

    return newItems
}

function ClosestImageToWidth(images, target) {
    var url = ""
    var closest = 100000
    for(var i in images) {
        var dif = Math.abs(images[i].width - target)
        if(dif < closest) {
            closest = dif
            url = images[i].url
        }
    }
    // If none were found just grab the first
    if(url == "" && images.length > 0)
        url = images[0].width 

    return url
}

function getMinimumStartDateRange() {
    let today = new Date();
    let dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd < 10) {
        dd = '0' + dd;
    }
    if(mm < 10) {
        mm= '0' + mm
    }

    today = yyyy+'-'+mm+'-'+dd;
    document.getElementById("startDT").setAttribute("min", today);

    let min = document.getElementById("startDT").getAttribute("value");
        if (min = '') {
            document.getElementById("endDT").disabled = true;
    }
    document.getElementById("endDT").setAttribute("min", min);
}


/**
 * Setup Thumbnails
 * Setup the thumbnail gallery from the photos
 */
function GetThumbnail(photos){
    var num = Math.min(photos.length, 3);
    var array = [];
    for (var i = 0; i < num; i++) {
        array.push(photos[i].url);
    }
    return array;
}

/** 
 * Setup Gallery
 * adds photo urls to the state
 */
function GetGallery(photos){
    var num = photos.length;
    var array = [];
    for (var i = 0; i < num; i++) {
        array.push(photos[i].url);
    }
    return array;
}

/**
 * Setup Price Range
 * Check if the object contains a price range and either populate with N/A or the data
 */
function GetPriceRange(object){
    if (object.hasOwnProperty("priceRanges")){
        var min = 100000 
        var max = 0
        for (var range in object.priceRanges){
            var rMin = object.priceRanges[range].min
            var rMax = object.priceRanges[range].max
            if(rMin < min)
                min = rMin
            if(rMax > max)
                max = rMax
        }
        var priceString = (min != 100000) ? "$"+ min + " - " + "$" + max : "N/A"
        return priceString
    }
    else{
        return "N/A";
    }
}

/** 
 * Setup Info
 * Check if the object contains info property and either populate with N/A or the data
 */
function GetInfo(object){
    if (object.hasOwnProperty("info")){
        return object.info;
    }
    else{
        return "N/A";
    }
}

/** 
 * Setup Location
 * Check if the object contains location properties and either populate with N/A or the data
 */
function GetLocation(object){
    var location = {
        postalCode: "N/A",
        name: "N/A",
        city: "N/A",
        state: "N/A",
        country: "N/A",
        line1: "N/A",
        line2: "N/A"
    }

    if ('_embedded' in object) {
        if (object._embedded.venues[0].hasOwnProperty("postalCode")){
            location.postalCode = object._embedded.venues[0].postalCode;
        }
        if (object._embedded.venues[0].hasOwnProperty("name")){
            location.name = object._embedded.venues[0].name;
        }
        if (object._embedded.venues[0].hasOwnProperty("city")){
            location.city = object._embedded.venues[0].city.name;
        }
        if (object._embedded.venues[0].hasOwnProperty("country")){
            location.country = object._embedded.venues[0].country.name;
        }
        if (object._embedded.venues[0].hasOwnProperty("address")){
            if (object._embedded.venues[0].address.hasOwnProperty("line1")){
                location.line1 = object._embedded.venues[0].address.line1;
            }
            if (object._embedded.venues[0].address.hasOwnProperty("line2")){
                location.line2 = object._embedded.venues[0].address.line2;
            }
            if (object._embedded.venues[0].hasOwnProperty("state")){
                location.state = object._embedded.venues[0].state.stateCode;
            }
        }
    }

    // Combine list with spaces (except N/As)
    return location;
}

/**
 * Setup Link
 * Check if the object contains link to ticketmaster or not and return the url.
 */
function GetLink(object){
    if (object.hasOwnProperty("url")){
        return object.url;
    }
    else{
        return "N/A";
    }
}

/**
 * Setup Name
 * Check if the object contains a name and either populate with N/A or the data
 */
function GetName(object){
    if(object.hasOwnProperty("name")){
        return object.name;
    }
    else{
        return "N/A";
    }
}

/**
 * Setup Artist
 * Check if the object contains artist webpages and populate the urls
 */
function GetArtist(object){
    var links = {
        facebook: "",
        twitter: "",
        instagram: "",
        youtube: "",
        homepage: "",
        itunes: "",
        lastfm: ""
    }
    if ('_embedded' in object) {
        if(object._embedded.hasOwnProperty("attractions")){
            if(object._embedded.attractions[0].hasOwnProperty("externalLinks")){
                if(object._embedded.attractions[0].externalLinks.hasOwnProperty("facebook")){
                    links.facebook = object._embedded.attractions[0].externalLinks.facebook[0].url;
                }
                if(object._embedded.attractions[0].externalLinks.hasOwnProperty("twitter")){
                    links.twitter = object._embedded.attractions[0].externalLinks.twitter[0].url;
                }
                if(object._embedded.attractions[0].externalLinks.hasOwnProperty("instagram")){
                    links.instagram = object._embedded.attractions[0].externalLinks.instagram[0].url;
                }
                if(object._embedded.attractions[0].externalLinks.hasOwnProperty("youtube")){
                    links.youtube = object._embedded.attractions[0].externalLinks.youtube[0].url;
                }
                if(object._embedded.attractions[0].externalLinks.hasOwnProperty("homepage")){
                    links.homepage = object._embedded.attractions[0].externalLinks.homepage[0].url;
                }
                if(object._embedded.attractions[0].externalLinks.hasOwnProperty("itunes")){
                    links.itunes = object._embedded.attractions[0].externalLinks.itunes[0].url;
                }
                if(object._embedded.attractions[0].externalLinks.hasOwnProperty("lastfm")){
                    links.lastfm = object._embedded.attractions[0].externalLinks.lastfm[0].url;
                }
            }
        }
    }
    return links;
}

/**
 * Setup Seat Map
 * Check if the object contains Seatmap property and either populate with N/A or the data
 */
function GetSeatMap(object){
    if(object.hasOwnProperty("seatmap")){
        return object.seatmap.staticUrl;
    }
    return "https://www.bookexchangewv.com/c.4782503/site/img/no_image_available.jpeg";
}

/**
 * Setup Tags
 * Check if the object contains Genre and Segment properties and either populate with N/A or the data
 */
function GetTags(object){
    /*var tags = {
        genre: "N/A",
        segment: "N/A"
    }*/
    var tags = []
    if(object.hasOwnProperty("classifications")){
        if(object.classifications[0].hasOwnProperty("genre")){
            // Replace "/" with " / " to fix wrapping
            tags.push(object.classifications[0].genre.name.replace(/\//g, ' / '))
        }
        if(object.classifications[0].hasOwnProperty("segment")){
            tags.push(object.classifications[0].segment.name.replace(/\//g, ' / '))
        }
    }
    return tags;
}


/**
 * Setup Date
 * Check if the object contains Date properties and either populate with N/A or the data
 */
function GetDate(object){
    var date = {
        start: "N/A",
        startTime: "N/A",
        end: "N/A",
        endTime: "N/A"
    }

    if ('dates' in object) {
        if(object.dates.hasOwnProperty("start")){
            date.start = object.dates.start.localDate;
            date.startTime = object.dates.start.localTime;
        }
        if(object.dates.hasOwnProperty("end")){
            date.end = object.dates.end.localDate;
            date.endTime = object.dates.end.localTime;
        }
    }

    return date;
}
