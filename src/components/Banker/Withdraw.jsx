import React, { useState, useEffect } from 'react';
import styles from './Withdraw.module.css';

const Withdraw = ({ onCancel, taskId, selectedTask }) => {
    const [accounts, setAccounts] = useState([]); 
    const [isLoading, setIsLoading] = useState(true); 
    const [formData, setFormData] = useState({
        myAccount: '', 
        password: '',
        confirmPassword: '',
        amount: ''
    });

 
    useEffect(() => {
        const fetchUserAccounts = async () => {
            const userId = selectedTask?.userId;
            
            if (userId) {
                try {
                    const response = await fetch(`/api/account/user/${userId}`);
                    if (response.ok) {
                        const rawData = await response.json();
                  
                        const data = Array.isArray(rawData) ? rawData : rawData.accounts || [];
                        setAccounts(data);
                        
                        if (data.length > 0) {
                            setFormData(prev => ({ 
                                ...prev, 
                                myAccount: data[0].accountNumber || data[0].accountNum 
                            }));
                        }
                    }
                } catch (error) {
                    console.error("출금 계좌 목록 로드 에러:", error);
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

    const handleWithdrawSubmit = async () => {
        if (!formData.myAccount) {
            alert("출금할 계좌를 선택하거나 입력해주세요.");
            return;
        }
        if (!formData.password) {
            alert("비밀번호를 입력해주세요.");
            return;
        }

        const numericAmount = parseInt(String(formData.amount).replace(/,/g, ''), 10);

        const queryParams = new URLSearchParams({
            accountNumber: formData.myAccount,
            accountPassword: formData.password,
            amount: numericAmount,
            description: '출금',
            taskId: taskId || 0
        }).toString();

        try {
            const response = await fetch(`/api/transaction/withdraw?${queryParams}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                alert("출금이 완료되었습니다!");
                onCancel();
            } else {
                const errorData = await response.json();
                alert(`출금 실패: ${errorData.message || '정보를 다시 확인해주세요.'}`);
            }
        } catch (error) {
            alert("서버 통신 오류가 발생했습니다.");
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.headerTitle}>출금 업무</h1>
            </header>

            <div className={styles.formContainer}>
                {/* 1. 출금 계좌 선택 섹션 */}
                <div className={styles.section}>
                    <div className={styles.labelRow}>
                        <span className={styles.centerLabel}>출금 계좌 선택</span>
                    </div>
                    <div className={styles.inputRow}>
                        <div className={styles.customSelectFull}>
                            {isLoading ? (
                                <input type="text" placeholder="계좌 정보를 불러오는 중..." readOnly className={styles.inputField} />
                            ) : accounts.length > 0 ? (
                                <select 
                                    name="myAccount" 
                                    value={formData.myAccount} 
                                    onChange={handleChange}
                                    className={styles.selectField}
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
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
                                    placeholder="직접 계좌번호를 입력하세요" 
                                    value={formData.myAccount} 
                                    onChange={handleChange} 
                                    className={styles.inputField} 
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
                            <input 
                                name="password" 
                                type="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                placeholder="●●●●"
                                className={styles.inputField}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.centerLabel}>비밀번호 확인</label>
                            <input 
                                name="confirmPassword" 
                                type="password" 
                                value={formData.confirmPassword} 
                                onChange={handleChange} 
                                placeholder="●●●●"
                                className={styles.inputField}
                            />
                        </div>
                    </div>
                </div>

                {/* 3. 금액 섹션 */}
                <div className={styles.section}>
                    <div className={styles.labelRow}><span className={styles.centerLabel}>출금 금액</span></div>
                    <div className={styles.amountFieldBox}>
                        <input 
                            name="amount" 
                            type="text" 
                            value={formData.amount} 
                            onChange={handleChange} 
                            placeholder="0" 
                        />
                        <span className={styles.unit}>원</span>
                    </div>
                </div>

                <div className={styles.buttonRow}>
                    <button className={styles.btnCancel} onClick={onCancel}>취소</button>
                    <button className={styles.btnSubmit} onClick={handleWithdrawSubmit}>출금 실행</button>
                </div>
            </div>
        </div>
    );
};

export default Withdraw;