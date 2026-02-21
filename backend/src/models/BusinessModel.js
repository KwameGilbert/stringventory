import { BaseModel } from './BaseModel.js';

/**
 * Business Model
 */
class BusinessModelClass extends BaseModel {
  constructor() {
    super('businesses', {
      timestamps: true,
      softDeletes: false,
      searchableFields: ['name', 'type'],
      sortableFields: ['createdAt', 'updatedAt', 'name'],
      hidden: [],
    });
  }
}

export const BusinessModel = new BusinessModelClass();
export default BusinessModel;
