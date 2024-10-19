import React, { useEffect, useState } from "react";
import { Table, TableCell, TableRow, TableHead, TableBody, Button } from "@mui/material";
import { deleteUser, getallUsers } from "../service/api";
import { Link } from "react-router-dom";
import Delete from "../assets/image/delete.png";
import Edit from "../assets/image/edit.png";
import styled from "styled-components";

const ListPage = () => {
    const [user, setUser] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [nameSearch, setNameSearch] = useState("");
    const [codeSearch, setCodeSearch] = useState("");
    const [depSearch, setDepSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // 페이지당 표시할 항목 수

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        const response = await getallUsers();
        setUser(response.data);
        setFilteredUsers(response.data); // 전체 사용자 목록 설정
    };

    const deleteData = async (id) => {
        await deleteUser(id);
        getUsers();
    };

    const handleSearch = () => {
        let filtered = user;

        if (nameSearch) {
            filtered = filtered.filter((data) => data.name.toLowerCase().includes(nameSearch.toLowerCase()));
        }

        if (codeSearch) {
            filtered = filtered.filter((data) => data.flightCode.toLowerCase().includes(codeSearch.toLowerCase()));
        }

        if (depSearch) {
            filtered = filtered.filter((data) => data.departure.toLowerCase().includes(depSearch.toLowerCase()));
        }

        if (filtered.length === 0) {
            alert("일치하는 결과가 없습니다.");
        }

        setFilteredUsers(filtered);
        setCurrentPage(1); // 검색 후 페이지를 첫 페이지로 초기화
    };

    const resetSearch = () => {
        setNameSearch("");
        setCodeSearch("");
        setDepSearch("");
        setFilteredUsers(user); // 모든 리스트 표시
    };

    // 의심으로 분류된 사용자 수 계산
    const suspectedCount = filteredUsers.filter((data) => data.symptom && data.symptom.length > 0).length;
    const totalCount = filteredUsers.length;

    // 현재 페이지에 표시할 사용자 목록 계산
    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

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
                <SearchDiv>
                    <SearchTitile>고급 검색</SearchTitile>
                    <SearchInputDiv>
                        <input
                            type="text"
                            placeholder="이름으로 검색"
                            value={nameSearch}
                            onChange={(e) => setNameSearch(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="항공편명으로 검색"
                            value={codeSearch}
                            onChange={(e) => setCodeSearch(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="출발지로 검색"
                            value={depSearch}
                            onChange={(e) => setDepSearch(e.target.value)}
                        />
                        <Button variant="contained" color="primary" onClick={handleSearch}>
                            검색
                        </Button>
                        <Button variant="contained" color="secondary" onClick={resetSearch}>
                            초기화
                        </Button>
                    </SearchInputDiv>
                </SearchDiv>
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
                            <TableRow key={index}>
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

const SearchTitile = styled.div`
    font-size: 20px;
    color: #3b7996;
    width: 100%;
    height: 30%;
    border-bottom: 2px solid #3b7996;
`;

const SearchInputDiv = styled.div`
    width: 100%;
    height: 40%;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    justify-content: left;
`;
