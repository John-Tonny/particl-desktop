import { Component, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';
import { Log } from 'ng2-logger';

import { IPassword } from './password.interface';

import { RpcService, RpcStateService } from '../../../core/core.module';
import { SnackbarService } from '../../../core/snackbar/snackbar.service';
import { throttle } from 'lodash';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnDestroy {


  // UI State
  password: string;
  private destroyed: boolean = false;
  public isProcessing: boolean = false;

  @Input() showPass: boolean = false;
  @Input() label: string = '您的钱包密码';
  @Input() buttonText: string;
  @Input() stakeOnly: boolean = false;
  @Input() unlockTimeout: number = 60;
  @Input() showStakeOnly: boolean = true;
  @Input() isDisabled: boolean = false;
  @Input() isButtonDisable: boolean = false;
  @Input() showPassword: boolean = false;

  /**
    * The password emitter will send over an object with the password and stakingOnly info.
    * This is useful as a building block in the initial setup, where we want to have the actual value of the password.
    */
  @Input() emitPassword: boolean = false;
  @Output() passwordEmitter: EventEmitter<IPassword> = new EventEmitter<IPassword>();
  @Output() showPasswordToggle: EventEmitter<boolean> = new EventEmitter<boolean>();
  /**
    * The unlock emitter will automatically unlock the wallet for a given time and emit the JSON result
    * of 'getwalletinfo'. This can be used to automatically request an unlock and instantly do a certain things:
    * send a transaction, before it locks again.
    */
  @Input() emitUnlock: boolean = false;
  @Output() unlockEmitter: EventEmitter<string> = new EventEmitter<string>();

  private debouncedFunc: Function;

  log: any = Log.create('password.component');

  constructor(private _rpc: RpcService,
              private _rpcState: RpcStateService,
              private flashNotification: SnackbarService) {
    this.debouncedFunc = throttle(this.forceEmit, 200, {leading: false, trailing: true});
  }

  ngOnDestroy() {
    this.destroyed = true;
  }

  /** Get the input type - password or text */
  getInputType(): string {
    return (this.showPass ? 'text' : 'password');
  }

  // -- RPC logic starts here --

  unlock (): void {
    if (!this.isProcessing) {
      this.isProcessing = true;
      this.debouncedFunc();
    }
  }

  private forceEmit(): void {
    if (this.emitPassword) {
      // emit password
      this.sendPassword();
    }

    if (this.emitUnlock) {
      // emit unlock
      this.rpc_unlock();
    } else {
      this.isProcessing = false;
    }
  }

  clear(): void {
    this.password = undefined;
  }

  /**
  * Emit password only!
  */
  sendPassword(): void {
    const pass: IPassword = {
      password: this.password,
      stakeOnly: this.stakeOnly
    };
    this.passwordEmitter.emit(pass);
  }

  /** Unlock the wallet
    * TODO: This should be moved to a service...
    */
  private rpc_unlock(): void {
    this.log.i('rpc_unlock: calling unlock! timeout=' + this.unlockTimeout);
    this.checkAndFallbackToStaking();
    this._rpc.call('walletpassphrase', [
        this.password,
        +(this.stakeOnly ? 0 : this.unlockTimeout),
        this.stakeOnly
      ])
      .subscribe(
        success => {
          // update state
          this._rpcState.stateCall('getwalletinfo');

          let _subs = this._rpcState.observe('getwalletinfo', 'encryptionstatus')
            .subscribe(
              encryptionstatus => {
                this.log.d('rpc_unlock: success: Status value:', encryptionstatus);
                if (String(encryptionstatus).toLowerCase().includes('unlocked')) {
                  this.log.d('rpc_unlock: success: unlock was called! New Status:', encryptionstatus);

                  // hook for unlockEmitter, warn parent component that wallet is unlocked!
                  this.unlockEmitter.emit(encryptionstatus);
                  if (_subs) {
                    _subs.unsubscribe();
                    _subs = null;
                  }
                }
                this.isProcessing = false;
              });
        },
        error => {
          this.isProcessing = false;
          this.log.i('rpc_unlock_failed: unlock failed - wrong password?', error);
          this.flashNotification.open('解锁失败 - 密码错误', 'err');
        },
        () => {
          this.isProcessing = false;
        });
  }

  /**
    * If we're unlocking the wallet for a period of this.unlockTimeout, then check if it was staking
    * if(staking === true) then fallback to staking instead of locked after timeout!
    * else lock wallet
    */
  private checkAndFallbackToStaking(): void {
    if (this._rpcState.get('getwalletinfo').encryptionstatus === 'Unlocked, staking only') {

      const password = this.password;
      const timeout = this.unlockTimeout;

      // After unlockTimeout, unlock wallet for staking again.
      setTimeout((() => {
          this.log.d(`checkAndFallbackToStaking, falling back into staking mode!`);
          this._rpc.call('walletpassphrase', [password, 0, true]).subscribe();
          this.reset();
        }).bind(this), (timeout + 1) * 1000);

    } else {
      // reset after 500ms so rpc_unlock has enough time to use it!
      setTimeout(this.reset,  500);
    }
  }

  private reset(): void {
    this.password = '';
  }

  // emit showpassword change
  toggle(): void {
    this.showPasswordToggle.emit(this.showPass);
  }

  // capture the enter button
  @HostListener('window:keydown', ['$event'])
    keyDownEvent(event: any) {
      if (event.keyCode === 13) {
        this.unlock();
      }
    }
}
