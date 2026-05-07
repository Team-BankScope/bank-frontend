import React, { useState, useEffect } from "react";
import styles from "./Accounts.module.css";

const Accounts = ({ onCancel, onCreate, selectedTask }) => {
    // 1. 상태 관리
    const [activeTab, setActiveTab] = useState("예금 계좌");
    const [customerType, setCustomerType] = useState("기존 고객님");

    const [depositProducts, setDepositProducts] = useState([]);
    const [savingsProducts, setSavingsProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState("");

    const [formData, setFormData] = useState({
        amount: "",
        accountAlias: "",
        accountPassword: "",
        confirmPassword: "",
        durationMonths: ""
    });

    const tabs = ["예금 계좌", "적금 계좌"];

    // 2. 상품 목록 비동기 조회
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // 예금 상품 조회
                const depRes = await fetch('/api/product/?category=DEPOSIT&page=1');
                if (depRes.ok) {
                    const depData = await depRes.json();
                    if (depData.result === 'SUCCESS') {
                        setDepositProducts(depData.products || []);
                    }
                }
                
                // 적금 상품 조회
                const savRes = await fetch('/api/product/?category=SAVINGS&page=1');
                if (savRes.ok) {
                    const savData = await savRes.json();
                    if (savData.result === 'SUCCESS') {
                        setSavingsProducts(savData.products || []);
                    }
                }
            } catch (error) {
                console.error("상품 목록 조회 실패:", error);
            }
        };

        fetchProducts().catch(console.error);
    }, []);

    // 탭 변경 시 선택된 상품 및 입력값 초기화
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedProductId("");
    }, [activeTab]);

    const currentProducts = activeTab === "예금 계좌" ? depositProducts : savingsProducts;
    const selectedProduct = currentProducts.find(p => p.productId === Number(selectedProductId));

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 3. 계좌 개설 로직 분리
    const createDepositAccount = async (payload) => {
        return fetch('/api/account/deposit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    };

    const createSavingsAccount = async (payload) => {
        return fetch('/api/account/savings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    };

    // 4. Submit 핸들러 및 DTO 매핑
    const handleSubmit = async () => {
        if (!selectedProductId) {
            alert("상품을 선택해주세요.");
            return;
        }
        if (formData.accountPassword !== formData.confirmPassword) {
            alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            return;
        }
        
        const duration = Number(formData.durationMonths);
        if (!duration || duration < selectedProduct.minDurationMonths || duration > selectedProduct.maxDurationMonths) {
            alert(`가입 기간은 ${selectedProduct.minDurationMonths}개월에서 ${selectedProduct.maxDurationMonths}개월 사이여야 합니다.`);
            return;
        }

        const amount = Number(formData.amount);
        if (amount < selectedProduct.minAmount || amount > selectedProduct.maxAmount) {
            alert(`가입 금액은 ${selectedProduct.minAmount.toLocaleString()}원에서 ${selectedProduct.maxAmount.toLocaleString()}원 사이여야 합니다.`);
            return;
        }

        // TODO: userId, taskId는 로그인 컨텍스트나 세션에서 주입 (현재는 prop 기반 임시값)
        const payload = {
            taskId: selectedTask?.taskId || null, 
            productId: Number(selectedProductId),
            amount: amount,
            durationMonths: duration,
            accountPassword: formData.accountPassword,
            accountAlias: formData.accountAlias,
            userId: selectedTask?.userId || null 
        };

        try {
            let response;
            if (activeTab === "예금 계좌") {
                response = await createDepositAccount(payload);
            } else {
                response = await createSavingsAccount(payload);
            }

            const data = await response.json();

            // 5. 응답 결과 처리 분기
            switch (data.result) {
                case 'SUCCESS':
                    alert('계좌가 성공적으로 개설되었습니다.');
                    onCreate?.(data); // 부모 콜백
                    break;
                case 'FAILURE_USER_NOT_EXIST':
                    alert('사용자 정보를 찾을 수 없습니다.');
                    break;
                case 'FAILURE_NOT_CORPORATE_USER':
                    alert('법인 고객만 이용 가능한 상품입니다.');
                    break;
                case 'FAILURE':
                default:
                    alert('계좌 개설에 실패했습니다. 잠시 후 다시 시도해주세요.');
                    break;
            }
        } catch (error) {
            console.error("계좌 개설 처리 중 에러 발생:", error);
            alert("서버와 통신 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className={styles.accountsContainer}>
            {/* 상단 탭 메뉴 */}
            <div className={styles.tabContainer}>
                {tabs.map((tab) => (
                    <div
                        key={tab}
                        className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ""}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            {/* 입력 폼 영역 */}
            <div className={styles.formGrid}>
                {/* 1행: 이름, 주민등록번호, 계좌별칭 */}
                <div className={styles.inputGroup}>
                    <label>이름</label>
                    <input type="text" value={selectedTask?.userName || "고객명"} disabled className={styles.input} />
                    <div className={styles.radioGroup}>
                        <label>
                            <input
                                type="radio"
                                name="customerType"
                                checked={customerType === "신규 가입"}
                                onChange={() => setCustomerType("신규 가입")}
                            />
                            신규 가입
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="customerType"
                                checked={customerType === "기존 고객님"}
                                onChange={() => setCustomerType("기존 고객님")}
                            />
                            기존 고객님
                        </label>
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label>주민등록번호</label>
                    <span className={styles.input}>701012-1324567</span> {/* 주민번호 마스킹 유지 */}
                </div>

                <div className={`${styles.inputGroup} ${styles.alignRight}`}>
                    <label>계좌 별칭</label>
                    <input 
                        type="text" 
                        name="accountAlias"
                        value={formData.accountAlias} 
                        onChange={handleChange}
                        placeholder="예: 내 집 마련 통장" 
                        className={styles.input} 
                    />
                </div>

                {/* 2행: 상품 선택 및 금리 안내 (2칸 차지), 최초 입금액 */}
                <div className={`${styles.inputGroup} ${styles.colSpan2}`}>
                    <label>상품 선택</label>
                    <select 
                        className={styles.select} 
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                    >
                        <option value="">상품을 선택해주세요</option>
                        {currentProducts.map(product => (
                            <option key={product.productId} value={product.productId}>
                                {product.productName}
                            </option>
                        ))}
                    </select>
                    
                    {/* 선택된 상품의 상세 정보 표시 */}
                    <div className={styles.infoBox} style={{ whiteSpace: "pre-line", fontSize: "0.85rem", lineHeight: "1.5" }}>
                        {selectedProduct ? (
                            <>
                                <strong>기본금리:</strong> 연 {selectedProduct.baseInterestRate}% | <strong>최고금리:</strong> 연 {selectedProduct.maxInterestRate}%<br/>
                                <strong>가입기간:</strong> {selectedProduct.minDurationMonths}개월 ~ {selectedProduct.maxDurationMonths}개월<br/>
                                <strong>가입금액:</strong> {selectedProduct.minAmount.toLocaleString()}원 ~ {selectedProduct.maxAmount.toLocaleString()}원<br/>
                                <strong>설명:</strong> {selectedProduct.description}
                            </>
                        ) : (
                            "원하시는 상품을 선택하면 상세 정보가 여기에 표시됩니다."
                        )}
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label>최초 입금액 (원)</label>
                    <input 
                        type="number" 
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="금액 입력" 
                        className={styles.input} 
                    />
                </div>

                {/* 3행: 계좌 비밀번호, 계좌 비밀번호 확인, 가입 기간 */}
                <div className={styles.inputGroup}>
                    <label>계좌 비밀번호</label>
                    <input 
                        type="password" 
                        name="accountPassword"
                        value={formData.accountPassword}
                        onChange={handleChange}
                        maxLength="4"
                        placeholder="●●●●" 
                        className={styles.input} 
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>계좌 비밀번호 확인</label>
                    <input 
                        type="password" 
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        maxLength="4"
                        placeholder="●●●●" 
                        className={styles.input} 
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>가입 기간 (개월)</label>
                    <input 
                        type="number" 
                        name="durationMonths"
                        value={formData.durationMonths}
                        onChange={handleChange}
                        placeholder="가입 기간(개월) 입력" 
                        className={styles.input} 
                    />
                </div>
            </div>
            
            <div className={styles.accountBtnRow}>
                <button className={styles.btnCancel} onClick={onCancel}>
                    취소
                </button>

                <button className={styles.btnCreate} onClick={handleSubmit}>
                    계좌 개설
                </button>
            </div>
        </div>
    );
};

export default Accounts;