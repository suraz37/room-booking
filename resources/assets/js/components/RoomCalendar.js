import React, {Component} from 'react';

class RoomCalendar extends Component {
    constructor(props) {
        super(props);
        this.base_url = location.protocol + '//' + location.host;
        this.startDate = '01';
        this.monthFormat = 'YYYY-MM-';
        this.state = {
            date_from: moment().format(this.monthFormat + this.startDate),
            date_to: moment().format(this.monthFormat + '14'),
            rowSelected: '{"value":0}',
            datas: [],
            selectedValue: ''
        };
        this.handleMonth = this.handleMonth.bind(this);
        this.handlePopOver = this.handlePopOver.bind(this);
        this.handleSelectedValue = this.handleSelectedValue.bind(this);
        this.handlePopOverSubmit = this.handlePopOverSubmit.bind(this);
    }

    handleSelectedValue(e) {
        this.setState({
            selectedValue: e.target.value
        })
    }

    handlePopOverSubmit(e) {
        $('#myModal').modal('hide');
        let selectedRow = JSON.parse(this.state.rowSelected);
        let dateParam = {};
        let tdId = selectedRow.room_type_id + selectedRow.key + selectedRow.day;

        if(selectedRow.key === 'price') {
            document.getElementById(tdId).innerHTML = this.state.selectedValue + selectedRow.currency;
            dateParam = {
                room_type_id: selectedRow.room_type_id,
                day: selectedRow.day,
                price: parseInt(this.state.selectedValue),
                quantity: selectedRow.available_quantity
            }
        }
        else {
            document.getElementById(tdId).innerHTML = this.state.selectedValue;
            dateParam = {
                room_type_id: selectedRow.room_type_id,
                day: selectedRow.day,
                price: selectedRow.available_quantity,
                quantity: parseInt(this.state.selectedValue)
            }
        }
        let uri = this.base_url + '/single-operation';
        axios.post(uri, dateParam)
        .then(response => {
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    handlePopOver(e) {
        e.preventDefault();
        let val = e.target;
        document.getElementById('selectedRow').value = JSON.parse(e.target.getAttribute('data-option')).value;
        this.setState({rowSelected: e.target.getAttribute('data-option')});
    }

    handleMonth(e) {
        e.preventDefault();
        let val = e.target.value;
        var formats = [this.monthFormat]
        if(moment(val, formats).isValid()) {
            this.setState({date_from: val + '-' + this.startDate})
            this.tabRow();
        }
    }

    componentDidMount() {
        if(this.state.datas instanceof Array) {
            this.tabRow();
        }
    }

    tabRow() {
        let dateParam = {
            date_to: this.state.date_to,
            date_from: this.state.date_from,
        }
        console.log(this.state.date_from);
        let uri = this.base_url + '/booking';
        axios.get(uri, {params: dateParam})
        .then(response => {
            this.setState({
                datas: response.data
            });
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    render() {
        let selectedRow = JSON.parse(this.state.rowSelected);
        return (
            <div>
                <div className="container">
                    <div>
                        <div className="modal fade" id="myModal" tabindex="-1" role="dialog"
                            aria-labelledby="myModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">

                                    <div className="modal-header">
                                        <div class="form-group col-sm-6">
                                            <input onChange={this.handleSelectedValue} name="something"
                                                id="selectedRow" type="text" data-value={selectedRow.value}/>
                                            <button type="button" className="btn btn-default" data-dismiss="modal">
                                                Cancel
                                            </button>
                                            <button type="button" className="btn btn-primary"
                                                onClick={this.handlePopOverSubmit}>Ok
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover table-condensed table-bordered">
                            <tbody>
                            <tr>
                                <th rowSpan="3" className="">Price &amp; availability</th>
                                <th colSpan="3">
                                    <input onChange={this.handleMonth} type="month" className="col-sm-3 form-control"
                                        name="month"
                                    />
                                </th>
                                <th colSpan={this.state.datas.length - 3}></th>
                            </tr>
                            <DaySet setName={'day'} setOptions={ this.state.datas}></DaySet>
                            <DaySet setName={'day_no'} setOptions={ this.state.datas}></DaySet>
                            <tr>
                                <td colSpan={this.state.datas.length}>Single Room</td>
                            </tr>
                            <RoomRowSet setTitle={'Room Available'} setName={'single_room_available'}
                                setOptions={ this.state.datas}
                                handlePopOver={this.handlePopOver}>
                            </RoomRowSet>
                            <RoomRowSet setTitle={'Price'} setName={'single_room_price'} setOptions={this.state.datas}
                                handlePopOver={this.handlePopOver}>
                            </RoomRowSet>
                            <tr>
                                <td colSpan={this.state.datas.length}>Double Room</td>
                            </tr>
                            <RoomRowSet setTitle={'Room Available'} setName={'double_room_available'}
                                setOptions={ this.state.datas}
                                handlePopOver={this.handlePopOver}>
                            </RoomRowSet>
                            <RoomRowSet setTitle={'Price'} setName={'double_room_price'} setOptions={this.state.datas}
                                handlePopOver={this.handlePopOver}>
                            </RoomRowSet>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

/**
 *
 * @param props
 * @returns {XML}
 * @constructor
 */
function RoomRowSet(props) {
    return (
        <tr>
            <th>{props.setTitle}</th>
            {props.setOptions.map(option => {
                let inner = 2;
                let result = [];

                let defaultCurrency = 'IDR';

                switch (props.setName) {
                    case 'single_room_available':
                        result = setRoomOption(option, 1);
                        result.key = 'quantity';
                        result.value = result.available_quantity;
                        inner = result.available_quantity;
                        break;
                    case 'single_room_price':
                        result = setRoomOption(option, 1);
                        result.key = 'price';
                        result.value = result.price;
                        inner = result.price
                        inner += ' ' + defaultCurrency;
                        break;
                    case 'double_room_available':
                        result = setRoomOption(option, 2);
                        result.key = 'quantity';
                        result.value = result.available_quantity;
                        inner = result.available_quantity;

                        break;
                    case 'double_room_price':
                        result = setRoomOption(option, 2);

                        result.key = 'price';
                        result.value = result.price;
                        inner = result.price;
                        inner += ' ' + defaultCurrency;
                        break;
                    default:
                        break;
                }
                return (
                    <td data-option={JSON.stringify(option)} id={option.room_type_id + option.key + option.day}
                        onClick={props.handlePopOver} data-toggle="modal"
                        data-target="#myModal">{inner}</td>
                )
            })}
        </tr>
    );
}

/**
 * Assign defualt value for room option
 *
 * @param option
 * @param roomType
 * @returns {*}
 */
function setRoomOption(option, roomType) {
    let defaultSingleId = 1;
    let defaultDoubleId = 2;
    let defaultSinglePrice = '600000';
    let defaultDoublePrice = '815000';
    let defaultAvailable = 2;
    let defaultCurrency = 'IBR';

    if(roomType === 1 && option.room_type_id !== roomType) {
        option.room_type_id = defaultSingleId;
        option.available_quantity = defaultAvailable;
        option.currency = defaultCurrency;
        option.price = defaultSinglePrice;
    }
    if(roomType === 2 && option.room_type_id !== roomType) {
        option.room_type_id = defaultDoubleId;
        option.available_quantity = defaultAvailable;
        option.currency = defaultCurrency;
        option.price = defaultDoublePrice;
    }
    return option;
}

/**
 *
 * @param props
 * @returns {XML}
 * @constructor
 */
function DaySet(props) {
    return (
        <tr>
            {props.setOptions.map(option => {
                let inner = '';
                let weekend = '';
                if(props.setName === 'day') {
                    inner = moment(option.day).format('dddd');
                    weekend = (inner === 'Sunday' || inner === 'Saturday') ? 'weekends' : '';
                }
                if(props.setName === 'day_no') {
                    inner = moment(option.day).format('D');
                }
                return (
                    <th className={weekend}>
                        <label>
                            {inner}
                        </label>
                    </th>
                )
            })}
        </tr>
    );
}
export default RoomCalendar;

