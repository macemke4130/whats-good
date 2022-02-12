import React from 'react';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { gql } from "./utils/gql";

function EditFood() {
    const { id } = useParams();
    const history = useHistory();
    const [openGate, setOpenGate] = useState(true);
    const [foodItem, setFoodItem] = useState("");
    const [purchaseDate, setPurchaseDate] = useState("");
    const [expirationDate, setExpirationDate] = useState("");

    const getData = async () => {
        setOpenGate(false);
        try {
            const food = await gql(`{
                food_item (id: ${id}) {
                    item_name,
                    expiration_date,
                    purchased_date
                }
            }`, true);

            setFoodItem(food.food_item.item_name);
            setPurchaseDate(food.food_item.purchased_date);
            setExpirationDate(food.food_item.expiration_date);
        } catch (e) {
            console.error(e);
        }
    }

    const handleDeleteFood = async (e) => {
        const id = Number(e.target.id);

        try {
            const r = await gql(`mutation{
                deleteFoodItem(
                id: ${id}
                ){ changedRows }}`, true);
            if (r.deleteFoodItem.changedRows === 1) history.push("/");
        } catch (e) {
            console.error(e);
        }
    }

    const handleSubmit = async () => {
        try {
            const r = await gql(`mutation {
                editFoodItem(id: ${id}, item_name: "${foodItem}", purchased_date: "${purchaseDate}", expiration_date: "${expirationDate}") {
                  changedRows
                }
              }`, true);
            if (r.editFoodItem.changedRows === 1) history.push("/");
        } catch (e) {
            console.error(e);
        }
    }

    const handleFoodItem = (e) => {
        setFoodItem(e.target.value);
    }

    const handlePurchaseDate = (e) => {
        setPurchaseDate(e.target.value);
    }

    const handleExpirationDate = (e) => {
        setExpirationDate(e.target.value);
    }

    useEffect(() => {
        if (openGate) getData();
    });

    return (
        <>
            <div>
                <h1>Edit {foodItem}</h1>
                <input type="text" placeholder="Food" value={foodItem} onChange={handleFoodItem} />
                <input type="date" value={purchaseDate} onChange={handlePurchaseDate} />
                <input type="date" value={expirationDate} onChange={handleExpirationDate} />
                <button onClick={handleSubmit}>Submit Edits</button>
            </div>
            <div>
                <a href="/">Go Back</a>
            </div>
            <div>
                <button id={id} onClick={handleDeleteFood}>Delete Food</button>
            </div>
        </>
    );
}

export default EditFood;