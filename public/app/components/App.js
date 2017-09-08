

import React from 'react'
import Header from './Header'
import Users from './users/Items'

const users = [
    {
        id : "1",
        firstName : "Bruce",
        lastName: "Wayne"
    },
    {
        id : "2",
        firstName : "Clark",
        latName : "Kent"
    }
];

const App = () => (
    <div>

        <Header />
        <Users users={users} />
    </div>
);

export default App;