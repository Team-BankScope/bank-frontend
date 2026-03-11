import React, { useState } from 'react';
import styles from './Kiosk.module.css';

const KioskNonMember = ({ formData, setFormData, onNext, onPrev }) => {
    const [localData, setLocalData] = useState({
        name: '',
        ssn: '',
        password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalData({
            ...localData,
            [name]: value
        });
    };

    // 확인 버튼 핸들러
    const handleConfirm = () => {
        if (!localData.name || !localData.ssn || !localData.password) {
            alert('모든 정보를 입력해주세요.');
            return;
        }

        if (localData.ssn.length !== 13) {
            alert('주민번호 13자리를 정확히 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        
        // 비회원 정보 저장
        setFormData(prev => ({ 
            ...prev, 
            ssn: localData.ssn,
            userName: localData.name,
            // 비밀번호는 필요하다면 저장하거나, 여기서 바로 API 호출에 사용
        }));

        // 다음 단계로 이동
        onNext();
        setIsSubmitting(false);
    };

    return (
        <div className={styles.loginArea}>
            <div className={styles.progressIndicator}>
                <div className={`${styles.step} ${styles.active}`}></div>
                <div className={styles.step}></div>
                <div className={styles.step}></div>
                <div className={styles.step}></div>
            </div>

            <div className={styles.loginHeader}>
                <h2 className={styles.loginTitle}>비회원 접수</h2>
                <p className={styles.loginSubtitle}>간단한 정보를 입력해주세요</p>
            </div>

            <div className={styles.formContainer}>
                <div className={styles.inputGroup}>
                    <label htmlFor="name">이름</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={localData.name}
                        onChange={handleChange}
                        placeholder="이름을 입력하세요"
                        className={styles.inputField}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="ssn">주민등록번호</label>
                    <input
                        type="text"
                        id="ssn"
                        name="ssn"
                        value={localData.ssn}
                        onChange={handleChange}
                        placeholder="'-' 없이 숫자만 입력하세요"
                        maxLength="13"
                        className={styles.inputField}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="password">비밀번호</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={localData.password}
                        onChange={handleChange}
                        placeholder="비밀번호를 입력하세요"
                        className={styles.inputField}
                    />
                </div>

                <button 
                    className={styles.confirmButton}
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                >
                    확인
                </button>
            </div>

            <button className={styles.prevButton} onClick={onPrev} disabled={isSubmitting}>
                ← 이전으로
            </button>
        </div>
    );
};

export default KioskNonMember;
