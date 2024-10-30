import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { CircularProgress, Alert, FormControl, Select, MenuItem, Button, Box } from '@mui/material';
import { API_BASE_URL } from '../../utils/constants';

const TopCertificateChar = () => {
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [month, setMonth] = useState(new Date().getMonth() + 1); // Default to current month
    const [year, setYear] = useState(new Date().getFullYear()); // Default to current year
    const [selectedType, setSelectedType] = useState('course'); // Default to course

    const fetchEnrollmentData = async (selectedMonth, selectedYear, type) => {
        setLoading(true);
        try {
            const endpoint = type === 'course'
                ? `${API_BASE_URL}/stats/top-certificates-course?month=${selectedMonth}&year=${selectedYear}`
                : `${API_BASE_URL}/stats/top-certificates-bundle?month=${selectedMonth}&year=${selectedYear}`;
                
            const response = await axios.get(endpoint);
            const data = response.data.topCertificates;
            

            // Create labels and data for the chart
            const labels = data.map(item => item.title);
            const enrollments = data.map(item => item.count);

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: type === 'course' ? 'Course certificates' : 'Bundle certificates',
                        data: enrollments,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                ],
            });
        } catch (err) {
            setError('Error fetching chart data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnrollmentData(month, year, selectedType);
    }, [month, year, selectedType]); // Fetch data whenever month, year, or selected type changes

    const handleMonthChange = (event) => {
        setMonth(event.target.value);
    };

    const handleYearChange = (event) => {
        setYear(event.target.value);
    };

    const handleTypeChange = (type) => {
        setSelectedType(type);
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

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };
 const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, index) => currentYear - 4 + index); 
    return (
        <div>
            <h2>Top Enrollment</h2>
            <Box display="flex" alignItems="center" marginBottom={2}>
                <FormControl variant="outlined" style={{ marginRight: '10px', minWidth: 120 }}>
                    <Select value={month} onChange={handleMonthChange}>
                        {Array.from({ length: 12 }, (_, i) => (
                            <MenuItem key={i + 1} value={i + 1}>
                                {i + 1}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl variant="outlined" style={{ marginRight: '10px', minWidth: 120 }}>
                    <Select value={year} onChange={handleYearChange}>
                    {years.map((year) => (
                        <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                    </Select>
                </FormControl>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button 
                        variant={selectedType === 'course' ? 'contained' : 'outlined'} 
                        onClick={() => handleTypeChange('course')}
                        style={{ padding: '10px 20px' }} // Add padding for better size
                    >
                        Courses
                    </Button>
                    <Button 
                        variant={selectedType === 'bundle' ? 'contained' : 'outlined'} 
                        onClick={() => handleTypeChange('bundle')}
                        style={{ padding: '10px 20px' }} // Add padding for better size
                    >
                        Bundles
                    </Button>
                </div>
            </Box>

            <Bar data={chartData} options={options} />
        </div>
    );
};

export default TopCertificateChar;
