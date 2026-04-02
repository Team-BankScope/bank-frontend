import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/common/Loading.jsx';
import styles from './AiRecommend.module.css';

const AiRecommend = () => {
    const navigate = useNavigate();
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiResult, setAiResult] = useState(null);

    // 파이썬 딥러닝 서버 통신 시뮬레이션
    const handleAiRecommend = () => {
        setIsAiLoading(true);
        
        setTimeout(() => {
            setAiResult([
                {
                    id: 1,
                    type: '적금',
                    name: '뱅크스코프 청년 도약 계좌',
                    desc: '소비 패턴 분석 결과, 안정적인 목돈 마련에 가장 적합한 상품입니다.',
                    rate: '최고 연 6.0%'
                },
                {
                    id: 2,
                    type: '예금',
                    name: '뱅크스코프 파킹통장',
                    desc: '언제든 넣고 뺄 수 있어 여유 자금을 보관하기 좋은 고금리 예금입니다.',
                    rate: '최고 연 3.5%'
                },
                {
                    id: 3,
                    type: '체크카드',
                    name: '뱅크스코프 일상 체크카드',
                    desc: '주로 결제하시는 카페/대중교통 업종에서 최대 혜택을 받습니다.',
                    rate: '최대 5% 적립'
                }
            ]);
            setIsAiLoading(false);
        }, 3000); 
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.aiCard}>
                <h2 className={styles.aiTitle}>🤖 AI 맞춤 금융상품 추천</h2>
                
                {!isAiLoading && !aiResult && (
                    <>
                        <p className={styles.aiDesc}>
                            최신 딥러닝 기술로 고객님의 소비 패턴과 금융 자산을 분석하여<br />
                            가장 완벽한 상품을 추천해 드립니다.
                        </p>
                        <button className={styles.aiButton} onClick={handleAiRecommend}>
                            내 맞춤 상품 분석하기
                        </button>
                    </>
                )}

                {isAiLoading && (
                    <div className={styles.aiLoadingBox}>
                        <Loading />
                        <p style={{ margin: 0, fontWeight: '600', fontSize: '18px', marginTop: '10px' }}>
                            AI가 고객님의 데이터를 심층 분석 중입니다...
                        </p>
                        <p style={{ fontSize: '14px', color: '#b2dfdb', margin: 0 }}>
                            (약 3~5초 정도 소요될 수 있습니다)
                        </p>
                    </div>
                )}

                {!isAiLoading && aiResult && (
                    <div className={styles.aiResultContainer}>
                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ fontWeight: '600', margin: '0 0 5px 0', fontSize: '20px' }}>
                                분석이 완료되었습니다! 🎉
                            </p>
                            <p style={{ margin: 0, fontSize: '15px', color: '#d1e8e2' }}>
                                고객님께 가장 적합한 TOP 3 상품입니다.
                            </p>
                        </div>
                        
                        <div className={styles.resultList}>
                            {aiResult.map((item) => (
                                <div key={item.id} className={styles.aiResultCard}>
                                    <div className={styles.aiResultInfo}>
                                        <span className={styles.badge}>{item.type}</span>
                                        <h4>{item.name}</h4>
                                        <p>{item.desc}</p>
                                    </div>
                                    <div className={styles.aiResultRate}>
                                        {item.rate}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className={styles.btnGroup}>
                            <button 
                                className={styles.aiButton} 
                                onClick={() => navigate(-1)}
                            >
                                돌아가기
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiRecommend;