import { initContract } from '../contract/contract';

const getCertificatesByStudentId = async (studentId) => {
  try {
    const { web3, contract } = await initContract();

    if (!web3) {
      throw new Error('Không thể khởi tạo Web3.');
    }

    // Gọi hàm getCertificatesByStudentId với studentId
    const certificates = await contract.methods
      .getCertificatesByStudentId(studentId)
      .call();

    return { success: true, data: certificates };
  } catch (error) {
    console.error('Lỗi khi truy xuất chứng chỉ:', error.message);
    return { success: false, message: error.message };
  }
};

export default getCertificatesByStudentId;
