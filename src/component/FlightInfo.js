import React, { useEffect, useState, useCallback } from "react";
import styles from "./FlightInfo.module.css";
import left from "../assets/image/left.svg";
import right from "../assets/image/right.svg";
import refresh from "../assets/image/refresh.svg";

const ArrivalFlights = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [selectedZone, setSelectedZone] = useState("");

    const getZone = (gate) => {
        const gateNum = parseInt(gate, 10);
        if (gateNum >= 29 && gateNum <= 41) return "서편 앤틀러";
        if (gateNum >= 42 && gateNum <= 50) return "서편 통로";
        if (gateNum >= 5 && gateNum <= 11) return "동편 통로";
        if (gateNum >= 12 && gateNum <= 25) return "동편 앤틀러";
        if (gateNum >= 101 && gateNum <= 115) return "탑승동 동편";
        if (gateNum >= 118 && gateNum <= 132) return "탑승동 서편";
        if (gateNum >= 230 && gateNum <= 250) return "T2 동편";
        if (gateNum >= 251 && gateNum <= 270) return "T2 서편";
        return "Unknown";
    };

    const formatTime = (dateTime) => {
        const hours = dateTime.substring(8, 10);
        const minutes = dateTime.substring(10, 12);
        return `${hours}:${minutes}`;
    };

    const fetchArrivalFlights = useCallback(async () => {
        setLoading(true); // 새로고침 시 로딩 상태 설정
        const API_KEY = process.env.REACT_APP_FLIGHT_API_KEY;
        const URL = `https://apis.data.go.kr/B551177/StatusOfPassengerFlightsDSOdp/getPassengerArrivalsDSOdp?serviceKey=${API_KEY}&type=json`;

            try {
                const response = await fetch(URL);
                const data = await response.json();

                if (data.response.header.resultCode !== "00") {
                    throw new Error(data.response.header.resultMsg);
                }

            const filteredData = data.response.body.items
                .filter((flight) => flight.codeshare === "Master")
                .map((flight) => ({
                    airlineCode: flight.flightId,
                    origin: flight.airport,
                    arrivalTime: formatTime(flight.estimatedDateTime),
                    gate: flight.gatenumber,
                    status: flight.remark,
                    zone: getZone(flight.gatenumber),
                }));

            setFlights(filteredData);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false); // 로딩 종료
        }
    }, []);

    // 컴포넌트가 처음 렌더링될 때 데이터를 로드합니다.
    useEffect(() => {
        fetchArrivalFlights();
    }, [fetchArrivalFlights]);

    const filteredFlights = selectedZone
        ? flights.filter((flight) => flight.zone === selectedZone)
        : flights;

    const flightsToDisplay = filteredFlights.slice(page * 5, (page + 1) * 5);

    if (loading) {
        return <p className={styles['arrival-flights-container']}>Loading...</p>;
    }
    if (error) {
        return <p>Error: {error}</p>;
    }

    const zones = [
        "서편 앤틀러",
        "서편 통로",
        "동편 통로",
        "동편 앤틀러",
        "탑승동 동편",
        "탑승동 서편",
        "T2 동편",
        "T2 서편",
    ];

    return (
        <div className={styles['arrival-flights-container']}>
            <h1 className={styles['arrival-flights-container h1']}>항공편 도착 정보</h1>

            <div className={styles['zone-select-container']}>
                <label htmlFor="zone-select" className={styles['zone-select-container label']}>
                    현재 근무지:
                </label>
                <select
                    id="zone-select"
                    value={selectedZone}
                    onChange={(e) => {
                        setSelectedZone(e.target.value);
                        setPage(0);
                    }}
                    className={styles['zone-select-container select']}
                >
                    <option value="">전체</option>
                    {zones.map((zone) => (
                        <option key={zone} value={zone}>
                            {zone}
                        </option>
                    ))}
                </select>
                <button onClick={fetchArrivalFlights} className={styles['refresh-button']}>
                <img src={refresh} alt="refresh" />
                </button>
            </div>

            

            {flightsToDisplay.length === 0 ? (
                <p className={styles['no-flights-message']}>예정된 비행편이 없습니다.</p>
            ) : (
                <table className={styles['arrival-flights-table']}>
                    <thead>
                        <tr>
                            <th>도착시간</th>
                            <th>항공편명</th>
                            <th>출발지</th>
                            <th>게이트</th>
                            <th>현황</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flightsToDisplay.map((flight, index) => (
                            <tr key={index}>
                                <td>{flight.arrivalTime}</td>
                                <td>{flight.airlineCode}</td>
                                <td>{flight.origin}</td>
                                <td>{flight.gate}</td>
                                <td className={`${styles['status-cell']} ${styles[flight.status === '도착' ? 'status-arrived' : flight.status === '지연' ? 'status-delayed' : flight.status === '착륙' ? 'status-landed' : '']}`}>{flight.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div className={styles['pagination-buttons']}>
                <button
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    className={styles['pagination-buttons button']}
                >
                    <img src={left} alt="left" />
                </button>
                <button
                    disabled={(page + 1) * 5 >= filteredFlights.length}
                    onClick={() => setPage(page + 1)}
                    className={styles['pagination-buttons button']}
                >
                    <img src={right} alt="right" />
                </button>
            </div>
        </div>
    );
};

export default ArrivalFlights;
