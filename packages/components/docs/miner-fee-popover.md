# EgMinerFee* · 矿工费 Popover 场景面板

四套网络矿工费 Popover 内容（Bitcoin / Ethereum Mainnet / TON / TRON），供业务嵌入 `EgAnchoredPopover` 或批处理 Popup。

## 组件

| 导出 | 网络 |
|------|------|
| `EgMinerFeeBitcoinPanel` | Bitcoin（BTC · EVM 壳 `btc` variant） |
| `EgMinerFeeEthereumPanel` | Ethereum Mainnet（及同壳 EVM 资产，可传 `symbol`） |
| `EgMinerFeeTonPanel` | The Open Network（TON；同布局可传 `symbol` 给 XRP 等） |
| `EgMinerFeeTronPanel` | 波场（TRON） |

## 通用 props

| Prop | 说明 |
|------|------|
| `translate` | `(key: string) => string` · 业务 i18n |
| `hideInlineConfirm` | 隐藏面板内确定，由外层 Popup 工具栏承接 |

## 业务用法

```vue
<EgMinerFeeEthereumPanel
  :translate="ui"
  :hide-inline-confirm="hideInlineConfirm"
  @miner-fee-screen-change="onScreenChange"
  @confirm="onConfirm"
/>
```

`@confirm` 载荷：`{ displayValue: string }`；业务侧补上 `profileKind` 等上下文。

## Showcase

`/components/popovers-scene-gas-fee`（侧栏 Popovers → Scenes → **矿工费**）。
