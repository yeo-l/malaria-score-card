import {IMalariaOrgUnitModel, MalariaOrgUnitModel} from './malaria-orgUnit-model';
import {IMalariaGroupModel, MalariaGroupModel} from './malaria-group-model';
import {IMalariaIndicatorModel, MalariaIndicatorModel} from './malaria-indicator-model';

export interface IMalariaDataStoreModel {
  orgUnitLevel: IMalariaOrgUnitModel;
  indicatorGroup: IMalariaGroupModel[];
  indicators: IMalariaIndicatorModel[];
}
export class MalariaDataStoreModel implements IMalariaDataStoreModel{
  constructor(public orgUnitLevel: MalariaOrgUnitModel,
              public indicatorGroup: MalariaGroupModel[],
              public indicators: MalariaIndicatorModel[]) {}
}
