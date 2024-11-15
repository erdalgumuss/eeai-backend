import { Application } from 'express';
import companyRoutes from './auth/authRoutes';
import interviewRoutes from './interview/interviewRoutes';
import questionRoutes from './interview/questionRoutes';
//import applicationRoutes from './applicationRoutes';
//import videoRoutes from './videoRoutes';

const loadRoutes = (app: Application): void => {
  app.use('/admin', companyRoutes);
  app.use('/interview', interviewRoutes);
  app.use('/question', questionRoutes);
  //app.use('/api/application', applicationRoutes);
  //app.use('/api/video', videoRoutes);
};

export default loadRoutes;
