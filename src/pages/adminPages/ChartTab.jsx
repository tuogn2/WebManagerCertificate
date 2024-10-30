import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { CircularProgress, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { API_BASE_URL } from '../../utils/constants';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartTab = () => {
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedType, setSelectedType] = useState('users'); // Thêm state cho loại dữ liệu

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
    };

    useEffect(() => {
        const fetchChartData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/stats/bar-chart?year=${selectedYear}&type=${selectedType}`);
                const data = response.data.data;

                // Tạo nhãn cho biểu đồ
                const labels = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);
                const counts = Array(12).fill(0); // Khởi tạo mảng 12 tháng với giá trị 0

                // Điền dữ liệu vào mảng counts
                data.forEach(item => {
                    const monthIndex = item._id - 1; // Chuyển đổi ID tháng sang chỉ số (0-11)
                    if (monthIndex >= 0 && monthIndex < 12) {
                        counts[monthIndex] = item.count; // Gán giá trị count cho tháng tương ứng
                    }
                });

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Số lượng người dùng',
                            data: counts,
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        },
                    ],
                });
            } catch (err) {
                setError('Lỗi khi lấy dữ liệu biểu đồ.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, [selectedYear, selectedType]); // Gọi lại API khi năm hoặc loại được chọn thay đổi

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    // Tính toán các năm từ năm hiện tại - 10 đến năm hiện tại
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, index) => currentYear - 4 + index);

    // Danh sách loại dữ liệu
    const types = ['users', 'organizations', 'certificates','enrollments', 'bundles', 'courses']; // Thay đổi danh sách loại tùy theo yêu cầu

    return (
        <div>
            <h1>Biểu đồ số lượng {selectedType} theo tháng</h1>
            <FormControl variant="outlined" style={{ marginBottom: '20px', width: '150px' }}>
                <InputLabel>Năm</InputLabel>
                <Select value={selectedYear} onChange={handleYearChange} label="Năm">
                    {years.map((year) => (
                        <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl variant="outlined" style={{ marginBottom: '20px', width: '150px' }}>
                <InputLabel>Loại</InputLabel>
                <Select value={selectedType} onChange={handleTypeChange} label="Loại">
                    {types.map((type) => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Bar data={chartData} options={{ responsive: true }} />
        </div>
    );
};

export default ChartTab;
