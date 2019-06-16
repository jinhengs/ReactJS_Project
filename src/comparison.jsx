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
        super(props)
    }
    render() {
        var min = 100000
        var max = 0 

        var rows = this.props.items.map((x) =>(
                <tr key={x._id} onClick={() => this.props.showDetails(x)}>
                    <td> {x.parameters.title}</td>
                    <td> {x.parameters.venue} </td>
                    <td> {x.parameters.date} at {x.parameters.time} </td>
                    <td> {x.parameters.priceRange} </td>
                </tr>))

        return (
            <div className="view">
                <div className="row viewTitle">
                    <div className="col-6-sm">
                    <h3>Compare</h3>
                    </div>
                    <div className="col-6-sm">
                    <button className="backBtn mainButton" onClick={(e) => this.props.back()}>
                        Back
                    </button>
                    </div>
                </div>

                <div className="row comparison viewContent">

                    {(this.props.items.length > 0) ?
                   <table>
                        <tbody>
                        <tr>
                            <th>Event</th>
                            <th>Venue</th>
                            <th>Date</th>
                            <th>Price</th>
                        </tr>
                        {rows}
                        </tbody>
                    </table> 
                    : <h2 className="error"> Nothing to compare </h2>}
                </div>
            </div>
        )
    }
}
