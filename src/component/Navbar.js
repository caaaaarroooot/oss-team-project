import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/image/logo.svg";
import styles from "./Navbar.module.css";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const renderButtons = () => {
        switch (location.pathname) {
            case "/":
                return (
                    <button onClick={() => navigate("/form")} className={styles.navButton}>
                        검역 시작
                    </button>
                );
            case "/detail/:id":
                return (
                    <button onClick={() => navigate("/")} className={styles.navButton}>
                        목록으로 돌아가기
                    </button>
                );
            default:
                return (
                    <button onClick={() => navigate("/")} className={styles.navButton}>
                        목록 보기
                    </button>
                );
        }
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <img src={logo} alt="logo" className={styles.logoImage} />
            </div>
            <div className={styles.navButtons}>{renderButtons()}</div>
        </nav>
    );
};

export default Navbar;
