import React, { useState } from 'react';
import {
  Box,
  Card,
  Container,
  Grid,
  Avatar,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Select,
  MenuItem,
  Paper,
  Stack,
  Divider,
  FormControl,
  InputLabel
} from '@mui/material';

// Tab Panel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const PersonalAccount = () => {
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    name: 'Nguyễn Nghiêm Hiếu',
    email: 'nguyennghiemhieu@gmail.com',
    phone: '0906000000',
    position: 'Công Chứng Viên',
    department: 'Phòng Nghiệp Vụ',
    startDate: '01/01/2025',
    description: 'Mô tả vài nét về công chứng viên.'
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: 4,
          display: 'flex',
          justifyContent: 'center',
          width: '80%'
        }}
      >
        <Grid 
          container 
          spacing={3}
          sx={{
            width: '100%'
          }}
        >
          {/* Profile Card */}
          <Grid item xs={12} md={4} width={'400px'}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Stack spacing={3} alignItems="center">
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                    src="/path-to-avatar.jpg"
                  />
                  <Typography variant="h5" gutterBottom>
                    {formData.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {formData.position}
                  </Typography>
                </Box>

                <Divider flexItem />

                {/* Employee Information */}
                <Box sx={{ width: '100%' }}>
                  <Stack spacing={2}>
                    <Typography variant="subtitle2">Thông tin nhân viên</Typography>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary">Họ tên</Typography>
                      <Typography>{formData.name}</Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">Email</Typography>
                      <Typography>{formData.email}</Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">Số điện thoại</Typography>
                      <Typography>{formData.phone}</Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">Chức vụ</Typography>
                      <Typography>{formData.position}</Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">Phòng ban</Typography>
                      <Typography>{formData.department}</Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">Ngày làm việc</Typography>
                      <Typography>{formData.startDate}</Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">Mô tả</Typography>
                      <Typography>{formData.description}</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Card>
          </Grid>

          {/* Settings Tabs */}
          <Grid item xs={12} md={8} sx={{ flex: 1, width: 'calc(100% - 400px)' }}>
            <Paper>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab label="Thông tin cá nhân" />
                  <Tab label="Đổi mật khẩu" />
                  <Tab label="Thông báo" />
                </Tabs>
              </Box>

              {/* Personal Info Tab */}
              <TabPanel value={tabValue} index={0}>
                <Box sx={{ p: 3 }}>
                  {/* Avatar Section */}
                  <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Avatar
                      sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                      src="/path-to-avatar.jpg"
                    />
                    <Typography variant="h6" gutterBottom>
                      Hình đại diện
                    </Typography>
                    <Button variant="outlined">Đổi hình đại diện</Button>
                  </Box>

                  {/* Form Fields */}
                  <Grid container spacing={3}>
                    {/* First Column */}
                    <Grid item xs={12} md={6} sx={{ flex: 1, width: '50%' }}>
                      <Stack spacing={3}>
                        <TextField
                          fullWidth
                          label="Họ tên"
                          name="name"
                          value={formData.name}
                          onChange={handleFormChange}
                        />
                        <TextField
                          fullWidth
                          label="Số điện thoại"
                          name="phone"
                          value={formData.phone}
                          onChange={handleFormChange}
                        />
                        <FormControl fullWidth>
                          <InputLabel id="department-label">Phòng ban</InputLabel>
                          <Select
                            labelId="department-label"
                            label="Phòng ban"
                            name="department"
                            value={formData.department}
                            onChange={handleFormChange}
                          >
                            <MenuItem value="Phòng nghiệp vụ">Phòng nghiệp vụ</MenuItem>
                            {/* <MenuItem value="Marketing">Marketing</MenuItem>
                            <MenuItem value="Sales">Sales</MenuItem> */}
                          </Select>
                        </FormControl>
                      </Stack>
                    </Grid>

                    {/* Second Column */}
                    <Grid item xs={12} md={6} sx={{ flex: 1, width: '50%' }}>
                      <Stack spacing={3}>
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                        />
                        <FormControl fullWidth>
                          <InputLabel id="position-label">Chức vụ</InputLabel>
                          <Select
                            labelId="position-label"
                            label="Chức vụ"
                            name="position"
                            value={formData.position}
                            onChange={handleFormChange}
                          >
                            <MenuItem value="Công chứng viên">Công chứng viên</MenuItem>
                            {/* <MenuItem value="Product Manager">Product Manager</MenuItem>
                            <MenuItem value="Designer">Designer</MenuItem> */}
                          </Select>
                        </FormControl>
                        <TextField
                          fullWidth
                          label="Ngày làm việc"
                          name="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={handleFormChange}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Stack>
                    </Grid>
                  </Grid>

                  {/* Description */}
                  <Grid container sx={{ mt: 3 }}>
                    <Grid item xs={12} sx={{ width: '100%' }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Mô tả"
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                      />
                    </Grid>
                  </Grid>

                  {/* Action Buttons */}
                  <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Button variant="outlined" sx={{ mr: 2 }}>
                      Huỷ bỏ
                    </Button>
                    <Button variant="contained" color="primary">
                      Lưu
                    </Button>
                  </Box>
                </Box>
              </TabPanel>

              {/* Change Password Tab */}
              <TabPanel value={tabValue} index={1}>
                <Typography>Chỗ này sẽ có form để đổi mật khẩu</Typography>
              </TabPanel>

              {/* Notification Tab */}
              <TabPanel value={tabValue} index={2}>
                <Typography>Chỗ này có danh sách thông báo</Typography>
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PersonalAccount;