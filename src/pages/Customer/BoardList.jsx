import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Board.module.css';

const BoardList = () => {
    const { boardType } = useParams(); 
    const navigate = useNavigate();

    const title = boardType === 'notice' ? '새소식' : '이벤트';

    // API 대신 화면에 보여줄 가짜(Mock) 데이터
    const mockArticles = [
        { id: 1, title: '[공지] 일부 참가기관 디지털금융영업부 일시중단 안내', date: '2026.02.27' },
        { id: 2, title: '[공지] 신용카드 기업회원 약관 개정안내', date: '2026.02.25' },
        { id: 3, title: '[공지] 휴면예금 출연 안내', date: '2026.02.19' },
        { id: 4, title: '[안내] 시스템 정기 점검 안내', date: '2026.02.10' },
        { id: 5, title: '[안내] 보이스피싱 주의 안내', date: '2026.01.28' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.layoutWrapper}>
                <h2 className={styles.pageTitle}>{title}</h2>

                <table className={styles.boardTable}>
                    <thead>
                        <tr>
                            <th className={styles.colId}>번호</th>
                            <th className={styles.colTitle}>제목</th>
                            <th className={styles.colDate}>등록일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockArticles.map((article, index) => (
                            <tr key={article.id} onClick={() => navigate(`/board/detail/${article.id}`)} className={styles.tableRow}>
                                <td className={styles.colId}>{mockArticles.length - index}</td>
                                <td className={styles.colTitleText}>{article.title}</td>
                                <td className={styles.colDate}>{article.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* 백엔드 개발자님이 연결할 페이징 HTML/CSS 껍데기 */}
                <div className={styles.pagination}>
                    <button className={styles.pageBtn}>&lt;</button>
                    <button className={`${styles.pageBtn} ${styles.activePage}`}>1</button>
                    <button className={styles.pageBtn}>2</button>
                    <button className={styles.pageBtn}>3</button>
                    <button className={styles.pageBtn}>&gt;</button>
                </div>
            </div>
        </div>
    );
};

export default BoardList;