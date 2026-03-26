import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Board.module.css';

const BoardList = () => {
    // URL에서 boardType(notice 또는 event)을 가져옵니다.
    const { boardType } = useParams(); 
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // 현재 페이지 번호 (URL 쿼리스트링에서 가져오거나 기본값 1)
    const currentPage = parseInt(searchParams.get('page')) || 1;

    const [articles, setArticles] = useState([]);
    const [pageVo, setPageVo] = useState(null);
    const [loading, setLoading] = useState(true);

    const title = boardType === 'notice' ? '새소식' : '이벤트';

    useEffect(() => {
        const fetchBoardList = async () => {
            setLoading(true);
            try {
                // 백엔드 명세에 맞춘 API 호출
                const response = await fetch(`/api/board/list?boardType=${boardType}&page=${currentPage}`);
                const data = await response.json();

                if (data.result === 'SUCCESS') {
                    setArticles(data.articles);
                    setPageVo(data.pageVo);
                } else {
                    alert("게시글을 불러오는데 실패했습니다.");
                }
            } catch (error) {
                console.error("API Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBoardList();
    }, [boardType, currentPage]);

    // 게시물 클릭 시 상세 페이지로 이동
    const goToDetail = (boardId) => {
        navigate(`/board/detail/${boardId}`);
    };

    // 페이지 이동 함수
    const handlePageChange = (pageNum) => {
        setSearchParams({ page: pageNum });
    };

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
                        {loading ? (
                            <tr><td colSpan="3" className={styles.emptyRow}>로딩 중...</td></tr>
                        ) : articles.length === 0 ? (
                            <tr><td colSpan="3" className={styles.emptyRow}>등록된 게시물이 없습니다.</td></tr>
                        ) : (
                            articles.map((article) => (
                                <tr key={article.id} onClick={() => goToDetail(article.id)} className={styles.tableRow}>
                                    <td className={styles.colId}>{article.id}</td>
                                    <td className={styles.colTitleText}>{article.title}</td>
                                    {/* DB 날짜 포맷에 따라 수정 필요할 수 있음 */}
                                    <td className={styles.colDate}>{article.createdAt?.substring(0, 10)}</td> 
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* 임시 페이징 UI (백엔드 pageVo 데이터에 맞춰 수정 가능) */}
                {pageVo && (
                    <div className={styles.pagination}>
                        <button className={styles.pageBtn}>&lt;</button>
                        <button className={`${styles.pageBtn} ${styles.activePage}`}>1</button>
                        <button className={styles.pageBtn}>2</button>
                        <button className={styles.pageBtn}>3</button>
                        <button className={styles.pageBtn}>&gt;</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BoardList;