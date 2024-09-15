import { initContract } from '../contract/contract';

const getCertificatesByStudentId = async (studentId) => {
  try {
    const { web3, contract } = await initContract();

    if (!web3) {
      throw new Error('Không thể khởi tạo Web3.');
    }

    if (!window.ethereum) {
      throw new Error('MetaMask không được cài đặt.');
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    const account = accounts[0];

    if (!account) {
      throw new Error('Không tìm thấy tài khoản. Vui lòng đăng nhập vào MetaMask.');
    }

    // Gọi hàm getCertificatesByStudentId với studentId
    const certificates = await contract.methods
      .getCertificatesByStudentId(studentId)
      .call({ from: account });

    return { success: true, data: certificates };
  } catch (error) {
    console.error('Lỗi khi truy xuất chứng chỉ:', error.message);
    return { success: false, message: error.message };
  }
};

export default getCertificatesByStudentId;
