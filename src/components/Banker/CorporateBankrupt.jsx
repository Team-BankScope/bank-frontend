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
        description: '연체 3회 이상 발생 및 자산 동결 상태'
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
                <div className={styles.headerMain}>
                    <span className={styles.warningIcon}>⚠️</span>
                    <h1 className={styles.headerTitle}>부도 관리 심사</h1>
                </div>
                <div className={styles.riskBadge}>{formData.riskLevel} 등급</div>
            </header>

            <div className={styles.mainGrid}>
                <div className={styles.col}>
                    <div className={styles.section}>
                        <label className={styles.label}>법인명</label>
                        <div className={styles.displayBox}>{formData.companyName}</div>
                    </div>
                    <div className={styles.section}>
                        <label className={styles.label}>사업자등록번호</label>
                        <div className={styles.displayBox}>{formData.businessNumber}</div>
                    </div>
                    <div className={styles.section}>
                        <label className={styles.label}>부도 발생일</label>
                        <input type="date" name="bankruptDate" className={styles.fullInput} value={formData.bankruptDate} onChange={handleChange} />
                    </div>
                </div>

                <div className={styles.col}>
                    <div className={styles.section}>
                        <label className={styles.label}>부도 사유</label>
                        <select name="reason" className={styles.fullInput} value={formData.reason} onChange={handleChange}>
                            <option value="지급불능">지급불능 (Cash Flow)</option>
                            <option value="채무초과">채무초과 (Insolvency)</option>
                            <option value="당좌거래정지">당좌거래정지</option>
                        </select>
                    </div>
                    <div className={styles.section}>
                        <label className={styles.label}>상세 경위</label>
                        <textarea name="description" className={styles.textarea} value={formData.description} onChange={handleChange} />
                    </div>
                </div>
            </div>

            <div className={styles.buttonRow}>
                <button className={styles.btnCancel} onClick={onCancel}>업무 취소</button>
                <button className={styles.btnSubmit} onClick={handleSubmit}>부도 확정 처리</button>
            </div>
        </div>
    );
};

export default CorporateBankrupt;