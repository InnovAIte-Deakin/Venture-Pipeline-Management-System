import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrAnalyst } from '@/access/roles'
import { fieldAdminOnly, selfOrStaffRead } from '@/access/scoping'

export const Users: CollectionConfig = {
  slug: 'users',

  // 🔐 Admin panel + REST/Local-API access control (RBAC matrix §2)
  access: {
    admin: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'miv_analyst',

    // Closed: public self-signup is not allowed at the collection level.
    // The vetted /api/register route creates users through a privileged, validated
    // path, so signup still works — this just shuts the open door (matrix A1).
    create: adminOnly,

    // Staff read all; a user may read only their own record (needed for /me).
    read: selfOrStaffRead,

    update: adminOrAnalyst,

    delete: adminOnly,
  },

  admin: {
    defaultColumns: ['email', 'first_name', 'last_name', 'role', 'legacyPrismaId'],
    useAsTitle: 'email',
  },

  auth: true,

  fields: [
    {
      name: 'first_name',
      label: 'First Name',
      type: 'text',
      required: true,
    },
    {
      name: 'last_name',
      label: 'Last Name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      // Privilege field: only admins may write it (matrix §4 / anomaly A2 —
      // previously any analyst could escalate themselves or a peer to admin).
      // Locked on BOTH create and update so it can't be set at creation either.
      access: {
        create: fieldAdminOnly,
        update: fieldAdminOnly,
      },
      options: [
        { label: 'Founder', value: 'founder' },
        { label: 'MIV Analyst', value: 'miv_analyst' },
        { label: 'Admin', value: 'admin' },
      ],
      defaultValue: 'founder',
      required: true,
    },
    { name: 'organization', type: 'text' },
    {
      name: 'image',
      type: 'text',
      admin: {
        description: 'Legacy profile image URL from the Prisma app, if present.',
      },
    },
    {
      name: 'permissions',
      type: 'json',
      access: {
        create: fieldAdminOnly,
        update: fieldAdminOnly,
      },
    },
    { name: 'notificationPreferences', type: 'json' },
    {
      name: 'legacyPrismaId',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
}
