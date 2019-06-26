<template>
  <div class="hello">
    <div>
      <el-button
        type="primary"
        size="mini"
        style="margin:30px auto;"
        @click="handleDownloadData"
      >导出</el-button>
      <el-table
        :data="tableData"
        stripe
      >
        <el-table-column
          prop="date"
          label="日期"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          width="190"
        >
        </el-table-column>

        <el-table-column
          label="个人信息"
          align="center"
        >
          <el-table-column
            prop="num"
            label="工号"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="height"
            label="身高"
            align="center"
          >
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02 18:30:10',
          name: '王小',
          address: '上海市普陀区金沙江路 1510 弄',
          num: 432879147934792374823,
          height: '180cm'
        },
        {
          date: '2016/05/04 18:30:20',
          name: '李小虎',
          address: '上海市普陀区金沙江路 1511 弄',
          num: 432879147934792374823,
          height: '180cm'
        },
        {
          date: '2016-05-01',
          name: '孙小虎',
          address: '上海市普陀区金沙江路 1512 弄',
          num: 432879147934792374823,
          height: '180cm'
        },
        {
          date: '2016-05-02',
          name: '朱小虎',
          address: '上海市普陀区金沙江路 1513 弄',
          num: 432879147934792374823,
          height: '180cm'
        },
        {
          date: '2016-05-04',
          name: '钱小虎',
          address: '上海市普陀区金沙江路 1514 弄',
          num: 432879147934792374823,
          height: '180cm'
        },
        {
          date: '2016-05-01',
          name: '杜小虎',
          address: '上海市普陀区金沙江路 1515 弄',
          num: 432879147934792374823,
          height: '180cm'
        },
        {
          date: '2016-05-03',
          name: '赵小虎',
          address: '上海市普陀区金沙江路 1516 弄',
          num: 432879147934792374823,
          height: '180cm'
        }],
      tableTitleData: [
        {
          label: '日期',
          prop: 'date'
        },
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '地址',
          prop: 'address'
        },
        {
          label: '工号',
          prop: 'num'
        },
        {
          label: '身高',
          prop: 'height'
        }
      ],
      exportSheets:[],  //导出的表格格式,元素属性有titleData,sheetName,sheetData
      exportExcelName:"excel表",  //导出的excel表名称
    }
  },
  methods: {
    handleDownloadData() {
      let columnData = this.dealData(this.tableTitleData)
      require.ensure([], () => {
        const { export_json_to_excel } = require('@/vendor/Export2Excel')
        const filterVal = columnData.filterVal
        const tHeader = columnData.tHeader

        const data = this.formatJson(filterVal, this.tableData)
        //生成多个tab
        this.exportSheets.push({
          titleData:tHeader,
          sheetData:JSON.parse(JSON.stringify(data)),
          sheetName:"sheet1"
        },{
          titleData:tHeader,
          sheetData:JSON.parse(JSON.stringify(data)),
          sheetName:"sheet2"
        })
        export_json_to_excel(this.exportSheets, this.exportExcelName)
      })
    },
    formatJson(filterVal, jsonData) {
      //如果表头超过2行还要做进一步处理
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    dealData(tableTitleData){
      var tHeader = []
      var filterVal = []
      //如果表头超过1行需要做进一步处理
      for (var i = 0; i < tableTitleData.length; i++) {
        tHeader[i] = tableTitleData[i].label
        filterVal[i] = tableTitleData[i].prop
      }
      return {
        tHeader:tHeader,
        filterVal:filterVal
      }
    }
  }
}
</script>