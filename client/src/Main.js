import React from 'react';
import { useEffect, useState } from 'react';

import { gql } from "./utils/gql";
import { verifyUser } from "./utils/verifyUser";

import NewFood from './NewFood';
import Expired from './Expired';

function Main() {
    const [openGate, setOpenGate] = useState(true);
    const [allFood, setAllFood] = useState([]);

    const getData = async (alpha) => {
        setOpenGate(false);

        const allFood = await gql(`{ 
            all_food${alpha ? "(alpha: true)" : ""} { 
                id 
                item_name 
                quantity 
                pretty_purchased_date 
                pretty_expiration_date 
                delta { 
                    time 
                    warning 
                } 
            } 
        }`);

        setAllFood(allFood.all_food);
    }

    const handleDeleteFood = async (e) => {
        const loggedIn = await verifyUser();
        if (loggedIn) {
            const id = Number(e.target.id);

            try {
                const r = await gql(`mutation{
                    deleteFoodItem(
                    id: ${id}
                    ){ changedRows }}`);
                if (r.deleteFoodItem.changedRows === 1) getData();
            } catch (e) {
                console.error(e);
            }
        }
    }

    const getSort = (e) => {
        const clicked = e.target.innerText;

        if (clicked === "Alphabetically") {
            getData(true);
            e.target.innerText = "Expiration";
        } else {
            getData();
            e.target.innerText = "Alphabetically";
        }
    }

    useEffect(() => {
        if (openGate) getData();
    });

    return (
        <>
            <a href="./spice-rack">Spices and Oils</a>
            <Expired />
            <NewFood getData={getData} />
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Sort <button id="sort" onClick={getSort}>Alphabetically</button></th>
                            <th className="date-col">Purchased</th>
                            <th className="date-col">Expires</th>
                            <th className="time-col">Time Remaining</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allFood.map(food => (
                            <tr key={"food-" + food.id} id={"food-" + food.id} >
                                <td key={"item-name-" + food.id} id={"item-name-" + food.id} className="item-col"><a href={`/edit/${food.id}`}>{food.item_name} {food.quantity > 1 && " x" + food.quantity}</a><button id={food.id} onClick={handleDeleteFood}>X</button></td>
                                <td key={"purchased-date-" + food.id} id={"purchased-date-" + food.id} className="date-col">{food.pretty_purchased_date}</td>
                                <td key={"expiration-date-" + food.id} id={"expiration-date-" + food.id} className="date-col">{food.pretty_expiration_date}</td>
                                <td key={"delta-" + food.id} id={"delta-" + food.id} className={(food.delta.warning ? "red" : "normal") + " time-col"}>{food.delta.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Main;