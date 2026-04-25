import React, { useState } from 'react';
import styles from './ChangePassword.module.css';

const ChangePassword = ({ onCancel, onComplete }) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handlePwChange = (e, setter) => {
        const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
        setter(value);
    };

    const isMatch = newPassword === confirmPassword && newPassword.length === 4;
    const canSubmit = isMatch && oldPassword.length === 4;

    const handleSubmit = () => {
        if (!canSubmit) return;
        onComplete({ oldPassword, newPassword });
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>통장 비밀번호 변경</h2>

            <div className={styles.formContainer}>
                <div className={styles.section}>
                    <label className={styles.label}>기존 비밀번호</label>
                    <input
                        type="password"
                        className={styles.pwInput}
                        value={oldPassword}
                        onChange={(e) => handlePwChange(e, setOldPassword)}
                        /* 💡 placeholder를 삭제해서 입력 전 도트 노출 방지 */
                        placeholder="" 
                        inputMode="numeric"
                        autoComplete="off"
                    />
                </div>

                <div className={styles.section}>
                    <label className={styles.label}>새 비밀번호</label>
                    <input
                        type="password"
                        className={styles.pwInput}
                        value={newPassword}
                        onChange={(e) => handlePwChange(e, setNewPassword)}
                        placeholder=""
                        inputMode="numeric"
                        autoComplete="off"
                    />
                </div>

                <div className={styles.section}>
                    <label className={styles.label}>새 비밀번호 확인</label>
                    <input
                        type="password"
                        className={styles.pwInput}
                        value={confirmPassword}
                        onChange={(e) => handlePwChange(e, setConfirmPassword)}
                        placeholder=""
                        inputMode="numeric"
                        autoComplete="off"
                    />
                </div>

                <div className={styles.messageBox}>
                    {confirmPassword.length > 0 && (
                        <p className={`${styles.message} ${isMatch ? styles.success : styles.error}`}>
                            {isMatch ? "✅ 비밀번호가 일치합니다." : "❌ 비밀번호가 일치하지 않습니다."}
                        </p>
                    )}
                </div>

                <div className={styles.buttonRow}>
                    <button className={styles.btnCancel} onClick={onCancel}>취소</button>
                    <button 
                        className={styles.btnSubmit} 
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                    >
                        변경하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;