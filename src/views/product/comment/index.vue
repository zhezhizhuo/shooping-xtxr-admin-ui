<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">


      <el-form-item label="评论标签" prop="tabs">
        <el-input
          v-model="queryParams.tabs"
          placeholder="请输入评论标签"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="评论状态 " prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择评论状态 " clearable>
          <el-option
            v-for="dict in dict.type.product_comment"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="评分" prop="score">
        <el-input
          v-model="queryParams.score"
          placeholder="请输入评分"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="评论时间" prop="createTime">
        <el-date-picker clearable
                        v-model="queryParams.createTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择评论时间">
        </el-date-picker>
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
          v-hasPermi="['product:comment:add']"
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
          v-hasPermi="['product:comment:edit']"
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
          v-hasPermi="['product:comment:remove']"
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
          v-hasPermi="['product:comment:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading"
              :data="commentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="商品名称" align="center" prop="productName"/>
      <el-table-column label="评论人" align="center" prop="userName"/>
      <el-table-column label="评论标签" align="center" prop="tabs"/>
      <el-table-column label="评论内容"  width="300" align="center" prop="content">
        <template slot-scope="scope">

           <div  class="itemsssss" v-html="scope.row.content"></div>
        </template>
      </el-table-column>
      <el-table-column label="评论状态 " align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.product_comment" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="评分" sortable align="center" prop="score">
        <template slot-scope="scope">
          <el-rate
            v-model="scope.row.score"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}">
          </el-rate>
        </template>
      </el-table-column>
      <el-table-column label="点赞数" sortable align="center" prop="praiseCount"/>
      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['product:comment:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['product:comment:remove']"
          >删除
          </el-button>
          <el-button
            v-if="scope.row.status == 0"
            size="mini"
            type="text"
            icon="el-icon-check"
            @click="handleCommentStatus(scope.row)"
            v-hasPermi="['product:comment:remove']"
          >通过审核
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

    <!-- 添加或修改评论表 用户评论对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商品ID" prop="pId">
          <el-input v-model="form.pId" disabled placeholder="请输入商品ID"/>
        </el-form-item>
        <el-form-item label="用户ID" prop="uId">
          <el-input v-model="form.uId"disabled  placeholder="请输入用户ID"/>
        </el-form-item>
        <el-form-item label="评论标签" prop="tabs">
          <el-input v-model="form.tabs" placeholder="请输入评论标签"/>
        </el-form-item>
        <el-form-item label="评论内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="评论状态 " prop="status">
          <el-select v-model="form.status" placeholder="请选择评论状态 ">
            <el-option
              v-for="dict in dict.type.product_comment"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评分" prop="score">
          <el-input v-model="form.score" disabled placeholder="请输入评分"/>
        </el-form-item>
        <el-form-item label="点赞人数" prop="praiseCount">
          <el-input v-model="form.praiseCount"     placeholder="请输入喜欢人数"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style  >

.itemsssss img{
  width: 50px;
  height: 50px;
}
</style>

<script>
import {listComment, getComment, delComment, addComment, updateComment} from "@/api/product/comment/comment";

export default {
  name: "Comment",
  dicts: ['product_comment'],
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
      // 评论表 用户评论表格数据
      commentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        pId: null,
        uId: null,
        tabs: null,
        content: null,
        status: null,
        score: null,
        createTime: null,
        praiseCount: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          {required: true, message: "父评论不能为空", trigger: "blur"}
        ],
        pId: [
          {required: true, message: "商品ID不能为空", trigger: "blur"}
        ],
        uId: [
          {required: true, message: "用户ID不能为空", trigger: "blur"}
        ],
        tabs: [
          {required: true, message: "评论标签不能为空", trigger: "blur"}
        ],
        content: [
          {required: true, message: "评论内容不能为空", trigger: "blur"}
        ],
        status: [
          {required: true, message: "评论状态 不能为空", trigger: "change"}
        ],
        createTime: [
          {required: true, message: "评论时间不能为空", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询评论表 用户评论列表 */
    getList() {
      this.loading = true;
      listComment(this.queryParams).then(response => {
        this.commentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    }, handleSort(column) {
      alert(column);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        comId: null,
        parentId: null,
        pId: null,
        uId: null,
        tabs: null,
        content: null,
        status: null,
        score: null,
        createTime: null,
        praiseCount: null
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
      this.ids = selection.map(item => item.comId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加评论表 用户评论";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const comId = row.comId || this.ids
      getComment(comId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改评论表 用户评论";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.comId != null) {
            updateComment(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addComment(this.form).then(response => {
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
      const comIds = row.comId || this.ids;
      this.$modal.confirm('是否确认删除评论表 用户评论编号为"' + comIds + '"的数据项？').then(function () {
        return delComment(comIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    }, /** 删除按钮操作 */
    handleCommentStatus(row) {
      const comIds = row.comId || this.ids;
      this.$modal.confirm('是否确认通过该评论？').then(function () {
        //修改数据
        row.status = 1;
        return updateComment(row)
      }).then(()=>{
        this.getList();
        this.$modal.msgSuccess("通过成功");
      }).catch(()=>{

      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('product/comment/export', {
        ...this.queryParams
      }, `comment_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
