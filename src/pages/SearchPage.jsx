import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  CssBaseline,
  Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/constants.jsx";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState({ courses: [], bundles: [] });
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrgs, setSelectedOrgs] = useState([]); // Changed to an array
  const [showMore, setShowMore] = useState(false);
  const [filteredResults, setFilteredResults] = useState({ courses: [], bundles: [] });
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');

  // Fetch organizations and course counts
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/organization/courses-count`);
        if (!response.ok) {
          throw new Error("Failed to fetch organizations");
        }
        const data = await response.json();
        setOrganizations(data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };
    fetchOrganizations();
  }, []);

  // Fetch search results based on query
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/course/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  // Filter results based on selected organizations
  useEffect(() => {
    const filterResults = () => {
      const { courses, bundles } = results;

      const filteredCourses = selectedOrgs.length > 0
        ? courses.filter(course => selectedOrgs.includes(course.organization))
        : courses;

      const filteredBundles = selectedOrgs.length > 0
        ? bundles.filter(bundle => selectedOrgs.includes(bundle.organization))
        : bundles;

      setFilteredResults({
        courses: filteredCourses,
        bundles: filteredBundles,
      });
    };

    filterResults();
  }, [results, selectedOrgs]);

  const handleOrgChange = (orgId) => {
    // Toggle selection
    setSelectedOrgs(prev => {
      if (prev.includes(orgId)) {
        return prev.filter(id => id !== orgId); // Remove organization if already selected
      } else {
        return [...prev, orgId]; // Add organization to selection
      }
    });
  };

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  if (loading) {
    return (
      <Container style={{ textAlign: "center", marginTop: "20px" }}>
        <CircularProgress />
      </Container>
    );
  }

  const { courses, bundles } = filteredResults;
  const displayedOrgs = showMore ? organizations : organizations.slice(0, 5);

  return (
    <>
      <CssBaseline />
      <Header />

      <Container maxWidth="xl" style={{ marginTop: "20px" }}>
        <Grid container spacing={2}>
          {/* Sidebar for Organizations */}
          <Grid item xs={3}>
            <Typography variant="h6">Organizations</Typography>
            <div style={{ minHeight: '80vh', maxHeight: '80vh', overflowY: 'auto', marginBottom: '20px' }}>
              <List>
                {displayedOrgs.map((org) => (
                  <ListItem key={org._id}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedOrgs.includes(org._id)} // Check if org is selected
                          onChange={() => handleOrgChange(org._id)}
                        />
                      }
                      label={`${org.name}`}
                    />
                  </ListItem>
                ))}
              </List>
            </div>
            {/* Show More button */}
            <Button onClick={toggleShowMore}>
              {showMore ? "See Less" : "See More"}
            </Button>
          </Grid>

          {/* Main Content */}
          <Grid item xs={9}>
            <Typography variant="h4" component="h1">
              Search results for "{query}"
            </Typography>

            {/* Display Course Bundles */}
            {bundles.length > 0 && (
              <>
                <Typography variant="h5" component="h2" gutterBottom>
                  Available Course Bundles
                </Typography>
                <Grid container spacing={3}>
                  {bundles.map((bundle) => (
                    <Grid item xs={12} sm={6} md={4} key={bundle._id}>
                      <Card sx={{ height: '100%' }}>
                        <CardActionArea onClick={() => navigate(`/bundle/${bundle._id}`)}>
                          <CardMedia
                            component="img"
                            height="200"
                            image={bundle.image}
                            alt={bundle.title}
                          />
                          <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                              {bundle.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {bundle.description}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            {/* Display Courses */}
            {courses.length > 0 && (
              <>
                <Typography variant="h5" component="h2" gutterBottom style={{ marginTop: "20px" }}>
                  Available Courses
                </Typography>
                <Grid container spacing={3}>
                  {courses.map((course) => (
                    <Grid item xs={12} sm={6} md={4} key={course._id}>
                      <Card sx={{ height: '100%' }}>
                        <CardActionArea onClick={() => navigate(`/course/${course._id}`)}>
                          <CardMedia
                            component="img"
                            height="200"
                            image={course.image}
                            alt={course.title}
                          />
                          <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                              {course.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {course.description}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            {/* No results */}
            {bundles.length === 0 && courses.length === 0 && (
              <Typography variant="h6" color="textSecondary" style={{ marginTop: "20px" }}>
                No results found for "{query}". Please try a different search.
              </Typography>
            )}
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </>
  );
};

export default SearchPage;
