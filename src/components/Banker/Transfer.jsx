import React, { useState, useEffect } from 'react';
import styles from './Transfer.module.css';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
};

const Transfer = ({ onCancel, taskId, selectedTask }) => {
    const [accounts, setAccounts] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    
    const [formData, setFormData] = useState({
        fromAccountNumber: '',  
        accountPassword: '',    
        toAccountNumber: '',    
        amount: '',            
        description: '이체'      
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
                                fromAccountNumber: data[0].accountNumber || data[0].accountNum 
                            }));
                        }
                    }
                } catch (error) {
                    console.error("계좌 목록 로드 에러:", error);
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

    const handleAmountButtonClick = (value) => {
        const selectedAcc = accounts.find(acc => (acc.accountNumber || acc.accountNum) === formData.fromAccountNumber);
        const currentBalance = selectedAcc?.balance || 0;

        if (value === 'full') {
            setFormData(prev => ({ ...prev, amount: currentBalance }));
        } else {
            setFormData(prev => ({ ...prev, amount: (Number(prev.amount) || 0) + value }));
        }
    };

    const handleTransferSubmit = async () => {
        if (!formData.fromAccountNumber || !formData.toAccountNumber || !formData.amount || !formData.accountPassword) {
            alert("모든 필드를 정확히 입력해주세요.");
            return;
        }

  
        const queryParams = new URLSearchParams({
            fromAccountNumber: formData.fromAccountNumber,
            accountPassword: formData.accountPassword,
            toAccountNumber: formData.toAccountNumber,
            amount: parseInt(formData.amount, 10),
            description: formData.description,
            taskId: taskId || 0
        }).toString();

        try {
            const response = await fetch(`/api/transaction/transfer?${queryParams}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                alert("이체가 완료되었습니다!");
                onCancel();
            } else {
                const errorData = await response.json();
                alert(`이체 실패: ${errorData.message || '정보를 다시 확인해주세요.'}`);
            }
        } catch (error) {
            alert("서버 통신 오류가 발생했습니다.");
        }
    };

    return (
        <div className={styles.transferContainer}>
            <h3 className={styles.title}>계좌 이체 업무</h3>

            {/* 1. 출금 계좌 선택 */}
            <div className={styles.inputGroup}>
                <label>출금 계좌</label>
                {isLoading ? (
                    <input type="text" value="계좌 로딩 중..." readOnly className={styles.input} />
                ) : accounts.length > 0 ? (
                    <select
                        name="fromAccountNumber"
                        className={styles.input}
                        value={formData.fromAccountNumber}
                        onChange={handleChange}
                    >
                        {accounts.map((acc, index) => (
                            <option key={index} value={acc.accountNumber || acc.accountNum}>
                                {acc.accountNumber || acc.accountNum} ({formatCurrency(acc.balance || 0)}원)
                            </option>
                        ))}
                    </select>
                ) : (
                    <input name="fromAccountNumber" placeholder="출금 계좌 직접 입력" onChange={handleChange} className={styles.input} />
                )}
            </div>

            {/* 2. 비밀번호 */}
            <div className={styles.inputGroup}>
                <label>계좌 비밀번호</label>
                <input
                    name="accountPassword"
                    type="password"
                    className={styles.input}
                    placeholder="비밀번호 4자리"
                    maxLength="4"
                    value={formData.accountPassword}
                    onChange={handleChange}
                />
            </div>

            {/* 3. 입금 계좌 (상대방) */}
            <div className={styles.inputGroup}>
                <label>입금 계좌번호 (받는 분)</label>
                <input
                    name="toAccountNumber"
                    type="text"
                    className={styles.input}
                    placeholder="계좌번호 입력"
                    value={formData.toAccountNumber}
                    onChange={handleChange}
                />
            </div>

            {/* 4. 이체 금액 */}
            <div className={styles.inputGroup}>
                <label>이체 금액</label>
                <input
                    name="amount"
                    type="number"
                    className={styles.input}
                    placeholder="금액을 입력하세요"
                    value={formData.amount}
                    onChange={handleChange}
                />
                <div className={styles.amountButtons}>
                    <button type="button" onClick={() => handleAmountButtonClick(10000)}>+1만</button>
                    <button type="button" onClick={() => handleAmountButtonClick(50000)}>+5만</button>
                    <button type="button" onClick={() => handleAmountButtonClick(100000)}>+10만</button>
                    <button type="button" onClick={() => handleAmountButtonClick('full')}>전액</button>
                </div>
            </div>

            <div className={styles.buttonRow}>
                <button className={styles.btnCancel} onClick={onCancel}>취소</button>
                <button className={styles.btnSubmit} onClick={handleTransferSubmit}>이체 실행</button>
            </div>
        </div>
    );
};

export default Transfer;