import axios from "axios";

const url = "https://670c91777e5a228ec1d0b2ca.mockapi.io/api/healthInfo";

export const getallUsers = async (id) => {
    id = id || "";
    return await axios.get(`${url}/${id}`);
};

export const addUser = async (user) => {
    return await axios.post(url, user);
};

export const editUser = async (id, user) => {
    return await axios.put(`${url}/${id}`, user);
};

export const deleteUser = async (id) => {
    return await axios.delete(`${url}/${id}`);
};
