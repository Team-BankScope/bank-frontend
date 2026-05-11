import React, { useState } from 'react';
import styles from './CorporateArrears.module.css';

const CorporateArrears = ({ onCancel, onComplete }) => {
    const arrearsInfo = {
        businessName: "권정균",
        businessNumber: "123-45-67890",
        totalArrears: 15250000,
        arrearsCount: 2
    };

    const accountList = [
        { id: 1, name: '법인 주거래', number: '100-555-888999' },
        { id: 2, name: '기업 예비비', number: '100-222-333444' },
    ];

    const [selectedAccount, setSelectedAccount] = useState(accountList[0].number);
    const [payAmount, setPayAmount] = useState(0);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                <h1 className={styles.headerTitle}>기업 연체 관리 및 납부</h1>
                <div className={styles.headerBadge}>D+38 관리대상</div>
            </header>

            <div className={styles.formContainer}>
                {/* 1. 고객 정보 및 연체 현황 요약 */}
                <div className={styles.section}>
                    <div className={styles.labelRow}>
                        <span className={styles.centerLabel}>고객 및 연체 정보</span>
                    </div>
                    <div className={styles.inputRow}>
                        <div className={styles.customSelectFull}>
                            <input 
                                type="text" 
                                className={styles.inputField} 
                                value={`법인명: ${arrearsInfo.businessName} (${arrearsInfo.businessNumber})`} 
                                readOnly 
                            />
                        </div>
                    </div>
                    <div className={styles.inputRow}>
                        <div className={styles.mintInfoBox}>
                            <div className={styles.infoBoxInner}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>총 연체액</span>
                                    <span className={styles.infoValueDanger}>{arrearsInfo.totalArrears.toLocaleString()}원</span>
                                </div>
                                <div className={styles.vLine}></div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>연체 회차</span>
                                    <span className={styles.infoValue}>{arrearsInfo.arrearsCount}회차</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. 출금 계좌 선택 */}
                <div className={styles.section}>
                    <div className={styles.labelRow}>
                        <span className={styles.centerLabel}>출금 계좌 선택</span>
                    </div>
                    <div className={styles.inputRow}>
                        <div className={styles.customSelectFull}>
                            <select 
                                className={styles.selectField}
                                value={selectedAccount}
                                onChange={(e) => setSelectedAccount(e.target.value)}
                            >
                                {accountList.map(acc => (
                                    <option key={acc.number} value={acc.number}>
                                        {acc.name} ({acc.number.slice(-4)})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 3. 납부 금액 */}
                <div className={styles.section}>
                    <div className={styles.labelRow}>
                        <span className={styles.centerLabel}>납부 금액</span>
                    </div>
                    <div className={styles.amountFieldBox}>
                        <input 
                            type="number" 
                            className={styles.inputField}
                            style={{ textAlign: 'right' }}
                            value={payAmount}
                            onChange={(e) => setPayAmount(e.target.value)}
                        />
                        <span className={styles.unit}>원</span>
                        <button className={styles.allBtn} onClick={() => setPayAmount(arrearsInfo.totalArrears)}>전액</button>
                    </div>
                </div>

                <div className={styles.buttonRow}>
                    <button className={styles.btnCancel} onClick={onCancel}>취소</button>
                    <button className={styles.btnSubmit} onClick={() => alert('납부 승인 완료')}>납부 승인</button>
                </div>
            </div>
        </div>
    );
};

export default CorporateArrears;