import React from 'react';
import { useEffect, useState } from 'react';

import { gql } from "./utils/gql";

function Main() {
    const [openGate, setOpenGate] = useState(true);
    const [allFood, setAllFood] = useState([]);
    const [allExpired, setAllExpired] = useState([]);
    const warningTime = 3; // Warning time in days --

    const getData = async () => {
        setOpenGate(false);

        const allFood = await gql(`{
      all_food {
        id
	      item_name
        quantity
        pretty_purchased_date
        pretty_expiration_date
        delta
      }
    }
    `);

        setAllFood(allFood.all_food);

        const allExpired = await gql(`{
            all_expired {
                id
	            item_name
                pretty_expiration_date
                delta
            }
        }`);

        setAllExpired(allExpired.all_expired);
    }

    const handleDeleteFood = async (e) => {
        const id = Number(e.target.id);

        try {
            const r = await gql(`mutation{
                deleteFoodItem(
                id: ${id}
                ){ changedRows }}`);
            if (r.deleteFoodItem.changedRows === 1) window.location.reload();
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if (openGate) getData();
    });

    return (
        <>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Date Purchased</th>
                            <th>Date Expires</th>
                            <th>Time Remaining</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allFood.map(food => (
                            <tr key={"food-" + food.id} id={"food-" + food.id} >
                                <td key={"item-name-" + food.id} id={"item-name-" + food.id} className="item-col">{food.item_name} {food.quantity > 1 && " x" + food.quantity}<button id={food.id} onClick={handleDeleteFood}>X</button></td>
                                <td key={"purchased-date-" + food.id} id={"purchased-date-" + food.id}>{food.pretty_purchased_date}</td>
                                <td key={"expiration-date-" + food.id} id={"expiration-date-" + food.id}>{food.pretty_expiration_date}</td>
                                <td key={"delta-" + food.id} id={"delta-" + food.id} className={((food.delta.split(" ")[0] < warningTime && food.delta.split(" ")[1].substring(0, 1) === "d") || food.delta.split(" ")[1].substring(0, 1) === "h") ? "red" : "normal"}>{food.delta}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Date Expired</th>
                            <th>Expired</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allExpired.map(food => (
                            <tr key={"food-" + food.id} id={"food-" + food.id} >
                                <td key={"item-name-" + food.id} id={"item-name-" + food.id} className="item-col">{food.item_name} {food.quantity > 1 && " x" + food.quantity}</td>
                                <td key={"expiration-date-" + food.id} id={"expiration-date-" + food.id}>{food.pretty_expiration_date}</td>
                                <td key={"delta-" + food.id} id={"delta-" + food.id} className="red">{food.delta}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Main;