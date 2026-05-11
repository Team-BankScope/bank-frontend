import React, { useState } from 'react';
import { useModal } from '../../context/ModalContext';
import styles from './CorporateBankrupt.module.css';

const CorporateBankrupt = ({ onCancel, onComplete, selectedTask }) => {
    const { openModal } = useModal();
    const [formData, setFormData] = useState({
        companyName: selectedTask?.userName || '권정균',
        businessNumber: '123-45-67890',
        bankruptDate: '2026-04-25',
        reason: '지급불능', 
        riskLevel: '고위험(E)',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        openModal({
            title: "부도 확정 경고",
            message: `[${formData.companyName}] 법인의 부도 처리를 확정하시겠습니까?`,
            confirmText: "부도 확정",
            cancelText: "취소",
            onConfirm: () => onComplete(formData)
        });
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                <h1 className={styles.headerTitle}>부도 관리 심사</h1>
                <div className={styles.riskBadge}>{formData.riskLevel} 등급</div>
            </header>

            <div className={styles.formContainer}>
                <div className={styles.section}>
                    <div className={styles.labelRow}>
                        <span className={styles.centerLabel}>법인 정보</span>
                    </div>
                    <div className={styles.inputRow}>
                        <div className={styles.customSelectFull}>
                            <input 
                                type="text" 
                                className={styles.inputField} 
                                value={`법인명: ${formData.companyName}`} 
                                readOnly 
                            />
                        </div>
                        <div className={styles.customSelectFull}>
                            <input 
                                type="text" 
                                className={styles.inputField} 
                                value={`사업자번호: ${formData.businessNumber}`} 
                                readOnly 
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <div className={styles.gridTwo}>
                        <div className={styles.inputGroup}>
                            <label className={styles.centerLabel}>부도 발생일</label>
                            <div className={styles.customSelectFull}>
                                <input 
                                    type="date" 
                                    name="bankruptDate" 
                                    className={styles.inputField} 
                                    value={formData.bankruptDate} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.centerLabel}>부도 사유</label>
                            <div className={styles.customSelectFull}>
                                <select 
                                    name="reason" 
                                    className={styles.selectField} 
                                    value={formData.reason} 
                                    onChange={handleChange}
                                >
                                    <option value="지급불능">지급불능 (Cash Flow)</option>
                                    <option value="채무초과">채무초과 (Insolvency)</option>
                                    <option value="당좌거래정지">당좌거래정지</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <div className={styles.labelRow}>
                        <span className={styles.centerLabel}>상세 경위</span>
                    </div>
                    <div className={styles.textareaBox}>
                        <textarea 
                            name="description" 
                            className={styles.textareaField} 
                            value={formData.description} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>

                <div className={styles.buttonRow}>
                    <button className={styles.btnCancel} onClick={onCancel}>업무 취소</button>
                    <button className={styles.btnSubmit} onClick={handleSubmit}>부도 확정 처리</button>
                </div>
            </div>
        </div>
    );
};

export default CorporateBankrupt;