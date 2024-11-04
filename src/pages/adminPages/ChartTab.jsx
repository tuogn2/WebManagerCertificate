import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { CircularProgress, Alert, Select, MenuItem, FormControl, InputLabel, Button, Box } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { API_BASE_URL } from '../../utils/constants';
import * as XLSX from 'xlsx';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartTab = () => {
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedType, setSelectedType] = useState('users');

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

                const labels = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);
                const counts = Array(12).fill(0);

                data.forEach(item => {
                    const monthIndex = item._id - 1;
                    if (monthIndex >= 0 && monthIndex < 12) {
                        counts[monthIndex] = item.count;
                    }
                });

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: `Number of ${selectedType}`,
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
    }, [selectedYear, selectedType]);

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(chartData.datasets[0].data.map((count, index) => ({
            Month: chartData.labels[index],
            Count: count
        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Chart Data');

        XLSX.writeFile(wb, `ChartData_${selectedType}_${selectedYear}.xlsx`);
    };

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

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, index) => currentYear - 4 + index);
    const types = ['users', 'organizations', 'certificates', 'enrollments', 'bundles', 'courses'];

    return (
        <div>
            <h1>Monthly {selectedType} Count Chart</h1>
            <Box display="flex" alignItems="center" marginBottom="20px">
                <FormControl variant="outlined" style={{ marginRight: '20px', width: '150px' }}>
                    <InputLabel>Năm</InputLabel>
                    <Select value={selectedYear} onChange={handleYearChange} label="Năm">
                        {years.map((year) => (
                            <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl variant="outlined" style={{ marginRight: '20px', width: '150px' }}>
                    <InputLabel>Loại</InputLabel>
                    <Select value={selectedType} onChange={handleTypeChange} label="Loại">
                        {types.map((type) => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={exportToExcel}>
                    Export Excel
                </Button>
            </Box>

            <div style={{ marginTop: '20px' }}>
                <Bar data={chartData} options={{ responsive: true }} />
            </div>
        </div>
    );
};

export default ChartTab;
