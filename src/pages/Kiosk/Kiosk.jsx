import React, { useState, useEffect } from 'react';
import styles from './Kiosk.module.css';
import BackgroundImage from '../../images/Kiosk/KioskBackground.jpg';
import KioskLogin from './KioskLogin';
import KioskTaskSelect from './KioskTaskSelect';
import KioskComplete from './KioskComplete';
import KioskNonMember from './KioskNonMember'; // 비회원 접수 컴포넌트 추가

const Kiosk = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        ssn: '',
        userName: '',
        task: '', // 선택한 업무
        taskType: '', // 업무 유형 (빠른 업무, 상담 업무 등)
    });

    // 대시보드 데이터 상태
    const [dashboardData, setDashboardData] = useState({
        waitingCount: 0,
        averageTime: 0,
        availableCounter: 0
    });

    // 대시보드 데이터 가져오기 함수 분리
    const fetchDashboardData = async () => {
        try {
            const [waitingRes, timeRes, counterRes] = await Promise.all([
                fetch('/api/kiosk/waiting-count'), // 수정된 엔드포인트
                fetch('/api/kiosk/average-time'),
                fetch('/api/kiosk/available-count')
            ]);

            const waitingCountText = await waitingRes.text();
            const averageTimeText = await timeRes.text();
            const availableCounterText = await counterRes.text();

            setDashboardData({
                waitingCount: Number(waitingCountText) || 0,
                averageTime: parseFloat(averageTimeText) || 0,
                availableCounter: Number(availableCounterText) || 0
            });
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        }
    };

    // 초기 로드 및 주기적 갱신
    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 5000); // 5초마다 갱신 (더 자주 갱신)
        return () => clearInterval(interval);
    }, []);

    // step이 1(홈 화면)로 바뀔 때마다 데이터 갱신
    useEffect(() => {
        if (step === 1) {
            fetchDashboardData();
        }
    }, [step]);

    const handleGoHome = () => {
        setFormData({ ssn: '', task: '', userName: '', taskType: '' });
        setStep(1);
    };

    // 추가 업무 접수 핸들러 (로그인 정보 유지, 업무 선택 단계로 이동)
    const handleAddMoreTask = () => {
        setFormData(prev => ({ ...prev, task: '', taskType: '' }));
        setStep(3); // 업무 선택 단계로 이동
    };

    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? '오후' : '오전';
        const headerHours = hours % 12 || 12;

        return (
            <>
                {year}년{month}월{day}일<br />
                {ampm} {headerHours} : {minutes}
            </>
        );
    };

    return (
        <div className={styles.kioskContainer}>
            <div className={styles.header}>
                <span className={styles.logo}>BankScope</span>
                <span className={styles.dateTime}>{getCurrentDateTime()}</span>
            </div>

            {step === 1 && (
                <div className={styles.mainArea}>
                    <img src={BackgroundImage} alt="배경이미지" className={styles.backgroundImage} />

                    <div className={styles.content}>
                        <div className={styles.progressIndicator}>
                            <div className={`${styles.step} ${styles.active}`}></div>
                            <div className={styles.step}></div>
                            <div className={styles.step}></div>
                            <div className={styles.step}></div>
                        </div>

                        <h1 className={styles.title}>비교는 빠르게<br/>선택은 안전하게</h1>
                        <p className={styles.subtitle}>AI 기반 창구 자동배치로 최적의 담당자를<br/>연결해 드립니다.</p>
                    </div>

                    <div className={styles.infoCards}>
                        <div className={styles.card}>
                            <span className={styles.cardTitle}>현재 대기 고객</span>
                            <span className={styles.cardValue}>{dashboardData.waitingCount}</span>
                        </div>
                        <div className={styles.card}>
                            <span className={styles.cardTitle}>예상 대기 시간</span>
                            <span className={styles.cardValue}>약 {Math.round(dashboardData.averageTime)}분</span>
                        </div>
                        <div className={styles.card}>
                            <span className={styles.cardTitle}>운영중인 창구</span>
                            <span className={styles.cardValue}>{dashboardData.availableCounter}</span>
                        </div>
                    </div>
                    
                    <div className={styles.buttonContainer}>
                        <button className={styles.startButton} onClick={() => setStep(2)}>
                            회원 접수 시작하기
                        </button>
                        <button className={styles.startButton2} onClick={() => setStep(0)}>
                            비회원 접수 시작하기
                        </button>
                    </div>
                </div>
            )}

            {/* 💡 Step 0: 비회원 접수 화면 */}
            {step === 0 && (
                <KioskNonMember
                    formData={formData}
                    setFormData={setFormData}
                    onNext={() => setStep(3)} // 비회원 접수 완료 시 업무 선택(Step 3)으로 이동
                    onPrev={() => setStep(1)} // 이전 단계로
                />
            )}

            {step === 2 && (
                <KioskLogin
                    formData={formData}
                    setFormData={setFormData}
                    onNext={() => setStep(3)}
                    onPrev={() => setStep(1)}
                />
            )}
            {step === 3 && (
                <KioskTaskSelect
                    formData={formData}
                    setFormData={setFormData}
                    onNext={() => setStep(4)}
                    onPrev={() => setStep(2)}
                    userName={formData.userName}
                />
            )}
            {step === 4 && (
                <KioskComplete
                    formData={formData}
                    onGoHome={handleGoHome}
                    onAddMore={handleAddMoreTask} // 추가 업무 핸들러 전달
                    userName={formData.userName}
                />
            )}
        </div>
    );
};

export default Kiosk;
