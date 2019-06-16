/**
 * ComparisonView
 * Displays a details of a flagged items in a more readable fashion 
 * @prop Array items, list of items that were flagged
 * @prop Function showDetails, go to the DetailsView 
 * @prop Function back, return to SearchView
 * @prop Function reload, reload the ResultsView
 */
class ComparisonView extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var min = 100000;
        var max = 0;

        var rows = this.props.items.map(x => React.createElement(
            "tr",
            { key: x._id, onClick: () => this.props.showDetails(x) },
            React.createElement(
                "td",
                null,
                " ",
                x.parameters.title
            ),
            React.createElement(
                "td",
                null,
                " ",
                x.parameters.venue,
                " "
            ),
            React.createElement(
                "td",
                null,
                " ",
                x.parameters.date,
                " at ",
                x.parameters.time,
                " "
            ),
            React.createElement(
                "td",
                null,
                " ",
                x.parameters.priceRange,
                " "
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
                    { className: "col-6-sm" },
                    React.createElement(
                        "h3",
                        null,
                        "Compare"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "col-6-sm" },
                    React.createElement(
                        "button",
                        { className: "backBtn mainButton", onClick: e => this.props.back() },
                        "Back"
                    )
                )
            ),
            React.createElement(
                "div",
                { className: "row comparison viewContent" },
                this.props.items.length > 0 ? React.createElement(
                    "table",
                    null,
                    React.createElement(
                        "tbody",
                        null,
                        React.createElement(
                            "tr",
                            null,
                            React.createElement(
                                "th",
                                null,
                                "Event"
                            ),
                            React.createElement(
                                "th",
                                null,
                                "Venue"
                            ),
                            React.createElement(
                                "th",
                                null,
                                "Date"
                            ),
                            React.createElement(
                                "th",
                                null,
                                "Price"
                            )
                        ),
                        rows
                    )
                ) : React.createElement(
                    "h2",
                    { className: "error" },
                    " Nothing to compare "
                )
            )
        );
    }
}