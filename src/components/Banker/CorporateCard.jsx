import React, { useState } from 'react';
import styles from './CorporateCard.module.css';
import { useModal } from '../../context/ModalContext'; // useModal 훅 추가

const CorporateCard = ({ onCancel, onComplete, selectedTask }) => {
    const [activeTab, setActiveTab] = useState('register');
    const { openModal } = useModal(); // 모달 훅 사용
    const [formData, setFormData] = useState({
        companyName: selectedTask?.userName ,
        businessNumber: '123-45-67890',
        representative: '김대표',
        cardBrand: '',
        cardType: '법인 공용', 
        limit: '5,000,000',
        paymentDate: '매월 15일',
        account: '123-456-789',
        password: ''
    });

    const cardList = [
        { id: 1, type: '법인 공용', status: '활성', number: '5521', payDate: '15일', regDate: '26년 01월 12일', isSelected: false, isPending: false },
        { id: 2, type: '법인 개인', status: '발급중', number: '9902', payDate: '15일', regDate: '26년 04월 20일', isSelected: false, isPending: true },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        openModal({
            title: "알림",
            message: "법인카드 발급 승인이 완료되었습니다.",
            confirmText: "확인",
            onConfirm: () => {
                setActiveTab('list');
                if (onComplete) onComplete(formData);
            }
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerTabs}>
                <div
                    className={`${styles.tab} ${activeTab === 'register' ? styles.active : ''}`}
                    onClick={() => setActiveTab('register')}
                >
                    법인카드 승인/발급
                </div>
                <div
                    className={`${styles.tab} ${activeTab === 'list' ? styles.active : ''}`}
                    onClick={() => setActiveTab('list')}
                >
                    발급 이력
                </div>
            </div>

            {activeTab === 'register' && (
                <div className={styles.registerContent}>
                    <div className={styles.formGrid}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>법인명</label>
                            <div className={styles.displayBox}>{formData.companyName}</div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>대표자명</label>
                            <div className={styles.displayBox}>{formData.representative}</div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>사업자등록번호</label>
                            <input type="text" className={styles.fullInput} name="businessNumber" value={formData.businessNumber} onChange={handleChange} />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>월 이용한도</label>
                            <div className={styles.amountInput}>
                                <input type="text" className={styles.fullInput} name="limit" value={formData.limit} onChange={handleChange} />
                                <span className={styles.unit}>원</span>
                            </div>
                        </div>

                        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                            <label className={styles.label}>카드 브랜드</label>
                            <select className={styles.fullInput} name="cardBrand" value={formData.cardBrand} onChange={handleChange}>
                                <option value="">브랜드를 선택하세요</option>
                                <option value="VISA">VISA BUSINESS</option>
                                <option value="MASTER">MASTER CARD CORPORATE</option>
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>카드 종류</label>
                            <div className={styles.radioRow}>
                                <label><input type="radio" name="cardType" value="법인 공용" checked={formData.cardType === '법인 공용'} onChange={handleChange}/> 법인 공용</label>
                                <label><input type="radio" name="cardType" value="법인 개인" checked={formData.cardType === '법인 개인'} onChange={handleChange}/> 법인 개인</label>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>결제일</label>
                            <select className={styles.fullInput} name="paymentDate" value={formData.paymentDate} onChange={handleChange}>
                                <option value="매월 1일">매월 1일</option>
                                <option value="매월 15일">매월 15일</option>
                                <option value="매월 25일">매월 25일</option>
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>출금 계좌</label>
                            <div className={styles.displayBox}>{formData.account}</div>
                        </div>
                    </div>

        
                    <div className={styles.buttonRow}>
                        <button className={styles.btnCancel} onClick={onCancel}>업무 취소</button>
                        <button className={styles.btnSubmit} onClick={handleSubmit}>카드 발급 승인</button>
                    </div>
                </div>
            )}

            {activeTab === 'list' && (
                <div className={styles.listContent}>
                    <div className={styles.cardList}>
                        {cardList.map((card) => (
                            <div key={card.id} className={styles.cardItem}>
                                <div className={styles.cardVisual}>
                                    <div className={styles.cardChip}></div>
                                    <div className={styles.cardLogo}>CORP</div>
                                </div>
                                <div className={styles.cardInfo}>
                                    <div className={styles.tagRow}>
                                        <span className={styles.tagType}>{card.type}</span>
                                        <span className={`${styles.tagStatus} ${card.isPending ? styles.pending : styles.activeStatus}`}>
                                            {card.status}
                                        </span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <span>**** **** **** {card.number}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CorporateCard;