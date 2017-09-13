import React, {Component} from 'react';

class RoomSelection extends Component {
    constructor(props) {
        super(props);
        this.base_url = location.protocol + '//' + location.host;
        this.week = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        this.state = {
            roomType: '1', dataFrom: '', dateTo: '', allDays: '', allWeekDays: '', allWeekEnds: '',
            checkedDays: [],
            price: '', available: ''
        };
        this.handleChangeRoomType = this.handleChangeRoomType.bind(this);
        this.handleChangeDateFrom = this.handleChangeDateFrom.bind(this);
        this.handleChangeDateTo = this.handleChangeDateTo.bind(this);
        this.handleChangeAllDays = this.handleChangeAllDays.bind(this);
        this.handleChangeAllWeekDays = this.handleChangeAllWeekDays.bind(this);
        this.handleChangeAllWeekends = this.handleChangeAllWeekends.bind(this);
        this.handleChangeCheckedDays = this.handleChangeCheckedDays.bind(this);
        this.handleChangePrice = this.handleChangePrice.bind(this);
        this.handleChangeAvailable = this.handleChangeAvailable.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeRoomType(e) {
        this.setState({
            roomType: e.target.value
        })
    }

    handleChangeAllDays(e) {
        this.setState({
            allDays: e.target.value
        })

        let checkedDays = [];
        if(e.target.checked) {
            checkedDays = this.week;
        }
        else {
            checkedDays = [];
        }

        this.setState({allWeekDays: false, allWeekEnds: false, checkedDays: checkedDays});
    }

    handleChangeAllWeekDays(e) {
        this.setState({
            allWeekDays: e.target.value
        })
        var weekDays = ["monday", "tuesday", "wednesday", "friday", "thursday"];
        let checkedDays = [];
        if(e.target.checked) {
            checkedDays = weekDays;
        } console.log(checkedDays);
        this.setState({allWeekEnds: false, allDays: false, checkedDays: checkedDays});
    }

    handleChangeAllWeekends(e) {
        this.setState({
            allWeekEnds: e.target.value
        })
        var weekEnds = ["saturday", "sunday"];
        let checkedDays = [];
        if(e.target.checked) {
            checkedDays = weekEnds;
        }

        this.setState({allDays: false, allWeekDays: false, checkedDays: checkedDays});
    }

    handleChangeCheckedDays(e) {
        let val = e.target.value;
        var index = this.state.checkedDays.indexOf(val);
        if(e.target.checked) {
            if(index < 1) {
                this.state.checkedDays.push(val);
            }
        }
        else {
            if(index >= 0) {
                this.state.checkedDays.splice(index, 1);
            }
        }
        this.setState({allDays: false, allWeekDays: false, allWeekEnds: false})
    }

    handleChangeDateFrom(e) {
        this.setState({
            dateFrom: e.target.value
        })
    }

    handleChangeDateTo(e) {
        this.setState({
            dateTo: e.target.value
        })
    }

    handleChangePrice(e) {
        this.setState({
            price: e.target.value
        })
    }

    handleChangeAvailable(e) {
        this.setState({
            available: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        const bookings = {
            room_type_id: this.state.roomType,
            date_from: this.state.dateFrom,
            date_to: this.state.dateTo,
            checked_days: this.state.checkedDays,
            price: this.state.price,
            quantity: this.state.available

        }
        let uri = this.base_url + '/booking';
        axios.post(uri, bookings).then((response) => {
            console.log(response);
        });
        React.children.tabRow();
    }

    render() {
        return (
            <div className="container">
                <div className="container-fluid">
                    <div className="panel panel-info">
                        <div className="panel-heading">
                            <h2 className="panel-title">Bulk operations</h2>
                        </div>
                        <div className="panel-body">
                            <form className="form-horizontal" name="submit" onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <label className="col-sm-2 control-label text-left">Select Room :</label>
                                    <div className="col-sm-3">
                                        <select onChange={this.handleChangeRoomType} className="form-control" required
                                            name="room_type_selected">
                                            <option value="1">single room</option>
                                            <option value="2">double room</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row form-group">
                                    <label for="" className="col-sm-2 control-label align-left">Select Days :</label>
                                    <div className="col-sm-3">
                                        <div className="form-group">
                                            <label for="" className="col-sm-4 control-label align-left">From :</label>
                                            <div className="col-sm-8">
                                                <input onChange={this.handleChangeDateFrom} type="date"
                                                    className="form-control" placeholder="Date from" required
                                                    name="date_from"/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label for="" className="col-sm-4 control-label align-left">To :</label>
                                            <div className="col-sm-8">
                                                <input onChange={this.handleChangeDateTo} type="date"
                                                    className="form-control" placeholder="Date to"/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-sm-7">
                                        <label for="" className="col-sm-3 control-label align-left">Refine Days
                                            :</label>
                                        <div className="col-sm-3">
                                            <div className="checkbox ">
                                                <label>
                                                    <input onChange={this.handleChangeAllDays}
                                                        checked={ this.state.allDays } type="checkbox" name="allDays"/>
                                                    All days
                                                </label>
                                            </div>
                                            <div className="checkbox ">
                                                <label>
                                                    <input onChange={this.handleChangeAllWeekDays}
                                                        checked={ this.state.allWeekDays } type="checkbox"/> All
                                                    weekdays
                                                </label>
                                            </div>
                                            <div className="checkbox ">
                                                <label>
                                                    <input onChange={this.handleChangeAllWeekends}
                                                        checked={ this.state.allWeekEnds } type="checkbox"
                                                        name="allWeekends"/> All weekends
                                                </label>
                                            </div>
                                        </div>
                                        <CheckedDaysSet setName={'handleChangeCheckedDays'}
                                            onChange={this.handleChangeCheckedDays} setOptions={this.week}
                                            checkedDays={this.state.checkedDays}>
                                        </CheckedDaysSet>

                                    </div>
                                </div>
                                <div className="form-group">
                                    <label for="" className="col-sm-2 control-label align-left">Change price to
                                        :</label>
                                    <div className="col-sm-2">
                                        <input onChange={this.handleChangePrice} type="number"
                                            className="col-sm-3 form-control" placeholder="New price"/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label for="" className="col-sm-2 control-label align-left">Change availibity to
                                        :</label>
                                    <div className="col-sm-2">
                                        <input onChange={this.handleChangeAvailable} type="number"
                                            className="col-sm-3 form-control" placeholder="Rooms available" required
                                            name="new_availability"/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-sm-offset-2 col-sm-10">
                                        <button type="reset" className="btn btn-default" name="reset">Cancel</button>
                                        <button type="submit" className="btn btn-success">Update</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

/**
 * Component for check option of days
 * @param props
 * @returns {XML}
 * @constructor
 */
function CheckedDaysSet(props) {

    let getStuff = (start, len) => {
        return props.setOptions.slice(start, len).map(option => {
            let inner;
            if(props.checkedDays.indexOf(option) !== -1) {
                inner = <input onChange={props.onChange} type="checkbox" name="checkedDays" value={option}
                    checked="checked"/>
            }
            else {
                inner = <input onChange={props.onChange} type="checkbox" name="checkedDays" value={option}/>
            }
            return (
                <div className="checkbox" key={option}>
                    <label
                        style={{textTransform: 'capitalize'}}>
                        {inner} {option}
                    </label>
                </div>
            )
        })
    }
    return (
        <div>
            <div className="col-sm-2">
                {getStuff(0, 3)}
            </div>
            <div className="col-sm-2">
                {getStuff(3, 7)}
            </div>
        </div>
    );
}
export default RoomSelection;

