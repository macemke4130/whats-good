import React from 'react';
import { useState, useRef } from 'react';

import { gql } from "./utils/gql";

function NewFood(props) {
    const nameInput = useRef(null);
    const [foodItem, setFoodItem] = useState();
    const [purchaseDate, setPurchaseDate] = useState();
    const [expirationDate, setExpirationDate] = useState();

    const getDate = new Date();
    const todaysDate = `${getDate.getFullYear()}-${(getDate.getMonth() + 1 < 10) ? "0" + (getDate.getMonth() + 1) : getDate.getMonth + 1}-${getDate.getDate()}`;

    const handleFoodItem = (e) => {
        setFoodItem(e.target.value);
    }

    const handlePurchaseDate = (e) => {
        setPurchaseDate(e.target.value);
    }

    const handleExpirationDate = (e) => {
        setExpirationDate(e.target.value);
    }

    const handleSubmit = async () => {
        try {
            const r = await gql(`mutation{
                newFoodItem(
                item_name: "${foodItem}",
                purchased_date: "${purchaseDate || todaysDate}",
                expiration_date: "${expirationDate}",
                userid: 1
                ){insertId}}`);
            if (r.newFoodItem.insertId) resetInputs();
        } catch (e) {
            console.error(e);
        }
    }

    const resetInputs = () => {
        props.getData();
        nameInput.current.focus();
        nameInput.current.value = "";
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSubmit();
    }

    return (
        <div>
            <input type="text" ref={nameInput} placeholder="Food" onChange={handleFoodItem} onKeyDown={handleKeyDown} />
            <label>Expiration: </label><input type="date" onChange={handleExpirationDate} onKeyDown={handleKeyDown} />
            <label>Purchased: </label><input type="date" value={todaysDate} onChange={handlePurchaseDate} onKeyDown={handleKeyDown} />
            <button onClick={handleSubmit}>Submit New Food</button>
        </div>
    );
}

export default NewFood;