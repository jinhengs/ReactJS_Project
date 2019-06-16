/**
 * Results
 * View to display all the results of a search in a grid pattern
 * @prop Integer pageNum, the current page number of the results page
 * @prop Object[] compareList, list of items that have been selected to be compared
 */
class ResultsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Current page number
            pageNum: 0,
            // Comparelist
            compareList: []
            // Bindings
        };this.compare = this.compare.bind(this);
        this.toggleCompare = this.toggleCompare.bind(this);
        this.handleOnScroll = this.handleOnScroll.bind(this);
    }

    /* Compare helper to go to ComparisonView */
    compare() {
        this.props.compare(this.state.compareList);
    }

    /* Toggle event select for compare */
    toggleCompare(event, checked) {
        if (checked) {
            this.setState({
                compareList: this.state.compareList.concat(event)
            });
        } else {
            var index = this.state.compareList.indexOf(event);
            this.setState({
                compareList: this.state.compareList.filter(item => item !== event)
            });
        }
    }

    /* Infinite Scroll */
    componentDidMount() {

        var scrollArea = document.getElementsByClassName('row results viewContent')[0];
        scrollArea.addEventListener('scroll', this.handleOnScroll);
    }

    componentWillUnmount() {

        var scrollArea = document.getElementsByClassName('row results viewContent')[0];
        scrollArea.removeEventListener('scroll', this.handleOnScroll);
    }

    handleOnScroll() {

        var scrollArea = document.getElementsByClassName('row results viewContent')[0];

        if (scrollArea.scrollTop + scrollArea.clientHeight == scrollArea.scrollHeight) {
            this.props.getEvents(null, this.state.pageNum + 1, true, x => this.props.reload(x, this.props.back));
            this.setState({ pageNum: this.state.pageNum + 1 });
        }
    }

    render() {
        // Map the results to a list of ResultItem components
        return React.createElement(
            'div',
            { className: 'view' },
            React.createElement(
                'div',
                { className: 'row viewTitle' },
                React.createElement(
                    'div',
                    { className: 'col-4-sm' },
                    React.createElement(
                        'h3',
                        null,
                        'Results'
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'col-4-sm' },
                    React.createElement(
                        'button',
                        { className: 'selectBtn mainButton', onClick: this.compare },
                        ' Compare '
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'col-4-sm' },
                    React.createElement(
                        'button',
                        { className: 'backBtn mainButton', onClick: e => this.props.back() },
                        ' Back '
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'row results viewContent' },
                this.props.result.length > 0 ? React.createElement(ResultGrid, {
                    events: this.props.result,
                    getResult: this.props.getResult,
                    toggleCompare: this.toggleCompare,
                    showDetail: this.props.showDetail
                }) : React.createElement(
                    'h2',
                    { className: 'error' },
                    ' No results, try again '
                )
            )
        );
    }
}

/* Entire grid layout for result */
class ResultGrid extends React.Component {
    render() {
        var docWidth = document.documentElement.clientWidth;
        var xCount = docWidth < 1200 ? 2 : 3;
        var cards = this.props.events.map((event, index) => index < Math.floor(this.props.events.length / xCount) * xCount < this.props.events.length < xCount ? React.createElement(EventCard, {
            key: event.id != null ? event.id + index : index,
            event: event,
            toggleCompare: this.props.toggleCompare,
            showDetail: this.props.showDetail,
            back: this.props.back
        }) : null);

        return React.createElement(
            'div',
            { className: 'result__content' },
            cards
        );
    }
}

/* Single event item (single box of the grid) */
class EventCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checked: false
        };
    }

    /* Toggle Handler */
    toggleCompare(e) {

        if (this.state.checked) {
            e.target.style.borderLeftColor = "rgba(255,140,0, 0.8)";
            e.target.style.borderRightColor = "rgba(255,140,0, 0.8)";
        } else {
            e.target.style.borderLeftColor = "rgba(199, 57, 37, 0.8)";
            e.target.style.borderRightColor = "rgba(199, 57, 37, 0.8)";
        }

        this.props.toggleCompare(this.props.event, !this.state.checked);
        this.setState({ checked: !this.state.checked });
    }

    render() {
        var styles = {
            backgroundImage: `url(${this.props.event.optional.imageURL})`
        };
        return React.createElement(
            'div',
            { className: 'event__grid', style: styles },
            React.createElement('div', { className: 'compare__button', onClick: e => this.toggleCompare(e) }),
            React.createElement(
                'div',
                { className: 'bubble' },
                'Add to compare list!'
            ),
            React.createElement(
                'div',
                { className: 'event__price' },
                ' ',
                this.props.event.parameters.priceRange.split(/[\s,\.]/)[0]
            ),
            React.createElement(
                'div',
                { className: 'result__grid', onClick: e => this.props.showDetail(this.props.event) },
                React.createElement(
                    'div',
                    { className: 'result__desc' },
                    React.createElement(
                        'div',
                        { className: 'event__title' },
                        this.props.event.parameters.title
                    ),
                    React.createElement(
                        'div',
                        { className: 'event__desc' },
                        ValidLocation(this.props.event)
                    ),
                    React.createElement(
                        'div',
                        { className: 'event__desc' },
                        this.props.event.parameters.date
                    )
                )
            )
        );
    }
}