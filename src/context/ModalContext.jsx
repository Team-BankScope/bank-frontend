import React, { createContext, useContext, useState } from 'react';
import CustomModal from '../components/common/CustomModal';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '안내',
        message: '',
        onConfirm: null,
        onCancel: null,
        confirmText: '확인',
        cancelText: '취소',
    });

    // openModal이 모든 props를 받을 수 있도록 ...rest 사용
    const openModal = (props) => {
        setModalConfig({
            ...modalConfig, // 기본값 유지
            ...props,       // 전달된 props로 덮어쓰기
            isOpen: true,
        });
    };

    const closeModal = () => {
        // 상태를 초기 기본값으로 리셋
        setModalConfig({
            isOpen: false,
            title: '안내',
            message: '',
            onConfirm: null,
            onCancel: null,
            confirmText: '확인',
            cancelText: '취소',
        });
    };

    const handleConfirm = () => {
        if (modalConfig.onConfirm) {
            modalConfig.onConfirm();
        }
        closeModal(); // 작업 후 모달 닫기
    };

    const handleCancel = () => {
        if (modalConfig.onCancel) {
            modalConfig.onCancel();
        }
        closeModal(); // 작업 후 모달 닫기
    };

    return (
        <ModalContext.Provider value={{ openModal }}>
            {children}
            <CustomModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                title={modalConfig.title}
                onConfirm={modalConfig.onConfirm ? handleConfirm : null}
                onCancel={modalConfig.onCancel || modalConfig.cancelText ? handleCancel : null}
                confirmText={modalConfig.confirmText || '확인'}
                cancelText={modalConfig.cancelText}
            >
                <div style={{ padding: '20px', textAlign: 'center', fontSize: '1.2rem', color: '#333', whiteSpace: 'pre-line', lineHeight: '1.5' }}>
                    {modalConfig.message}
                </div>
            </CustomModal>
        </ModalContext.Provider>
    );
};
