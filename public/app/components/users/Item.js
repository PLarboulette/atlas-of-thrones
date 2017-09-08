/**
 * Created by Pierre Larboulette on 26/05/2017.
 */

import React, { PropTypes } from 'react';


const UserView = ({user}) => {
    return (
        <div>
            <p>
               Welcome  {user.firstName} {user.lastName} with ID {user.id} !
            </p>
        </div>
    )
};

UserView.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
    })
};

const User = (props) => {
    return (
        <UserView user={props.user} />
    )
};

User.propTypes= {
    user: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
    })
};

export default User;
