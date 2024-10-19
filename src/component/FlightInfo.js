import React, { useEffect, useState } from "react";

const ArrivalFlights = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [selectedZone, setSelectedZone] = useState("");

    // 구역 구분 함수
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
        return "Unknown"; // 해당되지 않는 경우
    };

    const formatTime = (dateTime) => {
        const hours = dateTime.substring(8, 10);
        const minutes = dateTime.substring(10, 12);
        return `${hours}:${minutes}`;
    };

    useEffect(() => {
        const fetchArrivalFlights = async () => {
            // const API_KEY = process.env.REACT_APP_FLIGHT_API_KEY;
            const URL = `http://apis.data.go.kr/B551177/StatusOfPassengerFlightsDSOdp/getPassengerArrivalsDSOdp?serviceKey=3MFSy4GoljGrNKSzlLp3koZy5ayXV6xJ0bqgs6G%2Fdr92oHXxju%2F84FIrp5iDdlx2kLNPNa3Mi%2B1uhqZaVj07qw%3D%3D&type=json`;

            try {
                const response = await fetch(URL);
                const data = await response.json();

                if (data.response.header.resultCode !== "00") {
                    throw new Error(data.response.header.resultMsg);
                }

                // 필요한 데이터: 항공코드, 출발지, 도착시간(변경된 시간), 게이트 번호, 현황
                const filteredData = data.response.body.items
                    .filter((flight) => flight.codeshare === "Master") // Master Flight만 필터링
                    .map((flight) => ({
                        airlineCode: flight.flightId,
                        origin: flight.airport,
                        arrivalTime: formatTime(flight.estimatedDateTime),
                        gate: flight.gatenumber,
                        status: flight.remark,
                        zone: getZone(flight.gatenumber), // 구역 구분 추가
                    }));

                setFlights(filteredData);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchArrivalFlights();
    }, []); // 빈 의존성 배열로, 컴포넌트가 마운트될 때만 실행

    // 구역별 필터링
    const filteredFlights = selectedZone ? flights.filter((flight) => flight.zone === selectedZone) : flights;

    const flightsToDisplay = filteredFlights.slice(page * 5, (page + 1) * 5);

    if (loading) {
        return <p>Loading...</p>;
    }
    if (error) {
        return <p>Error: {error}</p>;
    }

    // 선택 가능한 구역 옵션
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
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                border: "1px solid #ccc",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                maxWidth: "800px",
                margin: "auto",
            }}
        >
            <h1>Arriving Flights by Gate Zone</h1>

            {/* 구역 선택 */}
            <div style={{ marginBottom: "20px" }}>
                <label htmlFor="zone-select">Select a zone: </label>
                <select
                    id="zone-select"
                    value={selectedZone}
                    onChange={(e) => {
                        setSelectedZone(e.target.value);
                        setPage(0);
                    }}
                >
                    <option value="">All Zones</option>
                    {zones.map((zone) => (
                        <option key={zone} value={zone}>
                            {zone}
                        </option>
                    ))}
                </select>
            </div>

            {flightsToDisplay.length === 0 ? (
                <p>No flights available in this zone</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>Arrival Time</th>
                            <th style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>Airline Code</th>
                            <th style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>Origin</th>
                            <th style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>Gate</th>
                            <th style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flightsToDisplay.map((flight, index) => (
                            <tr key={index}>
                                <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                                    {flight.arrivalTime}
                                </td>
                                <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                                    {flight.airlineCode}
                                </td>
                                <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>{flight.origin}</td>
                                <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>{flight.gate}</td>
                                <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>{flight.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* 페이지네이션 버튼 */}
            <div style={{ marginTop: "20px" }}>
                <button
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    style={{
                        marginRight: "10px",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        cursor: "pointer",
                    }}
                >
                    Previous
                </button>
                <button
                    disabled={(page + 1) * 5 >= filteredFlights.length}
                    onClick={() => setPage(page + 1)}
                    style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", cursor: "pointer" }}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ArrivalFlights;
