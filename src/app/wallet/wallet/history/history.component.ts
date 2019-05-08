import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})

export class HistoryComponent implements OnInit {

  @ViewChild('transactions') transactions: any;

  categories: Array<any> = [
    { title: '所有交易',   value: 'all',               icon: ''},
    { title: '付款',               value: 'send',              icon: 'send'},
    { title: '收款',           value: 'receive',           icon: 'receive'},
    { title: '收益',             value: 'stake',             icon: 'stake'},
    { title: '资金转移',  value: 'internal_transfer', icon: 'transfer'},
    // { title: 'Immature',         value: 'immature'          },
    // { title: 'Coinbase',         value: 'coinbase'          },
    // { title: 'Orphan',           value: 'orphan'            },
    // { title: 'Orphaned stake',   value: 'orphaned_stake'    },
  ];

  sortings: Array<any> = [
    { title: '按时间',                  value: 'time'          },
    { title: '按金额',                value: 'amount'        },
    { title: '按地址',               value: 'address'       },
    { title: '按分类',              value: 'category'      },
    { title: '按确认数',         value: 'confirmations' },
    { title: '按交易哈希', value: 'txid'          }
  ];

  types: Array<any> = [
    { title: '所有类型', value: 'all'      },
    { title: '公开',  value: 'standard'   },
    { title: '混肴',     value: 'blind'    },
    { title: '匿名', value: 'anon'     },
  ];

  filters: any = {
    category: undefined,
    search:   undefined,
    sort:     undefined,
    type:     undefined
  };

  public selectedTab: number = 0;

  constructor() {
    this.default();
  }

  ngOnInit(): void {
    /* may be used if we concatenate some filters http://bit.ly/2Buav9B */
  }

  default(): void {
    this.selectedTab = 0;
    this.filters = {
      category: 'all',
      type:     'all',
      sort:     'time',
      search:   ''
    };
  }

  changeCategory(index: number): void {
    this.selectedTab = index;
    this.transactions.resetPagination();
    this.filters.category = this.categories[index].value;
    this.filter();
  }

  sortList(event: any): void {
    this.filters.sort = event.value;
    this.filter();
  }

  filter(): void {
    this.transactions.filter(this.filters);
  }

  clear(): void {
    this.default();
    this.filter();
  }
}
