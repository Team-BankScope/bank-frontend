import React, { useState, useEffect } from 'react';
import styles from './Kiosk.module.css';
import BackgroundImage from '../../images/Kiosk/KioskBackground.jpg';
import KioskLogin from './KioskLogin';
import KioskTaskSelect from './KioskTaskSelect';
import KioskComplete from './KioskComplete';
import KioskNonMember from './KioskNonMember';
import CustomModal from '../../components/common/CustomModal';

const Kiosk = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        ssn: '',
        userName: '',
        userId: null,        // 로그인 후 세션에서 저장하는 DB user.id
        task: '',
        taskType: '',
        isAi: false,         // AI 자동 접수 여부
        aiTaskResult: null,  // AI 접수 완료 후 결과 저장
    });
    const [dashboardData, setDashboardData] = useState({
        waitingCount: 0,
        averageTime: 0,
        availableCounter: 0
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');

    const fetchDashboardData = async () => {
        try {
            const [waitingRes, timeRes, counterRes] = await Promise.all([
                fetch('/api/kiosk/waiting-count'),
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

    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (step === 1) {
            fetchDashboardData();
        }
    }, [step]);

    const handleGoHome = () => {
        setFormData({ ssn: '', userName: '', userId: null, task: '', taskType: '', isAi: false, aiTaskResult: null });
        setStep(1);
    };

    const handleAddMoreTask = () => {
        setFormData(prev => ({ ...prev, task: '', taskType: '', isAi: false, aiTaskResult: null }));
        setStep(4);
    };

    const handleAiConfirm = async () => {
        if (!formData.userId) {
            setAiError('사용자 정보를 불러오지 못했습니다. 다시 로그인해 주세요.');
            return;
        }
        setIsAiLoading(true);
        setAiError('');
        try {
            const response = await fetch('/py/auto-insert-task', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: formData.userId }),
            });
            const data = await response.json();
            if (!response.ok || data.result !== 'SUCCESS') {
                throw new Error(data.detail || '자동 접수 처리 중 오류가 발생했습니다.');
            }
            const task = data.taskResult;
            setFormData(prev => ({
                ...prev,
                isAi: true,
                taskType: task.task_type,
                task: task.task_detail_type,
                aiTaskResult: {
                    ticketNumber: task.ticket_number,
                    assignedLevel: task.assigned_level,
                    expectedWaitingTime: task.expected_waiting_time,
                },
            }));
            setIsModalOpen(false);
            setStep(5);
        } catch (err) {
            setAiError(err.message || '서버와 통신 중 오류가 발생했습니다.');
        } finally {
            setIsAiLoading(false);
        }
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
        return <>{year}년{month}월{day}일<br />{ampm} {headerHours} : {minutes}</>;
    };

    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <KioskNonMember
                        formData={formData}
                        setFormData={setFormData}
                        onNext={() => setStep(3)}
                        onPrev={() => setStep(1)}
                    />
                );
            case 1:
                return (
                    <div className={styles.mainArea}>
                        <img src={BackgroundImage} alt="배경이미지" className={styles.backgroundImage} />
                        <div className={styles.content}>
                            <div className={styles.progressIndicator}>
                                <div className={`${styles.step} ${styles.active}`}></div>
                                <div className={styles.step}></div>
                                <div className={styles.step}></div>
                                <div className={styles.step}></div>
                                <div className={styles.step}></div>
                            </div>
                            <h1 className={styles.title}>비교는 빠르게<br/>선택은 안전하게</h1>
                            <p className={styles.subtitle}>AI 기반 창구 자동배치로 최적의 담당자를<br/>연결해 드립니다.</p>
                        </div>
                        <div className={styles.infoCards}>
                            <div className={styles.card}><span className={styles.cardTitle}>현재 대기 고객</span><span className={styles.cardValue}>{dashboardData.waitingCount}</span></div>
                            <div className={styles.card}><span className={styles.cardTitle}>예상 대기 시간</span><span className={styles.cardValue}>약 {Math.round(dashboardData.averageTime)}분</span></div>
                            <div className={styles.card}><span className={styles.cardTitle}>운영중인 창구</span><span className={styles.cardValue}>{dashboardData.availableCounter}</span></div>
                        </div>
                        <div className={styles.buttonContainer}>
                            <button className={styles.startButton} onClick={() => setStep(2)}>회원 접수 시작하기</button>
                            <button className={styles.startButton2} onClick={() => setStep(0)}>비회원 접수 시작하기</button>
                        </div>
                    </div>
                );
            case 2:
                return <KioskLogin formData={formData} setFormData={setFormData} onNext={() => setStep(3)} onPrev={() => setStep(1)} />;
            case 3:
                return (
                    <div className={styles.loginArea}>
                        {/* 💡 상단 로그인 유저 정보 표시 추가 (step === 3 일때는 userInfoWrapper를 직접 렌더링하지 않고 CSS에서 제어해야함) */}
                        <div className={styles.userInfoWrapper}>
                            <span className={styles.userBadge}>
                                <span className={styles.badgeText}>본인확인완료</span>
                                <span className={styles.badgeDot}>•</span>
                                <span className={styles.userName}>{formData.userName}님</span>
                            </span>
                        </div>

                        <div className={styles.progressIndicator}>
                            <div className={styles.step}></div>
                            <div className={styles.step}></div>
                            <div className={`${styles.step} ${styles.active}`}></div>
                            <div className={styles.step}></div>
                            <div className={styles.step}></div>
                        </div>
                        <div className={styles.loginHeader} style={{ marginTop: '20px' }}>
                            <h2 className={styles.loginTitle}>접수 방식을 선택해주세요</h2>
                            <p className={styles.loginSubtitle}>원하시는 접수 방식을 선택해주세요.</p>
                        </div>

                        <div className={styles.modeSelectContainer}>
                            <div className={styles.modeCard}>
                                <h3 className={styles.modeTitle}>자동 접수</h3>
                                <p className={styles.modeDesc}>
                                    고객님의 정보를 AI가 분석하여<br/>
                                    <strong>가장 빠르고 적합한 창구</strong>로<br/>
                                    알아서 안내해 드립니다.
                                </p>
                                <button className={styles.modeButtonPrimary} onClick={() => setIsModalOpen(true)}>
                                    자동 접수하기
                                </button>
                            </div>

                            <div className={styles.modeCard}>
                                <h3 className={styles.modeTitle}>직접 접수</h3>
                                <p className={styles.modeDesc}>
                                    원하시는 <strong>업무를 직접 선택</strong>하여<br/>
                                    해당 창구로 번호표를<br/>
                                    발급받습니다.
                                </p>
                                <button className={styles.modeButtonSecondary} onClick={() => setStep(4)}>
                                    직접 접수하기
                                </button>
                            </div>
                        </div>

                        {/* 이전으로 버튼 (처음 화면으로 돌아가기) */}
                        <button className={styles.prevButton} onClick={() => setStep(1)}>
                            ← 처음으로
                        </button>
                    </div>
                );
            case 4:
                return <KioskTaskSelect formData={formData} setFormData={setFormData} onNext={() => setStep(5)} onPrev={() => setStep(3)} userName={formData.userName} />;
            case 5:
                return <KioskComplete formData={formData} onGoHome={handleGoHome} onAddMore={handleAddMoreTask} userName={formData.userName} />;
            default:
                return null;
        }
    };

    return (
        <div className={styles.kioskContainer}>
            <div className={styles.header}>
                <span className={styles.logo}>BankScope</span>
                <span className={styles.dateTime}>{getCurrentDateTime()}</span>
            </div>
            {renderStep()}
            <CustomModal
                isOpen={isModalOpen}
                onClose={() => { if (!isAiLoading) { setIsModalOpen(false); setAiError(''); } }}
                title="AI 자동 접수"
                onConfirm={handleAiConfirm}
                onCancel={() => { setIsModalOpen(false); setAiError(''); }}
                confirmText={isAiLoading ? '분석 중...' : '접수하기'}
                cancelText="취소"
                noAutoClose
            >
                <div style={{ textAlign: 'center', padding: '10px 4px', lineHeight: '1.7' }}>
                    {isAiLoading ? (
                        <p style={{ fontSize: '1.1rem', color: '#555' }}>
                            AI가 고객님의 데이터를 분석하고 있습니다...
                        </p>
                    ) : aiError ? (
                        <p style={{ fontSize: '1.05rem', color: '#e53e3e' }}>{aiError}</p>
                    ) : (
                        <p style={{ fontSize: '1.1rem', color: '#333' }}>
                            고객님의 거래 이력과 금융 데이터를 AI가 분석하여<br />
                            <strong>최적의 창구로 자동 배정</strong>합니다.<br />
                            계속 진행하시겠습니까?
                        </p>
                    )}
                </div>
            </CustomModal>
        </div>
    );
};

export default Kiosk;