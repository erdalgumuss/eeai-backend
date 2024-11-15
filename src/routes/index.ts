import { Application } from 'express';
import adminRoutes from './company/companyRoutes';
import interviewRoutes from './interview/interviewRoutes';
import questionRoutes from './questionRoutes';
import applicationRoutes from './applicationRoutes';
import videoRoutes from './videoRoutes';
import categoryRoutes from './categoryRoutes';

const loadRoutes = (app: Application): void => {
  app.use('/api/admin', adminRoutes);
  app.use('/api/interview', interviewRoutes);
  app.use('/api/question', questionRoutes);
  app.use('/api/application', applicationRoutes);
  app.use('/api/video', videoRoutes);
  app.use('/api/category', categoryRoutes);
};

export default loadRoutes;
