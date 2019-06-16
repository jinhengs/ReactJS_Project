/**
 * DetailsView
 * View to display all the details associated with a TicketApp item
 * @prop Function back, selector to call to go to previous view
 * @prop Object item, item the display info for
 */
class DetailsView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            attending:[],
            windowWidth:0
        };

        this.tagSearch = this.tagSearch.bind(this);
        this.initialize = this.initialize.bind(this)
        this.attendingCallback = this.attendingCallback.bind(this)
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
    }

    updateWindowDimensions() {
        this.setState({windowWidth: window.innerWidth})
    }

    componentDidMount() { 
        this.initialize(this.props) 
        this.updateWindowDimensions()
        window.addEventListener('resize', this.updateWindowDimensions)
    }
    //componentWillReceiveProps(props) { this.initialize(props) }

    initialize(props) {
        if(props.editing != null) {
            this.fillFields(props.editing.parameters, props.editing.optional);
        }

        props.whoseAttending(props.host, props.item._id, this.attendingCallback)
        /*// For now i've hardcoded the user event for this test
        if(props.userId != null) {
            fetch(this.props.host + '/events/' + props.item._id + '/attending/')
                .then(response => {
                    if(response.ok) {
                        return response.json()
                    } else 
                        throw "No Data"
                }).then(json => {
                    // Set attending array
                    this.setState({attending: json})
                }).catch(error => console.log(error))
        }*/
    }

    attendingCallback(attending){
        this.setState({attending:attending})
    }

    render() {
        // Generate which links are valid
        var pages = ["facebook", "twitter", "instagram", "youtube", "homepage", "itunes", "lastfm"]
        var logos = ["fa fa-facebook-official", "fa fa-twitter-square", "fa fa-instagram", "fa fa-youtube-play", "fa fa-google-plus", "fa fa-apple", "fa fa-lastfm-square"]
        var artistPages = pages
            .filter(x => (this.props.item.optional[x].slice(this.props.item.optional[x].length > 0)))
            .map(x => (<a href={this.props.item.optional[x]} target="_blank" key={x} className={x}>{x.charAt(0).toUpperCase() + x.slice(1)} <i className={logos[pages.indexOf(x)]}></i></a>))

        var tagLinks = this.props.item.optional.tags.map(x => (<button key={x} className="genreTag mainButton" onClick={(e) => this.tagSearch(x)}> {x} </button>))


        var attendingIds = this.state.attending.map(x => x._id)
        var userAttending = attendingIds.includes(this.props.userId)

        // Put our name at the front
        var attendingTrimmed = []
        if(userAttending){
            attendingTrimmed = shuffle(this.state.attending.filter(x => x._id != this.props.userId)).slice(0, 11).map(x => x.username)
        } else {
            attendingTrimmed = shuffle(this.state.attending.filter(x => x._id != this.props.userId)).slice(0, 12).map(x => x.username)
        }
       
        var attendingString = attendingTrimmed.join(', ')
        var style = {"fontSize":"2.25em"}
        if(this.props.item.parameters.title.length > 50) {
            if(this.state.windowWidth < 978)
                style["fontSize"] = "1em"
            else
                style["fontSize"] = "1.5em"

        }

        // Can access the item through this.props.item
        return (
            <div className="view">
                <div className="row viewTitle">
                    <div className="col-10-sm detailsTitle">
                        <h3 style={style}>{this.props.item.parameters.title}</h3>
                    </div>
                    <div className="col-2-sm">
                        <button className="backBtn mainButton" onClick={(e) => this.props.back()}> Back </button>
                    </div>
                </div>
                <div className="row details viewContent">
                    <div className="detailsWrapper mainTitle">
                        <div className="info">
                            <div className="firstColumn">
                                <div name="price" className = "infoBlock">
                                    <h5>Info</h5>
                                    <div className="priceRange"> {this.props.item.parameters.priceRange} </div> <br/>
                                        <a href={this.props.item.parameters.purchaseURL} target="_blank">
                                        <button name="genreTag" className="mainButton"> Buy Tickets </button>
                                        </a>
                                        {(this.props.item.optional.seatMap != "" && this.props.item.optional.seatMap != "N/A")?
                                        <a href={this.props.item.optional.seatMap} target="_blank">
                                        <button className="genreTag mainButton"> Seat Map </button>
                                        </a>:null}
                                    </div>
                                    <div name="time" className="infoBlock">
                                        <h5>Date and Time</h5>
                                        {this.props.item.parameters.date}, @{this.props.item.parameters.time} <br />
                                    </div>
                                </div>

                                <div className="secondColumn">
                                    {(tagLinks.length > 0) ?
                                    <div name="genre" className = "infoBlock">
                                        <h5>Genre</h5>
                                        {tagLinks}
            {/*}<button className="genreTag mainButton" onClick={(e) => this.tagSearch(this.state.tags["genre"], e)}> {this.props.item.tags["genre"]} </button>
                                        <button className="segmentTag mainButton" onClick={(e) => this.tagSearch(this.state.tags["segment"], e)}> {this.props.item.tags["segment"]} </button>*/}
                                    </div>
                                    :null}
                                    <div name="location" className="infoBlock">
                                        <h5>Location</h5>
                                        {this.props.item.parameters.venue}<br/>
                                        {this.props.item.parameters.address}<br/>
                                        {this.props.item.parameters.city}, {this.props.item.parameters.province}, {this.props.item.parameters.country}<br />
                                        {this.props.item.parameters.postalCode}<br />
                                    </div>
                                </div>
                                {(this.props.item.optional.additionalInfo != "" && this.props.item.optional.additionalInfo != "N/A" && this.props.item.optional.additionalInfo != null)?
                                <div className="additionalInfo infoBlock">
                                    <h5>Additional Info</h5>
                                    {this.props.item.optional.additionalInfo}
                                </div>
                                :null}
                            </div>
                            <div className="images">
                                <div className="mainPhoto">
                                    <img src={this.props.item.optional.imageURL} height="400" width ="600" />
                                </div>
                                {(artistPages.length > 0) ? 
                                    <div className="externalLinks">
                                        <div className="artistLinks">
                                        {artistPages}
                                        </div>
                                    </div>
                                : null}
                                <div className="attendingList">
                                    <div className="row">
                                        {(this.props.userId != null || this.state.attending.length > 0)?
                                        <div className="row">
                                            <h5>Whose going? - {this.state.attending.length} People</h5>
                                        </div>
                                        :null}
                                        {(this.props.userId != null)?
                                        <div className="row">
                                            <div className="col-7-sm attendingNames">
                                                <p>{(this.props.userId != null && userAttending)?<strong>{this.props.username}{attendingString.length > 0?",":null}</strong>:null} {attendingString} </p>
                                            {/*<div className="row">
                                                    {attending}
                                                </div>*/}
                                            </div>
                                            <div className="col-5-sm attendingButton">
                                                <button className="backBtn mainButton" onClick={(e) => this.props.attending(!userAttending, this.props.item._id, this.props.userId, this.attendingCallback)}> {(userAttending)?"- Not going":"+ I'm going!"}</button>
                                            </div>
                                        </div>
                                        :
                                        <div className="row">
                                            <div className="col-7-sm attendingNames">
                                                <p>{attendingString}</p>
                                            </div>
                                        </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        );
    }


    /**
     * Plus Divs
     * takes num which is either 1 or -1, and use it to cycle through different sets of thumbnails
     * gallery was scrapped but code will be kept in case we want to re-implement it later on.
     */
    /*plusDivs(num){
        var array = [];
        //goes through thumbnails and create new thumbnail gallery where index are moved by either 1 or -1 
        for(var a = 0; a < this.state.thumbnails.length; a++){
            var path = this.state.thumbnails[a];
            var index = this.state.photos.indexOf(path);
            if(num == -1){
                if(index == 0){
                    array.push(this.state.photos[this.state.photos.length-1]);
                }
                else{
                    array.push(this.state.photos[index-1]);
                }
            }
            if(num == 1){
                if(index == this.state.photos.length-1){
                    array.push(this.state.photos[0]);
                }
                else{
                    array.push(this.state.photos[index+1]);
                }
            }
        }
        //set the thumbnails array to this new array
        this.setState({thumbnails: array});
    }*/


    /**
     * Tag Search
     * Take search parameters and convert them to an api call, then go to results view
     */
    tagSearch(tag) {
        let parametersCopy = this.props.parameters;
        parametersCopy.keyword = tag;

        this.props.search(parametersCopy, 0, false, this.props.results)
    }
}
