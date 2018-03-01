import { Component } from '@angular/core';
import { LwService } from './lw.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  public seed;

  constructor(private lw: LwService) {}

  createSeed() {
    this.seed = this.lw.createWallet('', 'qqqqqq');
  }

  makeTx() {
    const tx = this.lw.makeTx("transfer", ["0x777624C1EEeF5CA90890b08A8BCeE4D0A4450ccC", 3], 0);
      this.lw.signTx(tx,'qqqqqq', (signed) => {
        console.log(signed);
      });
  }


}
