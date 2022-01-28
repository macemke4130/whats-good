import React from 'react';
import { useState } from 'react';

import { gql } from "./utils/gql";

function NewFood() {
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
            if (r.newFoodItem.insertId) window.location.reload();
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div>
            <input type="text" onChange={handleFoodItem} />
            <input type="date" value={todaysDate} onChange={handlePurchaseDate} />
            <input type="date" onChange={handleExpirationDate} />
            <button onClick={handleSubmit}>Submit New Food</button>
        </div>
    );
}

export default NewFood;