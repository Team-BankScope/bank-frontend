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
    const [payAmount, setPayAmount] = useState(arrearsInfo.totalArrears);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>기업 연체 관리 및 납부</h2>
                <div className={styles.headerBadge}>D+38 관리대상</div>
            </div>

            <div className={styles.mainWrapper}>
                <div className={styles.leftCol}>
                    <div className={styles.miniCard}>
                        <p className={styles.cardLabel}>고객 정보</p>
                        <div className={styles.customerInfo}>
                            <span className={styles.name}>{arrearsInfo.businessName}</span>
                            <span className={styles.subText}>{arrearsInfo.businessNumber}</span>
                        </div>
                    </div>

                    <div className={styles.miniCard}>
                        <p className={styles.cardLabel}>연체 현황</p>
                        <div className={styles.dataGrid}>
                            <div className={styles.dataItem}>
                                <span className={styles.itemLabel}>총 연체액</span>
                                <strong className={styles.danger}>
                                    {arrearsInfo.totalArrears.toLocaleString()}원
                                </strong>
                            </div>

                        
                            <div className={styles.vLine} />

                            <div className={styles.dataItem}>
                                <span className={styles.itemLabel}>연체 회차</span>
                                <strong className={styles.countText}>{arrearsInfo.arrearsCount}회차</strong>
                            </div>
                        </div>
                    </div>
                </div>

          
                <div className={styles.rightCol}>
                    <div className={styles.inputCard}>
                        <div className={styles.formRow}>
                            <label>출금 계좌</label>
                            <select 
                                className={styles.select}
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

                        <div className={styles.formRow}>
                            <label>납부 금액</label>
                            <div className={styles.inputGroup}>
                                <input 
                                    type="number" 
                                    className={styles.amountInput}
                                    value={payAmount}
                                    onChange={(e) => setPayAmount(e.target.value)}
                                />
                                <button className={styles.allBtn} onClick={() => setPayAmount(arrearsInfo.totalArrears)}>전액</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

      
            <div className={styles.footer}>
                <button className={styles.btnCancel} onClick={onCancel}>취소</button>
                <button className={styles.btnSubmit} onClick={() => alert('납부 승인 완료')}>납부 승인</button>
            </div>
        </div>
    );
};

export default CorporateArrears;