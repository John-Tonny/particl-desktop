import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OverviewComponent } from './overview/overview.component';
import { SettingsComponent } from './settings/settings.component';
import { HelpComponent } from './help/help.component';
import { AddProposalComponent } from './proposals/add-proposal/add-proposal.component';
import { ProposalsComponent } from './proposals/proposals.component';
import { ReceiveComponent, SendComponent, HistoryComponent, AddressBookComponent } from './wallet/wallet.module';

//   { path: '', redirectTo: '/wallet/overview', pathMatch: 'full' },
const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { path: 'overview', component: OverviewComponent, data: { title: '概览' } },
  { path: 'receive', component: ReceiveComponent, data: { title: '收款' } },
  { path: 'send', component: SendComponent, data: { title: '付款' } },
  { path: 'history', component: HistoryComponent, data: { title: '历史交易' } },
  { path: 'address-book', component: AddressBookComponent, data: { title: '地址簿' } },
  // { path: 'settings', component: SettingsComponent, data: { title: 'Settings' } },
  //{ path: 'help', component: HelpComponent, data: { title: '帮助/支持' } },
  { path: 'proposals', component: ProposalsComponent, data: { title: '提案' } },
  { path: 'proposal', component: AddProposalComponent, data: { title: '提案 › 提交新的' } }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
