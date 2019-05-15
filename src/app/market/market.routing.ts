import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListingsComponent } from './listings/listings.component';
import { BuyComponent } from './buy/buy.component';
import { SellComponent } from './sell/sell.component';
import { AddItemComponent } from './sell/add-item/add-item.component';

const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { path: 'overview', component: ListingsComponent, data: { title: '\'' } },
  { path: 'buy', component: BuyComponent, data: { title: '购物' } },
  { path: 'sell', component: SellComponent, data: { title: '销售' } },
  { path: 'template', component: AddItemComponent, data: { title: '销售 › 增添/修改商品' } }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
