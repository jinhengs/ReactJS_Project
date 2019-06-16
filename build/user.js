class UserView extends React.Component {
    constructor(props) {
        super(props);
        var placeholder = {
            "_id": {
                "$oid": "N/A"
            },
            "userId": "N/A",
            "parameters": {
                "title": "Hello",
                "priceRange": "asdf",
                "venue": "asdf",
                "city": "toronto",
                "province": "ON",
                "country": "CA"
            },
            "optional": {
                "imageURL": "resource/default.jpg"
            }
        };
        this.state = {
            parameters: {
                username: "",
                password: "",
                confirmpassword: ""
            },
            creatPageNum: 1,
            attendPageNum: 1,
            eventList: [],
            attending: [],
            createdPage: [placeholder, placeholder, placeholder, placeholder],
            attendPage: [placeholder, placeholder, placeholder, placeholder],
            createdPageNum: 1,
            attendPageNum: 1,
            eventsPerPage: 2
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.initialize = this.initialize.bind(this);
        this.removeAttending = this.removeAttending.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
        this.editEvent = this.editEvent.bind(this);
    }

    handleChange(event) {
        let parametersCopy = this.state.parameters;
        parametersCopy[event.target.name] = event.target.value;
        this.setState({ parameters: parametersCopy });
    }

    handleSubmit(event, type) {
        event.preventDefault();
        console.log("Creating/loging in with username: " + this.state.parameters.username + " and password: " + this.state.parameters.password);

        this.props.submitUser(type, this.state.parameters);
        //this.props.back(null)
    }

    /**
     * Does work to initialize users events
     * @params userId, id to initialize info with
     */
    componentDidMount() {
        this.initialize(this.props.userId);
    }
    componentWillReceiveProps(props) {
        this.initialize(props.userId);
    }
    initialize(userId) {
        var userPage = this;
        if (userId != null) {
            // Get list of attending
            var eventList = [];
            fetch('http://localhost:3000/users/' + userId).then(response => {
                if (response.ok) {
                    return response.json();
                } else throw "No Data";
            }).then(json => {
                this.setState({ eventList: json.eventList, attending: json.attending });
                this.setupPage(0);
                this.setupPage(1);
            }).catch(error => console.log(error));
        }
    }

    /**
     * Go to details of an event
     * @param item, actual event item from either eventList or attending
     */
    goToDetails(item) {
        this.props.goToDetails(item);
    }

    /**
     * Go to the edit page of an event
     * @param item, actual event item from either eventList or attending
     */
    editEvent(item) {
        this.props.goToCreate(item);
    }

    /**
     * Delete a specific event from a users custom events
     * @param item, event to remove from eventList
     */
    deleteEvent(item) {
        console.log("Trying to delete event");
        fetch('http://localhost:3000/users/' + this.props.userId + '/events/' + item._id, {
            method: 'delete'
        }).then(response => {
            if (!response.ok) throw "Error deleting " + item._id;else var eventListCopy = this.state.eventList.filter(x => x._id != item._id);
            var attendingCopy = this.state.attending.filter(x => x._id != item._id);
            this.setState({ eventList: eventListCopy, attending: attendingCopy });
        }).then(() => {
            this.setupPage(0);
            this.setupPage(1);
            //        this.goToPage(this.state.createdPageNum, 0)
            //        this.goToPage(this.state.attendPageNum, 1)
        }).catch(err => console.log(err));
    }

    /**
     * Remove from a userss list of attending events
     * @param item, event to remove from users attending
     */
    removeAttending(item) {
        fetch('http://localhost:3000/events/' + item._id + '/attending/' + this.props.userId, {
            method: 'delete'
        }).then(response => {
            if (response.ok) return response.json();else throw "Error deleting event " + item._id + " from user " + this.props.userId + " attending";
        }).then(json => {
            var attendingCopy = this.state.attending.filter(x => x._id != item._id);
            this.setState({ attending: attendingCopy });
        }).then(() => {
            this.setupPage(1);
        }).then(() => {
            //              this.goToPage(this.state.attendPage, 1)
        }).catch(err => console.log(err));
    }

    setupPage(num) {
        var placeholder = {
            "_id": {
                "$oid": "N/A"
            },
            "userId": "N/A",
            "parameters": {
                "title": "Hello",
                "priceRange": "asdf",
                "venue": "asdf",
                "city": "toronto",
                "province": "ON",
                "country": "CA"
            },
            "optional": {
                "imageURL": "resource/default.jpg"
            }
        };
        var array = [];
        for (var a = 0; a < this.state.eventsPerPage; a++) {
            array.push(placeholder);
        }
        if (num == 0) {
            for (var a = 0; a < Math.min(this.state.eventsPerPage, this.state.eventList.length); a++) {
                array[a] = this.state.eventList[a];
            }
            this.setState({ createdPage: array });
        } else {
            for (var b = 0; b < Math.min(this.state.eventsPerPage, this.state.attending.length); b++) {
                array[b] = this.state.attending[b];
            }
            this.setState({ attendPage: array });
        }
    }

    goToPage(pageNum, choice) {
        var placeholder = {
            "_id": {
                "$oid": "N/A"
            },
            "userId": "N/A",
            "parameters": {
                "title": "Hello",
                "priceRange": "asdf",
                "venue": "asdf",
                "city": "toronto",
                "province": "ON",
                "country": "CA"
            },
            "optional": {
                "imageURL": "resource/default.jpg"
            }
        };
        var epp = this.states.eventsPerPage;
        var array = [];
        for (var a = 0; a < epp; a++) {
            array.push(placeholder);
        }

        var index = (pageNum - 1) * epp;
        if (choice == 0) {
            if (pageNum > Math.ceil(this.state.eventList.length * 1.0 / epp)) {
                goToPage(Math.ceil(this.state.eventList.length * 1.0 / epp), 0);
                return;
            } else {
                for (var b = 0; b < epp; b++) {
                    if (index + b - 1 > this.state.eventList.length) {
                        break;
                    }
                    array[b] = this.state.eventList[b + index];
                }
            }
            this.setState({ createdPage: array, createPageNum: pageNum });
        } else {
            if (pageNum > Math.ceil(this.state.attending.length * 1.0 / epp)) {
                goToPage(Math.ceil(this.state.attending.length * 1.0 / epp), 0);
                return;
            } else {
                for (var b = 0; b < epp; b++) {
                    if (index + b - 1 > this.state.attending.length) {
                        break;
                    }
                    array[b] = this.state.attending[b + index];
                }
            }
            console.log("changing to page: " + pageNum);
            this.setState({ attendPage: array, attendPageNum: pageNum });
        }
    }

    changePage(num, choice) {
        var epp = this.state.eventsPerPage;
        var placeholder = {
            "_id": {
                "$oid": "N/A"
            },
            "userId": "N/A",
            "parameters": {
                "title": "Hello",
                "priceRange": "asdf",
                "venue": "asdf",
                "city": "toronto",
                "province": "ON",
                "country": "CA"
            },
            "optional": {
                "imageURL": "resource/default.jpg"
            }
        };
        var array = [];
        for (var a = 0; a < epp; a++) {
            array.push(placeholder);
        }
        if (choice == 0) {
            if (this.state.eventList.length < epp) {
                return;
            }
        } else {
            if (this.state.attending.length < epp) {
                return;
            }
        }
        if (choice == 0) {
            var pNum = this.state.createPageNum;
        } else {
            var pNum = this.state.attendPageNum;
        }
        if (choice == 0) {
            var maxNum = Math.ceil(this.state.eventList.length * 1.0 / epp);
        } else {
            var maxNum = Math.ceil(this.state.attending.length * 1.0 / epp);
        }
        var newIndex = 1;
        if (num == -1) {
            if (pNum == 1) {
                newIndex = (maxNum - 1) * epp;
                pNum = maxNum;
            } else {
                newIndex = (pNum - 2) * epp;
                pNum--;
            }
        }
        if (num == 1) {
            if (pNum == maxNum) {
                newIndex = 0;
                pNum = 1;
            } else {
                newIndex = pNum * epp;
                pNum++;
            }
        }
        for (var a = 0; a < epp; a++) {
            if (choice == 0) {
                if (newIndex + a > this.state.eventList.length - 1) {} else {
                    array[a] = this.state.eventList[a + newIndex];
                }
            } else {
                if (newIndex + a > this.state.attending.length - 1) {} else {
                    array[a] = this.state.attending[a + newIndex];
                }
            }
        }
        if (array[0].userId == "N/A") {
            return;
        }
        if (choice == 0) {
            this.setState({ createdPage: array, createdPageNum: pNum });
        } else {
            this.setState({ attendPage: array, attendPageNum: pNum });
        }
    }

    render() {

        // Map custom events
        var eventList = this.state.createdPage.slice(0, this.state.eventsPerPage).filter(x => x.userId != "N/A").map(x => React.createElement(
            "div",
            { key: x._id, className: "userEvent event__grid", style: { backgroundImage: `url(${x.optional.imageURL})` } },
            React.createElement(
                "div",
                { className: "row userButtonRow" },
                React.createElement(
                    "button",
                    { className: "xButton mainButton", onClick: () => this.deleteEvent(x) },
                    " x "
                ),
                React.createElement(
                    "button",
                    { className: "mainButton", onClick: () => this.editEvent(x) },
                    " edit "
                )
            ),
            React.createElement(
                "div",
                { className: "result__grid", onClick: e => this.goToDetails(x) },
                React.createElement(
                    "div",
                    { className: "result__desc" },
                    React.createElement(
                        "div",
                        { className: "event__title" },
                        x.parameters.title
                    ),
                    React.createElement(
                        "div",
                        { className: "event__desc" },
                        ValidLocation(x)
                    ),
                    React.createElement(
                        "div",
                        { className: "event__desc" },
                        x.parameters.date
                    )
                )
            )
        ));

        var attendingList = this.state.attendPage.slice(0, this.state.eventsPerPage).filter(x => x.userId != "N/A").map(x => React.createElement(
            "div",
            { key: x.id_, className: "userEvent event__grid", style: { backgroundImage: `url(${x.optional.imageURL})` } },
            React.createElement(
                "div",
                { className: "row userButtonRow" },
                React.createElement(
                    "button",
                    { className: "xButton mainButton", onClick: () => this.removeAttending(x) },
                    " x "
                )
            ),
            React.createElement(
                "div",
                { className: "result__grid", onClick: e => this.goToDetails(x) },
                React.createElement(
                    "div",
                    { className: "result__desc" },
                    React.createElement(
                        "div",
                        { className: "event__title" },
                        x.parameters.title
                    ),
                    React.createElement(
                        "div",
                        { className: "event__desc" },
                        ValidLocation(x)
                    ),
                    React.createElement(
                        "div",
                        { className: "event__desc" },
                        x.parameters.date
                    )
                )
            )
        ));

        var attendingPagesTotal = Math.ceil(this.state.attending.length / this.state.eventsPerPage);
        var eventsPagesTotal = Math.ceil(this.state.eventList.length / this.state.eventsPerPage);

        console.log(this.state.createdPageNum);

        return React.createElement(
            "div",
            { className: "view" },
            React.createElement(
                "div",
                { className: "row viewTitle" },
                React.createElement(
                    "div",
                    { className: "col-10-sm" },
                    React.createElement(
                        "h3",
                        null,
                        this.props.userId == null ? "User" : this.props.username
                    )
                ),
                React.createElement(
                    "div",
                    { className: "col-2-sm" },
                    React.createElement(
                        "button",
                        { className: "backBtn mainButton", onClick: e => this.props.back() },
                        " Back "
                    )
                )
            ),
            React.createElement(
                "div",
                { className: "row viewContent" },
                this.props.userId != null ? React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(
                        "div",
                        { className: "col-6" },
                        React.createElement(
                            "div",
                            { className: "row userTitle mainTitle" },
                            React.createElement(
                                "h3",
                                null,
                                "Events"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement(
                                "div",
                                { className: "col-6-sm" },
                                React.createElement(
                                    "h3",
                                    { "class": "pageNum" },
                                    "Page ",
                                    this.state.createdPageNum,
                                    "/",
                                    eventsPagesTotal
                                )
                            ),
                            eventsPagesTotal > 1 ? React.createElement(
                                "div",
                                { className: "col-6-sm" },
                                React.createElement(
                                    "button",
                                    { className: "prevNext mainButton", onClick: () => this.changePage(1, 0) },
                                    " next"
                                ),
                                React.createElement(
                                    "button",
                                    { className: "prevNext mainButton", onClick: () => this.changePage(-1, 0) },
                                    " prev"
                                )
                            ) : null
                        ),
                        React.createElement(
                            "div",
                            { className: "row" },
                            eventList
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "col-6" },
                        React.createElement(
                            "div",
                            { className: "row userTitle mainTitle" },
                            React.createElement(
                                "h3",
                                null,
                                "Attending"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement(
                                "div",
                                { className: "col-6-sm" },
                                React.createElement(
                                    "h3",
                                    { "class": "pageNum" },
                                    "Page ",
                                    this.state.attendPageNum,
                                    "/",
                                    attendingPagesTotal
                                )
                            ),
                            attendingPagesTotal > 1 ? React.createElement(
                                "div",
                                { className: "col-6-sm" },
                                React.createElement(
                                    "button",
                                    { className: "prevNext mainButton", onClick: () => this.changePage(1, 1) },
                                    " next"
                                ),
                                React.createElement(
                                    "button",
                                    { className: "prevNext mainButton", onClick: () => this.changePage(-1, 1) },
                                    " prev"
                                )
                            ) : null
                        ),
                        React.createElement(
                            "div",
                            { className: "row" },
                            attendingList
                        )
                    )
                ) : React.createElement(
                    "div",
                    { className: "user__forms" },
                    React.createElement(
                        "form",
                        { className: "advancedSearch userLogon", onSubmit: e => this.handleSubmit(e, 'loginUser') },
                        React.createElement(
                            "h6",
                            null,
                            " Log in "
                        ),
                        React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement("input", {
                                name: "username",
                                value: this.state.username,
                                placeholder: "Enter Username",
                                onChange: this.handleChange })
                        ),
                        React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement("input", {
                                name: "password",
                                value: this.state.password,
                                placeholder: "Enter Password",
                                onChange: this.handleChange })
                        ),
                        this.props.failedLogin !== "" ? React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement(
                                "h3",
                                null,
                                " Username taken or password incorrect "
                            )
                        ) : null,
                        React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement(
                                "button",
                                { className: "searchButton mainButton",
                                    name: "userSubmit",
                                    type: "submit" },
                                " Submit "
                            )
                        )
                    ),
                    React.createElement(
                        "form",
                        { className: "advancedSearch userLogon", onSubmit: e => this.handleSubmit(e, 'createUser') },
                        React.createElement(
                            "h6",
                            null,
                            " Create a new account "
                        ),
                        React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement("input", {
                                name: "username",
                                value: this.state.username,
                                placeholder: "Enter Username",
                                onChange: this.handleChange })
                        ),
                        React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement("input", {
                                name: "password",
                                value: this.state.password,
                                placeholder: "Enter Password",
                                onChange: this.handleChange })
                        ),
                        React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement("input", {
                                name: "confirmpassword",
                                value: this.state.confirmpassword,
                                placeholder: "Confirm Password",
                                onChange: this.handleChange })
                        ),
                        this.props.failedCreate !== "" ? React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement(
                                "h3",
                                null,
                                this.props.failedCreate
                            )
                        ) : null,
                        React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement(
                                "button",
                                { className: "searchButton mainButton",
                                    name: "userSubmit",
                                    type: "submit" },
                                " Submit "
                            )
                        )
                    )
                )
            )
        );
    }
}