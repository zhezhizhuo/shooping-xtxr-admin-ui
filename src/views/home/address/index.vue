<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="收货人姓名"   prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入收货人姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>


      <el-form-item label="省份" prop="provinceName">
        <el-input
          v-model="queryParams.provinceName"
          placeholder="请输入省份"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="市 " prop="citiyName">
        <el-input
          v-model="queryParams.citiyName"
          placeholder="请输入市 "
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="区 县" prop="areanName">
        <el-input
          v-model="queryParams.areanName"
          placeholder="请输入区 县"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="是否默认" prop="isDefault">
        <el-select v-model="queryParams.isDefault" placeholder="请选择是否默认" clearable>
          <el-option
            v-for="dict in dict.type.user_address"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['home:address:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['home:address:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['home:address:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['home:address:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="addressList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="归属用户ID"   align="center" prop="uid">
      </el-table-column>
      <el-table-column label="收货人姓名" align="center" prop="name" />
      <el-table-column label="地址"  align="center">
      <el-table-column label="省份" align="center" prop="provinceName" />
      <el-table-column label="省-行政代号" align="center" prop="provinceCode" />
      <el-table-column label="市 " align="center" prop="citiyName" />
      <el-table-column label="区 县" align="center" prop="areanName" />
      <el-table-column label="邮政编号" align="center" prop="zip" />
      <el-table-column label="地址详细" align="center" prop="address" />
      </el-table-column>
      <el-table-column label="收货号码" align="center" width="110" prop="phone" />

      <el-table-column label="标签" align="center" prop="tab" />
      <el-table-column label="是否默认" align="center" prop="isDefault">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.user_address" :value="scope.row.isDefault"/>
        </template>
      </el-table-column>
      <el-table-column label="创建" align="center" prop="createTime" width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="110" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['home:address:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['home:address:remove']"
          >删除</el-button>


        </template>

      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改地址管理对话框 -->
    <el-dialog :title="title"       :visible.sync="open" width="850px" append-to-body>
      <el-form ref="form"   label-position="right" inline :model="form" :rules="rules" label-width="120px">
        <el-form-item label="归属用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入归属用户ID" />
        </el-form-item>
        <el-form-item label="收货人姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入收货人姓名" />
        </el-form-item>
        <el-form-item label="省份" prop="provinceName">
          <el-input v-model="form.provinceName" placeholder="请输入省份" />
        </el-form-item>
        <el-form-item label="省-行政代号" prop="provinceCode">
          <el-input v-model="form.provinceCode" placeholder="请输入省-行政代号" />
        </el-form-item>
        <el-form-item label="市 " prop="citiyName">
          <el-input v-model="form.citiyName" placeholder="请输入市 " />
        </el-form-item>
        <el-form-item label="区 县" prop="areanName">
          <el-input v-model="form.areanName" placeholder="请输入区 县" />
        </el-form-item>
        <el-form-item label="邮政编号" prop="zip">
          <el-input v-model="form.zip" placeholder="请输入邮政编号" />
        </el-form-item>
        <el-form-item label="地址详细信息" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址详细信息" />
        </el-form-item>
        <el-form-item label="收货号码" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入收货号码" />
        </el-form-item>
        <el-form-item label="标签" prop="tab">
          <el-input v-model="form.tab" placeholder="请输入标签" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listAddress, getAddress, delAddress, addAddress, updateAddress } from "@/api/home/address";

export default {
  name: "Address",
  dicts: ['user_address'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 地址管理表格数据
      addressList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        provinceName: null,
        citiyName: null,
        areanName: null,
        isDefault: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询地址管理列表 */
    getList() {
      this.loading = true;
      listAddress(this.queryParams).then(response => {
        this.addressList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        uid: null,
        name: null,
        provinceName: null,
        provinceCode: null,
        citiyName: null,
        areanName: null,
        zip: null,
        address: null,
        phone: null,
        tab: null,
        isDefault: null,
        createTime: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加地址管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getAddress(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改地址管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateAddress(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAddress(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除地址管理编号为"' + ids + '"的数据项？').then(function() {
        return delAddress(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('address/address/export', {
        ...this.queryParams
      }, `address_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
