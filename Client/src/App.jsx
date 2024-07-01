import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Sidebar } from './components';

const Dashboard = () => {
  return (
    <Container className="flex w-[100vw] h-[100vh]">
      <Sidebar />
      <Outlet />
    </Container>
  );
};

export default Dashboard;

