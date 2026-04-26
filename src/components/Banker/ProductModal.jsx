import React from 'react';
import styles from './ProductModal.module.css';

const ProductModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2>금융상품 가입 안내</h2>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </header>

        <div className={styles.body}>
          <div className={styles.productBadge}>추천 상품</div>
          <h3 className={styles.productName}>{product.name}</h3>
          <p className={styles.productDesc}>{product.description}</p>
          
          <hr className={styles.divider} />

          <div className={styles.formSection}>
            <label>연결할 계좌 선택</label>
            <select className={styles.select}>
              <option>123-456-7890 (보통예금)</option>
              <option>987-654-3210 (급여통장)</option>
            </select>
          </div>

          <div className={styles.infoBox}>
            <h4>상품 상세 설명</h4>
            <p>{product.detail}</p>
          </div>
        </div>

        <footer className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>닫기</button>
          <button className={styles.submitBtn} onClick={() => alert('가입 신청이 완료되었습니다.')}>신청하기</button>
        </footer>
      </div>
    </div>
  );
};

export default ProductModal;