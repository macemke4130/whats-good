import React from 'react';
import { useEffect, useState } from 'react';
import AddSpice from './AddSpice';

import { gql } from "./utils/gql";

function SpiceRack() {
    const [openGate, setOpenGate] = useState(true);
    const [spiceRack, setSpiceRack] = useState([]);

    const getData = async () => {
        setOpenGate(false);
        const r = await gql(`{ spice_rack{ id spice_name } }`);
        setSpiceRack(r.spice_rack);
    }

    useEffect(() => {
        if (openGate) getData();
    });

    return (
        <>
            <h1>Spice Rack</h1>
            <AddSpice getData={getData} />
            <ul>
                {spiceRack.map(spice => (
                    <li key={spice.id}>{spice.spice_name}</li>
                ))}
            </ul>
        </>
    );
}

export default SpiceRack;