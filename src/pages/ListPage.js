import React, { useEffect, useState } from "react";
import { Table, TableCell, TableRow, TableHead, TableBody, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { deleteUser, getallUsers } from "../service/api";
import { Link } from "react-router-dom";
import Delete from "../assets/image/delete.png";
import Edit from "../assets/image/edit.png";
import styled from "styled-components";

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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // 페이지당 표시할 항목 수

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

    // 의심으로 분류된 사용자 수 계산
    const suspectedCount = user.filter((data) => data.symptom && data.symptom.length > 0).length;
    const totalCount = user.length;

    // 현재 페이지에 표시할 사용자 목록 계산
    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = user.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <MotherDiv>
            <TitleDiv>입국자 목록 관리</TitleDiv>
            <BodyDiv>
                <SearchDiv></SearchDiv>
                <div
                    style={{
                        fontSize: "18px",
                        color: "#B9B9B9",
                        paddingBottom: "10px",
                        boxSizing: "border-box",
                        borderBottom: " 2px solid #DFDFDF",
                    }}
                >
                    총 <span style={{ fontSize: "23px", fontWeight: "900", color: "#070707" }}>{totalCount}</span>명 |
                    의심 <span style={{ fontWeight: "900", color: "#070707" }}>{suspectedCount}</span>
                </div>
                <Table style={{ width: "100%" }}>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                style={{
                                    borderBottom: " 3px solid #A2D9F0",
                                    fontSize: "23px",
                                    fontWeight: "700",
                                    color: "#B9B9B9",
                                }}
                            >
                                순번
                            </TableCell>
                            <TableCell
                                style={{
                                    borderBottom: " 3px solid #A2D9F0",
                                    fontSize: "23px",
                                    fontWeight: "700",
                                    color: "#B9B9B9",
                                }}
                            >
                                분류
                            </TableCell>
                            <TableCell
                                style={{
                                    borderBottom: " 3px solid #A2D9F0",
                                    fontSize: "23px",
                                    fontWeight: "700",
                                    color: "#B9B9B9",
                                }}
                            >
                                이름
                            </TableCell>
                            <TableCell
                                style={{
                                    borderBottom: " 3px solid #A2D9F0",
                                    fontSize: "23px",
                                    fontWeight: "700",
                                    color: "#B9B9B9",
                                }}
                            >
                                성별
                            </TableCell>
                            <TableCell
                                style={{
                                    borderBottom: " 3px solid #A2D9F0",
                                    fontSize: "23px",
                                    fontWeight: "700",
                                    color: "#B9B9B9",
                                }}
                            >
                                생년월일
                            </TableCell>
                            <TableCell
                                style={{
                                    borderBottom: " 3px solid #A2D9F0",
                                    fontSize: "23px",
                                    fontWeight: "700",
                                    color: "#B9B9B9",
                                }}
                            >
                                항공편명
                            </TableCell>
                            <TableCell
                                style={{
                                    borderBottom: " 3px solid #A2D9F0",
                                    fontSize: "23px",
                                    fontWeight: "700",
                                    color: "#B9B9B9",
                                }}
                            >
                                출발지
                            </TableCell>
                            <TableCell
                                style={{
                                    borderBottom: " 3px solid #A2D9F0",
                                    fontSize: "23px",
                                    fontWeight: "700",
                                    color: "#B9B9B9",
                                }}
                            >
                                연락처
                            </TableCell>
                            <TableCell
                                style={{
                                    borderBottom: " 3px solid #A2D9F0",
                                    fontSize: "23px",
                                    fontWeight: "700",
                                    color: "#B9B9B9",
                                }}
                            >
                                옵션
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentUsers.map((data, index) => (
                            <TableRow className={classes.trow} key={index}>
                                <TableCell
                                    style={{
                                        fontSize: "23px",
                                        fontWeight: "700",
                                        borderBottom: " 2px solid #DFDFDF",
                                    }}
                                >
                                    {indexOfFirstUser + index + 1}
                                </TableCell>{" "}
                                <TableCell
                                    style={{
                                        fontSize: "23px",
                                        fontWeight: "700",
                                        color: "#FF1F1F",
                                        borderBottom: " 2px solid #DFDFDF",
                                    }}
                                >
                                    {data.symptom && data.symptom.length > 0 ? "의심" : ""}
                                </TableCell>
                                <TableCell
                                    style={{
                                        fontSize: "23px",
                                        fontWeight: "700",
                                        borderBottom: " 2px solid #DFDFDF",
                                    }}
                                >
                                    {data.name}
                                </TableCell>
                                <TableCell
                                    style={{
                                        fontSize: "23px",
                                        fontWeight: "700",
                                        borderBottom: " 2px solid #DFDFDF",
                                    }}
                                >
                                    {data.gender}
                                </TableCell>
                                <TableCell
                                    style={{
                                        fontSize: "23px",
                                        fontWeight: "700",
                                        borderBottom: " 2px solid #DFDFDF",
                                    }}
                                >
                                    {data.birthdate}
                                </TableCell>
                                <TableCell
                                    style={{
                                        fontSize: "23px",
                                        fontWeight: "700",
                                        borderBottom: " 2px solid #DFDFDF",
                                    }}
                                >
                                    {data.flightCode}
                                </TableCell>
                                <TableCell
                                    style={{
                                        fontSize: "23px",
                                        fontWeight: "700",
                                        borderBottom: " 2px solid #DFDFDF",
                                    }}
                                >
                                    {data.departure}
                                </TableCell>
                                <TableCell
                                    style={{
                                        fontSize: "23px",
                                        fontWeight: "700",
                                        borderBottom: " 2px solid #DFDFDF",
                                    }}
                                >
                                    {data.contact}
                                </TableCell>
                                <TableCell
                                    style={{
                                        fontSize: "23px",
                                        fontWeight: "700",
                                        borderBottom: " 2px solid #DFDFDF",
                                    }}
                                >
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
                <Pagination>
                    <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                        이전
                    </Button>
                    <span>
                        {currentPage} / {totalPages}
                    </span>
                    <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
                        다음
                    </Button>
                </Pagination>
            </BodyDiv>
        </MotherDiv>
    );
};

export default ListPage;

const MotherDiv = styled.div`
    background-color: #e3eff9;
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;

    font-size: 20px;
    font-weight: 500;
    padding: 20px;
`;

const TitleDiv = styled.div`
    box-sizing: border-box;
    width: 100%;
    height: 8%;
    background-color: #4f95da;
    border-top-left-radius: 25px;
    border-top-right-radius: 25px;
    padding: 10px 30px;
    font-size: 40px;
    color: #ffffff;
    font-weight: 900;
`;

const BodyDiv = styled.div`
    box-sizing: border-box;
    background-color: white;
    width: 100%;
    height: 90%;
    padding: 30px;
`;

const Pagination = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    button {
        margin: 0 10px;
    }
`;

const SearchDiv = styled.div`
    width: 100%;
    height: 15%;
    background-color: aliceblue;
    box-sizing: border-box;
`;
