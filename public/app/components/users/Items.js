
import React, { PropTypes } from 'react';

// Component imports
import User from './Item'
import AddUser from './AddItem'

const UsersView =  ({users}) => {
    return (
        <div>
            <ul>
                {users.map(user =>
                    <User key={user.id} user={user}/>
                )}
            </ul>
            <AddUser />
        </div>
    );
};


const Users = (props) => {

    return (
        <UsersView users={props.users} />
    );
};

Users.propTypes = {
    users: PropTypes.array,
};

export default Users;