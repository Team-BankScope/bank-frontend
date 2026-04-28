import React, { useState } from 'react';
import { useModal } from '../../context/ModalContext'; 
import styles from './ChangePassword.module.css';

const ChangePassword = ({ onCancel, onComplete }) => {
    const { openModal } = useModal();

    const accountList = [
        { id: 1, name: '생활비통장', number: '210-111-222333' },
        { id: 2, name: 'VIP정기예금', number: '210-444-555666' },
        { id: 3, name: '기업운영자금', number: '100-555-888999' },
    ];

    const [selectedAccount, setSelectedAccount] = useState(accountList[0].number);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handlePwChange = (e, setter) => {
        const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
        setter(value);
    };

    // 💡 1. 새 비밀번호끼리 일치하는지 (4자리)
    const isMatch = newPassword === confirmPassword && newPassword.length === 4;
    
    // 💡 2. [추가] 기존 비밀번호와 새 비밀번호가 다른지 체크
    const isDifferent = oldPassword !== newPassword;

    // 💡 3. 최종 제출 조건: (새 비번 일치) AND (기존과 다름) AND (기존비번 4자리)
    const canSubmit = isMatch && isDifferent && oldPassword.length === 4;

    const handleSubmit = () => {
        if (!canSubmit) return;
        
        openModal({
            title: "비밀번호 변경 확인",
            message: "선택하신 계좌의 비밀번호를 변경하시겠습니까?",
            confirmText: "변경",
            cancelText: "취소",
            onConfirm: () => {
                onComplete?.({
                    accountNumber: selectedAccount,
                    oldPassword,
                    newPassword
                });
                
                openModal({
                    title: "변경 완료",
                    message: "비밀번호가 정상적으로 변경되었습니다.",
                    confirmText: "확인"
                });
            }
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>통장 비밀번호 변경</h2>
                <div className={styles.headerBadge}>보안 설정</div>
            </div>

            <div className={styles.mainWrapper}>
                <div className={styles.leftCol}>
                    <div className={styles.miniCard}>
                        <p className={styles.cardLabel}>대상 계좌</p>
                        <select 
                            className={styles.accountSelect} 
                            value={selectedAccount} 
                            onChange={(e) => setSelectedAccount(e.target.value)}
                        >
                            {accountList.map(account => (
                                <option key={account.id} value={account.number}>
                                    {account.name}
                                </option>
                            ))}
                        </select>
                        <p className={styles.accountNumDisplay}>{selectedAccount}</p>
                    </div>
                    
                    <div className={styles.statusBox}>
                        {confirmPassword.length > 0 && (
                            <p className={`${styles.message} ${isMatch ? (isDifferent ? styles.success : styles.error) : styles.error}`}>
                                {!isMatch ? "❌ 새 비밀번호 불일치" : !isDifferent ? "❌ 기존 비번과 동일함" : "✅ 변경 가능"}
                            </p>
                        )}
                    </div>
                </div>

                <div className={styles.rightCol}>
                    <div className={styles.inputCard}>
                        <div className={styles.formRow}>
                            <label>기존 비밀번호</label>
                            <input
                                type="password"
                                className={styles.pwInput}
                                value={oldPassword}
                                onChange={(e) => handlePwChange(e, setOldPassword)}
                                placeholder="••••"
                                inputMode="numeric"
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>새 비밀번호</label>
                            <input
                                type="password"
                                className={styles.pwInput}
                                value={newPassword}
                                onChange={(e) => handlePwChange(e, setNewPassword)}
                                placeholder="••••"
                                inputMode="numeric"
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>비밀번호 확인</label>
                            <input
                                type="password"
                                className={styles.pwInput}
                                value={confirmPassword}
                                onChange={(e) => handlePwChange(e, setConfirmPassword)}
                                placeholder="••••"
                                inputMode="numeric"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.footer}>
                <button type="button" className={styles.btnCancel} onClick={onCancel}>취소</button>
                <button 
                    type="button" 
                    className={styles.btnSubmit} 
                    onClick={handleSubmit}
                    // 💡 canSubmit이 false면 버튼은 회색 & 클릭 안 됨
                    disabled={!canSubmit} 
                >
                    변경 확정
                </button>
            </div>
        </div>
    );
};

export default ChangePassword;