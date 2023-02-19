/* eslint-disable @typescript-eslint/no-shadow */
import Web3 from 'web3'
import md5 from 'md5'

const HttpProvider = 'https://matic-mumbai.chainstacklabs.com'
const AA_URL = 'http://localhost:5174/'
import { AA_ABI } from './abi'
class AASDK {
  public name = 'AA'
  public networkVersion = '80001'
  private onEvent = new Map()
  private accounts = '0xc193D7c17243917c4849bE485fE8A19f7520b0EF'
  public chainId = '0x13881'
  public selectedAddress = '0xc193d7c17243917c4849be485fe8a19f7520b0ef'
  private web3: Web3
  private AAContract: any
  private signResolve: (data: any) => void | null = () => {}
  private signReject: (error: any) => void | null = () => {}
  // 合约地址
  private AA = '0xE03611Bc5502A91aeF582826430178E9A0089bB2'
  constructor() {
    console.log('AA 初始化完成')
    this.web3 = new Web3(new Web3.providers.HttpProvider(HttpProvider))
    this.AAContract = new this.web3.eth.Contract(AA_ABI as any, this.AA, {
      // from: this.accounts,
      // gasPrice: '2000000000000',
    })
    this.onWalletMessage()
  }

  private onWalletMessage() {
    window.addEventListener('message', (e) => {
      if (e.data.type === 'AA_MESSAGE') {
        switch (e.data.data.type) {
          case 'sign':
            return this.personalSign(e.data.data)
          default:
            break
        }
        console.log(e.data, 'message')
      }
    })
  }

  private ethRequestAccounts() {
    return [this.accounts]
  }

  private ethChainId() {
    return this.chainId
  }

  private personalSign(data: any) {
    // @ts-ignore
    // TODO 调用合约
    // try {
    //   // console.log(this.AAContract.methods.sign(123).call()., 'this.AAContract.methods.sign(123)')
    //   this.AAContract.methods
    //     .sign(123343)
    //     .call()
    //     .then((data) => {
    //       console.log(data)
    //     }).catch((error) => console.log(error, 'catch'))
    // } catch (error) {
    //   console.log(error, 'error')
    // }
    if (data.resultType === 'success') {
      const result = JSON.parse(data.result)
      this.AAContract.methods
        .sign(Number(result[0]))
        .call()
        .then((data: any) => {
          this.signResolve(data)
        })
        .catch((error: any) => this.signReject(error))
    } else {
      this.signReject('The user canceled.')
    }
  }

  private personalSignMessage(params: any) {
    return new Promise((resolve, reject) => {
      this.signResolve = resolve
      this.signReject = reject
      this.openWin(`${AA_URL}?params=${JSON.stringify(params)}&type=sign`)
    })
  }

  private async getBlockNumber() {
    return this.web3.eth.getBlockNumber()
  }

  public async send(s: any) {
    console.log(s, '22')
  }
  public async sendAsync(s: any) {
    console.log(s, '22')
  }

  public async request({ method, params }: { method: string; params: any }) {
    switch (method) {
      case 'eth_requestAccounts':
        return this.ethRequestAccounts()
      case 'eth_accounts':
        return this.ethRequestAccounts()
      case 'eth_chainId':
        return this.ethChainId()
      case 'personal_sign':
        return this.personalSignMessage(params)

      default:
        break
    }
  }

  on(type: string, fn: any) {
    if (!this.onEvent.get(type)) {
      this.onEvent.set(type, fn)
    } else {
      // TODO 多个时候要考虑
    }
  }

  openWin(url: string) {
    let name = '' //网页名称，可为空;
    return window.open(
      url,
      name,
      'height=500, width=300,top=100, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no'
    )
  }
}

const AA = new AASDK()

// @ts-ignore
window.ethereum = AA

setInterval(() => {
  // @ts-ignore
  if (window.ethereum.name !== 'AA') window.ethereum = AA
}, 1000)

export default AA
