/**
 * Created by Pierre Larboulette on 26/05/2017.
 */

import React, { PropTypes, Component } from 'react';


const AddUserView = () => {

    return (
        <div>
          <p>
              Hello world !
          </p>
        </div>
    );
};

AddUserView.propTypes = {

};

class AddUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user : {}
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    handleChange(e) {

    };

    handleSave() {

    };

    render () {
        return (
            <AddUserView />
        )
    }
}

AddUser.propTypes = {

};

export default AddUser;
