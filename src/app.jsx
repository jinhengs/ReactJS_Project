/**
 * App entry
 */
class TicketApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Array of items from the last query
            results: [],
            // Subset of the results used in comparison
            comparison: [],
            // Item to show details of
            item: null,
            // Current view the app is in
            view: -1,
            // Selector to pass to views for variable back navigation
            //backSel: null,
            // Stack to create a back navigation
            backStack: [],
            //Search parameters
            parameters: null,
            //Search parameters in query form
            query: '',
            // Last scroll position
            scrollPos: 0,
            // Event currently being edited
            editing:null,            
            // Current user
            userId: null,
            username: null ,
            failedLogin: "",
            failedCreate: "",
            // Placeholder to flag new data available
            newData:null,
            // For nav changing
            windowWidth: 0,
            //host:'http://51cafb85.ngrok.io'
            host:'http://localhost:3000'
        };

        // Bindings
        this.goToSearch = this.goToSearch.bind(this)
        this.goToResults = this.goToResults.bind(this)
        this.goToDetails = this.goToDetails.bind(this)
        this.goToComparison = this.goToComparison.bind(this)
        this.goToCreate = this.goToCreate.bind(this)
        this.goToUser = this.goToUser.bind(this)
        this.addCustomEvent = this.addCustomEvent.bind(this)
        this.deleteCustomEvent = this.deleteCustomEvent.bind(this)
        this.fetchData = this.fetchData.bind(this)
        this.submitUser = this.submitUser.bind(this)
        this.goBack = this.goBack.bind(this)
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
        this.uncheck = this.uncheck.bind(this)
        this.logoutUser = this.logoutUser.bind(this)
        this.getEvents = this.getEvents.bind(this)
        this.attending = this.attending.bind(this)
        this.customSearch = this.customSearch.bind(this)
    }

    render() {

        // Main views are in this array to easily switch them out in render
        let views = [
            <Search
            search={this.fetchData}
            results={this.goToResults}
            />,
            <ResultsView
            back={this.goBack}
            reload={this.goToResults}
            getEvents={this.fetchData}
            result={this.state.results}
            showDetail={this.goToDetails}
            compare={this.goToComparison}
            />,
            <DetailsView
            back={this.goBack}
            reload={this.goToDetails}
            item={this.state.item}
            search={this.fetchData}
            results={this.goToResults}
            parameters={this.state.parameters}
            userId={this.state.userId}
            username={this.state.username}
            attending={this.attending}
            host={this.state.host}
            whoseAttending={this.whoseAttending}
            />,
            <ComparisonView
            back={this.goBack}
            reload={this.goToComparison}
            items={this.state.comparison}
            showDetails={this.goToDetails}
            />,
            <CreateView
            back={this.goBack}
            reload={this.goToCreate}
            addEvent={this.addCustomEvent}
            deleteEvent={this.deleteCustomEvent}
            editing={this.state.editing}
            userId={this.state.userId}
            />,
            <UserView
            back={this.goBack}
            reload={this.goToUser}
            userId={this.state.userId}
            username={this.state.username}
            submitUser ={this.submitUser}
            failedLogin={this.state.failedLogin}
            failedCreate={this.state.failedCreate}
            goToDetails={this.goToDetails}
            goToCreate={this.goToCreate}
            newData={this.state.newData}
            getEvents={this.getEvents}
            host={this.state.host}
            whoseAttending={this.whoseAttending}
            />
        ]

        var nav = []
        if(this.state.view != 0)
            nav.push(["Search", (e) => this.goToSearch()])
        if(this.state.userId != null){
            nav.push(["Add Event", (e) => this.goToCreate()])
            nav.push(["Logout", (e) => this.logoutUser()])
        }
        if (this.state.userId == null)
            nav.push(["Login", (e) => this.goToUser()])
        else
            nav.push([this.state.username, (e) => this.goToUser()])

        if(this.state.windowWidth < 535)
            nav = nav.map((x) => (<li key={x[0]}> <button className="navBtn" onClick={(e) => this.uncheck(x[1])}> {x[0]}</button> </li>))
        else
            nav = nav.map(x => ((<button key={x[0]} className="navBtn mainButton" onClick={x[1]}> {x[0]}</button>)))

        return (
            <div className="wrapper">
                <div className="row header">
                    <div className="col-4-sm logoCol">
                        <img className="header_logo" src="resource/admitonelogo.png" alt="oops" />
                    </div>

                    {(this.state.windowWidth < 535)?
                    <div className="col-8-sm nav">
                        <div className="collapsible-menu">
                            <input type="checkbox" id="menu"/>
                            <label htmlFor="menu"></label>
                            <div className="menu-content" id="mcontent">
                                <ul>
                                    {nav}
                                </ul>
                            </div>
                        </div>
                    </div>
                    : 
                    <div className="col-8-sm nav"> 
                        {nav} 
                    </div>}
                </div>
                <div className="row content">
                    {this.state.view >= 0? views[this.state.view]:null}
                </div>
                <div className="row footer">
                    <h6> ◄ CSC309 Phase 3 - Team Hippo ► </h6>
                </div>
            </div>
        )
    }

    updateWindowDimensions() {
        this.setState({windowWidth: window.innerWidth})
    }

    uncheck(f) {
        document.getElementById("menu").checked = false
        document.getElementById("mcontent").style.maxHeight = 0
        setTimeout(function() { 
            document.getElementById("mcontent").style.maxHeight = "100%"
        }.bind(this), 300)
        f()
    }

    componentDidMount() {
        this.updateWindowDimensions()
        window.addEventListener('resize', this.updateWindowDimensions)

        fetch(this.state.host + '/loginUser',
        {
            method: 'get',
            credentials: 'same-origin'
        }).then(response => {
            if (response.ok)
                return response.json()
        }).then(json => {
            if (json._id != null) {
                this.setState({userId:json._id, username:json.username})
            }
        }).catch(err => {
            console.log(err)
        })
        this.goToSearch()
    }

    /**
     * Back stack
     */
    pushBack(f, currentView) {
        var backCopy = this.state.backStack.slice()
        if(this.state.view != currentView)
            backCopy.push(f)
        return backCopy
    }
    // Pop the stack and go back
    goBack() {
        var backCopy = this.state.backStack.slice()
        // Pop the top off because we don't care
        backCopy.pop()
        // Pop one more time to get the actual last value (which will get immediately added back to the array in the next step anyway)
        var f = backCopy.pop()
        this.setState({backStack:backCopy}, function () {
            f()
        })
    }

    /**
     * Go to the search view
     */
    goToSearch() {
        this.setState({view: 0, results: [], editing:null, backStack:[(x) => this.goToSearch()]})
    }

    /**
     * Go to the results view
     * @param Array results, if not null set the new results, if null reload previous ones
     */
    goToResults(results=null) {
        if(results != null) {
            var newArray = results.slice()
            this.setState({results:newArray, view: 1, backStack:this.pushBack(() => this.goToResults(results), 1), scrollPos:0})
        } else {
            // Set state and set the proper scroll checkpoint after completion
            this.setState({view: 1, backStack:this.pushBack(() => this.goToResults(results))}, function() {
                var resultsArea = document.getElementsByClassName('row results viewContent')[0]
                resultsArea.scrollTop = this.state.scrollPos
            })
        }
    }

    /**
     * Go to the details view
     * @param Object item, the TicketApp item we're showing the details of
     */
    goToDetails(item) {
        var newState = {view: 2, item:item, backStack:this.pushBack(() => this.goToDetails(item), 2)}
        // Save current scroll
        if(this.state.view == 1) {
            var resultsArea = document.getElementsByClassName('row results viewContent')[0]
            newState.scrollPos = resultsArea.scrollTop
        }
        this.setState(newState)
    }

    /**
     * Go to the comparison view
     * @param Array items, if not null, set the subset of items to compare, if null reload previous ones
     */
    goToComparison(items) {
        var resultsArea = 0;
        if(this.state.view == 1)
            resultsArea = document.getElementsByClassName('row results viewContent')[0]

        var newState = {view: 3, scrollPos: resultsArea.scrollTop, backStack:this.pushBack(() => this.goToComparison(items), 3)}

        if(items != null) {
            var newArray = items.slice()
            newState.comparison = items
        }
        this.setState(newState)
    }

    /**
     * Go to create view
     */
    goToCreate(toedit=null) {
        /*toedit =  {_id: "51123123123klsjadf", 
            parameters: {
                title:"SueprDuper",
                purchaseURL:"123 asdf",
                date:"yyyy-mm-dd",
                time:"12:00EST",
                venue:"dasdf",
                address:"asfd",
                city:"asdf",
                province:"ON",
                country:"CA",
                postalCode:"asdf"
            },
            optional: {
                imageURL:"",
                additionInfo:"",
                tags: "",
                facebook:"",
                twitter:"",
                instagram:"",
                youtube:"",
                apple:"",
                lastfm:""
            }
        }*/
        var newState = {view:4, backStack:this.pushBack(() => this.goToCreate(toedit), 4)}
        if(toedit != null)
            newState.editing = toedit
        
        this.setState(newState)
    }

    /**
     * Go to user view
     */
    goToUser() {
        this.setState({view:5, failedLogin:"", failedCreate: "", backStack:this.pushBack(() => this.goToUser(), 5)})
    }


    fetchData(param, page, append, callback) {
        // Build parameter string to add to search url
        let queryCat = '';

        // When this function is called from search view to load the first page of search request
        if (page === 0) {
            for(let parameter in param) {
                if (param[parameter] !== '') {
                    if (parameter === "startDateTime") {
                        let startDateTimeCopy = param[parameter];
                        queryCat = queryCat.concat('&' + parameter + '=' +
                            String(startDateTimeCopy));
                        queryCat = queryCat.concat("T00:00:00Z");
                    } else if (parameter === "endDateTime") {
                        let endDateTimeCopy = param[parameter];
                        queryCat = queryCat.concat('&' + parameter + '=' +
                            String(endDateTimeCopy));
                        queryCat = queryCat.concat("T23:59:59Z");
                    } else {
                        queryCat = queryCat.concat('&' + parameter + '=' +
                            param[parameter]);
                    }
                }
            }
            queryCat = queryCat.concat("&sort=date,asc");
            this.setState({query: queryCat, parameters: param});
            // When this function is called from results view to load next pages.
        } else {
            queryCat = this.state.query + "&page=" + page
        }
        var url = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=GiSmszJzsoobutvFJt9QoGXUVMVHV68R" + queryCat

        fetch(url)
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    this.customSearch(param, [], append, callback)
                    throw "No Data"
                }
            })
            .then(json => {
                // No more items
                let newItems = [];
                // Check if there are events returned
                if (json._embedded != null && json.page.totalElements !== 0) {
                    for (let item in json._embedded.events) {
                        newItems.push(json._embedded.events[item])
                    }

                    // Callback is passed when this function is called from
                    // search view - callback would be goToResults
                    //this.addEvents(newItems, append, callback)
                    newItems = RepackageItems(newItems)
                }

                //
                // Basic searching including custom events
                //
                if(page == 0) {
                    this.customSearch(param, newItems, append, callback)
                    //var data = null
                    //// Search parameters
                    //if(param != null) data = param 
                    //else data = this.state.parameters

                    //console.log("LOOKING FOR ")
                    //console.log(data)
                    //fetch(this.state.host + '/search',
                        //{
                            //method: 'post',
                            //body: JSON.stringify(data),
                            //headers: {'Content-Type': 'application/json'}
                        //}).then(response => {
                            //if(response.ok)
                                //return response.json()
                            //else
                                //throw "No Data"
                        //}).then(json => {
                            //this.addEvents(json.concat(newItems), append, callback)
                        //}).catch(error => console.log(error))
                } else {
                    this.addEvents(newItems, append, callback)
                }
                    
                
            }).catch(err => {
                console.log(err)
                this.customSearch(param, [], append, callback)
            })
    }

    customSearch(param, currentItems, append, callback) {
        var data = null
        // Search parameters
        if(param != null) data = param 
        else data = this.state.parameters

        fetch(this.state.host + '/search',
            {
                method: 'post',
                body: JSON.stringify(data),
                headers: {'Content-Type': 'application/json'}
            }).then(response => {
                if(response.ok)
                    return response.json()
                else
                    throw "No Data"
            }).then(json => {
                this.addEvents(json.concat(currentItems), append, callback)
            }).catch(error => console.log(error))
    }

    // Add/Append items to result
    addEvents(items, append, callback) {
        if(append)
            callback(this.state.results.concat(items))
        else
            callback(items)
    }

    /**
     * Add Custom Event
     */
    addCustomEvent(parameters, optional) {
        // If we are currently editing this event, put instead of post!
        var method = 'post'
        var data = {userId: this.state.userId, parameters: parameters, optional: optional}
        if(this.state.editing != null) {
            data._id = this.state.editing._id
            method = 'put'
        }

        // Get user id and add {parameters, optional} to the database
        fetch(this.state.host + '/createEvent', 
            {
                method: method, 
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
                console.log("New event data")
                console.log(json)
                // Update userpage
                this.setState({newData:json})
            }).catch(error => console.log(error))
        this.setState({editing:null})
    }

    /**
     * Delete Custom Event
     */
    deleteCustomEvent(id) {
        console.log("Deleting event id: " + id)

        fetch(this.state.host + '/users/' + this.state.userId + '/events/'+id,
            {
                method: 'delete',
            }).then(response => {
                if(!response.ok)
                    throw "Error deleting " + id
            }).catch(err => console.log(err))

        this.setState({editing:null})
    }

    /**
     * Submit user, either creating a new user or logging in existing, set current user to returned value
     */
    submitUser(type, data) {
        var url = this.state.host + '/' + type + '/';
        fetch(url,
            {
                method: 'post',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin'
            }).then(response => {
                if(response.ok)
                    return response.json()
                else
                    throw "No Data"
            }).then(json => {
                // Set current user to the returned user
                if(json.failedLogin != null) {
                    this.setState({failedLogin: json.failedLogin})
                    console.log("Login failed")
                } else if (json.failedCreate != null) {
                    this.setState({failedCreate: json.failedCreate})
                    console.log("Create user failed")
                } else {
                    this.setState({userId:json._id, username:json.username})
                }
            }).catch(err => {
                console.log(err)
            })
    }

    /**
     * Logout user
     */
    logoutUser() {
        fetch(this.state.host + '/logoutUser',
        {
            method: 'post',
            credentials: 'same-origin'
        }).then(response => {
            if (response.ok) {
                this.setState({
                    userId: null,
                    username: null ,
                    failedLogin: "",
                    failedCreate: ""
                })
            }
        }).catch(err => {
            console.log(err)
        })

    }

    /**
     * Get events for a user
     */
    getEvents(userId, callback) {
        // Get list of events
        var eventList = []
        fetch(this.state.host + '/users/' + userId)
            .then(response => {
                if(response.ok) {
                    return response.json()
                } else 
                    throw "No Data"
            }).then(json => {
                callback({eventList:json.eventList, attending:json.attending})
            }).catch(error => console.log(error))

    }

    /**
     * Set a user to attending an event
     */
    attending(yesno, id, userId, callback) {
        // Either delete attending from self or add it
        if(yesno) {
            var data ={_id:id}
            fetch(this.state.host + '/events/' + id + '/attending/' + userId, 
                {
                    method: 'post',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }) .then(response => {
                    if(response.ok)
                        return response.json()
                    else
                        throw "Error adding " + id + ", no data"

                }).then(json => {

                    callback(json)
                }) .catch(error => console.log(error))
        } else {
            fetch(this.state.host + '/events/' + id + '/attending/' + userId,
            {
                method: 'delete'
            }).then(response => {
                if(response.ok)
                    return response.json()
                else
                    throw "Error deleting event " + id + " from user " + userId + " attending"
            }).then(json => {
                callback(json)

            }).catch(err => console.log(err))
        }
    }

    /**
     * Get list of people attending this event
     */
    whoseAttending(host, id, callback) {
        fetch(host + '/events/' + id + '/attending/')
            .then(response => {
                if(response.ok) {
                    return response.json()
                } else 
                    throw "No Data"
            }).then(json => {
                callback(json)
            }).catch(error => console.log(error))
    }

}

ReactDOM.render(<TicketApp />, document.getElementById('root'));
