class CreateView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            inputWarning:false,
            parameters: {
                title:"",
                purchaseURL:"",
                priceRange:"",
                date:"yyyy-mm-dd",
                time:"12:00EST",
                venue:"",
                address:"",
                city:"",
                province:"ON",
                country:"CA",
                postalCode:""
            },
            optional: {
                imageURL:"",
                additionalInfo:"",
                seatMap: "",
                tags: "",
                facebook:"",
                twitter:"",
                instagram:"",
                youtube:"",
                itunes:"",
                lastfm:"",
                homepage:""
            }
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleChangeOptional = this.handleChangeOptional.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.deleteEvent = this.deleteEvent.bind(this)
        this.fillFields = this.fillFields.bind(this)
        this.initialize = this.initialize.bind(this)
    }
    componentDidMount() { this.initialize(this.props) }
    componentWillReceiveProps(props) { this.initialize(props) }

    initialize(props) {
        if(props.editing != null) {
            this.fillFields(props.editing.parameters, props.editing.optional);
        }
    }

    /**
     * Fill fields
     * Using an exiting event fill the fields
     */
    fillFields(newParameters, newOptional) {
        this.setState({parameters: newParameters, optional:newOptional})

    }

    /**
     * Handle Change
     */
    handleChange(event) {
        let parametersCopy = this.state.parameters;
        parametersCopy[event.target.name] = event.target.value;
        this.setState({parameters: parametersCopy});
    }
    handleChangeOptional(event) {
        let optionalCopy = this.state.optional;
        optionalCopy[event.target.name] = event.target.value;
        this.setState({optional: optionalCopy});
    }

    /**
     * Handle Submit
     */
    handleSubmit(event) {
        event.preventDefault();
        if (!this.handleEmptyForm()) {
            this.setState({inputWarning:true})
        } else {
            //First page of search results
            let optionalCopy = this.state.optional;
            if(optionalCopy["imageURL"] == "")
                optionalCopy["imageURL"] = "resource/default.jpg"

            if(optionalCopy.tags != "")
                optionalCopy.tags = optionalCopy.tags.split(',')
            else
                optionalCopy.tags = []
            
            this.props.addEvent(this.state.parameters, optionalCopy)
            this.props.back()
        }
    }

    /**
     * Handle Empty Form
     */
    handleEmptyForm() {
        for(let parameter in this.state.parameters) {
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
        this.props.deleteEvent(this.props.editing._id)
        this.props.back(null)
    }

    render () {
        var mainInfo = ["time", "purchaseURL","priceRange", "venue", "address", "city", "province", "country", "postalCode"].map((x) => 
            (<div className="col-4" key={x}> 
                <div className="row">{x}</div> 
                <div className="row"><input name={x} value={this.state.parameters[x]} onChange={this.handleChange}/></div>
            </div>))
        var optionalInfo = ["imageURL", "additionalInfo", "tags", "facebook", "twitter", "instagram", "youtube", "itunes", "lastfm"].map((x) => 
            (<div className="col-4" key={x}> 
                <div className="row">{x}</div> 
                <div className="row"><input name={x} value={this.state.optional[x]} onChange={this.handleChangeOptional}/></div>
            </div>))

        return (
            <div className="view">   
                <div className="row viewTitle">
                    <div className="col-10-sm">
                        <h3>{this.props.editing==null?"Create an event!":"Update your event"}</h3>
                    </div>
                    <div className="col-2-sm">
                        <button className="backBtn mainButton" onClick={(e) => this.props.back()}> Back </button>
                    </div>
                </div>
                <div className="row viewContent">
                    {this.props.userId == null ? 
                            <div className="error">
                                <h3> Please log in to create an event </h3>
                            </div> :
                    <form className="advancedSearch createEvent" onSubmit={this.handleSubmit}>
                        <h6>Info</h6>
                        <div className="row">
                            <div className="col-12" key="title "> 
                                <div className="row">
                                    Title
                                </div>
                                <div className="row">
                                    <input name="title" value={this.state.parameters["title"]} onChange={this.handleChange}/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4" key="date"> 
                                <div className="row">
                                    Date
                                </div>
                                <div className="row">
                                    <input onClick={this.getMinimumStartDateRange} name="date"
                                        ref={this.getMinimumStartDateRange}
                                        type="date" id="endDT" min="2000-01-01"
                                        value={this.state.parameters.date}
                                        onChange={this.handleChange}/>
                                </div>
                            </div>
                            {mainInfo}
                        </div>
                        <h6>Optional</h6>
                        {optionalInfo}
                        <div style={{display: this.state.inputWarning ? '' : 'None'}}>
                            <h3>Please complete all fields under info</h3>
                        </div>
                        {this.props.editing!=null?
                        <button className="createButton deleteButton mainButton"
                                name="delete" onClick={this.deleteEvent}> Delete </button>
                            :null}
                        <button className="createButton mainButton"
                                name="createSubmit"
                                type="submit"> {this.props.editing==null?"Submit":"Update"} </button>
                    </form>}
                </div>
            </div>)

    }
}
