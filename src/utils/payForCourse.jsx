import { initContract } from '../contract/contract';

const payForCourse = async (studentId, courseId, studentName, amount, organizationAddress, organizationName) => {
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

    if (accounts.length === 0) {
      throw new Error('Không tìm thấy tài khoản. Vui lòng đăng nhập vào MetaMask.');
    }

    const account = accounts[0];

    // Đảm bảo rằng số tiền đã được chuyển đổi sang Wei
    const amountInWei = web3.utils.toWei(amount, 'ether');

    await contract.methods.payForCourse(courseId, studentId, studentName, organizationAddress, organizationName)
      .send({ from: account, value: amountInWei });

    return { success: true, message: 'Thanh toán thành công!' };
  } catch (error) {
    console.error('Lỗi khi thanh toán:', error.message);
    return { success: false, message: error.message };
  }
};

export default payForCourse;
