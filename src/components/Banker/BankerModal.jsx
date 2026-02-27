import React from 'react';
import styles from './BankerModal.module.css';

const BankerModal = ({ name = "고객", onClose }) => {
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                {/* 상단 헤더 영역 */}
                <div className={styles.header}>
                    <h2 className={styles.headerTitle}>알림</h2>
                </div>

                {/* 본문 컨텐츠 영역 */}
                <div className={styles.content}>
                    <div className={styles.iconWrapper}>
                        <span className={styles.bellIcon} role="img" aria-label="bell">🔔</span>
                    </div>
                    <div className={styles.message}>
                        <p className={styles.dingDong}>딩동~!</p>
                        <p className={styles.mainText}>
                            <span className={styles.name}>{name}</span>님을 호출하였습니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BankerModal;

/*

부모컴포넌트에서 아래와 같이 사용
<BankerModal name="김갑수" onClose={() => setShowModal(false)} />

*/
