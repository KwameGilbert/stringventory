/**
 * Messaging API Service - MOCKED FOR FRONTEND DEV
 */

const mockMessages = [
  {
    id: '1',
    type: 'broadcast',
    subject: 'Platform Maintenance Schedule',
    content: 'Scheduled maintenance this Sunday at 02:00 UTC.',
    stats: { sent: 1240, read: 850, failed: 2 },
    status: 'sent',
    created_at: '2026-04-15T10:00:00Z',
    channel: 'email'
  },
  {
    id: '2',
    type: 'direct',
    subject: 'Inactivity Warning',
    recipient: 'NC Avenue Wholesale',
    content: 'Your account has been inactive for 30 days.',
    status: 'draft',
    created_at: '2026-04-16T14:30:00Z',
    channel: 'sms'
  },
  {
    id: '3',
    type: 'broadcast',
    subject: 'New Feature: Automated Tax Calculation',
    content: 'We have just launched automated tax calculation for all Enterprise users.',
    stats: { sent: 28, read: 28, failed: 0 },
    status: 'sent',
    created_at: '2026-04-10T09:15:00Z',
    channel: 'push'
  }
];

const mockTemplates = [
  {
    id: 'v-1',
    name: 'Welcome Email',
    subject: 'Welcome to PinnexVentures',
    category: 'Onboarding',
    last_used: '2026-04-16T16:20:00Z'
  },
  {
    id: 'v-2',
    name: 'Subscription Expired',
    subject: 'Your PinnexVentures Subscription has Expired',
    category: 'Billing',
    last_used: '2026-04-15T11:45:00Z'
  },
  {
    id: 'v-3',
    name: 'Low Stock Alert',
    subject: 'Critical Stock Alert',
    category: 'Inventory',
    last_used: '2026-04-17T08:00:00Z'
  }
];

export const messagingService = {
  getMessages: async (params = {}) => {
    return Promise.resolve({ data: mockMessages });
  },

  getMessageById: async (messageId) => {
    const msg = mockMessages.find(m => m.id === messageId);
    return Promise.resolve({ data: msg || mockMessages[0] });
  },

  sendBulkMessage: async (payload) => {
    console.log('Mock: Sending bulk message', payload);
    return Promise.resolve({ data: { success: true, messageId: 'm-' + Math.random() } });
  },

  sendMessage: async (payload) => {
    console.log('Mock: Sending message', payload);
    return Promise.resolve({ data: { success: true } });
  },

  getTemplates: async (params = {}) => {
    return Promise.resolve({ data: mockTemplates });
  },

  createTemplate: async (payload) => {
    console.log('Mock: Creating template', payload);
    return Promise.resolve({ data: { ...payload, id: 't-' + Math.random() } });
  },

  updateTemplate: async (templateId, payload) => {
    console.log('Mock: Updating template', templateId, payload);
    return Promise.resolve({ data: { ...payload, id: templateId } });
  },

  deleteTemplate: async (templateId) => {
    console.log('Mock: Deleting template', templateId);
    return Promise.resolve({ data: { success: true } });
  },
};

export default messagingService;
