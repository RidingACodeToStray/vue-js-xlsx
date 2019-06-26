/* eslint-disable */
require('./Blob');
require('script-loader!file-saver');
require('script-loader!xlsx/dist/xlsx.core.min');

function datenum(v, date1904) {
  if (date1904) v += 1462;
  var epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
  var ws = {};
  var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
  for (var R = 0; R != data.length; ++R) {
    for (var C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;
      var cell = { v: data[R][C] };
      if (cell.v == null) continue;
      var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

      if (typeof cell.v === 'number') cell.t = 'n';
      else if (typeof cell.v === 'boolean') cell.t = 'b';
      else if (cell.v instanceof Date) {
        cell.t = 'n';
        cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      }
      else cell.t = 's';

      ws[cell_ref] = cell;
    }
  }
  if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
  return ws;
}

function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook();
  this.SheetNames = [];
  this.Sheets = {};
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}
//设置列宽
function setColWidth(data){
  /*设置worksheet每列的最大宽度*/
  const colWidth = data.map(row => row.map(val => {
    /*先判断是否为null/undefined*/
    if (val == null) {
      return { 'wch': 10 };
    }
    /*再判断是否为中文*/
    else if (val.toString().charCodeAt(0) > 255) {
      return { 'wch': val.toString().length * 2 + 5 };
    } else {
      return { 'wch': val.toString().length + 5 };
    }
  }))
/*以第一行为初始值*/    let result = colWidth[0];
  for (let i = 1; i < colWidth.length; i++) {
    for (let j = 0; j < colWidth[i].length; j++) {
      if (result[j]['wch'] < colWidth[i][j]['wch']) {
        result[j]['wch'] = colWidth[i][j]['wch'];
      }
    }
  }
  return result;
}

export function export_json_to_excel(exportSheets, defaultTitle) {
  var wb = new Workbook();
  for(let val of exportSheets){
    let ws_name = val.sheetName;  //表名
    let sheet = val.sheetData;
    sheet.unshift(val.titleData);  //表内容
    let ws = sheet_from_array_of_arrays(sheet);
    XLSX.utils.sheet_to_json(ws,{raw:true})
    console.log(ws)
    ws['!cols'] = setColWidth(sheet);  //设置表宽
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
  }
  console.log(100,wb)
  var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });
  var title = defaultTitle || '列表'
  saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), title + ".xlsx")
}