import React, { useEffect, useState } from "react";
import { Table, TableCell, TableRow, TableHead, TableBody, makeStyles, Button } from "@material-ui/core";
import { deleteUser, getallUsers } from "../service/api";
import { Link } from "react-router-dom";
import Delete from "../assets/image/delete.png";
import Edit from "../assets/image/edit.png";

const useStyle = makeStyles({
    table: {
        width: "80%",
        margin: "50px 100px 100px 140px",
    },
    thead: {
        "& > *": {
            background: "#000000",
            color: "#FFFFFF",
            fontSize: "16px",
        },
    },
    trow: {
        "& > *": {
            fontSize: "16px",
        },
    },
});

const ListPage = () => {
    const classes = useStyle();

    const [user, setUser] = useState([]);
    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        const response = await getallUsers();
        console.log(response);
        setUser(response.data);
    };

    const deleteData = async (id) => {
        await deleteUser(id);
        getUsers();
    };
    return (
        <Table className={classes.table}>
            <TableHead>
                <TableRow>
                    <TableCell style={{ borderBottom: " 3px solid #A2D9F0" }}>분류</TableCell>
                    <TableCell style={{ borderBottom: " 3px solid #A2D9F0" }}>이름</TableCell>
                    <TableCell style={{ borderBottom: " 3px solid #A2D9F0" }}>성별</TableCell>
                    <TableCell style={{ borderBottom: " 3px solid #A2D9F0" }}>생년월일</TableCell>
                    <TableCell style={{ borderBottom: " 3px solid #A2D9F0" }}>항공편명</TableCell>
                    <TableCell style={{ borderBottom: " 3px solid #A2D9F0" }}>출발지</TableCell>
                    <TableCell style={{ borderBottom: " 3px solid #A2D9F0" }}>연락처</TableCell>
                    <TableCell style={{ borderBottom: " 3px solid #A2D9F0" }}>옵션</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {user.map((data, index) => (
                    <TableRow className={classes.trow} key={index}>
                        <TableCell>{data.symptom && data.symptom.length > 0 ? "의심" : ""}</TableCell>
                        <TableCell>{data.name}</TableCell>
                        <TableCell>{data.gender}</TableCell>
                        <TableCell>{data.birthdate}</TableCell>
                        <TableCell>{data.flightCode}</TableCell>
                        <TableCell>{data.departure}</TableCell>
                        <TableCell>{data.contact}</TableCell>
                        <TableCell>
                            <Button
                                variant="contained"
                                style={{
                                    margin: "0px 5px",
                                    backgroundColor: "white",
                                    border: "1px solid #B5D3F0",
                                    width: "20px",
                                }}
                                component={Link}
                                to={`/edit/${data.id}`}
                            >
                                <img src={Edit} alt="edit" width={20} />
                            </Button>
                            {/* 4. button label을 cancle에서 delete로 바꿈으로써 버튼의 기능을 직관적으로 명시 */}
                            <Button
                                variant="contained"
                                color="secondary"
                                style={{
                                    padding: "5px",
                                    margin: "0px 5px",
                                    backgroundColor: "#FACDCA",
                                    border: "1px solid #F30B0B",
                                    width: "20px",
                                }}
                                onClick={() => deleteData(data.id)}
                            >
                                <img src={Delete} alt="delete" width={20} />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default ListPage;
