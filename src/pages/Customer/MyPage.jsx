import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import styles from './MyPage.module.css';
import profileImg from "../../images/Mypage/Profile.png"
import lockImg from "../../images/Mypage/Lock.png"
import otpImg from "../../images/Mypage/Mobile.png"
import arrowImg from "../../images/Mypage/ArrowRight.png"

const MyPage = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('accounts');

    useEffect(() => {
        if (!loading && !user) {
            alert("로그인 후 이용 가능합니다.");
            navigate("/Login");
        }
    }, [user, loading, navigate]);

    if (loading) return <div>Loading...</div>;
    if (!user) return null;

    console.log("User Info:", user); // 디버깅용 로그: 콘솔에서 user 객체 확인 가능

    // const maskResidentNumber = (residentNumber) => {
    //     if (!residentNumber) return '';
    //     if (residentNumber.length < 7) return residentNumber;
    //     return residentNumber.substring(0, 6) + '-*******';
    // };

    // 1. 계정 관리
    const renderAccountManagement = () => (
        <div className={styles.managementWrapper}>
            <h2 className={styles.managementTitle}>개인 정보 변경</h2>
            <div className={styles.formWrapper}>
                {/* 닉네임 -> 이름으로 변경, defaultValue에 DB 데이터(user.name) 연결 */}
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>이름</label>
                    <input 
                        type="text" 
                        defaultValue={user.name} 
                        placeholder="이름을 입력해주세요" 
                        className={styles.input} 
                    />
                </div>
                
                {/* defaultValue에 DB 데이터(user.email) 연결 */}
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>이메일</label>
                    <div className={styles.inputRow}>
                        <input 
                            type="text" 
                            defaultValue={user.email} 
                            placeholder="이메일을 입력해주세요" 
                            className={`${styles.input} ${styles.flex1}`} 
                        />
                        <button className={styles.formBtn}>인증 번호</button>
                    </div>
                    <div className={styles.inputRow}>
                        <input type="text" placeholder="인증번호를 입력해주세요" className={`${styles.input} ${styles.flex1}`} />
                        <button className={styles.formBtn}>확인</button>
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>비밀번호</label>
                    <input type="password" placeholder="비밀번호를 입력해주세요" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>비밀번호 재확인</label>
                    <input type="password" placeholder="비밀번호를 동일하게 입력해주세요" className={styles.input} />
                </div>
            </div>
        </div>
    );

    // 2. 계정 보안
    const renderSecurity = () => (
        <div className={styles.securityWrapper}>
            <div className={styles.securityCard}>
                <img src={lockImg} alt="Lock" className={styles.securityIconImg} />
                <span className={styles.securityTitle}>핀 번호관리</span>
            </div>
            <div className={styles.securityCard}>
                <img src={otpImg} alt="OTP" className={styles.securityIconImg} />
                <span className={styles.securityTitle}>디지털 OTP 관리</span>
            </div>
        </div>
    );

    // 3. 계좌 관리 - 임시 데이터
    const renderAccounts = () => {
        const mockAccounts = [
            { id: 1, name: 'ㅇㅇ예금(입출금)', isMain: true, number: '000-00000000-0', balance: '1,000,000 원' },
            { id: 2, name: 'ㅇㅇ적금', isMain: false, number: '000-00000000-0', balance: '1,000,000 원' },
            { id: 3, name: '주택청약', isMain: false, number: '000-00000000-0', balance: '1,000,000 원' },
            { id: 4, name: '청년도약계좌', isMain: false, number: '000-00000000-0', balance: '5,000,000 원' },
            { id: 5, name: '모임통장', isMain: false, number: '000-00000000-0', balance: '250,000 원' },
        ];

        return (
            <div className={styles.accountsWrapper}>
                <h2 className={styles.sectionTitle}>계좌 조회</h2>
                <div className={styles.accountList}>
                    {mockAccounts.map((account) => (
                        <div key={account.id} className={styles.accountCard}>
                            <div className={styles.accountInfo}>
                                <div className={styles.accountNameRow}>
                                    <span className={styles.accountName}>{account.name}</span>
                                    {account.isMain && <span className={styles.mainBadge}>주계좌</span>}
                                </div>
                                <span className={styles.accountNumber}>{account.number}</span>
                            </div>
                            <div className={styles.accountActions}>
                                <span className={styles.balance}>{account.balance}</span>
                                <button className={styles.transferBtn}>이체</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.layoutWrapper}>
                
                {/* 왼쪽 사이드바 */}
                <div className={styles.sidebar}>
                    {/* 프로필 영역 */}
                    <div className={styles.profileArea}>
                        <img src={profileImg} alt="Profile" className={styles.profileImage} />
                        <div className={styles.textCenter}>
                            <p className={styles.profileName}>
                                환영합니다. <strong>{user.name}</strong>님
                            </p>
                            <p className={styles.profileEmail}>{user.email}</p>
                        </div>
                    </div>

                    {/* 메뉴 영역 */}
                    <div className={styles.menuArea}>
                        <div 
                            className={`${styles.menuItem} ${activeTab === 'account' ? styles.active : ''}`}
                            onClick={() => setActiveTab('account')}
                        >
                            <span>계정 관리</span>
                            <img src={arrowImg} alt="Select" className={styles.chevronImg} />
                        </div>
                        <div 
                            className={`${styles.menuItem} ${activeTab === 'security' ? styles.active : ''}`}
                            onClick={() => setActiveTab('security')}
                        >
                            <span>계정 보안</span>
                            <img src={arrowImg} alt="Select" className={styles.chevronImg} />
                        </div>
                        <div 
                            className={`${styles.menuItem} ${activeTab === 'accounts' ? styles.active : ''}`}
                            onClick={() => setActiveTab('accounts')}
                        >
                            <span>계좌 관리</span>
                            <img src={arrowImg} alt="Select" className={styles.chevronImg} />
                        </div>
                    </div>
                </div>

                {/* 오른쪽 콘텐츠 영역 */}
                <div className={styles.contentArea}>
                    {activeTab === 'account' && renderAccountManagement()}
                    {activeTab === 'security' && renderSecurity()}
                    {activeTab === 'accounts' && renderAccounts()}
                </div>

            </div>
        </div>
    );
};

export default MyPage;
