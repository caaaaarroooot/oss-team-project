import React, { useRef } from 'react';
import Weather from '../component/Weather';
import QuarantineForm from '../component/QuarantineForm';
import FlightInfo from '../component/FlightInfo';
import styles from './FormPage.module.css'; // CSS 모듈 임포트

function FormPage() {
  const formRef = useRef(null); // QuarantineForm 접근을 위한 useRef 생성

  // 외부 버튼으로 폼 제출 트리거
  const handleFormSubmit = () => {
    if (formRef.current) {
      formRef.current.requestSubmit(); // 폼 제출 호출
    }
  };

  return (
    <div className={styles.container}>
      {/* QuarantineForm */}
      <div className={styles.formWrapper}>
        <QuarantineForm ref={formRef} mode="new" /> {/* formRef 전달 */}
      </div>

    <div className={styles.rightSide}>
      {/* FlightInfo 및 Weather */}
      <div className={styles.infoWrapper}>
        <FlightInfo />
        <Weather />
      </div>

      {/* 제출 버튼 */}
      <button 
        onClick={handleFormSubmit} 
        className={styles.submitButton}
      >
        검역 완료
      </button>
    </div>
    </div>
  );
}

export default FormPage;
