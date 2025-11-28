import type { ShopSettingType } from '~/types/cms/ShopSettingType';
import gql from 'graphql-tag';
import CmsService from './CmsService';

export default class CmsShopSettingService extends CmsService {
  async fetch() {
    const query = gql`
      query ShopSetting {
        shopSetting {
          documentId
          topBanner {
            id
            link
            text
          }
        }
      }
    `;

    const { data } = await this.client.query<ShopSettingType>({
      query,
    });
    return data.shopSetting;
  }
}
