import express from 'express';
import { AuthRoutes } from './../modules/auth/auth.routes';
import { UserRoutes } from '../modules/user/user.routes';
import { ProfileRoutes } from '../modules/profile/profile.routes';
import { AdminRoutes } from '../modules/admin/admin.routes';

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
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
