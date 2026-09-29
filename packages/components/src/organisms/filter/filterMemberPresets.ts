export type FilterMemberPreset = {
  id: string;
  label: string;
  name: string;
};

export type FilterWaasProjectPreset = {
  id: string;
  label: string;
  name: string;
};

export const FILTER_MEMBER_PICKER_HEIGHT = 360;

/** Filter 成员条件值演示列表（英文为主，少量中文）。 */
export const FILTER_MEMBER_PRESETS: FilterMemberPreset[] = [
  { id: 'member-alice-chen', label: 'Alice Chen', name: 'Alice Chen' },
  { id: 'member-bob-wilson', label: 'Bob Wilson', name: 'Bob Wilson' },
  { id: 'member-carol-smith', label: 'Carol Smith', name: 'Carol Smith' },
  { id: 'member-david-lee', label: 'David Lee', name: 'David Lee' },
  { id: 'member-emma-brown', label: 'Emma Brown', name: 'Emma Brown' },
  { id: 'member-frank-miller', label: 'Frank Miller', name: 'Frank Miller' },
  { id: 'member-grace-taylor', label: 'Grace Taylor', name: 'Grace Taylor' },
  { id: 'member-henry-white', label: 'Henry White', name: 'Henry White' },
  { id: 'member-ivy-martinez', label: 'Ivy Martinez', name: 'Ivy Martinez' },
  { id: 'member-james-anderson', label: 'James Anderson', name: 'James Anderson' },
  { id: 'member-kate-thompson', label: 'Kate Thompson', name: 'Kate Thompson' },
  { id: 'member-liam-obrien', label: "Liam O'Brien", name: "Liam O'Brien" },
  { id: 'member-mia-garcia', label: 'Mia Garcia', name: 'Mia Garcia' },
  { id: 'member-noah-kim', label: 'Noah Kim', name: 'Noah Kim' },
  { id: 'member-olivia-park', label: 'Olivia Park', name: 'Olivia Park' },
  { id: 'member-paul-rivera', label: 'Paul Rivera', name: 'Paul Rivera' },
  { id: 'member-quinn-foster', label: 'Quinn Foster', name: 'Quinn Foster' },
  { id: 'member-rachel-green', label: 'Rachel Green', name: 'Rachel Green' },
  { id: 'member-samuel-hayes', label: 'Samuel Hayes', name: 'Samuel Hayes' },
  { id: 'member-tara-brooks', label: 'Tara Brooks', name: 'Tara Brooks' },
  { id: 'member-uma-patel', label: 'Uma Patel', name: 'Uma Patel' },
  { id: 'member-victor-ng', label: 'Victor Ng', name: 'Victor Ng' },
  { id: 'member-wendy-liu', label: 'Wendy Liu', name: 'Wendy Liu' },
  { id: 'member-xavier-hall', label: 'Xavier Hall', name: 'Xavier Hall' },
  { id: 'member-yuki-tanaka', label: 'Yuki Tanaka', name: 'Yuki Tanaka' },
  { id: 'member-zoe-adams', label: 'Zoe Adams', name: 'Zoe Adams' },
  { id: 'member-zhang-san', label: '张三', name: '张三' },
  { id: 'member-li-na', label: '李娜', name: '李娜' },
];

/** Filter 成员选择器 WaaS 项目 Tab 演示列表。 */
export const FILTER_WAAS_PROJECT_PRESETS: FilterWaasProjectPreset[] = [
  { id: 'waas-project-doris-studio', label: 'Doris Studio', name: 'Doris Studio' },
  { id: 'waas-project-alpha-pay', label: 'Alpha Pay', name: 'Alpha Pay' },
  { id: 'waas-project-beta-wallet', label: 'Beta Wallet', name: 'Beta Wallet' },
  { id: 'waas-project-gamma-chain', label: 'Gamma Chain', name: 'Gamma Chain' },
  { id: 'waas-project-orion-hub', label: 'Orion Hub', name: 'Orion Hub' },
  { id: 'waas-project-nova-settle', label: 'Nova Settle', name: 'Nova Settle' },
  { id: 'waas-project-polaris-waas', label: 'Polaris WaaS', name: 'Polaris WaaS' },
  { id: 'waas-project-quantum-vault', label: 'Quantum Vault', name: 'Quantum Vault' },
  { id: 'waas-project-river-node', label: 'River Node', name: 'River Node' },
  { id: 'waas-project-summit-pay', label: 'Summit Pay', name: 'Summit Pay' },
  { id: 'waas-project-titan-ledger', label: 'Titan Ledger', name: 'Titan Ledger' },
  { id: 'waas-project-unity-custody', label: 'Unity Custody', name: 'Unity Custody' },
];

export const FILTER_MEMBER_OPTION_COUNT = FILTER_MEMBER_PRESETS.length;

type FilterMemberPickerPreset = FilterMemberPreset | FilterWaasProjectPreset;

function resolveFilterMemberPickerPresetById(
  id: string,
): FilterMemberPickerPreset | undefined {
  return (
    FILTER_MEMBER_PRESETS.find((option) => option.id === id)
    ?? FILTER_WAAS_PROJECT_PRESETS.find((option) => option.id === id)
  );
}

export function resolveFilterMemberPreset(value: string): FilterMemberPickerPreset | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const memberId = trimmed.split(',')[0]?.trim() ?? '';
  if (!memberId) return undefined;
  return resolveFilterMemberPickerPresetById(memberId);
}

export function isFilterWaasProjectPresetId(id: string): boolean {
  return id.startsWith('waas-project-');
}
