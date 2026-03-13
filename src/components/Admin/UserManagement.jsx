import React, { useState, useEffect } from 'react';
import styles from './UserMangement.module.css';
import AdminModal from './AdminModal.jsx';
import CustomModal from '../common/CustomModal.jsx';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRowId, setSelectedRowId] = useState(null);

    // 1. 멤버 목록 조회 함수
    const fetchMembers = async () => {
        try {
            const response = await fetch('/api/user/members');
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    // 2. 등록/수정 저장 로직 (이 부분이 빠져서 반영이 안 됐던 거예요!)
    const handleSaveUser = async (userData) => {
        const memberData = {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            level: userData.level,
            auth: userData.auth,
            team: userData.team,
            counterNumber: userData.counterNumber,
            status: userData.status,
        };

        try {
            let response;
            if (selectedUser) {
                // 수정 모드: PATCH
                response = await fetch('/api/user/member', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(memberData),
                });
            } else {
                // 등록 모드: POST
                response = await fetch('/api/user/member', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(memberData),
                });
            }

            if (response.ok) {
                const result = await response.json();
                if (result.result === 'SUCCESS') {
                    alert(selectedUser ? '멤버 수정 성공!' : '멤버 등록 성공!');
                    fetchMembers(); // 여기서 목록을 새로고침해야 반영됩니다.
                } else {
                    alert('실패했습니다.');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('오류가 발생했습니다.');
        }
        setIsModalOpen(false);
        setSelectedUser(null);
    };


    const confirmDelete = async () => {
        try {
            // 💡 쿼리 스트링 방식 (?id=값) 으로 주소를 작성해야 합니다.
            const response = await fetch(`/api/user/member?id=${selectedUser.id}`, { 
                method: 'DELETE' 
            });

            if (response.ok) {
                alert('삭제되었습니다.');
                fetchMembers();
                setSelectedRowId(null);
                setSelectedUser(null);
            } else {
                alert('삭제 실패');
            }
        } catch (error) {
            console.error('삭제 오류:', error);
        }
        setIsDeleteModalOpen(false);
    };

    // 행 클릭 시 하이라이트 토글
    const handleRowClick = (user) => {
        if (selectedRowId === user.id) {
            setSelectedRowId(null);
            setSelectedUser(null);
        } else {
            setSelectedRowId(user.id);
            setSelectedUser(user);
        }
    };

    const handleDeleteClick = () => {
        if (!selectedUser) {
            alert('삭제할 임직원을 선택해주세요.');
            return;
        }
        setIsDeleteModalOpen(true);
    };

    const handleEditClick = (e, user) => {
        e.stopPropagation(); // 행 클릭 이벤트 방지
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const getLevelLabel = (level) => {
        switch (level) {
            case 1: return 'Lv.1 (신입/서포터)';
            case 2: return 'Lv.2 (일반 행원)';
            case 3: return 'Lv.3 (대리/과장)';
            case 4: return 'Lv.4 (차장/팀장)';
            case 5: return 'Lv.5 (지점장급)';
            default: return level;
        }
    };

    return (
        <div className={styles.userContainer}>
            <h2 className={styles.title}>임직원 관리</h2>

            <div className={styles.topBar}>
                <div className={styles.searchWrapper}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input type="text" placeholder="이름 혹은 이메일을 검색해주세요" className={styles.searchInput} />
                </div>
                <div className={styles.actionBtns}>
                    <select className={styles.roleSelect}><option>전체</option></select>
                    <button className={styles.deleteBtn} onClick={handleDeleteClick}>- 삭제</button>
                    <button className={styles.addBtn} onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}>+ 추가</button>
                </div>
            </div>

            <table className={styles.userTable}>
                <thead>
                    <tr>
                        <th>이름</th>
                        <th>이메일</th>
                        <th>직급</th>
                        <th>권한</th>
                        <th>소속</th>
                        <th>창구번호</th>
                        <th>입사일</th>
                        <th>마지막접속</th>
                        <th>상태</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr><td colSpan="10" style={{ padding: '50px', color: '#888' }}>등록된 임직원이 없습니다.</td></tr>
                    ) : (
                        users.map((user) => (
                            <tr 
                                key={user.id} 
                                onClick={() => handleRowClick(user)}
                                className={selectedRowId === user.id ? styles.activeRow : ''}
                            >
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{getLevelLabel(user.level)}</td>
                                <td>{user.auth}</td>
                                <td>{user.team}</td>
                                <td>{user.counterNumber || <span style={{ color: '#a6a6a6' }}>null</span>}</td>
                                <td>{user.joinDate}</td>
                                <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '-'}</td>
                                <td>
                                    <span className={`${styles.statusBadge} ${user.status === 1 ? styles.active : styles.inactive}`}>
                                        {user.status === 1 ? '활성' : '비활성'}
                                    </span>
                                </td>
                                <td>
                                    <button className={styles.editBtn} onClick={(e) => handleEditClick(e, user)}>📝 수정</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* AdminModal에 onSave를 꼭 연결해줘야 수정/등록이 작동합니다 */}
            <AdminModal 
                isOpen={isModalOpen} 
                onClose={() => { setIsModalOpen(false); setSelectedUser(null); }} 
                user={selectedUser} 
                onSave={handleSaveUser} 
            />
            
            <CustomModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                title="구성원 영구 삭제" 
                onConfirm={confirmDelete}
                confirmText="삭제 실행"
            >
                <div className={styles.deleteBox}>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>이름</span> 
                        <span className={styles.infoValue}>{selectedUser?.name}</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>이메일</span> 
                        <span className={styles.infoValue}>{selectedUser?.email}</span>
                    </div>
                    <p className={styles.warnText}>
                        * 삭제된 임직원 정보는 복구할 수 없습니다. 삭제를 진행하시겠습니까?
                    </p>
                </div>
            </CustomModal>
        </div>
    );
};

export default UserManagement;