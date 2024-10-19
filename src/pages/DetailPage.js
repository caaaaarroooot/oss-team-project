import React, { useEffect, useState } from 'react';
import QuarantineForm from '../component/QuarantineForm';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; 
import styles from './DetailPage.module.css'; 
import Swal from 'sweetalert2';

const DetailPage = () => {
    const { id } = useParams();  
    const [existingData, setExistingData] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://670c91777e5a228ec1d0b2ca.mockapi.io/api/healthInfo/${id}`);
                setExistingData(response.data);
            } catch (error) {
                console.error('데이터를 가져오는 중 오류 발생:', error);
            }
        };

        fetchData();
    }, [id]);

    const handleSave = async (updatedData) => {
        try {
            await axios.put(`https://670c91777e5a228ec1d0b2ca.mockapi.io/api/healthInfo/${id}`, updatedData);
            Swal.fire({
                title: '수정 완료!',
                text: '데이터가 성공적으로 수정되었습니다.',
                icon: 'success',
                confirmButtonText: '확인',
            });
            navigate('/list');  // 수정 후 목록 페이지로 이동
        } catch (error) {
            console.error('데이터 저장 중 오류 발생:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`https://670c91777e5a228ec1d0b2ca.mockapi.io/api/healthInfo/${id}`);
            Swal.fire({
                title: '삭제 완료!',
                text: '데이터가 성공적으로 삭제되었습니다.',
                icon: 'success',
                confirmButtonText: '확인',
            });
            navigate('/list');  // 삭제 후 목록 페이지로 이동
        } catch (error) {
            console.error('데이터 삭제 중 오류 발생:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                {existingData ? (
                    <QuarantineForm
                        mode="edit"
                        existingData={existingData}
                        onSave={handleSave}
                        onDelete={handleDelete}
                    />
                ) : (
                    <p>로딩 중...</p>
                )}
            </div>
        </div>
    );
};

export default DetailPage;
