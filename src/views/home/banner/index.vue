<template>
  <div class="app-container">
    <div id="banner">
      <el-carousel :interval="4000" type="card" height="250px">
        <el-carousel-item v-for="item in bannerList" :key="item.id">
          <img  style="    width: 100%;" class="medium img" :src="item.imgurl"/>

        </el-carousel-item>
      </el-carousel>
    </div>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['home:banner:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['home:banner:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['home:banner:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['home:banner:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="bannerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="分类ID" align="center" prop="pid"/>
      <el-table-column label="跳转地址" align="center" prop="hrefurl"/>
      <el-table-column label="排序" align="center" prop="sort"/>
      <el-table-column label="图片地址" align="center" prop="imgurl" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.imgurl" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['home:banner:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['home:banner:remove']"
          >删除
          </el-button>
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

    <!-- 添加或修改主页轮播对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商品ID" prop="pid">
          <el-input v-model="form.pid" placeholder="请输入商品ID"/>
        </el-form-item>
        <el-form-item label="跳转地址" prop="hrefurl">
          <el-input v-model="form.hrefurl" placeholder="请输入跳转地址"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序"/>
        </el-form-item>
        <el-form-item label="图片地址">
          <image-upload :limit="limit" v-model="form.imgurl"/>
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
import {listBanner, getBanner, delBanner, addBanner, updateBanner} from "@/api/home/banner";

export default {
  name: "Banner",
  data() {
    return {
      limit: 1,
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
      // 主页轮播表格数据
      bannerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        pid: [
          {required: true, message: "商品ID不能为空", trigger: "blur"}
        ],
        hrefurl: [
          {required: true, message: "跳转地址不能为空", trigger: "blur"}
        ],
        sort: [
          {required: true, message: "序号不能为空", trigger: "blur"}
        ],
        imgurl: [
          {required: true, message: "图片地址不能为空", trigger: "blur"}
        ],
        createTime: [
          {required: true, message: "创建时间不能为空", trigger: "blur"}
        ]
    }
  };
}
,
created()
{
  this.getList();
}
,
methods: {
  /** 查询主页轮播列表 */
  getList()
  {
    this.loading = true;
    this.bannerList = [];
    listBanner(this.queryParams).then(response => {
      this.bannerList = response.rows;
      this.total = response.total;
      this.loading = false;
    });
  }
,
  // 取消按钮
  cancel()
  {
    this.open = false;
    this.reset();
  }
,
  // 表单重置
  reset()
  {
    this.form = {
      id: null,
      pid: null,
      hrefurl: null,
      sort: null,
      imgurl: null,
      createTime: null
    };
    this.resetForm("form");
  }
,
  /** 搜索按钮操作 */
  handleQuery()
  {
    this.queryParams.pageNum = 1;
    this.getList();
  }
,
  /** 重置按钮操作 */
  resetQuery()
  {
    this.resetForm("queryForm");
    this.handleQuery();
  }
,
  // 多选框选中数据
  handleSelectionChange(selection)
  {
    this.ids = selection.map(item => item.id)
    this.single = selection.length !== 1
    this.multiple = !selection.length
  }
,
  /** 新增按钮操作 */
  handleAdd()
  {
    this.reset();
    this.open = true;
    this.title = "添加主页轮播";
  }
,
  /** 修改按钮操作 */
  handleUpdate(row)
  {
    this.reset();
    const id = row.id || this.ids
    getBanner(id).then(response => {
      this.form = response.data;
      this.open = true;
      this.title = "修改主页轮播";
    });
  }
,
  /** 提交按钮 */
  submitForm()
  {
    this.$refs["form"].validate(valid => {
      if (valid) {
        if (this.form.id != null) {
          updateBanner(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
        } else {
          addBanner(this.form).then(response => {
            this.$modal.msgSuccess("新增成功");
            this.open = false;
            this.getList();
          });
        }
      }
    });
  }
,
  /** 删除按钮操作 */
  handleDelete(row)
  {
    const ids = row.id || this.ids;
    this.$modal.confirm('是否确认删除主页轮播编号为"' + ids + '"的数据项？').then(function () {
      return delBanner(ids);
    }).then(() => {
      this.getList();
      this.$modal.msgSuccess("删除成功");
    }).catch(() => {
    });
  }
,
  /** 导出按钮操作 */
  handleExport()
  {
    this.download('banner/banner/export', {
      ...this.queryParams
    }, `banner_${new Date().getTime()}.xlsx`)
  }
}
}
;
</script>

<style>

.img {
  height: 100%;
  width: 100%;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 14px;
  object-fit: contain;
  background-size: cover;
}
</style>
