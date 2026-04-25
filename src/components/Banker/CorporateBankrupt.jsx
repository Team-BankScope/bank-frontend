import React, { useState } from 'react';
import styles from './CorporateBankrupt.module.css';

const CorporateBankrupt = ({ onCancel, onComplete, selectedTask }) => {
    const [formData, setFormData] = useState({
        companyName: selectedTask?.userName || '법인명 확인 필요',
        businessNumber: '123-45-67890',
        bankruptDate: '2026-04-25',
        reason: '지급불능', 
        riskLevel: '고위험(E)',
        description: '연체 3회 이상 발생 및 자산 동결 상태'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <h1 className={`${styles.headerTitle} ${styles.danger}`}>부도 관리 심사</h1>
            </header>

            <div className={styles.formContainer}>
            
                <div className={styles.section}>
                    <div className={styles.labelRow}>
                        <span>법인명</span>
                        <span>사업자등록번호</span>
                    </div>
                    <div className={styles.inputRow}>
                        <div className={styles.displayBox}>{formData.companyName}</div>
                        <div className={styles.displayBox}>{formData.businessNumber}</div>
                    </div>
                </div>

              
                <div className={styles.gridTwo}>
                    <div className={styles.section}>
                        <div className={styles.labelRow}><span>부도 발생일</span></div>
                        <div className={styles.inputFieldBox}>
                            <input type="date" name="bankruptDate" value={formData.bankruptDate} onChange={handleChange} />
                        </div>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.labelRow}><span>리스크 등급</span></div>
                        <div className={styles.displayBox} style={{color: '#e74c3c', fontWeight: 'bold'}}>{formData.riskLevel}</div>
                    </div>
                </div>

                <div className={styles.section}>
                    <div className={styles.labelRow}><span>부도 사유</span></div>
                    <div className={styles.customSelectMain}>
                        <select name="reason" value={formData.reason} onChange={handleChange}>
                            <option value="지급불능">지급불능 (Cash Flow)</option>
                            <option value="채무초과">채무초과 (Insolvency)</option>
                            <option value="당좌거래정지">당좌거래정지</option>
                        </select>
                        <span className={styles.arrowUp}>▲</span>
                    </div>
                </div>

                <div className={styles.section}>
                    <div className={styles.labelRow}><span>상세 경위</span></div>
                    <div className={styles.inputFieldBox}>
                        <textarea 
                            name="description" 
                            className={styles.textarea} 
                            value={formData.description} 
                            onChange={handleChange}
                        />
                    </div>
                </div>

                
                <div className={styles.buttonRow}>
                    <button className={styles.btnCancel} onClick={onCancel}>업무 취소</button>
                    <button className={`${styles.btnSubmit} ${styles.btnDanger}`} onClick={() => onComplete(formData)}>부도 확정 처리</button>
                </div>
            </div>
        </div>
    );
};

export default CorporateBankrupt;