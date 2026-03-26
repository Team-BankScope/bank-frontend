import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Board.module.css';

const BoardDetail = () => {
    const navigate = useNavigate();
    
    // API 대신 화면에 보여줄 가짜(Mock) 상세 데이터
    const mockArticle = {
        title: "[공지] 일부 참가기관 디지털금융영업부 일시중단 안내",
        date: "2026.02.27",
        content: `항상, 저희 BANKSCOPE를 이용해주시는 고객님께 깊은 감사의 말씀을 드립니다.\n\n시스템 안정화 및 서비스 품질 향상을 위한 정기 점검으로 인하여\n일부 참가기관의 디지털금융영업부 업무가 일시 중단될 예정입니다.\n\n고객 여러분의 너른 양해를 부탁드립니다.\n감사합니다.`
    };

    return (
        <div className={styles.container}>
            <div className={styles.layoutWrapper}>
                <div className={styles.detailHeader}>
                    <div className={styles.detailRow}>
                        <div className={styles.detailLabel}>제목</div>
                        <div className={styles.detailValue}>{mockArticle.title}</div>
                    </div>
                    <div className={styles.detailRow}>
                        <div className={styles.detailLabel}>등록일</div>
                        <div className={styles.detailValue}>{mockArticle.date}</div>
                    </div>
                </div>

                <div className={styles.detailContent}>
                    {mockArticle.content.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>{line}<br/></React.Fragment>
                    ))}
                </div>

                <div className={styles.btnArea}>
                    <button className={styles.listBtn} onClick={() => navigate(-1)}>목록</button>
                </div>
            </div>
        </div>
    );
};

export default BoardDetail;