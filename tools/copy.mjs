// Landing draft: edit here, then run node tools/pages.mjs.
export const languages = 'English · 简体中文 · 繁體中文 · Español · Português · Français · Deutsch · Русский';
export const screens = ['01-entry', '02-ledger', '03-stats', '04-templates', '08-widgets'];
export const featureScreens = ['08-widgets', '04-templates', '03-stats', '05-accounts', '07-privacy'];
export const guideIds = ['templates', 'app-icon', 'widgets', 'keypad', 'reminder', 'sync', 'export', 'privacy'];
export const guideScreens = ['04-templates', null, '08-widgets', null, null, null, null, '07-privacy'];
export const copy = {
  en: {
    title: 'Drip – Expense Tracker for iPhone', guide: 'Guide', support: 'Support', language: '中文', privacy: 'Privacy Policy', brand: 'Drip', copyright: '© 2026 Xiaoyu Guan',
    h1: 'A clean, efficient expense tracker for iPhone.',
    sub: 'Log an expense in two taps. No account, no ads.',
    capsule: 'Coming soon to the App Store',
    captions: ['Enter an amount', 'See the month', 'Where it went', 'Templates for the usual', 'Log from the Home Screen'],
    features: [
      ['Log it from your Home Screen', 'Touch and hold the Drip icon to pick one of your first three templates, or tap a category in the Quick Categories widget. The entry opens already filled in. On the Lock Screen, Quick Add starts a new one.'],
      ['Templates for what you buy often', "Save the amount, category, account and note once. Next time it's one tap."],
      ['See where it goes', "The ledger groups entries by day, with the month's total on top. Stats show the trend and the split by category."],
      ['Accounts, neatly organized', 'Debit, credit and cash accounts, with transfers between them. A credit card counts as what you owe.'],
      ['Your data stays yours', 'No account, no ads, no servers. Your ledger is encrypted on your iPhone, and sync, if you turn it on, goes through your own iCloud. Lock Drip with Face ID, or export everything as a CSV file.'],
    ],
    setup: 'How to set it up', free: 'Free, for iPhone with iOS 26 or later.',
    contact: 'If you have a question or a problem, email xiaoyuguan@hotmail.com. I usually reply within a few days.',
    faq: [
      ['How do I sync between devices?', 'Turn on iCloud Sync in Settings › Privacy & Sync on each iPhone signed in to the same Apple Account. If Settings asks you to sign in, sign in to iCloud in the Settings app.'],
      ['How do I get my data out?', 'Go to Settings › Privacy & Sync › Export Data. All your entries are exported as a CSV file that you can share from the iOS share sheet.'],
      ['Can you see my data?', 'No. Your data stays on your iPhone (and in your own iCloud when sync is on). The developer runs no servers and has no access to it.'],
      ['How do I add widgets?', 'Touch and hold the Home Screen, tap Edit › Add Widget, then search for Drip.'],
    ],
    more: 'More in the Guide', guideTitle: 'Guide', guideDescription: 'Set up templates, the app icon menu, widgets and more.',
    items: [
      ['Templates', 'Open Settings › Templates and tap + to create one, then tap ✓ to save. Tap a template to edit it, or tap Edit and drag to reorder. To use one, tap the Templates button at the top of Ledger.'],
      ['App icon', 'Touch and hold the Drip app icon to choose New Entry or one of your first three templates. Reorder templates in Settings › Templates to change which ones appear.'],
      ['Widgets', 'Touch and hold the Home Screen, tap Edit › Add Widget, search for Drip, then choose Quick Categories or Quick Templates and tap Add Widget. Choose the categories in Settings › Category Widget. To add Quick Add to the Lock Screen, touch and hold the Lock Screen, tap Customize › Lock Screen › Add Widgets, then choose Drip’s Quick Add.'],
      ['Keypad Mode', 'Open Settings › Keypad Mode and choose Default or Efficient. Default uses a decimal point like a calculator; Efficient starts at the smallest currency unit, and 00 adds two zeros.'],
      ['Daily Reminder', 'Open Settings › Daily Reminder, turn on Daily Reminder and set Time. Turn on Skip If Already Recorded to skip reminders on days when you have already recorded an entry.'],
      ['iCloud Sync', null], ['Export Data', null],
      ['Lock Drip and hide amounts', 'Open Settings › Privacy & Sync and turn on Face ID Lock to lock Drip. Turn on Hide Amounts in Widgets to hide amounts in widgets.'],
    ],
  },
  'zh-Hans': {
    title: 'Drip – iPhone记账应用', guide: '指南', support: '帮助', language: 'English', privacy: '隐私政策', brand: 'Drip', copyright: '© 2026 Xiaoyu Guan',
    h1: '清爽、高效的iPhone记账应用',
    sub: '轻点两下，完成记账。无需注册，没有广告。', capsule: '即将登陆App Store',
    captions: ['输入金额', '按月查看', '钱花去哪', '常用模板', '在主屏幕记账'],
    features: [
      ['在主屏幕上记账', '长按Drip图标，可以直接选用前三个模板；也可以在「分类记账」小组件里点一个分类。打开时，内容已经填好。锁定屏幕上的「快速记账」可以直接开始记一笔。'],
      ['常买的东西，存成模板', '金额、分类、账户和备注存一次，下次点一下就好。'],
      ['看清钱花在哪', '明细按天分组，顶部是本月合计。统计页展示趋势和分类占比。'],
      ['账户管理，井井有条', '储蓄卡、信用卡和现金账户，可以互相转账。信用卡按欠款计算。'],
      ['数据只属于你', '无需注册，没有广告，也没有服务器。账本加密保存在你的iPhone上；开启同步后，只经过你自己的iCloud。还可以用面容ID锁定Drip，或把全部记录导出为CSV文件。'],
    ],
    setup: '设置方法', free: '免费，适用于iOS 26及以上的iPhone。',
    contact: '有问题或建议，请发邮件至xiaoyuguan@hotmail.com，我通常会在几天内回复。',
    faq: [
      ['如何在多台设备间同步？', '在登录同一Apple账户的每台iPhone上，打开 设置 › 隐私与同步 › iCloud同步。如果提示登录，请先在系统“设置”中登录iCloud。'],
      ['如何导出数据？', '前往 设置 › 隐私与同步 › 导出数据。所有记录会导出为CSV文件，可通过系统分享菜单发送。'],
      ['开发者能看到我的数据吗？', '不能。你的数据只保存在你的iPhone上（开启同步时也在你自己的iCloud中）。开发者没有任何服务器，也无法访问你的数据。'],
      ['如何添加小组件？', '长按主屏幕空白处，轻点 编辑 › 添加小组件，然后搜索Drip。'],
    ],
    more: '更多使用说明见指南', guideTitle: '使用指南', guideDescription: '模板、图标快捷菜单、小组件等功能的设置方法。',
    items: [
      ['模板', '打开 设置 › 模板，轻点 + 新建，再轻点 ✓ 保存。轻点模板可以编辑；轻点「编辑」后拖动可调整顺序。记账时，轻点明细页顶部的模板按钮即可使用。'],
      ['App图标', '长按Drip应用图标，选择「记一笔」或前三个模板之一。在 设置 › 模板 中调整顺序，可以更换显示的模板。'],
      ['小组件', '长按主屏幕空白处，轻点 编辑 › 添加小组件，搜索Drip，选择「分类记账」或「模板记账」，然后轻点「添加小组件」。在 设置 › 分类小组件 中选择分类。要在锁定屏幕添加「快速记账」，长按锁定屏幕，轻点 自定 › 锁定屏幕 › 添加小组件，然后选择Drip的「快速记账」。'],
      ['键盘模式', '打开 设置 › 键盘模式，选择「默认」或「效率」。「默认」像计算器一样输入小数点；「效率」从货币的最小单位开始输入，00可补两个零。'],
      ['记账提醒', '打开 设置 › 记账提醒，开启「记账提醒」并设置「时间」。开启「当天已记账则跳过」，当天已有记录时就不会提醒。'],
      ['iCloud同步', null], ['导出数据', null],
      ['锁定Drip，隐藏金额', '打开 设置 › 隐私与同步，开启「面容ID锁定」以锁定Drip。开启「小组件隐藏金额」可隐藏小组件中的金额。'],
    ],
  },
};
for (const c of Object.values(copy)) { c.items[5][1] = c.faq[0][1]; c.items[6][1] = c.faq[1][1]; }
