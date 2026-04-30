import React, { useState } from 'react';
import styles from './CorporateLoan.module.css';
import { useModal } from '../../context/ModalContext'; // useModal 훅 추가

const CorporateLoan = ({ onCancel, onComplete, selectedTask }) => {
    const { openModal } = useModal(); // 모달 훅 사용
    const [formData, setFormData] = useState({
        companyName: selectedTask?.userName || '미등록 기업',
        businessNumber: '123-45-67890',
        loanType: '기업 운영자금 대출',
        amount: '500,000,000',
        period: '36개월',
        rate: '4.2',
        repaymentMethod: '원금균등상환'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        openModal({
            title: "알림",
            message: "기업대출 심사가 완료/승인되었습니다.",
            confirmText: "확인",
            onConfirm: () => {
                if (onComplete) onComplete(formData);
            }
        });
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                <h1 className={styles.headerTitle}>기업대출 심사</h1>
            </header>

            <div className={styles.formContainer}>
          
                <div className={styles.section}>
                    <div className={styles.labelRow}>
                        <span className={styles.centerLabel}>기업명</span>
                        <span className={styles.rightLabel}>사업자번호</span>
                    </div>
                    <div className={styles.inputRow}>
                        <div className={styles.displayBox}>{formData.companyName}</div>
                        <div className={styles.displayBox}>{formData.businessNumber}</div>
                    </div>
                </div>

       
                <div className={styles.section}>
                    <div className={styles.labelRow}><span className={styles.centerLabel}>대출 신청 금액</span></div>
                    <div className={styles.amountFieldBox}>
                        <input name="amount" type="text" value={formData.amount} onChange={handleChange} />
                        <span className={styles.unit}>원</span>
                    </div>
                </div>

   
                <div className={styles.section}>
                    <div className={styles.gridTwo}>
                        <div className={styles.inputGroup}>
                            <label className={styles.centerLabel}>대출 기간</label>
                            <div className={styles.inputFieldBox}>
                                <input name="period" value={formData.period} onChange={handleChange} />
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.centerLabel}>금리 (%)</label>
                            <div className={styles.inputFieldBox}>
                                <input name="rate" value={formData.rate} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>

            
                <div className={styles.buttonRow}>
                    <button className={styles.btnCancel} onClick={onCancel}>업무 취소</button>
                    <button className={styles.btnSubmit} onClick={handleSubmit}>심사 완료/승인</button>
                </div>
            </div>
        </div>
    );
};

export default CorporateLoan;