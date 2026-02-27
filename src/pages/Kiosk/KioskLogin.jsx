import React, { useState } from 'react';
import styles from './Kiosk.module.css';

const KioskLogin = ({ formData, setFormData, onNext, onPrev }) => {
    // 서버 전송 중 버튼 중복 클릭 방지를 위한 상태
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 키패드 클릭 핸들러
    const handleKeyPress = (num) => {
        if (formData.ssn.length < 13) {
            setFormData(prev => ({ ...prev, ssn: prev.ssn + num }));
        }
    };

    // 지우기 핸들러
    const handleDelete = () => {
        setFormData(prev => ({ ...prev, ssn: prev.ssn.slice(0, -1) }));
    };

    // 💡 수정된 부분: 확인 버튼 (서버로 데이터 전송)
    const handleConfirm = async () => {
        if (formData.ssn.length === 13) {
            try {
                setIsSubmitting(true); // 로딩 시작

                // 쿼리 파라미터로 residentNumber 전송
                const queryParams = new URLSearchParams({
                    residentNumber: formData.ssn
                }).toString();

                const response = await fetch(`/api/user/kiosk/login?${queryParams}`, {
                    method: 'POST',
                    headers: {
                        // 'Content-Type': 'application/json', // 쿼리 파라미터로 보내므로 필요 없음
                    },
                    // body: JSON.stringify({ residentNumber: formData.ssn }), // 쿼리 파라미터로 보내므로 body 제거
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data.result === 'SUCCESS') {
                        // 성공 시 세션 정보를 다시 조회하여 사용자 이름 가져오기
                        const sessionResponse = await fetch('/api/user/session');
                        if (sessionResponse.ok) {
                            const sessionData = await sessionResponse.json();
                            if (sessionData.result === 'SUCCESS') {
                                setFormData(prev => ({ ...prev, userName: sessionData.name }));
                            }
                        }

                        alert('고객정보가 확인되었습니다.'); // 모달창(alert) 띄우기
                        // 검증 완료 후 3단계로 이동
                        onNext();
                    } else {
                        // 서버에서 에러 응답을 보낸 경우 (예: 존재하지 않는 주민번호)
                        alert('일치하는 고객 정보가 없습니다. 다시 확인해주세요.');
                        setFormData(prev => ({ ...prev, ssn: '' })); // 입력값 초기화
                    }
                } else {
                    alert('서버 오류가 발생했습니다.');
                    setFormData(prev => ({ ...prev, ssn: '' })); // 입력값 초기화
                }
            } catch (error) {
                console.error('로그인 API 통신 에러:', error);
                alert('서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                setFormData(prev => ({ ...prev, ssn: '' })); // 입력값 초기화
            } finally {
                setIsSubmitting(false); // 로딩 종료
            }
        } else {
            alert('주민번호 13자리를 모두 입력해주세요.');
        }
    };

    return (
        <div className={styles.loginArea}>
            <div className={styles.progressIndicator}>
                <div className={styles.step}></div>
                <div className={`${styles.step} ${styles.active}`}></div>
                <div className={styles.step}></div>
                <div className={styles.step}></div>
            </div>

            <div className={styles.loginHeader}>
                <h2 className={styles.loginTitle}>로그인</h2>
                <p className={styles.loginSubtitle}>주민번호 13자리를 입력해주세요</p>
            </div>

            {/* 주민번호 입력 박스 영역 */}
            <div className={styles.ssnContainer}>
                {[...Array(6)].map((_, i) => (
                    <div key={`front-${i}`} className={styles.ssnBox}>
                        {formData.ssn[i] || ''}
                    </div>
                ))}
                <span className={styles.dash}>-</span>
                {[...Array(7)].map((_, i) => {
                    const value = formData.ssn[i + 6];
                    const isMasked = i > 0 && value;
                    return (
                        <div key={`back-${i}`} className={styles.ssnBox}>
                            {isMasked ? '●' : (value || '')}
                        </div>
                    );
                })}
            </div>

            {/* 키패드 영역 */}
            <div className={styles.keypad}>
                {[7, 8, 9, 4, 5, 6, 1, 2, 3].map(num => (
                    <button
                        key={num}
                        className={styles.keypadBtn}
                        onClick={() => handleKeyPress(num)}
                        disabled={isSubmitting} // 전송 중일 때 버튼 비활성화
                    >
                        {num}
                    </button>
                ))}
                <button className={styles.keypadBtn} onClick={handleDelete} disabled={isSubmitting}>지우기</button>
                <button className={styles.keypadBtn} onClick={() => handleKeyPress(0)} disabled={isSubmitting}>0</button>
                <button
                    className={styles.keypadBtn}
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? '확인 중..' : '확인'}
                </button>
            </div>

            <button className={styles.prevButton} onClick={onPrev} disabled={isSubmitting}>
                ← 이전으로
            </button>
        </div>
    );
};

export default KioskLogin;