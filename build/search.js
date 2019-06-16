class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = { parameters: { keyword: '', city: '', postalCode: '',
                radius: '', unit: '', startDateTime: '', endDateTime: '',
                latlong: '' }, advancedSearchDisplay: 'none',
            advancedSearchButton: 'Show Advanced Search',
            loaderDisplay: 'none' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmptyForm = this.handleEmptyForm.bind(this);
        this.getMinimumStartDateRange = this.getMinimumStartDateRange.bind(this);
        this.toggleAdvancedSearch = this.toggleAdvancedSearch.bind(this);
        this.getCurrentLocation = this.getCurrentLocation.bind(this);
        this.toggleAdvancedSearch = this.toggleAdvancedSearch.bind(this);
        this.handleLocation = this.handleLocation.bind(this);
        this.showError = this.showError.bind(this);
    }

    handleChange(event) {
        let parametersCopy = this.state.parameters;
        parametersCopy[event.target.name] = event.target.value;
        this.setState({ parameters: parametersCopy });
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.handleEmptyForm()) {
            alert("Please enter search text.");
        } else {
            //First page of search results
            const page = 0;
            this.props.search(this.state.parameters, page, false, this.props.results);
        }
    }

    handleEmptyForm() {
        for (let parameter in this.state.parameters) {
            if (this.state.parameters[parameter] !== '') {
                return false;
            }
        }
        return true;
    }

    render() {
        return React.createElement(
            'div',
            { className: 'view' },
            React.createElement(
                'div',
                { className: 'row viewTitle' },
                React.createElement(
                    'div',
                    { className: 'col-12-sm' },
                    React.createElement(
                        'h3',
                        null,
                        'What events are you looking for?'
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'form',
                    { className: 'search', onSubmit: this.handleSubmit },
                    React.createElement('input', { className: 'keywordSearch',
                        type: 'text',
                        value: this.state.parameters.keyword,
                        name: 'keyword',
                        placeholder: 'Search...',
                        onChange: this.handleChange }),
                    React.createElement(
                        'button',
                        { className: 'searchButton mainButton',
                            name: 'submitForm',
                            type: 'submit' },
                        React.createElement('i', { className: 'fa fa-search' })
                    ),
                    React.createElement('input', { type: 'button', onClick: this.toggleAdvancedSearch,
                        className: 'mainButton', name: 'advancedSearch',
                        value: this.state.advancedSearchButton }),
                    React.createElement(
                        'div',
                        { className: 'advancedSearch',
                            style: { display: this.state.advancedSearchDisplay } },
                        React.createElement(
                            'h6',
                            null,
                            'Date Range'
                        ),
                        'From',
                        React.createElement('input', { ref: this.getMinimumStartDateRange, name: 'startDateTime',
                            min: '2000-01-01', type: 'date', id: 'startDT',
                            value: this.state.parameters.startDateTime,
                            onChange: this.handleChange }),
                        React.createElement('br', null),
                        'To',
                        React.createElement('input', { onClick: this.getMinimumStartDateRange, name: 'endDateTime',
                            ref: this.getMinimumStartDateRange,
                            type: 'date', id: 'endDT', min: '2000-01-01',
                            value: this.state.parameters.endDateTime,
                            onChange: this.handleChange }),
                        React.createElement(
                            'h6',
                            null,
                            'Location'
                        ),
                        'City',
                        React.createElement('input', { name: 'city', type: 'text',
                            value: this.state.parameters.city,
                            onChange: this.handleChange }),
                        React.createElement('br', null),
                        'Radius',
                        React.createElement('input', { type: 'number', name: 'radius', min: '1', max: '100',
                            value: this.state.parameters.radius,
                            onChange: this.handleChange }),
                        React.createElement(
                            'select',
                            { name: 'unit', onChange: this.handleChange,
                                value: this.state.parameters.unit },
                            React.createElement(
                                'option',
                                { value: '', disabled: true, selected: true, hidden: true },
                                'Unit...'
                            ),
                            React.createElement(
                                'option',
                                { value: 'km' },
                                'Kilometers'
                            ),
                            React.createElement(
                                'option',
                                { value: 'miles' },
                                'Miles'
                            )
                        ),
                        React.createElement('input', { type: 'button', onClick: this.getCurrentLocation,
                            className: 'mainButton',
                            name: 'latlong', value: 'Get Location' }),
                        React.createElement('br', null)
                    )
                )
            ),
            React.createElement('div', { id: 'loader',
                style: { display: this.state.loaderDisplay } })
        );
    }

    getMinimumStartDateRange() {
        let today = new Date();
        let dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }

        today = yyyy + '-' + mm + '-' + dd;
        document.getElementById("startDT").setAttribute("min", today);

        let min = document.getElementById("startDT").getAttribute("value");
        if (min = '') {
            document.getElementById("endDT").disabled = true;
        }
        document.getElementById("endDT").setAttribute("min", min);
    }

    toggleAdvancedSearch() {
        if (this.state.advancedSearchDisplay === "none") {
            this.setState({ advancedSearchDisplay: "block",
                advancedSearchButton: "Hide Advanced Search" });
        } else {
            this.setState({ advancedSearchDisplay: "none",
                advancedSearchButton: "Show Advanced Search" });
        }
    }

    getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.handleLocation, this.showError);
            this.showLoader();
        } else {
            alert("Geolocation is not supported by this browser!");
        }
    }

    showLoader() {
        if (this.state.loaderDisplay === "none") {
            this.setState({ loaderDisplay: "block" });
        } else {
            this.setState({ loaderDisplay: "none" });
        }
    }

    handleLocation(position) {
        let parametersCopy = this.state.parameters;
        parametersCopy.latlong = position.coords.latitude + ',' + position.coords.longitude;
        this.showLoader();
        alert("The request to get user location was successful.");
        this.setState({ parameters: parametersCopy });
    }

    showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.");
                break;
        }
        this.showLoader();
    }
}