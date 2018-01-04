<template>
	<div>
	    <el-select v-model="value" filterable placeholder="请选择接口" size="small" @change="handleApiChange(value)">
	      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
	      </el-option>
	    </el-select>
	    <el-button type="primary" v-on:click="getApiDataInfo" size="small">查询</el-button>
		<br/>
	    <br/>
	    <el-row>
	    	<el-col :span="12">
			    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				    :current-page="currentPage"
				    :page-sizes="[10, 20, 50, 100, 500, 800, 2000]"
				    :page-size="pagesize"
				    layout="total, sizes, prev, pager, next, jumper"
				    :total="tableData.length">
				</el-pagination>
			</el-col>
			<el-col :span="1" :offset="10">
		    	<el-button type="primary" size="small" @click="exportData(1)"><Icon type="ios-download-outline"></Icon> 导出数据 </el-button>
		    </el-col>	
	    </el-row>
	    <Table border stripe show-header :columns="tableColumnData" :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
	     ref="table"></Table>
	    <br/>


	    <el-dialog title="编辑测试数据" :visible.sync="editFormVisible" class="demo-dynamic">
		  <el-form :model="dynamicEditForm" label-width="100px">
		    <el-form-item v-for="item in tableColumnDataWithOutEdit" :label="item.title" :key="item.key">
		      <el-input :value=editItems[item.key] auto-complete="off"></el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="editFormVisible = false">取 消</el-button>
		    <el-button type="primary" @click="editFormVisible = false">保 存</el-button>
		  </div>
		</el-dialog>
    </div>
</template>

<script>
import { getApiList,getApiParameterDataInfo } from '../../api/api';
import axios from 'axios';

  export default {
    data() {
      return {
      	currentApiId: '',
      	tableColumnData: [],
      	tableColumnDataWithOutEdit: [],
        tableData: [],
        options: [],
        value: '',
        currentPage: 1,
        pagesize: 20,
        loading: false,
        editFormVisible: false,
        editItems: {},
        dynamicEditForm:{}
      }
    },
    methods: {
      handleEdit(index, row) {
      	this.editItems = row;
      	this.editFormVisible = true;
      },
      handleDelete(index, row) {
      	this.$confirm('此操作将删除第'+(index+1)+'条测试数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableData.splice(index, 1);	
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      handleApiChange(value){
      },
      handleSizeChange: function (size) {
        this.pagesize = size;
	  },
	  handleCurrentChange: function(currentPage){
	    this.currentPage = currentPage;
	  },
	  exportData (type) {
	  	this.$refs.table.exportCsv({
            filename: 'Data'
        });
	  },
      getApiInfo() {
		getApiList().then((res) => {
			this.options = res.data;
	 	});
	  },
	  getApiDataInfo(){
	  	this.loading = true;
	  	getApiParameterDataInfo({apiId:this.value}).then((res) => {
	  		this.currentApiId = this.value;
	  		var [...columns] = res.data.parameterName;
	  		this.tableColumnDataWithOutEdit = columns;
	  		this.tableColumnData = res.data.parameterName;
	  		this.tableData = res.data.parameterData;
	  		this.loading = false;

	  		//add the operation column
	  		let buttons = {
                title: '操作',
                key: 'action',
                width: 140,
                align: 'center',
                render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.handleEdit(params.index,params.row)
                                }
                            }
                        }, '编辑'),
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    this.handleDelete(params.index)
                                }
                            }
                        }, '删除')
                    ]);
                }
            };
	  		this.tableColumnData.push(buttons);

	  		//add the index Column
	  		var indexColumn = {
                type: 'index',
                width: 60,
                align: 'center'
	  		};
	  		this.tableColumnData.splice(0, 0, indexColumn);
	 	});
	  }
    },
    mounted: function () {
    	this.getApiInfo();
    }
  }
</script>
