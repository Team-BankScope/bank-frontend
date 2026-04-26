import React, { useState, useEffect } from 'react';
import styles from './Deposit.module.css';

const Deposit = ({ onCancel, taskId, selectedTask }) => {
    const [accounts, setAccounts] = useState([]); 
    const [isLoading, setIsLoading] = useState(true); 
    const [formData, setFormData] = useState({
        myAccount: '', 
        password: '',
        confirmPassword: '',
        amount: '',
        description: '입금'
    });

   
    useEffect(() => {
        const fetchUserAccounts = async () => {
            const userId = selectedTask?.userId; 
            
            if (userId) {
                console.log(`userId ${userId}의 계좌 목록 조회 시작...`);
                try {
                   
                    const response = await fetch(`/api/account/user/${userId}`);
                    if (response.ok) {
                        const rawData = await response.json();
                        const data = Array.isArray(rawData) ? rawData : rawData.accounts || [];
                        console.log("조회된 계좌 데이터:", data);
                        setAccounts(data);
                        
                       
                        if (data.length > 0) {
                            setFormData(prev => ({ 
                                ...prev, 
                              
                                myAccount: data[0].accountNumber || data[0].accountNum 
                            }));
                        }
                    } else {
                        console.error("계좌 조회 API 호출 실패:", response.status);
                    }
                } catch (error) {
                    console.error("계좌 목록 로드 중 에러:", error);
                } finally {
                    setIsLoading(false); 
                }
            } else {
                setIsLoading(false); 
            }
        };

        fetchUserAccounts();
    }, [selectedTask]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDepositSubmit = async () => {
        const numericAmount = parseInt(String(formData.amount).replace(/,/g, ''), 10);

        if (!formData.myAccount) {
            alert("입금할 계좌를 선택해주세요.");
            return;
        }

        const queryParams = new URLSearchParams({
            accountNumber: formData.myAccount,
            amount: numericAmount,
            description: formData.description,
            taskId: taskId || 0
        }).toString();

        try {
            const response = await fetch(`/api/transaction/deposit?${queryParams}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                alert("입금이 완료되었습니다!");
                onCancel();
            } else {
                alert("입금 실패: 정보를 다시 확인해주세요.");
            }
        } catch (error) {
            alert("서버 통신 오류가 발생했습니다.");
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.headerTitle}>입금 업무</h1>
            </header>

            <div className={styles.formContainer}>
                {/* 1. 계좌 선택 섹션 (조회된 계좌 리스트 출력) */}
                <div className={styles.section}>
                    <div className={styles.labelRow}>
                        <span className={styles.centerLabel}>입금 계좌 선택</span>
                    </div>
                    <div className={styles.inputRow}>
                        <div className={styles.customSelectFull}>
                         
                            {isLoading ? (
                                <input type="text" placeholder="계좌 정보를 불러오는 중입니다..." readOnly className={styles.inputField} />
                            ) : accounts.length > 0 ? (
                            
                                <select 
                                    name="myAccount" 
                                    value={formData.myAccount} 
                                    onChange={handleChange}
                                    className={styles.selectField}
                                >
                                    {accounts.map((acc, index) => (
                                        <option key={index} value={acc.accountNumber || acc.accountNum}>
                                            {acc.accountNumber || acc.accountNum} ({acc.accountName || '일반예금'})
                                        </option>
                                    ))}
                                </select>
                            ) : (
                            
                                <input 
                                    name="myAccount" 
                                    type="text" 
                                    placeholder="⚠️ 등록된 계좌가 없습니다. 직접 입력하세요." 
                                    value={formData.myAccount} 
                                    onChange={handleChange} 
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. 비밀번호 섹션 */}
                <div className={styles.section}>
                    <div className={styles.gridTwo}>
                        <div className={styles.inputGroup}>
                            <label className={styles.centerLabel}>비밀번호</label>
                            <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="●●●●" />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.centerLabel}>비밀번호 확인</label>
                            <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="●●●●" />
                        </div>
                    </div>
                </div>

                {/* 3. 금액 섹션 */}
                <div className={styles.section}>
                    <div className={styles.labelRow}><span className={styles.centerLabel}>입금 금액</span></div>
                    <div className={styles.amountFieldBox}>
                        <input name="amount" type="text" value={formData.amount} onChange={handleChange} placeholder="0" />
                        <span className={styles.unit}>원</span>
                    </div>
                </div>

                <div className={styles.buttonRow}>
                    <button className={styles.btnCancel} onClick={onCancel}>취소</button>
                    <button className={styles.btnSubmit} onClick={handleDepositSubmit}>입금 실행</button>
                </div>
            </div>
        </div>
    );
};

export default Deposit;