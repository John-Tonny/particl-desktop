import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import { Log } from 'ng2-logger';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { BidService } from 'app/core/market/api/bid/bid.service';
import { Bid } from 'app/core/market/api/bid/bid.model';
import { OrderFilter } from './order-filter.model';
import { ProfileService } from 'app/core/market/api/profile/profile.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {

  private log: any = Log.create('orders.component id:' + Math.floor((Math.random() * 1000) + 1));
  @Input() type: string;

  order_sortings: Array<any> = [
    { title: '按创建时间',    value: 'date-created'  },
    { title: '按更新时间',    value: 'date-update'   },
    { title: '按状态',       value: 'status'        },
    { title: '按名称',       value: 'item-name'     },
    { title: '按类别',       value: 'category'      },
    { title: '按数量',       value: 'quantity'      },
    { title: '按价格',       value: 'price'         }
  ];

  public orders: Bid[];
  public profile: any = {};
  order_filters: OrderFilter;

  filters: any;
  additionalFilter: any;
  timer: Observable<number>;
  destroyed: boolean = false;

  constructor(
    private bid: BidService,
    private profileService: ProfileService) { }

  ngOnInit() {
    this.default();
    this.loadProfile();
  }

  default(): void {
    this.filters = {
      status: '*',
      search: '',
      sort: 'time',
    };

    this.additionalFilter = {
      requiredAttention: false,
      hideCompleted: false
    }
  }

  loadProfile(): void {
    this.profileService.default().take(1).subscribe(
      profile => {
        this.profile = profile;
        this.initLoopLoadOrders();
      });
  }

  initLoopLoadOrders() {
    this.loadOrders()
    this.timer = Observable.interval(1000 * 10);

    // call loadOrders in every 10 sec.
    this.timer.takeWhile(() => !this.destroyed).subscribe((t) => {
      this.loadOrders()
    });
  }

  loadOrders(): void {
    this.bid.search(this.profile.address, this.type, this.filters.status, this.filters.search, this.additionalFilter)
      .take(1)
      .subscribe(bids => {
        // Only update if needed
        if (this.hasUpdatedOrders(bids.filterOrders)) {
          // Initialize model only when its fetching for all orders.
          if (this.filters.status === '*') {
            this.order_filters = new OrderFilter();
          }
          this.order_filters.setOrderStatusCount(this.filters.status, bids.filterOrders)
          this.orders = bids.filterOrders;
        }
      });
  }

  hasUpdatedOrders(newOrders: Bid[]): boolean {
    return (
      !this.orders ||
      (this.orders.length !== newOrders.length) ||
      (_.differenceWith(this.orders, newOrders, (o1, o2) => {
        return (o1.id === o2.id) && (o1.status === o2.status)
      }).length)
    )
  }

  clear(): void {
    this.default();
    this.loadOrders();
  }

  ngOnDestroy() {
    this.destroyed = true;
  }
}
