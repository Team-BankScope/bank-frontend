import { useState, useEffect } from "react";
import styles from "./Admin_dashboard.module.css";

const TELLERS = [
  { id: 1, name: "김민지", level: 1, role: "신입행원", status: "active", queue: 3, processed: 12, avgTime: 3.2 },
  { id: 2, name: "이준혁", level: 2, role: "일반행원", status: "active", queue: 5, processed: 8, avgTime: 7.4 },
  { id: 3, name: "박소연", level: 2, role: "일반행원", status: "busy", queue: 4, processed: 9, avgTime: 6.8 },
  { id: 4, name: "최도윤", level: 3, role: "대리", status: "active", queue: 2, processed: 6, avgTime: 14.2 },
  { id: 5, name: "정하은", level: 4, role: "차장", status: "active", queue: 1, processed: 4, avgTime: 22.5 },
  { id: 6, name: "강현우", level: 5, role: "지점장", status: "vip", queue: 1, processed: 2, avgTime: 35.0 },
];

const QUEUE_DATA = [
  { id: "A-047", name: "홍길동", age: 67, isVip: false, isSenior: true, isNew: false, prediction: "통장정리", level: 1, confidence: 96, gate: "Gate1(Rule)", waitTime: 4, aiReason: "나이 ≥ 80 조건 미달, 거래이력: 통장정리 3회" },
  { id: "A-048", name: "김**", age: 34, isVip: false, isSenior: false, isNew: false, prediction: "주택담보대출 상담", level: 4, confidence: 88, gate: "Gate2(AI)", waitTime: 12, aiReason: "키워드: 아파트, LTV 언급 / 이전 방문: 전세자금대출 이력" },
  { id: "A-049", name: "이**", age: 45, isVip: true, isSenior: false, isNew: false, prediction: "VIP 자산관리", level: 5, confidence: 99, gate: "Gate1(Rule)", waitTime: 0, aiReason: "VIP 플래그 감지 → 지점장실 직행" },
  { id: "A-050", name: "박**", age: 29, isVip: false, isSenior: false, isNew: true, prediction: "예금 신규 가입", level: 2, confidence: 74, gate: "Gate2(AI)", waitTime: 7, aiReason: "신규고객 → Lv.2 위주 배정, 키워드: 적금, 금리 문의" },
  { id: "A-051", name: "최**", age: 52, isVip: false, isSenior: false, isNew: false, prediction: "법인계좌 개설", level: 5, confidence: 91, gate: "Gate2(AI)", waitTime: 18, aiReason: "사업자등록번호 입력, 법인 대출 이력 보유" },
];

const HOURLY = [
  { h: "09", total: 18 }, { h: "10", total: 34 }, { h: "11", total: 41 },
  { h: "12", total: 22 }, { h: "13", total: 15 }, { h: "14", total: 38 },
  { h: "15", total: 29 }, { h: "16", total: 12 },
];

const LEVEL_COLORS = {
  1: { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" },
  2: { bg: "#e3f2fd", text: "#1565c0", border: "#90caf9" },
  3: { bg: "#fff8e1", text: "#f57f17", border: "#ffe082" },
  4: { bg: "#fce4ec", text: "#c62828", border: "#f48fb1" },
  5: { bg: "#ede7f6", text: "#4527a0", border: "#b39ddb" },
};

const GATE_COLOR = { "Gate1(Rule)": "#1976d2", "Gate2(AI)": "#7b1fa2" };

const maxHourly = Math.max(...HOURLY.map(d => d.total));

export default function Admin_dashboard() {
  const [view, setView] = useState("branch"); // "branch" | "teller"
  const [selectedTeller, setSelectedTeller] = useState(TELLERS[1]);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [nextInQueue, setNextInQueue] = useState(QUEUE_DATA);
  const [tick, setTick] = useState(0);
  const [calledId, setCalledId] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const now = new Date();
  const timeStr = now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const totalWaiting = TELLERS.reduce((a, t) => a + t.queue, 0);

  function callNext() {
    const tellerQueue = nextInQueue.filter(q => q.level <= selectedTeller.level);
    if (tellerQueue.length === 0) return;
    const next = tellerQueue[0];
    setCurrentCustomer(next);
    setCalledId(next.id);
    setNextInQueue(prev => prev.filter(q => q.id !== next.id));
    setTimeout(() => setCalledId(null), 2000);
  }

  const lvC = LEVEL_COLORS;

  // === BRANCH VIEW ===
  const BranchView = () => (
    <div className={styles.main}>
      {/* KPIs */}
      <div className={styles.kpiRow}>
        {[
          { label: "전체 대기 인원", value: totalWaiting + nextInQueue.length, unit: "명", accent: "#009A83" },
          { label: "처리중 창구", value: TELLERS.filter(t => t.status !== "vip").length, unit: "개", accent: "#22c55e" },
          { label: "평균 대기 시간", value: "11.4", unit: "분", accent: "#f59e0b" },
          { label: "오늘 총 처리 건수", value: TELLERS.reduce((a, t) => a + t.processed, 0), unit: "건", accent: "#3b82f6" },
        ].map((k, i) => (
          <div key={i} className={styles.kpi} style={{ border: `1px solid ${k.accent}33` }}>
            <div className={styles.kpiGlow} style={{ background: k.accent }} />
            <div className={styles.kpiLabel}>{k.label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <div className={styles.kpiValue} style={{ color: k.accent }}>{k.value}</div>
              <div style={{ fontSize: 14, color: k.accent, opacity: 0.7 }}>{k.unit}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.grid2}>
        {/* Teller status */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            <span style={{ color: "#22c55e" }}>●</span> 직원별 창구 현황
          </div>
          {TELLERS.map(t => (
            <div key={t.id} className={styles.tellerRow}
              onClick={() => { setSelectedTeller(t); setView("teller"); }}>
              <div className={styles.levelBadge} style={{ background: lvC[t.level]?.bg || "#334155", color: lvC[t.level]?.text || "#e2e8f0", border: `1px solid ${lvC[t.level]?.border || "#475569"}` }}>L{t.level}</div>
              <div className={styles.statusDot} style={{ background: t.status === "vip" ? "#f59e0b" : t.status === "busy" ? "#ef4444" : "#22c55e" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#333" }}>{t.name}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{t.role}</div>
              </div>
              <div style={{ textAlign: "right", fontSize: 11, color: "#64748b" }}>
                <div style={{ color: "#64748b", fontWeight: 600 }}>처리 {t.processed}건</div>
                <div>평균 {t.avgTime}분</div>
              </div>
              <div className={styles.queueBubble}>대기 {t.queue}</div>
            </div>
          ))}
        </div>

        {/* Hour bar chart */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            <span style={{ color: "#009A83" }}>▐</span> 시간대별 방문객 현황
          </div>
          <div className={styles.barRow}>
            {HOURLY.map((d, i) => {
              const isNow = d.h === "14";
              return (
                <div key={i} className={styles.barWrap}>
                  <div style={{ fontSize: 10, color: isNow ? "#009A83" : "#475569", marginBottom: 2, fontWeight: 700 }}>
                    {isNow ? d.total : ""}
                  </div>
                  <div className={styles.bar} style={{ 
                      height: `${(d.total / maxHourly) * 100}%`,
                      background: isNow ? "linear-gradient(180deg, #009A83, #007f6b)" : "linear-gradient(180deg, #e0e0e0, #ced4da)",
                      border: isNow ? "1px solid #009A8344" : "none"
                  }} />
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {HOURLY.map((d, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, color: d.h === "14" ? "#009A83" : "#475569", marginTop: 4, fontWeight: d.h === "14" ? 700 : 400 }}>
                {d.h}시
              </div>
            ))}
          </div>

          {/* Level pie-like breakdown */}
          <div style={{ marginTop: 20 }}>
            <div className={styles.cardTitle}>레벨별 업무 비율</div>
            {[
              { lv: 1, label: "단순 수신", pct: 38 },
              { lv: 2, label: "상품 신규/변경", pct: 31 },
              { lv: 3, label: "개인 여신", pct: 18 },
              { lv: 4, label: "담보/복합", pct: 9 },
              { lv: 5, label: "기업/특수", pct: 4 },
            ].map(r => (
              <div key={r.lv} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 11, color: lvC[r.lv].text, fontWeight: 700 }}>Lv.{r.lv} {r.label}</span>
                  <span style={{ fontSize: 11, color: "#64748b" }}>{r.pct}%</span>
                </div>
                <div style={{ height: 6, background: "#f1f3f5", borderRadius: 3 }}>
                  <div style={{ height: "100%", width: `${r.pct}%`, background: lvC[r.lv].text, borderRadius: 3, opacity: 0.8 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Queue preview */}
      <div className={styles.card}>
        <div className={styles.cardTitle}>
          <span style={{ color: "#a855f7" }}>◆</span> AI 예측 대기열 전체보기
          <span style={{ marginLeft: "auto", fontSize: 11, color: "#475569", fontWeight: 400 }}>클릭하여 담당 창구 상세보기</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
          {QUEUE_DATA.map(q => (
            <div key={q.id} style={{
              background: "#fff",
              border: `1px solid ${lvC[q.level].border}55`,
              borderRadius: 12,
              padding: 14,
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
            }} onClick={() => { setSelectedTeller(TELLERS.find(t => t.level === q.level) || TELLERS[0]); setView("teller"); }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#333" }}>{q.id}</span>
                <span className={styles.levelBadge} style={{ background: lvC[q.level]?.bg || "#334155", color: lvC[q.level]?.text || "#e2e8f0", border: `1px solid ${lvC[q.level]?.border || "#475569"}` }}>L{q.level}</span>
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>{q.name} ({q.age}세)</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: lvC[q.level].text, marginBottom: 6 }}>{q.prediction}</div>
              <div style={{ height: 3, background: "#f1f3f5", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${q.confidence}%`, background: q.confidence > 90 ? "#22c55e" : "#f59e0b", borderRadius: 2 }} />
              </div>
              <div style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>신뢰도 {q.confidence}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // === TELLER VIEW ===
  const TellerView = () => {
    const myQueue = QUEUE_DATA.filter(q => q.level <= selectedTeller.level);
    return (
      <div className={styles.main}>
        {/* Teller selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {TELLERS.map(t => (
            <button key={t.id} onClick={() => setSelectedTeller(t)} style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: `1px solid ${selectedTeller.id === t.id ? lvC[t.level].text : "#e0e0e0"}`,
              background: selectedTeller.id === t.id ? `${lvC[t.level].bg}22` : "#fff",
              color: selectedTeller.id === t.id ? lvC[t.level].text : "#64748b",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 700,
            }}>
              L{t.level} {t.name}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Current customer */}
          <div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>
                <span style={{ color: "#22c55e" }}>◉</span> 현재 응대중 고객
              </div>
              {currentCustomer ? (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: `${lvC[currentCustomer.level].bg}`,
                      border: `2px solid ${lvC[currentCustomer.level].text}55`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 20,
                    }}>👤</div>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#333", letterSpacing: "-0.5px" }}>
                        {currentCustomer.id}
                      </div>
                      <div style={{ fontSize: 13, color: "#64748b" }}>
                        {currentCustomer.name} · {currentCustomer.age}세
                        {currentCustomer.isSenior && <span style={{ marginLeft: 6, color: "#f59e0b", fontSize: 11, fontWeight: 700 }}>시니어</span>}
                        {currentCustomer.isVip && <span style={{ marginLeft: 6, color: "#a855f7", fontSize: 11, fontWeight: 700 }}>VIP</span>}
                        {currentCustomer.isNew && <span style={{ marginLeft: 6, color: "#22c55e", fontSize: 11, fontWeight: 700 }}>신규</span>}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    background: "#f8f9fa",
                    borderRadius: 12,
                    padding: "14px 16px",
                    marginBottom: 12,
                    border: `1px solid ${lvC[currentCustomer.level].border}55`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        🤖 AI 예측 업무
                      </div>
                      <span className={styles.gateTag} style={{ background: `${GATE_COLOR[currentCustomer.gate] || "#475569"}22`, color: GATE_COLOR[currentCustomer.gate] || "#94a3b8", border: `1px solid ${GATE_COLOR[currentCustomer.gate] || "#475569"}55` }}>{currentCustomer.gate}</span>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: lvC[currentCustomer.level].text, marginBottom: 8 }}>
                      {currentCustomer.prediction}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ flex: 1, height: 6, background: "#e9ecef", borderRadius: 3 }}>
                        <div className={styles.confidenceBar} style={{ width: `${currentCustomer.confidence}%`, background: `linear-gradient(90deg, ${currentCustomer.confidence > 90 ? "#22c55e" : currentCustomer.confidence > 75 ? "#f59e0b" : "#ef4444"}, transparent)` }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: currentCustomer.confidence > 90 ? "#22c55e" : "#f59e0b" }}>
                        {currentCustomer.confidence}%
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "#475569", lineHeight: 1.6 }}>
                      📋 {currentCustomer.aiReason}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={{
                      flex: 1, padding: "10px", borderRadius: 10, border: "none",
                      background: "#e6f5f2", color: "#009A83", fontWeight: 700,
                      cursor: "pointer", fontSize: 13,
                    }}>✓ 업무 완료</button>
                    <button style={{
                      flex: 1, padding: "10px", borderRadius: 10, border: "none",
                      background: "#fee2e2", color: "#ef4444", fontWeight: 700,
                      cursor: "pointer", fontSize: 13,
                    }}>↗ 다른 창구 이관</button>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "30px 0", color: "#64748b" }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>👤</div>
                  <div style={{ fontSize: 14 }}>대기중 — 다음 손님을 호출하세요</div>
                </div>
              )}
            </div>

            {/* Call next button */}
            <button onClick={callNext} style={{
              width: "100%",
              marginTop: 12,
              padding: "16px",
              borderRadius: 14,
              border: "none",
              background: myQueue.length > 0
                ? "linear-gradient(135deg, #009A83, #007f6b)"
                : "#f1f3f5",
              color: myQueue.length > 0 ? "#fff" : "#94a3b8",
              fontSize: 16,
              fontWeight: 800,
              cursor: myQueue.length > 0 ? "pointer" : "default",
              letterSpacing: "-0.3px",
              boxShadow: myQueue.length > 0 ? "0 4px 24px #009A8355" : "none",
              transition: "all 0.2s",
            }}>
              {myQueue.length > 0 ? `📣 다음 손님 호출 (대기 ${myQueue.length}명)` : "대기 없음"}
            </button>
          </div>

          {/* Upcoming queue with AI predictions */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span style={{ color: "#a855f7" }}>◆</span> 다음 대기 고객 AI 예측
            </div>
            <div>
              {myQueue.length === 0 && (
                <div style={{ textAlign: "center", color: "#64748b", padding: "30px 0", fontSize: 13 }}>
                  배정된 대기 고객이 없습니다
                </div>
              )}
              {myQueue.map((q, i) => (
                <div key={q.id} className={`${styles.predCard} ${q.id === calledId ? styles.predCardCalled : ''}`}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{
                      fontSize: 11, fontWeight: 800, color: "#64748b",
                      background: "#f1f3f5", borderRadius: 6, padding: "2px 8px",
                    }}>{q.id}</div>
                    {i === 0 && <span style={{ fontSize: 10, color: "#22c55e", fontWeight: 700 }}>NEXT</span>}
                    <div style={{ marginLeft: "auto" }}>
                      <span className={styles.gateTag} style={{ background: `${GATE_COLOR[q.gate] || "#475569"}22`, color: GATE_COLOR[q.gate] || "#94a3b8", border: `1px solid ${GATE_COLOR[q.gate] || "#475569"}55` }}>{q.gate}</span>
                    </div>
                    <span className={styles.levelBadge} style={{ background: lvC[q.level]?.bg || "#334155", color: lvC[q.level]?.text || "#e2e8f0", border: `1px solid ${lvC[q.level]?.border || "#475569"}` }}>L{q.level}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: lvC[q.level].text }}>
                      {q.prediction}
                    </span>
                    <span style={{ fontSize: 11, color: "#64748b" }}>
                      {q.name} · {q.age}세
                      {q.isSenior && " 🧓"}
                      {q.isVip && " ⭐"}
                      {q.isNew && " 🆕"}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 3, background: "#e9ecef", borderRadius: 2 }}>
                      <div className={styles.confidenceBar} style={{ width: `${q.confidence}%`, background: `linear-gradient(90deg, ${q.confidence > 90 ? "#22c55e" : q.confidence > 75 ? "#f59e0b" : "#ef4444"}, transparent)` }} />
                    </div>
                    <span style={{ fontSize: 10, color: "#64748b" }}>신뢰도 {q.confidence}%</span>
                    <span style={{ fontSize: 10, color: "#64748b" }}>대기 {q.waitTime}분</span>
                  </div>

                  <div style={{ fontSize: 10, color: "#475569", marginTop: 5, lineHeight: 1.5 }}>
                    💬 {q.aiReason}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 16 }}>
          {[
            { label: "오늘 처리 건수", value: selectedTeller.processed, accent: "#22c55e" },
            { label: "평균 처리 시간", value: `${selectedTeller.avgTime}분`, accent: "#3b82f6" },
            { label: "현재 대기 수", value: `${selectedTeller.queue}명`, accent: "#f59e0b" },
          ].map((s, i) => (
            <div key={i} className={styles.card} style={{ textAlign: "center" }}>
              <div className={styles.kpiLabel}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.accent }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.root}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <div className={styles.header}>
        <div className={styles.logo}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#009A83,#007f6b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🏦</div>
          <span><span className={styles.logoAccent}>SmartTeller</span> 창구 관리 시스템</span>
        </div>
        <div className={styles.navTabs}>
          <button className={`${styles.navTab} ${view === "branch" ? styles.navTabActive : ''}`} onClick={() => setView("branch")}>지점 대시보드</button>
          <button className={`${styles.navTab} ${view === "teller" ? styles.navTabActive : ''}`} onClick={() => setView("teller")}>창구 화면</button>
        </div>
        <div className={styles.clock}>{timeStr}</div>
      </div>

      {view === "branch" ? <BranchView /> : <TellerView />}
    </div>
  );
}
