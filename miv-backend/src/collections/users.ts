import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrAnalyst } from '@/access/roles'
import { fieldAdminOnly, selfOrStaffRead } from '@/access/scoping'

export const Users: CollectionConfig = {
  slug: 'users',

  // 🔐 Admin panel + REST/Local-API access control (RBAC matrix §2)
  access: {
    admin: adminOrAnalyst,

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
    defaultColumns: ['email', 'first_name', 'last_name', 'role'],
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
      access: {
        update: fieldAdminOnly,
      },
      options: [
        { label: 'Founder', value: 'founder' },
        { label: 'MIV Analyst', value: 'miv_analyst' },
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
      defaultValue: 'founder',
      required: true,
    },
  ],
}
