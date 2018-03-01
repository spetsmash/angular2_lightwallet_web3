import { Injectable } from '@angular/core';
import { contracts } from './contracts';

declare const Web3;
declare const lightwallet;

@Injectable()
export class LwService {

  private keystore;
  public address;
  private web3;

  constructor() {
    if (localStorage.getItem('key')) {
      this.keystore = lightwallet.keystore.deserialize(localStorage.getItem('key'));
      this.address = this.keystore.getAddresses()[0];
      console.log(this.keystore);
    }
    if (typeof this.web3 !== 'undefined') {
      this.web3 = new Web3(this.web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
      console.log(this.web3);
    }
  }

  generateSeed() {
    // console.log(lightwallet);
    return lightwallet.keystore.generateRandomSeed();
  }

  createWallet(phrase, password) {
    if (phrase === '') {
      phrase = this.generateSeed();
      console.log(phrase);
    }

    lightwallet.keystore.createVault({
      password: password,
      seedPhrase: phrase,
      hdPathString: "m/44'/60'/0'/0",
    }, (err, ks) => {
      ks.keyFromPassword(password, (err, pwDerivedKey) => {
        if (err) throw err;
        console.log(this);
        ks.generateNewAddress(pwDerivedKey, 1);
        this.address = ks.getAddresses()[0];
        this.keystore = ks;
        console.log(this.keystore.serialize());
        localStorage.setItem( 'key', this.keystore.serialize());
      });
    });

  }

  makeTx(functionName, args, ethAmount) {
    const number = this.web3.eth.getTransactionCount(this.address);
    const gasPrice = this.web3.eth.gasPrice;
    //console.log(gasPrice.toString(10));
    //console.log(number); // 1
    console.log(lightwallet)
    const txObject = {
      to: contracts.address,
      gasLimit: 3000000,   //should be changed
      gasPrice: gasPrice.toNumber(),
      value: ethAmount,
      nonce: number
    };
    console.log(txObject);
    return lightwallet.txutils.functionTx(contracts.abi, functionName, args, txObject);
  }

  signTx(rawTx, password, cb) {
    this.keystore.keyFromPassword(password, (err, key) => {
      if(err) throw err;
      const signedTx = lightwallet.signing.signTx(this.keystore, key, rawTx, this.address);
      cb(signedTx);
    })
  }



}
