import { DefaultTreeviewI18n } from './lib/models/treeview-i18n';
import { TreeviewItem, TreeviewSelection } from './lib/models/treeview-item';
// tslint:disable
import { Injectable, Injector } from '@angular/core';
import { LocalizationService } from 'abp-ng2-module';
import { AppConsts } from '@shared/AppConsts';

@Injectable()
export class DropdownTreeviewSelectI18n extends DefaultTreeviewI18n {
  localization: LocalizationService;
  localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;
  private internalSelectedItem: TreeviewItem;

  constructor(
    injector: Injector,
  ) {
    super();
    this.localization = injector.get(LocalizationService);
  }


  set selectedItem(value: TreeviewItem) {
    this.internalSelectedItem = value;
  }

  get selectedItem(): TreeviewItem {
    return this.internalSelectedItem;
  }

  getText(selection: TreeviewSelection): string {
    return this.internalSelectedItem ? this.internalSelectedItem.text : this.l('chose');
  }

  l(key: string, ...args: any[]): string {
    let localizedText = this.localization.localize(key, this.localizationSourceName);

    if (!localizedText) {
      localizedText = key;
    }

    if (!args || !args.length) {
      return localizedText;
    }

    args.unshift(localizedText);
    return abp.utils.formatString.apply(this, args);
  }
}
