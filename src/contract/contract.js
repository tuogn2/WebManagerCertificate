// src/contract.js
import Web3 from 'web3';

// Kiểm tra xem MetaMask có được cài đặt không
const getWeb3 = () => {
  return new Promise((resolve, reject) => {
    // Đảm bảo rằng window.ethereum (MetaMask) có sẵn
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      resolve(web3);
    } else {
      reject(new Error('MetaMask không được cài đặt.'));
    }
  });
};

// ABI của hợp đồng thông minh
const abi =[
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "courseId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "studentId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "hash",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "score",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "certificateId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "imageUrl",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isCompleted",
				"type": "bool"
			}
		],
		"name": "addCertificateDetails",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "courseId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "studentId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "studentName",
				"type": "string"
			},
			{
				"internalType": "address payable",
				"name": "organization",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "organizationName",
				"type": "string"
			}
		],
		"name": "payForCourse",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "certificateKeys",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "certificates",
		"outputs": [
			{
				"internalType": "string",
				"name": "courseId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "studentId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "studentName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "certificateHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "certificateId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "imageUrl",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "score",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isCompleted",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "cost",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "organizationName",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "studentId",
				"type": "string"
			}
		],
		"name": "getCertificatesByStudentId",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "courseId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "studentId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "studentName",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "certificateHash",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "certificateId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "imageUrl",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "score",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isCompleted",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "cost",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "organizationName",
						"type": "string"
					}
				],
				"internalType": "struct CoursePayment.Certificate[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "page",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pageSize",
				"type": "uint256"
			}
		],
		"name": "getCertificatesWithPagination",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "courseId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "studentId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "studentName",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "certificateHash",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "certificateId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "imageUrl",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "score",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isCompleted",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "cost",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "organizationName",
						"type": "string"
					}
				],
				"internalType": "struct CoursePayment.Certificate[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalCertificates",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

// Địa chỉ hợp đồng trên mạng
const contractAddress = '0xD808E36AebC4c110405d407e79ED7DD04EC1B014';

// Khởi tạo Web3 và hợp đồng
const initContract = async () => {
  try {
    const web3 = await getWeb3();
    const contract = new web3.eth.Contract(abi, contractAddress);
    return { web3, contract };
  } catch (error) {
    console.error('Lỗi khi khởi tạo Web3 hoặc hợp đồng:', error);
  }
};

export { initContract };
