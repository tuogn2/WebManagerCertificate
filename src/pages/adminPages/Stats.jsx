import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Alert,
    Tabs,
    Tab,
} from '@mui/material';
import { BarChart } from '@mui/x-charts'; // Import BarChart from MUI Charts
import { API_BASE_URL } from '../../utils/constants';
import ChartTab from './ChartTab';
import TopEnrollmentChar from './TopEnrollmentChar';
import TopCertificateChar from './TopCertificateChar';

const Stats = () => {
    const [barChartData, setBarChartData] = useState([]);
    const [topEnrollments, setTopEnrollments] = useState([]);
    const [topCertificates, setTopCertificates] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);

    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [barChartResponse, topEnrollmentsResponse, topCertificatesResponse] = await Promise.all([
                    axios.get(`${API_BASE_URL}/stats/bar-chart?year=${year}&type=users`),
                    axios.get(`${API_BASE_URL}/stats/top-enrollments-course?month=${month}&year=${year}`),
                    axios.get(`${API_BASE_URL}/stats/top-certificates-course?month=${month}&year=${year}`),
                ]);

                setBarChartData(barChartResponse.data.data);
                setTopEnrollments(topEnrollmentsResponse.data.topEnrollments);
                setTopCertificates(topCertificatesResponse.data.topCertificatesByCourse);
            } catch (err) {
                setError('Error fetching statistics data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [year, month]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

   

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <div style={{ padding: '20px',paddingTop:5 }}>
            

            {error && <Alert severity="error">{error}</Alert>}

            <Tabs value={activeTab} onChange={handleTabChange} aria-label="statistics tabs">
                <Tab label="Bar Chart" />
                <Tab label="Top Enrollments" />
                <Tab label="Top Certificates" />
            </Tabs>

            <Grid container spacing={3} >
                {/* Tab for Bar Chart */}
                {activeTab === 0 && (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                
                                <ChartTab/>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Tab for Top Enrollments */}
                {activeTab === 1 && (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                               <TopEnrollmentChar />
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Tab for Top Certificates */}
                {activeTab === 2 && (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                
                                    <TopCertificateChar />
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </div>
    );
};

export default Stats;
