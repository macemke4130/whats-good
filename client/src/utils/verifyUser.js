import { gql } from "./gql";

export const verifyUser = async () => {
    try {
        const username = localStorage.getItem("username");
        const password = localStorage.getItem("password");

        const isLoggedIn = await gql(`{user(username:"${username}", password:"${password}")}`);

        if (isLoggedIn.user === true) {
            return true;
        } else {
            alert("Not Logged In.");
            return false;
        }
    } catch (e) {
        console.error(e);
    }
}