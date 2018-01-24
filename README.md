# trunk-export-csv-excel

## 使用套件
- 匯出 excel [csv-stringify](http://csv.adaltas.com/stringify/examples/)
- 匯出 csv [Node-Excel-Export](https://github.com/functionscope/Node-Excel-Export)

## sample

```javascript
let exportHelper = new ExportHelper({
  CSV: '/Users/trunk',
  EXCEL: '/Users/trunk',
});

// 基本使用
匯出 excel
await exportHelper.excel({
  columns: [
    { caption: '字串', type: 'string' },
    { caption: '電話', type: 'string' },
    { 
      caption: '身分證',
      type: 'string',
      beforeCellWrite: (row, cellData) => cellData.replace(/.{4}$/, '***')
    }
  ],
  data: [
    ['王小明', '09000000001', 'Y123456789'],
    ['王小華', '09000000002', 'Y2987654321'],
  ]
});

匯出 csv
await exportHelper.csv({
   columns: [
    { caption: '字串', type: 'string' },
    { caption: '電話', type: 'string' },
    { 
      caption: '身分證',
      type: 'string',
      beforeCellWrite: (row, cellData) => cellData.replace(/.{4}$/, '***')
    }
  ],
  data: [
    ["王小明", "09000000001", "Y123456789"],
    ["王小華", "09000000002", "Y2987654321"],
  ]
});

await exportHelper.csv({
  data: [
    ["王小明", "09000000001", "Y123456789"],
    ["王小華", "09000000002", "Y2987654321"],
  ]
});
```

```
npm install trunk-export-csv-excel
```

## Dev

複製 config/default.js > config/test.js
```
module.exports = {
    ENV: 'test',
    EXPORT_PATH: {
        EXCEL: '/Users/trunk',
        CSV: '/Users/trunk',
    }
};
```

使用 `npm test` 測試開發

## License

MIT
