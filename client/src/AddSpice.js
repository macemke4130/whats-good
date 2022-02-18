import React from 'react';
import { useState } from 'react';

import { gql } from "./utils/gql";

function AddSpice(props) {
    const [newSpice, setNewSpice] = useState("");

    const handleSpiceName = (e) => {
        setNewSpice(e.target.value);
    }

    const submitNewSpice = async () => {
        try {
            const r = await gql(`mutation { newSpice(spice_name: "${newSpice}") { insertId } }`);
            if (r.newSpice.insertId) props.getData();
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
            <input type="text" onChange={handleSpiceName}></input>
            <button onClick={submitNewSpice}>Add New Spice</button>
        </>
    );
}

export default AddSpice;