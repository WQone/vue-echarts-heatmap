<template>
  <el-date-picker v-model="value" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" @change="getDate">
    4444444444
  </el-date-picker>
</template>

<script>
import freeDate from './freeDate';

export default {
  mounted() {
    // for (let i = 0; i < freeDate.length; i += 1) {
    //   const item = freeDate[i];
    //   this.$set(this.picker.shortcuts, [i], {
    //     text: item.name,
    //     onClick(picker) {
    //       const end = new Date();
    //       const start = new Date();
    //       start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
    //       picker.$emit('pick', [start, end]);
    //     },
    //   });
    // }
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
      value: '',
    };
  },
  props: {
    title: String,
  },
  methods: {
    getDate(val) {
      if (!val) {
        return;
      }
      const arr = [];
      arr[0] = this.convert.convertDate(val[0], 1);
      arr[1] = this.convert.convertDate(val[1], 1);
      this.$emit('selectValue', arr);
    },
  },
};
</script>
<style>
.map-date input {
  font-size: 11px;
}
.el-range-editor .el-range-input {
  font-size: 13px;
}
.map-date .el-input__inner {
  width: 340px !important;
  height: 35px;
  line-height: 35px;
  padding-right: 0px;
}
.el-date-range-picker__header div {
  font-size: 13px;
}
.el-date-range-picker__content {
  padding: 5px;
}
.el-date-editor .el-range__icon {
  line-height: 27px;
}
.el-date-editor .el-range-separator {
  line-height: 27px;
  padding: 0 2px;
}
.el-range__close-icon {
  line-height: 27px !important;
}
.el-picker-panel__sidebar {
  width: 75px;
}
.el-picker-panel__shortcut {
  font-size: 11px;
}
.el-picker-panel__body {
  margin-left: 75px !important;
  width: 445px;
  min-width: 430px !important;
}
.el-date-range-picker.has-sidebar {
  width: 525px;
}
.el-picker-panel__footer {
  padding: 2px;
}
.el-date-table {
  font-size: 11px;
}
.el-date-table td {
  padding: 1px 0;
}
.el-date-table th {
  padding: 1px;
}
.el-date-range-picker__time-header {
  padding: 4px 2px;
}
.el-input--small .el-input__inner {
  height: 28px;
  line-height: 28px;
  font-size: 12px;
  padding: 0 10px;
}
</style>

