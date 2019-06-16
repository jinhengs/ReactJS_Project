class CreateView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputWarning: false,
            parameters: {
                title: "",
                purchaseURL: "",
                priceRange: "",
                date: "yyyy-mm-dd",
                time: "12:00EST",
                venue: "",
                address: "",
                city: "",
                province: "ON",
                country: "CA",
                postalCode: ""
            },
            optional: {
                imageURL: "",
                additionalInfo: "",
                seatMap: "",
                tags: "",
                facebook: "",
                twitter: "",
                instagram: "",
                youtube: "",
                itunes: "",
                lastfm: "",
                homepage: ""
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeOptional = this.handleChangeOptional.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
        this.fillFields = this.fillFields.bind(this);
        this.initialize = this.initialize.bind(this);
    }
    componentDidMount() {
        this.initialize(this.props);
    }
    componentWillReceiveProps(props) {
        this.initialize(props);
    }

    initialize(props) {
        if (props.editing != null) {
            this.fillFields(props.editing.parameters, props.editing.optional);
        }
    }

    /**
     * Fill fields
     * Using an exiting event fill the fields
     */
    fillFields(newParameters, newOptional) {
        this.setState({ parameters: newParameters, optional: newOptional });
    }

    /**
     * Handle Change
     */
    handleChange(event) {
        let parametersCopy = this.state.parameters;
        parametersCopy[event.target.name] = event.target.value;
        this.setState({ parameters: parametersCopy });
    }
    handleChangeOptional(event) {
        let optionalCopy = this.state.optional;
        optionalCopy[event.target.name] = event.target.value;
        this.setState({ optional: optionalCopy });
    }

    /**
     * Handle Submit
     */
    handleSubmit(event) {
        event.preventDefault();
        if (!this.handleEmptyForm()) {
            this.setState({ inputWarning: true });
        } else {
            //First page of search results
            let optionalCopy = this.state.optional;
            if (optionalCopy["imageURL"] == "") optionalCopy["imageURL"] = "resource/default.jpg";

            if (optionalCopy.tags != "") optionalCopy.tags = optionalCopy.tags.split(',');else optionalCopy.tags = [];

            this.props.addEvent(this.state.parameters, optionalCopy);
            this.props.back();
        }
    }

    /**
     * Handle Empty Form
     */
    handleEmptyForm() {
        for (let parameter in this.state.parameters) {
            if (this.state.parameters[parameter] == "") {
                return false;
            }
        }
        return true;
    }

    /**
     * Delete event
     */
    deleteEvent() {
        this.props.deleteEvent(this.props.editing._id);
        this.props.back(null);
    }

    render() {
        var mainInfo = ["time", "purchaseURL", "priceRange", "venue", "address", "city", "province", "country", "postalCode"].map(x => React.createElement(
            "div",
            { className: "col-4", key: x },
            React.createElement(
                "div",
                { className: "row" },
                x
            ),
            React.createElement(
                "div",
                { className: "row" },
                React.createElement("input", { name: x, value: this.state.parameters[x], onChange: this.handleChange })
            )
        ));
        var optionalInfo = ["imageURL", "additionalInfo", "tags", "facebook", "twitter", "instagram", "youtube", "itunes", "lastfm"].map(x => React.createElement(
            "div",
            { className: "col-4", key: x },
            React.createElement(
                "div",
                { className: "row" },
                x
            ),
            React.createElement(
                "div",
                { className: "row" },
                React.createElement("input", { name: x, value: this.state.optional[x], onChange: this.handleChangeOptional })
            )
        ));

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
                        this.props.editing == null ? "Create an event!" : "Update your event"
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
                this.props.userId == null ? React.createElement(
                    "div",
                    { className: "error" },
                    React.createElement(
                        "h3",
                        null,
                        " Please log in to create an event "
                    )
                ) : React.createElement(
                    "form",
                    { className: "advancedSearch createEvent", onSubmit: this.handleSubmit },
                    React.createElement(
                        "h6",
                        null,
                        "Info"
                    ),
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "col-12", key: "title " },
                            React.createElement(
                                "div",
                                { className: "row" },
                                "Title"
                            ),
                            React.createElement(
                                "div",
                                { className: "row" },
                                React.createElement("input", { name: "title", value: this.state.parameters["title"], onChange: this.handleChange })
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "col-4", key: "date" },
                            React.createElement(
                                "div",
                                { className: "row" },
                                "Date"
                            ),
                            React.createElement(
                                "div",
                                { className: "row" },
                                React.createElement("input", { onClick: this.getMinimumStartDateRange, name: "date",
                                    ref: this.getMinimumStartDateRange,
                                    type: "date", id: "endDT", min: "2000-01-01",
                                    value: this.state.parameters.date,
                                    onChange: this.handleChange })
                            )
                        ),
                        mainInfo
                    ),
                    React.createElement(
                        "h6",
                        null,
                        "Optional"
                    ),
                    optionalInfo,
                    React.createElement(
                        "div",
                        { style: { display: this.state.inputWarning ? '' : 'None' } },
                        React.createElement(
                            "h3",
                            null,
                            "Please complete all fields under info"
                        )
                    ),
                    this.props.editing != null ? React.createElement(
                        "button",
                        { className: "createButton deleteButton mainButton",
                            name: "delete", onClick: this.deleteEvent },
                        " Delete "
                    ) : null,
                    React.createElement(
                        "button",
                        { className: "createButton mainButton",
                            name: "createSubmit",
                            type: "submit" },
                        " ",
                        this.props.editing == null ? "Submit" : "Update",
                        " "
                    )
                )
            )
        );
    }
}