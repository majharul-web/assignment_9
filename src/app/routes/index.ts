import express from 'express';
import { AuthRoutes } from './../modules/auth/auth.routes';
import { UserRoutes } from '../modules/user/user.routes';
import { ProfileRoutes } from '../modules/profile/profile.routes';
import { AdminRoutes } from '../modules/admin/admin.routes';
import { CustomerRoutes } from '../modules/customer/customer.routes';
import { ServiceRoutes } from '../modules/service/service.routes';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/profile',
    route: ProfileRoutes,
  },
  {
    path: '/admins',
    route: AdminRoutes,
  },
  {
    path: '/customers',
    route: CustomerRoutes,
  },
  {
    path: '/services',
    route: ServiceRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
