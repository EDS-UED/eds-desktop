/** 与 showcaseLocaleRegional.ts 同步 — 供 prefill 脚本使用 */

const SIMPLIFIED_TO_TRADITIONAL = {
  输入: '輸入', 输出: '輸出', 图标: '圖標', 头像: '頭像', 分割线: '分割線', 按钮: '按鈕',
  文本: '文字', 金额: '金額', 粘贴: '貼上', 占位符: '佔位符', 禁用: '停用', 只读: '唯讀',
  单位: '單位', 场景化: '場景化', 浮层: '浮層', 导航: '導航', 模块: '模組', 菜单: '選單',
  数据: '資料', 列表: '清單', 分页: '分頁', 筛选: '篩選', 详情: '詳情', 验证: '驗證',
  加载: '載入', 进度: '進度', 上传: '上傳', 通知: '通知', 状态: '狀態', 反馈: '回饋',
  标记: '標記', 切换: '切換', 触发: '觸發', 选择: '選擇', 复选: '複選', 单选: '單選',
  开关: '開關', 对话框: '對話框', 弹窗: '彈窗', 容器: '容器', 布局: '版面', 复制: '複製',
  预览: '預覽', 代码: '程式碼', 定制: '定制', 扩展: '擴展', 交付: '交付', 说明: '說明',
  名称: '名稱', 类型: '類型', 尺寸: '尺寸', 宽度: '寬度', 高度: '高度', 圆角: '圓角',
  地址: '地址', 内部: '內部', 最近: '最近', 交易: '交易', 刷新: '重新整理', 组件: '元件',
  搜索: '搜尋', 清空: '清空', 占位: '佔位', 场景: '場景', 安全: '安全', 动画: '動畫',
  业务: '業務', 处理: '處理', 密码: '密碼', 账户: '帳戶', 锁定: '鎖定', 表单: '表單',
  模板: '範本', 组织: '組織', 备注: '備註', 矿工费: '礦工費', 引导: '引導', 交互: '互動',
  自适应: '自適應', 固定: '固定', 全宽: '全寬', 标题: '標題', 标签: '標籤', 层: '層',
  本体: '本體', 统计: '統計', 选中: '選取', 工具栏: '工具列', 批处理: '批次處理',
  助记词: '助記詞', 校验: '校驗', 空态: '空狀態', 用户: '使用者', 机器人: '機器人',
  加密货币: '加密貨幣', 元数据: '中繼資料', 流式: '串流', 倒计时: '倒數計時',
  标准组合: '標準組合', 验证码: '驗證碼', 搜索框: '搜尋框', 二次确认: '二次確認',
  字段溢出: '欄位溢出', 段落溢出: '段落溢出', 请输入: '請輸入', 占位文案: '佔位文案',
  定制: '自訂', 设计令牌: '設計權杖', 工作流: '工作流程', 模式: '模式',
  组件: '元件', 动画: '動畫', 深色: '深色', 浅色: '淺色', 语言: '語言',
  全球基础: '全球基礎', 大中华区: '大中華區', 东亚: '東亞', 东南亚: '東南亞',
  欧洲: '歐洲', 中东: '中東', 南亚: '南亞', 拉丁美洲: '拉丁美洲',
};

const ZH_TW_OVERRIDES = {
  软件: '軟體', 程序: '程式', 程序码: '程式碼', 网络: '網路', 屏幕: '螢幕', 鼠标: '滑鼠',
  信息: '資訊', 内存: '記憶體', 硬盘: '硬碟', 光标: '游標', 默认: '預設', 视频: '視訊',
};

const ZH_HK_OVERRIDES = {
  软件: '軟件', 程序: '程式', 程序码: '程式碼', 网络: '網絡', 屏幕: '屏幕', 鼠标: '滑鼠',
  信息: '資訊', 内存: '記憶體', 硬盘: '硬碟', 光标: '游標', 默认: '預設', 视频: '視頻',
  服务器: '伺服器', 链接: '連結', 程序: '程式', 数据: '數據', 定制: '自訂', 语言: '語言',
  设计令牌: '設計權杖', 组件: '元件', 动画: '動畫',
};

const ES_419_RULES = [
  [/\bordenador\b/gi, 'computadora'],
  [/\bteléfono móvil\b/gi, 'celular'],
  [/\bmóvil\b/gi, 'celular'],
  [/\bpulsar\b/gi, 'presionar'],
];

const PT_BR_RULES = [
  [/\brato\b/gi, 'mouse'],
  [/\becr[ãa]\b/gi, 'tela'],
  [/\btelemóvel\b/gi, 'celular'],
  [/\butilizador\b/gi, 'usuário'],
  [/\bdefinições\b/gi, 'configurações'],
  [/\bficheiro\b/gi, 'arquivo'],
];

function applyPhraseMap(text, map) {
  let result = text;
  for (const phrase of Object.keys(map).sort((a, b) => b.length - a.length)) {
    result = result.split(phrase).join(map[phrase]);
  }
  return result;
}

function applyRegexRules(text, rules) {
  let result = text;
  for (const [pattern, replacement] of rules) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

export function toZhHant(text) {
  return applyPhraseMap(text, SIMPLIFIED_TO_TRADITIONAL);
}

export function toZhHantTW(zhCN) {
  return applyPhraseMap(toZhHant(zhCN), ZH_TW_OVERRIDES);
}

export function toZhHantHK(zhCN) {
  return applyPhraseMap(toZhHant(zhCN), ZH_HK_OVERRIDES);
}

export function adaptEs419(text) {
  return applyRegexRules(text, ES_419_RULES);
}

export function adaptPtBR(text) {
  return applyRegexRules(text, PT_BR_RULES);
}

export function applyRegionalAdaptation(locale, text, options = {}) {
  if (locale === 'zh-TW') return toZhHantTW(text);
  if (locale === 'zh-HK') return toZhHantHK(text);
  if (locale === 'es-419') return adaptEs419(options.esEsBase ?? text);
  if (locale === 'pt-BR') return adaptPtBR(text);
  return text;
}
