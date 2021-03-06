export default {
  created () {
    this.request()
  },
  methods: {
    /**
     * 触发配置中所有设置了事件的属性,并会传入两个参数到事件当中
     * @param  {object} config  CRUD中该属性的配置信息
     * @param  {string} key    该属性的名称
     */
    fnForeach: function () {
      let data = this.config.data
      for (var k in data) {
        if (Array.isArray(data[k].dictionary)) {
          this[data[k].dictionary[0]](data[k], k)
        } else if (typeof data[k].dictionary === 'string') this[data[k].dictionary](data[k], k)
      }
    },
    /**
     * 下拉菜单字典转换
     * @param  {object} config  CRUD中该属性的配置信息
     * @param  {string} key    该属性的名称
     */
    selectList: function (config, key) {
      this.$http.get(config.dictionary[1]).then(response => {
        let result = response.data
        if (result.rtnCode === 200) {
          let data = result.data.paginationList !== undefined ? result.data.paginationList : result.data
          let dataList = data.map(val => {
            return {
              value: val.id,
              label: val[config.dictionary[2]]
            }
          })
          this.$set(this.dictionary, key, dataList)
        }
      })
    },
    /**
     * 一般字段字典转换
     * @param  {object} config  CRUD中该属性的配置信息
     * @param  {string} key    该属性的名称
     */
    fieldChange: function (config, key) {
      this.$http.get(config.dictionary[1]).then(response => {
        let result = response.data
        if (result.rtnCode === 200) {
          let data = result.data.paginationList !== undefined ? result.data.paginationList : result.data
          let fields = {}
          data.forEach(val => {
            fields[val.id] = val[config.dictionary[2]]
          })
          // this.$set(this.dictionary, key, fields)
          for (var k in this.dataset) {
            this.$set(this.dataset[k], key, fields[this.dataset[k][config.dictionary[3]]])
          }
        }
      })
    },
    /**
     * 一般字段字典本地转换
     * @param  {object} config  CRUD中该属性的配置信息
     * @param  {string} key    该属性的名称
     */
    fieldChangeLocal: function (config, key) {
      let dataList
      switch (key) {
        case 'showTitle':
          dataList = [
            {label: '开启', value: 1},
            {label: '关闭', value: 0}
          ]
          break
        case 'winProperty':
          dataList = [
            {label: '窗口模式', value: 'small'},
            {label: '全屏模式', value: 'full'}
          ]
          break
        case 'status':
          dataList = [
            {label: '未开始', value: 1},
            {label: '进行中', value: 2},
            {label: '完成', value: 3}
          ]
          break
        case 'problemType':
          dataList = [
            {label: '积水点', value: 1},
            {label: '隐患', value: 2},
            {label: '违章', value: 3}
          ]
          break
      }
      this.$set(this.dictionary, key, dataList)
    },
    /**
     * 配置信息与数据匹配检测
     * @param  {object} configData 配置信息
     * @param  {object} data       后端数据
     */
    configVerify: function (configData, data) {
      for (var k in configData) {
        if (data[k] === undefined) this.$message.error(`没有找到与 ${k} 配置对应的数据,请检查配置信息是否正确!`)
      }
    }
  },
  watch: {
    tempStatus: function () { // 监控其它组件事件触发更新请求
      this.request()
    },
    'config': function () {
      this.request()
    }
  }
}
