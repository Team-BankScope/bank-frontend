import React, { useState } from 'react';
import styles from './CorporateAccount.module.css';

const CorporateAccount = ({ onCancel, onComplete, selectedTask }) => {
    const [formData, setFormData] = useState({
        companyName: selectedTask?.userName || '미등록 법인',
        businessNumber: '123-45-67890',
        representative: '김대표',
        accountType: '법인 당좌예금',
        purpose: '사업 운영자금 관리',
        initialDeposit: '0'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                <h1 className={styles.headerTitle}>법인계좌 개설</h1>
            </header>

            <div className={styles.formContainer}>
            
                <div className={styles.section}>
                    <div className={styles.labelRow}>
                        <span className={styles.centerLabel}>법인명</span>
                        <span className={styles.rightLabel}>대표자명</span>
                    </div>
                    <div className={styles.inputRow}>
                        <div className={styles.displayBox}>{formData.companyName}</div>
                        <div className={styles.displayBox}>{formData.representative}</div>
                    </div>
                </div>

           
                <div className={styles.section}>
                    <div className={styles.labelRow}>
                        <span className={styles.centerLabel}>사업자등록번호</span>
                        <span className={styles.rightLabel}>계좌 종류</span>
                    </div>
                    <div className={styles.inputRow}>
                        <div className={styles.inputFieldBox}>
                            <input name="businessNumber" value={formData.businessNumber} onChange={handleChange} />
                        </div>
                        <div className={styles.customSelectMain}>
                            <select name="accountType" value={formData.accountType} onChange={handleChange}>
                                <option value="법인 당좌예금">법인 당좌예금</option>
                                <option value="법인 보통예금">법인 보통예금</option>
                            </select>
                            <span className={styles.arrowUp}>▲</span>
                        </div>
                    </div>
                </div>

              
                <div className={styles.section}>
                    <div className={styles.labelRow}><span className={styles.centerLabel}>개설 목적</span></div>
                    <div className={styles.inputFieldBox}>
                        <input name="purpose" value={formData.purpose} onChange={handleChange} />
                    </div>
                </div>

               
                <div className={styles.buttonRow}>
                    <button className={styles.btnCancel} onClick={onCancel}>업무 취소</button>
                    <button className={styles.btnSubmit} onClick={() => onComplete(formData)}>계좌 개설 승인</button>
                </div>
            </div>
        </div>
    );
};

export default CorporateAccount;