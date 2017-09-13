// Master.js

import React, {Component} from 'react';
import RoomSelection from './RoomSelection';
import RoomCalendar from './RoomCalendar';

class Master extends Component {
    constructor(props) {
        super(props);

    }

    blukOperation() {
        return <RoomSelection />;
    }

    roomCalendar() {
        return <RoomCalendar />;
    }

    render() {
        return (
            <div>
                {this.blukOperation()}
                {this.roomCalendar()}
            </div>
        )
    }
}
export default Master;
