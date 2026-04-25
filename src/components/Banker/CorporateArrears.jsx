import React, { useState } from 'react';
import styles from './CorporateArrears.module.css'; 

const CorporateArrears = () => {
  const [arrearsDate, setArrearsDate] = useState('2026-03-21');
  
  const calculateDDay = (date) => {
    const today = new Date();
    const start = new Date(date);
    const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? `D+${diff}` : `D${diff}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        
   
        <div className={styles.section}>
          <label className={styles.labelRow}>법인명 / 사업자등록번호</label>
          <div className={styles.displayBox}>권정균</div>
          <div className={`${styles.displayBox} ${styles.marginTop10}`}>123-45-67890</div>
        </div>


        <div className={styles.section}>
          <label className={styles.labelRow}>최초 연체 발생일</label>
          <div className={styles.inputFieldBox}>
            <input 
              type="date" 
              value={arrearsDate} 
              onChange={(e) => setArrearsDate(e.target.value)} 
            />
          </div>
          <p className={styles.dDayText}>현재 연체 {calculateDDay(arrearsDate)}일째</p>
        </div>


        <div className={styles.rowGrid}>
          <div className={styles.section}>
            <label className={styles.labelRow}>연체 총액 (원)</label>
            <input type="text" placeholder="0" className={styles.textRight} />
          </div>
          <div className={styles.section}>
            <label className={styles.labelRow}>연체 회차</label>
            <div className={styles.customSelectMain}>
              <select>
                <option>1회차</option>
                <option>2회차</option>
                <option className={styles.dangerText}>3회차 이상 (위험)</option>
              </select>
            </div>
          </div>
        </div>

      
        <div className={`${styles.section} ${styles.riskSection}`}>
          <label className={styles.labelRow}>현재 관리 등급</label>
          <div className={styles.displayBox}>
            <span className={styles.dangerText}>주의 (Caution)</span>
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.labelRow}>연체 사유 및 대응 현황</label>
          <textarea 
            className={styles.textarea} 
            placeholder="연체 발생 원인과 현재 상환 계획을 상세히 입력하세요."
          ></textarea>
        </div>

    
        <div className={styles.buttonRow}>
          <button className={styles.btnCancel}>업무 취소</button>
          <button className={styles.btnSubmit}>연체 등록</button>
        </div>
      </div>
    </div>
  );
};

export default CorporateArrears;