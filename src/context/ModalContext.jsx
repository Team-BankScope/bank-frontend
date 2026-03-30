import React, { createContext, useContext, useState, useRef } from 'react';
import CustomModal from '../components/common/CustomModal'; // 경로에 맞게 수정해주세요

// 1. Context 생성
const ModalContext = createContext();

// 2. 다른 컴포넌트에서 쉽게 사용할 수 있도록 Custom Hook 생성
export const useModal = () => useContext(ModalContext);

// 3. Provider 컴포넌트 생성
export const ModalProvider = ({ children }) => {
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '안내',
        message: '',
        onConfirm: null,
    });
    const modalActionHandled = useRef(false);

    // 모달 열기 함수
    const openModal = ({ message, title = '안내', onConfirm = null }) => {
        modalActionHandled.current = false;
        setModalConfig({ isOpen: true, title, message, onConfirm });
    };

    // 모달 닫기 함수
    const closeModal = () => {
        if (modalActionHandled.current) return;
        modalActionHandled.current = true;

        setModalConfig((prev) => ({ ...prev, isOpen: false }));

        // 닫힐 때 onConfirm 콜백이 있다면 실행
        if (modalConfig.onConfirm) {
            modalConfig.onConfirm();
        }
    };

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {/* 앱의 나머지 자식 컴포넌트들 */}
            {children}

            {/* 전역으로 딱 하나만 렌더링되는 CustomModal */}
            <CustomModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                title={modalConfig.title}
                onConfirm={closeModal}
                confirmText="확인"
            >
                <div style={{ padding: '20px', textAlign: 'center', fontSize: '1.2rem', color: '#333', whiteSpace: 'pre-line', lineHeight: '1.5' }}>
                    {modalConfig.message}
                </div>
            </CustomModal>
        </ModalContext.Provider>
    );
};